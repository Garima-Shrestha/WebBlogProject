import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import '../css/DeleteAccount.css';

const DeleteAccountPage = () => {

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    const handleDelete = async (e) => {
        e.preventDefault();

        //atleast one checkbox bhaye pani click hunu paryo
        const checkedReasons = document.querySelectorAll('input[name="reason"]:checked');
        if (checkedReasons.length === 0) {
            setErrors({ general: "Please select at least one reason for deleting your account." });
            return;
        }

        const confirmDelete = window.confirm(
          "Are you sure you want to delete your account? This action cannot be undone."
        );
    
        if (confirmDelete) {
          // Get the token
          const token = localStorage.getItem("token");
    
          if (!token) {
            setErrors({ general: "No token found. Please log in again." });
            return;
          }
    
          try {
            const response = await fetch("http://localhost:5003/api/auth/deleteaccount", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
              },
            });
    
            if (response.ok) {
              console.log("Your account has been deleted successfully.");
              localStorage.removeItem("token"); 
              navigate("/login");
            } else {
                const data = await response.json(); 
              setErrors({ general: `Failed to delete account: ${data}` });
            }        
          } catch (error) {
            console.error("Error deleting account:", error);
            setErrors({ general: "An error occurred while deleting your account." });
          }
        } else {
          setErrors({ general: "Account deletion canceled." });
        }
      };
    return(
        <section className="delete-page-container">
            <form className="delete-form" onSubmit={handleDelete}>
                <div className="message-section">
                    <h1>Are you sure you want to delete your account?</h1>
                    <p>
                        Once you delete your account, the action is permanent and cannot be undone. 
                        All your account information, including your profile details, blogs created, and any activity history, will be permanently erased from our website. 
                        This means you will lose access to your content, interactions, and any personalized settings associated with your account. 
                        Please be sure that you want to proceed, as this process is irreversible and cannot be reversed once completed.
                    </p>
                </div>


                <div className="options-section">
                    <p>
                        Why did you decide to leave this app? <br/>
                        <label>
                            <input type="checkbox" name="reason" value="Privacy concerns" /> Privacy concerns
                        </label><br/>
                        <label>
                            <input type="checkbox" name="reason" value="Poor user experience" /> Poor user experience
                        </label><br/>
                        <label>
                            <input type="checkbox" name="reason" value="Not enough features" /> Not enough features
                        </label><br/>
                        <label>
                            <input type="checkbox" name="reason" value="I found a better alternative" /> I found a better alternative
                        </label><br/>
                        <label>
                            <input type="checkbox" name="reason" value="Other" /> Other
                        </label><br/>
                    </p>
                </div>

                {errors.general && <span className="error-message-delete">{errors.general}</span>}<br></br>

                <button type="submit" id="delete-button">Delete Account</button>

            </form>
        </section>
    );
}

export default DeleteAccountPage;