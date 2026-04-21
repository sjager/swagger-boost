const DEFAULTS = {
  cookieName: "jwt",
  cookieUrls: [],
  swaggerMatches: []
};

const CS_ID = "swagger-boost-cs";

function getConfig() {
  return new Promise((resolve) => chrome.storage.sync.get(DEFAULTS, resolve));
}

async function findJwt() {
  const { cookieName, cookieUrls } = await getConfig();
  for (const url of cookieUrls) {
    try {
      const c = await chrome.cookies.get({ url, name: cookieName });
      if (c?.value) return c.value;
    } catch (_) {}
  }
  return null;
}

async function registerScripts() {
  try {
    await chrome.scripting.unregisterContentScripts({ ids: [CS_ID] });
  } catch (_) {}

  const { swaggerMatches } = await getConfig();
  if (!swaggerMatches.length) return;

  const granted = [];
  for (const m of swaggerMatches) {
    try {
      if (await chrome.permissions.contains({ origins: [m] })) granted.push(m);
    } catch (_) {}
  }
  if (!granted.length) return;

  await chrome.scripting.registerContentScripts([{
    id: CS_ID,
    matches: granted,
    js: ["content.js"],
    runAt: "document_idle"
  }]);
}

chrome.runtime.onInstalled.addListener(registerScripts);
chrome.runtime.onStartup.addListener(registerScripts);
chrome.storage.onChanged.addListener(registerScripts);
chrome.permissions.onAdded.addListener(registerScripts);
chrome.permissions.onRemoved.addListener(registerScripts);

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "GET_JWT") {
    findJwt().then(jwt => sendResponse({ jwt })).catch(err => sendResponse({ error: String(err) }));
    return true;
  }
});
