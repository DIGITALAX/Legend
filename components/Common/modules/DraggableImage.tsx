import { useDrag, useDrop } from "react-dnd";

const DraggableImage = ({ index, children, onDropImage }: any) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'IMAGE',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'IMAGE',
    hover(item: any, monitor) {
      if (item.index !== index) {
        onDropImage(item.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div ref={drag}>{children}</div>
    </div>
  );
};

export default DraggableImage;
