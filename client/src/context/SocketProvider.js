import { useContext, useState } from "react";
import SocketContext from "./socket-context";

export const useSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
