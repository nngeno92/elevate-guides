// Order Management API Integration

const BASE_URL = 'https://shared-backend-bbb0ec9bc43a.herokuapp.com/api';

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

export const createOrder = async (orderData: CreateOrderRequest): Promise<CreateOrderResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/orders/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: 'Failed to create order. Please try again.',
    };
  }
};

export const updateOrderEmail = async (orderData: UpdateOrderRequest): Promise<UpdateOrderResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/orders/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating order email:', error);
    return {
      success: false,
      error: 'Failed to update order email. Please try again.',
    };
  }
}; 