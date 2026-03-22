// little documentation guide as we have not used react before -- check for the commented ZONES

// ZONE 1 -- imports similar to C++
import React from "react";
import { useNavigate } from "react-router-dom";
import BookingForm from "../common/BookingForm";
import './home.css';

// everything goes in the main App function
function Home() {
  // ZONE 2 -- Logic & State || variables & methods -- like the methods used to fetch or write info from/to the server goes here
  // important as fuck -- every relationship between variable updated --> by method HAS TO BE under a useState
  // useState is basically a very sensible method which redraws the screen based on if any changes happens

    // only uses the logic to define the new imported module, defining navigate
    const navigate = useNavigate();

    const handleSearch = (results, searchParams) => {
        navigate('/search', {
            state: {
                results: results,
                searchParams: searchParams
            }
        });
    };

    return (
<>
    {/* ZONE 3 -- here is where the HTML is store, this zone is the "Render on page space"
    Reformed the way this page works.
    There is still the search form, but instead of having it here we import it from its module version
    */}

    <div className="hero-section">
            <h1 className="hero-title">Discover Your Next Adventure</h1>
    </div>

    <div className="booking-container">
                <div className="booking-card">
                    <h2 className="booking-title">Find Your Destination</h2>
                    {/* No initialData here — form starts blank on the landing page */}
                    <BookingForm onSearch={handleSearch} />
                </div>
    </div>


    {/*Suggested Destinations*/}
    <div className="destinations-section">
        <h2 className="section-title">Popular Destinations
        <p style={{fontSize: "20px"}}>Check our Inspiration page for more!</p>
        </h2>

        <div className="destinations-grid">
            <div className="destination-card">
                <div className="destination-image">
                    <img src="stockholm.jpg" alt="Stockholm"/>
                    <div className="destination-overlay">
                        <h3 className="destination-name">Stockholm</h3>
                        <p className="destination-country">Sweden</p>
                    </div>
                </div>
            </div>

            <div className="destination-card">
                <div className="destination-image">
                    <img src="london.jpg" alt="London"/>
                    <div className="destination-overlay">
                        <h3 className="destination-name">London</h3>
                        <p className="destination-country">United Kingdom</p>
                    </div>
                </div>
            </div>

            <div className="destination-card">
                <div className="destination-image">
                    <img src="göteborg.jpg" alt="Gothenburg"/>
                    <div className="destination-overlay">
                        <h3 className="destination-name">Gothenburg</h3>
                        <p className="destination-country">Sweden</p>
                    </div>
                </div>
            </div>

            <div className="destination-card">
                <div className="destination-image">
                    <img src="oslo.jpg" alt="Oslo"/>
                    <div className="destination-overlay">
                        <h3 className="destination-name">Oslo</h3>
                        <p className="destination-country">Norway</p>
                    </div>
                </div>
            </div>

            <div className="destination-card">
                <div className="destination-image">
                    <img src="copenhagen.jpg" alt="Copenhagen"/>
                    <div className="destination-overlay">
                        <h3 className="destination-name">Copenhagen</h3>
                        <p className="destination-country">Denmark</p>
                    </div>
                </div>
            </div>

            <div className="destination-card">
                <div className="destination-image">
                    <img src="paris.jpg" alt="Paris"/>
                    <div className="destination-overlay">
                        <h3 className="destination-name">Paris</h3>
                        <p className="destination-country">France</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</>
)}

// ZONE 4
export default Home;