import { app, shell, BrowserWindow, ipcMain, dialog, Menu } from 'electron'
// The app module, which controls your application's event lifecycle.
// The BrowserWindow module, which creates and manages application windows.
import path from 'path'
const fs = require('node:fs')
import filechangehandler from '../utils/file'

import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
}

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

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => mainWindow.webContents.send('update-counter', 1),
          label: 'Increment'
        },
        {
          click: () => mainWindow.webContents.send('update-counter', -1),
          label: 'Decrement'
        }
      ]
    }
  ])

  Menu.setApplicationMenu(menu)

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  // const contents = mainWindow.webContents;
  // console.log(contents)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.handle('myapiresponse', (event, value) => {
    // console.log(event)
    console.log(value)

    console.log('2 admi the sarkar  ')
    return parseInt(value.operator1) + parseInt(value.operator2)
  })
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.on('counter-value', (_event, value) => {
    console.log(value) // will print value to Node console
  })

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
    let result = parseFloat(operands.previousNumber) / parseFloat(operands.currentNumber)
    console.log(result)
    // file save
    const content = `\n ${operands.previousNumber} / ${operands.currentNumber} = ${result} \n`
    filechangehandler(content)
    return result
  })
  ipcMain.handle('sub', (event, operands) => {
    console.log('called ', operands.previousNumber, operands.currentNumber)
    let result = parseFloat(operands.previousNumber) - parseFloat(operands.currentNumber)
    console.log(result)
    // file save
    const content = `\n ${operands.previousNumber} - ${operands.currentNumber} = ${result} \n`
    filechangehandler(content)
    return result
  })
  ipcMain.handle('mul', (event, operands) => {
    console.log('called ', operands.previousNumber, operands.currentNumber)
    let result = parseFloat(operands.previousNumber) * parseFloat(operands.currentNumber)
    console.log(result)
    // file save
    const content = `\n ${operands.previousNumber} * ${operands.currentNumber} = ${result} \n`
    filechangehandler(content)
    return result
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
