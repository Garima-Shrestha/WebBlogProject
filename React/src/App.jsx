import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import LoginPage from './components/public/login';
import RegisterPage from './components/public/Register';
import HeaderSection from './components/layout/Header';
import CustomerPage from './components/private/Customer';
import ContactPage from './components/private/Contacts'
import AddAdminProfilePage from './components/private/AddAdminProfile';
import MakeABlogPage from './components/private/MakeABlog';
import HomePage from './components/private/HomePage';
import BlogPage from './components/private/Blog';

function App() {
  return (
    <Router>
      <LocationWrapper />
    </Router>
  );
}

function LocationWrapper() {
  const location = useLocation();
  console.log('Current Path:', location.pathname);  // Log to check the current path

  return (
    <>
      {/* Header will not be in the login and register page */}
      {location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register' && <HeaderSection />}       {/* header is kept here not below because if we keep header below the routes then: 
                                                                                                                                    the routes would be displayed first, and only then would the header appear. */}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Private Routes */}
        {/* <Route path="/customer" element={<PrivateRoute element={<CustomerPage />} />} /> */}
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/addAdmin" element={<AddAdminProfilePage />} />
        <Route path="/makeblog" element={<MakeABlogPage/>} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/blog" element={<BlogPage/>} />
      </Routes>
    </>
  );
}

export default App;
