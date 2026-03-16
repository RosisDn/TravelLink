import React from 'react'
import './inspiration.css'
import * as Icon from '../../icons'

function Inspiration() {
  return (
    <div className="inspiration-content">

        <div className="glass-card">
            <h2 className="section-heading">Design & Resources</h2>

            <div className="resource-list">
                <div className="resource-item">
                    <div className="resource-icon">
                        <i data-lucide=""></i>
                    </div>
                    <div className="resource-info">
                        <h3></h3>
                        <p></p>
                    </div>
                </div>

                <div className="resource-item">
                    <div className="resource-icon">
                        <i data-lucide=""></i>
                    </div>
                    <div className="resource-info">
                        <h3>Lucide Icons</h3>
                        <p>icon library - <a href="https://lucide.dev" target="_blank">lucide.dev</a></p>
                    </div>
                </div>

                <div className="resource-item">
                    <div className="resource-icon">
                        <i data-lucide=""></i>
                    </div>
                    <div className="resource-info">
                        <h3></h3>
                        <p> <a href="" target="_blank"></a></p>
                    </div>
                </div>

                <div className="resource-item">
                    <div className="resource-icon">
                        <i data-lucide=""></i>
                    </div>
                    <div className="resource-info">
                        <h3></h3>
                        <p></p>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Inspiration