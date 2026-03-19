// little documentation guide as we have not used react before -- check for the commented ZONES

// ZONE 1 -- imports similar to C++
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './components/home/home';
import Search from './components/search/search';
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
            */}
            <div
                className='app-background'
                style={{
                    backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                    backgroundBlendMode: "multiply",
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
                            <button className="user-button">
                                <NavLink to="/account" onClick={() => setIsMenuOpen(false)}>
                                <Icon.User />
                                </NavLink>
                            </button>
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
                        <Route path="/search" element={<Search />} /> {/*as a redirection, it still has be to added here on the Routes*/}
                        <Route path="/inspiration" element={<Inspiration />} />
                        <Route path="/helpcenter" element={<HelpCenter />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/account" element={<Account />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
export default App;