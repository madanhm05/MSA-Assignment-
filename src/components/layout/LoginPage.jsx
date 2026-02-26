import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "../../assets/css/login.css";
import msaLogo from "../../assets/img/logo.jpg";

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};
    setAuthError("");

    if (!username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (username !== "Admin" || password !== "admin") {
      setErrors({});
      setAuthError("Invalid username or password");
      return;
    }

    setErrors({});
    setAuthError("");
    onLoginSuccess();
  };

  return (
    <div className="login-page">
      <div className="login-box">
     
        <div className="login-left">
          <img src={msaLogo} alt="MSA Logo" className="msa-logo-full" />
        </div>

        <div className="login-right">
          {/* <h2 className="login-title">
            <span className="logo">MSA Login</span>
          </h2> */}

          <form className="login-form" onSubmit={handleSubmit}>
           
            <div className={`input-group ${errors.username ? "error" : ""}`}>
              <FaEnvelope className="icon" />
              <input
                type="text"
                placeholder={
                  errors.username ? errors.username : "Username"
                }
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors({ ...errors, username: "" });
                  setAuthError("");
                }}
              />
            </div>

          
            <div className={`input-group ${errors.password ? "error" : ""}`}>
              <FaLock className="icon" />
              <input
                type="password"
                placeholder={
                  errors.password ? errors.password : "Password"
                }
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                  setAuthError("");
                }}
              />
            </div>

           
            {authError && (
              <p className="error-text center">{authError}</p>
            )}

            <button type="submit" className="submit-btn">
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;