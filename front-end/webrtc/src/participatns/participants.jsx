import React, { useContext } from "react";
import {
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiX,
  FiShield,
} from "react-icons/fi";
import { GlobalStore } from "../store/context";

const ParticipatnsPage = ({ close }) => {
  const { participants } = useContext(GlobalStore);
  return (
    <div
      className="participants_section_container"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <div
        className="sidebar_header"
        style={{
          padding: "24px",
          borderBottom: "1px solid var(--border-bright)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1.2rem", color: "white" }}>
          Participants ({participants.length})
        </h3>
        <button
          onClick={close}
          className="toolbar_button"
          style={{ width: "32px", height: "32px", fontSize: "1rem" }}
        >
          <FiX />
        </button>
      </div>

      <div
        className="participants_list"
        style={{ flex: 1, padding: "16px", overflowY: "auto" }}
      >
        {participants.map((p) => (
          <div
            key={p.id}
            className="participant_item"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              borderRadius: "16px",
              marginBottom: "8px",
              transition: "var(--transition-fast)",
              cursor: "default",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.borderColor = "var(--border-bright)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <div
              className="avatar"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: p.isHost ? "var(--primary)" : "var(--bg-surface)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "1rem",
                fontWeight: "700",
                marginRight: "16px",
                boxShadow: p.isHost ? "0 0 15px var(--primary-glow)" : "none",
                border: "1px solid var(--border-bright)",
              }}
            >
              {p.identity.charAt(0)}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                  {p.name}
                </span>
                {p.isHost && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      background: "var(--primary-glow)",
                      color: "var(--primary-hover)",
                      padding: "2px 8px",
                      borderRadius: "100px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <FiShield size={10} /> HOST
                  </span>
                )}
              </div>
            </div>

            <div
              className="status_icons"
              style={{
                display: "flex",
                gap: "12px",
                color: "var(--text-muted)",
              }}
            >
              {p.mic ? (
                <FiMic size={18} />
              ) : (
                <FiMicOff size={18} style={{ color: "#ef4444" }} />
              )}
              {p.video ? (
                <FiVideo size={18} />
              ) : (
                <FiVideoOff size={18} style={{ color: "#ef4444" }} />
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        className="sidebar_footer"
        style={{ padding: "24px", borderTop: "1px solid var(--border-bright)" }}
      >
        <button
          className="btn-secondary"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            fontSize: "0.9rem",
          }}
        >
          Invite Link
        </button>
      </div>
    </div>
  );
};

export default ParticipatnsPage;
