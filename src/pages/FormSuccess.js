import React from 'react';
import "../css/Form.css";
import {Link} from "react-router-dom";

const FormSuccess = () => {
  return (
    <div className='form-content-right'>
      <h1 className='form-success'>We have received your request!</h1>
      <img className='form-img-2' src='img/Capture.png' alt='success-image' />
      <span className='form-return'>
           <Link to='/'>Return to HomePage</Link>
      </span>
    </div>
  );
};

export default FormSuccess;
