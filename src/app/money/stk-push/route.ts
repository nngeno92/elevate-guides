import { NextRequest, NextResponse } from 'next/server';

// Mark this route as dynamic since it makes external API calls
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const phone_number = body.phone_number;
    const amount = body.amount;
    const account_reference = body.account_reference || '';
    const transaction_desc = body.transaction_desc || 'Payment';
    
    // Validate required fields
    if (!phone_number || !amount) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'phone_number and amount are required' 
        },
        { status: 400 }
      );
    }

    // Validate phone number format (Kenyan format)
    let formattedPhoneNumber = phone_number;
    if (!phone_number.startsWith('254')) {
      if (phone_number.startsWith('0')) {
        formattedPhoneNumber = '254' + phone_number.slice(1);
      } else if (phone_number.startsWith('+254')) {
        formattedPhoneNumber = phone_number.slice(1);
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid phone number format. Use Kenyan format (254XXXXXXXXX)' 
          },
          { status: 400 }
        );
      }
    }

    // Validate amount
    let amountValue: number;
    try {
      amountValue = parseFloat(amount);
      if (amountValue <= 0) {
        throw new Error("Amount must be positive");
      }
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid amount. Must be a positive number' 
        },
        { status: 400 }
      );
    }

    // Make request to Django backend
    const djangoResponse = await fetch('https://shared-backend-bbb0ec9bc43a.herokuapp.com/money/stk-push/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: formattedPhoneNumber,
        amount: amountValue,
        account_reference,
        transaction_desc
      }),
    });

    const result = await djangoResponse.json();

    // Return the Django response directly
    return NextResponse.json(result, { status: djangoResponse.status });

  } catch (error) {
    console.error('MPESA API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 