import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { generateStealthProxy } from '@/lib/decodoClient';

export async function POST(request: Request) {
  try {
    const { countryCode } = await request.json();
    const cookieStore = await cookies();
    
    // 1. Initialize Supabase Admin Client for the backend
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {} // Not setting cookies in this route
        },
      }
    );

    // 2. Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 3. The "Sticky IP" Logic: Check if they already have an active node in this country
    let activeSessionId = null;
    const { data: existingSticky } = await supabase
      .from('sticky_ips')
      .select('decodo_session_id')
      .eq('user_id', user.id)
      .eq('country_code', countryCode)
      .gt('reserved_until', new Date().toISOString()) // Ensure it hasn't expired
      .single();

    if (existingSticky) {
      activeSessionId = existingSticky.decodo_session_id;
    }

    // 4. Generate the Proxy Credentials via Decodo
    const proxyDetails = await generateStealthProxy(user.id, countryCode, activeSessionId || undefined);

    // 5. If this is a new IP session, save it to the Sticky IPs table
    if (!existingSticky) {
      await supabase.from('sticky_ips').insert({
        user_id: user.id,
        country_code: countryCode,
        decodo_session_id: proxyDetails.sessionId,
        target_use_case: 'stealth_browsing',
        // Lock this IP for 24 hours
        reserved_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() 
      });
    }

    // 6. Log the active tunnel session
    const { data: tunnelData } = await supabase.from('active_tunnels').insert({
      user_id: user.id,
      status: 'active'
    }).select('id').single();

    // 7. Return the credentials to the frontend
    return NextResponse.json({
      success: true,
      tunnelId: tunnelData?.id,
      connection: proxyDetails,
      message: existingSticky ? 'Reconnected to Sticky IP' : 'New Stealth Node Deployed'
    });

  } catch (error: any) {
    console.error('VPN Connect Error:', error);
    return NextResponse.json({ error: 'Failed to establish connection' }, { status: 500 });
  }
}