import {ComponentMeta, ComponentStory} from "@storybook/react";
import {ConfirmModal} from "./ConfirmModal";

const componentMeta: ComponentMeta<typeof ConfirmModal> = {
  component: ConfirmModal
};

const Template: ComponentStory<typeof ConfirmModal> = args => <ConfirmModal {...args} />;

export const Default = Template.bind({});

export default componentMeta;
