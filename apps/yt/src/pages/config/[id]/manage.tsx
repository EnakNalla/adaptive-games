import {InputConfig} from "@ag/api";
import {useRouter} from "next/router";
import {Tab, Tabs} from "react-bootstrap";
import {ManageInputConfig} from "../../../components/config/ManageInputConfig";
import {ManagePlaylists} from "../../../components/config/ManagePlaylists";
import ManageTimers from "../../../components/config/ManageTimers";
import {useConfig} from "../../../utils/hooks";
import {useEffect} from "react";

const UpdateConfig = () => {
  const router = useRouter();
  const {data: config, isLoading, error, invalidate} = useConfig(router.query.id as string);

  useEffect(() => {
    if (!error) return;

    let err = error.message;
    if (process.env.NODE_ENV === "production") err = "Config could not be found";

    void router.push(`/error?error=${err}`);
  }, [error]);

  if (isLoading || !config) return null;

  return (
    <>
      <h1 className="text-center">Manage {config.name} config</h1>
      <Tabs defaultActiveKey="inputConfig">
        <Tab eventKey="inputConfig" title="Input config">
          <ManageInputConfig
            configId={config.id}
            inputConfig={config?.inputConfig as InputConfig}
          />
        </Tab>
        <Tab eventKey="timers" title="Timers">
          <ManageTimers configId={config.id} />
        </Tab>
        <Tab eventKey="playlists" title="Playlists">
          <ManagePlaylists
            ytConfigId={config.id}
            invalidate={() => void invalidate()}
            playlists={config.playlists}
          />
        </Tab>
      </Tabs>
    </>
  );
};

export default UpdateConfig;
