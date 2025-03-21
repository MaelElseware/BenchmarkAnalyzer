const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

// Register custom protocol
app.whenReady().then(() => {
  protocol.registerFileProtocol('benchmark', (request, callback) => {
    const filePath = request.url.replace('benchmark://', '');
    callback({ path: path.normalize(filePath) });
  });
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Check if launched with file path argument
  const filePath = process.argv.length > 1 ? process.argv[1] : null;
  
  // In development, use the React dev server
  const startUrl = process.env.ELECTRON_START_URL || 
    url.format({
      pathname: path.join(__dirname, './build/index.html'),
      protocol: 'file:',
      slashes: true
    });
    
  mainWindow.loadURL(startUrl);

  // Pass file path to renderer if provided
  if (filePath && fs.existsSync(filePath)) {
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.send('open-file', filePath);
    });
  }
}

app.on('ready', createWindow);

// Register as default app for .log files
app.setAsDefaultProtocolClient('benchmark');

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});