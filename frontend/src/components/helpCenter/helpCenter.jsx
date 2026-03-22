import React from 'react'
import './helpCenter.css'
import * as Icon from '../../icons'

function HelpCenter() {
  // example for icon
  // <h1><Icon.HelpCircle /> Help Center</h1>
  return (
  <>
    <div className="help-hero">
        <h1 className="hero-title">Contact Us</h1>
    </div>

    <div className="help-content">
        <div className="glass-card">
            <form className="contact-form" id="contactForm">
                <div className="form-row">
                    <div className="form-group">
                        <input type="text" className="form-input" id="userName" placeholder="Name *" required/>
                    </div>
                    <div className="form-group">
                        <input type="email" className="form-input" id="userEmail" placeholder="Email *" required/>
                    </div>
                </div>

                <div className="form-group">
                    <input type="text" className="form-input" id="messageSubject" placeholder="Subject *" required/>
                </div>

                <div className="form-group">
                    <textarea className="form-textarea" id="messageText" rows="6" placeholder="Your message *" required></textarea>
                </div>

                <button type="submit" className="submit-button">
                    <span>Send Message</span>
                    <i data-lucide="arrow-right"></i>
                </button>
            </form>
        </div>

        <div className="contact-options">
            <div className="option-item">
                <Icon.Mail />
                <span>hotleons.kennedy@umbrella.com</span>
            </div>
            <div className="option-item">
                <Icon.Phone />
                <span>+676767676767</span>
            </div>
        </div>
    </div>
    </>
  )
}

export default HelpCenter