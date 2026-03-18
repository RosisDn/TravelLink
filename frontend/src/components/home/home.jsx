// little documentation guide as we have not used react before -- check for the commented ZONES

// ZONE 1 -- imports similar to C++
import React, { useState, useEffect, useRef } from "react";
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

    // tracker for the calender
    const [viewDate, setViewDate] = useState(new Date());

    const generateDays = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();

        // 1st day of the month
        const firstDay = new Date(year, month, 1).getDay();
        // total days in current month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        // fill empty dates from previous month tail
        for (let i = 0; i < (firstDay === 0 ?  6 : firstDay - 1); i++) {
            days.push({ day: null, type: "empty"});
        }
        // fill actual calender days data
        for (let d = 1; d <= daysInMonth; d++) {
            const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isPassed = new Date(fullDate) < new Date().setHours(0, 0, 0, 0);
            days.push({ day: d, date: fullDate, isPassed });
        }
        return days;
    };
    const changeMonth = (offset) => {
        setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + offset)));
    }

    // keep the parameters for the search API link call needed for data manipulation on server level
    const [formData, setFormData] = useState({
        origin: "",
        destination: "",
        departure_date: "",
        return_date: "",
        adults: 1,
        kids: 0,
        transport_type: "Bus" // default value
    });

    // toggle state for dropdown for each necessary fields
    // it all updates the input change as well as the previous did
    const [activeDropdown, setActiveDropdown] = useState(null); // default


    // update specific fields
    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value}));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // toggle dropdown
    const toggleDropdown = (name, e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    const bookingRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            // active dropdown && user click outside the container
            // handles every single type of input field, all opened containers

            if (!activeDropdown) return;

            const isSafeZone = event.target.closest('.form-field') ||
                              event.target.closest('.select-dropdown') ||
                              event.target.closest('.date-dropdown') ||
                              event.target.closest('.passenger-dropdown') ||
                              event.target.closest('.transport-dropdown');

            if (!isSafeZone) {
                setActiveDropdown(null);
            }
        };
        // event to listen on the page each time a dropdown menu is active
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [activeDropdown]); // will always reset, so it will run each time a dropdown menu is opened, closed and opened again

    const [errors, setErrors] = useState({});
    const runSearch = async (e) => {
        if (e) e.preventDefault();

        // validation to fire a search
        let newErrors = {};

        //origin
        if (!formData.origin.trim()) {
            newErrors.origin = "Origin is required.";
        } else if (!uniqueOrigins.includes(formData.origin)) {
            newErrors.origin = "Valid origins from the list only!";
        }

        //destination
        if (!formData.destination.trim()) {
            newErrors.destination = "Destination is required";
        } else if (!uniqueDestinations.includes(formData.destination)) {
            newErrors.destination = "Valid destinations from the list only!";
        } else if (formData.origin === formData.destination) {
            newErrors.destination = "Origin and Destination cannot be the same.";
        }

        //date
        if (!formData.departure_date) {
            newErrors.departure_date = "Departure date is required.";
        }

        // update state with found error
        setErrors(newErrors);
        // do not run search in case errors are found
        if (Object.keys(newErrors).length > 0) return;

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
                    {/*form fields gets a temporary high z-index when certain tables are active, better display when focus is on them*/}
                    <div className="form-field">
                        <label className="form-label">*From</label>
                        <div className={`input-wrapper ${errors.origin ? 'input-error' : ''}`}>
                            <Icon.MapPin className="input-icon" />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search Origin..."
                                value={formData.origin}
                                onChange={(e) => updateField('origin', e.target.value)}
                                onFocus={() => setActiveDropdown('origin')}
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
                        {errors.origin && <span className="field-error-msg">{errors.origin}</span>}
                    </div>

                    {/*Field - DESTINATION*/}
                    <div className="form-field">
                        <label className="form-label">*To</label>
                        <div className={`input-wrapper ${errors.destination ? 'input-error' : ''}`}>
                            <Icon.MapPin className="input-icon" />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search Destination..."
                                value={formData.destination}
                                onChange={(e) => updateField('destination', e.target.value)}
                                onFocus={() => setActiveDropdown('destination')}

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
                        {errors.origin && <span className="field-error-msg">{errors.destination}</span>}
                    </div>

                                {/*DEPARTURE DATE*/}
                    <div className="form-field">
                        <label className="form-label">*Departure</label>
                        <div className={`input-wrapper ${errors.departure_date ? 'input-error' : ''}`}>
                            <Icon.Calendar className="input-icon" />
                            <div className="date-picker">
                                {/*Dropdown with all dependency placeholder*/}
                                <button type="button" className="select-trigger" onClick={(e) => toggleDropdown('departure', e)}>
                                    <span className={`select-value ${!formData.departure_date ? 'placeholder' : ''}`}>
                                        {formData.departure_date || "Select date"}
                                    </span>
                                    <Icon.ChevronsUpDown className="select-chevron" />
                                </button>

                                {activeDropdown === 'departure' && (
                                    <div className="date-dropdown" onClick={(e) => e.stopPropagation()}>
                                        <div className="date-header">
                                            <button
                                                type="button"
                                                className="date-nav"
                                                onClick={() => changeMonth(-1)}
                                                >
                                                    <Icon.ChevronLeft />
                                            </button>
                                                <span className="date-month-year">
                                                    {viewDate.toLocaleString('default', {month: 'long', year: 'numeric'})}
                                                </span>
                                                <button
                                                type="button"
                                                className="date-nav"
                                                onClick={() => changeMonth(1)}
                                                >
                                                    <Icon.ChevronRight />
                                            </button>
                                        </div>
                                        <div className="date-calendar">
                                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) =>(
                                                <div key={`${day}-${index}`} className="date-day-name">{day}</div>
                                            ))}
                                            {generateDays(viewDate).map((item, idx) => (
                                                <div
                                                key={idx}
                                                className={`date-day ${item.type === 'empty' ? 'empty' : ''} ${item.isPassed ? 'disabled' : ''} ${formData.departure_date === item.date ? 'selected' : ''}`}
                                                onClick={() => !item.isPassed && item.day && (updateField('departure_date', item.date), setActiveDropdown(null))}
                                                    >
                                                    {item.day}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {errors.origin && <span className="field-error-msg">{errors.departure_date}</span>}
                    </div>

                                {/*RETURN*/}
                    <div className="form-field">
                        <label className="form-label">Return (optional)</label>
                        <div className={`input-wrapper ${errors.return_date ? 'input-error' : ''}`}>
                            <Icon.Calendar className="input-icon" />
                            <div className="date-picker-wrapper" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                {/* Main trigger for the dropdown */}
                                <button
                                    type="button"
                                    className="select-trigger"
                                    onClick={(e) => toggleDropdown('return', e)}
                                    style={{ flex: 1, display: 'flex', alignItems: 'center' }}
                                >
                                    <span className={`select-value ${!formData.return_date ? 'placeholder' : ''}`}>
                                        {formData.return_date || "One Way"}
                                    </span>
                                    <Icon.ChevronsUpDown className="select-chevron" />
                                </button>

                                {/* The X button is now a SIBLING, perfectly aligned by the parent's flex-center
                                Takes space outside the field, signals clearly that the field can be cleared*/}
                                {formData.return_date && (
                                    <button
                                        type="button"
                                        className="clear-btn"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents opening the dropdown when clearing
                                            updateField('return_date', "");
                                        }}
                                        style={{ marginLeft: '8px', display: 'flex', alignItems: 'center' }}
                                    >
                                        <Icon.X size={20} />
                                    </button>
                                )}

                                {activeDropdown === 'return' && (
                                    <div className="date-dropdown" onClick={(e) => e.stopPropagation()}>
                                        <div className="date-header">
                                            <button
                                                type="button"
                                                className="date-nav"
                                                onClick={() => changeMonth(-1)}
                                                >
                                                    <Icon.ChevronLeft />
                                            </button>
                                                <span className="date-month-year">
                                                    {viewDate.toLocaleString('default', {month: 'long', year: 'numeric'})}
                                                </span>
                                                <button
                                                type="button"
                                                className="date-nav"
                                                onClick={() => changeMonth(1)}
                                                >
                                                    <Icon.ChevronRight />
                                            </button>
                                        </div>
                                        <div className="date-calendar">
                                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) =>(
                                                <div key={`${day}-${index}`} className="date-day-name">{day}</div>
                                            ))}
                                            {/*Data for the return calendar must respect the departure day, cannot literally travel back in time*/}
                                            {generateDays(viewDate).map((item, idx) => {
                                                // check if date is in the past
                                                const isPast = item.isPassed;

                                                // turn into date objects to use in math
                                                const departureDateObj = formData.departure_date ? new Date(formData.departure_date) : null;
                                                const currentItemDateObj = new Date(item.date);

                                                // compare only on [day] level, not time
                                                if (departureDateObj) departureDateObj.setHours(0, 0, 0, 0);
                                                currentItemDateObj.setHours(0, 0, 0, 0);

                                                // check if return date is before departure, if yes -- it will block the options in the calendar
                                                const isBeforeDeparture = departureDateObj && (currentItemDateObj < departureDateObj);
                                                const isDisabled = isPast || isBeforeDeparture;

                                                return (
                                                    <div
                                                        key={item.date || idx}
                                                        className={`date-day ${item.type === 'empty' ? 'empty' : ''} ${isDisabled ? 'disabled' : ''} ${formData.return_date === item.date ? 'selected' : ''}`}
                                                        onClick={() => !isDisabled && item.day && (updateField('return_date', item.date), setActiveDropdown(null))}
                                                    >
                                                        {item.day}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
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

                {Object.keys(errors).length > 0 && (
                    <p className='error-message'>
                        {errors.server || "Please fill in all the required fields correctly."}
                    </p>
                )}
                <button
                    ype="submit"
                    className="search-button">
                    Search
                </button>
            </form>
        </div>
    </div>
                {/*Suggested Destinations*/}
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
export default Home