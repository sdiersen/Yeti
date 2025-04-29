import { FC } from "react";
import { useNavigate } from "react-router-dom";

const Unknown: FC = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 style={{ fontSize: "3rem", color: "#333" }}>404</h1>
      <p style={{ fontSize: "1.5rem", color: "#666" }}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <button
        onClick={goBack}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "1rem",
          color: "#fff",
          backgroundColor: "#007bff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Go Back
      </button>
    </div>
  );
};

export default Unknown;
