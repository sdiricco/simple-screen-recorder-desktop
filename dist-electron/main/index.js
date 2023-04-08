"use strict";
const electron = require("electron");
const os = require("os");
const path = require("path");
const fs = require("fs");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
var Channel = /* @__PURE__ */ ((Channel2) => {
  Channel2["ShowMessageBox"] = "electron/show-message-box";
  Channel2["ShowSaveDialog"] = "electron/show-save-dialog";
  Channel2["ShowOpenDialog"] = "electron/show-open-dialog";
  Channel2["Menu"] = "electron/menu";
  Channel2["ConvertToMp4"] = "electron/convert-to-mp4";
  Channel2["OnConversionProgress"] = "electron/on-conversion-progress";
  return Channel2;
})(Channel || {});
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
function preProcessVideo(sourcePath) {
  const outputPath = path__namespace.join(path__namespace.dirname(sourcePath), `temp-${path__namespace.basename(sourcePath)}`);
  return new Promise((resolve, reject) => {
    ffmpeg(sourcePath).videoCodec("copy").audioCodec("copy").save(outputPath).on("error", (err) => reject(err)).on("end", () => {
      fs__namespace.unlinkSync(sourcePath);
      fs__namespace.renameSync(outputPath, sourcePath);
      resolve();
    });
  });
}
function conversionToMp4(sourcePath, outputPath) {
  return ffmpeg(sourcePath).output(outputPath).videoCodec("libx264").audioCodec("libmp3lame");
}
async function run(conversion) {
  return new Promise((resolve, reject) => {
    conversion.on("end", () => {
      resolve();
    });
    conversion.on("error", (error) => {
      reject(`Error during conversion: ${error.message}`);
    });
    conversion.run();
  });
}
function sendToClient(win2, channel = "", data) {
  win2.webContents.send(channel, data);
}
function handleDialogs(win2) {
  electron.ipcMain.handle(Channel.ShowMessageBox, async (_evt, data) => {
    const result = {
      data: null,
      error: null
    };
    const error = {
      code: 0,
      message: "Error during opening message box dialog electron API",
      details: "",
      type: "electron",
      channel: Channel.ShowMessageBox
    };
    try {
      result.data = await electron.dialog.showMessageBox(win2, data);
    } catch (e) {
      result.error = { ...error, ...{ details: e.message } };
    }
    return result;
  });
}
async function handleFfmpeg(win2) {
  electron.ipcMain.handle(Channel.ConvertToMp4, async (_evt, data) => {
    const result = {
      data: null,
      error: null
    };
    const error = {
      code: 10,
      message: "Error during conversion webm to mp4",
      details: "",
      type: "electron",
      channel: Channel.ConvertToMp4
    };
    try {
      await preProcessVideo("screen-recording-2.webm");
      console.log("[FFMPEG: pre-processing video completed successfully]");
      const conversion = conversionToMp4("screen-recording-2.webm", "screen-recording-2.mp4");
      conversion.on("progress", (progress) => {
        console.log(`[FFMPEG: conversion progress: ${Math.ceil(progress.percent)}%]`);
        sendToClient(win2, Channel.OnConversionProgress, progress);
      });
      await run(conversion);
      console.log("[FFMPEG: conversion completed successfully]");
    } catch (e) {
      result.error = { ...error, ...{ details: e.message } };
    }
    return result;
  });
}
function onWindowCreated(window) {
  handleDialogs(window);
  handleFfmpeg(window);
}
process.env.DIST_ELECTRON = path.join(__dirname, "..");
process.env.DIST = path.join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? path.join(process.env.DIST_ELECTRON, "../public") : process.env.DIST;
if (os.release().startsWith("6.1"))
  electron.app.disableHardwareAcceleration();
if (process.platform === "win32")
  electron.app.setAppUserModelId(electron.app.getName());
if (!electron.app.requestSingleInstanceLock()) {
  electron.app.quit();
  process.exit(0);
}
let win = null;
const preload = path.join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = path.join(process.env.DIST, "index.html");
async function createWindow() {
  win = new electron.BrowserWindow({
    title: "Main window",
    icon: path.join(process.env.PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(url);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.setWindowOpenHandler(({ url: url2 }) => {
    if (url2.startsWith("https:"))
      electron.shell.openExternal(url2);
    return { action: "deny" };
  });
  onWindowCreated(win);
}
electron.app.whenReady().then(createWindow);
electron.app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin")
    electron.app.quit();
});
electron.app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized())
      win.restore();
    win.focus();
  }
});
electron.app.on("activate", () => {
  const allWindows = electron.BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
electron.ipcMain.handle("open-win", (event, arg) => {
  const childWindow = new electron.BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
