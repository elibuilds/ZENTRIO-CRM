import React, { useContext, useState } from 'react'
import './login_register.css'

import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";

import AuthContext from "../context/AuthProvider";

const Login_register = ({ onSuccess }) => {
  const { login, signup } = useContext(AuthContext);

  const [action, setAction] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (action === "Login") {
        // Backend logs in by username; using the name field for that.
        await login(name, password);
        onSuccess?.();
      } else {
        await signup(name, email, password);
        setAction("Login");
        setPassword("");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="inputs">
          <div className="input">
            <IoPersonSharp />
            <input
              type="text"
              placeholder={action === "Login" ? "Username" : "Name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {action === "Register" && (
            <div className="input">
              <MdEmail />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input">
            <RiLockPasswordFill className="icon" />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {action === "Register" ? <div></div> : (
          <div className="forgot-password"> Forgot password? <span>Click Here</span></div>
        )}

        <div className='submit-container'>
          <div
            className={action === "Login" ? "submit gray" : "submit"}
            onClick={() => setAction("Login")}
          >
            Login
          </div>
          <div
            className={action === "Register" ? "submit gray" : "submit"}
            onClick={() => setAction("Register")}
          >
            Register
          </div>
        </div>

        <button type="submit" className="submit-form-button" disabled={submitting}>
          {submitting ? "Please wait..." : action}
        </button>
      </form>
    </div>
  )
}

export default Login_register
