import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import path from 'node:path';
import fs from 'fs';
import started from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'New Simulation', click: () => mainWindow.webContents.send('new-simulation') },
        { label: 'Save Simulation', click: () => mainWindow.webContents.send('save-simulation') },
        { label: 'Load Simulation', click: () => mainWindow.webContents.send('load-simulation') },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'About', click: () => mainWindow.webContents.send('show-about') }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// File handling IPC
ipcMain.handle('save-file', async (event, data) => {
  const { filePath } = await dialog.showSaveDialog({
    filters: [{ name: 'Simulation Files', extensions: ['json'] }]
  });
  
  if (filePath) {
    fs.writeFileSync(filePath, JSON.stringify(data));
    return true;
  }
  return false;
});

ipcMain.handle('load-file', async () => {
  const { filePaths } = await dialog.showOpenDialog({
    filters: [{ name: 'Simulation Files', extensions: ['json'] }],
    properties: ['openFile']
  });
  
  if (filePaths.length > 0) {
    return JSON.parse(fs.readFileSync(filePaths[0], 'utf8'));
  }
  return null;
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
