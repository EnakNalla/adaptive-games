import {type InputConfig} from "@ag/db";
import {Checkbox, FormBase, Input, Select} from "../Form";
import {Button} from "react-bootstrap";

export interface AdaptiveInputConfigProps {
  inputConfig: InputConfig;
  onSubmit: (data: InputConfig) => void | Promise<void>;
}

export const AdaptiveInputConfig = ({inputConfig, onSubmit}: AdaptiveInputConfigProps) => {
  return (
    <FormBase defaultValues={inputConfig} onSubmit={onSubmit} className="mt-3">
      <Select
        options={[
          {value: "EYEGAZE", label: "Eye gaze"},
          {value: "MOUSE", label: "Mouse"},
          {value: "TOUCH", label: "Touch"},
          {value: "SWITCH", label: "Switch"}
        ]}
        name="type"
        label="Input type"
        className="mb-3"
      />
      <Select
        options={[
          {label: "sm", value: "sm"},
          {label: "md", value: "md"},
          {label: "lg", value: "lg"}
        ]}
        name="size"
        label="Size"
        className="mb-3"
      />
      <Input
        type="color"
        name="borderColour"
        label="Border colur"
        hint="The colour of the input border"
        className="mb-3"
      />
      <Checkbox name="fixedCentre" label="Fixed centre?" className="mb-3" />
      <Input
        name="dwellTime"
        label="Dwell time (Eye gaze)"
        hint="Amount of time before action triggers"
        className="mb-3"
      />
      <Input
        type="color"
        name="effectColour"
        label="Effect colour (Eye gaze)"
        hint="The colour of the dwell animation"
        className="mb-3"
      />
      <Button type="submit">Save</Button>
    </FormBase>
  );
};
