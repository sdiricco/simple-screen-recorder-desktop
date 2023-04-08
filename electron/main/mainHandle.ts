import { ipcMain, BrowserWindow, dialog } from "electron";
import { IError, Channel } from "../types";
import {conversionToMp4, preProcessVideo, run} from "../ffmpeg"

export function sendToClient(win: BrowserWindow, channel = "", data) {
  win.webContents.send(channel, data);
}

/*************************************************************************************/
/* DIALOGs API */
/*************************************************************************************/
export function handleDialogs(win: BrowserWindow) {
  /* SHOW MESSAGE BOX */
  ipcMain.handle(Channel.ShowMessageBox, async (_evt, data) => {
    const result = {
      data: null,
      error: null
    }
    const error: IError = {
      code: 0,
      message: "Error during opening message box dialog electron API",
      details: '',
      type: "electron",
      channel: Channel.ShowMessageBox,
    };
    try {
      result.data = await dialog.showMessageBox(win, data)
    } catch (e) {
      result.error = {...error, ...{details: e.message} }
    }
    return result;
  });
}

export async function handleFfmpeg(win: BrowserWindow){
  /* CONVERT WEBM TO MP4 */
  ipcMain.handle(Channel.ConvertToMp4, async (_evt, data) => {
    const result = {
      data: null,
      error: null
    }
    const error: IError = {
      code: 10,
      message: "Error during conversion webm to mp4",
      details: '',
      type: "electron",
      channel: Channel.ConvertToMp4,
    };
    try {
      await preProcessVideo('screen-recording-2.webm')
      console.log('[FFMPEG: pre-processing video completed successfully]');
      const conversion = conversionToMp4('screen-recording-2.webm', 'screen-recording-2.mp4');
      conversion.on('progress', (progress)=>{
        console.log(`[FFMPEG: conversion progress: ${Math.ceil(progress.percent)}%]`);
        sendToClient(win, Channel.OnConversionProgress, progress)
      })
      await run(conversion);                                                                                      
      console.log('[FFMPEG: conversion completed successfully]');
    } catch (e) {
      result.error = {...error, ...{details: e.message} }
    }
    return result;
  });
}
