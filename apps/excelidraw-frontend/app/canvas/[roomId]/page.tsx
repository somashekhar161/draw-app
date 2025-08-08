import RoomCanvas from "@/components/RoomCanvas";

const Page = async ({ params }: { params: { roomId: string } }) => {
  const { roomId } = await params;

  return <RoomCanvas roomId={roomId} />;
};

export default Page;
