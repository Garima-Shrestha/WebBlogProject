import React, { useState, useRef, useEffect } from "react";
import {useNavigate, useParams} from 'react-router-dom';

import '../css/MakeABlog.css'
import updoad from '../../images/upload.jpg'

const MakeABlogPage = () => {

    const [blogTitle, setBlogTitle] = useState(""); 
    const [blogContent, setBlogContent] = useState(""); 
    const [saveError, setSaveError] = useState("");
    const [fetchError, setFetchError] = useState("");
    const editorRef = useRef(null); 
    const [bannerFile, setBannerFile] = useState(null); // For the file object
    const [bannerPreview, setBannerPreview] = useState(null); // For the preview URL
    const [existingBannerImagePath, setExistingBannerImagePath] = useState(''); // New state for existing image path


    const navigate = useNavigate();


    // Extract the blog ID from the URL parameters (this ID refers to the blogPage)
    const { blogPageId } = useParams();


    //if edit mode ma xa bhanye data lai fetch garne
    useEffect(()=>{
        if(blogPageId){

            const token = localStorage.getItem('token');
            if (!token) {
                setFetchError("You are not authenticated. Please log in.");
                navigate('/login');
                return;
            }

            const fetchBlogData = async () => {
                try{
                    const response = await fetch(`http://localhost:5003/api/createblog/makeblog/fetch/${blogPageId}`,{
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    const data = await response.json();
                    if (response.ok) {
                        const fetchedBlog = data.fetchBlog;  // Access the nested fetchBlog object
                        setBlogTitle(fetchedBlog.title || "");
                        setBlogContent(fetchedBlog.content || "");
                        setBannerPreview(`http://localhost:5003/uploads/${fetchedBlog.banner_image}`);
                        setExistingBannerImagePath(fetchedBlog.banner_image); 

                        if (editorRef.current) {
                            editorRef.current.innerHTML = fetchedBlog.content || "";
                        }

                    } else {
                        console.error('Error fetching blog data:', data.error);
                    }
                }catch (error) {
                    console.error('Request failed:', error);
                }
            };
            fetchBlogData();
        }
    }, [blogPageId]);




    const handleBannerUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setBannerFile(file);       // Store the file object
            setBannerPreview(URL.createObjectURL(file));
        } 
    };
    


    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = document.createElement('img');
                img.src = reader.result;
                img.style.maxWidth = '100%';
                editorRef.current.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    };

    const formatText = (command, value = null) => {
        if (command === "insertImage") {
            // Trigger the file input for image upload
            document.getElementById('image-upload').click();
        } else if (command === "createLink") {
            const url = prompt("Enter the link URL:");
            if (url) {
                const link = document.createElement('a');
                link.href = url;
                link.target = "_blank"; // Open in a new tab
                link.rel = "noopener noreferrer"; // Security measure
                link.innerText = url; // You can customize the link text if needed
                document.execCommand("insertHTML", false, link.outerHTML);
            }
        } else {
            document.execCommand(command, false, value);
        }
    };  




  const handlePublish = async () => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!token) {
        setSaveError("You are not authenticated. Please log in.");
        navigate('/login');
        return;
    }

    if (!email) {
        setSaveError("Email not found. Please log in again.");
        navigate('/login');
        return;
    }


    //validation
    if (!blogTitle || blogTitle.length < 1 || blogTitle.length > 100) {
        setSaveError('Title must be between 1 and 100 characters');
        return;
    }
    const content = editorRef.current.innerHTML;
    if (!content || content.trim() === '' || content === '<br>') {
        setSaveError('Content cannot be empty');
        return;
    }
    if (!bannerFile && !existingBannerImagePath) {
        setSaveError('Banner image is required');
        return;
    }


    const blogData = new FormData();     // Use FormData to send files
    blogData.append('title', blogTitle);
    blogData.append('content', editorRef.current.innerHTML);
    blogData.append('email', email);
    if (bannerFile) {
        blogData.append('imageFile', bannerFile); // Append the new file object
    } else {
        // Append the existing banner image path if available
        blogData.append('imageFile', `uploads/${existingBannerImagePath}`); // Use the existing image path
    }


    try {

        if(blogPageId){
            // Edit the existing blog
            const response = await fetch(`http://localhost:5003/api/createblog/makeblog/edit/${blogPageId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: blogData, // Send FormData
            });

            const result = await response.json();
            if (response.ok) {
                // Update localStorage with the updated blog data
                localStorage.setItem("publishedBlog", JSON.stringify(result.blog));
                localStorage.setItem("blogId", result.blog.id); // Store the blog ID if needed


                // Reset the form if the blog is updated
                setBlogTitle('');
                setBlogContent('');
                setBannerFile(null); 
                setBannerPreview(null); 


                editorRef.current.innerHTML = '';
                navigate(`/blog/${result.blog.id}`); // Redirect to the updated blog page
                console.log('Blog updated:', result);
            } else {
                console.error('Error updating blog:', result.error);
            }
        }
        else{   
            // Post lai add garna 
            const response = await fetch('http://localhost:5003/api/createblog/makeblog/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: blogData, // Send FormData
            });
        
            const result = await response.json();
            if (response.ok) {
                // Save the newly created blog to localStorage
                localStorage.setItem("publishedBlog", JSON.stringify(result.blog));
                localStorage.setItem("blogId", result.blog.id); // Store the blog ID if needed

                // Reset the form after the blog is created
                setBlogTitle('');
                setBlogContent('');
                setBannerFile(null); 
                setBannerPreview(null); 


                editorRef.current.innerHTML = '';
                navigate(`/blog/${result.blog.id}`); // Redirect to the newly created blog pagee
                console.log('Blog created:', result);
            } else {
                console.error('Error creating blog:', result.error);
            }
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
};



    return(
        <section className="make-blog-page">
            {fetchError && <p className="error-message">{fetchError}</p>}
            <div className="banner">
                <input
                    type="file"
                    accept="image/*"
                    id="banner-upload"
                    hidden
                    onChange={handleBannerUpload}
                />
                <label htmlFor ="banner-upload" className = "banner-upload-btn">
                    <img src={updoad} alt="upload banner"/>
                </label>
                {bannerPreview && <img src={bannerPreview} alt="Banner" className="banner-uploaded-image" />}     {/* This line checks if the banner image exists (i.e., it has been uploaded). If true, it displays the banner image. */}
            </div>

            <div className="blog">
                <textarea
                    type="text"
                    className="title"
                    value={blogTitle}
                    placeholder="What's the name of your blog?"
                    onChange={(e) => setBlogTitle(e.target.value)}
                />
            </div>


            
            <div className="text-editor-main">
            <div className="options">
                <button className="my-button-text" onClick={() => formatText('undo')}>
                    <i className="fas fa-undo"></i>
                </button>
                <button className="my-button-text" onClick={() => formatText('redo')}>
                    <i className="fas fa-redo"></i>
                </button>
                <button className="my-button-text" onClick={() => formatText('bold')}>
                    <i className="fas fa-bold"></i>
                </button>
                <button className="my-button-text" onClick={() => formatText('italic')}>
                    <i className="fas fa-italic"></i>
                </button>
                <button className="my-button-text" onClick={() => formatText('underline')}>
                    <i className="fas fa-underline"></i>
                </button>
                <button className="my-button-text" onClick={() => formatText('strikethrough')}>
                    <i className="fas fa-strikethrough"></i>
                </button>
                <button className="my-button-text" onClick={() => formatText('formatBlock', '<h1>')}>
                    H1
                </button>
                <button className="my-button-text" onClick={() => formatText('formatBlock', '<h2>')}>
                    H2
                </button>
                <button className="my-button-text" onClick={() => formatText('formatBlock', '<h3>')}>
                    H3
                </button>
                <button className="my-button-text" onClick={() => formatText('superscript')}>
                    <i className="fas fa-superscript"></i>
                </button>
                <button className="my-button-text" onClick={() => formatText('subscript')}>
                    <i className="fas fa-subscript"></i>
                </button>
                <button className="my-button-text" onClick={() => formatText('insertOrderedList')}>
                    <i className="fas fa-list-ol"></i>
                </button>
                <button className="my-button-text" onClick={() => formatText('insertUnorderedList')}>
                    <i className="fas fa-list-ul"></i>
                </button>
                <button className="my-button-text" onClick={() => formatText('justifyLeft')}>
                    <i className="fas fa-align-left"></i>
                </button>
                <button className="my-button-text" onClick={() => formatText('justifyRight')}>
                    <i className="fas fa-align-right"></i>
                </button>
                <button className="my-button-text" onClick={() => formatText('justifyCenter')}>
                    <i className="fas fa-align-center"></i>
                </button>
                <button className="my-button-text" onClick={() => formatText('justifyFull')}>
                    <i className="fas fa-align-justify"></i>
                </button>
                <button className="my-button-text" onClick={() => formatText('insertImage')}>
                    <i className="fas fa-images"></i>
                </button>
                <button className="my-button-text" onClick={() => formatText('createLink')}>
                    <i className="fas fa-link"></i>
                </button>
                <button className="my-button-text" onClick={() => formatText('formatBlock', '<blockquote>')}>
                    <i className="fas fa-quote-right"></i>
                </button>
                <button className="my-button-text" onClick={() => formatText('insertHTML', '<pre><code></code></pre>')}>
                    <i className="fas fa-code"></i>
                </button>
            </div>


            <input
                    type="file"
                    accept="image/*"
                    id="image-upload"
                    hidden
                    onChange={handleImageUpload}
            />

            <div className="contentOutput" contentEditable="true" ref={editorRef} dangerouslySetInnerHTML={{ __html: blogContent }} />


            {/* <div className="floating-button"><i className="fa fa-expand-arrows-alt" aria-hidden="true"></i></div> */}
            </div>


            {saveError && <p className="error-message">{saveError}</p>}<br/>

            <div className="publish-container"> 
                <button className="btn publish-btn" onClick={handlePublish}>
                    {blogPageId ? "Update" : "Publish"} 
                </button> 
            </div>


        </section>
    )
}

export default MakeABlogPage;