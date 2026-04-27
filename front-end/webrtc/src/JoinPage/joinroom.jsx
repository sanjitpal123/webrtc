import { useLocation } from "react-router-dom";
import "./joinroom.css";
import { useContext, useEffect } from "react";
import { GlobalStore } from "../store/context";
import JoinRoomTitle from "./joinroomtitle";
import JoinRoomContent from "./joinroomcontent";
import JoinRoomButtons from "./joinroombutton";

function JoinRoom() {
  const { setHostUser, HostUser } = useContext(GlobalStore);
  const search = useLocation().search;

  useEffect(() => {
    const isRoomHost = new URLSearchParams(search).get("host");
    setHostUser(isRoomHost === "true");
  }, [search, setHostUser]);

  return (
    <div className="join_room_page_container">
      <div className="animated-bg"></div>
      <div className="join_room_page_panel glass">
        <JoinRoomTitle isRoomHost={HostUser} />
        <JoinRoomContent HostUser={HostUser} />
      </div>
    </div>
  );
}

export default JoinRoom;
