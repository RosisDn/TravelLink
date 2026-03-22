import React, { useState } from 'react';
import { DestinationCard, DestinationModal } from '../common/DestinationCard';
import destinations from '../common/destinationsData';
import './inspiration.css';

function Inspiration() {
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState('');

    const filtered = destinations.filter(dest =>
        dest.name.toLowerCase().includes(search.toLowerCase()) ||
        dest.country.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="inspiration-wrapper">

            <div className="search-bar-container">
                <div className="search-bar">
                    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search destinations"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="search-input"
                    />
                    {search && (
                        <button className="search-clear" onClick={() => setSearch('')}>✕</button>
                    )}
                </div>
            </div>

            {filtered.length === 0 && (
                <p className="no-results">No destinations found for "{search}".</p>
            )}

            <div className="destinations-grid">
                {filtered.map(dest => (
                    <DestinationCard
                        key={dest.id}
                        dest={dest}
                        onOpen={setSelected}
                    />
                ))}
            </div>

            {selected && (
                <DestinationModal
                    dest={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
}

export default Inspiration;