import React, { useState } from "react";
import "../css/Login.css";
import Login from "./Login";

const LoginForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  function submitForm() {
    setIsSubmitted(true);
  }

  return (
    <>
      <div className="form-container">
        <div className="form-content-left">
          <img className="form-img" src="img/Capture.png" alt="spaceship" />
        </div>
        <Login submitForm={submitForm} />
      </div>
    </>
  );
};

export default LoginForm;
