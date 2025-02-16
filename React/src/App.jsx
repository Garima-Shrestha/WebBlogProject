import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import './App.css';
import LoginPage from './components/public/login';
import RegisterPage from './components/public/Register';
import HeaderSection from './components/layout/Header';
import CustomerPage from './components/private/Customer';
import ContactPage from './components/private/Contacts'
import MakeABlogPage from './components/private/MakeABlog';
import HomePage from './components/private/HomePage';
import BlogPage from './components/private/Blog';
import DeleteAccountPage from './components/private/DeleteAccount';
import BloggerProfileViewPage from './components/admin/BloggerProfileView';
import BlogViewPage from './components/admin/BlogView';
import PrivateRoute from './components/layout/PrivateRoute'; 
import PublicRoute from './components/layout/PublicRoute';
import AdminHeaderSection from './components/layout/AdminHeader';
import YourBlogPage from './components/private/YourBlog';
import FooterSection from './components/layout/Footer';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token')); 
  const user = JSON.parse(localStorage.getItem("user")); 
  const role = user ? user.role : null; 


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
      <LocationWrapper setToken={setToken} token={token} role={role} />
    </Router>
  );
}

function LocationWrapper({setToken, token, role}) {
  const location = useLocation();
  console.log('Current Path:', location.pathname);  
  console.log('User Role:', role); 

  return (
    <>
      {/* Header will not be in the login and register page */}
      {role === "admin" ? (
        <AdminHeaderSection setToken={setToken} />
      ) : (
        location.pathname !== '/' && location.pathname !== '/login' && 
        location.pathname !== '/register' && <HeaderSection setToken={setToken} />
        )}                                                                    {/* header is kept here not above because if we keep header below the routes then: 
                                                                              the routes would be displayed first, and only then would the header appear. */}

      <Routes>
        {/* Redirection */}
        <Route path="/"  element={role === "admin" ? <Navigate to="/profileview" /> : role ? <Navigate to="/home" /> : <LoginPage setToken={setToken} />} />

        {/* Public Routes */}

        <Route path="/login" element={ <PublicRoute> <LoginPage setToken={setToken} /> </PublicRoute> } />
        <Route path="/register" element={ <PublicRoute> <RegisterPage /> </PublicRoute> } />


        
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

       {/* Footer will not be displayed on login and register pages */}
       {location.pathname !== '/login' && location.pathname !== '/register' && <FooterSection />}
    </>
  );
}

export default App;
