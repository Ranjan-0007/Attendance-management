import { useRef, useState } from "react";

function CameraCapture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState("");

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 300);
    } catch (err) {
      console.error(err);
      alert("Camera not available or permission blocked");
    }
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    setImage(canvas.toDataURL("image/jpeg"));
  };

  const send = async () => {
  if (!image) {
    alert("Please capture image first");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail);
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Server not reachable");
  }
};


  return (
    <div style={{ textAlign: "center" }}>
      <h2>Face Recognition Attendance</h2>

      <button onClick={startCamera}>Allow Camera</button>
      <br /><br />

      <video ref={videoRef} autoPlay playsInline width="400" />
      <br /><br />

      <button onClick={capture}>Capture</button>
      <br /><br />

      {image && (
        <>
          <img src={image} width="200" />
          <br /><br />
          <button onClick={send}>Send to Backend</button>
        </>
      )}

      <p>{msg}</p>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default CameraCapture;
