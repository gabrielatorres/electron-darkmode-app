const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
const path = require('path');

// Carga de index en una nueva instancia de BrowserWindow
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    //Acceso a elementos de Node con un Script de pre carga
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  ipcMain.handle('ping', () => 'pong')
  win.loadFile('index.html')
}

ipcMain.handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system'
})

// Llamado a la función createWindow() para abrir la ventana
// Las ventanas de navegador solo se pueden crear después de que el evento del módulo
// app ready sea disparado.
app.whenReady().then(() => {
  createWindow()

  //MacOS
  //Abre una ventana nueva cuando la app no está completamente cerrada
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

//Win & Linux (OS !== darwin)
// Al cerrar todas las ventanas de la aplicación, ésta se cierra por completo
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
