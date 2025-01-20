import React, {useState} from "react"
import '../css/BlogPage.css'

import userProfileComment from '../../images/comment.png'


const BlogPage = () => {
    const[commentUserName, setCommentUserName]=useState("");
    const[comment, setComment]=useState("");
    const [storeComments, setStoreComments] = useState([]); // State to store all comments
    

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
         <div className="banner"></div>

         <div className="blogss">
            <h1 className="blog-page-title"></h1>
            <p className="blog-published"><span>Posted on:- </span></p>
            <div className="blog-page-article">
                
            </div>
         </div>

        <h1 className="sub-heading">Read more</h1>




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

        </section>

    );
}

export default BlogPage;