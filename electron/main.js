const { app, BrowserWindow, protocol, ipcMain } = require("electron");
const { truncate } = require("fs/promises");
const { autoUpdater } = require("electron-updater");
const path = require("path");

let mainWindow;

/* 🔥 Registrar protocolo como estándar y seguro */
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      allowServiceWorkers: true
    }
  }
]);

function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    },
  });

  // 👇 Esto abre DevTools automáticamente
  mainWindow.webContents.openDevTools();
  mainWindow.loadURL("app://./index.html");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
}

// Configurar auto-update
autoUpdater.checkForUpdatesAndNotify();

// Opcional: logs
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

autoUpdater.on("update-available", () => {
  console.log("Actualización disponible, descargando...");
});

autoUpdater.on("update-downloaded", () => {
  console.log("Actualización descargada, reiniciando app...");
  autoUpdater.quitAndInstall();
});

ipcMain.on("nueva-orden", () => {
  mainWindow.webContents.send("reproducir-sonido");
});

/* 🖨 IPC PARA IMPRIMIR */
ipcMain.handle("imprimir-ticket", async (event, htmlContent) => {

  const printWindow = new BrowserWindow({
    show: false
  });

  await printWindow.loadURL(
    "data:text/html;charset=utf-8," + encodeURIComponent(htmlContent)
  );

  printWindow.webContents.print({
    silent: true,
    printBackground: true,
    margins: {
      marginType: "none"
    },
    pageSize: {
      width: 58000,
      height: 200000
    }
  }, (success, failureReason) => {

    if (!success) {
      console.log("Error imprimiendo:", failureReason);
    }

    printWindow.close();
  });
});



app.whenReady().then(() => {

  protocol.registerFileProtocol("app", (request, callback) => {
    const url = request.url.replace("app://./", "");
    const filePath = path.normalize(path.join(__dirname, "../www", url));
    callback({ path: filePath });
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});