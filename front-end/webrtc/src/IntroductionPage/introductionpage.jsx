import { useContext, useEffect } from "react";
import { GlobalStore } from "../store/context";
import ConnectingButtons from "./ConnectingButtons";
import "./introduction.css";

function IntroductionPage() {
  const { setHostUser } = useContext(GlobalStore);
  
  useEffect(() => {
    setHostUser(false);
  }, [setHostUser]);

  return (
    <div className="introduction_page_container">
      <div className="animated-bg"></div>
      <div className="introduction_page_panel glass">
        <div className="introduction_content">
          <div className="logo_container">
            <div className="logo_icon">V</div>
            <h1 className="logo_text">V-Call</h1>
          </div>
          <p className="introduction_subtitle">
            Experience high-quality, secure video conferencing with anyone, anywhere.
          </p>
          <ConnectingButtons />
        </div>
      </div>
      <div className="introduction_footer">
        <p>&copy; 2024 V-Call. Premium WebRTC Video Service.</p>
      </div>
    </div>
  );
}

export default IntroductionPage;
