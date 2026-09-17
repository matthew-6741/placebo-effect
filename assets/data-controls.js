/* "Delete my data" — erases everything The Placebo Effect keeps in this browser.
 *
 * The app has no servers, so this browser is the only place any data lives. Every key
 * the app writes starts with "phantom" (stats, wallet, squad, sign-in, theme, consent…),
 * which is what gets removed here.
 *
 * Usage: any element with a `data-delete-data` attribute becomes a delete control.
 *   data-reload            reload the page afterwards (used inside the app)
 *   data-status="someId"   write the result into that element instead (used on the privacy page)
 * A page can define window.beforePlaceboDelete() to run first (the app uses it to revoke
 * Google Calendar access).
 */
(function () {
  const PREFIX = "phantom";

  function deleteAllData() {
    const keys = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(PREFIX)) keys.push(k);
      }
      keys.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      return -1; // storage blocked, e.g. a locked-down private window
    }
    return keys.length;
  }
  window.placeboDeleteAllData = deleteAllData;

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-delete-data]");
    if (!btn) return;
    e.preventDefault();

    const ok = window.confirm(
      "Delete all Placebo Effect data from this browser?\n\n" +
      "This erases your ghost stats, fake wallet cards, squad, cuisine passport, " +
      "sign-in, and settings. It can't be undone."
    );
    if (!ok) return;

    try { if (typeof window.beforePlaceboDelete === "function") window.beforePlaceboDelete(); } catch (err) {}
    const n = deleteAllData();

    const status = btn.dataset.status && document.getElementById(btn.dataset.status);
    const msg = n < 0
      ? "Your browser blocked access to site storage, so there was nothing we could read or delete."
      : n === 0
        ? "Done. There was no Placebo Effect data in this browser."
        : `Done. Deleted ${n} saved item${n === 1 ? "" : "s"} from this browser.`;

    if (btn.hasAttribute("data-reload")) {
      alert(msg);
      location.reload();
    } else if (status) {
      status.textContent = msg;
    } else {
      alert(msg);
    }
  });
})();
