import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import '../css/BloggerProfileView.css';

const BloggerProfileViewPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [forceUpdate, setForceUpdate] = useState(0); // State variable to trigger re-render
    const [addError, setAddError] = useState('');
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState('');
    const [selectedUsers, setSelectedUsers] = useState(''); 


    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(prevState => !prevState);
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setSaveError("You are not authenticated. Please log in.");
                navigate('/adminLogin');
                return;
            }

            const response = await fetch(`http://localhost:5003/api/auth/profileview`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data.bloggers);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [navigate, forceUpdate]); 

    const handleRowClick = (user) => {
        setSelectedUser(user.id);
        setUsername(user.username);
        setEmail(user.email);
        setPassword(''); // Do not display the actual password
        setSelectedUsers(user.email);
    };

    const handleEdit = async () => {
        if (!selectedUser) return; 
    
        try {
            const token = localStorage.getItem('token');

            const updateData = {
                username: username,
                email: email
              };

            // if (password.trim() !== "") {
            //   updateData.password = password;
            // }
                


            let hasError = false;

        // Validate email if it has changed
        if (email !== users.find(user => user.id === selectedUser ).email) {                // Check if the entered email is different from the current email of the selected user
            const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailCheck.test(email)) {
                setEmailError("Please enter a valid email address");
                hasError = true;
            } else {
                setEmailError(""); // Clear error if valid
            }
        }

        if (hasError) {
            return;
        }

        // Validate password if it has been changed
        if (password.trim() !== "") {
            if (password.length < 8 || password.length > 16) {
                setPasswordError("Password must be between 8 and 16 characters");
                hasError = true;
            } else {
                setPasswordError(''); // Clear error if valid
                updateData.password = password; // Include password in updateData
            }
        }

        if (hasError) {
            return;
        }



            const response = await fetch(`http://localhost:5003/api/auth/profileview/update/${selectedUser}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                await fetchUsers(); // Re-fetch the user data to ensure updated state
                setForceUpdate(forceUpdate + 1); // Trigger re-render
                // Reset form fields
                setSelectedUser(null);
                setUsername('');
                setEmail('');
                setPassword('');
            } else {
                console.error('Update failed:', await response.text());
            }
        } catch (error) {
            console.error('Error updating blogger:', error);
        }
    };

    const deleteBlogger = async () => {
        if (!selectedUser) return;

        const isConfirmed = window.confirm(`Are you sure you want to delete this blogger:   ${selectedUsers} ?`);
        if (!isConfirmed) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5003/api/auth/profileview/delete/${selectedUser}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                await fetchUsers(); // Re-fetch the user data to ensure updated state
                setForceUpdate(forceUpdate + 1); // Trigger re-render
                // Reset form fields
                setSelectedUser(null);
                setUsername('');
                setEmail('');
                setPassword('');
            }
        } catch (error) {
            console.error('Error deleting blogger:', error);
        }
    };


    const addBlogger = async () => {
        try {
            if (!username || !email || !password) {
                setAddError("All fields are required.");
                return;
            }

            let hasError = false;   

            const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailCheck.test(email)) {  
                setEmailError("Please enter a valid email address");                                   
                hasError = true;
            } else {
                setEmailError(""); 
            }
            if (hasError) {
                return;
            }   
        
            if (password.length < 8 || password.length > 16) {
                setPasswordError("Password must be between 8 and 16 characters");
                hasError = true;
            } else {
                setPasswordError(''); 
            }
            if (hasError) {
                return; // Stop submission if there's an error
            }
        
        
    
        
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5003/api/auth/profileview/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                }),
            });

            if (response.ok) {
                await fetchUsers(); // Re-fetch the user data to ensure updated state
                setForceUpdate(forceUpdate + 1); // Trigger re-render
                // Reset form fields
                setUsername('');
                setEmail('');
                setPassword('');
                setAddError(''); // Clear the error message
            } else {
                const errorData = await response.json();
                setAddError(errorData.error || "Failed to add blogger.");
            }
        } catch (error) {
            console.error('Error adding blogger:', error);
            setAddError("Error adding blogger.");
        }
    }

    return (
        <section className="blogger-view-container">
            <div className="blogger-input">
                <label htmlFor="blogger_name">User Name:</label>
                <input
                    type="text"
                    id="blogger_name"
                    name="username"
                    placeholder="user name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <br />

                <label htmlFor="blogger_email">E-mail:</label>
                <input
                    type="email"
                    id="blogger_email"
                    name="email"
                    placeholder="email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />

                <label htmlFor="register_password">Password:</label>
                <input
                    type={passwordVisible ? "text" : "password"}
                    id="register_password"
                    name="password"
                    minLength={8}
                    maxLength={16}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />

                <input
                    type="checkbox"
                    id="blogger_showPass"
                    name="show_pass"
                    onClick={togglePasswordVisibility}
                />
                <label htmlFor="showPass" style={{ fontSize: '14px' }}>Show Password</label><br />

                {addError && <p className="error-message">{addError}</p>} <br/>
                {emailError && <p className="error-message">{emailError}</p>} <br/>
                {passwordError && <p className="error-message">{passwordError}</p>}


                <div className="add-button">
                    <button onClick={addBlogger}>Add</button>
                </div>

            </div>

            <div className="blogger-table-list">
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Username</th>
                            <th>Email</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.filter(user => user).map(user => (
                            <tr key={user.id}
                                onClick={() => handleRowClick(user)}
                                className={selectedUser === user.id ? 'selected-row' : ''}
                            >
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="edit-button">
                <button onClick={handleEdit}>Edit</button>
            </div>

            <div className="delete-button">
                <button onClick={deleteBlogger}>Delete</button>
            </div>
        </section>
    );
}

export default BloggerProfileViewPage;
