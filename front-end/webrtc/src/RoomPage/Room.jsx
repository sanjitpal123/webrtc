import React, { useContext, useEffect, useState } from "react";
import {
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiPhoneMissed,
  FiMonitor,
  FiMoreVertical,
  FiMessageSquare,
  FiUsers,
} from "react-icons/fi";
import "./Room.css";
import VideoSectionPage from "../videosecton/videosection";
import { GlobalStore } from "../store/context";

import ChatSection from "../chatsection/chatsecion";
import ParticipatnsPage from "../participatns/participants";
import { getLocalPreviewAndInitRoomConnection } from "../services/webRtcHandler";
import Overlay from "./Overlay";
import {
  connectionForPeer,
  connectWithSocketIoServer,
  participantsSocket,
  registerRoomId,
  socket,
} from "../services/wss";

function RoomPage() {
  const [micOn, setMicOn] = useState(true);
  const {
    roomId,
    HostUser,
    setRoomId,
    Identity,
    showOverLay,
    setShowOverlay,
    setParticipants,
    participants,
  } = useContext(GlobalStore);
  const [videoOn, setVideoOn] = useState(true);

  // Sidebar states
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const toggleChat = () => {
    setShowChat(!showChat);
    if (!showChat) setShowParticipants(false);
  };

  const toggleParticipants = () => {
    setShowParticipants(!showParticipants);
    if (!showParticipants) setShowChat(false);
  };

  useEffect(() => {
    getLocalPreviewAndInitRoomConnection(
      HostUser,
      Identity,
      roomId,
      setShowOverlay,
    );
    connectWithSocketIoServer();
    connectionForPeer();
  }, []);
  useEffect(() => {
    registerRoomId(setRoomId);
    participantsSocket(setParticipants);
  }, [socket]);
  return (
    <div className="room_container">
      <div className="animated-bg"></div>

      <header className="room_header">
        <div
          className="logo_container"
          style={{ flexDirection: "row", gap: "12px", marginBottom: 0 }}
        >
          <div
            className="logo_icon"
            style={{
              width: "40px",
              height: "40px",
              fontSize: "20px",
              borderRadius: "12px",
            }}
          >
            V
          </div>
          <h2 className="logo_text" style={{ fontSize: "24px" }}>
            V-Call
          </h2>
        </div>

        <div className="room_id_badge">
          <span
            style={{
              fontSize: "0.8rem",
              opacity: 0.6,
              color: "var(--text-muted)",
            }}
          >
            MEETING ID
          </span>
          <span>{roomId}</span>
        </div>

        <div className="room_header_actions">
          <button
            className={`toolbar_button ${showParticipants ? "active" : ""}`}
            style={{ width: "44px", height: "44px" }}
            onClick={toggleParticipants}
            title="Participants"
          >
            <FiUsers />
          </button>
        </div>
      </header>

      <main className="room_main_content">
        <div className="video_section_wrapper">
          <VideoSectionPage />
        </div>

        {(showChat || showParticipants) && (
          <aside className="room_sidebar glass-heavy">
            {showChat && <ChatSection close={() => setShowChat(false)} />}
            {showParticipants && (
              <ParticipatnsPage close={() => setShowParticipants(false)} />
            )}
          </aside>
        )}
      </main>
      {showOverLay && <Overlay />}
      <footer className="room_toolbar">
        <button
          className={`toolbar_button ${!micOn ? "active" : ""}`}
          onClick={() => setMicOn(!micOn)}
          title={micOn ? "Mute Mic" : "Unmute Mic"}
        >
          {micOn ? <FiMic /> : <FiMicOff />}
        </button>

        <button
          className={`toolbar_button ${!videoOn ? "active" : ""}`}
          onClick={() => setVideoOn(!videoOn)}
          title={videoOn ? "Turn Off Video" : "Turn On Video"}
        >
          {videoOn ? <FiVideo /> : <FiVideoOff />}
        </button>

        <button className="toolbar_button" title="Share Screen">
          <FiMonitor />
        </button>

        <button
          className={`toolbar_button ${showChat ? "active" : ""}`}
          onClick={toggleChat}
          title="Chat"
        >
          <FiMessageSquare />
        </button>

        <button className="toolbar_button" title="More Options">
          <FiMoreVertical />
        </button>

        <button className="toolbar_button danger" title="End Call">
          <FiPhoneMissed />
        </button>
      </footer>
    </div>
  );
}

export default RoomPage;
