import type {InputConfig, Timer} from "@ag/db";
import type {SelectOption, SortableItem} from "@ag/ui";

export type INotificationVariant = "danger" | "warning" | "success";
export interface INotification {
  id: string;
  title: string;
  message: string;
  variant?: INotificationVariant;
}

export type VisualiserTypes =
  | "cubes"
  | "bars"
  | "bars blocks"
  | "dualbars"
  | "dualbars blocks"
  | "fireworks"
  | "flower"
  | "flower blocks"
  | "orbs"
  | "ring"
  | "round wave"
  | "shine"
  | "shockwave"
  | "star"
  | "static"
  | "stitches"
  | "web"
  | "wave";

export const visualiserTypeOptions: SelectOption[] = [
  {value: "cubes", label: "Cubes"},
  {value: "bars", label: "Bars"},
  {value: "bars blocks", label: "Bars Blocks"},
  {value: "dualbars", label: "Dualbars"},
  {value: "dualbars blocks", label: "Dualbars Blocks"},
  {value: "fireworks", label: "Fireworks"},
  {value: "flower", label: "Flower"},
  {value: "flower blocks", label: "Flower Blocks"},
  {value: "orbs", label: "Orbs"},
  {value: "ring", label: "Ring"},
  {value: "round wave", label: "Round Wave"},
  {value: "shine", label: "Shine"},
  {value: "shockwave", label: "Shockwave"},
  {value: "star", label: "Star"},
  {value: "static", label: "Static"},
  {value: "stitches", label: "Stitches"},
  {value: "web", label: "Web"},
  {value: "wave", label: "Wave"}
];

export type VisualiserSettingsKeys =
  | "stroke"
  | "type"
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "background";

export interface VisualiserSettings {
  stroke: number;
  type: VisualiserTypes;
  colours: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    background: string;
  };
}

export interface Config {
  id: string;
  songs: SortableItem[];
  songIndex: number;
  inputConfig: InputConfig;
  timers: Timer[];
  visualiserSettings: VisualiserSettings;
  loaded: boolean;
  useSpeach: boolean;
  shuffle: boolean;
}

export interface MissHit {
  [key: string]: {count: number; range: string}[];
}
