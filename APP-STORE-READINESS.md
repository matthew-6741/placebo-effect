# Phantom — App Store Readiness Kit

> **Status (2026-06-30): shipping as a website for now.** This file saves everything
> needed to package Phantom as a real iOS/Android app later. Nothing here changes the
> live site — it's a guide + checklist for future-you (or a developer you hand it to).

---

## 1. What exists today (the code to preserve)

```
~/phantom-app/
├── index.html            ← the entire app (HTML + CSS + JS, no build step)
└── phantom-widget.js      ← Scriptable iPhone widget (separate, optional)
```

Plus this readiness kit:
```
├── APP-STORE-READINESS.md ← you are here
└── manifest.webmanifest   ← ready-to-use PWA manifest (not yet linked into index.html)
```

**Features built:** Phantom Eats (NYC/LA markets, region→cuisine menu w/ photos),
Phantom Ride, Wallet (placebo), Squad tier list, Travel (world map + booking),
optional Google Calendar sync. All state in `localStorage`. Photos load from Wikimedia Commons
and TheMealDB, with per-photo authors and licenses listed in `credits.html`.

To run locally: open `index.html` in a browser, or
`cd ~/phantom-app && python3 -m http.server 4137` → http://localhost:4137/index.html

---

## 2. Recommended path to an app: **Capacitor** (keeps all current code)

Capacitor wraps the existing HTML/CSS/JS in a native iOS + Android shell you can submit.

```bash
cd ~/phantom-app
mkdir www && cp index.html www/            # Capacitor serves from a web dir
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap init Phantom com.YOURNAME.phantom --web-dir=www
npx cap add ios          # needs a Mac + Xcode
npx cap add android      # needs Android Studio
npx cap open ios         # build/sign/submit from Xcode
npx cap open android     # build AAB from Android Studio
```

After any code change: `cp index.html www/ && npx cap sync`.

(The iPhone **home-screen widget** is native Swift no matter what — add a *Widget Extension*
target in Xcode and port the look of `phantom-widget.js` to SwiftUI/WidgetKit.)

**Even faster alternative:** host the site, run it through **PWABuilder.com**, and it
generates store-ready iOS/Android/Windows packages for you.

---

## 3. Apple App Store — steps & requirements
- **Apple Developer Program:** $99/year. **Mac + Xcode required.**
- Wrap with Capacitor → open in Xcode → enable **Automatic Signing**.
- Assets: app icon set, launch screen, **screenshots** for each required device size.
- **App Store Connect** listing: name, subtitle, description, keywords, category,
  **privacy policy URL**, support URL, **age rating**, **privacy "nutrition labels."**
- Add Calendar permission string in Info.plist: `NSCalendarsUsageDescription`.
- Upload via Xcode → test in **TestFlight** → **Submit for review** (~24–48 hrs).

## 4. Google Play — steps & requirements
- **Play Developer account:** $25 one-time. No Mac needed.
- Build an **AAB** in Android Studio.
- Play Console: store listing, **content rating** questionnaire, **Data Safety** form,
  privacy policy.
- ⚠️ New personal accounts: **closed test, 20 testers, 14 days** before production.
- Submit → review (hours to a few days).

---

## 5. ⚠️ Pre-submission checklist — review risks SPECIFIC to Phantom

### ✅ Already fixed in the code (done 2026-06-30)
- [x] **Removed the real credit-card field in Wallet.** No more card-number / CVC / expiry
      inputs. The wallet now *mints fake cards* (random last-4, generated for show only) and
      stores no real card data. Only an optional "name on card" field remains.
- [x] **Dropped Apple Pay branding** → renamed to "Phantom Pay" with a 👻 (no Apple logo/name).
- [x] **Clear novelty labeling:** a first-run disclaimer overlay ("Phantom is just for fun —
      nothing is real, no payment is ever taken") + section/footer copy.
- [x] **Removed trademark in UI:** "Lord DoorDash" → "Lord Ghostmore." Full sweep clean
      (no Uber/DoorDash/Grubhub/Lyft/Apple Pay strings remain).
- [x] **Added a privacy policy** → `privacy-policy.html`, now linked in the app footer.
- [x] **App icons generated** → `icon.svg` (source) + `icons/icon-1024|512|192|180.png`
      (use icon-1024.png for the App Store, the rest for PWA/touch icons).
- [x] **PWA: installable + offline.** `manifest.webmanifest` linked, `sw.js` service worker
      caches the app shell (emoji fallbacks cover photos offline), iOS web-app meta tags added.
      This is the main code-level defense against the "repackaged website" rejection (4.2.3).

### ⏳ Still required at packaging/submission time (not code)
- [ ] **Host** `privacy-policy.html` at a public URL and add it to App Store Connect +
      Play Console.
- [ ] When you pick a **new app name**, update it in: `<title>`, the `.brand h1`, the
      intro-overlay heading, `apple-mobile-web-app-title` meta, and `manifest.webmanifest`
      (`name` + `short_name`). (Icon is a generic ghost, so it needs no text change.)
- [ ] **Disclose data use** (Apple privacy labels + Google Data Safety): no data collected;
      Calendar access optional/user-initiated; no accounts.
      **Analytics depends on how you ship it.** `assets/analytics.js` is scaffolding for
      Google Analytics 4 and is **inert while `GA_MEASUREMENT_ID` is an empty string** — no
      Google script loads and nothing is sent. Leave it empty and you can still answer
      "no data collected". If you ever fill that ID in, you must go back and declare
      **Analytics / Usage Data** and **Identifiers** on both forms, and the app becomes
      subject to Apple's App Tracking Transparency questions. Decide before you submit.
- [ ] **Account deletion.** Apple 5.1.1(v) requires in-app account deletion whenever an app offers
      account creation. The sign-in here is on-device only, and "Delete my data" in the footer (and on
      the privacy page) wipes everything — point the reviewer at it in App Review notes.
- [ ] **Photo licensing.** 126 photos come from Wikimedia Commons under CC/public-domain licenses and are
      credited in `credits.html`; 26 come from TheMealDB, which publishes no per-image license and asks
      for a paid Patreon tier for production use. Replace those 26 before shipping anything commercial.
- [ ] Generate **app icons** (1024², plus all sizes) and **store screenshots**.
- [ ] Set an appropriate **age rating**, and keep the listing wording as a *novelty/parody*
      app (don't compare it to real delivery brands).

---

## 6. When you're ready (quick start)
1. Decide: Capacitor (keep code) or PWABuilder (fastest).
2. Do the §5 checklist — **especially remove the real card field.**
3. Buy the dev accounts (Apple $99/yr, Google $25 once).
4. Generate icons + screenshots, write the listing, host a privacy policy.
5. Build → TestFlight / closed test → submit.

*Ask Claude to: make the Wallet review-safe, scaffold the Capacitor project,
generate the PWA icons, or wire in `manifest.webmanifest` — whenever you pick this back up.*
