import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../css/YourBlog.css';

const YourBlogPage = () => {
    const [userBlogs, setUserBlogs] = useState([]);
    const [fetchError, setFetchError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserBlogs = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setFetchError("You are not authenticated. Please log in.");
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5003/api/createblog/yourblog', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setUserBlogs(data.blogs);
                } else {
                    setFetchError(data.message || "Error fetching user blogs.");
                }
            } catch (error) {
                console.error('Request failed:', error);
                setFetchError("An error occurred while fetching user blogs.");
            }
        };

        fetchUserBlogs();
    }, [navigate]);

    return (
        <section className="your-blog-page">
            {fetchError && <p className="error-message">{fetchError}</p>}
            <h1>Your Blogs</h1>
            <div className="body-card">
                {userBlogs.length > 0 ? (
                    userBlogs.map(blog => (
                        <div key={blog.id} className="blog-item" onClick={() => navigate(`/blog/${blog.id}`)}>
                            <img src={`http://localhost:5003/uploads/${blog.banner_image}`} alt="Blog Banner" className="blog-banner" loading="lazy"/>
                            <div className="blog-text">
                                <h2 className="Blogtitle">{blog.title}</h2>
                                <p>Posted on: {new Date(blog.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No blogs found.</p>
                )}
            </div>
        </section>
    );
};

export default YourBlogPage;