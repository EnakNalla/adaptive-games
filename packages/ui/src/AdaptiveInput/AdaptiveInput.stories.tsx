import {type ComponentMeta, type ComponentStory} from "@storybook/react";
import {AdaptiveInput} from "./AdaptiveInput";

const componentMeta: ComponentMeta<typeof AdaptiveInput> = {
  component: AdaptiveInput,
  parameters: {
    layout: "fullscreen"
  }
};

const Template: ComponentStory<typeof AdaptiveInput> = args => <AdaptiveInput {...args} />;

export const Switch = Template.bind({});
Switch.args = {
  type: "SWITCH",
  size: "MD",
  fixedCentre: false
};

export const Touch = Template.bind({});
Touch.args = {
  type: "TOUCH",
  size: "MD",
  fixedCentre: false
};

export const Mouse = Template.bind({});
Mouse.args = {
  type: "MOUSE",
  size: "MD",
  fixedCentre: false
};

export const EyeGaze = Template.bind({});
EyeGaze.args = {
  type: "EYEGAZE",
  size: "MD",
  fixedCentre: false
};
export default componentMeta;
