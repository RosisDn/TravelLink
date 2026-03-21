import React, { useState } from 'react'
import './about.css'

function About() {
    // håller koll på om videon visas
    const [showVideo, setShowVideo] = useState(false);

    return (
        <div className="about-wrapper">

            {/* rubrik */}
            <div className="about-hero">
                <h1 className="about-title">Our Story</h1>
                <p className="about-subtitle">How TravelLink came to life</p>
            </div>

            {/* text */}
            <div className="glass-card about-card">
                <h2 className="about-heading">Någon headline ?</h2>
                <p className="about-text">
                  Skriv texten här 

                </p>
                
            </div>

            {/* video */}
            <div className="glass-card about-card">
                <h2 className="about-heading">Company inspiration</h2>
               

                {/* knapp för visa videon */}
                {!showVideo ? (
                    <button className="video-btn" onClick={() => setShowVideo(true)}>
                        <div className="video-thumbnail">
                            <div className="play-icon">▶</div>
                            <p className="video-label">Click to watch</p>
                        </div>
                    </button>
                ) : (
                    // videon visas när man klickat
                    <div className="about-video">
                        <iframe
                            src="https://www.youtube.com/embed/u4ecB57jFhI?autoplay=1"
                            title="Travel video"
                            allowFullScreen
                            allow="autoplay"
                        />
                    </div>
                )}
            </div>

        </div>
    )
}

export default About