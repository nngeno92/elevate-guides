import { NextRequest, NextResponse } from 'next/server';

// Mark this route as dynamic since it uses request.url
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkout_request_id = searchParams.get('checkout_request_id');

    if (!checkout_request_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'checkout_request_id is required'
        },
        { status: 400 }
      );
    }

    // Make request to Django backend
    const djangoResponse = await fetch(`https://shared-backend-bbb0ec9bc43a.herokuapp.com/money/transaction-status/?checkout_request_id=${checkout_request_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await djangoResponse.json();

    // Transform the Django response to match the expected frontend format
    if (result.success && result.transaction) {
      const transaction = result.transaction;
      
      // Map the nested transaction data to the expected format
      const transformedResult = {
        success: true,
        transaction_id: transaction.id,
        checkout_request_id: transaction.checkout_request_id,
        status: transaction.status,
        amount: transaction.amount?.toString() || '0',
        phone_number: transaction.phone_number,
        created_at: transaction.created_at,
        completed_at: transaction.completed_at,
        mpesa_receipt_number: transaction.mpesa_receipt_number,
        result_code: transaction.result_code,
        result_description: transaction.result_description,
        is_completed: transaction.status !== 'PENDING',
        is_successful: transaction.status === 'SUCCESS'
      };

      return NextResponse.json(transformedResult, { status: djangoResponse.status });
    }

    // Return the Django response directly for error cases
    return NextResponse.json(result, { status: djangoResponse.status });

  } catch (error) {
    console.error('Transaction Status API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
} 