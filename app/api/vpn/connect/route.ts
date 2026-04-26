import { NextResponse } from 'next/server';
import { generateStealthProxy } from '@/lib/decodoClient';

export async function POST(request: Request) {
  console.log("🟢 [BACKEND] Received VPN Connect Request");

  try {
    const { countryCode } = await request.json();
    console.log(`🟢 [BACKEND] Requested Country Code: ${countryCode}`);

    // 1. Check API Key
    const apiKey = request.headers.get('x-napi-key');
    if (apiKey !== 'napster-master-key') {
      console.error("🔴 [BACKEND FATAL] Invalid API Key provided by client:", apiKey);
      return NextResponse.json({ error: 'Unauthorized service' }, { status: 401 });
    }
    console.log("🟢 [BACKEND] VIP Extension Key Accepted.");

    // 2. Fetch Proxy Credentials
    console.log("🟢 [BACKEND] Attempting to generate proxy credentials...");
    const proxyDetails = await generateStealthProxy('extension-user-001', countryCode);
    
    if (!proxyDetails.proxyHost || !proxyDetails.proxyUsername) {
      console.error("🔴 [BACKEND FATAL] Proxy generator failed to return valid credentials.");
      throw new Error("Proxy credentials missing");
    }
    console.log("🟢 [BACKEND] Proxy credentials successfully generated.");

    // 3. Return Success
    console.log("🟢 [BACKEND] Sending credentials back to Chrome Extension.");
    return NextResponse.json({
      success: true,
      connection: proxyDetails,
    });

  } catch (error: any) {
    // THE ULTIMATE BUG CATCHER
    console.error("🔴 [BACKEND CRASH] An unexpected error occurred:", error.message);
    console.error("🔴 [STACK TRACE]:", error.stack);
    
    return NextResponse.json({ 
      error: 'Failed to establish connection', 
      details: error.message 
    }, { status: 500 });
  }
}