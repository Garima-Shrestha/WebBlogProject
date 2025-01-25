import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import './App.css';
import LoginPage from './components/public/login';
import RegisterPage from './components/public/Register';
import HeaderSection from './components/layout/Header';
import CustomerPage from './components/private/Customer';
import ContactPage from './components/private/Contacts'
import AdminRegister from './components/public/AdminRegister';
import MakeABlogPage from './components/private/MakeABlog';
import HomePage from './components/private/HomePage';
import BlogPage from './components/private/Blog';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token')); 

  // Store token in localStorage when it changes
  useEffect(() => {                                    
    if (token) {                                          
      localStorage.setItem('token', token);            //Token exist garxa then save in local storage
    } else {
      localStorage.removeItem('token');                //Token exist gardaina remove from local storage
    }
  }, [token]);                                         //The dependency array [token] tells React to only run the useEffect when the token value changes. 
                                                        // If the token value stays the same between renders, the effect will not run.

  return (
    <Router>
      <LocationWrapper setToken={setToken} token={token} />
    </Router>
  );
}

function LocationWrapper({setToken, token}) {
  const location = useLocation();
  console.log('Current Path:', location.pathname);  // Log to check the current path

  return (
    <>
      {/* Header will not be in the login and register page */}
      {location.pathname !== '/' && location.pathname !== '/login' && 
      location.pathname !== '/register' && location.pathname !=='/adminRegister' && <HeaderSection />}       {/* header is kept here not below because if we keep header below the routes then: 
                                                                                                                                    the routes would be displayed first, and only then would the header appear. */}

      <Routes>
        {/* Redirect to /home if logged in, else show login */}
        <Route path="/" element={token ? <Navigate to="/home" /> : <LoginPage setToken={setToken} />} />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/adminRegister" element={<AdminRegister />} />

        {/* Private Routes */}
        {/* <Route path="/customer" element={<PrivateRoute element={<CustomerPage />} />} /> */}
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/makeblog" element={<MakeABlogPage/>} />
        <Route path="/home" element={<PrivateRoute token={token} element={<HomePage />} />} />
                <Route path="/blog" element={<BlogPage/>} />
      </Routes>
    </>
  );


// Private Route Component
function PrivateRoute({ token, element }) {
  // If no token, redirect to login page
  return token ? element : <Navigate to="/login" />;
}

}

export default App;
