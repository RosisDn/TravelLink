// little documentation guide as we have not used react before -- check for the commented ZONES

// ZONE 1 -- imports similar to C++
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './components/home/home';
import Search from './components/search/search';
import Booking from './components/common/Booking';
import Inspiration from './components/inspiration/inspiration';
import  HelpCenter from './components/helpCenter/helpCenter';
import About from './components/about/about';
import Account from './components/account/account';

import * as Icon from './icons';
// literally cannot resolve this with css, gonna import and use it from here
import backgroundImage from './assets/05.jpg';

// as the app scaled to multiple routes, the App.jsx is only used for the router function
function App() {

    // using states for hamburger menu
    const [isMenuOpen, setIsMenuOpen] = useState(false); // default before checking width
    // state for login
    const [user, setUser] = useState(null);

    // store log in data
    useEffect(() => {
        const saved = localStorage.getItem('travellink_user');
        if (saved) {
            try { setUser(JSON.parse(saved)); }
            catch { localStorage.removeItem('travellink_user'); }
        }
    }, []);
    // login logic
    const handleLogin = (userData) => {
        localStorage.setItem('travellink_user', JSON.stringify(userData));
        setUser(userData);
    };
    // logout -- nothing on the backend part -- the frontend just "looses" the logged in state
    const handleLogout = () => {
        localStorage.removeItem('travellink_user');
        setUser(null);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // create a reference point for the dom, clicking outside of it will close the menu
    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            // menu is opened, clicks outside of the dom
            if (isMenuOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !event.target.closest('.menu-toggle')) {
                    setIsMenuOpen(false);
                }
        };
        // listens when menu is opened
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        // clean up listener, action is turned on again if menu opened again
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);


    return (

        <Router>
            {/*The only object that stays here is the one repeating on each page - header with NAVBAR
            Will also wrap the whole body in the background image so that the path will always be resolved
            Footer will also have to go here, as it goes on every page.
            */}
            <div
                className='app-background'
                style={{
                    backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                    backgroundBlendMode: "multiply",
                    minHeight: "100vh"
            }}
                >
                <header className="header">
                    <div className="header-container">
                        <div className="header-logo">
                            <img src="the_logo.png" alt="TravelLink Logo" className="logo-image"/>
                            <span className="logo-text">TravelLink</span>
                        </div>

                        <nav ref={menuRef} className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
                            <NavLink to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>HOME</NavLink>
                            <NavLink to="/inspiration" className="nav-link" onClick={() => setIsMenuOpen(false)}>INSPIRATION</NavLink>
                            <NavLink to="/helpcenter" className="nav-link" onClick={() => setIsMenuOpen(false)}>SUPPORT</NavLink>
                            <NavLink to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>ABOUT</NavLink>
                        </nav>
                        {/*They need to be wrapped together for the right placement*/}
                        <div className='header-actions'>
                            {/*placement before the burger button, in order for layout*/}
                            <NavLink to="/account" onClick={() => setIsMenuOpen(false)}>
                                <button className={`user-button ${user ? 'logged-in' : ''}`}>
                                    <Icon.User />
                                </button>
                            </NavLink>
                            {/*burger -- only visible on phone width -- between menu and X*/}
                            <button className="menu-toggle" onClick={toggleMenu}>
                                {isMenuOpen ? <Icon.X size={32} /> : <Icon.Menu size={32} /> }
                            </button>
                        </div>
                    </div>
                </header>

                {/*Dynamic content - ROUTES - this is how the SPA switches pages*/}
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<Search user={user} />} /> {/*as a redirection, it still has be to added here on the Routes*/}
                        <Route path="/inspiration" element={<Inspiration />} />
                        <Route path="/helpcenter" element={<HelpCenter />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/booking" element={<Booking user={user} />} />
                        <Route
                            path="/account"
                            element={<Account user={user} onLogin={handleLogin} onLogout={handleLogout} />}
                        />
                    </Routes>
                </main>
                {/* --- Footer --------------- on every page --- */}
                <footer className="app-footer">
                    <img src='the_logo.png' alt='travellink_logo' className='footer-logo' />
                    <div className='footer-brand'>TravelLink</div>
                    <div className='footer-tagline'>Your journey starts here</div>
                    <div className='footer-divider' />
                    <div className='footer-copy'>© 2026 TravelLink - Andrei Bors | Yana Denisiuk | Julia Myjkowska</div>
                </footer>
            </div>
        </Router>
    );
}
export default App;