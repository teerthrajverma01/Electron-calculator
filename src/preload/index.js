import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)

    contextBridge.exposeInMainWorld('myapi', {
      myapiresponse: (value) => ipcRenderer.invoke('myapiresponse', value),
      openFile: () => ipcRenderer.invoke('dialog:openFile'),

      onUpdateCounter: (callback) =>
        ipcRenderer.on('update-counter', (_event, value) => callback(value)),
      counterValue: (value) => ipcRenderer.send('counter-value', value)
    })
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
