import {type Timer, type Video, type VideoTimer} from "@ag/db";
import {create} from "zustand";

const VALID_CODES = ["Enter", "Space", "Escape"];

interface AppStore {
  // hold on to the currently loaded configId
  configId?: string;

  // searchbar
  q: string;
  pageToken: string | null;
  videos: Video[];
  setSearchData: (q: string, pageToken: string | null, videos: Video[]) => void;
  appendVideos: (pageToken: string | null, videos: Video[]) => void;

  // playlist/[id].tsx
  playlistId: string | null;
  playlistLoaded: boolean;
  videoIndex: number;
  setVideoFromPlaylist: (playlistId: string, video: Video) => void;
  setPlaylist: (videos: Video[]) => void;
  loadNextVideo: () => void;

  // video/[id].tsx
  started: boolean;
  inputType: string;
  timer: Timer;
  videoTimer: VideoTimer | null;
  isPlaying: boolean;
  video: Video | null;
  handlePlay: () => void;
  stopPlayer: () => void;
  pauseVideo: () => void;
  playVideo: () => void;
  videoTimerIndex: number;
  initPlayer: (
    onSpace: (playlistId: string) => void,
    onEscape: () => void,
    video: Video,
    timer: Timer,
    inputType: string
  ) => (e: KeyboardEvent) => void;
}

export const useAppStore = create<AppStore>()((set, get) => ({
  configId: undefined,

  q: "",
  pageToken: null,
  videos: [],
  setSearchData(q: string, pageToken: string | null, videos: Video[]) {
    set({q, pageToken, videos});
  },
  appendVideos(pageToken: string | null, videos: Video[]) {
    set(state => ({
      pageToken,
      videos: [...state.videos, ...videos].filter(
        (video, index, self) => self.findIndex(v => v.id === video.id) === index
      )
    }));
  },

  playlistId: null,
  playlistLoaded: false,
  videoIndex: 0,
  setVideoFromPlaylist(playlistId: string, video: Video) {
    set({playlistId, video, q: "", pageToken: null});
  },

  setPlaylist(videos: Video[]) {
    set({videos, playlistLoaded: true, playlistId: null, q: "", pageToken: null});
  },
  loadNextVideo() {
    set(state => {
      const videoIndex = state.videoIndex + 1;
      const video = state.videos[videoIndex];
      if (video) {
        return {video, videoIndex};
      } else {
        return {video: state.videos[0], videoIndex: 0};
      }
    });
  },

  started: false,
  timer: {name: "30 seconds", playtime: 30, isDefault: true},
  videoTimer: null,
  isPlaying: false,
  video: null,
  videoTimerIndex: -1,
  inputType: "",
  handlePlay() {
    set(state => {
      if (state.videoTimer) {
        const videoTimer = state.video?.timers[state.videoTimerIndex + 1];

        return {
          videoTimer: videoTimer ?? null,
          isPlaying: true,
          videoTimerIndex: videoTimer ? state.videoTimerIndex + 1 : -1
        };
      }

      return {isPlaying: true};
    });
  },
  stopPlayer() {
    set({isPlaying: false, started: false});
  },
  pauseVideo() {
    set({isPlaying: false});
  },
  playVideo() {
    set({isPlaying: true});
  },
  initPlayer(
    onSpace: (playlistId: string) => void,
    onEscape: () => void,
    video: Video,
    timer: Timer,
    inputType: string
  ) {
    set({video, timer, videoTimer: video.timers.length ? video.timers[0] : null, inputType});

    return (e: KeyboardEvent) => {
      const {started, playlistId, videoTimer, timer, isPlaying, handlePlay} = get();

      if (!VALID_CODES.includes(e.code)) return;

      if (e.code === "Space" && playlistId) {
        onSpace(playlistId);
        return;
      }

      if (!started) return;

      if (e.code === "Escape") {
        set({started: false, isPlaying: false});

        onEscape();
        return;
      }

      if (inputType !== "switch") return;

      if (!videoTimer && timer.playtime === 0 && isPlaying) {
        set({isPlaying: false});
        return;
      }

      handlePlay();
    };
  }
}));
