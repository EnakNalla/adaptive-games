import {type StateCreator} from "zustand";
import {type PersistState} from ".";

type GeneralState = {
  hasHydrated: boolean;
};
type GeneralActions = {
  setHasHydrated: () => void;
};
export type GeneralStore = GeneralState & GeneralActions;
type GeneralStoreCreator = StateCreator<
  GeneralStore,
  [],
  [["zustand/immer", never], ["zustand/persist", PersistState]],
  GeneralStore
>;

export const createGeneralStore: GeneralStoreCreator = set => ({
  hasHydrated: false,
  setHasHydrated: () => set({hasHydrated: true})
});
