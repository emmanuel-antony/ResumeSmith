import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import { validateEmail } from "../utils/helper.js";
import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";



const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
     if (!validateEmail(email)) {
          setError("Please enter a valid email address");
          return;
        }
    setError("");
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const {token} = response.data;
      if (token){
        localStorage.setItem("token", token);
        updateUser(response.data);
      }

    } catch (error) {
      
    }
  }
  return <div>Login</div>;
};

export default Login;
