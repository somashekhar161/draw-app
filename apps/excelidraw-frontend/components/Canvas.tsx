import { initDraw } from "@/draw";
import React, { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";

enum Shape {
  pencil,
  rectangle,
  circle,
}
const Canvas = ({ roomId, socket }: { roomId: string; socket: WebSocket }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState(Shape.rectangle);
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      initDraw(canvas, roomId, socket);
    }

    return () => {};
  }, [canvasRef]);

  const [windowSize, setWindowSize] = useState({ height: 0, width: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    window.addEventListener("resize", handleResize);
    // Set initial size
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="h-[100vh] overflow-hidden ">
      <canvas
        height={windowSize.height}
        width={windowSize.width}
        ref={canvasRef}
        style={{
          border: "1px solid black",
          backgroundColor: "black",
        }}
      ></canvas>
      <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
};

export default Canvas;

function Topbar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Shape;
  setSelectedTool: React.Dispatch<React.SetStateAction<Shape>>;
}) {
  return (
    <div className="absolute top-0 left-1/2 flex gap-2 p-2">
      <IconButton
        activated={selectedTool === Shape.pencil}
        icon={<Pencil />}
        onClick={() => {
          setSelectedTool(Shape.pencil);
        }}
      />
      <IconButton
        activated={selectedTool === Shape.rectangle}
        icon={<RectangleHorizontalIcon />}
        onClick={() => {
          setSelectedTool(Shape.rectangle);
        }}
      />
      <IconButton
        activated={selectedTool === Shape.circle}
        icon={<Circle />}
        onClick={() => {
          setSelectedTool(Shape.circle);
        }}
      />
    </div>
  );
}
