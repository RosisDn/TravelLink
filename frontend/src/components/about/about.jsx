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
                <h2 className="about-heading">Travellink - a company built on foreshadowing cats and shrimps?</h2>
                <p className="about-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc turpis turpis, gravida vitae hendrerit quis, luctus et nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum ultrices nisi metus, commodo venenatis elit posuere ut. Praesent eu efficitur nibh. Nulla condimentum tristique ex. Duis id massa facilisis, imperdiet mauris at, aliquam arcu. Vivamus consectetur ullamcorper diam vel sagittis. Nulla eget dolor at quam tempus accumsan. Mauris finibus ante non nibh cursus tristique scelerisque quis ipsum. Integer id erat consequat, venenatis enim nec, efficitur libero.
                </p>
                <div className='about-image-wrapper'>
                    <img src='devMia.jpg' alt='image-mia' className='about-image'/>
                    <p className='wrapper-image-text'>Dev 1 - the nonchalant (hisses at strangers)</p>
                </div>
                <p className="about-text">
                Etiam sed fringilla sapien, quis pharetra arcu. Ut in nisl mattis, consectetur nulla ut, interdum orci. Nulla a est non dolor rutrum tempus vel ut felis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque iaculis nisi ac eros tempor euismod. Etiam vulputate dictum nisl vitae pretium. Fusce sit amet ornare nunc. Nam vulputate eros sed quam fringilla, eget rutrum justo ultricies. Curabitur ut condimentum nibh, vel fringilla mauris. Nullam justo nisi, blandit eget augue scelerisque, consequat auctor neque. Curabitur lacinia luctus neque, a ornare diam porta id.
                </p>
                <div className='about-image-wrapper'>
                    <img src='devZoe.jpg' alt='image-mia' className='about-image' style={{objectPosition: "center 15%"}}/>
                    <p className='wrapper-image-text'>Dev 2 - the adventurous (bites hand if snacks)</p>
                </div>
                <p className="about-text">
                Praesent ullamcorper aliquam enim, non molestie dolor interdum vitae. Donec euismod sollicitudin ullamcorper. Etiam bibendum elit dui, sed imperdiet leo commodo quis. Duis at risus sit amet lorem faucibus vehicula quis laoreet ipsum. Cras vitae elementum quam. Nunc feugiat fringilla orci. Ut et placerat leo. Cras tristique gravida dolor eget imperdiet. Sed facilisis massa gravida, gravida velit ut, finibus nisl. Nulla luctus augue dui, non tempor nibh varius non. Sed porta odio eu ligula tempus accumsan. Nullam malesuada vulputate erat vitae ultrices. Nullam volutpat, velit feugiat sagittis commodo, dui diam efficitur purus, ac fermentum augue nisl vel enim. Mauris mollis, eros sed bibendum lobortis, nisi magna tristique justo, dictum facilisis ex nulla vitae tellus. Nam nec eleifend nunc. Praesent pulvinar sapien quis ex euismod, a feugiat diam congue.
                </p>
                <div className='about-image-wrapper'>
                    <img src='devGoldie.jpg' alt='image-goldie' className='about-image' style={{objectPosition: "center 55%"}}/>
                    <p className='wrapper-image-text'>Dev 3 - well...the orange one (the kind of orange cat behaviour you would expect)</p>
                </div>

            </div>

            {/* video */}
            <div className="glass-card about-card">
                <h2 className="about-heading">Take a peak into what it's really going on inside the developer's mind. [Warning - Emotional]</h2>


                {/* knapp för visa videon */}
                {!showVideo ? (
                    <button className="video-btn" onClick={() => setShowVideo(true)}>
                        <div className="video-thumbnail">
                            <div className="play-icon">▶</div>
                            <p className="video-label">Click to suffer</p>
                        </div>
                    </button>
                ) : (
                    // videon visas när man klickat
                    <div className="about-video">
                        <iframe
                            src="https://www.youtube.com/embed/u4ecB57jFhI?autoplay=1"
                            title="Travellink inspirational video"
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