import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css';
import pic from '../../images/happy_img.webp';

const HomePage = () => {
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                console.log("Fetching blogs...");
                const token = localStorage.getItem('token'); 
                const response = await fetch('http://localhost:5003/api/createblog/makeblog/all', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Attach token to headers
                    }
                });
                
                const data = await response.json();
                if (response.ok) {
                    setBlogs(data.blogs); // Assuming the API returns an array of blogs
                } else {
                    console.error('Error fetching blogs:', data.error);
                }
            } catch (error) {
                console.error('Request failed:', error);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <section className="home-page-container">
            <section className="home-WebBody">

                <div className="search">
                    <input 
                        type="search" 
                        id="search_bar" 
                        name="search_bar" 
                        placeholder="Search Blog"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Conditionally render the moto section only if the search input is empty */}
                {search === '' && (
                    <div className="moto" onClick={() => navigate('/makeblog')} style={{ cursor: 'pointer' }}>
                        <div className="moto-text">
                            <h2>Have Something to Say? Start Your Blog Today!</h2>
                            <p>
                                "Share your unique perspective and connect with a community of like-minded individuals. 
                                Your voice has the power to inspire and make an impact—start your blog today!"
                            </p>
                        </div>
                        <img src={pic} loading="lazy" className="moto-image" alt="Inspiration" />
                    </div>
                )}

                {blogs.filter(blog => blog.title.toLowerCase().includes(search)).length > 0 ? (
                    blogs.filter(blog => blog.title.toLowerCase().includes(search)).map((blog) => (
                        <div key={blog.id} className="body_details" onClick={() => navigate(`/blog/${blog.id}`)}>
                            <div className="card-body">
                                <div className="banner-image">
                                    <img 
                                        src={`http://localhost:5003/uploads/${blog.banner_image}`} 
                                        alt="Blog Banner" 
                                        loading="lazy" 
                                    />
                                </div>
                                <div className="blog-text">
                                    <h1 className="Blogtitle">{blog.title}</h1>
                                    <p className="published-by">
                                        <span>Posted by: {blog.email || "Unknown Author"}</span>
                                        <br />
                                        <span>Posted on: {new Date(blog.created_at).toLocaleDateString()}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No blogs available.</p>
                )}
            </section>
        </section>
    );
};

export default HomePage;