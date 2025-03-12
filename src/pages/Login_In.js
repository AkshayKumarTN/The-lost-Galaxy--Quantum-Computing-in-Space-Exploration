import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css"; // Import your CSS

const Login_In = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      document.documentElement.style.setProperty("--mousex-delta", x.toFixed(2));
      document.documentElement.style.setProperty("--mousey-delta", y.toFixed(2));
    };

    const handleScroll = () => {
      const scrollY = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll-delta", scrollY.toFixed(2));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    alert("Logged in successfully!");
  };

  return (
    <div style={{ padding: "10px 20px", background: "black", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <img
          src="/assets/images/The-Lost-Galaxy-Home-icon.png"
          alt="The Lost Galaxy"
          height="80"
        />
      </div>

      <div style={{ display: "flex", flexFlow: "column", padding: "20px", color: "#FFF", marginTop: "30px", alignItems: "center" }}>
      <div className="dynamic-transform-absolute" style={{ right: '0' }}>
          <img src="/assets/images/alien spaceships ufo with blue.png" alt="UFO" height="750" />
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "32px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            width: "384px",
            margin: "100px auto 100px 300px",// Adjusted margin to move box 
            zIndex: 1, // Ensure login box is above images
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "24px",
              color: "#374151",
            }}
          >
            Login
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "#374151" }}>Email</label>
              <input
                type="email"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "4px",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email Address"
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "#374151" }}>
                Password
              </label>
              <input
                type="password"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "4px",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
            </div>
            {error && (
              <p
                style={{
                  color: "#EF4444",
                  fontSize: "0.875rem",
                  marginBottom: "16px",
                }}
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#3B82F6",
                color: "white",
                padding: "8px",
                borderRadius: "4px",
                cursor: "pointer",
                ":hover": { backgroundColor: "#60a5fa" },
              }}
            >
              Login
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: "16px", fontSize: "0.875rem", color: "#374151", }}>
            Don't have an account?{" "}
            <Link
              to="/Sign_Up"
              style={{ color: "#3B82F6", textDecoration: "underline" }}
            >
              Sign Up
            </Link>
          </p>
        </div>

        <div className="dynamic-transform-absolute" style={{ right: '0' }}>
            <img src="/assets/images/home-cta-planet.png" alt="planet" height="200" />
          </div>

          <div className="dynamic-transform-absolute" style={{ left: '0' }}>
            <img src="/assets/images/home-cta-rocket.png" alt="rocket" width="288" />
          </div>
      </div>
    </div>
  );
};

export default Login_In;