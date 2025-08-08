import { initDraw } from "@/draw";
import React, { useEffect, useRef } from "react";

const Canvas = ({ roomId, socket }: { roomId: string; socket: WebSocket }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      initDraw(canvas, roomId,socket);
    }

    return () => {};
  }, [canvasRef]);
  return (
    <div className="overflow-hidden ">
      <canvas
        height={700}
        width={1200}
        ref={canvasRef}
        style={{
          border: "1px solid black",

          backgroundColor: "black",
        }}
      ></canvas>
      <div className="absolute top-0 left-1/2 flex gap-2 p-2">
        <button className="bg-white px-4 py-2 text-black rounded font-semibold">
          Rect
        </button>
        <button className="bg-white px-4 py-2 text-black rounded font-semibold">
          Chape
        </button>
      </div>
    </div>
  );
};

export default Canvas;
