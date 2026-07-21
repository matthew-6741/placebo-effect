const { app, BrowserWindow, Notification, ipcMain } = require("electron");
const path = require("path");
const http = require("http");
const fs = require("fs");

const ROOT = path.join(__dirname, ".."); // serve the phantom-app folder (index.html lives here)
const PORT = 4173;

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon",
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURIComponent(req.url.split("?")[0]);
      if (reqPath === "/") reqPath = "/index.html";
      const filePath = path.join(ROOT, reqPath);
      if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end("forbidden"); }
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); return res.end("not found"); }
        const ext = path.extname(filePath);
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(data);
      });
    });
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

// Bridge: the web app calls window.electronAPI.notify(title, body) — see preload.js.
// Native macOS notification, works even when the Phantom window isn't focused.
ipcMain.on("notify", (_event, { title, body }) => {
  if (!Notification.isSupported()) return;
  new Notification({
    title: title || "The Placebo Effect",
    body: body || "",
    silent: false,
  }).show();
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 900,
    minWidth: 760,
    minHeight: 640,
    title: "The Placebo Effect",
    backgroundColor: "#fbf6ef",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadURL(`http://127.0.0.1:${PORT}/index.html`);
  return win;
}

app.whenReady().then(async () => {
  await startServer();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
