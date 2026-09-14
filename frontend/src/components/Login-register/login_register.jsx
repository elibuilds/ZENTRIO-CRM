import { useState } from 'react'
import './login_register.css'

import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";

const Login_register = ({ onSuccess }) => {
  const [action, setAction] = useState("Register");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const endpoint = action === "Register" ? "/auth/signup" : "/auth/login";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Request failed.");
      return;
    }

    if (action === "Register") {
      setAction("Login");
      setMessage(data.msg || "Registration successful. Please log in.");
      return;
    }

    onSuccess?.();
  }

  function handleActionClick(nextAction, event) {
    if (action !== nextAction) {
      event.preventDefault();
      setAction(nextAction);
    }
  }

  return (
    <form className='container' onSubmit={handleSubmit}>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        <div className="input">
          <IoPersonSharp />
          <input name="username" value={formData.username} onChange={handleChange} type="text" placeholder="Username" required />
        </div>

        {action === "Register" && <div className="input">
          <MdEmail />
          <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email" required />
        </div>}

        <div className="input">
          <RiLockPasswordFill className="icon" />
          <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Password" required />
        </div>
      </div>

      {message && <div className="forgot-password">{message}</div>}

      <div className='submit-container'>
        <button type="submit" className={`submit ${action === "Login" ? "inactive" : ""}`} onClick={(event) => handleActionClick("Login", event)}>Login</button>
        <button type="submit" className={`submit ${action === "Register" ? "inactive" : ""}`} onClick={(event) => handleActionClick("Register", event)}>Register</button>
      </div>
    </form>
  )
}

export default Login_register