import React from "react";
import validate from "./validateInfo";
import useForm from "./useForm";
import "../css/Form.css"
import { Link } from "react-router-dom";

const FormSignup = ({ submitForm }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(
    submitForm,
    validate
  );

  return (
    <div className="form-content-right">
      <form onSubmit={handleSubmit} className="form" noValidate>
        <div className="form-inputs">
          <label className="form-label">First Name</label>
          <input
            className="form-input"
            type="text"
            name="firstname"
            placeholder="Enter your First Name"
            value={values.firstname}
            onChange={handleChange}
          />
          {errors.firstname && <p>{errors.firstname}</p>}
        </div>
        <div className="form-inputs">
          <label className="form-label">Last Name</label>
          <input
            className="form-input"
            type="text"
            name="lastname"
            placeholder="Enter your Last Name"
            value={values.lastname}
            onChange={handleChange}
          />
          {errors.lastname && <p>{errors.lastname}</p>}
        </div>
        <div className="form-inputs">
          <label className="form-label">Username</label>
          <input
            className="form-input"
            type="text"
            name="username"
            placeholder="Enter your username"
            value={values.username}
            onChange={handleChange}
          />
          {errors.username && <p>{errors.username}</p>}
        </div>
        <div className="form-inputs">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div className="form-inputs">
          <label className="form-label">Phone Number</label>
          <input
            className="form-input"
            type="tel"
            name="number"
            placeholder="Enter your Phone Number"
            value={values.number}
            onChange={handleChange}
          />
          {errors.number && <p>{errors.number}</p>}
        </div>
        <div className="form-inputs">
          <label className="form-label">Address</label>
          <input
            className="form-input"
            type="text"
            name="address"
            placeholder="Enter your Address"
            value={values.address}
            onChange={handleChange}
          />
          {errors.address && <p>{errors.address}</p>}
        </div>
        <div className="form-inputs">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <button className="form-input-btn" type="submit">
          Sign up
        </button>
        <span className="form-input-login">
          Already have an account? Login <Link to="/Login">here</Link>
        </span>
      </form>
    </div>
  );
};

export default FormSignup;
