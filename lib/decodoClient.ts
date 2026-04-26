// lib/decodoClient.ts

// We are now pulling ALL proxy details dynamically from Vercel's environment variables
const PROXY_HOST = process.env.PROXY_HOST || ''; 
const PROXY_PORT = parseInt(process.env.PROXY_PORT || '80', 10);
const PROXY_USERNAME = process.env.PROXY_USERNAME || '';
const PROXY_PASSWORD = process.env.PROXY_PASSWORD || '';

export async function generateStealthProxy(userId: string, countryCode: string, existingSessionId?: string) {
  if (!PROXY_USERNAME || !PROXY_PASSWORD) {
    console.error("ALERT: Missing Proxy API credentials in Vercel");
  }

  const sessionId = existingSessionId || Math.random().toString(36).substring(2, 10);
  
  // NOTE: Webshare's free tier doesn't support dynamic country targeting like Decodo does.
  // It will just assign you one of their random free IPs. 
  // For this test, we just want to prove the tunnel works!
  return {
    proxyHost: PROXY_HOST,
    proxyPort: PROXY_PORT,
    proxyUsername: PROXY_USERNAME,
    proxyPassword: PROXY_PASSWORD,
    sessionId: sessionId
  };
}