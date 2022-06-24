import React, { useState, useEffect } from "react";
import "../css/Login.css";
import ForgotPassword from "./ForgotPassword";
import ResetSuccess from "./ResetSuccess";

const ForgotPasswordForm = () => {
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
        <ForgotPassword submitForm={submitForm} />
      </div>
    </>
  );
};

export default ForgotPasswordForm;
