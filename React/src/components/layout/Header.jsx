import React from "react";
import { Link } from "react-router-dom";

import '../css/Header.css'
import logo from '../../images/quiz.jpg'


const HeaderSection = () => {
    return (
        <section className="Header">
        <div>
            <img src={logo} alt="Blog Logo" title="Innovate, Inspire, Inform" id="logo" loading="lazy"/>   
        </div>

        <div className="NavLists">
            <ul id="NavIcons">
            <li> <Link to="/home" title="Home">Home</Link></li>
            <li> <Link to="/contact" title="Contact us">Contact</Link></li>
            <li> <Link to="/customer" title="Customer Profile">Profile</Link></li>
            <li> <Link to="/makeblog" title="Write a Blog">Write Blog</Link></li>
            </ul>
        </div>

        <div className="search_dashboard">
            <input 
                type="search" 
                id="search_bar" 
                name="search_bar" 
                placeholder="Search Article"
            />
            <button id="search_button">Search</button>

            <select name="admin_dashboard" id="admin_dashboard">
                <option>Admin</option>
                <option id="logout">Logout</option>
               
                </select>
        </div>

        <div className="hamburger_menu">
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
        </div>
        
        {/* <div className="hamburger_menu">
            <a href="" className="icon" onclick="myFunction()">&#9776;</a>
        </div> */}

    </section>

    );
}

export default HeaderSection;