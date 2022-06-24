import React, { useRef, useState } from "react";
//import validateLoginInfo from "./validateLoginInfo";
//import Newuseform from "./NewuseForm";
import "../css/Login.css";
import { Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";

const ForgotPassword = ({ submitForm }) => {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isDisplayed, setIsDisplayed] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await auth.sendPasswordResetEmail(emailRef.current.value);
      setMessage("Reset password link has been sent to your email");
    } catch {
      setError("Failed to reset password");
    }

    setLoading(false);
  }

  return (
    <div className="form-content-right">
      <form onSubmit={handleSubmit} className="form" noValidate>
        <h1>Forgot Password</h1>
        {error && <Alert variant="success">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}
        <div className="form-inputs">
          <label className="form-label">Email </label>
          <input
            className="form-input"
            type="text"
            name="email"
            placeholder="Enter your email"
            //value={values.email}
            ref={emailRef}
            //onChange={handleChange}
          />
        </div>

        <button className="form-input-btn" type="submit">
          Reset Password
        </button>
        <span className="form-input-login">
          Don't have an account? Register today <Link to="/SignUp">here</Link>
        </span>
        <span className="form-input-login">
          Return to <Link to="/Login">log-in</Link>
        </span>
      </form>
    </div>
  );
};

export default ForgotPassword;
