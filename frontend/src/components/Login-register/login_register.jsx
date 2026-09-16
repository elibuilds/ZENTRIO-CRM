import { useState } from 'react'
import './login_register.css'

const Login_register = ({ onSuccess }) => {

const [action,setAction] = useState("Login");

  return ( 
    <div className='container'>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        {action==="Login"? <div></div>: <div className="input">
          <span aria-hidden="true">◉</span>
          <input type="text" placeholder="Name" />
        </div>}

        <div className="input">
          <span aria-hidden="true">@</span>
          <input type="email" placeholder= "Email" />
        </div>

        <div className="input">
          <span className="icon" aria-hidden="true">•</span>
          <input type="password" placeholder= "Enter your password" />
        </div>
      </div> 

      {action==="Register"?<div></div>: <div className="forgot-password"> Forgot password? <span>Click Here</span></div>}

      <div className='submit-container'>
       <div className={action==="Login"?"submit gray":"submit"} onClick={() => { setAction("Login"); onSuccess?.() }}>Login</div>
       <div className={action==="Register"?"submit gray":"submit"} onClick={()=>{setAction("Register")}}>Register</div>
      </div>
    </div>
  )
}

export default Login_register
