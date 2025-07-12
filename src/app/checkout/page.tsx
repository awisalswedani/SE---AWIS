"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/CartContext";
import { formatPrice, getConfig, getOrCreateGuestId, getShippingMethods, getSellerInfoFromCart, placeOrder, addAddress, getAddressList, chooseShippingMethod, getCart, digitalPaymentPlaceOrder, setCheckoutSession } from "@/utils/api";
import Link from "next/link";

// Helper: Retry fetching address list after address creation
async function fetchLatestAddressWithRetry(guestId: string, retries = 5, delayMs = 300): Promise<number | null> {
  for (let i = 0; i < retries; i++) {
    const addressList = await getAddressList(guestId);
    console.log(`Retry ${i + 1}: fetched address list:`, addressList);
    if (Array.isArray(addressList) && addressList.length > 0) {
      const sorted = [...addressList].sort((a, b) => (b.id || 0) - (a.id || 0));
      console.log('Sorted address list:', sorted);
      const foundId = sorted[0].id || sorted[0].address_id;
      console.log('Selected address_id:', foundId);
      return foundId;
    }
    await new Promise(res => setTimeout(res, delayMs));
  }
  return null;
}

function isDefined<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null;
}

type WebPaymentRequestParams = {
  user_id: string | number;
  customer_id: string | number;
  payment_method: string;
  payment_platform: string;
  callback?: string;
  address_id?: string | number;
  billing_address_id?: string | number;
  order_note?: string;
};

