import {type StateCreator} from "zustand";
import {useStore, type PersistState, type MissHit} from ".";
type PlayerState = {
  hasStarted: boolean;
  playing: boolean;
  canvasClick: boolean;
};
type PlayerActions = {
  setHasStarted: () => void;
  setPlaying: (playing: boolean) => void;
  setCanvasClick: (canvasClick: boolean) => void;
  missHits: MissHit;
};
export type PlayerStore = PlayerState & PlayerActions;
type PlayerStoreCreator = StateCreator<
  PlayerStore,
  [],
  [["zustand/immer", never], ["zustand/persist", PersistState]],
  PlayerStore
>;

export const createPlayerStore: PlayerStoreCreator = set => ({
  hasStarted: false,
  setHasStarted: () => set({hasStarted: true}),
  playing: false,
  setPlaying: playing => set({playing}),
  canvasClick: false,
  setCanvasClick: canvasClick => set({canvasClick}),
  missHits: {}
});

export class PlayerApi {
  private timeout: NodeJS.Timeout | null = null;
  private missHitCount = 0;
  private startTime = 0;
  private _audio: HTMLAudioElement | null = null;

  public set audio(audio: HTMLAudioElement) {
    this._audio = audio;

    this._audio.addEventListener("ended", this.audioEnded);
  }

  private audioEnded = () => {
    const {configs, setSongIndex} = useStore.getState();
    const config = configs.find(x => x.loaded)!;
    const {shuffle, songs, songIndex} = config;

    let index = 0;
    if (shuffle) index = Math.floor(Math.random() * songs.length - 1);
    else if (songIndex < songs.length - 1) index = songIndex + 1;

    setSongIndex(songs[index]!);
  };

  public play = () => {
    const config = useStore.getState().configs.find(x => x.loaded)!;
    const timer = config.timers.find(x => x.isDefault)!;

    void this._audio?.play();
    useStore.setState({playing: true, canvasClick: true});
    this.startTime = Math.round(this._audio?.currentTime ?? 0);

    if (timer.playtime !== 0) this.timeout = setTimeout(this.pause, timer.playtime * 1000);
  };

  private pause = (stop = false) => {
    if (this.timeout) clearTimeout(this.timeout);
    const config = useStore.getState().configs.find(x => x.loaded)!;
    const song = config.songs[config.songIndex];

    this._audio?.pause();

    if (stop) {
      useStore.setState(state => {
        state.playing = false;
        state.hasStarted = false;
        const range = `${this.startTime} - ${Math.round(this._audio?.currentTime ?? 0)}`;
        if (song?.id) {
          if (song?.id in state.missHits)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - this is fine
            state.missHits[song.id].push({count: this.missHitCount, range});
          else state.missHits[song.id] = [{count: this.missHitCount, range}];
        }

        return state;
      });

      this.missHitCount = 0;
    } else {
      useStore.setState({playing: false});
    }
  };

  public handleKeup = (e: KeyboardEvent) => {
    const {playing, hasStarted, configs} = useStore.getState();
    const config = configs.find(x => x.loaded)!;
    const {inputConfig, timers} = config;
    const timer = timers.find(x => x.isDefault)!;
    const song = config.songs[config.songIndex];

    if (e.code === "Escape") {
      this.pause(true);
      return;
    }

    if (inputConfig.type !== "SWITCH") return;

    if (e.code === "Space") {
      if (playing) this.pause(true);
      else if (hasStarted) useStore.setState({hasStarted: false});

      this.selectSong();
      return;
    }

    if (e.code === "Enter") {
      if (playing) {
        if (timer.playtime === 0) this.pause();
        else this.missHitCount++;
      } else if (!playing && (hasStarted || song)) this.play();
    }
  };

  private selectSong = () => {
    const {configs, setSongIndex} = useStore.getState();
    const config = configs.find(x => x.loaded)!;
    const {songs, songIndex, useSpeach} = config;

    window.speechSynthesis.cancel();

    let index = 0;
    if (songIndex !== songs.length - 1) index = songIndex + 1;

    const target: HTMLElement | null = document.querySelector(`[data-index="${index}"]`);
    if (!target) return;

    const text = target.textContent;

    if (useSpeach && text) {
      const speach = new SpeechSynthesisUtterance();
      speach.text = text;
      speach.lang = "en-GB";
      window.speechSynthesis.speak(speach);
    }

    target.focus();

    setSongIndex(songs[index]!);
  };

  public handleKeydown = (e: KeyboardEvent) => {
    const config = useStore.getState().configs.find(x => x.loaded)!;
    const {inputConfig} = config;

    if (e.code === "Space" && inputConfig.type === "SWITCH") e.preventDefault();
  };

  public handleCanvasClick = () => {
    const {configs, canvasClick} = useStore.getState();
    const timer = configs.find(x => x.loaded)!.timers.find(x => x.isDefault)!;

    if (canvasClick) {
      useStore.setState({canvasClick: false});
      return;
    }

    if (timer.playtime === 0) this.pause();
  };
}
