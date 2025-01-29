import React, { useState, useRef } from "react";

import '../css/MakeABlog.css'
import updoad from '../../images/upload.jpg'

const MakeABlogPage = () => {

    const [banner, setBanner] = useState(null); 
    const [blogTitle, setBlogTitle] = useState(""); 
    const editorRef = useRef(null); 


    const handleBannerUpload = (e) => {
        const file = e.target.files[0];                //Access the first file in the file input.
        if (file) {
            setBanner(URL.createObjectURL(file));      // Create a temporary URL to display the uploaded file.
        }
    };


    const handlePublish = () => {
        console.log("Published Blog:", {
            title: blogTitle,
            article: editorRef.current.innerHTML,
            bannerImage: banner,
        });
    };




  // Execute formatting commands
  const formatText = (command, value = null) => {
    if (command === "insertImage") {
      const url = prompt("Enter the image URL:");
      if (url) document.execCommand(command, false, url);
    } else if (command === "createLink") {
      const url = prompt("Enter the link URL:");
      if (url) document.execCommand(command, false, url);
    } else {
      document.execCommand(command, false, value);
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


                <div className="contentOutput" contentEditable="true"  ref={editorRef}></div>

                {/* <div className="floating-button"><i className="fa fa-expand-arrows-alt" aria-hidden="true"></i></div> */}
            </div>



            <div className="publish-container"> 
                <button className="btn publish-btn" onClick={handlePublish}>Publish</button> 
            </div>


        </section>
    )
}

export default MakeABlogPage;