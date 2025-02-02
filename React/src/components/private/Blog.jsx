import React, {useState, useEffect} from "react"
import '../css/BlogPage.css'
import { useNavigate } from 'react-router-dom';

import userProfileComment from '../../images/comment.png'


const BlogPage = () => {
    const[commentUserName, setCommentUserName]=useState("");
    const[comment, setComment]=useState("");
    const [storeComments, setStoreComments] = useState([]); // State to store all comments
    const [blogData, setBlogData] = useState(null); 

    const navigate = useNavigate();

    useEffect(() => {
        const storedBlog = localStorage.getItem("publishedBlog");
        if (storedBlog) {
            try {
                const parsedBlog = JSON.parse(storedBlog);
                console.log(parsedBlog);
                setBlogData(parsedBlog);
            } catch (error) {
                console.error('Failed to parse blog data:', error);
            }
        } else {
            console.error('No blog data found in localStorage');
        }
    }, []);    



    const handleDeleteBlog = async () => {
        const isConfirmed = window.confirm("Are you sure you want to delete this blog?");
        if (!isConfirmed) {
            return; // Exit the function if the user cancels the deletion
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert("You are not authenticated. Please log in.");
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
                navigate('/blog'); // Redirect to the blog list or home page
                console.log('Blog deleted successfully');
            } else {
                console.error('Error deleting blog:', await response.text());
            }
        } catch (error) {
            console.error('Request failed:', error);
        }
    };
    


    const handlePostComment = () => {
        if (commentUserName && comment) {
          setStoreComments([...storeComments, { name: commentUserName, comment: comment }]);
          setCommentUserName(""); 
          setComment("");
        } else {
          alert("Please enter both name and comment.");
        }
      };

    return(
        <section className="blog-page-container">        
            {blogData? (
                <div>
                    <div className="banner">
                        <img src={blogData.banner_image} alt="Blog Banner" />
                    </div>

                    <div className="blogss">
                        <h1 className="blog-page-title">{blogData.title || "Untitled Blog"}</h1>
                        <p className="blog-published">
                            <span>Posted on:- </span>
                            {blogData.created_at ? new Date(blogData.created_at).toLocaleDateString() : "Unknown Date"}
                        </p>
                        <div className="blog-page-article" dangerouslySetInnerHTML={{ __html: blogData.content || "No content available" }}></div>
                    </div>


                    <h1 className="sub-heading">Read more</h1>



                    <div className="blog-actions">
                        <button className="edit-btn" onClick={() => navigate(`/makeablog/${blogData.id}`)}> Edit </button>
                        <button className="delete-btn" onClick={handleDeleteBlog}> Delete </button>
                    </div>



            <section className="Commentss">
                <div className="comment_section">
                    <div className="head"><h2>What’s on your mind?</h2></div>
                    <div><span id="noComment">{storeComments.length} </span>Comments</div>
                    <div className="text">Hearing from you makes our day!</div>

                    {/* <div className="comment">
                        {storeComments.map((item, index) => (
                        <div key={index} className="commentItem">
                            <p><strong>{item.name}:</strong> {item.comment}</p>
                        </div>
                        ))}
                    </div> */}
                    
                    <div className="commentbox">
                        <img src={userProfileComment} alt="User Picture" id="commentImg"/>
                        <div className="content">
                            <h3> Express as:</h3>
                            <input 
                                type="text" 
                                placeholder="Enter your name" 
                                className="userName"
                                value={commentUserName}
                                onChange={(e) => setCommentUserName(e.target.value)}
                            />

                            <div className="commentInput">
                                <input 
                                    type="text" 
                                    placeholder="Enter comment" 
                                    className="userComment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />

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
                        <p><strong>{item.name}:</strong> {item.comment}</p>
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