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
    console.log('🚀 Creating order with data:', orderData);
    console.log('📡 Making request to:', `${BASE_URL}/orders/create/`);
    
    const response = await fetch(`${BASE_URL}/orders/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('📥 Response body:', result);
    
    if (!response.ok) {
      console.error('❌ HTTP error:', response.status, response.statusText);
      return {
        success: false,
        error: `HTTP ${response.status}: ${result.error || response.statusText}`,
      };
    }

    return result;
  } catch (error) {
    console.error('❌ Network error creating order:', error);
    return {
      success: false,
      error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

export const updateOrderEmail = async (orderData: UpdateOrderRequest): Promise<UpdateOrderResponse> => {
  try {
    console.log('📧 Updating order email with data:', orderData);
    console.log('📡 Making request to:', `${BASE_URL}/orders/update/`);
    
    const response = await fetch(`${BASE_URL}/orders/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('📥 Response body:', result);
    
    if (!response.ok) {
      console.error('❌ HTTP error:', response.status, response.statusText);
      return {
        success: false,
        error: `HTTP ${response.status}: ${result.error || response.statusText}`,
      };
    }

    return result;
  } catch (error) {
    console.error('❌ Network error updating order email:', error);
    return {
      success: false,
      error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}; 