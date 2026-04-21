# Swagger Boost

Chrome extension that adds a **Set JWT Auth** button next to the green Authorize button on Swagger UI pages. It reads a JWT cookie from a configured domain and authorizes the Swagger page in one click.

## Why

Bearer-auth Swagger pages require pasting a JWT into the Authorize dialog every time it expires. This saves the lookup.

## Install (unpacked)

1. Clone the repo.
2. Open `chrome://extensions` and toggle **Developer mode**.
3. Click **Load unpacked** and select this folder.
4. Right-click the extension icon → **Options** and configure:
   - **Cookie name** — the JWT cookie's name (default: `jwt`)
   - **Cookie URLs** — one per line, origins the extension reads the cookie from (e.g. `https://auth.example.com`)
   - **Swagger page match patterns** — one per line, pages where the button should be injected (e.g. `https://*.example.com/swagger/*`)
5. Click **Save**. Chrome will prompt to allow access to the hosts you listed — approve it.
6. Log in at the auth site so the cookie is set.
7. Open a configured Swagger page and click **Set JWT Auth** next to Authorize.

## How it works

- The extension ships with no static host permissions. On save, the options page requests access to the hosts you configured via `chrome.permissions.request`.
- The service worker calls `chrome.scripting.registerContentScripts` with your match patterns, so the content script only injects on pages you've granted access to.
- On button click, the service worker reads the configured cookie via `chrome.cookies.get` and returns it to the page.
- The content script calls Swagger UI's `authActions.authorize` with the token, and also copies it to the clipboard as a fallback.

## Files

- `manifest.json` — MV3 manifest, `optional_host_permissions` set to `https://*/*`
- `background.js` — service worker; reads the JWT and registers content scripts from stored config
- `content.js` — injects the button into Swagger UI and calls `authActions.authorize`
- `options.html` / `options.js` — settings page (cookie name, cookie URLs, Swagger match patterns, stored via `chrome.storage.sync`)

## Notes

- The extension only works when the JWT cookie is **not** `HttpOnly`. Check DevTools → Application → Cookies.
- Supports OpenAPI `http` + `bearer` security schemes. For `apiKey` schemes, the clipboard fallback lets you paste into the Authorize dialog manually.
- To revoke access to a previously-granted host, use `chrome://extensions` → Details → Site access.
