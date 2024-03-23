import { app, shell, BrowserWindow, ipcMain } from 'electron'

import path from 'path'

import filechangehandler from '../utils/file'

import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // ##########################################################################
  ipcMain.handle('add', (event, operands) => {
    console.log('called ', operands.previousNumber, operands.currentNumber)
    // calculate
    let result = parseFloat(operands.previousNumber) + parseFloat(operands.currentNumber)
    console.log(result)
    // file save
    const content = `\n ${operands.previousNumber} + ${operands.currentNumber} = ${result} \n`
    filechangehandler(content)
    return result
  })
  ipcMain.handle('div', (event, operands) => {
    console.log('called ', operands.previousNumber, operands.currentNumber)
    // calculate
    let result = parseFloat(operands.previousNumber) / parseFloat(operands.currentNumber)
    console.log(result)
    // file save
    const content = `\n ${operands.previousNumber} / ${operands.currentNumber} = ${result} \n`
    filechangehandler(content)
    return result
  })
  ipcMain.handle('sub', (event, operands) => {
    console.log('called ', operands.previousNumber, operands.currentNumber)
    // calculate
    let result = parseFloat(operands.previousNumber) - parseFloat(operands.currentNumber)
    console.log(result)
    // file save
    const content = `\n ${operands.previousNumber} - ${operands.currentNumber} = ${result} \n`
    filechangehandler(content)
    return result
  })
  ipcMain.handle('mul', (event, operands) => {
    console.log('called ', operands.previousNumber, operands.currentNumber)
    // calculate
    let result = parseFloat(operands.previousNumber) * parseFloat(operands.currentNumber)
    console.log(result)
    // file save
    const content = `\n ${operands.previousNumber} * ${operands.currentNumber} = ${result} \n`
    filechangehandler(content)
    return result
  })
  // ##############################################################################################
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
