import React, { useState, useEffect } from "react";
import * as Icon from '../../icons';

// Making the booking form modular instead, based on the code from home.jsx
// The module can be used on home home.jsx and search.jsx

function BookingForm({ initialData = {}, onSearch }) {

    const [availableRoutes, setAvailableRoutes] = useState([]);
    const [uniqueOrigins, setUniqueOrigins] = useState([]);
    const [uniqueDestinations, setUniqueDestinations] = useState([]);
    const [serverError, setServerError] = useState("");
    const [errors, setErrors] = useState({});
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Separate viewDate per calendar so navigating months doesn't bleed between them
    const [departureViewDate, setDepartureViewDate] = useState(new Date());
    const [returnViewDate, setReturnViewDate] = useState(new Date());

    const [formData, setFormData] = useState({
        origin: "",
        destination: "",
        departure_date: "",
        return_date: "",
        adults: 1,
        kids: 0,
        transport_type: "Bus",
        ...initialData  // overwrite defaults with whatever the parent passes in
    });

    // Fetch available routes for autocomplete
    useEffect(() => {
        const fetchBaseData = async () => {
            try {
                const response = await fetch('https://api.andreiradxa.online/api/search?');
                const result = await response.json();
                if (result.success && result.data) {
                    setAvailableRoutes(result.data);
                    const origins = [...new Set(result.data.map(r => r.origin))];
                    const destinations = [...new Set(result.data.map(r => r.destination))];
                    setUniqueOrigins(origins);
                    setUniqueDestinations(destinations);
                }
            } catch (err) {
                console.error("Failed to load location data:", err);
            }
        };
        fetchBaseData();
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        if (!activeDropdown) return;
        const handleClickOutside = (event) => {
            const isSafeZone =
                event.target.closest('.form-field') ||
                event.target.closest('.select-dropdown') ||
                event.target.closest('.date-dropdown') ||
                event.target.closest('.passenger-dropdown') ||
                event.target.closest('.transport-dropdown');
            if (!isSafeZone) setActiveDropdown(null);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [activeDropdown]);

    // Swap button for origin/destination
    const swapLocations = () => {
        const currentOrigin = formData.origin;
        const currentDestination = formData.destination;
        updateField('origin', currentDestination);
        updateField('destination', currentOrigin);
    };

    // now also clears the destination UI when origin is changed -- added from destination choice cap
    const updateField = (field, value) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value };
            // clear destination if origin changes
            if (field === 'origin') updated.destination = '';
            return updated;
        });
        if (errors[field]) {
            setErrors(prev => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    const toggleDropdown = (name, e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    const generateDays = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];

        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            days.push({ day: null, type: "empty" });
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isPassed = new Date(fullDate) < new Date().setHours(0, 0, 0, 0);
            days.push({ day: d, date: fullDate, isPassed });
        }
        return days;
    };

    const changeMonth = (calendarTarget, offset) => {
        if (calendarTarget === 'departure') {
            setDepartureViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
        } else {
            setReturnViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
        }
    };

    const runSearch = async (e) => {
        if (e) e.preventDefault();
        setServerError("");

        let newErrors = {};

        if (!formData.origin.trim()) {
            newErrors.origin = "Origin is required.";
        } else if (!uniqueOrigins.includes(formData.origin)) {
            newErrors.origin = "Please select a valid origin from the list.";
        }

        if (!formData.destination.trim()) {
            newErrors.destination = "Destination is required.";
        } else if (!uniqueDestinations.includes(formData.destination)) {
            newErrors.destination = "Please select a valid destination from the list.";
        } else if (formData.origin === formData.destination) {
            newErrors.destination = "Origin and destination cannot be the same.";
        }

        if (!formData.departure_date) {
            newErrors.departure_date = "Departure date is required.";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const apiParams = {
            origin: formData.origin,
            destination: formData.destination,
            departure_date: formData.departure_date,
            transport_type: formData.transport_type,
        };
        const query = new URLSearchParams(apiParams).toString();
        const finalURL = `https://api.andreiradxa.online/api/search?${query}`;
        console.log("Fetching:", finalURL);

        try {
            const response = await fetch(finalURL);
            if (!response.ok) throw new Error(`Server status: ${response.status}`);

            const data = await response.json();

            if (!data.success) {
                setServerError("Search failed. Check your parameters.");
                return;
            }

            // Hand results + form data back up to the parent page
            // The parent decides what to do with it (navigate, re-render, etc.)
            onSearch(data.data, formData);

        } catch (err) {
            console.error("Fetch failed:", err.message);
            setErrors(prev => ({
                ...prev,
                server: "Could not reach server. Backend might be offline."
            }));
        }
    };

    return (
        <form className="booking-form" onSubmit={runSearch}>
            <div className="form-grid">

                {/*ORIGIN & DESTINATION
                Contained together in order to add the swap button smoothly
                */}
                <div className="route-fields-wrapper">
                    {/* ORIGIN */}
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
                            <div className="select-dropdown" style={{ display: 'block' }}>
                                <div className="select-list">
                                    {uniqueOrigins
                                        .filter(city => city.toLowerCase().includes(formData.origin.toLowerCase()))
                                        .map(city => (
                                            <div
                                                key={city}
                                                className="select-item"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
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
                    {/* Fixed: was checking errors.origin for all three fields */}
                    {errors.origin && <span className="field-error-msg">{errors.origin}</span>}
                </div>

                    <button
                        type="button"
                        className="swap-btn"
                        onClick={swapLocations}
                        title="Swap origin and destination"
                    >
                        ⇄
                    </button>

                    {/* DESTINATION */}
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
                                <div className="select-dropdown" style={{ display: 'block' }}>
                                    <div className="select-list">
                                    {(formData.origin
                                        ? [...new Set(availableRoutes
                                            .filter(r => r.origin === formData.origin)
                                            .map(r => r.destination))]
                                        : uniqueDestinations
                                    ).filter(city =>
                                        city.toLowerCase().includes(formData.destination.toLowerCase()) &&
                                        city !== formData.origin
                                    )
                                            .map(city => (
                                                <div
                                                    key={city}
                                                    className="select-item"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
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
                        {errors.destination && <span className="field-error-msg">{errors.destination}</span>}
                    </div>
                </div>

                {/* DEPARTURE DATE */}
                <div className="form-field">
                    <label className="form-label">*Departure</label>
                    <div className={`input-wrapper ${errors.departure_date ? 'input-error' : ''}`}>
                        <Icon.Calendar className="input-icon" />
                        <div className="date-picker">
                            <button type="button" className="select-trigger" onClick={(e) => toggleDropdown('departure', e)}>
                                <span className={`select-value ${!formData.departure_date ? 'placeholder' : ''}`}>
                                    {formData.departure_date || "Select date"}
                                </span>
                                <Icon.ChevronsUpDown className="select-chevron" />
                            </button>
                            {activeDropdown === 'departure' && (
                                <div className="date-dropdown" onClick={(e) => e.stopPropagation()}>
                                    <div className="date-header">
                                        <button type="button" className="date-nav" onClick={() => changeMonth('departure', -1)}>
                                            <Icon.ChevronLeft />
                                        </button>
                                        <span className="date-month-year">
                                            {departureViewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <button type="button" className="date-nav" onClick={() => changeMonth('departure', 1)}>
                                            <Icon.ChevronRight />
                                        </button>
                                    </div>
                                    <div className="date-calendar">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                                            <div key={`${day}-${index}`} className="date-day-name">{day}</div>
                                        ))}
                                        {generateDays(departureViewDate).map((item, idx) => (
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
                    {errors.departure_date && <span className="field-error-msg">{errors.departure_date}</span>}
                </div>

                {/* RETURN DATE */}
                <div className="form-field">
                    <label className="form-label">Return (optional)</label>
                    <div className={`input-wrapper ${errors.return_date ? 'input-error' : ''}`}>
                        <Icon.Calendar className="input-icon" />
                        <div className="date-picker-wrapper" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
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
                            {formData.return_date && (
                                <button
                                    type="button"
                                    className="clear-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
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
                                        <button type="button" className="date-nav" onClick={() => changeMonth('return', -1)}>
                                            <Icon.ChevronLeft />
                                        </button>
                                        <span className="date-month-year">
                                            {returnViewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <button type="button" className="date-nav" onClick={() => changeMonth('return', 1)}>
                                            <Icon.ChevronRight />
                                        </button>
                                    </div>
                                    <div className="date-calendar">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                                            <div key={`${day}-${index}`} className="date-day-name">{day}</div>
                                        ))}
                                        {generateDays(returnViewDate).map((item, idx) => {
                                            const isPast = item.isPassed;
                                            const departureDateObj = formData.departure_date ? new Date(formData.departure_date) : null;
                                            const currentItemDateObj = new Date(item.date);
                                            if (departureDateObj) departureDateObj.setHours(0, 0, 0, 0);
                                            currentItemDateObj.setHours(0, 0, 0, 0);
                                            const isBeforeDeparture = departureDateObj && currentItemDateObj < departureDateObj;
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

                {/* PASSENGERS */}
                <div className="form-field">
                    <label className="form-label">Passengers</label>
                    <div className="input-wrapper">
                        <Icon.Users className="input-icon" />
                        <div className="passenger-select">
                            <button type="button" className="select-trigger" onClick={(e) => toggleDropdown('passengers', e)}>
                                <span className="select-value">{formData.adults + formData.kids} Travelers</span>
                                <Icon.ChevronsUpDown className="select-chevron" />
                            </button>
                            {activeDropdown === 'passengers' && (
                                <div className="passenger-dropdown" style={{ display: "block" }} onClick={(e) => e.stopPropagation()}>
                                    <div className="passenger-counter">
                                        <div className="counter-info">
                                            <div className="counter-label">Adults</div>
                                            <div className="counter-sublabel">18+</div>
                                        </div>
                                        <div className="counter-controls">
                                            <button type="button" className="counter-btn" onClick={() => updateField('adults', Math.max(1, formData.adults - 1))}>
                                                <Icon.Minus />
                                            </button>
                                            <span className="counter-value">{formData.adults}</span>
                                            <button type="button" className="counter-btn" onClick={() => updateField('adults', formData.adults + 1)}>
                                                <Icon.Plus />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="passenger-counter">
                                        <div className="counter-info">
                                            <div className="counter-label">Kids</div>
                                            <div className="counter-sublabel">0-17</div>
                                        </div>
                                        <div className="counter-controls">
                                            <button type="button" className="counter-btn" onClick={() => updateField('kids', Math.max(0, formData.kids - 1))}>
                                                <Icon.Minus />
                                            </button>
                                            <span className="counter-value">{formData.kids}</span>
                                            <button type="button" className="counter-btn" onClick={() => updateField('kids', formData.kids + 1)}>
                                                <Icon.Plus />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* TRANSPORT */}
                <div className="form-field">
                    <label className="form-label">Transport Type</label>
                    <div className="input-wrapper">
                        {formData.transport_type === 'Plane' && <Icon.Plane className="input-icon" />}
                        {formData.transport_type === 'Bus' && <Icon.Bus className="input-icon" />}
                        {formData.transport_type === 'Train' && <Icon.Train className="input-icon" />}
                        <div className="transport-select">
                            <button type="button" className="select-trigger" onClick={(e) => toggleDropdown('transport', e)}>
                                <span className="select-value">{formData.transport_type}</span>
                                <Icon.ChevronsUpDown className="select-chevron" />
                            </button>
                            {activeDropdown === 'transport' && (
                                <div className="transport-dropdown" style={{ display: "block" }}>
                                    {['Plane', 'Bus', 'Train'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
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
                <p className="error-message">
                    {errors.server || "Please fill in all required fields correctly."}
                </p>
            )}

            <button type="submit" className="search-button">Search</button>
        </form>
    );
}

export default BookingForm;