/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {type StateCreator} from "zustand";
import {type Config, type VisualiserSettings} from "./types";
import {type InputConfig, type Timer} from "@ag/db";
import {type SortableItem} from "@ag/ui";
import {DEFAULT_CONFIG} from "./defaults";
import {type PersistState} from ".";

type ConfigState = {
  configs: Config[];
};
type ConfigActions = {
  addConfig: (id: string) => void;
  deleteConfig: (id: string) => void;
  loadConfig: (id: string) => void;
  setInputConfig: (inputConfig: InputConfig) => void;
  setTimer: (id: string) => void;
  setTimers: (timers: Timer[]) => void;
  setSongs: (songs: SortableItem[], append: boolean) => void;
  setSongIndex: (song: SortableItem) => void;
  toggleShuffle: () => void;
  setVisualiserSettings: (settings: VisualiserSettings) => void;
};
export type ConfigStore = ConfigState & ConfigActions;
type ConfigStoreCreator = StateCreator<
  ConfigStore,
  [],
  [["zustand/immer", never], ["zustand/persist", PersistState]],
  ConfigStore
>;

export const createConfigStore: ConfigStoreCreator = set => ({
  configs: [],
  addConfig: id =>
    set(state => {
      state.configs.find(x => x.loaded)!.loaded = false;
      state.configs.push({...DEFAULT_CONFIG, id});

      return state;
    }),
  deleteConfig: id =>
    set(state => {
      state.configs = state.configs.filter(x => x.id !== id);
      return state;
    }),
  loadConfig: id =>
    set(state => {
      state.configs.find(x => x.loaded)!.loaded = false;
      state.configs.find(x => x.id === id)!.loaded = true;
      return state;
    }),
  setInputConfig: inputConfig =>
    set(state => {
      state.configs.find(x => x.loaded)!.inputConfig = inputConfig;
      return state;
    }),
  setTimer: id =>
    set(state => {
      const config = state.configs.find(x => x.loaded)!;
      config.timers.find(x => x.isDefault)!.isDefault = false;
      config.timers.find(x => x.name === id)!.isDefault = true;

      return state;
    }),
  setTimers: timers =>
    set(state => {
      state.configs.find(x => x.loaded)!.timers = timers;
      return state;
    }),
  setSongs: (songs, append) =>
    set(state => {
      if (append) {
        state.configs.find(x => x.loaded)!.songs.push(...songs);
      } else {
        state.configs.find(x => x.loaded)!.songs = songs;
      }
      return state;
    }),
  setSongIndex: song =>
    set(state => {
      const config = state.configs.find(x => x.loaded)!;
      const index = config.songs.findIndex(x => x.id === song.id);
      config.songIndex = index;

      document.querySelector(`[data-index='${index}']`)?.scrollIntoView();

      return state;
    }),
  toggleShuffle: () =>
    set(state => {
      const config = state.configs.find(x => x.loaded)!;
      config.shuffle = !config.shuffle;
      return state;
    }),
  setVisualiserSettings: settings =>
    set(state => {
      state.configs.find(x => x.loaded)!.visualiserSettings = settings;
      return state;
    })
});
