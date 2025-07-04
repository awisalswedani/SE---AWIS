<?php

namespace App\Services;

use App\Enums\SessionKey;
use App\Traits\CalculatorTrait;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

class CartService
{
    use CalculatorTrait;

    /**
     * @param object $request
     * @param object $product
     * @param string|null $colorName
     * @return array
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function getVariantData(object $request, object $product, string $colorName = null): array
    {
        $quantity = 0;
        $price = 0;
        $unitPrice = 0;
        $discount = 0;
        $tax = 0;
        $variation = $this->makeVariation(
            request: $request,
            colorName: $colorName,
            choiceOptions: json_decode($product['choice_options'])
        );

        if ($variation != null) {
            $count = count(json_decode($product->variation));
            for ($i = 0; $i < $count; $i++) {
                if (json_decode($product->variation)[$i]->type == $variation) {
                    $discount = getProductPriceByType(product: $product, type: 'discounted_amount', result: 'value', price: json_decode($product->variation)[$i]->price, from: 'panel');
                    $tax = $product->tax_model == 'exclude' ? $this->getTaxAmount(price: json_decode($product->variation)[$i]->price, tax: $product['tax']) : 0;
                    $price = json_decode($product->variation)[$i]->price - $discount + $tax;
                    $unitPrice = json_decode($product->variation)[$i]->price;
                    $quantity = json_decode($product->variation)[$i]->qty;
                }
            }
        } else {
            $discount = getProductPriceByType(product: $product, type: 'discounted_amount', result: 'value', price: $product['unit_price'], from: 'panel');
            $tax = $product->tax_model == 'exclude' ? $this->getTaxAmount(price: $product->unit_price, tax: $product['tax']) : 0;
            $price = $product['unit_price'] - $discount + $tax;
            $unitPrice = $product['unit_price'];
            $quantity = $product['current_stock'];
        }

        $requestQuantity = (int)$request['quantity'];

        $inCartStatus = 0;
        $cartData = session(SessionKey::CURRENT_USER) ? session()->get(session(SessionKey::CURRENT_USER)) : [];
        if (is_null($cartData)) {
            $cartData = [];
        }
        $inCartData = null;

        if ($product['product_type'] == 'digital' && $request->has('variant_key')) {
            $discount = getProductPriceByType(product: $product, type: 'discounted_amount', result: 'value', price: $product['unit_price'], from: 'panel');
            $tax = $product['tax_model'] == 'exclude' ? $this->getTaxAmount(price: $product['unit_price'], tax: $product['tax']) : 0;
            $quantity = $product['current_stock'];
            foreach ($product['digitalVariation'] as $variant) {
                if ($variant['variant_key'] == $request->variant_key) {
                    $discount = getProductPriceByType(product: $product, type: 'discounted_amount', result: 'value', price: $variant['price'], from: 'panel');
                    $tax = $product['tax_model'] == 'exclude' ? $this->getTaxAmount(price: $variant['price'], tax: $product['tax']) : 0;
                    $price = $variant['price'] - $discount + $tax;
                    $unitPrice = $variant['price'];
                    $variation = $variant['variant_key'];
                }
            }
        }

        foreach ($cartData as $cart) {
            if (is_array($cart) && $cart['id'] == $product['id'] && $cart['variant'] == $variation) {
                $inCartStatus = 1;
                $cartDiscount = getProductPriceByType(product: $product, type: 'discounted_amount', result: 'value', price: $cart['price'], from: 'panel');
                $price = ($cart['price'] - $cartDiscount + $tax);
                $inCartData = [
                    'price' => usdToDefaultCurrency(amount: $price * $cart['quantity']),
                    'discount' => usdToDefaultCurrency($cartDiscount),
                    'tax' => $product->tax_model == 'exclude' ? setCurrencySymbol(amount: usdToDefaultCurrency(amount: $tax * $cart['quantity']), currencyCode: getCurrencyCode()) : 'incl.',
                    'quantity' => (int)$cart['quantity'],
                    'variant' => $cart['variant'],
                    'id' => $cart['id'],
                ];
                $requestQuantity = (int)($request['quantity_in_cart'] ?? $cart['quantity']);
            }
        }
        $discountType = getProductPriceByType(product: $product, type: 'discount_type', result: 'string');

        return [
            'price' => setCurrencySymbol(amount: usdToDefaultCurrency(amount: $price * $requestQuantity)),
            'discount' => usdToDefaultCurrency($discount),
            'discount_amount' => $discount,
            'discount_type' => $discountType,
            'discount_text' => $discountType == 'flat' ? translate('save') .' '. setCurrencySymbol(amount:usdToDefaultCurrency(amount: $discount), currencyCode: getCurrencyCode()) : getProductPriceByType(product: $product, type: 'discount', result: 'value').'% '. translate('off'),
            'tax' => $product->tax_model == 'exclude' ? setCurrencySymbol(amount: usdToDefaultCurrency(amount: $tax * $requestQuantity), currencyCode: getCurrencyCode()) : 'incl.',
            'quantity' => $product['product_type'] == 'physical' ? $quantity : 100,
            'inCartStatus' => $inCartStatus,
            'inCartData' => $inCartData,
            'requestQuantity' => $requestQuantity,
            'total_unit_price' => setCurrencySymbol(amount: usdToDefaultCurrency(amount: $unitPrice)),
            'discounted_unit_price' => setCurrencySymbol(amount: usdToDefaultCurrency(amount: $unitPrice - $discount)),
        ];
    }

    public function makeVariation(object $request, string|null $colorName, array $choiceOptions): string
    {
        $variation = '';
        if ($colorName) {
            $variation = $colorName;
        }
        foreach ($choiceOptions as $key => $choice) {
            if ($variation != null) {
                $variation .= '-' . str_replace(' ', '', $request[$choice->name]);
            } else {
                $variation .= str_replace(' ', '', $request[$choice->name]);
            }
        }
        return $variation;
    }

    public function getUserId(): int
    {
        $userId = 0;
        if (Str::contains(session(SessionKey::CURRENT_USER), 'saved-customer')) {
            $userId = explode('-', session(SessionKey::CURRENT_USER))[2];
        }
        return $userId;
    }

    public function getUserType(): string
    {
        $userType = 'walking-customer';
        if (Str::contains(session(SessionKey::CURRENT_USER), 'saved-customer')) {
            $userType = 'saved-customer';
        }
        return $userType;
    }

    public function getNewCartSession(string|int $cartId): void
    {
        if (!session()->has(SessionKey::CURRENT_USER)) {
            session()->put(SessionKey::CURRENT_USER, $cartId);
        }
        if (!session()->has(SessionKey::CART_NAME)) {
            if (!in_array($cartId, session(SessionKey::CART_NAME) ?? [])) {
                session()->push(SessionKey::CART_NAME, $cartId);
            }
        }
    }

    public function getCartKeeper(): void
    {
        $cartId = session(SessionKey::CURRENT_USER);
        $cart = session($cartId);
        $cartKeeper = [];
        if (session()->has($cartId) && count($cart) > 0) {
            foreach ($cart as $cartItem) {
                $cartKeeper[] = $cartItem;
            }
        }
        session()->put(session(SessionKey::CURRENT_USER), $cartKeeper);
    }

    public function getVariationPrice(array $variation, string $variant): float
    {
        $count = count($variation);
        $price = 0;
        for ($i = 0; $i < $count; $i++) {
            if ($variation[$i]->type == $variant) {
                $price = $variation[$i]->price;
            }
        }
        return $price;
    }

    public function getVariationQuantity(array $variation, string $variant): int
    {
        $count = count($variation);
        $productQuantity = 0;
        for ($i = 0; $i < $count; $i++) {
            if ($variation[$i]->type == $variant) {
                $productQuantity = $variation[$i]->qty;
            }
        }
        return $productQuantity;
    }

    public function getCurrentQuantity($variation, $variant, $quantity): int
    {
        $productQuantity = $this->getVariationQuantity($variation, $variant);
        return $productQuantity - $quantity;
    }

    public function addCartDataOnSession(object $product, int $quantity, float $price, float $discount, string $variant, array $variations): array
    {
        $cartId = session(SessionKey::CURRENT_USER);
        $sessionData = [
            'id' => $product['id'],
            'customerId' => $this->getUserId(),
            'customerOnHold' => false,
            'quantity' => $quantity,
            'price' => $price,
            'name' => $product['name'],
            'productType' => $product['product_type'],
            'image' => $product->thumbnail_full_url,
            'discount' => $discount,
            'tax_model' => $product['tax_model'],
            'variant' => $variant,
            'variations' => $variations,
        ];
        if (session()->has($cartId)) {
            $keeper = [];
            foreach (session($cartId) as $item) {
                $keeper[] = $item;
            }
            $keeper[] = $sessionData;

            if (!isset(session()->get($cartId)['add_to_cart_time'])) {
                $keeper += ['add_to_cart_time' => Carbon::now()];
            }
            session()->put($cartId, $keeper);
        } else {
            session()->put($cartId, [$sessionData] + ['add_to_cart_time' => Carbon::now()]);
        }
        return $sessionData;
    }

    public function getQuantityAndUpdateTime(object $request, object $product): int
    {
        $quantity = 0;
        $cartId = session(SessionKey::CURRENT_USER);
        $cart = session($cartId);
        $keeper = [];

        foreach ($cart as $item) {
            if (is_array($item)) {
                $variantCheck = false;
                if (!empty($item['variant']) && ($item['variant'] == $request['variant']) && ($item['id'] == $request['key'])) {
                    $variantCheck = true;
                } elseif (empty($request['variant']) && $item['id'] == $request['key']) {
                    $variantCheck = true;
                }

                if ($variantCheck) {
                    $variant = '';
                    if ($item['variations']) {
                        foreach ($item['variations'] as $value) {
                            if ($variant != null) {
                                $variant .= '-' . str_replace(' ', '', $value);
                            } else {
                                $variant .= str_replace(' ', '', $value);
                            }
                        }
                    }

                    if ($variant != null) {
                        $productQuantity = $this->getVariationQuantity(json_decode($product['variation']), $variant);
                    } else {
                        $productQuantity = $product['current_stock'];
                    }

                    $quantity = $productQuantity - $request['quantity'];
                    if ($product['product_type'] == 'physical' && $quantity < 0) {
                        return $quantity;
                    }
                    $item['quantity'] = $request['quantity'];
                }
                $keeper[] = $item;
            }
        }
        $keeper += ['add_to_cart_time' => Carbon::now()];
        session()->put($cartId, $keeper);
        return $quantity;
    }

    public function getNewCartId(): void
    {
        $cartId = 'walking-customer-' . rand(10, 1000);
        session()->put(SessionKey::CURRENT_USER, $cartId);
        if (!in_array($cartId, session(SessionKey::CART_NAME) ?? [])) {
            session()->push(SessionKey::CART_NAME, $cartId);
        }
    }

    public function getCartSubtotalCalculation(object $product, array $cartItem, array $calculation): array
    {
        $taxCalculate = $product['tax_model'] == 'include' ? 0 : $this->getTaxAmount($cartItem['price'], $product['tax']) * $cartItem['quantity'];
        $discount = getProductPriceByType(product: $product, type: 'discounted_amount', result: 'value', price: $cartItem['price'], from: 'panel');
        $productSubtotal = (($cartItem['price'] - $discount) * $cartItem['quantity']) - ($product['tax_model'] == 'include' ? $taxCalculate : 0);
        return [
            'countItem' => 1,
            'totalQuantity' => $cartItem['quantity'],
            'taxCalculate' => $taxCalculate,
            'totalTaxShow' => $taxCalculate,
            'totalTax' => $taxCalculate,
            'totalIncludeTax' => $product['tax_model'] == 'include' ? $this->getTaxAmount($cartItem['price'], $product['tax']) * $cartItem['quantity'] : 0,
            'productSubtotal' => $productSubtotal,
            'subtotal' => $productSubtotal - ($cartItem['tax_model'] == 'include' ? $taxCalculate : 0),
            'discountOnProduct' => $discount * $cartItem['quantity'],
        ];
    }

    public function getTotalCalculation(array $subTotalCalculation, string $cartName): array
    {
        $total = $subTotalCalculation['subtotal'];
        $extraDiscount = session()->get($cartName)['ext_discount'] ?? 0;
        $extraDiscountType = session()->get($cartName)['ext_discount_type'] ?? 'amount';
        if ($extraDiscountType == 'percent' && $extraDiscount > 0) {
            $extraDiscount = (($subTotalCalculation['subtotal'] + $subTotalCalculation['discountOnProduct'] - $subTotalCalculation['totalIncludeTax']) * $extraDiscount) / 100;
        }
        if ($extraDiscount) {
            $total -= $extraDiscount;
        }
        $couponDiscount = 0;
        if (isset(session()->get($cartName)['coupon_discount'])) {
            $couponDiscount = session()->get($cartName)['coupon_discount'];
        }
        return [
            'total' => $total,
            'couponDiscount' => $couponDiscount,
            'extraDiscount' => $extraDiscount
        ];
    }

    public function customerOnHoldStatus($status): void
    {
        $cart = session(session(SessionKey::CURRENT_USER));
        $cartKeeper = [];
        if (session()->has(session(SessionKey::CURRENT_USER)) && count($cart) > 0) {
            foreach ($cart as $cartItem) {
                if (is_array($cartItem)) {
                    $cartItem['customerOnHold'] = $status;
                }
                $cartKeeper[] = $cartItem;
            }
        }
        session()->put(session(SessionKey::CURRENT_USER), $cartKeeper);
    }

    public function checkCurrentStock(string $variant, array $variation, int $productQty, int $quantity): int
    {
        if ($variant != null) {
            $currentQty = $this->getCurrentQuantity(variation: $variation, variant: $variant, quantity: $quantity);
        } else {
            $currentQty = $productQty - $quantity;
        }
        return $currentQty;
    }

    public function checkProductTypeDigital(string|int $cartId): bool
    {
        $cart = session($cartId);
        $isDigitalProduct = false;
        foreach ($cart as $item) {
            if (is_array($item) && $item['productType'] == 'digital') {
                $isDigitalProduct = true;
            }
        }
        return $isDigitalProduct;
    }

    public function getCustomerInfo(object|null $currentCustomerData, int $customerId): array
    {
        if ($currentCustomerData) {
            $customerName = $currentCustomerData['f_name'] . ' ' . $currentCustomerData['l_name'];
            $customerPhone = $currentCustomerData['phone'];
        } else {
            $customerName = "";
            $customerPhone = "";
            session()->forget(session($customerId));
            $this->getNewCartId();
        }
        return [
            'customerName' => $customerName,
            'customerPhone' => $customerPhone
        ];
    }
}
