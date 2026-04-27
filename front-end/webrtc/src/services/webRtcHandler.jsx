import Peer from "simple-peer";
import { createNewRoom, joinRoom, signalPeerData } from "./wss"; // make sure this exists

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
    console.log("🎥 Tracks:", stream.getTracks());

    localStream = stream;

    showLocalVideoPreview(stream);
    setShowOverlay(false);

    // ✅ ONLY continue if stream exists
    if (!localStream) {
      console.error("❌ localStream not set after getUserMedia");
      return;
    }

    if (isRoomHost) {
      createNewRoom(identity);
    } else {
      joinRoom(roomId, identity);
    }
  } catch (err) {
    console.error("❌ Error accessing media devices:", err);

    alert("Camera/Mic not available. Close other tabs or use another browser.");

    // ❗ VERY IMPORTANT: STOP FLOW
    return;
  }
};

const showLocalVideoPreview = (stream) => {
  const video = document.getElementById("local_video");
  if (video) {
    video.srcObject = stream;
    video.muted = true; // ✅ autoplay fix
  }
};

// ================= PEER CONNECTION =================
const getConfiguration = () => ({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

export const prepareNewPeerConnection = (
  connectedUserSocketId,
  isInitiator,
) => {
  console.log("🧩 Creating peer:", connectedUserSocketId, isInitiator);

  // ❗ HARD BLOCK (MAIN FIX)
  if (!localStream) {
    console.error("❌ BLOCKED: localStream not ready");
    return;
  }

  const peer = new Peer({
    initiator: isInitiator,
    config: getConfiguration(),
    stream: localStream,
  });

  peers[connectedUserSocketId] = peer;

  // 🔁 Send signaling data
  peer.on("signal", (data) => {
    signalPeerData({
      signal: data,
      connectedUserSocketId,
    });
  });

  // 🎥 Receive remote stream
  peer.on("stream", (stream) => {
    console.log("🎥 Remote stream received");
    addStream(stream, connectedUserSocketId);
  });

  peer.on("error", (err) => {
    console.error("❌ Peer error:", err);
  });
};

// ================= SIGNAL HANDLING =================
export const handleSignalingData = (data) => {
  const { connectedUserSocketId, signal } = data;

  console.log("📡 Signal received from:", connectedUserSocketId);

  // 🔥 create peer if not exists
  if (!peers[connectedUserSocketId]) {
    prepareNewPeerConnection(connectedUserSocketId, false);
  }

  // ❗ EXTRA SAFETY
  if (!peers[connectedUserSocketId]) {
    console.error("❌ Peer not available, skipping signal");
    return;
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
};
