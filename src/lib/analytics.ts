// Meta Pixel Event Tracking Utility

declare global {
  interface Window {
    fbq: any;
  }
}

// Meta Conversions API Configuration
const ACCESS_TOKEN = 'EAARgBkBM2R4BPc5VZC7o0HXx1b3XX12NndZCUrZATYOo5TITwr5xZCXXNHE3GDsFNgzCnZC4MCod03AZAEQtyCRvcqXV0OLdNiORdTaVyc1ly57i5N7aLjmKQkdSKCZCALavY1QCxHImaMPqX9KZBbPLQnweFXx7gyHnExdXgMowUXq9YZCyQrFiPt598XPgWv6QYxQZDZD';
const PIXEL_ID = '1904667380084931';

// UTM Cookie Management
const UTM_COOKIE_NAME = 'bik_utm_params';
const UTM_COOKIE_EXPIRY_DAYS = 30;

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

// Track purchase event with email and click ID
export const trackPurchase = async (
  products: any[], 
  total: number, 
  orderId: string, 
  email: string, 
  clickId?: string
) => {
  // Meta Pixel tracking (always track)
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      content_category: 'Business Guides',
      content_type: 'product',
      value: total,
      currency: 'KES',
      content_ids: products.map(p => p.product_id),
      num_items: products.length,
      order_id: orderId,
    });
  }

  // Meta Conversions API tracking (only for Facebook/Instagram traffic)
  if (isFacebookTraffic()) {
    const hashedEmail = await hashData(email);
    
    const eventData = {
      data: [{
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: `purchase_${orderId}`,
        event_source_url: window.location.href,
        action_source: 'website',
        user_data: {
          em: hashedEmail,
          ...(clickId && { external_id: clickId }),
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
}; 