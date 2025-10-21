export interface Review {
  name: string;
  stars: number;
  review_text: string;
}

export interface Product {
  product_id: string;
  product_name: string;
  short_description: string;
  description: string;
  price: number;
  sale_price: number;
  product_image: string;
  wordpress_product_link: string;
  google_file_link: string;
  google_download_link: string;
  vsl?: string;
  reviews: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface MpesaPaymentRequest {
  phone_number: string;
  amount: number;
  account_reference: string;
  transaction_desc: string;
}

export interface MpesaPaymentResponse {
  success: boolean;
  transaction_id?: string;
  merchant_request_id?: string;
  checkout_request_id?: string;
  response_code?: string;
  response_description?: string;
  customer_message?: string;
  error?: string;
}

export interface MpesaTransactionStatusResponse {
  success: boolean;
  transaction_id?: string;
  checkout_request_id?: string;
  status?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'TIMEOUT';
  amount?: string;
  phone_number?: string;
  created_at?: string;
  completed_at?: string;
  mpesa_receipt_number?: string;
  result_code?: string;
  result_description?: string;
  is_completed?: boolean;
  is_successful?: boolean;
  error?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  phone_number: string;
  status: 'pending' | 'paid' | 'failed';
  transaction_id?: string;
  created_at: string;
} 