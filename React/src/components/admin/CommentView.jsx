import React, { useState, useEffect } from "react";
import '../css/CommentView.css';

const CommentViewPage = () => {
    const [comments, setComments] = useState([]); 
    const [fetchError, setFetchError] = useState('');
    const [selectedComment, setSelectedComment] = useState(null);
    const [selectedCommentText, setSelectedCommentText] = useState(''); 
    

    useEffect(() => {
        const fetchComments = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`http://localhost:5003/api/bloggercomment/admin/comments`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setComments(data); 
                } else {
                    setFetchError("Failed to fetch comments.");
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
                setFetchError("An error occurred while fetching comments.");
            }
        };

        fetchComments();
    }, []);


    const handleRowClick = (comment) => {
        setSelectedComment(comment.id); 
        setSelectedCommentText(comment.comment); 
    };


    const deleteComment = async () => {
        if (!selectedComment) return;

        const isConfirmed = window.confirm(`Are you sure you want to delete the comment:   "${selectedCommentText}"?`);
        if (!isConfirmed) {
            return; 
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5003/api/bloggercomment/admin/delete/${selectedComment}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Remove the deleted comment from the state
                setComments(comments.filter(comment => comment.id !== selectedComment));
                setSelectedComment(null); // Reset selected comment
            } else {
                console.error('Failed to delete comment:', await response.text());
            }
            
        } catch (error) {
            console.error('Error deleting comment:', error);
        }

    };




    return (
        <section className="comment-view-page">
            <h1>Admin Comment View</h1>
            {fetchError && <p className="error-message">{fetchError}</p>}
            <div className="comment-table-list">
                <table>
                    <thead>
                        <tr>
                            <th>Comment ID</th>
                            <th>Blog Title</th>
                            <th>Username</th>
                            <th>Comment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.map((comment) => (
                            <tr key={comment.id}
                                onClick={() => handleRowClick(comment)}
                                className={selectedComment === comment.id ? 'selected-row' : ''}
                            >
                                <td>{comment.id}</td>
                                <td>{comment.blog_title}</td>
                                <td>{comment.user_name}</td>
                                <td>{comment.comment}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="delete-button">
                    <button onClick={deleteComment}>Delete</button>
            </div>
        </section>
    );
};

export default CommentViewPage;