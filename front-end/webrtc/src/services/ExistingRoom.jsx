import axios from "axios";
const serverApi = "https://webrtc-1-6jo2.onrender.com/api";

export const getRoomExists = async (roomId) => {
  const response = await axios.get(`${serverApi}/room-exists/${roomId}`);
  return response.data;
};
