import axios from "axios";
import { BACKEND_URL } from "../app/config";
import ChatRoomClient from "./ChatRoomClient";

async function getChats(roomId: number) {
  const response = await axios.get(`${BACKEND_URL}/chat/${roomId}`);
  return response.data.data;
}
const ChatRoom = async ({ id }: { id: number }) => {
  const messages = await getChats(id);
  return <ChatRoomClient id={id} messages={messages} />;
};

export default ChatRoom;
