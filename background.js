const DEFAULTS = {
  cookieName: "jwt",
  cookieUrls: [
    "https://toolkit.co",
    "https://auth.toolkit.co"
  ]
};

function getConfig() {
  return new Promise((resolve) => chrome.storage.sync.get(DEFAULTS, resolve));
}

async function findJwt() {
  const { cookieName, cookieUrls } = await getConfig();
  for (const url of cookieUrls) {
    const c = await chrome.cookies.get({ url, name: cookieName });
    if (c && c.value) return c.value;
  }
  return null;
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "GET_JWT") {
    findJwt().then(jwt => sendResponse({ jwt })).catch(err => sendResponse({ error: String(err) }));
    return true;
  }
});
