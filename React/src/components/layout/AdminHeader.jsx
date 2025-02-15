import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../images/quiz.jpg';

import '../css/AdminHeader.css';

const AdminHeaderSection = ({ setToken }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the token and user data from local storage
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("user");

        setToken(null);        // Update the token state in the parent component
        navigate('/login');
    };



    return (
        <section className="admin-header">
            <div>
                <img src={logo} alt="Blog Logo" title="Innovate, Inspire, Inform" id="logo" loading="lazy"/>   
            </div>

            <div className="NavLists">
                <ul id="NavIcons">
                    <li><Link to="/profileview" title="Profile View">Blogger Control Panel</Link></li>
                    <li><Link to="/blogview" title="Blog View">Blog Control Panel</Link></li>
                </ul>

                <div>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="hamburger_menu">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
        </section>
    );
}

export default AdminHeaderSection;