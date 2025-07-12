const BASE_URL = 'https://awisapp.com/api/v1';
const SELLER_ID = process.env.NEXT_PUBLIC_SELLER_ID || process.env.SELLER_ID || '6';

// Fetch guest_id from backend and store in localStorage if not present
export async function getOrCreateGuestId(forceNew = false): Promise<string> {
  if (typeof window !== 'undefined') {
    if (!forceNew) {
      let guestId = localStorage.getItem('guest_id');
      if (guestId) return guestId;
    }
    // Always get a new guest_id if forceNew or missing
    const res = await fetch('https://awisapp.com/api/v1/get-guest-id');
    const data = await res.json();
    if (data.guest_id) {
      localStorage.setItem('guest_id', data.guest_id.toString());
      return data.guest_id.toString();
    }
    throw new Error('No guest_id in backend response');
  }
  throw new Error('Not running in browser');
}

export async function getSellerInfo() {
  const res = await fetch(`${BASE_URL}/seller?seller_id=${SELLER_ID}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch seller info');
  return res.json();
}

export async function getSellerCategories() {
  const guestId = await getOrCreateGuestId();
  const res = await fetch(`${BASE_URL}/categories?seller_id=${SELLER_ID}&guest_id=${guestId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch seller categories');
  return res.json();
}

export async function getSellerProducts(params: Record<string, string> = {}) {
  const guestId = await getOrCreateGuestId();
  const query = new URLSearchParams({ 
    guest_id: guestId, 
    limit: params.limit || '20', 
    offset: params.offset || '1',
    ...params 
  }).toString();
  // Use the correct seller-specific endpoint
  const res = await fetch(`${BASE_URL}/seller/${SELLER_ID}/products?${query}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  console.log('Products response:', data);
  return data;
}

export async function getSellerBanners() {
  const res = await fetch(`${BASE_URL}/banners`, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch banners');
  return res.json();
}

// Fetch configuration data (currency, settings, etc.)
export async function getConfig() {
  const res = await fetch(`${BASE_URL}/config`, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch config');
  return res.json();
}

// Cart API functions - Fixed to match Flutter app exactly
export async function addToCart(productId: number, quantity: number = 1, selectedColor?: string, selectedOptions?: { [key: string]: string }, selectedVariant?: any) {
  const guestId = await getOrCreateGuestId();
  const data: any = {
    id: productId,
    guest_id: guestId,
    quantity: quantity,
    buy_now: 0,
  };
  if (selectedVariant) {
    data.variant = selectedVariant.type;
    data.price = selectedVariant.price;
    data.sku = selectedVariant.sku;
    data.qty = selectedVariant.qty;
  }
  // Send color as color code if available
  if (selectedColor) {
    // If selectedColor is a color name, try to find the code from selectedVariant or selectedOptions
    if (selectedVariant && selectedVariant.color_code) {
      data.color = selectedVariant.color_code;
    } else {
      data.color = selectedColor;
    }
  }
  // Flatten choices: send each as choice_1, choice_2, etc.
  if (selectedOptions) {
    let idx = 1;
    for (const [key, value] of Object.entries(selectedOptions)) {
      data[`choice_${idx}`] = value;
      idx++;
    }
  }

  console.log('Adding to cart with data:', data);

  const res = await fetch(`${BASE_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Add to cart failed:', res.status, errorText);
    throw new Error(`Failed to add to cart: ${res.status} ${errorText}`);
  }
  
  const result = await res.json();
  console.log('Add to cart response:', result);
  return result;
}

export async function getCart() {
  const guestId = await getOrCreateGuestId();
  console.log('[DEBUG] getCart using guest_id:', guestId);
  const res = await fetch(`${BASE_URL}/cart?guest_id=${guestId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Get cart failed:', res.status, errorText);
    throw new Error(`Failed to fetch cart: ${res.status} ${errorText}`);
  }
  const result = await res.json();
  console.log('[DEBUG] getCart result:', result);
  return result;
}

export async function updateCartQuantity(cartId: number, quantity: number) {
  const guestId = await getOrCreateGuestId();
  
  const data = {
    cart_id: cartId,
    quantity: quantity,
    guest_id: guestId,
  };

  console.log('Updating cart quantity with data:', data);

  const res = await fetch(`${BASE_URL}/cart/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Update cart failed:', res.status, errorText);
    throw new Error(`Failed to update cart: ${res.status} ${errorText}`);
  }
  
  const result = await res.json();
  console.log('Update cart response:', result);
  return result;
}

export async function removeFromCart(cartId: number) {
  const guestId = await getOrCreateGuestId();
  const data = {
    _method: 'delete',
    guest_id: guestId,
    key: cartId,
  };

  console.log('Removing from cart (Flutter style):', data);

  const res = await fetch(`${BASE_URL}/cart/remove`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Remove from cart failed:', res.status, errorText);
    throw new Error(`Failed to remove from cart: ${res.status} ${errorText}`);
  }

  const result = await res.json();
  console.log('Remove from cart response:', result);
  return result;
}

// Format price according to Flutter app logic
export function formatPrice(price: number, config: any): string {
  if (!price || price <= 0) return '';
  
  try {
    // Get currency symbol from config, default to KD
    let currencySymbol = 'KD';
    let decimalPoints = 2;
    let convertedPrice = price;
    
    if (config) {
      // Find the active currency (status: true)
      const activeCurrency = config.currency_list?.find((curr: any) => curr.status === true);
      // Find the USD currency (status: false, code: USD)
      const usdCurrency = config.currency_list?.find((curr: any) => curr.status === false && curr.code === 'USD');
      
      if (activeCurrency) {
        currencySymbol = activeCurrency.symbol || 'KD';
        const activeRate = parseFloat(activeCurrency.exchange_rate) || 1;
        const usdRate = parseFloat(usdCurrency?.exchange_rate) || 1;
        
        // Apply currency conversion: price * activeRate * (1 / usdRate)
        // This matches the Flutter app's conversion logic
        convertedPrice = price * activeRate * (1 / usdRate);
      }
      
      // Get decimal point settings
      decimalPoints = config.decimal_point_settings || 2;
    }
    
    // Format price with proper decimal places and commas
    const formattedPrice = convertedPrice.toFixed(decimalPoints);
    const priceWithCommas = formattedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return `${currencySymbol} ${priceWithCommas}`;
  } catch (error) {
    console.error('Error formatting price:', error);
    return `${price.toFixed(2)} KD`;
  }
}

// Add more API helpers as needed (categories, reviews, etc.)

export interface PlaceOrderCartItem {
  product_id: number;
  quantity: number;
  variant?: string;
  color?: string;
}

export interface PlaceOrderParams {
  address_id: number | string;
  delivery: string;
  payment: string;
  order_note: string;
  cartItems: any[];
  guest_id: number | string;
  country: string;
  city: string;
  postal: string;
  phone: string;
  name: string;
  address?: string;
  email?: string;
  shipping_cost?: number;
}

export async function placeOrder(params: PlaceOrderParams) {
  let { guest_id, cartItems, shipping_cost, ...rest } = params;
  // Fallback for guest_id
  if (!guest_id || isNaN(Number(guest_id))) {
    guest_id = typeof window !== 'undefined' ? (localStorage.getItem('guest_id') || '1') : '1';
  }
  const query = new URLSearchParams({
    ...Object.fromEntries(Object.entries(rest).map(([k, v]) => [k, v?.toString() ?? ''])),
    cartItems: JSON.stringify(cartItems),
    guest_id: guest_id.toString(),
    is_guest: '1',
    ...(shipping_cost !== undefined ? { shipping_cost: shipping_cost.toString() } : {}),
  }).toString();
  const res = await fetch(`https://awisapp.com/api/v1/customer/order/place?${query}`);
  if (!res.ok) throw new Error('Failed to place order');
  return await res.json();
}

export interface AddAddressParams {
  name: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  postal: string;
  address: string;
  address_type: string;
  guest_id: number | string;
  contact_person_name?: string;
  zip?: string;
  latitude?: string;
  longitude?: string;
  is_billing?: number;
}

export async function addAddress(params: any) {
  let guestId = params.guest_id;
  if (!guestId) {
    guestId = await getOrCreateGuestId();
  }
  // Ensure latitude and longitude are always present and numbers
  let latitude = params.latitude;
  let longitude = params.longitude;
  if (latitude === undefined || latitude === null || latitude === "") latitude = 0;
  if (longitude === undefined || longitude === null || longitude === "") longitude = 0;
  let body = {
    contact_person_name: params.name,
    address_type: params.address_type || 'home',
    address: params.address,
    city: params.city,
    zip: params.postal || params.zip,
    phone: params.phone,
    state: params.state || '',
    country: params.country,
    latitude: latitude,
    longitude: longitude,
    is_billing: false,
    guest_id: guestId.toString(),
    email: params.email || '',
    is_guest: 1,
  };
  console.log('[DEBUG] addAddress payload:', body);
  let res = await fetch('https://awisapp.com/api/v1/customer/address/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to add address');
  return await res.json();
}

export async function getAddressList(guest_id: number | string) {
  const res = await fetch(`https://awisapp.com/api/v1/customer/address/list?guest_id=${encodeURIComponent(guest_id.toString())}`);
  if (!res.ok) throw new Error('Failed to fetch address list');
  const data = await res.json();
  // Flutter expects a plain array, not wrapped in addresses/data
  return Array.isArray(data) ? data : (data.addresses || data.data || []);
}

export function getSellerInfoFromCart(cartItems: any[]) {
  if (!cartItems || cartItems.length === 0) return { sellerId: '1', sellerType: 'admin' };
  const first = cartItems[0];
  return {
    sellerId: first.seller_id || first.sellerId || '1',
    sellerType: first.seller_is || first.sellerIs || 'admin',
  };
}

export async function getShippingMethods(_sellerId: string | number, _sellerType: string, guestId: string | number) {
  // Always fetch admin/global shipping methods only
  const res = await fetch(`https://awisapp.com/api/v1/shipping-method/by-seller/1/admin?guest_id=${guestId}`);
  const data = await res.json();
  console.log('[DEBUG] getShippingMethods admin response:', data);
  const options = Array.isArray(data) ? data : (data.shipping_methods || data.data || []);
  return options;
}

export async function chooseShippingMethod(shippingMethodId: number | string, guestId: number | string, cartGroupId: string = 'default') {
  const body = {
    id: shippingMethodId,
    guest_id: guestId,
    cart_group_id: cartGroupId,
  };
  const res = await fetch('https://awisapp.com/api/v1/shipping-method/choose-for-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to choose shipping method');
  return await res.json();
}

export interface DigitalPaymentOrderParams {
  order_note?: string;
  customer_id?: string | number;
  address_id?: string | number;
  billing_address_id?: string | number;
  coupon_code?: string;
  coupon_discount?: string | number;
  payment_method?: string;
  is_check_create_account?: boolean;
  password?: string;
  payment_platform?: string;
  payment_request_from?: string;
}

export interface DigitalPaymentOrderResponse {
  redirect_link?: string;
  [key: string]: any;
}

export async function digitalPaymentPlaceOrder(params: DigitalPaymentOrderParams): Promise<DigitalPaymentOrderResponse> {
  const guest_id = await getOrCreateGuestId();
  const is_guest = 1;
  const is_check_create_account = params.is_check_create_account ? 1 : 0;
  const body = {
    order_note: params.order_note || '',
    customer_id: params.customer_id || guest_id,
    address_id: params.address_id,
    billing_address_id: params.billing_address_id,
    coupon_code: params.coupon_code || '',
    coupon_discount: params.coupon_discount || '',
    payment_platform: params.payment_platform || 'web',
    payment_method: params.payment_method,
    callback: null,
    payment_request_from: params.payment_request_from || 'web',
    guest_id: guest_id,
    is_guest: is_guest,
    is_check_create_account: is_check_create_account,
    password: params.password || '',
  };
  // POST to the correct API endpoint for digital payment
  const res = await fetch('https://awisapp.com/api/v1/digital-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to place digital payment order');
  return await res.json();
}

export async function setCheckoutSession(address_id: number | string, billing_address_id: number | string) {
  const res = await fetch('https://awisapp.com/api/v1/set-checkout-session', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address_id, billing_address_id }),
  });
  if (!res.ok) throw new Error('Failed to set checkout session');
  return await res.json();
}