const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    getSettings: () => ipcRenderer.invoke("settings:get"),
    saveSettings: (settings) => ipcRenderer.send("settings:save", settings),
    resetSettings: () => ipcRenderer.invoke("settings:reset"),
    openSettings: () => ipcRenderer.send("settings:open"),
    onSettings: (callback) =>
        ipcRenderer.on("settings:changed", (_event, settings) => callback(settings))
});
