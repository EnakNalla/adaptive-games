import {ComponentMeta, ComponentStory} from "@storybook/react";
import {AdaptiveInputSelector} from "./AdaptiveInputSelector";

const componentMeta: ComponentMeta<typeof AdaptiveInputSelector> = {
  component: AdaptiveInputSelector
};

const Template: ComponentStory<typeof AdaptiveInputSelector> = args => (
  <AdaptiveInputSelector {...args} />
);

export const Default = Template.bind({});

export default componentMeta;
