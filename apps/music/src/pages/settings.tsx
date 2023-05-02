import {AdaptiveInputConfig} from "@ag/ui";
import {Tabs, Tab} from "react-bootstrap";
import {TimerTable} from "~/components/TimerTable";
import {VisualiserSettingsTab} from "~/components/VisualiserSettings";
import {useStore, useConfig} from "~/store";

const Settings = () => {
  const {setVisualiserSettings, setTimer, setTimers, setInputConfig} = useStore(state => ({
    setVisualiserSettings: state.setVisualiserSettings,
    setTimer: state.setTimer,
    setTimers: state.setTimers,
    setInputConfig: state.setInputConfig
  }));
  const config = useConfig();

  return (
    <>
      <h1 className="text-center mb-4">{config.id} Settings</h1>
      <Tabs defaultActiveKey="adaptive-input">
        <Tab title="Adaptive Input" eventKey="adaptive-input">
          <AdaptiveInputConfig inputConfig={config.inputConfig} onSubmit={setInputConfig} />
        </Tab>
        <Tab title="Timers" eventKey="timers">
          <TimerTable timers={config.timers} setTimer={setTimer} setTimers={setTimers} />
        </Tab>
        <Tab title="Visualiser settings" eventKey="visualiser-settings">
          <VisualiserSettingsTab
            visualiserSettings={config.visualiserSettings}
            setVisualiserSettings={setVisualiserSettings}
          />
        </Tab>
      </Tabs>
    </>
  );
};

export default Settings;