// Helper to fetch CSRF token from backend
async function fetchCsrfToken(): Promise<string | null> {
  try {
    const res = await fetch('https://awisapp.com/customer/web-payment-request', {
      method: 'GET',
      credentials: 'include',
    });
    const html = await res.text();
    // Try to find meta tag first
    const metaMatch = html.match(/<meta name="csrf-token" content="([^"]+)"/);
    if (metaMatch && metaMatch[1]) return metaMatch[1];
    // Fallback: try to find hidden input
    const inputMatch = html.match(/<input[^>]+name=['\"]?_token['\"]?[^>]+value=['\"]?([^'\"> ]+)['\"]?[^>]*>/);
    if (inputMatch && inputMatch[1]) return inputMatch[1];
    return null;
  } catch {
    return null;
  }
}

function submitWebPaymentRequest({
  user_id,
  customer_id,
  payment_method,
  payment_platform,
  callback,
  address_id,
  billing_address_id,
  order_note,
  csrf_token,
}: WebPaymentRequestParams & { csrf_token: string }) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://awisapp.com/customer/web-payment-request';
  form.target = '_self';
  const fields: [string, string | number | undefined | null][] = [
    ['_token', csrf_token],
    ['user_id', user_id],
    ['customer_id', customer_id],
    ['payment_method', payment_method],
    ['payment_platform', payment_platform],
    ['callback', callback],
    ['address_id', address_id],
    ['billing_address_id', billing_address_id],
    ['order_note', order_note],
  ];
  fields.forEach(([name, value]) => {
    if (isDefined(value)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = String(value);
      form.appendChild(input);
    }
  });
  document.body.appendChild(form);
  form.submit();
}

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    country: "Kuwait",
    city: "",
    postal: "",
    address: "",
    addressType: "دائم",
  });
  const [delivery, setDelivery] = useState<string>("");
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [payment, setPayment] = useState<string>("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(true);
  const [paymentMethodsError, setPaymentMethodsError] = useState<string | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [guestIdLoading, setGuestIdLoading] = useState(true);
  const [guestIdError, setGuestIdError] = useState<string | null>(null);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [allowedCountries, setAllowedCountries] = useState<string[]>([]);
  const [allowedCountriesLoading, setAllowedCountriesLoading] = useState(true);
  const [countryError, setCountryError] = useState<string | null>(null);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  useEffect(() => {
    getConfig()
      .then((cfg) => {
        setConfig(cfg);
      })
      .catch(() => setConfig(null));
  }, []);

  useEffect(() => {
    getOrCreateGuestId()
      .then((id) => {
        setGuestId(id);
        setGuestIdLoading(false);
      })
      .catch(() => {
        setGuestIdError("تعذر الحصول على رقم الضيف. يرجى إعادة تحميل الصفحة.");
        setGuestIdLoading(false);
      });
  }, []);

  // Only fetch shipping methods after guestId is ready
  useEffect(() => {
    if (!guestIdLoading && guestId) {
      // Flutter app logic: Try seller's shipping methods first, then fallback to admin/global if none found
      const { sellerId, sellerType } = getSellerInfoFromCart(state.items);
      setShippingLoading(true);
      getShippingMethods(sellerId, sellerType, guestId)
        .then((options) => {
          console.log('Fetched shipping options:', options); // DEBUG
          setShippingOptions(options);
          if (options.length > 0) {
            setDelivery(options[0].key || options[0].id || options[0].title);
            setDeliveryPrice(Number(options[0].cost || 0));
          }
        })
        .catch((err) => {
          setShippingOptions([]);
        })
        .finally(() => setShippingLoading(false));
    }
  }, [guestIdLoading, guestId, state.items]);

  // Fetch allowed delivery countries on mount
  useEffect(() => {
    if (!guestId) return;
    setAllowedCountriesLoading(true);
    fetch(`https://awisapp.com/api/v1/customer/get-restricted-country-list?guest_id=${guestId}`)
      .then(async res => {
        if (!res.ok) {
          let msg = 'تعذر تحميل قائمة الدول. يرجى إعادة المحاولة لاحقاً.';
          if (res.status === 401) msg = 'غير مصرح. يرجى إعادة تحميل الصفحة أو تسجيل الدخول.';
          setAllowedCountries([]);
          setCountryError(msg);
          setAllowedCountriesLoading(false);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && data.every(c => typeof c === 'string')) {
          setAllowedCountries(data);
          setCountryError(null);
        } else {
          setAllowedCountries([]);
          setCountryError('تعذر تحميل قائمة الدول. يرجى إعادة المحاولة لاحقاً.');
        }
        setAllowedCountriesLoading(false);
      })
      .catch(() => {
        setAllowedCountries([]);
        setCountryError('تعذر تحميل قائمة الدول. يرجى التحقق من الاتصال أو المحاولة لاحقاً.');
        setAllowedCountriesLoading(false);
      });
  }, [guestId]);

  // Fetch payment methods from backend config
  useEffect(() => {
    async function fetchPaymentMethods() {
      setPaymentMethodsLoading(true);
      setPaymentMethodsError(null);
      try {
        const res = await fetch("https://awisapp.com/api/v1/config");
        if (!res.ok) throw new Error("فشل تحميل طرق الدفع من الخادم");
        const data = await res.json();
        // Use all payment methods returned by the backend (do not filter by is_active)
        const allMethods = data.payment_methods || [];
        console.log('[DEBUG] paymentMethods:', allMethods);
        setPaymentMethods(allMethods);
        if ((!payment || payment === '') && allMethods.length > 0) {
          setPayment(allMethods[0].key || allMethods[0].key_name || '');
        }
      } catch (err: any) {
        setPaymentMethodsError(err.message || "فشل تحميل طرق الدفع");
      } finally {
        setPaymentMethodsLoading(false);
      }
    }
    fetchPaymentMethods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Synchronous effect to perform redirect
  useEffect(() => {
    if (pendingRedirect) {
      console.log('[DEBUG] pendingRedirect triggered:', pendingRedirect);
      window.location.href = pendingRedirect;
    }
  }, [pendingRedirect]);

  // Step validation
  const validateStep = () => {
    if (step === 1) {
      const required = ["name", "phone", "email", "country", "city", "postal", "address"];
      return required.every((k) => form[k as keyof typeof form].trim() !== "");
    }
    if (step === 2) {
      return !!delivery;
    }
    if (step === 3) {
      return !!payment;
    }
    return true;
  };

  // Address creation (step 1)
  const handleAddressNext = async () => {
    setError(null);
    // No address API call, just validate and move to next step
    try {
      if (!validateStep()) throw new Error("يرجى تعبئة جميع الحقون المطلوبة");
      setStep(2);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إضافة العنوان");
    }
  };

  // Place order (final step)
  const handlePayment = async () => {
    try {
      setPlacing(true);
      setError(null);
      setSuccess(null);
      console.log('[DEBUG] handlePayment called', { delivery, payment, guestId, guestIdLoading, items: state.items });
      if (!delivery) throw new Error("يرجى اختيار طريقة التوصيل");
      if (!payment) throw new Error("يرجى اختيار طريقة الدفع");
      if (!state.items.length) throw new Error("السلة فارغة");
      if (guestIdLoading || !guestId) throw new Error('يرجى الانتظار حتى يتم تجهيز الحساب المؤقت');
      // 1. Create address and get address_id
      const addressRes = await addAddress({
        name: form.name,
        phone: form.phone,
        email: form.email,
        country: form.country,
        city: form.city,
        postal: form.postal,
        address: form.address,
        address_type: form.addressType,
        guest_id: guestId,
      });
      let address_id = addressRes.address_id || addressRes.id || addressRes.data?.id;
      if (!address_id) {
        address_id = await fetchLatestAddressWithRetry(guestId);
      }
      console.log('[DEBUG] Got address_id:', address_id);
      if (!address_id) throw new Error("فشل حفظ العنوان. يرجى المحاولة مرة أخرى.");
      // 2. Fetch cart and select shipping method
      const cart = await getCart();
      console.log('[DEBUG] Cart before shipping selection (order):', cart);
      if (!Array.isArray(cart) || cart.length === 0) {
        setError('السلة فارغة أو لم يتم مزامنتها مع الخادم بعد. يرجى إضافة منتجات وإعادة المحاولة.');
        setPlacing(false);
        return;
      }
      let cartGroupId = 'default';
      if (cart[0].cart_group_id) {
        cartGroupId = cart[0].cart_group_id;
      }
      console.log('[DEBUG] Using cart_group_id for shipping (order):', cartGroupId);
      await chooseShippingMethod(delivery, guestId, cartGroupId);
      console.log('[DEBUG] Shipping method chosen (order):', delivery, 'cart_group_id:', cartGroupId);
      // 3. Place order with address_id and shipping_cost
      if (payment !== 'cod') {
        // Digital/online payment flow: send all order data to backend, get redirect_link
        const payload = {
          order_note: '',
          customer_id: guestId,
          address_id,
          billing_address_id: address_id,
          coupon_code: '',
          coupon_discount: '',
          payment_method: payment,
          is_check_create_account: false,
          password: '',
          payment_platform: 'web',
          payment_request_from: 'app',
          guest_id: guestId,
          is_guest: true,
          external_redirect_link: 'https://awisapp.com/web-payment?flag=success&&token={token}',
        };

        console.log('[DEBUG] Digital payment payload:', payload);
        const res = await fetch('https://awisapp.com/api/v1/digital-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include', // Include cookies if available
        });
        
        console.log('[DEBUG] Response status:', res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('[DEBUG] Backend error response:', errorText);
          throw new Error(`Backend error: ${res.status} ${res.statusText}`);
        }
        
        // Check if response is a redirect (should not happen with JSON API)
        if (res.redirected) {
          console.log('[DEBUG] Response was redirected to:', res.url);
          // If backend redirected to payment gateway, navigate there
          window.location.href = res.url;
          return;
        }
        
        const data = await res.json();
        console.log('[DEBUG] Digital payment response:', data);
        
        if (data && data.redirect_link) {
          console.log('[DEBUG] Redirecting to payment gateway:', data.redirect_link);
          window.location.href = data.redirect_link;
        } else {
          const msg = (data && typeof data === 'object' && 'message' in data) ? data.message : String(data);
          throw new Error('No redirect_link received from backend! Error: ' + msg);
        }
        return;
      }
      // Cash on delivery (existing logic)
      const orderPayload = {
        address_id,
        delivery,
        payment,
        order_note: '',
        cartItems: state.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          variant: item.variant,
          color: item.color || undefined,
        })),
        guest_id: guestId,
        country: form.country,
        city: form.city,
        postal: form.postal,
        phone: form.phone,
        name: form.name,
        address: form.address,
        email: form.email,
        shipping_cost: deliveryPrice,
      };
      console.log('[DEBUG] placeOrder payload:', orderPayload);
      const res = await placeOrder(orderPayload);
      console.log('[DEBUG] placeOrder response:', res);
      setSuccess("تم إرسال الطلب بنجاح!");
      clearCart();
      setStep(4);
    } catch (err: any) {
      if (err && err.message) {
        setError(err.message);
        console.error('[DEBUG] handlePayment error:', err.message);
      } else {
        setError("حدث خطأ أثناء الشراء");
        console.error('[DEBUG] handlePayment error: unknown');
      }
    } finally {
      setPlacing(false);
    }
  };

  // Stepper UI
  const StepIndicator = () => (
    <div className="flex justify-center gap-2 mb-8">
      {[1, 2].map((s) => (
        <div
          key={s}
          className={`w-8 h-2 rounded-full transition-all duration-300 ${
            step === s
              ? "bg-blue-600 w-16"
              : step > s
              ? "bg-green-500"
              : "bg-gray-300"
          }`}
        ></div>
      ))}
    </div>
  );

  if (guestIdLoading || !guestId) {
    return <div className="text-center text-lg py-10">جاري تجهيز الحساب المؤقت للزائر...</div>;
  }
  if (guestIdError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <div className="text-red-600 text-lg">{guestIdError}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4">
          <div className="relative flex items-center py-2 border-b border-gray-100 min-h-[48px]">
            {step === 1 ? (
              <Link href="/cart" aria-label="Back to cart" className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#991b1b]">
                <svg className="w-5 h-5 text-[#991b1b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setStep(1)}
                aria-label="Back to address"
                className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#991b1b]"
              >
                <svg className="w-5 h-5 text-[#991b1b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h1 className="mx-auto text-xl font-bold text-gray-900 truncate max-w-xs md:max-w-lg text-center w-full">الدفع</h1>
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <StepIndicator />
        {step === 1 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">معلومات العنوان</h2>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleAddressNext(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">اسم الشخص المسؤول <span className="text-red-500">*</span></label>
                  <input name="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded p-2" required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">هاتف <span className="text-red-500">*</span></label>
                  <input name="phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border rounded p-2" required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">بريد إلكتروني <span className="text-red-500">*</span></label>
                  <input name="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border rounded p-2" required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">نوع العنوان</label>
                  <select name="addressType" value={form.addressType} onChange={e => setForm({ ...form, addressType: e.target.value })} className="w-full border rounded p-2">
                    <option value="دائم">دائم</option>
                    <option value="مؤقت">مؤقت</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-1">الدولة</label>
                  {allowedCountriesLoading ? (
                    <div>جاري تحميل قائمة الدول...</div>
                  ) : allowedCountries.length === 0 ? (
                    <div className="text-red-500">{countryError || 'تعذر تحميل قائمة الدول.'}</div>
                  ) : (
                    <select
                      className="input"
                      value={form.country}
                      onChange={e => setForm({ ...form, country: e.target.value })}
                      required
                    >
                      <option value="">اختر الدولة</option>
                      {allowedCountries.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  )}
                  {countryError && allowedCountries.length > 0 && <div className="text-red-500 text-sm mt-1">{countryError}</div>}
                </div>
                <div>
                  <label className="block mb-1 font-medium">مدينة <span className="text-red-500">*</span></label>
                  <input name="city" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full border rounded p-2" required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">الرمز البريدي <span className="text-red-500">*</span></label>
                  <input name="postal" value={form.postal} onChange={e => setForm({ ...form, postal: e.target.value })} className="w-full border rounded p-2" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium">عنوان <span className="text-red-500">*</span></label>
                  <input name="address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full border rounded p-2" required />
                </div>
              </div>
              {error && <div className="text-red-600 text-center mt-2">{error}</div>}
              <button type="submit" className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors mt-4" disabled={addressLoading}>
                {addressLoading ? "...جاري حفظ العنوان" : "التالي"}
              </button>
            </form>
          </div>
        )}
        {step === 2 && (
          <form onSubmit={e => { e.preventDefault(); handlePayment(); }}>
            {/* Shipping Options */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">طريقة الشحن</h2>
              {shippingLoading ? (
                <div className="text-center text-gray-500">جاري تحميل خيارات الشحن...</div>
              ) : shippingOptions.length === 0 ? (
                <div className="text-center text-red-500">لا توجد خيارات شحن متاحة حالياً لهذا البائع. جرب تحديث الصفحة أو التواصل مع الدعم.</div>
              ) : (
                <div className="flex flex-col gap-4 mt-2">
                  {shippingOptions.map((option: any, idx: number) => (
                    <label key={option.id || option.key || idx} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="delivery"
                        value={option.key || option.id || option.title}
                        checked={delivery === (option.key || option.id || option.title)}
                        onChange={async () => {
                          setDelivery(option.key || option.id || option.title);
                          setDeliveryPrice(Number(option.cost || 0));
                          try {
                            if (guestId) {
                              // Fetch cart and extract cart_group_id
                              const cart = await getCart();
                              if (!Array.isArray(cart) || cart.length === 0) {
                                setError('السلة فارغة أو لم يتم مزامنتها مع الخادم بعد. يرجى إضافة منتجات وإعادة المحاولة.');
                                return;
                              }
                              let cartGroupId = 'default';
                              if (cart[0].cart_group_id) {
                                cartGroupId = cart[0].cart_group_id;
                              }
                              await chooseShippingMethod(option.id, guestId, cartGroupId);
                            }
                          } catch (err) {
                            setError('تعذر حفظ طريقة الشحن المختارة. يرجى المحاولة مرة أخرى.');
                          }
                        }}
                      />
                      <span>{option.title || option.name}</span>
                      <span className="text-sm text-gray-500">{option.duration ? `مدة التوصيل: ${option.duration} أيام` : ''}</span>
                      <span className="ml-2 font-bold">{option.cost !== undefined ? `${option.cost} د.ك` : ''}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">طريقة الدفع</h2>
              {paymentMethodsLoading ? (
                <div>جاري تحميل طرق الدفع...</div>
              ) : paymentMethodsError ? (
                <div style={{ color: 'red' }}>{paymentMethodsError}</div>
              ) : (
                <div className="flex gap-4 mt-2 flex-wrap items-center">
                  {paymentMethods.map((method, idx) => (
                    <label key={method.key || method.name || idx} className={`flex-1 border rounded p-3 cursor-pointer min-w-[120px] ${payment === (method.key || method.key_name) ? 'border-blue-600 bg-blue-50' : 'border-gray-200'} flex items-center gap-2`}>
                      {(method.key || method.key_name)?.toLowerCase() === 'fatoorah' ? (
                        <>
                          {/* Radio button on the right for RTL */}
                          <input
                            type="radio"
                            name="payment"
                            value={method.key || method.key_name}
                            checked={payment === (method.key || method.key_name)}
                            onChange={() => setPayment(method.key || method.key_name)}
                            className="ml-2 order-1"
                            disabled={paymentMethodsLoading}
                          />
                          {/* Centered image */}
                          <div className="flex-1 flex justify-center order-2">
                            <img src="/payment-logos.png" alt="Fatoorah Payment Methods" className="h-10 max-w-[180px] object-contain" />
                          </div>
                        </>
                      ) : (
                        <>
                          {method.image && <img src={method.image} alt={method.name || method.label || 'طريقة الدفع'} className="h-5 inline" />}
                          {method.name || method.label || method.key || method.key_name}
                        </>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">ملخص الطلب</h2>
              {state.items.length === 0 ? (
                <div className="text-gray-500">السلة فارغة</div>
              ) : (
                <ul className="divide-y divide-gray-200 mb-4">
                  {state.items.map((item) => (
                    <li key={item.id} className="py-2 flex justify-between items-center">
                      <span className="text-sm">{item.name} × {item.quantity}</span>
                      <span className="text-sm font-medium">{formatPrice((item.price - item.discount) * item.quantity, config)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex justify-between text-sm mb-1">
                <span>المجموع الفرعي</span>
                <span>{formatPrice(state.subtotal, config)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>شحن</span>
                <span>{formatPrice(deliveryPrice, config)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                <span>المجموع</span>
                <span>{formatPrice(state.subtotal + deliveryPrice, config)}</span>
              </div>
            </div>
            {error && <div className="text-red-600 text-center mt-4 text-lg font-bold">[خطأ]: {error}</div>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors text-lg font-bold mt-4"
              disabled={placing || !payment || paymentMethodsLoading || shippingLoading || !delivery}
            >
              {placing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                </span>
              ) : payment !== 'cod' ? 'ادفع الآن' : 'تأكيد الطلب'}
            </button>
          </form>
        )}
        {step === 4 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">تم إرسال الطلب بنجاح!</h2>
            <p className="mb-6">شكراً لطلبك. سيتم التواصل معك قريباً.</p>
            <Link href="/" className="bg-blue-600 text-white py-2 px-6 rounded">العودة للرئيسية</Link>
          </div>
        )}
      </main>
      <div className="h-20 md:hidden" />
    </div>
  );
} 