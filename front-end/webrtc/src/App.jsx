import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MyContext } from "../store";
import RoomPage from "./RoomPage/Room";
import IntroductionPage from "./IntroductionPage/introductionpage";
import JoinRoom from "./JoinPage/joinroom";
import Context from "./store/context";
import { useEffect } from "react";
import { connectWithSocketIoServer } from "./services/wss";

function App() {
  useEffect(() => {
    connectWithSocketIoServer();
  }, []);
  return (
    <Context>
      <Router>
        <Routes>
          <Route path="/join-room" element={<JoinRoom />} />
          <Route path="/room" element={<RoomPage />} />
          <Route path="/" element={<IntroductionPage />} />
        </Routes>
      </Router>
    </Context>
  );
}

export default App;
