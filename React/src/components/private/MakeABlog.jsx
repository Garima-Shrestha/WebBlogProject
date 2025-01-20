import React, { useState } from "react";

import '../css/MakeABlog.css'
import updoad from '../../images/upload.jpg'

const MakeABlogPage = () => {

    const [banner, setBanner] = useState(null); 
    const [articleImage, setArticleImage] = useState(null);  
    const [blogTitle, setBlogTitle] = useState(""); 
    const [articleText, setArticleText] = useState(""); 


    const handleBannerUpload = (e) => {
        const file = e.target.files[0];                //Access the first file in the file input.
        if (file) {
            setBanner(URL.createObjectURL(file));      // Create a temporary URL to display the uploaded file.
        }
    };

    const handleArticleImageUpload = (e) => {
        const file = e.target.files[0];                
        if (file) {
            setArticleImage(URL.createObjectURL(file)); 
        }
    };


    const handlePublish = () => {
        console.log("Published Blog:", {
            title: blogTitle,
            article: articleText,
            bannerImage: banner,
            articleImage: articleImage
        });
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

                <div className="article-container">
                {articleImage && <img src={articleImage} alt="Article" className="article-uploaded-image" />}
                    <textarea
                        type="text"
                        className="article"
                        placeholder="Share your thoughts..."
                        onChange={(e) => setArticleText(e.target.value)}
                    />

                    
                </div>
            </div>

            <div className="blog-options">
                <button className="btn publish-btn" onClick={handlePublish}>Publish</button>
                <input
                    type="file"
                    accept="image/*"
                    id="upload-image"
                    hidden
                    onChange={handleArticleImageUpload}
                />
                <label htmlFor="upload-image" className="btn upload-img-btn">Upload Images</label>
            </div>
        </section>
    )
}

export default MakeABlogPage;