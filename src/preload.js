//preload script to expose Node.js functionality to the React app
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// Expose file system access to your React app
contextBridge.exposeInMainWorld('electronAPI', {
  readFile: (filePath) => {
    return fs.readFileSync(filePath, 'utf8');
  },
  writeFile: (filePath, content) => {
    return fs.writeFileSync(filePath, content);
  },
  onFileOpen: (callback) => {
    ipcRenderer.on('open-file', (event, path) => {
      callback(path);
    });
  },
  path: {
    basename: (filePath) => path.basename(filePath)
  }
});