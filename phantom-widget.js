// ╔═══════════════════════════════════════════════════════════════╗
// ║  PHANTOM — iPhone home-screen widget (Scriptable)              ║
// ╠═══════════════════════════════════════════════════════════════╣
// ║  Shows your next calendar event + a rotating phantom "order"   ║
// ║  status. Tapping the widget opens the Phantom web app.         ║
// ║                                                               ║
// ║  HOW TO INSTALL (no Xcode, ~2 min):                           ║
// ║  1. App Store → install "Scriptable" (free).                  ║
// ║  2. Open Scriptable → tap + → paste this whole file →         ║
// ║     name it "Phantom" → Done.                                 ║
// ║  3. Home screen → long-press → + → search "Scriptable" →      ║
// ║     pick a Small or Medium widget → Add.                      ║
// ║  4. Long-press the new widget → Edit Widget → Script: Phantom.║
// ║  5. First run asks for Calendar access → Allow.               ║
// ║                                                               ║
// ║  GOOGLE CALENDAR: add your Google account on the iPhone under ║
// ║  Settings → Calendar → Accounts → Add Account → Google, and   ║
// ║  make sure its calendars are toggled on. Scriptable reads the ║
// ║  iOS calendar database, so those Google events show up here.  ║
// ╚═══════════════════════════════════════════════════════════════╝

// ---- where tapping the widget should go (host index.html and put the URL here) ----
const PHANTOM_URL = "https://example.com/phantom"; // or a Shortcuts/file URL

// ---- theme (matches the web app) ----
const C = {
  bg1: new Color("#15172a"),
  bg2: new Color("#0e0f1a"),
  text: Color.white(),
  muted: new Color("#9aa0c7"),
  accent: new Color("#7c5cff"),
  teal: new Color("#00d6a4"),
  warn: new Color("#ff8c5a"),
};

const EXCUSES = [
  "Driver took the scenic route 🫠",
  "Your food matched with a different destiny",
  "Marco is 2 minutes away (eternal)",
  "Gate changed to D7. Walk 2 miles ✈️",
  "Rerouting around a parade 🎺",
  "Boarding… just kidding. Sit back down.",
  "Right around the corner (forever) 🚗",
  "Chef is locating the perfect avocado 🥑",
];

// ---- persist a little ghost counter between refreshes ----
const fm = FileManager.local();
const countPath = fm.joinPath(fm.documentsDirectory(), "phantom-ghosts.txt");
let ghosts = 0;
try { if (fm.fileExists(countPath)) ghosts = parseInt(fm.readString(countPath)) || 0; } catch (e) {}
ghosts += 1;
try { fm.writeString(countPath, String(ghosts)); } catch (e) {}

// ---- next upcoming calendar event (includes synced Google calendars) ----
let nextEvent = null;
try {
  const now = new Date();
  const events = await CalendarEvent.thisWeek([]);
  nextEvent = events
    .filter(e => e.endDate > now)
    .sort((a, b) => a.startDate - b.startDate)[0] || null;
} catch (e) {
  // Calendar access not granted yet — widget still renders.
}

// ---- build the widget ----
const w = new ListWidget();
const grad = new LinearGradient();
grad.colors = [C.bg1, C.bg2];
grad.locations = [0, 1];
w.backgroundGradient = grad;
w.setPadding(14, 15, 14, 15);
if (PHANTOM_URL) w.url = PHANTOM_URL;

const head = w.addStack();
head.centerAlignContent();
const logo = head.addText("👻");
logo.font = Font.systemFont(20);
head.addSpacer(6);
const brand = head.addText("Phantom");
brand.font = Font.boldSystemFont(18);
brand.textColor = C.text;

w.addSpacer(3);
const tagline = w.addText("order the dopamine — skip the delivery");
tagline.font = Font.systemFont(9.5);
tagline.textColor = C.muted;
tagline.lineLimit = 1;

w.addSpacer(9);
const status = w.addText("👻 " + EXCUSES[ghosts % EXCUSES.length]);
status.font = Font.mediumSystemFont(12);
status.textColor = C.warn;
status.lineLimit = 2;

w.addSpacer(9);
const evLabel = w.addText("NEXT ON YOUR CALENDAR");
evLabel.font = Font.boldSystemFont(8);
evLabel.textColor = C.muted;
w.addSpacer(2);
if (nextEvent) {
  const t = w.addText(nextEvent.title || "(untitled)");
  t.font = Font.semiboldSystemFont(13);
  t.textColor = C.text;
  t.lineLimit = 1;

  const df = new DateFormatter();
  df.useShortDateStyle();
  df.useShortTimeStyle();
  const when = w.addText(df.string(nextEvent.startDate));
  when.font = Font.systemFont(11);
  when.textColor = C.teal;
} else {
  const t = w.addText("Nothing scheduled — or tap to allow Calendar access");
  t.font = Font.systemFont(11);
  t.textColor = C.muted;
  t.lineLimit = 2;
}

w.addSpacer();
const footer = w.addText(`👻 ${ghosts} ghosted · all orders pending forever`);
footer.font = Font.systemFont(9);
footer.textColor = C.muted;
footer.lineLimit = 1;

// ---- present ----
Script.setWidget(w);
if (config.runsInApp) w.presentSmall();
Script.complete();
