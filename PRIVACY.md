# Privacy Policy

_Last updated: 2026-04-21_

Swagger Boost is a Chrome extension that helps developers authorize Swagger UI pages by reading a JWT cookie from a user-configured origin.

## Data the extension accesses

- **Cookies**: The extension reads a single cookie (name configured by the user, default `jwt`) from origins the user explicitly adds in the options page. No other cookies are read.
- **Page content**: The extension injects a small button into Swagger UI pages the user has configured match patterns for. It does not read or collect page content.

## Data the extension stores

- User configuration (cookie name, cookie origins, Swagger match patterns) is stored via `chrome.storage.sync`, which syncs across the user's signed-in Chrome installations.
- Cookie values, tokens, and browsing history are **not** stored.

## Data the extension transmits

- The JWT value is passed only to the Swagger UI page the user is currently viewing, so that page can authorize its own API requests.
- The extension does **not** send any data to the developer, any server, or any third party.

## Permissions and why they are needed

- `cookies` — to read the configured JWT cookie.
- `scripting` — to inject the "Set JWT Auth" button into configured Swagger UI pages.
- `storage` — to persist user configuration.
- `optional_host_permissions` (`https://*/*`) — requested per-host at runtime when the user saves configuration, so access is limited to hosts the user has explicitly approved.

## Changes to this policy

Updates to this policy will be committed to this repository. The "Last updated" date above reflects the latest revision.

## Contact

Issues and questions: https://github.com/sjager/swagger-boost/issues
