import axios from "axios";
import { BACKEND_URL } from "../../config";
import ChatRoom from "../../../components/ChatRoom";
async function getRoomId(slug: string): Promise<number> {
  const response = await axios.get(`${BACKEND_URL}/room/${slug}`);

  return response.data.data.id as number;
}
const ChatRoomPage = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;
  const roomId = await getRoomId(slug);
  return <ChatRoom id={roomId} />;
};

export default ChatRoomPage;
