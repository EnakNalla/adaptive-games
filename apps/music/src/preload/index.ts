/* eslint-disable @typescript-eslint/ban-ts-comment */
import {type SortableItem} from "@ag/ui";
import {electronAPI} from "@electron-toolkit/preload";
import {contextBridge, ipcRenderer, type OpenDialogReturnValue} from "electron";
import path from "path";

// Custom APIs for renderer
export const api = {
  async selectSongs(): Promise<SortableItem[]> {
    const paths: OpenDialogReturnValue = (await ipcRenderer.invoke(
      "selectSongs"
    )) as OpenDialogReturnValue;

    if (paths.canceled) throw new Error("User canceled");

    return paths.filePaths.map(p => ({
      id: path.basename(p, path.extname(p)),
      value: path.join("file://", path.normalize(p))
    }));
  }
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
