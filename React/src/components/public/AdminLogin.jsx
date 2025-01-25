import React, {useState} from "react";
import '../css/AdminLogin.css';
import { Link, useNavigate } from "react-router-dom";

const AdminLogin= () => {
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
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
        }

        // If email has an error, return early and stop further validation
        if (hasError) {
            return;
        }   

        if (!adminPassword) {
            setPasswordError("Password is required.");
            hasError = true;
        }     

        
        if (hasError) {
            return; // Stop submission if there's an error
        }

    
        try {
            const response = await fetch('http://localhost:5003/api/authadmin/adminLogin', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ adminEmail, adminPassword }),
            });
      
            const data = await response.json();
      
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/home');
            } else {
              console.error('Admin Login failed:', data.error);
              setErrors({ general: data.error });
            }
        } catch (err) {
            console.error('Error:', err);
            setErrors({ general: 'Something went wrong. Please try again.' });
        } 
    };


    return(
        <section className="Admin-Login-WebBody">
        <div className="adminProfile">

            <h2> Admin Login</h2>

            <form className="admin_form" onSubmit={handleAddAdmin}>
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

                <button id="admin_profile_button">Login</button>    

                 <p id="ask">
                    Already have an account? <Link to="/adminRegister" id="link">Signup</Link>
                </p>  

            </form> 
        </div>   
    </section>
    );

}

export default AdminLogin;