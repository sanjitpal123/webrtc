function VideoSectionPage() {
  return (
    <main className="video_grid_container">
      {/* Local Video */}
      <div className="video_wrapper active">
        <video
          id="local_video"
          autoPlay
          muted
          playsInline
          className="video_element"
        />

        <div className="user_label">You (Host)</div>
      </div>

      {/* Remote Video */}
      <div className="video_wrapper" id="remote_video"></div>
    </main>
  );
}
export default VideoSectionPage;
