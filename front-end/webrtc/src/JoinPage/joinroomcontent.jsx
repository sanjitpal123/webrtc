import { useContext, useEffect, useState } from "react";
import JoinRoomInputs from "./joinroominputs";
import ErrorMessage from "./ErrorMessage";
import JoinRoomButtons from "./joinroombutton";
import { getRoomExists } from "../services/ExistingRoom";
import { useNavigate } from "react-router-dom";
import { GlobalStore } from "../store/context";

function JoinRoomContent(props) {
  const { HostUser } = props;
  const { setIdentity, Identity, setRoomId, roomId } = useContext(GlobalStore);
  const navigator = useNavigate();
  const [roomIdValue, setRoomIdValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    console.log("name value", nameValue);
  }, [nameValue]);
  async function handleJoinRoom() {
    setIdentity(nameValue);

    if (HostUser) {
      createRoom();
    } else {
      await joinRoom();
    }
  }
  const joinRoom = async () => {
    const reponseMessage = await getRoomExists(roomId);

    const { roomExists, full } = reponseMessage;
    if (roomExists) {
      if (full) {
        setErrorMessage("room is full. please try again later");
      } else {
        // join a room
        navigator("/room");
      }
    } else {
      setErrorMessage("Meeting not found , check your meeting id ");
    }
  };
  const createRoom = () => {
    navigator("/room");
  };

  return (
    <>
      <JoinRoomInputs
        roomIdValue={roomId}
        setRoomIdValue={setRoomIdValue}
        nameValue={nameValue}
        setNameValue={setNameValue}
        isRoomHost={HostUser}
      />
      <ErrorMessage errorMessage={errorMessage} />
      <JoinRoomButtons handleJoinRoom={handleJoinRoom} isRoomHost={HostUser} />
    </>
  );
}
export default JoinRoomContent;
