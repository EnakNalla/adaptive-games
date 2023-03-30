/* eslint-disable @typescript-eslint/ban-ts-comment */
import {api} from "../utils/api";
import {useAppStore} from "./useAppStore";

export const queryOptions = {
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchInterval: false
};

export const useConfig = (configId?: string) => {
  const utils = api.useContext();
  const savedId = useAppStore(s => s.configId);
  // @ts-ignore - useQuery lies about queryOptions types being invalid
  const query = api.yt.getConfig.useQuery(configId ?? savedId, queryOptions);

  const invalidate = async () => {
    await utils.yt.getConfig.invalidate();
  };

  return {...query, invalidate};
};

export const useAllConfigs = () => {
  const utils = api.useContext();
  // @ts-ignore - useQuery lies about queryOptions types being invalid
  const query = api.yt.getAllConfigs.useQuery(undefined, queryOptions);

  const invalidate = async () => {
    await utils.yt.getAllConfigs.invalidate();
  };

  return {...query, invalidate};
};

export const usePlaylist = (id?: string, isGlobal = false) => {
  const utils = api.useContext();
  const query = api.yt.getPlaylist.useQuery(
    {id: id as string, isGlobal},
    // @ts-ignore - useQuery lies about queryOptions types being invalid
    {...queryOptions, enabled: !!id}
  );

  const invalidate = async (): Promise<void> => await utils.yt.getPlaylist.invalidate();

  return {...query, invalidate};
};
