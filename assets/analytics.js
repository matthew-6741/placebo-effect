/* Google Analytics 4 + cookie consent — OFF until you add your Measurement ID.
 *
 * To turn analytics on:
 *   1. Create a GA4 property at https://analytics.google.com
 *   2. Copy its Measurement ID (looks like "G-XXXXXXXXXX")
 *   3. Paste it below and redeploy.
 *
 * While this is an empty string, no Google script is loaded, no cookies are set,
 * and no consent banner is shown (there is nothing to consent to).
 *
 * Once an ID is set, visitors see a consent banner with equally weighted
 * "Accept" and "Reject" buttons. Google's script only loads after "Accept".
 * Do Not Track / Global Privacy Control count as an automatic "Reject".
 * The choice is stored on-device as `phantomConsent` and can be changed any
 * time from any element with a `data-cookie-settings` attribute.
 *
 * If you enable this, update privacy-policy.html (#cookies) and the app-store
 * privacy answers in APP-STORE-READINESS.md — both currently say "off".
 */
const GA_MEASUREMENT_ID = "";

(function placeboConsent() {
  const KEY = "phantomConsent";
  // Resolved against this script's own URL, so the link works from any page depth
  // and under a sub-path host like github.io/placebo-effect/.
  const PRIVACY_URL = new URL("../privacy-policy.html#cookies",
    (document.currentScript && document.currentScript.src) || location.href).href;
  const enabled = !!GA_MEASUREMENT_ID;
  const privacySignal = navigator.doNotTrack === "1" || window.doNotTrack === "1" ||
                        navigator.msDoNotTrack === "1" || navigator.globalPrivacyControl === true;

  const read = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const write = (v) => { try { localStorage.setItem(KEY, v); } catch (e) {} };

  let loaded = false;
  function loadGA() {
    if (loaded) return;
    loaded = true;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  // Expire Google Analytics cookies (_ga, _ga_<id>) on this host and its parent domains.
  function clearGACookies() {
    const names = document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => /^_ga(_|$)/.test(n));
    const parts = location.hostname.split(".");
    const domains = [""];
    for (let i = 0; i < parts.length - 1; i++) domains.push("; domain=." + parts.slice(i).join("."));
    names.forEach((n) => domains.forEach((d) => {
      document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + d;
    }));
  }

  function injectStyles() {
    if (document.getElementById("consentStyles")) return;
    const st = document.createElement("style");
    st.id = "consentStyles";
    st.textContent = `
      .consent-banner { position: fixed; left: 16px; right: 16px; bottom: 16px; z-index: 90;
        max-width: 560px; margin: 0 auto; background: var(--card, #fff); color: var(--text, #2b211b);
        border: 1px solid var(--line, #e9dcc8); border-radius: 16px; padding: 16px 18px;
        box-shadow: 0 14px 40px rgba(0,0,0,.22); font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .consent-banner h2 { font-size: 15px; margin: 0 0 4px; }
      .consent-banner p { margin: 0 0 12px; color: var(--muted, #776756); }
      .consent-banner a { color: var(--accent-ink, #c43129); font-weight: 600; }
      .consent-banner .row { display: flex; gap: 10px; flex-wrap: wrap; }
      /* Both choices get identical size and weight — no nudging toward "Accept". */
      .consent-banner button { flex: 1 1 140px; min-height: 44px; border-radius: 11px; font: inherit; font-weight: 700;
        cursor: pointer; background: var(--bg2, #f5ece0); color: var(--text, #2b211b); border: 1.5px solid var(--line, #e9dcc8); }
      .consent-banner button:hover { border-color: var(--accent, #c43129); }
      .consent-banner button:focus-visible { outline: 2px solid var(--accent-ink, #c43129); outline-offset: 2px; }`;
    document.head.appendChild(st);
  }

  function showBanner() {
    if (document.getElementById("consentBanner")) return;
    injectStyles();
    const privacyHref = PRIVACY_URL;
    const el = document.createElement("section");
    el.id = "consentBanner";
    el.className = "consent-banner";
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", "Cookie consent");
    el.innerHTML = `
      <h2>Analytics cookies?</h2>
      <p>We'd like to use Google Analytics to count visits. It sets cookies and sends Google
        anonymized usage data. Nothing breaks if you say no.
        Under 16? Please choose Reject. <a href="${privacyHref}">Details</a></p>
      <div class="row">
        <button type="button" data-choice="denied">Reject</button>
        <button type="button" data-choice="granted">Accept</button>
      </div>`;
    el.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-choice]");
      if (!b) return;
      write(b.dataset.choice);
      el.remove();
      if (b.dataset.choice === "granted") { loadGA(); return; }
      clearGACookies();
      // Withdrawing consent after GA already loaded: the script can't be unloaded
      // mid-page, so reload to start a clean, untracked session.
      if (loaded) location.reload();
    });
    (document.body || document.documentElement).appendChild(el);
  }

  // "Cookie settings" links re-open the banner (hidden entirely while analytics is off).
  function wireSettingsLinks() {
    document.querySelectorAll("[data-cookie-settings]").forEach((a) => {
      a.hidden = !enabled || privacySignal;
      if (a.hidden) return;
      a.addEventListener("click", (e) => { e.preventDefault(); showBanner(); });
    });
  }

  window.placeboConsent = {
    enabled,
    privacySignal,
    choice: () => (privacySignal ? "denied" : read()),
    open: () => enabled && !privacySignal && showBanner(),
  };

  const start = () => {
    wireSettingsLinks();
    if (!enabled || privacySignal) return;
    const c = read();
    if (c === "granted") loadGA();
    else if (c !== "denied") showBanner();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
