// lib/decodoClient.ts

// Pulling your keys straight from .env.local
const DECODO_USERNAME = process.env.DECODO_API_USERNAME || '';
const DECODO_PASSWORD = process.env.DECODO_API_PASSWORD || '';

// Standard residential entry point
const PROXY_HOST = 'gate.decodo.com'; 
const PROXY_PORT = 7000;

export async function generateStealthProxy(userId: string, countryCode: string, existingSessionId?: string) {
  if (!DECODO_USERNAME || !DECODO_PASSWORD) {
    console.error("ALERT: Missing Decodo API credentials in .env.local");
  }

  // If they don't have a Sticky IP session, we generate a new random 8-character string.
  // This string forces Decodo to assign a static IP for this specific user.
  const sessionId = existingSessionId || Math.random().toString(36).substring(2, 10);
  
  // Format: user-{username}-country-{countryCode}-session-{sessionId}
  // We force lowercase on the country code because Decodo's routing servers expect it (e.g., 'us', 'gb', 'gh')
  const formattedCountry = countryCode.toLowerCase();
  const formattedUsername = `user-${DECODO_USERNAME}-country-${formattedCountry}-session-${sessionId}`;

  return {
    proxyHost: PROXY_HOST,
    proxyPort: PROXY_PORT,
    proxyUsername: formattedUsername,
    proxyPassword: DECODO_PASSWORD,
    sessionId: sessionId
  };
}