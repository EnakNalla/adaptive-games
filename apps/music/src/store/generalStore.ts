import {type StateCreator} from "zustand";
import {type PersistState} from ".";

interface Notification {
  id: string;
  title?: string;
  body: string;
  variant: "success" | "danger" | "warning" | "info";
}

type GeneralState = {
  hasHydrated: boolean;
  notifications: Notification[];
};
type GeneralActions = {
  setHasHydrated: () => void;
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
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
  setHasHydrated: () => set({hasHydrated: true}),

  notifications: [],
  addNotification: notification => {
    set(state => ({
      notifications: [
        ...state.notifications,
        {
          id: Math.random().toString(36).substr(2, 9),
          title: notification.title ?? notification.variant,
          body: notification.body,
          variant: notification.variant
        }
      ]
    }));
  },
  removeNotification: id =>
    set(state => ({notifications: state.notifications.filter(x => x.id !== id)}))
});
