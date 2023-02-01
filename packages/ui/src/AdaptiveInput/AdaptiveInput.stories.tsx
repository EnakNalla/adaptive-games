import {ComponentMeta, ComponentStory} from "@storybook/react";
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
  type: "switch",
  size: "md",
  fixedCentre: false
};

export const Touch = Template.bind({});
Touch.args = {
  type: "touch",
  size: "md",
  fixedCentre: false
};

export const Mouse = Template.bind({});
Mouse.args = {
  type: "mouse",
  size: "md",
  fixedCentre: false
};

export const EyeGaze = Template.bind({});
EyeGaze.args = {
  type: "eyeGaze",
  size: "md",
  fixedCentre: false
};
export default componentMeta;
