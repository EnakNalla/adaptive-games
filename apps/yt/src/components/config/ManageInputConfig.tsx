import {Checkbox, FormBase, Input, Select} from "@ag/ui";
import {Button} from "react-bootstrap";
import {api} from "../../utils/api";
import {InputConfig} from "@ag/api";

interface InputConfigProps {
  configId: string;
  inputConfig: InputConfig;
}
export const ManageInputConfig = ({configId, inputConfig}: InputConfigProps) => {
  const {mutateAsync} = api.yt.updateInputConfig.useMutation();

  const handleSubmit = async (values: InputConfig) => {
    const data = {...values, dwellTime: Number(values.dwellTime)};
    await mutateAsync({id: configId, data: data});
  };

  return (
    <FormBase defaultValues={inputConfig} onSubmit={handleSubmit} className="mt-3">
      <Select
        options={[
          {value: "eyeGaze", label: "Eye gaze"},
          {value: "switch", label: "Switch"},
          {value: "mouse", label: "Mouse"},
          {value: "touch", label: "Touch"}
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
