import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

import '../css/BloggerProfileView.css';

const BloggerProfileViewPage = () =>{
    const [users, setUsers] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
    
                if (!token) {
                    setSaveError("You are not authenticated. Please log in.");
                    navigate('/adminLogin');
                    return;
                }
                
                const response = await fetch(`http://localhost:5003/api/bloggerprofileview/profileview`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const data = await response.json();
                setUsers(data.bloggers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
    
        fetchUsers();
    }, [navigate]);

    
    const handleViewProfile = (id) => {
        navigate(`/customerProfile/${id}`);    // customer profile page ma nagivate garxa with the ID
    };
    


    return (
        <section className="blogger-view-container">
            <div className="blogger-table-list">
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th> 
                            <th>Username</th>
                            <th>Email</th>   
                            <th>Profile Info</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button onClick={() => handleViewProfile(user.id)}>View Profile</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="delete-button">
                <button onClick={() => deleteBlogger()}>Delete Blogger</button>
            </div>
        </section>
    );
}

export default BloggerProfileViewPage;