import {ComponentMeta} from "@storybook/react";
import {SortableItem, SortableList} from "./SortableList";
import {useState} from "react";

const componentMeta: ComponentMeta<typeof SortableList> = {
  component: SortableList
};

export const Default = () => {
  const [items, setItems] = useState<SortableItem[]>([
    {id: "1", value: "Item 1"},
    {id: "2", value: "Item 2"},
    {id: "3", value: "Item 3"},
    {id: "4", value: "Item 4"},
    {id: "5", value: "Item 5"}
  ]);

  return <SortableList items={items} setItems={setItems} />;
};

export default componentMeta;
