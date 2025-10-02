// import { initDraw } from "@/draw";
import React, { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { Game } from "@/draw/Game";

enum Tool {
  pencil = "pencil",
  rectangle = "rect",
  circle = "circle",
}
const Canvas = ({ roomId, socket }: { roomId: string; socket: WebSocket }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState(Tool.rectangle);
  const [game, setGame] = useState<Game>();

  useEffect(() => {
    game?.setShape(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const g = new Game(canvas, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      };
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
  selectedTool: Tool;
  setSelectedTool: React.Dispatch<React.SetStateAction<Tool>>;
}) {
  return (
    <div className="absolute top-0 left-1/2 flex gap-2 p-2">
      <IconButton
        activated={selectedTool === Tool.pencil}
        icon={<Pencil />}
        onClick={() => {
          setSelectedTool(Tool.pencil);
        }}
      />
      <IconButton
        activated={selectedTool === Tool.rectangle}
        icon={<RectangleHorizontalIcon />}
        onClick={() => {
          setSelectedTool(Tool.rectangle);
        }}
      />
      <IconButton
        activated={selectedTool === Tool.circle}
        icon={<Circle />}
        onClick={() => {
          setSelectedTool(Tool.circle);
        }}
      />
    </div>
  );
}
