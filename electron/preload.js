const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  imprimirTicket: (html) => ipcRenderer.invoke("imprimir-ticket", html)
});

contextBridge.exposeInMainWorld("electronAPI", {
  onReproducirSonido: (callback) =>
    ipcRenderer.on("reproducir-sonido", callback)
});