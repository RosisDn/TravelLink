// blueprint for destination cards on inspiration and home page
import React, { useEffect } from 'react';
import './DestinationCard.css';

// old model had a version for each of them, keeping it simple by just adding a block of text
const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse iaculis ligula vel enim sodales euismod. Suspendisse sit amet massa est. Sed fringilla nisl at est consequat gravida et et est. Integer id mattis quam. Ut lobortis dui eget ante volutpat tincidunt. Pellentesque sodales velit vel commodo vehicula. Aliquam a faucibus orci. Nullam a nibh rhoncus, efficitur magna a, iaculis magna. Phasellus et pretium libero. Quisque quis enim libero. Donec id est sit amet tellus accumsan congue nec eleifend sapien. Vestibulum ipsum orci, pellentesque et elit eget, feugiat pharetra felis. Proin semper nibh urna, at sollicitudin magna sollicitudin at. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum euismod accumsan diam, gravida venenatis lectus consequat ac. Praesent id magna nec ante suscipit malesuada.`;

// ── Modal ─────────────────────────────────────────────────────────────────────
function DestinationModal({ dest, onClose }) {
    // close on Escape key
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <div className="dest-modal-backdrop" onClick={onClose}>
            <div
                className="dest-modal-card"
                style={{ backgroundImage: `url(${dest.image})` }}
                onClick={e => e.stopPropagation()}
            >
                <button className="dest-modal-close" onClick={onClose}>✕</button>
                <div className="dest-modal-body">
                    <div className='dest-modal-glass'>
                        <h2 className="dest-modal-title">{dest.name}</h2>
                        <p className="dest-modal-country">{dest.country}</p>
                        <p className="dest-modal-description">{DESCRIPTION}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function DestinationCard({ dest, onOpen }) {
    return (
        <div className="dest-card" onClick={() => onOpen(dest)}>
            <div
                className="dest-card-image"
                style={{ backgroundImage: `url(${dest.image})` }}
            />
            <div className="dest-card-info">
                <h3 className="dest-card-name">{dest.name}</h3>
                <p className="dest-card-country">{dest.country}</p>
                <span className="dest-card-readmore">Read more →</span>
            </div>
        </div>
    );
}

export { DestinationCard, DestinationModal };