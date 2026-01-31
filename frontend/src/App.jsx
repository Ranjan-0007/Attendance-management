import { useEffect, useState } from "react";
import CameraCapture from "./components/CameraCapture";

function App() {
  const [backendStatus, setBackendStatus] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/test")
      .then((response) => response.json())
      .then((data) => setBackendStatus(data.status))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Face Recognition Attendance System</h1>
      <p><strong>Backend Status:</strong></p>
      <p>{backendStatus}</p>
      <CameraCapture />
    </div>
  );
}

export default App;
