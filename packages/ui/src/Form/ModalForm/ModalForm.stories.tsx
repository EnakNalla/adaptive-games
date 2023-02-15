import {ComponentMeta, ComponentStory} from "@storybook/react";
import {Input} from "../Input";
import {ModalForm} from "./ModalForm";

const componentMeta: ComponentMeta<typeof ModalForm> = {
  component: ModalForm
};

const Template: ComponentStory<typeof ModalForm> = args => <ModalForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  defaultValues: {name: ""},
  title: "Add new user",
  children: (
    <div>
      <Input name="name" label="Name" />
    </div>
  ),
  btnProps: {
    children: "Open form"
  }
};

export default componentMeta;
