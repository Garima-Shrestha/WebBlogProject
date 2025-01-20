import React, {useState} from "react";
import '../css/AddAdminProfile.css'

const AddAdminProfilePage = () => {
    const [adminName, setAdminName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [adminConfirmPassword, setAdminConfirmPassword] = useState("");
    const [PasswordVisible,setPasswordVisible]=useState(false);

    const togglePasswordVisibility=()=>{
        setPasswordVisible(prevState=>!prevState);
    };

    const handleAddAdmin = (event) => {
        event.preventDefault();
        
        if (!adminName || !adminEmail || !adminPassword || !adminConfirmPassword) {
            alert("Please fill in all required fields");
            return;
        }

        const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailCheck.test(adminEmail)) {
            alert("Please enter a valid email address");
            return;
        }

        if (adminPassword !== adminConfirmPassword) {
            alert("Passwords do not match");
            return;
        }

        alert("Admin profile has been created successfully!");
    };


    return(
        <section className="Add-Admin-WebBody">
        <div className="adminProfile">

            <h2>Create Admin Profile</h2>

            <form className="admin_form" onSubmit={handleAddAdmin}>
                <label htmlFor="userName">Username:</label>
                <input 
                    type="text" 
                    id="userName" 
                    name="admin_name" 
                    placeholder="user name"
                />
                <br/>

                <label htmlFor="a_email">Email:</label>
                <input 
                    type="email" 
                    id="a_email" 
                    name="admin_email" 
                    placeholder= "email@gmail.com"
                />
                <br/>

                <label htmlFor="a_password">Password:</label>
                <input 
                    type="password" 
                    id="a_password" 
                    name="admin_password" 
                    placeholder="********"/>
                <br/>

                <label htmlFor="a_confirm_password">Confirm Password:</label>
                <input 
                    type="password" 
                    id="a_confirm_password" 
                    name="admin_confirm_password" 
                    placeholder="********"/>
                <br/>

                <input 
                    type="checkbox" 
                        id="admin_showPass" 
                        name="show_pass" 
                        onClick={togglePasswordVisibility}
                />
                <label htmlFor="admin_showPass" style={{ fontSize: '14px' }}>Show Password</label><br/>

                <button id="admin_profile_button">Add User</button>      
            </form> 
        </div>   
    </section>
    );

}

export default AddAdminProfilePage;