import React, {useState} from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  defaultAnimateLayoutChanges,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {Button, ListGroup} from "react-bootstrap";
import {GripHorizontal, Trash3Fill} from "react-bootstrap-icons";
import {CSS} from "@dnd-kit/utilities";

export interface SortableItem {
  id: string;
  value: string;
}

export interface SortableListProps {
  items: SortableItem[];
  setItems: (items: SortableItem[]) => void;
  className?: string;
}

export const SortableList = ({items, setItems, className}: SortableListProps) => {
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
          {items.map(item => (
            <BaseItem key={item.id} activeId={activeId} item={item} onDelete={handleDelete} />
          ))}
        </ListGroup>
      </SortableContext>

      <DragOverlay>
        <BaseItem
          activeId={null}
          item={activeId ? items.find(i => i.id === activeId) : null}
          isOverlay
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
}

export const BaseItem = ({item, activeId, onDelete, isOverlay}: BaseItemProps) => {
  if (!item) return null;

  const {transition, transform, setActivatorNodeRef, setNodeRef, attributes, listeners} =
    useSortable({
      id: item.id,
      animateLayoutChanges: args => defaultAnimateLayoutChanges({...args, wasDragging: true})
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    touchAction: "none",
    opacity: activeId === item.id ? 0.75 : undefined
  };

  const dragProps = isOverlay ? {} : {...attributes, ...listeners, ref: setActivatorNodeRef};

  return (
    <ListGroup.Item
      className={`d-flex justify-content-between p-2 ${isOverlay ? "shadow rounded" : ""}`}
      style={style}
      ref={isOverlay ? undefined : setNodeRef}
    >
      <p>{item.value}</p>

      <div>
        <Button variant="outline-primary" aria-label="Move" className="me-2" {...dragProps}>
          <GripHorizontal aria-hidden="true" />
        </Button>
        <Button variant="outline-danger" onClick={() => onDelete?.(item.id)} aria-label="Delete">
          <Trash3Fill aria-hidden="true" />
        </Button>
      </div>
    </ListGroup.Item>
  );
};
