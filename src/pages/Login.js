import React, { useRef, useState } from "react";
//import validateLoginInfo from "./validateLoginInfo";
//import Newuseform from "./NewuseForm";
import "../css/Login.css";
import { Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import Navbar from "../components/Navbar/index"





const Login = ({ submitForm }) => {
  /*const { handleChange, handleSubmit, values, errors } = Newuseform(
    submitForm,
    validateLoginInfo
  );*/
  const emailRef = useRef();
  const passwordRef = useRef();
  //const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [plog, setPlog] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      if(!checked){
        await auth.signInWithEmailAndPassword(
          emailRef.current.value,
          passwordRef.current.value
        );
        setLoggedIn(true);
        navigate("/welcome");
      }
      else{
        var result = await db.collection("product_manager").get();
        const managers = [];
        for (var snap of result.docs){
          var data = snap.data();
          managers.push({
          ...data
          })
        }
        for (var i = 0; i < managers.length; i++){
          if (managers[i].email==email&&managers[i].password==password){
            setPlog(true);  
            setLoggedIn(true);
            console.log(managers[i].type)
            if(managers[i].type==="manager"){
              navigate("/productmanager");
              
            }
            else{
              navigate("/salesmanager");
            }
            
          }
          else{
            setError("You are not a product manager");
          }
        }
        
      }
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  }

  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const Checkbox = ({ label, value, onChange }) => {
    return (
      <label>
        <input type="checkbox" checked={value} onChange={onChange} />
        {label}
      </label>
    );
  };

  return (
    <div className="form-content-right">
      <form onSubmit={handleSubmit} className="form" noValidate>
        <h1>Login</h1>
        {error && <Alert variant="success">{error}</Alert>}
        <div className="form-inputs">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="text"
            name="email"
            placeholder="Enter your email"

            value={email}
            ref={emailRef}
            onInput={e => setEmail(e.target.value)}
            //onChange={()=>handleemailChange(email)}
          />
        </div>
        <div className="form-inputs">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            ref={passwordRef}
            onInput={e => setPassword(e.target.value)}
          />
        </div>
        <Checkbox
        label="Login as manager"
        value={checked}
        onChange={handleChange}
      />
        <button className="form-input-btn" type="submit">
          Login
        </button>
        <span className="form-input-login">
          Don't have an account? Register today <Link to="/SignUp">here</Link>
        </span>
        <div className="form-input-login">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
