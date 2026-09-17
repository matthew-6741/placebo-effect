/* Google Analytics 4 — OFF until you add your Measurement ID.
 *
 * To turn analytics on:
 *   1. Create a GA4 property at https://analytics.google.com
 *   2. Copy its Measurement ID (looks like "G-XXXXXXXXXX")
 *   3. Paste it below and redeploy.
 *
 * While this is an empty string, no Google script is loaded and no data
 * leaves the visitor's browser. Keep privacy-policy.html in sync if you
 * enable it — that page tells visitors what is and isn't collected.
 */
const GA_MEASUREMENT_ID = "";

(function initAnalytics() {
  if (!GA_MEASUREMENT_ID) return;

  // Respect Do Not Track / Global Privacy Control — this app promises not to spy.
  const dnt = navigator.doNotTrack === "1" || window.doNotTrack === "1" ||
              navigator.msDoNotTrack === "1" || navigator.globalPrivacyControl === true;
  if (dnt) return;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
})();
