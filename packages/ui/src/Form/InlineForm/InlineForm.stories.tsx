/* eslint-disable @typescript-eslint/await-thenable */
import {type ComponentMeta, type ComponentStory} from "@storybook/react";
import {InlineForm} from "./InlineForm";
import {userEvent, waitFor, within} from "@storybook/testing-library";
import {expect} from "@storybook/jest";

const componentMeta: ComponentMeta<typeof InlineForm> = {
  component: InlineForm,
  args: {
    label: "Inline form",
    id: "inline-form"
  }
};

const Template: ComponentStory<typeof InlineForm> = args => <InlineForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  validation: {
    required: "Value required"
  },
  initialValue: ""
};
Default.play = async ({canvasElement, args}) => {
  const canvas = within(canvasElement);

  await userEvent.type(canvas.getByRole("textbox"), "test");

  await userEvent.click(canvas.getByRole("button"));

  await waitFor(() => expect(args.onSubmit).toHaveBeenCalledWith("test"));
};

export const WithError = Template.bind({});
WithError.args = {
  initialValue: "",
  onSubmit: () => {
    throw new Error("Error");
  }
};
WithError.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByRole("button"));

  await waitFor(() => expect(canvas.getByText("Error")).toBeInTheDocument());
};

export default componentMeta;
