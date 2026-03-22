import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './booking.css';

import * as Icon from '../../icons';

const API = 'https://api.andreiradxa.online';

// format time
function formatTime(timeStr) {
    if (!timeStr) return "N/A";
    const [hours, minutes] = timeStr.split(":");
    return `${hours}:${minutes}`;
}

// ─── Seat picker ──────────────────────────────────────────────────────────────
// Parses available seat strings like ["1A","1B","1C"...] into a grid
// layout that differs per transport type

function SeatPicker({ transportType, availableSeats, selectedSeats, onToggleSeat, totalPassengers }) {

    // Parse into a map: { "1": ["A","B","C"], "2": [...] }
    const rowMap = {};
    availableSeats.forEach(seat => {
        const row = seat.slice(0, -1);   // "1A" -> "1"
        const col = seat.slice(-1);      // "1A" -> "A"
        if (!rowMap[row]) rowMap[row] = [];
        rowMap[row].push(col);
    });

    // Sort rows numerically
    const rows = Object.keys(rowMap).sort((a, b) => parseInt(a) - parseInt(b));

    // Column definitions per transport type
    const layoutConfig = {
        // Plane: 2+2 with aisle — A B | C D
        plane: { left: ['A', 'B'], right: ['C', 'D'], aisle: true },
        // Train: same 2+2 layout as plane
        train: { left: ['A', 'B'], right: ['C', 'D'], aisle: true },
        // Bus: 2+1 with aisle — A B | C
        bus:   { left: ['A', 'B'], right: ['C'],       aisle: true },
    };

    const layout = layoutConfig[transportType?.toLowerCase()] || layoutConfig.plane;

    const isSeatTaken = (seatId) => !availableSeats.includes(seatId);
    const isSeatSelected = (seatId) => selectedSeats.includes(seatId);
    const canSelectMore = selectedSeats.length < totalPassengers;

    const handleClick = (seatId) => {
        if (isSeatTaken(seatId)) return;
        onToggleSeat(seatId);
    };

    return (
        <div className="seat-picker">
            {/* Column header labels */}
            <div className="seat-header">
                <div className="seat-row-num" />
                {layout.left.map(col => (
                    <div key={col} className="seat-col-label">{col}</div>
                ))}
                {layout.aisle && <div className="seat-aisle-gap" />}
                {layout.right.map(col => (
                    <div key={col} className="seat-col-label">{col}</div>
                ))}
            </div>

            {/* Seat rows */}
            <div className="seat-rows">
                {rows.map(row => (
                    <div key={row} className="seat-row">
                        <div className="seat-row-num">{row}</div>

                        {layout.left.map(col => {
                            const seatId = `${row}${col}`;
                            const available = availableSeats.includes(seatId);
                            const selected = isSeatSelected(seatId);
                            const blocked = !selected && !canSelectMore;

                            return (
                                <button
                                    key={seatId}
                                    type="button"
                                    className={`seat
                                        ${!available ? 'seat-taken' : ''}
                                        ${selected ? 'seat-selected' : ''}
                                        ${available && blocked ? 'seat-blocked' : ''}
                                    `}
                                    onClick={() => handleClick(seatId)}
                                    disabled={!available}
                                    title={seatId}
                                >
                                    {selected ? '✓' : seatId}
                                </button>
                            );
                        })}

                        {layout.aisle && <div className="seat-aisle-gap" />}

                        {layout.right.map(col => {
                            const seatId = `${row}${col}`;
                            const available = availableSeats.includes(seatId);
                            const selected = isSeatSelected(seatId);
                            const blocked = !selected && !canSelectMore;

                            return (
                                <button
                                    key={seatId}
                                    type="button"
                                    className={`seat
                                        ${!available ? 'seat-taken' : ''}
                                        ${selected ? 'seat-selected' : ''}
                                        ${available && blocked ? 'seat-blocked' : ''}
                                    `}
                                    onClick={() => handleClick(seatId)}
                                    disabled={!available}
                                    title={seatId}
                                >
                                    {selected ? '✓' : seatId}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="seat-legend">
                <div className="legend-item">
                    <div className="legend-dot seat-legend-available" />
                    <span>Available</span>
                </div>
                <div className="legend-item">
                    <div className="legend-dot seat-legend-selected" />
                    <span>Selected</span>
                </div>
                <div className="legend-item">
                    <div className="legend-dot seat-legend-taken" />
                    <span>Taken</span>
                </div>
            </div>
        </div>
    );
}

// ─── Booking page ─────────────────────────────────────────────────────────────

function Booking({ user }) {
    const location = useLocation();
    const navigate = useNavigate();

    const bookingData = location.state;

    // ── All hooks first, before any conditional returns ────────────────────
    const [passengers, setPassengers] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [passengerErrors, setPassengerErrors] = useState({});
    const [seatError, setSeatError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Must derive values safely — bookingData might be null on direct URL access
    const route = bookingData?.route;
    const searchParams = bookingData?.searchParams || {};
    const totalPrice = bookingData?.totalPrice || 0;
    const returnHour = bookingData?.returnHour || null;
    const arrivalDisplay = bookingData?.arrivalDisplay || '';
    const adults = searchParams.adults || 1;
    const kids = searchParams.kids || 0;
    const return_date = searchParams.return_date || null;
    const totalPassengers = adults + kids;
    const hasReturn = !!return_date;

    // Populate passengers once on mount
    useEffect(() => {
        if (!bookingData || !user) return;
        const list = [];
        for (let i = 0; i < totalPassengers; i++) {
            list.push({
                full_name: i === 0 ? `${user.first_name} ${user.last_name}` : '',
                type: i < adults ? 'adult' : 'kid'
            });
        }
        setPassengers(list);
    }, []); // runs once on mount only -- the error is not relevant for the logic case

    // --- IMPORTANT FOR NAVIGATION FLOW ────────────────────────────────────────────────
    useEffect(() => {
        if (success) {
            // Replace current history entry so back button skips the booking page -- avoids double booking confusion
            window.history.replaceState(null, '', '/');
        }
    }, [success]);


    // ── Early return AFTER all hooks ───────────────────────────────────────
    if (!bookingData) {
        navigate('/');
        return null;
    }

    // ── Handlers ───────────────────────────────────────────────────────────

    const updatePassengerName = (index, value) => {
        setPassengers(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], full_name: value };
            return updated;
        });
        if (passengerErrors[index]) {
            setPassengerErrors(prev => {
                const updated = { ...prev };
                delete updated[index];
                return updated;
            });
        }
    };

    const toggleSeat = (seatId) => {
        setSeatError('');
        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(s => s !== seatId);
            }
            if (prev.length >= totalPassengers) {
                return prev;
            }
            return [...prev, seatId];
        });
    };

    const getPassengerPrice = (type) => {
        const base = parseFloat(route.base_price) || 0;
        const multiplier = type === 'kid' ? 0.8 : 1.0;
        return hasReturn ? base * multiplier * 2 : base * multiplier;
    };

    const handleBook = async () => {
        setSubmitError('');
        setSeatError('');

        // Validate passenger names
        const errors = {};
        passengers.forEach((p, i) => {
            if (!p.full_name.trim()) {
                errors[i] = "Name is required.";
            }
        });
        setPassengerErrors(errors);
        if (Object.keys(errors).length > 0) return;

        // Validate seat count
        if (selectedSeats.length !== totalPassengers) {
            setSeatError(`Please select exactly ${totalPassengers} seat${totalPassengers > 1 ? 's' : ''}.`);
            return;
        }

        setSubmitting(true);

        try {
            // Step 1 — validate seats are still available
            const validateRes = await fetch(`${API}/api/seats/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    route_id: route.id,
                    seat_numbers: selectedSeats
                })
            });
            const validateData = await validateRes.json();

            if (!validateData.allAvailable) {
                setSeatError(
                    `Seats ${validateData.takenSeats.join(', ')} were just taken. Please choose different seats.`
                );
                setSelectedSeats(prev => prev.filter(s => !validateData.takenSeats.includes(s)));
                setSubmitting(false);
                return;
            }

            // Step 2 — build passenger payload
            const passengersPayload = passengers.map((p, i) => ({
                full_name: p.full_name.trim(),
                seat_number: selectedSeats[i],
                final_price: getPassengerPrice(p.type)
            }));

            // Step 3 — create the tickets
            const bookRes = await fetch(`${API}/api/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    route_id: route.id,
                    passengers: passengersPayload
                })
            });
            const bookData = await bookRes.json();

            if (bookData.success) {
                setSuccess(true);
            } else {
                if (bookData.takenSeats) {
                    setSeatError(
                        `Seats ${bookData.takenSeats.join(', ')} were taken during your booking. Please choose again.`
                    );
                    setSelectedSeats(prev => prev.filter(s => !bookData.takenSeats.includes(s)));
                } else {
                    setSubmitError(bookData.message || "Booking failed. Please try again.");
                }
            }

        } catch (err) {
            console.error("Booking error:", err);
            setSubmitError("Could not reach server. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // ── Success screen ─────────────────────────────────────────────────────
    if (success) {
        return (
            <div className="booking-page">
                <div className="booking-success-card">
                    <div className="success-icon">✓</div>
                    <h2 className="success-title">Booking confirmed!</h2>
                    <p className="success-subtitle">
                        {totalPassengers} ticket{totalPassengers > 1 ? 's' : ''} booked for{' '}
                        {route.origin} → {route.destination}
                    </p>
                    <p className="success-total">Total paid: {totalPrice.toFixed(2)} SEK</p>
                    <div className="success-actions">
                        <button className="success-btn" onClick={() => navigate('/account')}>
                            View my tickets
                        </button>
                        <button className="success-btn-secondary" onClick={() => navigate('/')}>
                            Back to home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Booking form ───────────────────────────────────────────────────────
    return (
        <div className="booking-page">

            {/* Journey summary */}
            <div className="booking-summary-card">
                <div className="booking-summary-route">
                    <div className="summary-leg">
                        <span className="summary-city">{route.origin}</span>
                        <span className="summary-time">{formatTime(route.departure_time)}</span>
                    </div>
                    <div className="summary-middle">
                        <span className="summary-arrow">→</span>
                        <span className="summary-type">
                            {route.transport_type === 'plane' && <Icon.Plane />}
                            {route.transport_type === 'bus' && <Icon.Bus />}
                            {route.transport_type === 'train' && <Icon.Train />}
                            {' '}{route.transport_type}
                        </span>
                    </div>
                    <div className="summary-leg summary-leg-right">
                        <span className="summary-city">{route.destination}</span>
                        <span className="summary-time">{arrivalDisplay}</span>
                    </div>
                </div>

                <div className="booking-summary-meta">
                    <div className="summary-meta-item">
                        <span className="summary-meta-label">Date</span>
                        <span className="summary-meta-value">
                            {new Date(route.departure_date).toLocaleDateString('en-GB', {
                                day: 'numeric', month: 'short', year: 'numeric'
                            })}
                        </span>
                    </div>
                    {hasReturn && (
                        <div className="summary-meta-item">
                            <span className="summary-meta-label">Return</span>
                            <span className="summary-meta-value">
                                {new Date(return_date).toLocaleDateString('en-GB', {
                                    day: 'numeric', month: 'short', year: 'numeric'
                                })}
                                {returnHour ? ` at ${returnHour}` : ''}
                            </span>
                        </div>
                    )}
                    <div className="summary-meta-item">
                        <span className="summary-meta-label">Passengers</span>
                        <span className="summary-meta-value">
                            {adults} adult{adults !== 1 ? 's' : ''}
                            {kids > 0 ? `, ${kids} kid${kids !== 1 ? 's' : ''}` : ''}
                        </span>
                    </div>
                    <div className="summary-meta-item">
                        <span className="summary-meta-label">Total</span>
                        <span className="summary-meta-value summary-total">
                            {totalPrice.toFixed(2)} SEK
                        </span>
                    </div>
                </div>
            </div>

            <div className="booking-body">

                {/* Passenger forms */}
                <div className="booking-glass-card">
                    <h3 className="booking-section-title">Passenger details</h3>
                    <p className="booking-section-subtitle">
                        {totalPassengers} passenger{totalPassengers > 1 ? 's' : ''} —
                        enter full names as they appear on ID
                    </p>

                    <div className="passengers-grid">
                        {passengers.map((passenger, index) => (
                            <div key={index} className="passenger-field">
                                <label className="passenger-label">
                                    {index === 0
                                        ? 'Primary passenger (you)'
                                        : `${passenger.type === 'kid' ? 'Kid' : 'Adult'} ${index + 1}`
                                    }
                                </label>
                                <input
                                    type="text"
                                    className={`passenger-input ${passengerErrors[index] ? 'passenger-input-error' : ''}`}
                                    placeholder="Full name"
                                    value={passenger.full_name}
                                    onChange={e => updatePassengerName(index, e.target.value)}
                                />
                                {passengerErrors[index] && (
                                    <span className="passenger-error">{passengerErrors[index]}</span>
                                )}
                                <span className="passenger-price">
                                    {getPassengerPrice(passenger.type).toFixed(2)} SEK
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Seat picker */}
                <div className="booking-glass-card">
                    <h3 className="booking-section-title">Select seats</h3>
                    <p className="booking-section-subtitle">
                        Select {totalPassengers} seat{totalPassengers > 1 ? 's' : ''} —
                        {selectedSeats.length}/{totalPassengers} selected
                    </p>

                    <SeatPicker
                        transportType={route.transport_type}
                        availableSeats={route.available_seats}
                        selectedSeats={selectedSeats}
                        onToggleSeat={toggleSeat}
                        totalPassengers={totalPassengers}
                    />

                    {seatError && (
                        <p className="seat-error-msg">{seatError}</p>
                    )}

                    {selectedSeats.length > 0 && (
                        <div className="seat-assignments">
                            <h4 className="seat-assignments-title">Seat assignments</h4>
                            {passengers.map((p, i) => (
                                <div key={i} className="seat-assignment-row">
                                    <span className="seat-assignment-name">
                                        {p.full_name || `Passenger ${i + 1}`}
                                    </span>
                                    <span className="seat-assignment-seat">
                                        {selectedSeats[i] || '—'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {submitError && <p className="submit-error">{submitError}</p>}

            <button
                className="book-btn"
                onClick={handleBook}
                disabled={submitting}
            >
                {submitting ? 'Confirming booking...' : `Confirm booking — ${totalPrice.toFixed(2)} SEK`}
            </button>
        </div>
    );
}

export default Booking;