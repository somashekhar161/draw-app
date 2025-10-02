import { getExistingShape } from "./http";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "pencil";
      centerX: number;
      centerY: number;
      endX: number;
      endY: number;
    };
export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const ctx = canvas.getContext("2d");

  const existingShape: Shape[] = await getExistingShape(roomId);
  if (!ctx) {
    return;
  }
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type == "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShape.push(parsedShape);
      clearCanvas(existingShape, canvas, ctx);
    }
  };

  clearCanvas(existingShape, canvas, ctx);

  let clicked = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    startY = e.clientY;
    clicked = true;
  });
  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;

    ctx.strokeStyle = "rgba(255,255,255)";
    // @ts-expect-error here
    const selectedTool = window.selectedTool;
    let shape: Shape | null = null;
    if (selectedTool === "rect") {
      shape = {
        type: "rect",
        x: startX,
        y: startY,
        height,
        width,
      };
    } else if (selectedTool === "circle") {
      const radius = Math.max(width, height) / 2;
      const centerX = startX + width / 2;
      const centerY = startY + height / 2;
      shape = {
        type: "circle",
        centerX: centerX,
        centerY: centerY,
        radius: radius,
      };
    }

    if (!shape) return;

    existingShape.push(shape);
    socket.send(
      JSON.stringify({
        type: "chat",
        roomId: Number(roomId),
        userId: "2",
        message: JSON.stringify(shape),
      })
    );
  });
  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;

      clearCanvas(existingShape, canvas, ctx);
      ctx.strokeStyle = "rgba(255,255,255)";
      // @ts-expect-error here for selectedTool
      const selectedTool = window.selectedTool;
      if (selectedTool === "rect") {
        ctx.strokeRect(startX, startY, width, height);
      } else if (selectedTool === "circle") {
        const centerX = startX + width / 2;
        const centerY = startY + height / 2;
        const radius = Math.max(width, height) / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
      }
    }
  });
}

function clearCanvas(
  existingShape: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShape.map((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.strokeStyle = "rgba(255,255,255)";

      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
  });
}
