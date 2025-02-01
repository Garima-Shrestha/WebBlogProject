import React, { useState, useRef, useEffect } from "react";
import {useNavigate, useParams} from 'react-router-dom';

import '../css/MakeABlog.css'
import updoad from '../../images/upload.jpg'

const MakeABlogPage = () => {

    const [banner, setBanner] = useState(null); 
    const [blogTitle, setBlogTitle] = useState(""); 
    const [blogContent, setBlogContent] = useState(""); 
    const editorRef = useRef(null); 

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
                        setBlogTitle(data.title);
                        setBlogContent(data.content);
                        setBanner(data.bannerImage);  
                        editorRef.current.innerHTML = data.content;
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




    //yo code le banner ma chai image halna help garxa
    const handleBannerUpload = (e) => {
        const file = e.target.files[0];                //Access the first file in the file input.
        if (file) {
            setBanner(URL.createObjectURL(file));      // Create a temporary URL to display the uploaded file.
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
            if (url) document.execCommand(command, false, url);
        } else {
            document.execCommand(command, false, value);
        }
    };




  const handlePublish = async () => {
    const blogData = {
        title: blogTitle,
        content: editorRef.current.innerHTML,
        bannerImage: banner,
      };


    // Getting token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
        setSaveError("You are not authenticated. Please log in.");
        navigate('/login');
        return;
    }

    try {

        if(blogPageId){
            // Edit the existing blog
            const response = await fetch(`http://localhost:5003/api/createblog/makeblog/edit/${blogPageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(blogData),
            });

            const result = await response.json();
            if (response.ok) {
                // Reset the form if the blog is updated
                setBlogTitle('');
                setBlogContent('');
                setBanner(null);
                editorRef.current.innerHTML = '';
                navigate(`/blog`); // Redirect to the blog page after editing
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(blogData),
            });
        
            const result = await response.json();
            if (response.ok) {
                // Reset the form after the blog is created
                setBlogTitle('');
                setBlogContent('');
                setBanner(null);
                editorRef.current.innerHTML = '';
                navigate(`/blog`); // Redirect to the newly created blog page
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
                {banner && <img src={banner} alt="Banner" className="banner-uploaded-image" />}           {/* This line checks if the banner image exists (i.e., it has been uploaded). If true, it displays the banner image. */}
            </div>

            <div className="blog">
                <textarea
                    type="text"
                    className="title"
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



            <div className="publish-container"> 
                <button className="btn publish-btn" onClick={handlePublish}>Publish</button> 
            </div>


        </section>
    )
}

export default MakeABlogPage;