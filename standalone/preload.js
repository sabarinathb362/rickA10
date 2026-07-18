const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('rickAPI', {
  // Core
  getState:       ()        => ipcRenderer.invoke('get-state'),
  syncScreen:     ()        => ipcRenderer.invoke('sync-screen'),
  feed:           (item)    => ipcRenderer.invoke('feed', item),
  dance:          ()        => ipcRenderer.invoke('dance'),
  solveCaptcha:   (word)    => ipcRenderer.invoke('solve-captcha', word),
  dragReward:     ()        => ipcRenderer.invoke('drag-reward'),
  setIgnoreMouse: (v)       => ipcRenderer.send('set-ignore-mouse', v),
  // IPC events
  onStateUpdate:  (cb)      => ipcRenderer.on('state-update',  (_, s) => cb(s)),
  onScreenSize:   (cb)      => ipcRenderer.on('screen-size',   (_, s) => cb(s)),
  // AI features
  updateEmotion:  (result)  => ipcRenderer.invoke('update-emotion', result),
  getAdvice:      (ctx)     => ipcRenderer.invoke('get-advice', ctx),
});

