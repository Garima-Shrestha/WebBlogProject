import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../css/Register.css'

import logo from '../../images/quiz.jpg'

import svg1 from '../../svg/authentication_svg1.svg'
import svg2 from '../../svg/authentication_svg2.svg'
import svg3 from '../../svg/authentication_svg3.svg'
import svg4 from '../../svg/authentication_svg4.svg'
import svg5 from '../../svg/authentication_svg5.svg'

import innovate from '../../svg/innovate.svg'
import inspire from '../../svg/inspire.svg'
import inform from '../../svg/inform.svg'

const RegisterPage=() =>{
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordConfirmation, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState('');
    const [errors, setErrors] = useState({});
    


    const navigate = useNavigate();

    const togglePasswordVisibility=()=>{
        setPasswordVisible(prevState=>!prevState);
    };

    const handlesignup=async (event)=>{
        
            event.preventDefault();
        
            let hasError = false;           //No error have been detected initially
        
            // Email validation
            const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailCheck.test(email)) {                                      //It checks whether the string email matches the pattern defined by the emailCheck.
                setEmailError("Please enter a valid email address");
                hasError = true;
            } else {
                setEmailError("");  // Clear email error if valid
            }

            // If email has an error, return early and stop further validation
            if (hasError) {
                return;
            }   
        
            // Password validation
            if (password.length < 8 || password.length > 16) {
                setPasswordError("Password must be between 8 and 16 characters");
                hasError = true;
            } else if (password !== passwordConfirmation) {
                setPasswordError("Passwords do not match");
                hasError = true;
            } else {
                setPasswordError('');  // Clear password error if valid
            }

            if (hasError) {
                return; // Stop submission if there's an error
            }
        
        
    
        // Prepare the user data to send
        const userData = {
            userName,
            email,
            password,
            passwordConfirmation,
        };
    
        try {
            const response = await fetch('http://localhost:5003/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
    
            const data = await response.json();
  
            if (response.ok) {
                console.log('Signup successful:', data);
                navigate('/login'); // Redirect to login page
            } else {
                console.error('Signup failed:', data.error);
                setErrors({ general: data.error });  // Show a general error message to users
            }
        } catch (err) {
            console.error('Error:', err);
            setErrors({ general: 'Error during sign up' });
        }
    }
    return (
        <section className="register-page-container">

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
        


            <section className="signUpBody">
                <form className="Form" onSubmit={handlesignup}>
                    <div>
                        <img src={logo} alt="logo" title="Welcome to our Blog" id="logo" loading="lazy" />
                    </div>
                    <h2>Sign Up</h2>

                    <div id="details">
                        <label htmlFor="reg_userName">User Name:</label>
                        <input 
                            type="text" 
                            id="reg_userName" 
                            name="admin_userName" 
                            placeholder="user name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}    //this line update the userName state to the value the user types in the input field.
                            required
                        />
                        <br/>

                        <label htmlFor="reg_email">E-mail:</label>
                        <input 
                            type="email" 
                            id="reg_email" 
                            name="admin_email" 
                            placeholder="email@gmail.com"   
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {emailError && <p className="error-message">{emailError}</p>}
                        <br/>

                        <label htmlFor="register_password">Password:</label>
                        <input 
                            type={passwordVisible?"text":"password"} 
                            id="register_password" 
                            name="admin_password" 
                            minLength={8} 
                            maxLength={16} 
                            placeholder="********"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <br/>

                        <label htmlFor="reg_cPassword">Confirm Password:</label>
                        <input 
                            type={passwordVisible?"text":"password"} 
                            id="reg_cPassword" 
                            name="passwordConfirmation"
                            placeholder="********"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {passwordError && <p className="error-message">{passwordError}</p>}
                        <br/>

                        <input 
                            type="checkbox" 
                            id="reg_showPass" 
                            name="show_pass" 
                            onClick={togglePasswordVisibility}
                        />
                        <label htmlFor="showPass" style={{ fontSize: '14px' }}>Show Password</label><br/>

                        {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}


                        <button type="submit" id="signUp_Button">Sign Up</button>            

                        <p id="ask">
                            Already have an account? <Link to="/login" id="link">Login</Link>
                        </p>
                    </div>
                </form>
            </section>
        </section>
    );
}

export default RegisterPage;