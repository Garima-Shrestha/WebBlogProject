import React, {useState, useEffect, useRef} from "react"
import '../css/BlogPage.css'
import { useParams, useNavigate } from 'react-router-dom';

import userProfileComment from '../../images/comment.png'


const BlogPage = () => {
    const[commentUserName, setCommentUserName]=useState("");
    const[comment, setComment]=useState("");
    const [storeComments, setStoreComments] = useState([]); // State to store all comments
    const [blogData, setBlogData] = useState(null); 
    const [fetchError, setFetchError] = useState(''); 
    const [commentError, setCommentError] = useState('');
    const [readingTime, setReadingTime] = useState(0); 
    const timerRef = useRef(null);

    const { id } = useParams(); // Get blog ID from URL parameters

    const navigate = useNavigate();


    useEffect(() => {
        // Retrieve the user's name from local storage
        const storedUserName = localStorage.getItem('userName'); 
        if (storedUserName) {
            setCommentUserName(storedUserName); 
        }

        const fetchBlogData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setFetchError("You are not authenticated. Please log in.");
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5003/api/createblog/makeblog/fetch/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setBlogData(data.fetchBlog); // Ensure you access the correct nested object
                    

                    const userId = localStorage.getItem('userId'); 
                    const readingTimeKey = `readingTime_${userId}_${id}`; // Unique key for each user and blog
                    const startTimeKey = `startTime_${userId}_${id}`;   // Unique key for start time
        
                    const storedData = JSON.parse(localStorage.getItem(readingTimeKey));
                    const storedStartTime = localStorage.getItem(startTimeKey);

                    // If start time is not set, set it
                    if (!storedStartTime) {
                        localStorage.setItem(startTimeKey, Date.now()); // Store the current timestamp
                    }

                    if (storedData) {
                        const { time, timestamp } = storedData;
                        const now = Date.now();
                        const hoursPassed = (now - parseInt(localStorage.getItem(startTimeKey), 10)) / (1000 * 60 * 60);
                        
                        // Reset reading time if more than 24 hour have passed
                        if (hoursPassed >= 24) {
                            setReadingTime(0); 
                            localStorage.removeItem(readingTimeKey); 
                            localStorage.removeItem(startTimeKey); 
                        } else {
                            if (storedData) {
                                const { time } = storedData;
                                setReadingTime(time);
                            } else {
                                setReadingTime(0); // Initialize reading time if not found
                            }
                        }
                    }

                    // Clear any existing timer before setting a new one
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                    }

                    // Start the reading timer
                    timerRef.current = setInterval(() => {
                        const now = Date.now();
                        const hoursPassed = (now - parseInt(localStorage.getItem(startTimeKey), 10)) / (1000 * 60 * 60); 

                        // Check if 24 hour have passed
                        if (hoursPassed >= 24) {
                            setReadingTime(0); 
                            localStorage.removeItem(readingTimeKey);
                            localStorage.removeItem(startTimeKey);
                        } else {
                            setReadingTime(prevTime => {
                                const newTime = prevTime + 1; 

                                // Store the updated reading time and current timestamp
                                localStorage.setItem(readingTimeKey, JSON.stringify({ time: newTime, timestamp: Date.now() }));
                                return newTime; // Return the new time
                            });
                        }
                    }, 60000); // Update every minute
                } else {
                    if (response.status === 404) {
                        setFetchError("Blog not found.");
                    } else {
                        setFetchError("Error fetching blog data.");
                    }
                    console.error('Error fetching blog data:', data.error);
                }                
            } catch (error) {
                console.error('Request failed:', error);
                setFetchError("An error occurred while fetching the blog data.");
            }
        };

        fetchBlogData();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current); 
            }
        };
    }, [id, navigate]);


    const handleDeleteBlog = async () => {
        const isConfirmed = window.confirm("Are you sure you want to delete this blog?");
        if (!isConfirmed) {
            return; // Exit the function if the user cancels the deletion
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
            setFetchError("You are not authenticated. Please log in.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5003/api/createblog/makeblog/delete/${blogData.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });            

            if (response.ok) {
                // Remove the blog from local storage
                localStorage.removeItem("publishedBlog");
                navigate('/home');
                console.log('Blog deleted successfully');
            } else {
                console.error('Error deleting blog:', await response.text());
            }
        } catch (error) {
            console.error('Request failed:', error);
        }
    };

    
    const handlePostComment = async () => {
        if (commentUserName && comment) {
            const token = localStorage.getItem('token');
            const blogId = blogData.id; 
    
            try {
                const response = await fetch(`http://localhost:5003/api/bloggercomment/comments`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ blogId, userName: commentUserName, comment }),
                });
    
                if (response.ok) {
                    const newComment = await response.json();
                    setStoreComments([...storeComments, newComment]); // Add the new comment to the state
                    setCommentUserName(""); 
                    setComment("");
                } else {
                    setCommentError("Failed to post comment.");
                }
            } catch (error) {
                console.error('Error posting comment:', error);
            }
        } else {
            setCommentError("Please enter both name and comment.");
        }
    };


    const fetchComments = async () => {
        const token = localStorage.getItem('token');
        const blogId = blogData.id; 
        try {
            const response = await fetch(`http://localhost:5003/api/bloggercomment/comments/${blogId}`, {
                method: "GET",
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const comments = await response.json();
                setStoreComments(comments); 
            } else {
                console.error("Failed to fetch comments.");
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    
    useEffect(() => {
        if (blogData) {
            fetchComments(); 
        }
    }, [blogData]);




    return(
        <section className="blog-page-container">        
            {fetchError && <p className="error-message">{fetchError}</p>}
            {blogData? (
                <div>
                    <div className="banner">
                        <img src={`http://localhost:5003/uploads/${blogData.banner_image}`} alt="Blog Banner" /> 
                    </div>

                    <div className="blogss">
                        <h1 className="blog-page-title">{blogData.title || "Untitled Blog"}</h1>
                        <p className="blog-published">
                            <span>Posted on:- </span>
                            {blogData.created_at ? new Date(blogData.created_at).toLocaleDateString() : "Unknown Date"}
                        </p>

                        <br/><p className="highlighted-reading-time">
                            <i className="fas fa-clock" style={{ marginRight: '5px', fontSize: '15px' }}></i>
                            You have read this blog for: {readingTime} minute{readingTime !== 1 ? 's' : ''}
                        </p><br/>                        
                    
                        <div className="blog-page-article" dangerouslySetInnerHTML={{ __html: blogData.content || "No content available" }}></div>
                    </div>

                    <div className="blog-actions">
                        {blogData?.email === localStorage.getItem('email') && (
                            <>
                                <button className="edit-btn" onClick={() => navigate(`/makeablog/${blogData.id}`)}> Edit </button>
                                <button className="delete-btn" onClick={handleDeleteBlog}> Delete </button>
                            </>
                        )}
                    </div>



            <section className="Commentss">
                <div className="comment_section">
                    <div className="head"><h2>What’s on your mind?</h2></div>
                    <div><span id="noComment">{storeComments.length} </span>Comments</div>
                    <div className="text">Hearing from you makes our day!</div>
                    
                    <div className="commentbox">
                        <img src={userProfileComment} alt="User Picture" id="commentImg"/>
                        <div className="content">
                            <h3> Express as:</h3>
                            <input 
                                type="text" 
                                placeholder="Enter your name" 
                                className="userName"
                                value={commentUserName}
                                readOnly 
                            />

                            <div className="commentInput">
                                <input 
                                    type="text" 
                                    placeholder="Enter comment" 
                                    className="userComment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />

                                {commentError && <p className="error-message">{commentError}</p>}


                                <div className="buttons">
                                    <button type="button" id="post" onClick={handlePostComment}>Post</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="comment">
                    {storeComments.map((item, index) => (
                    <div key={index} className="commentItem">
                        <p>
                            <strong>{item.user_name}:</strong> 
                            <br/> 
                            {item.comment}
                        </p>
                    </div>
                    ))}
                </div>
            </section> 
            </div>
        ) : (
            <p>Loading blog...</p>
        )}

        </section>

    );
}

export default BlogPage;