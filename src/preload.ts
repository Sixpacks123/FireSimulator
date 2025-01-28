import { contextBridge, ipcRenderer } from 'electron';

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

contextBridge.exposeInMainWorld('electronAPI', {
  saveSimulation: (data: any) => ipcRenderer.invoke('save-file', data),
  loadSimulation: () => ipcRenderer.invoke('load-file'),
  onNewSimulation: (callback: () => void) => ipcRenderer.on('new-simulation', callback),
  onSaveSimulation: (callback: () => void) => ipcRenderer.on('save-simulation', callback),
  onLoadSimulation: (callback: () => void) => ipcRenderer.on('load-simulation', callback),
  onShowAbout: (callback: () => void) => ipcRenderer.on('show-about', callback),
});