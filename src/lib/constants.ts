// Paystack Configuration
export const PAYSTACK_PUBLIC_KEY = 'pk_live_b7351f3660523ea719c304e53f58be27b32b72ed'; // Replace with your actual live public key

// Payment Configuration
export const PAYMENT_CONFIG = {
  currency: 'KES', // Kenyan Shilling
  country: 'KE',   // Kenya
  email: '',       // Will be set dynamically
  amount: 0,       // Will be set dynamically
  reference: '',   // Will be set dynamically
  callback_url: '', // Will be set dynamically
  channels: ['mobile_money','card', 'bank', 'ussd', 'qr', 'bank_transfer'],
  metadata: {
    custom_fields: []
  }
}; 

// Meta Pixel
export const META_PIXEL_ID = '1342776413993013';