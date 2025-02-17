import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import './App.css';
import PrivateRoute from './components/layout/PrivateRoute'; 
import PublicRoute from './components/layout/PublicRoute';
import AdminHeaderSection from './components/layout/AdminHeader';
import HeaderSection from './components/layout/Header';
import FooterSection from './components/layout/Footer';


const LoginPage = lazy(() => import('./components/public/login'));
const RegisterPage = lazy(() => import('./components/public/Register'));
const CustomerPage = lazy(() => import('./components/private/Customer'));
const ContactPage = lazy(() => import('./components/private/Contacts'));
const MakeABlogPage = lazy(() => import('./components/private/MakeABlog'));
const HomePage = lazy(() => import('./components/private/HomePage'));
const BlogPage = lazy(() => import('./components/private/Blog'));
const DeleteAccountPage = lazy(() => import('./components/private/DeleteAccount'));
const BloggerProfileViewPage = lazy(() => import('./components/admin/BloggerProfileView'));
const BlogViewPage = lazy(() => import('./components/admin/BlogView'));
const YourBlogPage = lazy(() => import('./components/private/YourBlog'));

function App() {
  const [token, setToken] = useState(localStorage.getItem('token')); 
  const user = JSON.parse(localStorage.getItem("user")); 
  const role = user ? user.role : null; 

  // Store token in localStorage when it changes
  useEffect(() => {                                    
    if (token) {                                          
      localStorage.setItem('token', token);            // Token exists, save in local storage
    } else {
      localStorage.removeItem('token');                // Token does not exist, remove from local storage
    }
  }, [token]);                                         // The dependency array [token] tells React to only run the useEffect when the token value changes. 

  return (
    <Router>
      <LocationWrapper setToken={setToken} token={token} role={role} />
    </Router>
  );
}

function LocationWrapper({ setToken, token, role }) {
  const location = useLocation();
  console.log('Current Path:', location.pathname);  
  console.log('User  Role:', role); 

  return (
    <>
      {/* Header will not be in the login and register page */}
      {role === "admin" ? (
        <AdminHeaderSection setToken={setToken} />
      ) : (
        location.pathname !== '/' && location.pathname !== '/login' && 
        location.pathname !== '/register' && <HeaderSection setToken={setToken} />
      )}                                                                                    {/* header is kept here not above because if we keep header below the routes then: 
                                                                                            the routes would be displayed first, and only then would the header appear. */}

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Redirection */}
          <Route path="/" element={role === "admin" ? <Navigate to="/profileview" /> : role ? <Navigate to="/home" /> : <LoginPage setToken={setToken} />} />

          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><LoginPage setToken={setToken} /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Private Routes */}
          <Route element={<PrivateRoute allowedRoles={["blogger", "admin"]} />}>
            <Route path="/customer" element={<CustomerPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/makeblog" element={<MakeABlogPage />} />
            <Route path="/makeablog/:blogPageId" element={<MakeABlogPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPage />} /> 
            <Route path="/deleteaccount" element={<DeleteAccountPage />} />
            <Route path="/yourblog" element={<YourBlogPage />} />
          </Route>

          {/* Admin Route */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/profileview" element={<BloggerProfileViewPage />} />
            <Route path="/blogview" element={<BlogViewPage />} />
          </Route>
        </Routes>
      </Suspense>

      {/* Footer will not be displayed on login and register pages */}
      {location.pathname !== '/login' && location.pathname !== '/register' && <FooterSection />}
    </>
  );
}

export default App;