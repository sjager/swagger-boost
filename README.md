# Swagger JWT Auto-Auth

Chrome extension that adds a **Set JWT Auth** button next to the green Authorize button on Swagger UI pages. It reads your JWT cookie (from a sibling auth domain like `toolkit.co`) and authorizes the Swagger page in one click.

## Why

Bearer-auth Swagger pages require pasting a JWT into the Authorize dialog every time it expires. This saves the lookup.

## Install (unpacked)

1. Clone the repo.
2. Open `chrome://extensions` and toggle **Developer mode**.
3. Click **Load unpacked** and select this folder.
4. Log in at the auth site (e.g., `https://toolkit.co`) so the `jwt` cookie is set.
5. Open any supported Swagger page and click **Set JWT Auth**.

## Supported pages

Configured via `manifest.json`:

- `https://*.toolkit.co/swagger/*`
- `https://*.tk.dev/swagger/*`

Add additional hosts to `host_permissions` and `content_scripts.matches`, then reload the extension.

## Cookie

The extension reads a cookie named `jwt` from `toolkit.co` (and related subdomains). Adjust `COOKIE_NAME` / `COOKIE_URLS` in `background.js` if yours differs.

## Files

- `manifest.json` — MV3 manifest, permissions, content-script matches
- `background.js` — service worker; reads the JWT via `chrome.cookies.get`
- `content.js` — injects the button into Swagger UI and calls `authActions.authorize`
