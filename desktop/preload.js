const { contextBridge, ipcRenderer } = require("electron");

// Exposed to the web app as window.electronAPI — only present when running
// inside the desktop app. index.html feature-detects this, so the same
// index.html works unchanged in a normal browser tab.
contextBridge.exposeInMainWorld("electronAPI", {
  isDesktop: true,
  notify: (title, body) => ipcRenderer.send("notify", { title, body }),
});
