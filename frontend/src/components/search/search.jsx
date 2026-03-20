import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingForm from "../common/BookingForm";
import './search.css';
import * as Icon from '../../icons';

// Helping functionality ------------------------------------- additional functions for calculation and further data manipulation//

// database displays no arrival time -- define mock times based on transport types
const ARRIVAL_OFFSETS = { // in hours
    plane: 2,
    bus: 6,
    train: 4
};

function getMockArrivalTime(departureTime, transportType) {
    if (!departureTime) return "N/A";

    // API returns HH:MM:SS
    const [hours, minutes] = departureTime.split(":").map(Number);
    const offset = ARRIVAL_OFFSETS[transportType?.toLowerCase()] ?? 3; // set offset based on transportType
    const arrivalHours = (hours + offset) % 24;
    // only display HH:MM
    return `${String(arrivalHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function formatTime(timeStr) {
    if (!timeStr) return "N/A";
    const [hours, minutes] = timeStr.split(":");
    return `${hours}:${minutes}`;
}

function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
}

// calculate total price for all passengers, UI display, includes return price if selected
function calculateTotal(basePrice, adults, kids, hasReturn) {
    const base = parseFloat(basePrice) || 0;
    // price is lower for kids
    const passengersTotal = (adults * base * 1.0) + (kids * base * 0.8);
    return hasReturn ? passengersTotal * 2 : passengersTotal; // trick, just doubles the price for departure, we dont actually have return routes in the data base and wont add them
}

// if we got return tickets, generate UI for some hour options to choose between
const RETURN_HOURS = Array.from({ length: 13 }, (_, i) => {
    const hour = 6 + i * 1.5;
    const h = Math.floor(hour);
    const m = hour % 1 === 0.5 ? "30" : "00";
    return `${String(h).padStart(2, '0')}:${m}`;
});

// Result Card ------------------------------- //
// blueprint for card, used for every instance
function ResultCard({route, searchParams, isExpanded, onToggle, onContinue}) {
    const { adults, kids, return_date } = searchParams;
    const hasReturn = !!return_date;

    const departureDisplay = formatTime(route.departure_time);
    const arrivalDisplay = getMockArrivalTime(route.departure_time, route.transport_type);
    const basePrice = parseFloat(route.base_price) || 0;

    // return time picker
    const [returnHour, setReturnHour] = useState(RETURN_HOURS[4]);

    const totalPrice = calculateTotal(basePrice, adults, kids, hasReturn);
    const availableCount = route.available_seats?.length ?? 0; // based on count of seat option

    // display transport type
    const transportLabel = route.transport_type
        ? route.transport_type.charAt(0).toUpperCase() + route.transport_type.slice(1)
        : "Unknown";

        return (
            <div className={`result-card ${isExpanded ? 'expanded' : ''}`}>

                {/* ── Collapsed view ── */}
                <div className="result-card-main" onClick={onToggle}>

                    <div className="result-card-route">
                        <span className="result-origin">{route.origin}</span>
                        <span className="result-arrow">→</span>
                        <span className="result-destination">{route.destination}</span>
                    </div>

                    <div className="result-card-meta">
                        <div className="result-meta-item">
                            <span className="result-meta-label">Departure</span>
                            <span className="result-meta-value">{departureDisplay}</span>
                        </div>
                        <div className="result-meta-item">
                            <span className="result-meta-label">Arrival</span>
                            <span className="result-meta-value">{arrivalDisplay}</span>
                        </div>
                        <div className="result-meta-item">
                            <span className="result-meta-label">Seats left</span>
                            <span className={`result-meta-value ${availableCount < 10 ? 'seats-low' : ''}`}>
                                {availableCount}
                            </span>
                        </div>
                        <div className="result-meta-item">
                            <span className="result-meta-label">Type</span>
                            <span className="result-type-badge">{transportLabel}</span>
                        </div>
                    </div>

                    <div className="result-card-price">
                        <span className="result-price-label">from</span>
                        <span className="result-price-value">{totalPrice.toFixed(2)} SEK</span>
                        <span className="result-expand-hint">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                </div>

                {/* ── Expanded view ── */}
                {isExpanded && (
                    <div className="result-card-expanded">
                        <div className="expanded-divider" />

                        {/* Journey visual */}
                        <div className="expanded-journey">
                            <div className="journey-leg">
                                <div className="journey-city">{route.origin}</div>
                                <div className="journey-time">{departureDisplay}</div>
                                <div className="journey-date">{formatDate(route.departure_date)}</div>
                            </div>
                            <div className="journey-line">
                                <div className="journey-dot" />
                                <div className="journey-track" />
                                <span className="journey-type-icon">
                                    {route.transport_type === 'plane' && <Icon.Plane />}
                                    {route.transport_type === 'bus' && <Icon.Bus />}
                                    {route.transport_type === 'train' && <Icon.Train />}
                                </span>
                                <div className="journey-track" />
                                <div className="journey-dot" />
                            </div>
                            <div className="journey-leg journey-leg-right">
                                <div className="journey-city">{route.destination}</div>
                                <div className="journey-time">{arrivalDisplay}</div>
                                <div className="journey-date">{formatDate(route.departure_date)}</div>
                            </div>
                        </div>

                        {/* Return journey (if return date given) */}
                        {hasReturn && (
                            <>
                                <div className="expanded-return-label">Return</div>
                                <div className="expanded-journey">
                                    <div className="journey-leg">
                                        <div className="journey-city">{route.destination}</div>
                                        <div className="journey-time">
                                            {/* Return hour picker */}
                                            <select
                                                className="return-hour-select"
                                                value={returnHour}
                                                onChange={(e) => setReturnHour(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {RETURN_HOURS.map(h => (
                                                    <option key={h} value={h}>{h}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="journey-date">{formatDate(return_date)}</div>
                                    </div>
                                    <div className="journey-line">
                                        <div className="journey-dot" />
                                        <div className="journey-track" />
                                        <span className="journey-type-icon">
                                            {route.transport_type === 'plane' && <Icon.Plane />}
                                            {route.transport_type === 'bus' && <Icon.Bus />}
                                            {route.transport_type === 'train' && <Icon.Train />}
                                        </span>
                                        <div className="journey-track" />
                                        <div className="journey-dot" />
                                    </div>
                                    <div className="journey-leg journey-leg-right">
                                        <div className="journey-city">{route.origin}</div>
                                        <div className="journey-time">
                                            {/* Arrival = return hour + offset */}
                                            {getMockArrivalTime(returnHour + ":00", route.transport_type)}
                                        </div>
                                        <div className="journey-date">{formatDate(return_date)}</div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Description placeholder */}
                        <p className="expanded-description">
                            Discover the charm of {route.destination} — a destination full of culture,
                            history and unforgettable experiences. Whether you're traveling for leisure
                            or business, this route offers a comfortable and scenic journey worth every mile.
                        </p>

                        {/* Price breakdown */}
                        <div className="expanded-price-breakdown">
                            <div className="price-row">
                                <span>{adults} adult{adults !== 1 ? 's' : ''} × {basePrice.toFixed(2)} SEK</span>
                                <span>{(adults * basePrice).toFixed(2)} SEK</span>
                            </div>
                            {kids > 0 && (
                                <div className="price-row">
                                    <span>{kids} kid{kids !== 1 ? 's' : ''} × {(basePrice * 0.8).toFixed(2)} SEK</span>
                                    <span>{(kids * basePrice * 0.8).toFixed(2)} SEK</span>
                                </div>
                            )}
                            {hasReturn && (
                                <div className="price-row">
                                    <span>Return trip ×2</span>
                                    <span>included above</span>
                                </div>
                            )}
                            <div className="price-row price-total">
                                <span>Total</span>
                                <span>{totalPrice.toFixed(2)} SEK</span>
                            </div>
                        </div>

                        {/* Continue button */}
                        <button
                            className="continue-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onContinue({
                                    route,
                                    searchParams,
                                    totalPrice,
                                    returnHour: hasReturn ? returnHour : null,
                                    arrivalDisplay,
                                });
                            }}
                        >
                            Continue →
                        </button>
                    </div>
                )}
            </div>
        );
}

// very important to give the user state to the function here
function Search({ user }) {
    const location = useLocation();
    const navigate = useNavigate();

    const initialResults = location.state?.results || [];
    const initialParams = location.state?.searchParams || {};

    const [results, setResults] = useState(initialResults);
    const [searchParams, setSearchParams] = useState(initialParams);
    const [expandedCardId, setExpandedCardId] = useState(null);

    const handleSearch = (newResults, newParams) => {
        setResults(newResults);
        setSearchParams(newParams);
        setExpandedCardId(null); // collapse all cards on new search
    };

    const handleToggleCard = (id) => {
        setExpandedCardId(prev => prev === id ? null : id);
    };

    const handleContinue = (bookingData) => {
        if (!user) {
            // not logged in --> account page to do so
            // should be able to continue from where they left with the booking after login
            navigate('/account', {
                state: {
                    redirectTo: '/booking',
                    bookingData: bookingData
                }
            });
            return;
        }
        // if user already logged in, goes straight to booking
        navigate('/booking', { state: bookingData });
    };

    return (
        <div className="search-page">

            {/* Compact form bar */}
            <div className="search-bar-wrapper">
                <div className="search-bar-card">
                    <BookingForm
                        initialData={initialParams}
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            {/* Results */}
            <div className="results-section">
                <div className="results-header">
                    <h2 className="results-title">
                        {searchParams.origin && searchParams.destination
                            ? `${searchParams.origin} → ${searchParams.destination}`
                            : "Search Results"
                        }
                    </h2>
                    <p className="results-count">
                        {results.length} {results.length === 1 ? "route" : "routes"} found
                        {searchParams.departure_date ? ` · ${formatDate(searchParams.departure_date)}` : ''}
                    </p>
                </div>

                {results.length === 0 ? (
                    <div className="no-results">
                        <p>No routes found by {searchParams.transport_type}. Try adjusting your search.</p>
                    </div>
                ) : (
                    <div className="results-list">
                        {results.map((route) => (
                            <ResultCard
                                key={route.id}
                                route={route}
                                searchParams={searchParams}
                                isExpanded={expandedCardId === route.id}
                                onToggle={() => handleToggleCard(route.id)}
                                onContinue={handleContinue}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;