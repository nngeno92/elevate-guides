// Meta Pixel Event Tracking Utility

declare global {
  interface Window {
    fbq: any;
  }
}

// Meta Conversions API Configuration
const ACCESS_TOKEN = 'EAARgBkBM2R4BPc5VZC7o0HXx1b3XX12NndZCUrZATYOo5TITwr5xZCXXNHE3GDsFNgzCnZC4MCod03AZAEQtyCRvcqXV0OLdNiORdTaVyc1ly57i5N7aLjmKQkdSKCZCALavY1QCxHImaMPqX9KZBbPLQnweFXx7gyHnExdXgMowUXq9YZCyQrFiPt598XPgWv6QYxQZDZD';
const PIXEL_ID = '1904667380084931';

// Your own conversion storage API endpoint
const CONVERSION_STORAGE_API = 'https://shared-backend-bbb0ec9bc43a.herokuapp.com/api/meta/conversion/';

// UTM Cookie Management
const UTM_COOKIE_NAME = 'bik_utm_params';
const UTM_COOKIE_EXPIRY_DAYS = 30;
const FBC_COOKIE_NAME = '_fbc';

// Cookie helpers
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const target = cookies.find(c => c.trim().startsWith(`${name}=`));
  if (!target) return null;
  try {
    return decodeURIComponent(target.split('=')[1]);
  } catch {
    return null;
  }
};

const setCookie = (name: string, value: string, days: number) => {
  if (typeof document === 'undefined') return;
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
};

// Ensure we have a properly formatted fbc value. If _fbc cookie exists, return it.
// Otherwise, build one from fbclid using format: fb.1.<creation_time>.<fbclid>
const ensureFbc = (fbclid?: string | null): string | null => {
  if (typeof window === 'undefined') return null;
  const existing = getCookie(FBC_COOKIE_NAME);
  if (existing) return existing;
  if (!fbclid) return null;
  const creationTime = Date.now();
  const fbc = `fb.1.${creationTime}.${fbclid}`;
  setCookie(FBC_COOKIE_NAME, fbc, UTM_COOKIE_EXPIRY_DAYS);
  return fbc;
};

