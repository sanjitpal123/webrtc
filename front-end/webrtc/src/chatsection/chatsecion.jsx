import React, { useState } from "react";
import { FiSend, FiX } from "react-icons/fi";

const ChatSection = ({ close }) => {
  const [message, setMessage] = useState("");

  const dummyMessages = [
    { id: 1, user: "Alex Rivers", text: "Hey everyone! How's the connection?", time: "10:01 AM", self: false },
    { id: 2, user: "You", text: "Working perfectly for me. The video quality is great.", time: "10:02 AM", self: true },
    { id: 3, user: "Sarah Chen", text: "Same here. Ready to start the demo?", time: "10:05 AM", self: false },
  ];

  return (
    <div className="chat_section_container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sidebar_header" style={{
        padding: '24px',
        borderBottom: '1px solid var(--border-bright)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>Chat</h3>
        <button onClick={close} className="toolbar_button" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>
          <FiX />
        </button>
      </div>

      <div className="messages_container" style={{ 
        flex: 1, 
        padding: '24px', 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {dummyMessages.map((msg) => (
          <div key={msg.id} style={{
            alignSelf: msg.self ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.self ? 'flex-end' : 'flex-start'
          }}>
            {!msg.self && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', marginLeft: '4px' }}>
                {msg.user}
              </span>
            )}
            <div className="glass" style={{
              padding: '12px 16px',
              borderRadius: msg.self ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
              background: msg.self ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: 'white',
              fontSize: '0.95rem',
              lineHeight: '1.4',
              boxShadow: msg.self ? '0 4px 15px var(--primary-glow)' : 'none',
              border: msg.self ? 'none' : '1px solid var(--border-bright)'
            }}>
              {msg.text}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              {msg.time}
            </span>
          </div>
        ))}
      </div>

      <div className="chat_input_container" style={{ padding: '24px', borderTop: '1px solid var(--border-bright)' }}>
        <div style={{ position: 'relative', display: 'flex', gap: '12px' }}>
          <input
            type="text"
            className="join_room_input"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ paddingRight: '50px' }}
          />
          <button 
            className="toolbar_button active" 
            style={{ 
              position: 'absolute', 
              right: '6px', 
              top: '6px', 
              width: '42px', 
              height: '42px',
              borderRadius: '12px'
            }}
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
