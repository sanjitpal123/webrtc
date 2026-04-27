import { createContext, useEffect, useState } from "react";
export const GlobalStore = createContext();

function Context({ children }) {
  const [HostUser, setHostUser] = useState();
  const [ConnectOnlyWithAudio, setConnectOnlyWithAudio] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [Identity, setIdentity] = useState("");
  const [showOverLay, setShowOverlay] = useState(true);
  const [participants, setParticipants] = useState([]);
  useEffect(() => {
    console.log("hostuser", HostUser);
    console.log("connecting only", ConnectOnlyWithAudio);
    console.log("identity", Identity);
    console.log("roomId", roomId);
    console.log("particpants", participants);
  }, [HostUser, ConnectOnlyWithAudio, Identity, roomId, participants]);
  return (
    <GlobalStore.Provider
      value={{
        HostUser,
        setHostUser,
        ConnectOnlyWithAudio,
        setConnectOnlyWithAudio,
        roomId,

        setRoomId,
        Identity,
        setIdentity,
        showOverLay,
        setShowOverlay,
        setParticipants,
        participants,
      }}
    >
      {children}
    </GlobalStore.Provider>
  );
}

export default Context;
