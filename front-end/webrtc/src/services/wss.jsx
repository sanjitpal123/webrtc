import { io } from "socket.io-client";
import { handleSignalingData, prepareNewPeerConnection } from "./webRtcHandler";

const SERVER = "https://webrtc-1-6jo2.onrender.com";

let socket = null;

// ================= CONNECT =================
export const connectWithSocketIoServer = () => {
  socket = io(SERVER, {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("✅ connected with socket io server");
    console.log("Socket ID:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ connection error:", err.message);
  });
};

// ================= ROOM =================
export const registerRoomId = (setRoomId) => {
  if (!socket) return;

  socket.off("room-id");

  socket.on("room-id", (data) => {
    const { roomId } = data;
    console.log("📌 Room ID:", roomId);
    setRoomId(roomId);
  });
};

export const participantsSocket = (setParticipants) => {
  if (!socket) return;

  socket.off("room-update");

  socket.on("room-update", (data) => {
    const { connectedUser } = data;
    console.log("👥 participants:", connectedUser);
    setParticipants(connectedUser);
  });
};

// ================= CREATE / JOIN =================
export const createNewRoom = (identity) => {
  if (!socket) {
    console.log("❌ socket not ready");
    return;
  }

  socket.emit("create-new-room", { identity });
};

export const joinRoom = (roomId, identity) => {
  if (!socket) {
    console.log("❌ socket not ready");
    return;
  }

  console.log("📤 joining room:", roomId);
  socket.emit("join-room", { identity, roomId });
};

// ================= PEER CONNECTION FLOW =================
export const connectionForPeer = () => {
  if (!socket) return;

  socket.off("existing-users");
  socket.off("new-user");
  socket.off("conn-signal");

  // new user gets existing users
  socket.on("existing-users", ({ existingUsers }) => {
    console.log("👥 existing users:", existingUsers);

    existingUsers.forEach((userSocketId) => {
      prepareNewPeerConnection(userSocketId, true);
    });
  });

  // existing users get notified of new user
  socket.on("new-user", ({ socketId }) => {
    console.log("👤 new user:", socketId);
    prepareNewPeerConnection(socketId, false);
  });


  // signaling
  socket.on("conn-signal", (data) => {
    handleSignalingData(data);
  });
};

// ================= SIGNAL =================
export const signalPeerData = (data) => {
  if (!socket) return;

  socket.emit("conn-signal", data);
};

// ================= EXPORT =================
export { socket };