// Store UTM parameters in cookie
const storeUTMParams = () => {
  if (typeof window === 'undefined') return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {
    utm_source: urlParams.get('utm_source') || '',
    utm_medium: urlParams.get('utm_medium') || '',
    utm_campaign: urlParams.get('utm_campaign') || '',
    utm_term: urlParams.get('utm_term') || '',
    utm_content: urlParams.get('utm_content') || '',
    fbclid: urlParams.get('fbclid') || '', // Facebook click ID
    timestamp: Date.now()
  };
  
  // Store if we have UTM parameters or Facebook click ID
  if (utmParams.utm_source || utmParams.utm_medium || utmParams.utm_campaign || utmParams.fbclid) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + UTM_COOKIE_EXPIRY_DAYS);
    
    document.cookie = `${UTM_COOKIE_NAME}=${JSON.stringify(utmParams)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    // Also ensure _fbc cookie exists if fbclid is present
    if (utmParams.fbclid) {
      ensureFbc(utmParams.fbclid);
    }
  }
};

// Retrieve UTM parameters from cookie
const getUTMParams = (): any => {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const utmCookie = cookies.find(cookie => cookie.trim().startsWith(`${UTM_COOKIE_NAME}=`));
  
  if (utmCookie) {
    try {
      const cookieValue = utmCookie.split('=')[1];
      return JSON.parse(decodeURIComponent(cookieValue));
    } catch (error) {
      console.error('Error parsing UTM cookie:', error);
      return null;
    }
  }
  
  return null;
};

// Check if traffic source is Facebook or Instagram
const isFacebookTraffic = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // First check URL parameters (current session)
  const urlParams = new URLSearchParams(window.location.search);
  let utmSource = urlParams.get('utm_source')?.toLowerCase() || '';
  let utmMedium = urlParams.get('utm_medium')?.toLowerCase() || '';
  let utmCampaign = urlParams.get('utm_campaign')?.toLowerCase() || '';
  
  // If no UTM params in URL, check cookie (previous session)
  if (!utmSource && !utmMedium && !utmCampaign) {
    const storedUTM = getUTMParams();
    if (storedUTM) {
      utmSource = storedUTM.utm_source?.toLowerCase() || '';
      utmMedium = storedUTM.utm_medium?.toLowerCase() || '';
      utmCampaign = storedUTM.utm_campaign?.toLowerCase() || '';
    }
  }
  
  // Check for Facebook/Instagram traffic
  const facebookKeywords = ['facebook', 'fb', 'ig', 'instagram'];
  
  return facebookKeywords.some(keyword => 
    utmSource.includes(keyword) || 
    utmMedium.includes(keyword) || 
    utmCampaign.includes(keyword)
  );
};

// Initialize UTM tracking (call this on page load)
export const initUTMTracking = () => {
  if (typeof window === 'undefined') return;
  
  // Store UTM parameters if they exist in URL
  storeUTMParams();
};

// Hash function for phone numbers and emails
const hashData = async (data: string): Promise<string> => {
  if (typeof window !== 'undefined') {
    // Use Web Crypto API for SHA256 hashing
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return '';
};

// Format phone number for Kenya (+254)
const formatPhoneNumber = (phone: string): string => {
  let formatted = phone.replace(/\D/g, ''); // Remove non-digits
  
  if (formatted.startsWith('0')) {
    formatted = '254' + formatted.slice(1);
  } else if (formatted.startsWith('254')) {
    // Already in correct format
  } else if (formatted.startsWith('+254')) {
    formatted = formatted.slice(1);
  } else {
    // Assume it's a 9-digit number starting with 7
    formatted = '254' + formatted;
  }
  
  return formatted;
};

// Send event to Meta Conversions API
const sendToConversionsAPI = async (eventData: any) => {
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      console.error('Meta Conversions API Error:', await response.text());
    } else {
      console.log('Meta Conversions API Success:', await response.json());
    }
  } catch (error) {
    console.error('Meta Conversions API Request Error:', error);
  }
};

// Store conversion data in your own API for comparison
const storeConversionData = async (email: string, amount: number, fb_clid?: string) => {
  try {
    console.log('📊 Storing conversion data in your API...');
    
    // Determine source based on traffic
    let source = 'direct';
    if (isFacebookTraffic()) {
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source')?.toLowerCase() || '';
      const utmMedium = urlParams.get('utm_medium')?.toLowerCase() || '';
      
      if (utmSource.includes('facebook') || utmMedium.includes('facebook')) {
        source = 'facebook_ads';
      } else if (utmSource.includes('instagram') || utmMedium.includes('instagram')) {
        source = 'instagram_ads';
      } else {
        source = 'facebook_ads'; // Default for Facebook traffic
      }
    }
    
    // Get Facebook click ID from URL or stored UTM params
    let clickId = fb_clid;
    if (!clickId) {
      const urlParams = new URLSearchParams(window.location.search);
      clickId = urlParams.get('fbclid') || '';
      
      if (!clickId) {
        const storedUTM = getUTMParams();
        clickId = storedUTM?.fbclid || '';
      }
    }
    
    const conversionData = {
      source: source,
      email: email,
      amount: amount.toString(),
      fb_clid: clickId || 'unknown'
    };
    
    console.log('📊 Conversion data to store:', conversionData);
    
    const response = await fetch(CONVERSION_STORAGE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(conversionData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Conversion storage API Error:', response.status, errorText);
      return false;
    } else {
      const result = await response.json();
      console.log('✅ Conversion stored successfully:', result);
      return true;
    }
  } catch (error) {
    console.error('❌ Conversion storage API Request Error:', error);
    return false;
  }
};

// Track initiate checkout event
export const trackInitiateCheckout = async (products: any[], total: number, phoneNumber?: string) => {
  // Meta Pixel tracking (always track)
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_category: 'Business Guides',
      content_type: 'product',
      value: total,
      currency: 'KES',
      content_ids: products.map(p => p.product_id),
      num_items: products.length,
    });
  }

  // Meta Conversions API tracking (only for Facebook/Instagram traffic)
  if (phoneNumber && isFacebookTraffic()) {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const hashedPhone = await hashData(formattedPhone);
    
    const eventData = {
      data: [{
        event_name: 'InitiateCheckout',
        event_time: Math.floor(Date.now() / 1000),
        event_id: `initiate_checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        event_source_url: window.location.href,
        action_source: 'website',
        user_data: {
          ph: hashedPhone,
        },
        custom_data: {
          currency: 'KES',
          value: total,
          content_category: 'Business Guides',
          content_type: 'product',
          content_ids: products.map(p => p.product_id),
          num_items: products.length,
        }
      }]
    };

    await sendToConversionsAPI(eventData);
  }
};

