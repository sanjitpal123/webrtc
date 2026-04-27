import { useNavigate } from "react-router-dom";

const Button = ({ buttonText, cancelButton = false, onClickHandler }) => {
  const buttonClass = cancelButton ? "btn-secondary" : "btn-primary";

  return (
    <button
      className={`connection_button ${buttonClass}`}
      onClick={onClickHandler}
    >
      <span className="btn_content">{buttonText}</span>
      <span className="btn_bloom"></span>
    </button>
  );
};

const JoinRoomButtons = ({ handleJoinRoom, isRoomHost }) => {
  const Navigator = useNavigate();
  const successButtonText = isRoomHost ? "Host Meeting" : "Join Meeting";

  const pushToIntroductionPage = () => {
    Navigator("/");
  };

  return (
    <div className="join_room_buttons_container">
      <Button buttonText={successButtonText} onClickHandler={handleJoinRoom} />
      <Button
        buttonText="Cancel"
        cancelButton
        onClickHandler={pushToIntroductionPage}
      />
    </div>
  );
};

export default JoinRoomButtons;
