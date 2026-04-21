const DEFAULTS = {
  cookieName: "jwt",
  cookieUrls: [],
  swaggerMatches: []
};

const $ = (id) => document.getElementById(id);

function split(s) {
  return s.split("\n").map(x => x.trim()).filter(Boolean);
}

function toOrigin(url) {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}/*`;
  } catch {
    return null;
  }
}

function load() {
  chrome.storage.sync.get(DEFAULTS, (cfg) => {
    $("cookieName").value = cfg.cookieName;
    $("cookieUrls").value = cfg.cookieUrls.join("\n");
    $("swaggerMatches").value = cfg.swaggerMatches.join("\n");
  });
}

async function save() {
  const cookieName = $("cookieName").value.trim();
  const cookieUrls = split($("cookieUrls").value);
  const swaggerMatches = split($("swaggerMatches").value);
  if (!cookieName) return flash("Cookie name required", false);

  const origins = [
    ...cookieUrls.map(toOrigin).filter(Boolean),
    ...swaggerMatches
  ];

  if (origins.length) {
    try {
      const granted = await chrome.permissions.request({ origins });
      if (!granted) return flash("Permission denied", false);
    } catch (e) {
      return flash("Invalid pattern: " + e.message, false);
    }
  }

  chrome.storage.sync.set({ cookieName, cookieUrls, swaggerMatches }, () => flash("Saved", true));
}

function reset() {
  chrome.storage.sync.set(DEFAULTS, () => { load(); flash("Defaults restored", true); });
}

function flash(msg, ok) {
  const el = $("status");
  el.textContent = msg;
  el.style.color = ok ? "#2e7d32" : "#c62828";
  setTimeout(() => (el.textContent = ""), 2500);
}

document.addEventListener("DOMContentLoaded", load);
$("save").addEventListener("click", save);
$("reset").addEventListener("click", reset);
