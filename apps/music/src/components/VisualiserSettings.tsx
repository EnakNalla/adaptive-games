import {FormBase, Input, Select, type SelectOption} from "@ag/ui";
import {visualiserTypeOptions, type VisualiserSettings} from "~/store";
import {Stack, Button} from "react-bootstrap";
import {DEFAULT_VISUALISER_SETTINGS} from "~/store/defaults";

const strokeOptions: SelectOption[] = [
  {value: 2, label: "2"},
  {value: 4, label: "4"},
  {value: 6, label: "6"},
  {value: 8, label: "8"},
  {value: 10, label: "10"},
  {value: 12, label: "12"},
  {value: 14, label: "14"},
  {value: 16, label: "16"},
  {value: 18, label: "18"},
  {value: 20, label: "20"}
];

interface VisualiserSettingsProps {
  visualiserSettings: VisualiserSettings;
  setVisualiserSettings: (settings: VisualiserSettings) => void;
}

export const VisualiserSettingsTab = ({
  visualiserSettings,
  setVisualiserSettings
}: VisualiserSettingsProps) => {
  const handleReset = () => setVisualiserSettings(DEFAULT_VISUALISER_SETTINGS);

  const handleSubmit = (values: VisualiserSettings) => {
    setVisualiserSettings(values);

    // addNotification({title: "Success", message: "Settings saved", variant: "success"});
  };

  return (
    <FormBase defaultValues={visualiserSettings} onSubmit={handleSubmit} className="mt-4">
      <Select name="type" label="Type" options={visualiserTypeOptions} />
      <Select name="stroke" label="Stroke" options={strokeOptions} />

      <h3 className="text-center my-4">Colours</h3>

      <Input name="colours.primary" label="Primary" type="color" inline className="my-4" />
      <Input name="colours.secondary" label="Secondary" type="color" inline className="my-4" />
      <Input name="colours.tertiary" label="Tertiary" type="color" inline className="my-4" />
      <Input name="colours.quaternary" label="Quaternary" type="color" inline className="my-4" />
      <Input name="colours.background" label="Background" type="color" inline className="my-4" />

      <Stack direction="horizontal" gap={4}>
        <Button type="submit">Save</Button>
        <Button type="button" variant="warning" onClick={handleReset}>
          Reset
        </Button>
      </Stack>
    </FormBase>
  );
};
