import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {createJSONStorage, persist} from "zustand/middleware";
import {Store} from "tauri-plugin-store-api";
import {createConfigStore, type ConfigStore} from "./configStore";
import {type GeneralStore, createGeneralStore} from "./generalStore";
import {type Config} from "./types";
import {type PlayerStore, createPlayerStore} from "./playerStore";
import {defaultState} from "./defaults";

const store = new Store(".store.json");

const jsonStore = {
  getItem: async (key: string): Promise<string | null> => {
    const item = await store.get<string | null>(key);
    if (!item) return defaultState;
    return item;
  },
  setItem: async (key: string, value: string) => {
    await store.set(key, value);
    await store.save();
  },
  removeItem: async (key: string) => {
    await store.delete(key);
    await store.save();
  }
};

export interface PersistState {
  configs: Config[];
}

export const useStore = create<ConfigStore & GeneralStore & PlayerStore>()(
  immer(
    persist(
      (...a) => ({
        ...createConfigStore(...a),
        ...createGeneralStore(...a),
        ...createPlayerStore(...a)
      }),
      {
        name: "music",
        partialize: state => ({
          configs: state.configs
        }),
        storage: createJSONStorage(() => jsonStore),
        onRehydrateStorage: () => state => state?.setHasHydrated()
      }
    )
  )
);

export const useSong = () => {
  const config = useStore(state => state.configs.find(x => x.loaded));

  return config?.songs[config?.songIndex];
};

export const useConfig = () => useStore(state => state.configs.find(x => x.loaded)!);

export * from "./types";
