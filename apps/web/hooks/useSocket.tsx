import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

const useSocket = () => {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();
  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NjczNTMzMC0wYWY5LTRlMTEtYTE1OS0xNDc0NmU3MjM1NjQiLCJpYXQiOjE3NDc1OTMwMDR9.FFNOpgn2V7wB5zNo3atQheAKOXQV8RP_ahG95AAdHKY`
    );
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };

    return () => {
      ws.close();
    };
  }, []);

  return { loading, socket };
};

export default useSocket;
