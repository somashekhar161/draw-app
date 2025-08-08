"use client";
import { WS_URL } from "@/config";

import { useEffect, useState } from "react";
import Canvas from "./Canvas";

const RoomCanvas = ({ roomId }: { roomId: string }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (roomId) {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NjczNTMzMC0wYWY5LTRlMTEtYTE1OS0xNDc0NmU3MjM1NjQiLCJpYXQiOjE3NTQ2NzY3ODh9.xyBvWiAACJgJ94W4l9gu_liwhmCtGJbxpN02sXbYFD4";
      const ws = new WebSocket(`${WS_URL}?token=${token}`);
      ws.onopen = () => {
        setSocket(ws);
        ws.send(
          JSON.stringify({
            type: "join_room",
            roomId: Number(roomId),
          })
        );
      };
    }

    return () => {};
  }, [roomId]);

  if (!socket) return <div> connecting to server </div>;
  return <Canvas roomId={roomId} socket={socket} />;
};

export default RoomCanvas;
