import React from "react";

const ConnectionButton = ({
  createRoomButton = false,
  buttonText,
  onClickHandle,
}) => {
  const buttonClass = createRoomButton
    ? "btn-primary"
    : "btn-secondary";

  return (
    <button className={`connection_button ${buttonClass}`} onClick={onClickHandle}>
      <span className="btn_content">{buttonText}</span>
      <span className="btn_bloom"></span>
    </button>
  );
};

export default ConnectionButton;
