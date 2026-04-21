const COOKIE_NAME = "jwt";
const COOKIE_URLS = [
  "https://toolkit.co",
  "https://www.toolkit.co",
  "https://auth.toolkit.co"
];

async function findJwt() {
  for (const url of COOKIE_URLS) {
    const c = await chrome.cookies.get({ url, name: COOKIE_NAME });
    if (c && c.value) return c.value;
  }
  const all = await chrome.cookies.getAll({ name: COOKIE_NAME });
  const best = all.find(c => /toolkit\.co$/.test(c.domain.replace(/^\./, "")));
  return best ? best.value : null;
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "GET_JWT") {
    findJwt().then(jwt => sendResponse({ jwt })).catch(err => sendResponse({ error: String(err) }));
    return true;
  }
});
