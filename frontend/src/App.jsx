// little documentation guide as we have not used react before -- check for the commented ZONES

// ZONE 1 -- imports similar to C++
import { useState } from 'react'
import './App.css'

// everything goes in the main App function
function App() {
  // ZONE 2 -- Logic & State || variables & methods -- like the methods used to fetch or write info from/to the server goes here
  // important as fuck -- every relationship between variable updated --> by method HAS TO BE under a useState
  // useState is basically a very sensible method which redraws the screen based on if any changes happens

    // keep the parameters for the search API link call needed for data manipulation on server level
    const [formData, setFormData] = useState({
        origin: "",
        destination: "",
        departure_date: "",
        transport_type: "plane" // default value
    });

    // Setter function, keeps data fields and updates the specific fields the user changes on the form
    // Does not allow the user to generate search links without all the required parameters filled
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // has to set back the search button to enabled when the user starts typing, as the fill the required fields
        if (error) setError("");
    };

    // run the search in the date base & and assure all required fields are filled before sending the API request
    const [error, setError] = useState("");

    const runSearch = async (e) => {
        e.preventDefault();

        // validating fields
        if (!formData.origin.trim() || !formData.destination.trim()) {
            setError("Please fill in all fields in order to search.");
            return;
        }
        // if not triggered or new attempt with required fields filled --> message cleared:
        setError("");

        // constructing URL routes based on user input
        const query = new URLSearchParams(formData).toString();
        // very picky here, must always include the protocol, will NOT work otherwise
        const finalURL = `https://api.andreiradxa.online/api/search?${query}`
        console.log("Testing, fetching data from " + finalURL)

        // API call and data fetch
        try {
            const response = await fetch(finalURL);

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Database connection -- OK.");
            console.log("Displaying fetched information:");
            console.table(data);

        } catch (err) {
            console.error("Database connection failed: ", err.message);
            setError("Could  not connect to the database. The backend server is just a little home-lab server -- it might be offline or intentionally turned off.")
        }
    };

    return (
<>
    {/* ZONE 3 -- here is where the HTML is store, this zone is the "Render on page space" */}
    {/* Header */}
    <header className="header">
        <div className="header-content">
            <div className="logo">
                <img src="logo.png" alt="Logo" style={{ width: '3rem', height: '3rem' }} />
                <span className="logo-text">TravelLink</span>
            </div>
            <nav className="nav">
                <a href="#" className="nav-link">HOME</a>
                <a href="#" className="nav-link">INSPIRATION</a>
                <a href="#" className="nav-link">HELP CENTER</a>
                <a href="#" className="nav-link">ABOUT</a>
            </nav>
            <button className="user-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
            </button>
        </div>
    </header>


    <div className="hero-section">
        <div className="hero-text">
            <h1 className="hero-title">Discover Your Next Adventure</h1>
        </div>
    </div>

    <div className="container">
        <div className="booking-card">
            <h2 className="title">Find Your Destination</h2>
            <form className="form" onSubmit={runSearch}>
                <div className="form-grid">
                    <div className="input-group">
                        <label>From</label>
                        <div className="input-box">
                            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            </svg>
                            {/*Input with autocompletion, sends arguments to route link parameters */}
                            <input
                                type="text"
                                className=''
                                placeholder='I will travel from...'
                                value={formData.origin}
                                onChange={(e) => handleInputChange('origin', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>To</label>
                        <div className="input-box">
                            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            </svg>
                            <input
                                type="text"
                                className=''
                                placeholder='I will travel to...'
                                value={formData.destination}
                                onChange={(e) => handleInputChange('destination', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Departure</label>
                        <div className="input-box">
                            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <input
                                type='date'
                                value={formData.departure_date}
                                onChange={(e) => handleInputChange('departure_date', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Return</label>
                        <div className="input-box">
                            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <input type="date"/>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Travelers</label>
                        <div className="input-box">
                            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                            <select>
                                <option>1 Traveler</option>
                                <option>2 Travelers</option>
                                <option>3 Travelers</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Transportation</label>
                        <div className="input-box">
                            <select
                            value={formData.transport_type}
                            onChange={(e) => handleInputChange('transport_type', e.target.value)}
                                >
                                <option value="plane">Plane</option>
                                <option value="bus">Bus</option>
                                <option value="train">Train</option>
                            </select>
                        </div>
                    </div>
                </div>
                {/*UI error message in when required fields in the form are not filled in*/}
                {error &&  (
                    <p style={{ color: '#ff4d4d', fontSize: '0.8rem', margin: '1rem 0 1rem 0', textAlign: 'center'}}>
                        {error}
                    </p>
                )}

                <button
                type="submit"
                className="search-btn"
                // Made to enforce search rules to not break the API link generation
                disabled={error !== ""} // Will disabled the button in case the user triggers the field error, it ENFORCES that the search rules are respected in order to proceed further
                style={{
                    cursor: error ? 'not-allowed' : 'pointer',
                    opacity: error ? 0.5 : 1
                }}
                >
                    Search
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                </button>
            </form>
        </div>
    </div>

     {/*  Destinations  */}
    <div className="destinations-section">
        <div className="destinations-container">
            <h2 className="destinations-title">Popular Destinations</h2>
            <div className="destinations-grid">
                {/* Tokyo */}
                <div className="destination-card">
                    <div className="destination-image" style={{ backgroundImage: "url('katt.jpg')" }}></div>
                    <div className="destination-info">
                        <div className="destination-country">JAPAN</div>
                        <div className="destination-city">Tokyo</div>
                        <div className="destination-details">
                            {/* little mention here -- lets keep the main version of the website in english */}
                            Book from 12th to 26th of Match<br/>
                            Economy class Tur- and re-Turn route
                        </div>
                        <div className="destination-price">from SEK ...</div>
                    </div>
                </div>

                {/* Bengaluru */}
                <div className="destination-card">
                    <div className="destination-image" style={{ backgroundImage: "url('katt.jpg')" }}></div>
                    <div className="destination-info">
                        <div className="destination-country">SCHWEIZ</div>
                        <div className="destination-city">Bern</div>
                        <div className="destination-details">
                            Book <br/>

                        </div>
                        <div className="destination-price">from SEk ....
                        </div>
                    </div>
                </div>

                {/* Bangkok */}
                <div className="destination-card">
                    <div className="destination-image" style={{ backgroundImage: "url('katt.jpg')" }}></div>
                    <div className="destination-info">
                        <div className="destination-country">THAILAND</div>
                        <div className="destination-city">Bangkok</div>
                        <div className="destination-details">
                            Book<br/>

                        </div>
                        <div className="destination-price">from SEK ...</div>
                    </div>
                </div>

                {/* Dubai */}
                <div className="destination-card">
                    <div className="destination-image" style={{ backgroundImage: "url('katt.jpg')" }}></div>
                    <div className="destination-info">
                        <div className="destination-country">Norge</div>
                        <div className="destination-city">Oslo</div>
                        <div className="destination-details">
                            Book <br/>

                        </div>
                        <div className="destination-price">from SEK ....</div>
                    </div>
                </div>

                {/* Colombo */}
                <div className="destination-card">
                    <div className="destination-image" style={{ backgroundImage: "url('katt.jpg')" }}></div>
                    <div className="destination-info">
                        <div className="destination-country">SRI LANKA</div>
                        <div className="destination-city">Colombo</div>
                        <div className="destination-details">
                            Book ....<br/>
                        </div>
                        <div className="destination-price">from SEK ...</div>
                    </div>
                </div>

                {/* Mauritius */}
                <div className="destination-card">
                    <div className="destination-image" style={{ backgroundImage: "url('katt.jpg')" }}></div>
                    <div className="destination-info">
                        <div className="destination-country">Sweden</div>
                        <div className="destination-city">Stockhol</div>
                        <div className="destination-details">
                            Book <br/>

                        </div>
                        <div className="destination-price">from SEK ....</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</> )}

// ZONE 4
export default App
