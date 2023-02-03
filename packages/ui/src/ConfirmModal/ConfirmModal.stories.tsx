import {ComponentMeta, ComponentStory} from "@storybook/react";
import {ConfirmModal} from "./ConfirmModal";

const componentMeta: ComponentMeta<typeof ConfirmModal> = {
  component: ConfirmModal
};

const Template: ComponentStory<typeof ConfirmModal> = args => <ConfirmModal {...args} />;

export const Default = Template.bind({});

export const WithError = Template.bind({});
WithError.args = {
  onConfirm: () => {
    throw new Error("Error: Failed to delete.");
  }
};

export default componentMeta;
