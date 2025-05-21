"use client";
import React, { useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";

const ChatRoomClient = ({
  messages,
  id,
}: {
  messages: {
    id: number;
    message: string;
    roomId: number;
    userId: string;
  }[];
  id: number;
}) => {
  const [chats, setChats] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");
  const { socket, loading } = useSocket();
  useEffect(() => {
    if (socket && !loading) {
      // if (socket && socket.readyState === WebSocket.OPEN) {
      //   socket.send(JSON.stringify({ type: "join_room", roomId: id }));
      // }
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        })
      );

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setChats((c) => [
            ...c,
            {
              id: 1,
              message: parsedData.message as string,
              roomId: 2,
              userId: "2",
            },
          ]);
        }
      };
    }

    return () => {};
  }, [socket, loading, id]);

  return (
    <div>
      {chats.map((m) => (
        <div key={m.id}>{m.message}</div>
      ))}
      <input
        placeholder="new message "
        onChange={(e) => setCurrentMessage(e.target.value)}
        value={currentMessage}
        className=" shadow px-4 py-2  rounded bg-gray-800 "
      />
      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({
              roomId: id,
              type: "chat",
              message: currentMessage,
            })
          );

          setCurrentMessage("");
        }}
        className="rounded-lg active:scale-95 bg-gray-700 px-4 py-2"
      >
        send
      </button>
    </div>
  );
};

export default ChatRoomClient;
