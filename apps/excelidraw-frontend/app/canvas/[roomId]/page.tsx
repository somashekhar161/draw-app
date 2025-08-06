"use client";

import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

const Page = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      initDraw(canvas);
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
    </div>
  );
};

export default Page;
