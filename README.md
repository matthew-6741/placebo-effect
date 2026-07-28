# 👻 The Placebo Effect

**Order the dopamine — skip the delivery.**

A complete food-delivery, rideshare, and travel-booking app where **nothing ever
arrives — by design**. You get the full ordering experience; no real money moves,
no real card data is ever collected, and 100% of orders are ghosted. That's the
feature, not the bug.

It began as a joke and turned into an exercise in finishing things. Everything a
real delivery app ships, this ships: an installable PWA with a service worker and
full offline support, an Electron desktop build with native notifications, an
interactive world map with animated flight paths, and an iOS home-screen widget —
in a single dependency-free HTML file.

**Built with:** vanilla JS · PWA · Service Workers · Canvas · Electron · `localStorage`

## Features

- 🍔 **Phantom Eats** — NYC & LA markets, ~23 cuisines organized by cultural
  region, real dish photos, market-specific menus
- 🚗 **Phantom Ride** — request a ride from a driver who is always "2 minutes away"
- ✈️ **Phantom Travel** — interactive world map, flight paths, boarding passes,
  gates that always change
- 💳 **Wallet** — mint imaginary cards (never asks for real card data)
- 🏆 **Squad** — S→D tier list of who ghost-orders the most
- 🧾 **Phantom receipts** — thermal-paper receipts with a Cuisine Passport
  collection tracker
- ⏱️ **Delivery speed** — Demo, 1× IRL (real time!), 1.5×, 2×
- 👤 **On-device login** — email + magic code, nothing ever transmitted
- 📱 **PWA** — installable, works offline, plus a Scriptable iPhone widget

## Run it

No build step. Either open `index.html` directly, or:

```bash
python3 -m http.server 4137
# → http://localhost:4137/index.html
```

## Files

| File | What it is |
|---|---|
| `index.html` | The entire app (HTML + CSS + JS) |
| `sw.js` | Service worker (offline cache — bump `CACHE` version on changes) |
| `manifest.webmanifest` | PWA manifest |
| `icons/`, `icon.svg` | App icons |
| `phantom-widget.js` | Scriptable iPhone home-screen widget |
| `privacy-policy.html` | Privacy policy |
| `APP-STORE-READINESS.md` | Everything needed to ship to app stores later |

## Privacy

Everything stays on-device (`localStorage`). No servers, no analytics, no
accounts, no real payments. Food/city photos are anonymous hotlinks to
TheMealDB and Wikimedia Commons.

---

*Phantom is a placebo. Purely for the dopamine.* 👻
