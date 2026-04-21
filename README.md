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
   - **Cookie URLs** — one per line, the origins the extension should read the cookie from (e.g. `https://auth.example.com`)
5. Log in at the auth site so the cookie is set.
6. Open any Swagger UI page and click **Set JWT Auth** next to Authorize.

## How it works

- Matches any `https://*/swagger/*` page and injects a button into Swagger UI.
- On click, the service worker reads the configured cookie via `chrome.cookies.get` and returns it to the page.
- The content script calls Swagger UI's `authActions.authorize` with the token, and also copies it to the clipboard as a fallback.

## Files

- `manifest.json` — MV3 manifest
- `background.js` — service worker; reads the JWT via `chrome.cookies.get`
- `content.js` — injects the button into Swagger UI and calls `authActions.authorize`
- `options.html` / `options.js` — settings page (cookie name and URLs, stored via `chrome.storage.sync`)

## Notes

- The extension only works when the JWT cookie is **not** `HttpOnly`. Check DevTools → Application → Cookies.
- Supports OpenAPI `http` + `bearer` security schemes. For `apiKey` schemes, the clipboard fallback lets you paste into the Authorize dialog manually.
