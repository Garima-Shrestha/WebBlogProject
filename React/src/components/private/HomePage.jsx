import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css';

const HomePage = () => {
    const [blogs, setBlogs] = useState([]);
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
                {blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <div key={blog.id} className="body_details" onClick={() => navigate(`/blog/${blog.id}`)}>
                            <div className="card-body">
                                <div className="banner-image">
                                    <img src={`http://localhost:5003/uploads/${blog.banner_image}`} alt="Blog Banner" />
                                </div>
                                <h1 className="Blogtitle">{blog.title}</h1>
                                <p className="published-by">
                                    <span>Posted by: {blog.email || "Unknown Author"}</span>
                                    <br />
                                    <span>Posted on: {new Date(blog.created_at).toLocaleDateString()}</span>
                                </p>

                                {/* <div className="blog-article" dangerouslySetInnerHTML={{ __html: blog.content }} /> */}
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
