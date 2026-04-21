(function () {
  const BTN_ID = "jwt-grab-btn";

  function authorizeSwagger(jwt) {
    const ui = window.ui;
    if (!ui?.authActions) return false;
    const schemes = ui.specSelectors?.securityDefinitions?.()?.toJS?.() || {};
    const names = Object.keys(schemes);
    if (!names.length) return false;
    for (const name of names) {
      ui.authActions.authorize({ [name]: { schema: schemes[name], value: jwt } });
    }
    return true;
  }

  function showToast(msg, ok = true) {
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = `position:fixed;top:16px;right:16px;z-index:99999;padding:10px 14px;
      background:${ok ? "#2e7d32" : "#c62828"};color:#fff;font:14px system-ui;border-radius:6px;
      box-shadow:0 2px 8px rgba(0,0,0,.2)`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  }

  function addButton() {
    const authorizeBtn = document.querySelector(".swagger-ui .scheme-container .btn.authorize")
      || document.querySelector(".swagger-ui .auth-wrapper .btn.authorize");
    const srcSvg = authorizeBtn?.querySelector("svg");
    let existing = document.getElementById(BTN_ID);
    const preferredParent = authorizeBtn?.parentElement || null;
    if (existing) {
      if (preferredParent && existing.parentElement !== preferredParent) {
        preferredParent.insertBefore(existing, authorizeBtn.nextSibling);
      }
      if (srcSvg && !existing.querySelector("svg")) {
        existing.appendChild(srcSvg.cloneNode(true));
      }
      return;
    }
    if (!authorizeBtn || !preferredParent) return;
    const host = preferredParent;

    const btn = document.createElement("button");
    btn.id = BTN_ID;
    btn.className = "btn authorize unlocked";
    btn.style.cssText = "margin-left:10px;vertical-align:middle;";
    const label = document.createElement("span");
    label.textContent = "Set JWT Auth";
    btn.appendChild(label);
    const svg = authorizeBtn?.querySelector("svg");
    if (svg) btn.appendChild(svg.cloneNode(true));
    btn.onclick = async () => {
      btn.disabled = true;
      label.textContent = "Fetching…";
      try {
        const res = await chrome.runtime.sendMessage({ type: "GET_JWT" });
        if (!res?.jwt) {
          const loginUrl = res?.loginUrl;
          showToast(loginUrl ? `No JWT cookie found. Log in at ${loginUrl} first.` : "No JWT cookie found. Configure Cookie URLs in extension options.", false);
          if (loginUrl) window.open(loginUrl, "_blank");
          return;
        }
        const ok = authorizeSwagger(res.jwt);
        navigator.clipboard.writeText(res.jwt).catch(() => {});
        showToast(ok ? "Authorized — token also copied" : "Copied JWT to clipboard");
      } catch (e) {
        showToast("Error: " + e.message, false);
      } finally {
        btn.disabled = false;
        label.textContent = "Set JWT Auth";
      }
    };
    if (authorizeBtn) {
      host.insertBefore(btn, authorizeBtn.nextSibling);
    } else {
      host.appendChild(btn);
    }
  }

  new MutationObserver(addButton).observe(document.documentElement, { childList: true, subtree: true });
  addButton();
})();
