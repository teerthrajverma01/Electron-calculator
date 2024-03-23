import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)

    //globalvariable &&  channels

    contextBridge.exposeInMainWorld('calculateapi', {
      add: (expression) => ipcRenderer.invoke('add', expression),
      sub: (expression) => ipcRenderer.invoke('sub', expression),
      mul: (expression) => ipcRenderer.invoke('mul', expression),
      div: (expression) => ipcRenderer.invoke('div', expression)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
