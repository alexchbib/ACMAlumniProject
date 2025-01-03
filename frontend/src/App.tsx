import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css"; 
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Navbar,Home,Features,FAQ } from "./components";


const Contact: React.FC = () => {
  return (
    <section id="contact" className="contact">
      <h2>Get in Touch</h2>
      <br></br>
      <br></br>
      <p>Contact us for more information.</p>
    </section>
  );
};

const Deals: React.FC = () => {
  return (
    <section className="deals">
      <h2>Explore Deals</h2>
      <p>Find amazing discounts and offers!</p>
    </section>
  );
};

const Login: React.FC = () => {
  return (
    <section className="login" >
     <div className="login-container">
      <h2>
      <span className="highlight2">Welcome</span> <span className="highlight">Back!</span>
      </h2>
      <form className="login-form">
        <label htmlFor="email">Email Address:</label>
        <input type="email" id="email" placeholder="Enter your email" required />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" placeholder="Enter your password" required />

        <button type="submit" className="login-button">Login</button>
        <a href="/reset-password" className="forgot-password">Forgot your password?</a>
      </form>
      <p>Or</p>
      <a href="/signup" className="create-account">Create Account</a>
    </div>
    </section>
  );
};

const ResetPassword: React.FC = () => {
  return (
    <section className="reset-password">
      <div className="reset-container">
        <h2>Reset your password</h2>
        <p>Enter the email address you registered with</p>
        <form className="reset-form">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            required
          />
          <button type="submit" className="reset-button">
            Send Password Reset Link
          </button>
        </form>
        <a href="/login" className="back-to-login">
          Back to Sign In
        </a>
      </div>
    </section>
  );
};
const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    navigate("/verifyacc");
  };

  return (
    <section className="signup">
      <div className="signup-container">
        <h2>
          <span className="highlight">Create</span> <span className="highlight2">Account</span>
        </h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="firstname">First name:</label>
          <input
            type="text"
            id="firstname"
            value={formData.firstname}
            onChange={handleChange}
            placeholder="Enter your first name"
            required
          />

          <label htmlFor="lastname">Last name:</label>
          <input
            type="text"
            id="lastname"
            value={formData.lastname}
            onChange={handleChange}
            placeholder="Enter your last name"
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />

          <button type="submit" className="verifyaccount">Sign Up</button>
        </form>
        <br></br>
        <p>
          Already have an account? <a href="/login" className="login-link">Login</a>
        </p>
        
      </div>
    </section>
  );
};


const VerifyAcc: React.FC = () => {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const navigate = useNavigate();

  const handleInputChange = (value: string, index: number) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/chooseusername");
  };

  return (
    <section className="verifyacc">
      <div className="verifyacc-container">
        <h2>Verify your account</h2>
        <p>Enter verification code received on email</p>
        <form className="reset-form" onSubmit={handleSubmit}>
          <label htmlFor="verification">Verification code</label>
          <div className="verification-code-container">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="verification-input"
                required
              />
            ))}
          </div>
          <button type="submit" className="usernamesignup">
            Next
          </button>
        </form>
        <br />
        <p>Already have an account?</p>
        <a href="/login" className="back-to-login">
          Back to Sign In
        </a>
      </div>
    </section>
  );
};


const ChooseUsernameSignUp: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    navigate("/login");
  };

  return (
    <section className="usersignup">
      <div className="usersignup-container">
        <h2>Choose Username</h2>
        <form className="reset-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Create username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter username"
            required
          />
          <button type="submit" className="signup-button">Create account</button>
        </form>
        <p>Already have an account? <a href="/login" className="back-to-login">Back to Sign In</a></p>
      </div>
    </section>
  );
};



const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <Home />
            <Features />
            <FAQ />
            <Contact />
          </>
        } />
        <Route path="/deals" element={<Deals />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verifyacc" element={<VerifyAcc />} />
        <Route path="/chooseusername" element={<ChooseUsernameSignUp />} />
        
      </Routes>
    </Router>
  );
};

export default App
