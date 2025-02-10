import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import '../css/Customer.css'
import'../layout/Header';

const CustomerPage = () => {
    const { id } = useParams(); 

    const [CustomerFirstName, setCustomerFirstName]=useState("");
    const [CustomerLastName, setCustomerLastName]=useState("");
    const [CustomerAddress, setCustomerAddress]=useState("");
    const [Gender, setGender] = useState(""); 
    const [CustomerDOB, setCustomerDOB]=useState("");
    const [CustomerEmail, setCustomerEmail]=useState("");
    const [CustomerContact, setCustomerContact]=useState("");
    const [CustomerID, setCustomerID] = useState("");
    const [emailError, setEmailError] = useState("");
    const [contactError, setContactError] = useState('');
    const [genderError, setGenderError] = useState('');
    const [fetchError, setFetchError] = useState('');
    const [saveError, setSaveError] = useState('');


    const navigate = useNavigate();


    // Fetch resume data on initial render
    useEffect(() => {
        fetchCustomerDetails(); // Fetch existing customer data on page load
    }, [id]); // Add id to the dependency array



    // Fetch existing customer details for editing
    const fetchCustomerDetails = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setFetchError("You are not authenticated. Please log in.");
            navigate('/login');
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:5003/api/customerProfile/customer/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            const data = await response.json();
            if (response.ok) {
                setCustomerID(data.id);
                setCustomerFirstName(data.first_name || "");
                setCustomerLastName(data.last_name || "");
                setCustomerAddress(data.address || "");
                setCustomerDOB(data.dob ? data.dob.split('T')[0] : ""); // Convert date format
                setCustomerEmail(data.email || "");
                setCustomerContact(data.contact || "");
                setGender(data.gender || "");
            } else {
                setFetchError("Failed to fetch customer details");
            }
        } catch (error) {
            console.error("Error fetching customer details:", error);
            setFetchError("An error occurred while fetching details");
        }
    };
    


    const handleCustomer = async (event) => {
        event.preventDefault();

        let hasError = false;   
        
        const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailCheck.test(CustomerEmail)) {
            setEmailError("Please enter a valid email address");
            hasError = true;
        }
        
        // If email has an error, return early and stop further validation
        if (hasError) {
          return;
        }   


        if (!document.querySelector('input[name="gender"]:checked')) {
            setGenderError("Please select a gender.");
            hasError = true;
        }

        // If gender has an error, return early and stop further validation
        if (hasError) {
            return;
          } 


        const phoneCheck = /^\d{10}$/;                           //  ensures the phone number consists of exactly 10 digits
        if (CustomerContact && !phoneCheck.test(CustomerContact)) {
            setContactError("Please enter a valid phone number");
            hasError = true;
        }

         // If contact has an error, return early and stop further validation
        if (hasError) {
            return;
        } 



        // Construct customer data to be sent
        const customerData = {
            firstName: CustomerFirstName,
            lastName: CustomerLastName,
            address: CustomerAddress,
            dob: CustomerDOB,
            email: CustomerEmail,
            contact: CustomerContact,
            gender: Gender
        };

        // Getting token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            setSaveError("You are not authenticated. Please log in.");
            navigate('/login');
            return;
        }

            

        try {
            const url = CustomerID 
                ? `http://localhost:5003/api/customerProfile/customer/update/${CustomerID}`
                : `http://localhost:5003/api/customerProfile/customer/add`;
            const method = CustomerID ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(customerData),
            });

            if (response.ok) {
                setSaveError(CustomerID ? "Customer details updated successfully" : "Customer details added successfully");
            } else {
                setSaveError("Failed to save customer details");
            }
        } catch (error) {
            console.error("Error:", error);
            setSaveError("An error occurred while saving details");
        }
    };


    return (
        <section className="customer_WebBody">
            <form className="c_form" onSubmit={handleCustomer}>
                <div id="cInfo">
                    <div id="c_details">
                        <h2>Blogger Profile</h2>

                        <label htmlFor="c_fname"> First Name: </label>
                        <input 
                            type="text" 
                            id="c_fname" 
                            name="cust_fname" 
                            value={CustomerFirstName}
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
                            value={CustomerLastName}
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
                            value={CustomerAddress}
                            placeholder="address"
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            required
                        />
                        <br/>

                        <label htmlFor="gender">Gender:</label>
                        <input
                            type="radio"
                            id="c_male"
                            name="gender"
                            value="Male"
                            onChange={(e) => setGender(e.target.value)}
                            checked={Gender === "Male"}
                        />
                        <label htmlFor="c_male">Male</label><br/>
                        <input
                            type="radio"
                            id="c_female"
                            name="gender"
                            value="Female"
                            onChange={(e) => setGender(e.target.value)}
                            checked={Gender === "Female"}
                        />
                        <label htmlFor="c_female">Female</label><br/>
                        <input
                            type="radio"
                            id="c_others"
                            name="gender"
                            value="Others"
                            onChange={(e) => setGender(e.target.value)}
                            checked={Gender === "Others"}
                        />
                        <label htmlFor="c_others">Others</label><br/>

                        {genderError && <p className="error-message">{genderError}</p>}
                        <br/>

                        <label htmlFor="c_dob">Date of Birth:</label>
                        <input 
                            type="date" 
                            id="c_dob" 
                            name="cust_dob"
                            value={CustomerDOB}
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
                            value={CustomerEmail}
                            placeholder="email@gmail.com"
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            required
                        />
                        {emailError && <p className="error-message">{emailError}</p>}
                        <br/>

                        <label htmlFor="c_contact">Contact Information:</label>
                        <input 
                            type="text" 
                            id="c_contact" 
                            name="cust_contact" 
                            value={CustomerContact}
                            placeholder="### ### ####" 
                            onChange={(e) => setCustomerContact(e.target.value)}
                            required
                        />
                        {contactError && <p className="error-message">{contactError}</p>}
                        <br/>


                        <br/>{fetchError && <p className="error-message">{fetchError}</p>}<br/>
                        {saveError && <p className="error-message">{saveError}</p>}


                        <button type="submit" id="customer_submit">Submit</button>            
                    </div>
                </div>
            </form>
        </section>
    );
}

export default CustomerPage;