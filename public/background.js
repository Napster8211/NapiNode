// public/background.js

// Listen for messages from our React Dashboard
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "CONNECT_VPN") {
    
    // The credentials passed from our backend
    const { host, port, username, password } = request.credentials;

    // 1. Tell Chrome to route all traffic through NapiNode
    var config = {
      mode: "fixed_servers",
      rules: {
        singleProxy: {
          scheme: "http",
          host: host,
          port: parseInt(port)
        },
        bypassList: ["localhost", "127.0.0.1"]
      }
    };

    chrome.proxy.settings.set(
      { value: config, scope: "regular" },
      function () {
        console.log("NapiNode Stealth Active.");
      }
    );

    // 2. Automatically answer the password prompt Decodo requires
    chrome.webRequest.onAuthRequired.addListener(
      function (details) {
        return {
          authCredentials: {
            username: username,
            password: password
          }
        };
      },
      { urls: ["<all_urls>"] },
      ["asyncBlocking"]
    );

    sendResponse({ status: "connected" });
  }

  if (request.action === "DISCONNECT_VPN") {
    // Revert Chrome back to the user's normal Wi-Fi
    chrome.proxy.settings.clear({ scope: "regular" });
    sendResponse({ status: "disconnected" });
  }

  return true; 
});