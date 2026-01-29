import { useRef } from "react";

function CameraCapture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  // Capture photo
  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    // Convert image to blob
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "photo.jpg");

      // Send image to backend
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      alert(data.message);
    }, "image/jpeg");
  };

  return (
    <div>
      <h2>Live Camera</h2>

      <video ref={videoRef} autoPlay width="300" />
      <br />

      <button onClick={startCamera}>Start Camera</button>
      <button onClick={capturePhoto}>Capture Photo</button>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default CameraCapture;
