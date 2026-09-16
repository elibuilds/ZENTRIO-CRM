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

const [action,setAction] = useState("Login");

  return (
    <form className='container' onSubmit={handleSubmit}>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        {action==="Login"? <div></div>: <div className="input">
          <IoPersonSharp />
          <input type="text" placeholder="Name" />
        </div>}

        {action === "Register" && <div className="input">
          <MdEmail />
          <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email" required />
        </div>}

        <div className="input">
          <RiLockPasswordFill className="icon" />
          <input type="password" placeholder= "Enter your password" />
        </div>
      </div>

      {action==="Register"?<div></div>: <div className="forgot-password"> Forgot password? <span>Click Here</span></div>}

      <div className='submit-container'>
       <div className={action==="Login"?"submit gray":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
       <div className={action==="Register"?"submit gray":"submit"} onClick={()=>{setAction("Register")}}>Register</div>
      </div>
    </form>
  )
}

export default Login_register