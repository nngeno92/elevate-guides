import { NextRequest, NextResponse } from 'next/server';

// Mark this route as dynamic since it makes external API calls
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Disabled per request - external backend integration removed
    return NextResponse.json(
      {
        success: false,
        error: 'STK push disabled'
      },
      { status: 503 }
    );

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