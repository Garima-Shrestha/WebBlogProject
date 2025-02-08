import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../css/Login.css'

import logo from '../../images/quiz.jpg'

import svg1 from '../../svg/authentication_svg1.svg'
import svg2 from '../../svg/authentication_svg2.svg'
import svg3 from '../../svg/authentication_svg3.svg'
import svg4 from '../../svg/authentication_svg4.svg'
import svg5 from '../../svg/authentication_svg5.svg'

import innovate from '../../svg/innovate.svg'
import inspire from '../../svg/inspire.svg'
import inform from '../../svg/inform.svg'




const LoginPage = ({setToken}) => {
    const[login_email, setEmail] = useState("");
    const[login_password, setPassword] = useState("");
    const[PasswordVisible,setPasswordVisible]=useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const togglePasswordVisibility=()=>{
        setPasswordVisible(prevState=>!prevState);
    };

    const handlelogin = async (e) => {
        e.preventDefault();

        let hasError = false;   
        
        const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailCheck.test(login_email)) {
            setEmailError("Please enter a valid email address");
            hasError = true;
        }
        
        // If email has an error, return early and stop further validation
        if (hasError) {
          return;
      }   


      if (!login_password) {
        setPasswordError("Password is required.");
        hasError = true;
      }
      
      if (hasError) {
        return; // Stop submission if there's an error
      }



        // If no errors, proceed with the login (this can be an API call)
        try {
          const response = await fetch('http://localhost:5003/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email:login_email, password:login_password }),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            setToken(data.token);
            localStorage.setItem("token", data.token);  // stores the token in local storage
            localStorage.setItem('email', login_email); // Store email in localStorage

            localStorage.setItem("user", JSON.stringify({ isAuthenticated: true, role: data.user.role }));     // role: data.user.role => Storing user role received from backend
            navigate('/home');
          } else {
            console.error('Login failed:', data.error);
            setErrors({ general: data.error });
          }
        } catch (err) {
          console.error('Error:', err);
          setErrors({ general: 'Something went wrong. Please try again.' });
        } 
      };
    
    return(
        <section className="login-page-container">
        <div className="wave_top">
                <svg id="waveTop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#2E3B53" fillOpacity="1" d="M0,192L120,160C240,128,480,64,720,37.3C960,11,1200,21,1320,
                        26.7L1440,32L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z">
                    </path>
                </svg>
            </div>

            
            <div className="wave_bottom">
                <svg id="waveBottom"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#2E3B53" fillOpacity="1" d="M0,256L48,256C96,256,192,256,288,250.7C384,245,480,235,
                        576,245.3C672,256,768,288,864,293.3C960,299,1056,277,1152,240C1248,203,1344,149,1392,122.7L1440,
                        96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,
                        320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                    </path>
                </svg>

                <img src={svg1} alt="Decorative SVG 1" id="signupSVG1" loading="lazy" />
                <img src={svg2} alt="Decorative SVG 2" id="signupSVG2" loading="lazy" />
                <img src={svg3} alt="Decorative SVG 3" id="signupSVG3" loading="lazy" />
                <img src={svg4} alt="Decorative SVG 4" id="signupSVG4" loading="lazy" />
                <img src={svg5} alt="Decorative SVG 5" id="signupSVG5" loading="lazy" />
            </div>

            <div className="moto">
                <strong style={{ color: "#0C61A7", textShadow: "2px 2px 6px rgba(0, 0, 0, 0.12)" }}>Innovate</strong> <img src={innovate} id="innovate" loading="lazy" /><br/>
                <strong style={{color: "#28B6B4", textShadow: "2px 2px 6px rgba(0, 0, 0, 0.1)"}}>Inspire</strong> <img src={inspire} id="inspire" loading="lazy" /><br/>
                <strong style={{color: "#4A5D6B", textShadow: "2px 2px 6px rgba(0, 0, 0, 0.1)"}}>Inform</strong> <img src={inform} id="inform" loading="lazy" /><br/>
            </div>


            <section className="loginBody">
            <form className="form" onSubmit={handlelogin}>

                <div>
                    <img src={logo} alt="logo" title="Welcome to our Blog" id="logo" loading="lazy" />
                </div>

                <h2>Login</h2>
                <div className="log_details">
                    <label htmlFor="login_email" id="email_label">E-mail:</label>
                    <input 
                        type="email" 
                        id="login_email" 
                        name="user_email" 
                        placeholder="email@gmail.com" 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {emailError && <p className="error-message">{emailError}</p>}
                    <br/>

                    <label htmlFor="login_password" id="password_label">Password:</label>
                    <input 
                        type={PasswordVisible?'text': 'password'} 
                        id="login_password" 
                        name="user_password"
                        placeholder="********"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {passwordError && <p className="error-message">{passwordError}</p>}
                    <br/>


                    <input 
                        type="checkbox" 
                        id="log_show_pass" 
                        name="show_pass" 
                        onClick={togglePasswordVisibility}
                    />
                    <label htmlFor="log_show_pass" style={{ fontSize: '14px' }}>Show Password</label><br/>

                    <button type="submit" id="login_Button">Login</button> 
                    {errors.general && <span className="error-message-login">{errors.general}</span>}<br></br>
                    <p id="ask">
                        Don't have an account? ? <Link to="/register" id="link">Sign in</Link>
                    </p>
                </div>
            </form>
        </section>
    </section>

);
}

export default LoginPage;