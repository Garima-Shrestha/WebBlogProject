import React, { useState } from "react";
import emailjs from "emailjs-com"; 

import '../css/Contacts.css'
import about from '../../images/about_us.jpg'

const ContactPage = () => {
    const [ContactName, setContactName] = useState("");
    const [ContactEmail, setContactEmail] = useState("");
    const [ContactPhone, setContactPhone] = useState("");
    const [ContactMessage, setContactMessage] = useState("");
    const [Error, setError] = useState("");
    const [ContactReason, setContactReason] = useState("");

    const handleContact = (event) => {
        event.preventDefault();
        
        if (!ContactName || !ContactEmail || !ContactPhone) {
            setError("Please fill in all required fields");
            return;
        }

        const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailCheck.test(ContactEmail)) {
            setError("Please enter a valid email address");
            return;
        }

        const phoneCheck = /^\d{10}$/; // ensures the phone number consists of exactly 10 digits
        if (ContactPhone && !phoneCheck.test(ContactPhone)) {
            setError("Please enter a valid phone number");
            return;
        }

        if (!ContactReason && !ContactMessage) {
            setError("Please either choose a reason or type your issue(or both).");
            return;
        }


        // EmailJS configuration
        const templateParams = {
            from_name: ContactName,
            from_email: ContactEmail,
            from_contact: ContactPhone,
            reason: ContactReason,
            message: ContactMessage,
        };

        emailjs.send('service_iz5oop9', 'template_v2br4wu', templateParams, 'j0dWmJ5CfRsbSIvOe')
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                setError("Your message has been submitted successfully!");
                setContactName("");
                setContactEmail("");
                setContactPhone("");
                setContactReason("");
                setContactMessage("");
            }, (err) => {
                console.error('FAILED...', err);
                setError("There was an error sending your message. Please try again later.");
            });
    };

    
    return(
        <section className="contact_WebBody">
        <div className="about">
            <div id="about_text">
                <b><h2>About Us</h2></b>
                <b><p id="welcome">Welcome to NabinKitab, your ultimate destination for everything tech!</p></b>
                <p><img src={about} alt="About Tech" title="Explore Tech with Us" id="about_image" loading="lazy" />
                    At NabinKitab, we believe in the power of sharing knowledge and fostering a community 
                    where technology enthusiasts, professionals, and curious minds come together. 
                    Whether you’re here to stay updated on the latest trends, dive deep into insightful articles, 
                    or share your expertise with the world, you’ve found the right place.
                </p>
                <p>Our platform is built for tech lovers by tech lovers. 
                    From cutting-edge innovations and software reviews to coding tutorials and industry insights, 
                    we aim to cover the vast and ever-evolving tech landscape. 
                    And the best part? It’s not just about reading — it’s about contributing
                </p>
                
                <h4>Here, you can:</h4>
                <ul>
                    <li><b>Read:</b> Discover diverse tech blogs, articles, and guides written by experts and passionate contributors.</li>
                    <li><b>Write:</b> Share your thoughts, experiences, and expertise with a global audience of like-minded individuals.</li>
                </ul>
                <p>We’re committed to fostering a supportive, inclusive, and collaborative environment where everyone’s voice matters. 
                    Whether you’re a seasoned tech professional or someone just stepping into the world of technology, 
                    NabinKitab is the perfect place to connect, learn, and grow.
                </p>
                <b>Join the conversation. Share the journey.</b>

                <p>Let’s explore the future of technology together, one blog at a time.</p>
                <p>Stay connected, stay curious, and stay inspired with NabinKitab</p>
            </div>
        </div>

        
        <div>
            <div className="contact_info">
            <h3>Need help? Contact us anytime!</h3>
            <div className="contact_body">
                <form id="contact_form" onSubmit={handleContact}>
                    <input 
                        type="text" 
                        id="name" 
                        name="contact_name" 
                        placeholder="Enter your name"
                        onChange={(e) => setContactName(e.target.value)}
                        required
                    />
                    <br/>

                    <input 
                        type="text" 
                        id="email" 
                        name="contact_email" 
                        placeholder="Enter your email"
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                    />
                    <br/>

                    <input 
                        type="text" 
                        id="phnNo" 
                        name="contact_phn" 
                        placeholder="Enter your Phone Number"
                        onChange={(e) => setContactPhone(e.target.value)}
                        required
                    />
                    <br/>

                    <select 
                        id="contact-reason" 
                        value={ContactReason} 
                        onChange={(e) => setContactReason(e.target.value)}
                    >
                        <option value="">Select a reason for contacting us</option>
                        <option value="blog-creation-issues">Blog Creation Issues</option>
                        <option value="commenting-issues">Commenting Issues</option>
                        <option value="profile-management">Profile Management</option>
                        <option value="forgot-password">Forgot Password</option> 
                        <option value="general-inquiries">General Inquiries</option>
                    </select> <br/>

                    <textarea
                        id="description"
                        name="contact_desc"
                        rows="20"
                        cols="121"
                        placeholder="Enter your comments, suggestions, or inquiries here."
                        onChange={(e) => setContactMessage(e.target.value)} 
                    >
                    </textarea>
                    <br/>

                    {Error && <p className="error-message">{Error}</p>}<br/>

                    <p className="disclaimer">
                        <strong>Disclaimer: </strong>
                        You may either select a reason, type your issue, or do both. Submit your query, and we'll respond via email.
                    </p>

                    <button id="submit_button">Submit</button>
                </form>
            </div>
            </div>
        </div>
    </section>
    );
}

export default ContactPage;