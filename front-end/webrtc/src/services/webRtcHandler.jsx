import Peer from "simple-peer";
import { createNewRoom, joinRoom, signalPeerData } from "./wss";

const defaultConstraints = {
  audio: true,
  video: true,
};

let localStream;
let peers = {};

// ================= LOCAL STREAM =================
export const getLocalPreviewAndInitRoomConnection = async (
  isRoomHost,
  identity,
  roomId = null,
  setShowOverlay,
) => {
  try {
    const stream =
      await navigator.mediaDevices.getUserMedia(defaultConstraints);

    console.log("✅ Local stream received");
    localStream = stream;

    showLocalVideoPreview(stream);
    setShowOverlay(false);

    if (isRoomHost) {
      createNewRoom(identity);
    } else {
      joinRoom(roomId, identity);
    }
  } catch (err) {
    console.error("❌ Error accessing media devices:", err);
    alert("Camera/Mic not available.");
    return;
  }
};

const showLocalVideoPreview = (stream) => {
  const video = document.getElementById("local_video");

  if (video) {
    video.srcObject = stream;
    video.muted = true;
  }
};

// ================= CONFIG =================
const getConfiguration = () => ({
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
});

// ================= PEER =================
export const prepareNewPeerConnection = (
  connectedUserSocketId,
  isInitiator,
) => {
  if (peers[connectedUserSocketId]) {
    return;
  }

  if (!localStream) {
    console.error("❌ local stream missing");
    return;
  }

  console.log("🧩 creating peer:", connectedUserSocketId, isInitiator);

  const peer = new Peer({
    initiator: isInitiator,
    trickle: true,
    config: getConfiguration(),
    stream: localStream,
  });

  peers[connectedUserSocketId] = peer;

  peer.on("signal", (data) => {
    console.log("📡 sending signal");
    signalPeerData({
      signal: data,
      connectedUserSocketId,
    });
  });

  peer.on("stream", (stream) => {
    console.log("🎥 remote stream received");
    addStream(stream, connectedUserSocketId);
  });

  peer.on("error", (err) => {
    console.error("❌ peer error:", err);
  });

  peer.on("close", () => {
    console.log("peer closed");
    delete peers[connectedUserSocketId];
  });
};

// ================= SIGNAL HANDLING =================
export const handleSignalingData = (data) => {
  const { connectedUserSocketId, signal } = data;

  console.log("📥 signal received from:", connectedUserSocketId);

  if (!peers[connectedUserSocketId]) {
    prepareNewPeerConnection(connectedUserSocketId, false);
  }

  peers[connectedUserSocketId].signal(signal);
};

// ================= REMOTE STREAM UI =================
const addStream = (stream, socketId) => {
  const container = document.getElementById("remote_video");

  if (!container) {
    console.error("❌ remote_video container not found");
    return;
  }

  let video = document.getElementById(socketId);

  if (!video) {
    video = document.createElement("video");
    video.id = socketId;
    video.autoplay = true;
    video.playsInline = true;
    video.classList.add("video_element");

    container.appendChild(video);
  }

  video.srcObject = stream;
  
  video.onloadedmetadata = () => {
    video.play().catch((e) => console.error("Video play error:", e));
  };
};

// ================= CLEANUP =================
export const closeAllConnections = () => {
  Object.entries(peers).forEach(([socketId, peer]) => {
    if (peer) peer.destroy();
    delete peers[socketId];
  });

  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    localStream = null;
  }
  
  const container = document.getElementById("remote_video");
  if (container) {
    container.innerHTML = "";
  }
};
