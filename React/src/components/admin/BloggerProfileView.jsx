import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

import '../css/BloggerProfileView.css';

const BloggerProfileViewPage = () =>{
    const [users, setUsers] = useState([]); 
    const [selectedUser, setSelectedUser] = useState(null);
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



    const deleteBlogger = async () => {
        if (!selectedUser) return; // If no user is selected, do nothing
    
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5003/api/bloggerprofileview/profileview/delete/${selectedUser}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.ok) {
                // Remove the deleted user from the state
                setUsers(users.filter(user => user.id !== selectedUser));
                setSelectedUser(null); // Reset selected user ID
            }
        } catch (error) {
            console.error('Error deleting blogger:', error);
        }
    };

    const handleRowClick = (userId) => {
        setSelectedUser(userId); // Set the selected user ID
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
                            <tr key={user.id} 
                                onClick={() => handleRowClick(user.id)}
                                className={selectedUser  === user.id ? 'selected-row' : ''}
                            >
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
                <button onClick={deleteBlogger}>Delete</button>
            </div>
        </section>
    );
}

export default BloggerProfileViewPage;