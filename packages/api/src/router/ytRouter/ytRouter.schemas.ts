import {z} from "zod";

export const timerSchema = z.object({
  name: z.string(),
  playtime: z.number(),
  isDefault: z.boolean()
});

export type Timer = z.infer<typeof timerSchema>;

export const ytConfigSchema = z.object({
  name: z.string(),
  isDefault: z.boolean()
});

export type YtConfig = z.infer<typeof ytConfigSchema>;

export const inputConfigSchema = z.object({
  dwellTime: z.number(),
  effectColour: z.string(),
  borderColour: z.string(),
  size: z.enum(["sm", "md", "lg"]),
  type: z.enum(["mouse", "touch", "switch", "eyeGaze"]),
  fixedCentre: z.boolean()
});

export type InputConfig = z.infer<typeof inputConfigSchema>;

export const defaultConfig = {
  inputConfig: {
    dwellTime: 1,
    effectColour: "#ff0000",
    borderColour: "#000000",
    size: "md",
    type: "switch",
    fixedCentre: false
  },
  timers: [
    {name: "30 seconds", playtime: 30, isDefault: true},
    {name: "Indefinite", playtime: 0, isDefault: false}
  ]
};

export const playlistSchema = z.object({
  name: z.string(),
  isGlobal: z.boolean(),
  useSpeechSynthesis: z.boolean()
});

export type Playlist = z.infer<typeof playlistSchema>;

const thumbnail = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number()
});

export const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  thumbnails: z.object({
    default: thumbnail,
    medium: thumbnail
  })
});

export type Video = z.infer<typeof videoSchema>;
