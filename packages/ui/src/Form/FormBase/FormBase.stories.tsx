/* eslint-disable @typescript-eslint/no-misused-promises, @typescript-eslint/require-await, @typescript-eslint/await-thenable */
import {type ComponentMeta, type ComponentStory} from "@storybook/react";
import {FormBase} from "./FormBase";
import {Input} from "../Input";
import {Button} from "react-bootstrap";
import {Select} from "../Select";
import {Checkbox} from "../Checkbox";
import {userEvent, waitFor, within} from "@storybook/testing-library";
import {expect} from "@storybook/jest";

const selectOptions = [
  {value: "", label: "Select an option"},
  {value: "1", label: "Option 1"},
  {value: "2", label: "Option 2"},
  {value: "3", label: "Option 3"}
];

const componentMeta: ComponentMeta<typeof FormBase> = {
  component: FormBase
};

const Template: ComponentStory<typeof FormBase> = args => <FormBase {...args} />;

export const Default = Template.bind({});
Default.args = {
  defaultValues: {
    inputTest: "",
    selectTest: "",
    checkboxTest: false
  },
  children: (
    <div>
      <Input name="inputTest" label="Input test" />
      <Select name="selectTest" label="Select test" options={selectOptions} />
      <Checkbox name="checkboxTest" label="Checkbox test" />
      <Button type="submit">Submit</Button>
    </div>
  )
};
Default.play = async ({canvasElement, args}) => {
  setTimeout(async () => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText("Input test"), "test", {delay: 10});
    await userEvent.selectOptions(canvas.getByLabelText("Select test"), "2");
    await userEvent.click(canvas.getByLabelText("Checkbox test"));
    await userEvent.click(canvas.getByRole("button"));

    await waitFor(() =>
      expect(args.onSubmit).toHaveBeenCalledWith({
        inputTest: "test",
        selectTest: "2",
        checkboxTest: true
      })
    );
  }, 500);
};

export const WithError = Template.bind({});
WithError.args = {
  defaultValues: {
    inputTest: "",
    selectTest: "",
    checkboxTest: true
  },
  children: (
    <div>
      <Input name="inputTest" label="Input test" validation={{required: "Input is required"}} />
      <Select
        name="selectTest"
        label="Select test"
        options={selectOptions}
        validation={{required: "Please select an option"}}
        className="my-2"
      />
      <Checkbox name="checkboxTest" label="Checkbox test" />
      <Button type="submit" className="mt-2">
        Submit
      </Button>
    </div>
  )
};
WithError.play = async ({canvasElement}) => {
  setTimeout(async () => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button"));

    await waitFor(() => expect(canvas.getByText("Input is required")).toBeInTheDocument());
    await waitFor(() => expect(canvas.getByText("Please select an option")).toBeInTheDocument());
  }, 500);
};

export const SubmitError = Template.bind({});
SubmitError.args = {
  defaultValues: {
    inputTest: ""
  },
  children: (
    <div>
      <Input name="inputTest" label="Input test" />
      <Button type="submit">Submit</Button>
    </div>
  ),
  onSubmit: () => {
    throw new Error("Submit error");
  }
};
SubmitError.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByRole("button"));

  await waitFor(() => expect(canvas.getByText("Submit error")).toBeInTheDocument());
};

export const Submitting = Template.bind({});
Submitting.args = {
  defaultValues: {
    inputTest: ""
  },
  children: (
    <div>
      <Input name="inputTest" label="Input test" />
      <Button type="submit">Submit</Button>
    </div>
  ),
  onSubmit: () => {
    return new Promise(resolve => setTimeout(resolve, 5000));
  }
};
Submitting.play = ({canvasElement}) => {
  setTimeout(async () => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button"));

    await waitFor(() => expect(canvas.getByText("Submitting...")).toBeInTheDocument());
  }, 500);
};
export default componentMeta;