// Track purchase event with email, phone number and click ID
export const trackPurchase = async (
  products: any[], 
  total: number, 
  orderId: string, 
  email: string, 
  clickId?: string,
  phoneNumber?: string
) => {
  console.log('🔄 Starting purchase tracking...');
  
  // Meta Pixel tracking (always track)
  if (typeof window !== 'undefined' && window.fbq) {
    console.log('📊 Tracking purchase with Meta Pixel...');
    const eventId = `purchase_${orderId}`;
    const hashedEmail = await hashData(email);
    const hashedPhone = phoneNumber ? await hashData(formatPhoneNumber(phoneNumber)) : undefined;
    // Build/obtain fbc in the correct format
    let fbc: string | null = null;
    // Prefer provided clickId (fbclid), else look in URL/cookies
    const urlParams = new URLSearchParams(window.location.search);
    const fbclidFromUrl = urlParams.get('fbclid');
    const storedUtm = getUTMParams();
    const fbclid = clickId || fbclidFromUrl || storedUtm?.fbclid || null;
    fbc = ensureFbc(fbclid) || getCookie(FBC_COOKIE_NAME);
    
    window.fbq('track', 'Purchase', {
      content_category: 'Business Guides',
      content_type: 'product',
      value: total,
      currency: 'KES',
      content_ids: products.map(p => p.product_id),
      num_items: products.length,
      order_id: orderId,
    }, { 
      eventID: eventId,
      em: hashedEmail,
      ...(hashedPhone && { ph: hashedPhone }),
      ...(fbc ? { fbc } : {})
    });
  }

  // Meta Conversions API tracking (only for Facebook/Instagram traffic)
  if (isFacebookTraffic()) {
    console.log('📊 Tracking purchase with Meta Conversions API...');
    const hashedEmail = await hashData(email);
    const hashedPhone = phoneNumber ? await hashData(formatPhoneNumber(phoneNumber)) : undefined;
    const eventId = `purchase_${orderId}`;
    // Ensure fbc for CAPI as well
    const urlParams = new URLSearchParams(window.location.search);
    const fbclidFromUrl = urlParams.get('fbclid');
    const storedUtm = getUTMParams();
    const fbclid = clickId || fbclidFromUrl || storedUtm?.fbclid || null;
    const fbc = ensureFbc(fbclid) || getCookie(FBC_COOKIE_NAME);
    
    const eventData = {
      data: [{
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: window.location.href,
        action_source: 'website',
        user_data: {
          em: hashedEmail,
          ...(hashedPhone && { ph: hashedPhone }),
          ...(fbc ? { fbc } : {}),
        },
        custom_data: {
          currency: 'KES',
          value: total,
          order_id: orderId,
          content_category: 'Business Guides',
          content_type: 'product',
          content_ids: products.map(p => p.product_id),
          num_items: products.length,
        }
      }]
    };

    await sendToConversionsAPI(eventData);
  }
  
  // Store conversion data in your own API for comparison
  console.log('📊 Storing conversion data in your API...');
  await storeConversionData(email, total, clickId);
  
  console.log('✅ Purchase tracking completed');
}; 