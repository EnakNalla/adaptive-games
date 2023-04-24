import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  defaultAnimateLayoutChanges,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useState} from "react";
import {Button, ListGroup} from "react-bootstrap";
import {GripHorizontal, Trash3Fill} from "react-bootstrap-icons";

export interface SortableItem {
  id: string;
  value: string;
}

export interface SortableListProps {
  items: SortableItem[];
  setItems: (items: SortableItem[]) => void;
  className?: string;
  useId?: boolean;
  onClick?: (item: SortableItem) => void | Promise<void>;
  active?: string;
  useDataIndex?: boolean;
}

export const SortableList = ({
  items,
  setItems,
  className,
  useId,
  onClick,
  active,
  useDataIndex
}: SortableListProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);

    const {over, active} = e;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(item => item.id === active.id);
    const newIndex = items.findIndex(item => item.id === over.id);

    setItems(arrayMove(items, oldIndex, newIndex));
  };

  const handleDelete = (id: string) => setItems(items.filter(item => item.id !== id));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={{droppable: {strategy: MeasuringStrategy.Always}}}
      onDragStart={({active}) => setActiveId(active.id as string)}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ListGroup className={className}>
          {items.map((item, index) => (
            <BaseItem
              key={item.id}
              activeId={activeId}
              item={item}
              onDelete={handleDelete}
              useId={useId}
              active={active}
              onClick={onClick}
              dataIndex={useDataIndex ? index : undefined}
            />
          ))}
        </ListGroup>
      </SortableContext>

      <DragOverlay>
        <BaseItem
          activeId={null}
          item={activeId ? items.find(i => i.id === activeId) : null}
          isOverlay
          useId={useId}
        />
      </DragOverlay>
    </DndContext>
  );
};

interface BaseItemProps {
  activeId: string | null;
  item?: SortableItem | null;
  onDelete?: (id: string) => void;
  isOverlay?: boolean;
  useId?: boolean;
  active?: string;
  onClick?: (item: SortableItem) => void;
  dataIndex?: number;
}

export const BaseItem = ({
  item,
  activeId,
  onDelete,
  isOverlay,
  useId,
  active,
  onClick,
  dataIndex
}: BaseItemProps) => {
  const {transition, transform, setActivatorNodeRef, setNodeRef, attributes, listeners} =
    useSortable({
      id: item?.id ?? "",
      animateLayoutChanges: args => defaultAnimateLayoutChanges({...args, wasDragging: true})
    });

  if (!item) return null;

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    touchAction: "none",
    opacity: activeId === item.id ? 0.75 : undefined
  };

  const dragProps = isOverlay ? {} : {...attributes, ...listeners, ref: setActivatorNodeRef};

  return (
    <ListGroup.Item
      onClick={() => onClick?.(item)}
      as="div"
      className={`d-flex justify-content-between p-2 ${
        isOverlay ? "shadow rounded" : ""
      } focus-ring`}
      style={style}
      ref={isOverlay ? undefined : setNodeRef}
      action={typeof onClick !== "undefined"}
      active={typeof active !== "undefined" && active === item.id}
      data-index={dataIndex}
      role={typeof onClick !== "undefined" ? "button" : undefined}
      tabIndex={typeof onClick !== "undefined" ? 0 : undefined}
    >
      <p>{useId ? item.id : item.value}</p>

      <div>
        <Button variant="secondary" aria-label="Move" className="me-2 z-3" {...dragProps}>
          <GripHorizontal aria-hidden="true" />
        </Button>
        <Button
          variant="danger"
          onClick={() => onDelete?.(item.id)}
          aria-label="Delete"
          className="z-3"
        >
          <Trash3Fill aria-hidden="true" />
        </Button>
      </div>
    </ListGroup.Item>
  );
};
