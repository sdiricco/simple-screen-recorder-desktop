import { ipcRenderer, MessageBoxOptions, MessageBoxReturnValue } from "electron";
import { IShowMessageBoxReturnValue, ISaveDialogReturnValue, Channel } from "../types";
import { ElectronError } from "./errorHandle"

export async function showMessageBox(messageBoxOptions: MessageBoxOptions): Promise<MessageBoxReturnValue> {
  const response = await ipcRenderer.invoke(Channel.ShowMessageBox, messageBoxOptions);  
  if (response.error) {
    throw new ElectronError(response.error);
  }
  return response.data;
}

export async function convertToMp4(): Promise<void> {
  const response = await ipcRenderer.invoke(Channel.ConvertToMp4, null);  
  if (response.error) {
    throw new ElectronError(response.error);
  }
  return response.data;
}

export async function getAvailableSources(): Promise<void> {
  const response = await ipcRenderer.invoke(Channel.GetAvailableSources);  
  if (response.error) {
    throw new ElectronError(response.error);
  }
  return response.data;
}

export async function invokeChildWin()  {
  return await ipcRenderer.invoke('open-win');
}

export async function onMenuAction(callback: Function){
  ipcRenderer.on(Channel.Menu, (_evt, data)=> {
    callback(data);
  })
}

export async function onConversionProgress(callback: Function){
  ipcRenderer.on(Channel.OnConversionProgress, (_evt, data)=> {
    callback(data);
  })
}


