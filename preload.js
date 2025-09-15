const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  
  // Menu event listeners
  onMenuNewStudent: (callback) => ipcRenderer.on('menu-new-student', callback),
  onMenuExportProgress: (callback) => ipcRenderer.on('menu-export-progress', callback),
  onChangeLanguage: (callback) => ipcRenderer.on('change-language', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});









