// little documentation guide as we have not used react before -- check for the commented ZONES

// ZONE 1 -- imports similar to C++
import React, { useState, useEffect } from "react";
import './home.css';
import * as Icon from '../../icons';

// everything goes in the main App function
function Home() {
  // ZONE 2 -- Logic & State || variables & methods -- like the methods used to fetch or write info from/to the server goes here
  // important as fuck -- every relationship between variable updated --> by method HAS TO BE under a useState
  // useState is basically a very sensible method which redraws the screen based on if any changes happens

    // First, fetch available locations for the autocomplete function of the form
    const [availableRoutes, setAvailableRoutes] = useState([]);
    const [uniqueOrigins, setUniqueOrigins] = useState([]);
    const [uniqueDestinations, setUniqueDestinations] = useState([]);

    // fetch routes to populate locations
    useEffect(() => {
        const fetchBaseData = async () => {
            try {
                const response = await fetch('https://api.andreiradxa.online/api/search?');
                const result = await response.json();

                if (result.success && result.data) {
                    setAvailableRoutes(result.data);

                    // only 1 instance of every location
                    const origins = [...new Set(result.data.map(r => r.origin))];
                    const destinations = [...new Set(result.data.map(r => r.destination))];

                    setUniqueOrigins(origins);
                    setUniqueDestinations(destinations);
                }
            } catch (err) {
                console.error("Failed to load location data: ", err);
            }
        };
        fetchBaseData();
    }, []);

    // validate origin & destination fields
    const validateAndClose = (field, value, list) => {
        // will wipe the date if it does not match what is in the list
        if (!list.includes(value)) {
            updateField(field, "");
        }
        setActiveDropdown(null);
    };

    // keep the parameters for the search API link call needed for data manipulation on server level
    const [formData, setFormData] = useState({
        origin: "",
        destination: "",
        departure_date: "",
        return_date: "",
        adults: 1,
        kids: 0,
        transport_type: "Flight" // default value
    });

    // toggle state for dropdown for each necessary fields
    // it all updates the input change as well as the previous did
    const [activeDropdown, setActiveDropdown] = useState(null); // default

    const [error, setError] = useState("");

    // update specific fields
    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value}));
        if (error) setError("");
    };

    // toggle dropdown
    const toggleDropdown = (name, e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setActiveDropdown(activeDropdown === name ? null : name);
    };


    const runSearch = async (e) => {
        if (e) e.preventDefault();

        // validation to fire a search
        const isOriginValid = uniqueOrigins.includes(formData.origin);
        const isDestValid = uniqueDestinations.includes(formData.destination);
        const isDateValid = formData.departure_date !== "";

        // validate fields
        if (!isOriginValid || !isDestValid || !isDateValid) {
            setError("Please fill in all the required fields in order to run a search.");
            return;
        }
        // validate origin !== destination
        if (formData.origin === formData.destination) {
            setError("Origin and Destination cannot be the same.");
            return;
        }
        setError(""); // assuming validation passed

        // want only the specific api parameters in the URL
        // the rest of the date will be handled by the front-end
        const apiParams = {
            origin: formData.origin,
            destination: formData.destination,
            departure_date: formData.departure_date,
            transport_type: formData.transport_type,
        };
        // constructing URL routes based on user input
        const query = new URLSearchParams(apiParams).toString();
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
    <div className="hero-section">
        <h1 className="hero-title">Discover Your Next Adventure</h1>
    </div>

    <div className="booking-container">
        <div className="booking-card">
            <h2 className="booking-title">Find Your Destination</h2>

            <form className="booking-form" id="bookingForm" onSubmit={runSearch}> {/*important to submit to the run, otherwise no URL*/}
                <div className="form-grid">

                    {/*Field - ORIGIN*/}
                    <div className="form-field">
                        <label className="form-label">*From</label>
                        <div className="input-wrapper">
                            <Icon.MapPin className="input-icon" />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search Origin..."
                                value={formData.origin}
                                onChange={(e) => updateField('origin', e.target.value)}
                                onFocus={() => setActiveDropdown('origin')}
                                onBlur={() => setTimeout(() => validateAndClose('origin', formData.origin, uniqueOrigins), 200)}
                            />

                            {activeDropdown === 'origin' && (
                                <div className="select-dropdown" style={{display: 'block'}}>
                                    <div className="select-list">
                                        {uniqueOrigins
                                            .filter(city => city.toLowerCase().includes(formData.origin.toLowerCase()))
                                            .map(city => (
                                                <div
                                                    key={city}
                                                    className="select-item"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault(); // Prevents the input from losing focus too early
                                                        updateField('origin', city);
                                                        setActiveDropdown(null);
                                                    }}
                                                >
                                                    <div className="select-item-city">{city}</div>
                                                    <div className="select-item-info">Location Available</div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/*Field - DESTINATION*/}
                    <div className="form-field">
                        <label className="form-label">*To</label>
                        <div className="input-wrapper">
                            <Icon.MapPin className="input-icon" />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search Destination..."
                                value={formData.destination}
                                onChange={(e) => updateField('destination', e.target.value)}
                                onFocus={() => setActiveDropdown('destination')}
                                onBlur={() => setTimeout(() => validateAndClose('destination', formData.origin, uniqueOrigins), 200)}
                            />

                            {activeDropdown === 'destination' && (
                                <div className="select-dropdown" style={{display: 'block'}}>
                                    <div className="select-list">
                                        {uniqueDestinations
                                            .filter(city => city.toLowerCase().includes(formData.destination.toLowerCase())
                                                && city !== formData.origin // destination !== origin
                                            )
                                            .map(city => (
                                                <div
                                                    key={city}
                                                    className="select-item"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault(); // Prevents the input from losing focus too early
                                                        updateField('destination', city);
                                                        setActiveDropdown(null);
                                                    }}
                                                >
                                                    <div className="select-item-city">{city}</div>
                                                    <div className="select-item-info">Location Available</div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                                {/*DEPARTURE DATE*/}
                    <div className="form-field">
                        <label className="form-label">*Departure</label>
                        <div className="input-wrapper">
                            <i data-lucide="calendar" className="input-icon"></i>
                            <div className="date-picker" id="departurePicker">
                                <button type="button" className="select-trigger">
                                    <span className="select-value placeholder">Select date</span>
                                    <i data-lucide="chevrons-up-down" className="select-chevron"></i>
                                </button>
                                <div className="date-dropdown" style={{display: "block"}}>
                                    <div className="date-header">
                                        <button type="button" className="date-nav" data-action="prev-month">
                                            <i data-lucide="chevron-left"></i>
                                        </button>
                                        <span className="date-month-year"></span>
                                        <button type="button" className="date-nav" data-action="next-month">
                                            <i data-lucide="chevron-right"></i>
                                        </button>
                                    </div>
                                    <div className="date-calendar"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                                {/*RETURN*/}
                    <div className="form-field">
                        <label className="form-label">Return</label>
                        <div className="input-wrapper">
                            <i data-lucide="calendar" className="input-icon"></i>
                            <div className="date-picker" id="returnPicker">
                                <button type="button" className="select-trigger">
                                    <span className="select-value placeholder">Select date</span>
                                    <i data-lucide="chevrons-up-down" className="select-chevron"></i>
                                </button>
                                <div className="date-dropdown" style={{display: "block"}}>
                                    <div className="date-header">
                                        <button type="button" className="date-nav" data-action="prev-month">
                                            <i data-lucide="chevron-left"></i>
                                        </button>
                                        <span className="date-month-year"></span>
                                        <button type="button" className="date-nav" data-action="next-month">
                                            <i data-lucide="chevron-right"></i>
                                        </button>
                                    </div>
                                    <div className="date-calendar"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                                {/*PASSENGERS*/}
                    <div className="form-field">
                        <label className="form-label">Passengers</label>
                        <div className="input-wrapper">
                            <Icon.Users className="input-icon" />
                            <div className="passenger-select">
                                <button
                                    type="button"
                                    className="select-trigger"
                                    onClick={(e) => toggleDropdown('passengers', e)}
                                    >
                                    <span className="select-value">
                                        {formData.adults + formData.kids} Travelers
                                        </span>
                                    <Icon.ChevronsUpDown className="select-chevron" />
                                </button>

                                {activeDropdown === 'passengers' && (
                                <div className="passenger-dropdown" style={{display: "block"}} onClick={(e) => e.stopPropagation()}>
                                        {/*ADULTS*/}
                                    <div className="passenger-counter">
                                        <div className='counter-info'>
                                            <div className="counter-label">Adults</div>
                                            <div className="counter-sublabel">18+</div>
                                        </div>
                                        <div className="counter-controls">
                                            <button
                                                type="button"
                                                className="counter-btn"
                                                onClick={() => updateField('adults', Math.max(1, formData.adults - 1))}
                                                > {/*makes sure you cannot travel with 0 adults*/}
                                                <Icon.Minus />
                                            </button>
                                            <span className="counter-value">{formData.adults}</span>
                                            <button
                                                type="button"
                                                className="counter-btn"
                                                onClick={() => updateField('adults', formData.adults + 1)}
                                                >
                                                <Icon.Plus />
                                            </button>
                                        </div>
                                    </div>
                                        {/*KIDS*/}
                                    <div className="passenger-counter">
                                        <div className='counter-info'>
                                            <div className="counter-label">Kids</div>
                                            <div className="counter-sublabel">0-17</div>
                                        </div>
                                        <div className="counter-controls">
                                            <button
                                                type="button"
                                                className="counter-btn"
                                                onClick={() => updateField('kids', Math.max(0, formData.kids - 1))}
                                                >
                                                <Icon.Minus />
                                            </button>
                                            <span className="counter-value"> {formData.kids} </span>
                                            <button
                                                type="button"
                                                className="counter-btn"
                                                onClick={() => updateField('kids', formData.kids + 1)}
                                                >
                                                <Icon.Plus />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>

                                {/*TRANSPORT*/}
                    <div className="form-field">
                        <label className="form-label">Transport Type</label>
                        <div className="input-wrapper">
                            {/*Icons*/}
                            {formData.transport_type === 'Flight' && <Icon.Plane className="input-icon" />}
                            {formData.transport_type === 'Bus' && <Icon.Bus className="input-icon" />}
                            {formData.transport_type === 'Train' && <Icon.Train className="input-icon" />}

                            <div className="transport-select">
                                <button
                                    type='button'
                                    className='select-trigger'
                                    onClick={(e) => toggleDropdown('transport', e)}>
                                        <span className='select-value'>{formData.transport_type}</span>
                                        <Icon.ChevronsUpDown className="select-chevron" />
                                </button>

                                {activeDropdown === 'transport' && (
                                    <div className='transport-dropdown' style={{display: "block"}}>
                                        {['Flight', 'Bus', 'Train'].map((type) => (
                                            <button
                                                key={type}
                                                type='button'
                                                className={`transport-option ${formData.transport_type === type ? 'active' : ''}`}
                                                onClick={() => {
                                                    updateField('transport_type', type);
                                                    setActiveDropdown(null);
                                            }}
                                            >
                                                <span>{type}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {error && <p className='error-message'>{error}</p>}
                <button
                    ype="submit"
                    className="search-button">
                    Search
                </button>
            </form>
        </div>
    </div>

    <div className="destinations-section">
        <h2 className="section-title">Popular Destinations</h2>

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
                    <img src="göteborg.jpg" alt="Gothemburg"/>
                    <div className="destination-overlay">
                        <h3 className="destination-name">Gothemburg</h3>
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
export default Home