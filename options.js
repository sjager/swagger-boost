const DEFAULTS = {
  cookieName: "jwt",
  cookieUrls: [
    "https://toolkit.co",
    "https://auth.toolkit.co"
  ]
};

const $ = (id) => document.getElementById(id);

function load() {
  chrome.storage.sync.get(DEFAULTS, (cfg) => {
    $("cookieName").value = cfg.cookieName;
    $("cookieUrls").value = cfg.cookieUrls.join("\n");
  });
}

function save() {
  const cookieName = $("cookieName").value.trim();
  const cookieUrls = $("cookieUrls").value.split("\n").map(s => s.trim()).filter(Boolean);
  if (!cookieName || !cookieUrls.length) {
    flash("Cookie name and at least one URL required", false);
    return;
  }
  chrome.storage.sync.set({ cookieName, cookieUrls }, () => flash("Saved", true));
}

function reset() {
  chrome.storage.sync.set(DEFAULTS, () => { load(); flash("Defaults restored", true); });
}

function flash(msg, ok) {
  const el = $("status");
  el.textContent = msg;
  el.style.color = ok ? "#2e7d32" : "#c62828";
  setTimeout(() => (el.textContent = ""), 2000);
}

document.addEventListener("DOMContentLoaded", load);
$("save").addEventListener("click", save);
$("reset").addEventListener("click", reset);
