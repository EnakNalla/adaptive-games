import type {Timer} from "@ag/db";
import type {Config, VisualiserSettings} from "./types";

export const DEFAULT_TIMER: Timer = {isDefault: true, playtime: 30, name: "30 seconds"};

export const DEFAULT_VISUALISER_SETTINGS: VisualiserSettings = {
  type: "cubes",
  stroke: 2,
  colours: {
    primary: "#d92027",
    secondary: "#ff9234",
    tertiary: "#ffcd3c",
    quaternary: "#35d0ba",
    background: "#000000"
  }
};

export const DEFAULT_CONFIG: Config = {
  id: "Example",
  songs: [],
  songIndex: 0,
  timers: [DEFAULT_TIMER, {name: "Indefinite", playtime: 0, isDefault: false}],
  inputConfig: {
    type: "SWITCH",
    size: "MD",
    fixedCentre: true,
    dwellTime: 1,
    borderColour: "#fffff",
    effectColour: "#fffff"
  },
  visualiserSettings: DEFAULT_VISUALISER_SETTINGS,
  loaded: true,
  useSpeach: true,
  shuffle: false
};

export const defaultState = JSON.stringify({state: {configs: [DEFAULT_CONFIG]}, version: 0});
