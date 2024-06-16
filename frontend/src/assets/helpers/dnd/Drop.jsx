import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
  AGENT: 'agent',
  TOOL: 'tool',
  LLM: 'llm',
};

const DraggableItem = ({ id, type, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { id, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      {children}
    </div>
  );
};

const DropTarget = ({ onDrop, children }) => {
  const [, drop] = useDrop(() => ({
    accept: [ItemTypes.AGENT, ItemTypes.TOOL, ItemTypes.LLM],
    drop: (item) => {
      onDrop(item);
    },
  }));

  return <div ref={drop}>{children}</div>;
};

export { DraggableItem, DropTarget, ItemTypes };
