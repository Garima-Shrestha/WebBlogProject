import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../css/Header.css';
import logo from '../../images/quiz.jpg';

const HeaderSection = ({ setToken }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the token and user data from local storage
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("user");

        setToken(null);        // Update the token state in the parent component
        navigate('/login');
    };

    const handleSelectChange = (e) => {
        const value = e.target.value;
        if (value === "logout") {
            handleLogout(); 
        } else if (value === "delete-account") {
            navigate('/deleteaccount'); 
        } else if (value === "your-blog"){
            navigate('/yourblog');
        }
    };

    return (
        <section className="Header">
            <div>
                <img src={logo} alt="Blog Logo" title="Innovate, Inspire, Inform" id="logo" loading="lazy"/>   
            </div>

            <div className="NavLists">
                <ul id="NavIcons">
                    <li><Link to="/home" title="Home">Home</Link></li>
                    <li><Link to="/contact" title="Contact us">Contact</Link></li>
                    <li><Link to="/customer" title="Customer Profile">Profile</Link></li>
                    <li><Link to="/makeblog" title="Write a Blog">Write Blog</Link></li>
                </ul>
            </div>

            <div className="dropdown-menu">
                <select name="dropdown" id="dropdown" onChange={handleSelectChange}>
                    <option value="delete-account">Manage Account</option>
                    <option value="your-blog">Your Blog</option>
                    <option value="logout">Logout</option>
                </select>
            </div>

        </section>
    );
}

export default HeaderSection;