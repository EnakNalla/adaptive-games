import {
  type VisualiserTypes,
  visualiserTypeOptions,
  type VisualiserSettings,
  useStore,
  useConfig
} from "~/store";
import {FloatingLabel, FormSelect} from "react-bootstrap";
import type {ChangeEvent} from "react";
import {NamedSection} from "./templates/NamedSection";
import {type Timer} from "@ag/db";

export const QuickSettings = () => {
  const {setVisualiserSettings, setTimer} = useStore(state => ({
    setVisualiserSettings: state.setVisualiserSettings,
    setTimer: state.setTimer
  }));
  const config = useConfig();

  return (
    <NamedSection title="Quick Settings">
      <VisualiserSelect
        visualiserSettings={config.visualiserSettings}
        setVisualiserSettings={setVisualiserSettings}
      />

      <TimerSelect timers={config.timers} setTimer={setTimer} />
    </NamedSection>
  );
};

interface VisualiserSelectProps {
  visualiserSettings: VisualiserSettings;
  setVisualiserSettings: (settings: VisualiserSettings) => void;
}

const VisualiserSelect = ({visualiserSettings, setVisualiserSettings}: VisualiserSelectProps) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as VisualiserTypes;

    setVisualiserSettings({...visualiserSettings, type});
  };

  return (
    <FloatingLabel label="Select Visualiser" controlId="visualiser-select" className="mt-4">
      <FormSelect value={visualiserSettings.type} onChange={handleChange}>
        {visualiserTypeOptions.map(option => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </FormSelect>
    </FloatingLabel>
  );
};

interface TimerSelectProps {
  timers: Timer[];
  setTimer: (timerId: string) => void;
}

const TimerSelect = ({timers, setTimer}: TimerSelectProps) => {
  return (
    <FloatingLabel label="Select timer" controlId="timer-select" className="mt-4">
      <FormSelect
        value={timers.find(x => x.isDefault)!.name}
        onChange={e => setTimer(e.target.value)}
      >
        {timers.map(timer => (
          <option key={timer.name} value={timer.name}>
            {timer.name}
          </option>
        ))}
      </FormSelect>
    </FloatingLabel>
  );
};
