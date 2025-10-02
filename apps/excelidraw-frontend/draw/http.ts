import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export async function getExistingShape(roomId: string) {
  const res = await axios.get(`${HTTP_BACKEND}/chat/${roomId}`);
  const messages = res.data.data;
  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData;
  });
  return shapes;
}
