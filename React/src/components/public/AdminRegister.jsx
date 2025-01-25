import React, {useState} from "react";
import '../css/AdminRegister.css'
import { Link, useNavigate } from "react-router-dom";

const AdminRegister = () => {
    const [adminName, setAdminName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [adminConfirmPassword, setAdminConfirmPassword] = useState("");
    const [PasswordVisible,setPasswordVisible]=useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState('');
    const [errors, setErrors] = useState({});
    
    
    const navigate = useNavigate();

    const togglePasswordVisibility=(e)=>{
        setPasswordVisible(prevState=>!prevState);
    };

    const handleAddAdmin = async (event) => {
        event.preventDefault(event);

        let hasError = false;   
        
        const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailCheck.test(adminEmail)) {
            setEmailError("Please enter a valid email address");
            hasError = true;
        }else {
            setEmailError("");  // Clear email error if valid
        }

        // If email has an error, return early and stop further validation
        if (hasError) {
            return;
        }   

        if (adminPassword.length < 8 || adminPassword.length > 16) {
            setPasswordError("Password must be between 8 and 16 characters");
            hasError = true;
        } else if (adminConfirmPassword === "") {
            setPasswordError("Please confirm your password");
            hasError = true;
        } else if (adminPassword !== adminConfirmPassword) {
            setPasswordError("Passwords do not match");
            hasError = true;
        } else {
            setPasswordError('');  // Clear password error if valid
        }        


        if (hasError) {
            return; // Stop submission if there's an error
        }

    
        try {
            const response = await fetch('http://localhost:5003/api/authadmin/adminRegister', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    adminName,
                    adminEmail,
                    adminPassword,
                }),
            });            
    
            const data = await response.json();
  
            if (response.ok) {
                // console.log('Admin Signup successful:', data);
                navigate('/adminLogin'); // Redirect to login page
            } else {
                console.error('Admin Signup failed:', data.error);
                setErrors({ general: data.error });  // Show a general error message to users
            }
        } catch (err) {
            console.error('Error:', err);
            setErrors({ general: 'Error during sign up' });
        }
    };


    return(
        <section className="Admin-Register-WebBody">
        <div className="adminProfile">

            <h2> Admin Signup</h2>

            <form className="admin_form" onSubmit={handleAddAdmin}>
                <label htmlFor="userName">Username:</label>
                <input 
                    type="text" 
                    id="userName" 
                    name="admin_name" 
                    placeholder="user name"
                    onChange={(e) => setAdminName(e.target.value)} 
                    required
                />
                <br/>

                <label htmlFor="a_email">Email:</label>
                <input 
                    type="email" 
                    id="a_email" 
                    name="admin_email" 
                    placeholder= "email@gmail.com"
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                />
                {emailError && <p className="error-message">{emailError}</p>}
                <br/>

                <label htmlFor="a_password">Password:</label>
                <input 
                type={PasswordVisible?"text":"password"} 
                    id="a_password" 
                    name="admin_password" 
                    placeholder="********"
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                />
                <br/>

                <label htmlFor="a_confirm_password">Confirm Password:</label>
                <input 
                    type={PasswordVisible?"text":"password"}  
                    id="a_confirm_password" 
                    name="admin_confirm_password" 
                    placeholder="********"
                    onChange={(e) => setAdminConfirmPassword(e.target.value)}
                    required
                />
                {passwordError && <p className="error-message">{passwordError}</p>}
                <br/>

                <input 
                    type="checkbox" 
                        id="admin_showPass" 
                        name="show_pass" 
                        onClick={togglePasswordVisibility}
                />
                <label htmlFor="admin_showPass" style={{ fontSize: '14px' }}>Show Password</label><br/>

                {errors.general && <span className="error-message-register">{errors.general}</span>}<br></br>

                <button id="admin_profile_button">Signup</button>    

                <p id="ask">
                    Already have an account? <Link to="/adminLogin" id="link">Login</Link>
                </p>  
            </form> 
        </div>   
    </section>
    );

}

export default AdminRegister;