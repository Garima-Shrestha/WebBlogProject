import React from "react";
import '../css/FooterSection.css';

const FooterSection = () => {
    return (
        <section className="footer">
            <div className="footer-content">
                <div className="copyright">
                    <p>&copy; 2024 NabinKitab. All rights reserved.</p>
                    <p className="moto"> Innovate, Inspire, Inform</p>
                    <p className="tagline">Your gateway to knowledge.</p>
                </div>
            </div>
        </section>
    );
}

export default FooterSection;