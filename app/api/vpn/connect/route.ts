import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { generateStealthProxy } from '@/lib/decodoClient';

export async function POST(request: Request) {
  try {
    const { countryCode } = await request.json();

    // --- NEW: Extension API Key Bypass ---
    const apiKey = request.headers.get('x-napi-key');
    let userId = 'extension-user-001'; // Default ID for extension requests
    let isExtension = apiKey === 'napster-master-key'; // Our secret VIP password

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} }
      }
    );

    // If it's NOT the extension, enforce normal Dashboard cookie login
    if (!isExtension) {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized service' }, { status: 401 });
      }
      userId = user.id; // Use the real user's database ID
    }
    // --------------------------------------------

    // The Sticky IP Logic
    let activeSessionId = null;
    const { data: existingSticky } = await supabase
      .from('sticky_ips')
      .select('decodo_session_id')
      .eq('user_id', userId)
      .eq('country_code', countryCode)
      .gt('reserved_until', new Date().toISOString())
      .single();

    if (existingSticky) {
      activeSessionId = existingSticky.decodo_session_id;
    }

    // Generate Proxy Credentials
    const proxyDetails = await generateStealthProxy(userId, countryCode, activeSessionId || undefined);

    // Save Sticky IP
    if (!existingSticky) {
      await supabase.from('sticky_ips').insert({
        user_id: userId,
        country_code: countryCode,
        decodo_session_id: proxyDetails.sessionId,
        target_use_case: 'stealth_browsing',
        reserved_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // Log the active tunnel
    const { data: tunnelData } = await supabase.from('active_tunnels').insert({
      user_id: userId,
      status: 'active'
    }).select('id').single();

    return NextResponse.json({
      success: true,
      tunnelId: tunnelData?.id,
      connection: proxyDetails,
    });

  } catch (error: any) {
    console.error('VPN Connect Error:', error);
    return NextResponse.json({ error: 'Failed to establish connection' }, { status: 500 });
  }
}