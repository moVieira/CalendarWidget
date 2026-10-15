const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let store;
let mainWindow;
let settingsWindow;

async function createWindow() {
    const savedPosition = store.get("windowPosition");

    const win = new BrowserWindow({
        width: 214,
        height: 228,

        x: savedPosition ? savedPosition.x : undefined,
        y: savedPosition ? savedPosition.y : undefined,

        resizable: false,
        maximizable: false,
        fullscreenable: false,
        frame: false,
        transparent: true,
        skipTaskbar: true,
        alwaysOnTop: false,
        icon: "assets/icon.ico",
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    });

    mainWindow = win;
    win.loadFile("index.html");

    win.on("moved", () => {
        const position = win.getBounds();

        store.set("windowPosition", {
            x: position.x,
            y: position.y
        });
    });
}

function openSettingsWindow() {
    if (settingsWindow) {
        settingsWindow.focus();
        return;
    }

    settingsWindow = new BrowserWindow({
        width: 380,
        height: 680,
        title: "Personalizar calendário",
        autoHideMenuBar: true,
        icon: "assets/icon.ico",
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    });

    settingsWindow.loadFile("settings.html");
    settingsWindow.on("closed", () => {
        settingsWindow = null;
    });
}

function broadcastSettings(settings) {
    for (const win of [mainWindow, settingsWindow]) {
        if (win && !win.isDestroyed()) win.webContents.send("settings:changed", settings);
    }
}

ipcMain.handle("settings:get", () => store.get("settings") || {});
ipcMain.on("settings:open", openSettingsWindow);
ipcMain.on("settings:save", (_event, settings) => {
    store.set("settings", settings);
    broadcastSettings(settings);
});
ipcMain.handle("settings:reset", () => {
    store.delete("settings");
    broadcastSettings({});
    return {};
});

app.whenReady().then(async () => {
    const Store = (await import("electron-store")).default;
    store = new Store();

    app.setLoginItemSettings({
        openAtLogin: true
    });

    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});