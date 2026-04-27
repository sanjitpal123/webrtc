import ConnectionButton from "./ConnectionButton";
import { useNavigate } from "react-router-dom";

const ConnectingButtons = () => {
  let navigate = useNavigate();

  const pushToJoinRoomPage = () => {
    navigate("/join-room");
  };

  const pushToJoinRoomPageAsHost = () => {
    navigate("/join-room?host=true");
  };

  return (
    <div className="connecting_buttons_container">
      <ConnectionButton
        buttonText="join a meeting"
        onClickHandle={pushToJoinRoomPage}
      />
      <ConnectionButton
        createRoomButton
        buttonText="host a meeting"
        onClickHandle={pushToJoinRoomPageAsHost}
      />
    </div>
  );
};

export default ConnectingButtons;
