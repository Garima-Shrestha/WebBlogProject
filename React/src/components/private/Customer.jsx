import React, {useState} from 'react';
import '../css/Customer.css'
import'../layout/Header';

const CustomerPage = () => {
    const [CustomerFirstName, setCustomerFirstName]=useState("");
    const [CustomerLastName, setCustomerLastName]=useState("");
    const [CustomerAddress, setCustomerAddress]=useState("");
    const [CustomerDOB, setCustomerDOB]=useState("");
    const [CustomerEmail, setCustomerEmail]=useState("");
    const [CustomerPassword, setCustomerPassword]=useState("");
    const [CustomerContact, setCustomerContact]=useState("");
    const [PasswordVisible,setPasswordVisible]=useState(false);


    const togglePasswordVisibility=()=>{
        setPasswordVisible(prevState=>!prevState);
    };


    const handleCustomer = (event) => {
        event.preventDefault();
        if (!CustomerFirstName || !CustomerLastName ||!CustomerAddress ||!CustomerDOB ||!CustomerEmail ||!CustomerPassword ||!CustomerContact) {
            alert("Please fill in all details");
            return;
        }

        const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailCheck.test(CustomerEmail)) {
            alert("Please enter a valid email address");
            return;
        }

        if (CustomerPassword.length < 8 || CustomerPassword.length > 16) {
            alert("Password must be between 8 and 16 characters");
            return;
        }

        if (!document.querySelector('input[name="gender"]:checked')) {
            alert("Please select a gender.");
            return;
        }

        const phoneCheck = /^\d{10}$/;                           //  ensures the phone number consists of exactly 10 digits
        if (CustomerContact && !phoneCheck.test(CustomerContact)) {
            alert("Please enter a valid phone number");
            return;
        }
        

    }


    return (
        <section className="customer_WebBody">
            <form className="c_form" onSubmit={handleCustomer}>
                <div id="cInfo">
                    <div id="c_details">
                        <h2>Customer Details</h2>

                        <label htmlFor="c_fname"> First Name: </label>
                        <input 
                            type="text" 
                            id="c_fname" 
                            name="cust_fname" 
                            placeholder="first name" 
                            onChange={(e) => setCustomerFirstName(e.target.value)}
                            required
                        />
                        <br/>

                        <label htmlFor="c_lName">Last Name:</label>
                        <input 
                            type="text" 
                            id="c_lName"
                            name="cust_lname" 
                            placeholder="last name"
                            onChange={(e) => setCustomerLastName(e.target.value)}
                            required 
                        />
                        <br/>

                        <label htmlFor="c_address">Address:</label>
                        <input 
                            type="text" 
                            id="c_address" 
                            name="cust_address" 
                            placeholder="address"
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            required
                        />
                        <br/>

                        <label htmlFor="gender">Gender:</label>
                        <input type="radio" id="c_male" name="gender"/>
                        <label htmlFor="male">Male</label><br/>
                        <input type="radio" id="c_female" name="gender"/>
                        <label htmlFor="female">Female</label><br/>
                        <input type="radio" id="c_others" name="gender"/>
                        <label htmlFor="others">Others</label><br/>

                        <label htmlFor="c_dob">Date of Birth:</label>
                        <input 
                            type="date" 
                            id="c_dob" 
                            name="cust_dob"
                            placeholder='date of birth'
                            onChange={(e) => setCustomerDOB(e.target.value)}
                            required
                        />
                        <br/>

                        <label htmlFor="c_email">E-mail:</label>
                        <input 
                            type="email" 
                            id="c_email" 
                            name="cust_email" 
                            placeholder="email@gmail.com"
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            required
                        />
                        <br/>

                        <label htmlFor="c_contact">Contact Information:</label>
                        <input 
                            type="text" 
                            id="c_contact" 
                            name="cust_contact" 
                            placeholder="### ### ####" 
                            onChange={(e) => setCustomerContact(e.target.value)}
                            required
                        />
                        <br/>

                        <button type="submit" id="customer_submit">Submit</button>            
                    </div>
                </div>
            </form>
        </section>
    );
}

export default CustomerPage;