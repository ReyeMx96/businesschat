const { contextBridge, ipcRenderer } = require("electron");
// Esto te permite ver si el preload se cargó
console.log("Preload.js se está ejecutando");

contextBridge.exposeInMainWorld("electronAPI", {
  imprimirTicket: (html) => ipcRenderer.invoke("imprimir-ticket", html)
});

contextBridge.exposeInMainWorld("electronAPI", {
  onReproducirSonido: (callback) =>
    ipcRenderer.on("reproducir-sonido", callback)
});