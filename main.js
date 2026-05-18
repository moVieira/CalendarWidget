const { app, BrowserWindow } = require("electron");

let store;

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
            contextIsolation: true
        }
    });

    win.loadFile("index.html");

    win.on("moved", () => {
        const position = win.getBounds();

        store.set("windowPosition", {
            x: position.x,
            y: position.y
        });
    });
}

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