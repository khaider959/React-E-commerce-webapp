import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

const useForm = (callback, validate) => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    number: null,
    firstname: "",
    lastname: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const register = () => {
    auth
      .createUserWithEmailAndPassword(values.email, values.password)
      .then((credentials) => {
        db.collection("users")
          .doc(credentials.user.uid)
          .set({
            name: values.firstname,
            surname: values.lastname,
            delivery_address: values.address,
            email: values.email,
            password: values.password,
            basket: [],
            wishlist: [],
            ordered_items: [],
            CCV: ""
          })
          .then(() => {
            setSuccessMsg(
              "Signup Successfull. You will now automatically get redirected to Login"
            );
            setValues({
              address: "",
              username: "",
              email: "",
              firstname: "",
              lastname: "",
              password: "",
              number: null,
            });
            setErrors("");
            setTimeout(() => {
              setSuccessMsg("");
              navigate("/login");
            }, 3000);
          })
          .catch((error) => setErrors(error.message));
      })
      .catch((error) => {
        setErrors(error.message);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors(validate(values));
    register();
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
    }
  }, [errors]);

  return { handleChange, handleSubmit, values, errors };
};

export default useForm;
