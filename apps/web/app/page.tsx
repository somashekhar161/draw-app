"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  return (
    <div className={" flex  items-center justify-center h-screen gap-4"}>
      <input
        type="text"
        placeholder="Room id"
        className=" shadow px-4 py-2  rounded bg-gray-800 "
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button
        onClick={() => {
          if (roomId) {
            router.push(`/room/${roomId}`);
          }
        }}
        className="rounded-lg active:scale-95 bg-gray-700 px-4 py-2"
      >
        Join room
      </button>
    </div>
  );
}
