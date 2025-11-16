// Order Management API Integration (disabled - external backend removed)
// const BASE_URL = 'https://shared-backend-bbb0ec9bc43a.herokuapp.com/api';

export interface CreateOrderRequest {
  phone_number: string;
  email?: string;
  products: string;
  date_time: string;
  order_id: string;
  source: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message?: string;
  error?: string;
  order?: {
    id: string;
    order_id: string;
    phone_number: string;
    email?: string;
    products: string;
    products_list: string[];
    date_time: string;
    source: string;
    created_at: string;
    updated_at: string;
  };
}

export interface UpdateOrderRequest {
  order_id: string;
  email: string;
}

export interface UpdateOrderResponse {
  success: boolean;
  message?: string;
  error?: string;
  order?: {
    id: string;
    order_id: string;
    phone_number: string;
    email: string;
    products: string;
    products_list: string[];
    date_time: string;
    source: string;
    created_at: string;
    updated_at: string;
  };
}

export const createOrder = async (_orderData: CreateOrderRequest): Promise<CreateOrderResponse> => {
  // Disabled per request
  return { success: false, message: 'Order creation disabled' };
};

export const updateOrderEmail = async (_orderData: UpdateOrderRequest): Promise<UpdateOrderResponse> => {
  // Disabled per request
  return { success: false, message: 'Order update disabled' };
};