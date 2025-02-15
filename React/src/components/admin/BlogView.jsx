import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import '../css/BlogView.css';

const BlogViewPage = () => {
    const [viewblogs, setViewBlog] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const navigate = useNavigate();

    // Fetch all blogs from the backend
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:5003/api/createblog/makeblog/all", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setViewBlog(data.blogs); 
                } else {
                    console.error("Error fetching blogs:", data.error);
                }
            } catch (error) {
                console.error("Request failed:", error);
            }
        };

        fetchBlogs();
    }, []);


    const handleRowClick = (viewblog) => {
        setSelectedBlog(viewblog.id); 
    };



    const deleteBlog = async () => {
        if (!selectedBlog) return;

        const isConfirmed = window.confirm("Are you sure you want to delete this blog?");
        if (!isConfirmed) {
            return; // Exit if the user cancels the deletion
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5003/api/createblog/makeblog/admin/delete/${selectedBlog}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setViewBlog(viewblogs.filter(blog => blog.id !== selectedBlog));
                setSelectedBlog(null); // Clear the selected blog
            } else {
                console.error("Error deleting blog:", await response.text());
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    };


    return (
        <section className="blog-view-container">
            <h1>Admin Blog View</h1>
            {viewblogs.length === 0 ? (
                <p>No blogs available.</p> 
            ) : (
                <div className="blog-table-list">
                    <table>
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Published By</th>
                                <th>Published Date</th>
                                <th>Title</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {viewblogs.map((viewblog) => (
                                <tr key={viewblog.id}
                                    onClick={() => handleRowClick(viewblog)}
                                    className={selectedBlog === viewblog.id ? 'selected-row' : ''}
                                >
                                    <td>{viewblog.id}</td>
                                    <td>{viewblog.email}</td>
                                    <td>{new Date(viewblog.created_at).toLocaleDateString()}</td>
                                    <td>{viewblog.title}</td>
                                    <td>
                                        <button
                                            className="view-button"
                                            onClick={() => navigate(`/blog/${viewblog.id}`)}
                                        >
                                            View Blog
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <button className="delete-btn" onClick={deleteBlog}>Delete</button>
        </section>
    );
};

export default BlogViewPage;