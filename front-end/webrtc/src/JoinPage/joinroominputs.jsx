import { useContext, useState } from "react";
import Onlywithaudiocheckbox from "./OnlyWithAudioCheckBox";
import { GlobalStore } from "../store/context";

const Input = ({ placeholder, value, changeHandler }) => {
  return (
    <>
      <input
        value={value}
        onChange={changeHandler}
        className="join_room_input"
        placeholder={placeholder}
      />
    </>
  );
};

function JoinRoomInputs(props) {
  const { roomIdValue, setRoomIdValue, nameValue, setNameValue, isRoomHost } =
    props;
  const { setRoomId, roomId, ConnectOnlyWithAudio, setConnectOnlyWithAudio } =
    useContext(GlobalStore);

  const handleRoomIdValueChange = (event) => {
    setRoomId(event.target.value);
  };

  const handleNameValueChange = (event) => {
    setNameValue(event.target.value);
  };

  return (
    <div className="join_room_inputs_container">
      {!isRoomHost && (
        <Input
          placeholder="Enter Meeting Id"
          value={roomId}
          changeHandler={handleRoomIdValueChange}
        />
      )}

      <Input
        placeholder="Enter your name"
        value={nameValue}
        changeHandler={handleNameValueChange}
      />
      <Onlywithaudiocheckbox
        ConnectOnlyWithAudio={ConnectOnlyWithAudio}
        setConnectOnlyWithAudio={setConnectOnlyWithAudio}
      />
    </div>
  );
}

export default JoinRoomInputs;
