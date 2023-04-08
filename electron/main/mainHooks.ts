import { BrowserWindow } from "electron";
import * as mainHandle from "./mainHandle";

export function onWindowCreated(window: BrowserWindow) {
  mainHandle.handleDialogs(window)
  mainHandle.handleFfmpeg(window);
}
