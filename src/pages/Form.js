import React, { useState } from "react";
import "../css/Form.css";
import FormSignup from "./FormSignup";
import FormSuccess from "./FormSuccess";

const Form = () => {
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
        <FormSignup submitForm={submitForm} />
      </div>
    </>
  );
};

export default Form;
