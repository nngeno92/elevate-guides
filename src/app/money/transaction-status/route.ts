import { NextRequest, NextResponse } from 'next/server';

// Mark this route as dynamic since it uses request.url
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Disabled per request - external backend integration removed
    return NextResponse.json(
      {
        success: false,
        error: 'Transaction status disabled'
      },
      { status: 503 }
    );

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