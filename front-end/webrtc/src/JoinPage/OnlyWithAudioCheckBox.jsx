import "./joinroom.css";

function Onlywithaudiocheckbox({
  ConnectOnlyWithAudio,
  setConnectOnlyWithAudio,
}) {
  const handleConnectionTypeChange = () => {
    setConnectOnlyWithAudio((prev) => !prev);
  };

  return (
    <div 
      className={`checkbox_container ${ConnectOnlyWithAudio ? "checkbox_container_selected" : ""}`} 
      onClick={handleConnectionTypeChange}
    >
      <div className="checkbox_connection">
        <div className="checkbox_connection_img"></div>
      </div>
      <p className="checkbox_container_paragraph">Connect with audio only</p>
    </div>
  );
}

export default Onlywithaudiocheckbox;
