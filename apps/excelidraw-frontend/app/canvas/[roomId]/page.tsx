"use client";

import { useEffect, useRef } from "react";

const Page = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return;
      }
      let clicked = false;

      let startX = 0;
      let startY = 0;

      canvas.addEventListener("mousedown", (e) => {
        startX = e.clientX;
        startY = e.clientY;
        clicked = true;
      });
      canvas.addEventListener("mouseup", (e) => {
        console.log(e.clientX);
        console.log(e.clientY);
        clicked = false;
      });
      canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
          const width = e.clientX - startX;
          const height = e.clientY - startY;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeRect(startX, startY, width, height);
        }
      });
    }

    return () => {};
  }, [canvasRef]);

  return (
    <div className="overflow-hidden ">
      <canvas
        height={500}
        width={800}
        ref={canvasRef}
        style={{
          border: "1px solid black",

          backgroundColor: "#aabfbf",
        }}
      ></canvas>
    </div>
  );
};

export default Page;
