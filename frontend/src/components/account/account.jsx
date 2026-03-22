import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './account.css';
import { generateTicketPDF } from '../../utils/ticketPDF';
import * as Icon from '../../icons';

const API = 'https://api.andreiradxa.online';

function Account({ user, onLogin, onLogout }) {
    const location = useLocation();
    const navigate = useNavigate();

    // Check if we were redirected here from the booking flow
    const redirectTo = location.state?.redirectTo || null;
    const pendingBookingData = location.state?.bookingData || null;

    const [view, setView] = useState('login');
    const [atLimit, setAtLimit] = useState(false);
    const [userCount, setUserCount] = useState(0);
    const [maxUsers, setMaxUsers] = useState(50);

    // Login fields
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register fields
    const [regFirstName, setRegFirstName] = useState('');
    const [regLastName, setRegLastName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regPassword, setRegPassword] = useState('');

    // Feedback
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Profile editing
    const [editField, setEditField] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editError, setEditError] = useState('');
    const [editSuccess, setEditSuccess] = useState('');

    // Ticket refund check
    const [expandedTicketId, setExpandedTicketId] = useState(null);
    const [returningTicketId, setReturningTicketId] = useState(null);
    const [returnError, setReturnError] = useState('');

    // Ticket history
    const [tickets, setTickets] = useState([]);
    const [ticketsLoading, setTicketsLoading] = useState(false);

    // Check account cap on load
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch(`${API}/api/auth/status`);
                const data = await res.json();
                if (data.success) {
                    setAtLimit(data.atLimit);
                    setUserCount(data.userCount);
                    setMaxUsers(data.maxUsers);
                }
            } catch (err) {
                console.error("Status check failed:", err);
            }
        };
        checkStatus();
    }, []);

    // Fetch tickets when user is logged in
    useEffect(() => {
        if (!user) return;
        const fetchTickets = async () => {
            setTicketsLoading(true);
            try {
                const res = await fetch(`${API}/api/tickets/${user.id}`);
                const data = await res.json();
                if (data.success) setTickets(data.tickets);
            } catch (err) {
                console.error("Failed to fetch tickets:", err);
            } finally {
                setTicketsLoading(false);
            }
        };
        fetchTickets();
    }, [user]);

    const handleLogin = async () => {
        if (!loginEmail || !loginPassword) {
            setError("Email and password are required.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword })
            });
            const data = await res.json();
            if (data.success) {
                onLogin(data.user);
                setLoginEmail('');
                setLoginPassword('');
                // If redirected here from booking flow, resume it
                if (redirectTo) {
                    navigate(redirectTo, { state: pendingBookingData });
                }
            } else {
                setError(data.message || "Login failed.");
            }
        } catch (err) {
            setError("Could not reach server. Try again later.", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!regFirstName || !regLastName || !regEmail || !regPhone || !regPassword) {
            setError("All fields are required.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: regFirstName,
                    last_name: regLastName,
                    email: regEmail,
                    phone: regPhone,
                    password: regPassword
                })
            });
            const data = await res.json();
            if (data.success) {
                // Log in immediately after successful registration
                onLogin(data.user);
                if (redirectTo) {
                    navigate(redirectTo, { state: pendingBookingData });
                }
            } else {
                setError(data.message || "Registration failed.");
                if (data.atLimit) setAtLimit(true);
            }
        } catch (err) {
            setError("Could not reach server. Try again later.", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!editValue || !editPassword) {
            setEditError("Both the new value and your current password are required.");
            return;
        }
        setEditError('');
        setEditSuccess('');
        try {
            const res = await fetch(`${API}/api/user/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    field: editField,
                    value: editValue,
                    password: editPassword
                })
            });
            const data = await res.json();
            if (data.success) {
                // Update the stored user object with the changed field
                const updatedUser = { ...user, [editField]: editValue };
                onLogin(updatedUser);
                setEditSuccess(`${editField.charAt(0).toUpperCase() + editField.slice(1)} updated successfully.`);
                setEditField(null);
                setEditValue('');
                setEditPassword('');
            } else {
                setEditError(data.message || "Update failed.");
            }
        } catch (err) {
            setEditError("Could not reach server.", err);
        }
    };

    const handleReturnTicket = async (ticketId) => {
        setReturnError('');
        try {
            const res = await fetch(`${API}/api/tickets/${ticketId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.id })
            });
            const data = await res.json();
            if (data.success) {
                // Remove ticket from local state immediately
                setTickets(prev => prev.filter(t => t.id !== ticketId));
                setReturningTicketId(null);
                setExpandedTicketId(null);
            } else {
                setReturnError(data.message || "Return failed.");
            }
        } catch (err) {
            setReturnError("Could not reach server.", err);
        }
    };
    const isReturnable = (ticket) => {
        const departure = new Date(ticket.departure_date);
        const now = new Date();
        const hoursUntil = (departure - now) / (1000 * 60 * 60);
        return hoursUntil >= 24;
    };
    // This will still allow ticket return of current day, they should instead expire some hour after departure or so but i am too tired to go that deep into it
    const isExpired = (ticket) => {
        const departure = new Date(ticket.departure_date);
        departure.setHours(23, 59, 59, 0); // end of departure day
        return departure < new Date();
    };

    const openEditField = (field) => {
        setEditField(field);
        setEditValue('');
        setEditPassword('');
        setEditError('');
        setEditSuccess('');
    };

    const switchView = (newView) => {
        setView(newView);
        setError('');
    };

    // ── Not logged in ──────────────────────────────────────────────────────────
    if (!user) {
        return (
            <div className="account-page">
                <div className="account-auth-card">

                    <div className="auth-icon">
                        <Icon.User size={40} />
                    </div>

                    <h2 className="auth-title">
                        {view === 'login' ? 'Welcome back' : 'Create an account'}
                    </h2>

                    {/* Show if user was redirected here from booking */}
                    {redirectTo && (
                        <div className="auth-redirect-notice">
                            Please sign in to continue with your booking.
                        </div>
                    )}

                    {error && <p className="auth-error">{error}</p>}

                    {view === 'login' ? (
                        <>
                            <div className="auth-form">
                                <div className="auth-field">
                                    <label className="auth-label">Email</label>
                                    <input
                                        type="email"
                                        className="auth-input"
                                        placeholder="your@email.com"
                                        value={loginEmail}
                                        onChange={e => setLoginEmail(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                    />
                                </div>
                                <div className="auth-field">
                                    <label className="auth-label">Password</label>
                                    <input
                                        type="password"
                                        className="auth-input"
                                        placeholder="••••••••"
                                        value={loginPassword}
                                        onChange={e => setLoginPassword(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                    />
                                </div>
                            </div>

                            <button
                                className="auth-btn"
                                onClick={handleLogin}
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                            <p className="auth-switch">
                                Don't have an account?{' '}
                                <button
                                    className="auth-switch-btn"
                                    onClick={() => switchView('register')}
                                >
                                    Create one here
                                </button>
                            </p>
                        </>
                    ) : (
                        <>
                            {atLimit && (
                                <div className="auth-limit-notice">
                                    Account creation is currently closed ({userCount}/{maxUsers} accounts used).
                                    Please try again later.
                                </div>
                            )}

                            <div className="auth-form auth-form-grid">
                                <div className="auth-field">
                                    <label className="auth-label">First name</label>
                                    <input
                                        type="text"
                                        className="auth-input"
                                        placeholder="First name"
                                        value={regFirstName}
                                        onChange={e => setRegFirstName(e.target.value)}
                                        disabled={atLimit}
                                    />
                                </div>
                                <div className="auth-field">
                                    <label className="auth-label">Last name</label>
                                    <input
                                        type="text"
                                        className="auth-input"
                                        placeholder="Last name"
                                        value={regLastName}
                                        onChange={e => setRegLastName(e.target.value)}
                                        disabled={atLimit}
                                    />
                                </div>
                                <div className="auth-field">
                                    <label className="auth-label">Email</label>
                                    <input
                                        type="email"
                                        className="auth-input"
                                        placeholder="your@email.com"
                                        value={regEmail}
                                        onChange={e => setRegEmail(e.target.value)}
                                        disabled={atLimit}
                                    />
                                </div>
                                <div className="auth-field">
                                    <label className="auth-label">Phone</label>
                                    <input
                                        type="tel"
                                        className="auth-input"
                                        placeholder="07XXXXXXXX"
                                        value={regPhone}
                                        onChange={e => setRegPhone(e.target.value)}
                                        disabled={atLimit}
                                        maxLength={10}
                                    />
                                </div>
                                <div className="auth-field auth-field-full">
                                    <label className="auth-label">Password</label>
                                    <input
                                        type="password"
                                        className="auth-input"
                                        placeholder="••••••••"
                                        value={regPassword}
                                        onChange={e => setRegPassword(e.target.value)}
                                        disabled={atLimit}
                                    />
                                </div>
                            </div>

                            <button
                                className="auth-btn"
                                onClick={handleRegister}
                                disabled={loading || atLimit}
                            >
                                {loading ? 'Creating account...' : 'Create account'}
                            </button>
                            <p className='auth-switch'>
                                Limit reached? -- log in on test@test.com / test123
                            </p>
                            <p className="auth-switch">
                                Already have an account?{' '}
                                <button
                                    className="auth-switch-btn"
                                    onClick={() => switchView('login')}
                                >
                                    Sign in here
                                </button>
                            </p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // ── Logged in ──────────────────────────────────────────────────────────────
    return (
        <div className="account-page">

            {/* Profile card */}
            <div className="account-glass-card">
                <div className="account-profile-header">
                    <div className="account-avatar">
                        <Icon.User size={32} />
                    </div>
                    <div>
                        <h2 className="account-name">{user.first_name} {user.last_name}</h2>
                        <p className="account-since">
                            Member since {new Date(user.created_at).toLocaleDateString('en-GB', {
                                month: 'long', year: 'numeric'
                            })}
                        </p>
                    </div>
                    <button className="logout-btn" onClick={onLogout}>
                        Sign out
                    </button>
                </div>

                <div className="account-details">
                    <h3 className="account-section-label">Personal details</h3>

                    {/* First name — read only, cannot be changed */}
                    <div className="account-detail-row">
                        <span className="detail-label">First name</span>
                        <div className="detail-value-row">
                            <span className="detail-value">{user.first_name}</span>
                        </div>
                    </div>

                    {/* Last name — read only */}
                    <div className="account-detail-row">
                        <span className="detail-label">Last name</span>
                        <div className="detail-value-row">
                            <span className="detail-value">{user.last_name}</span>
                        </div>
                    </div>

                    {/* Email — editable */}
                    <div className="account-detail-row">
                        <span className="detail-label">Email</span>
                        {editField === 'email' ? (
                            <div className="edit-inline">
                                <input
                                    type="email"
                                    className="edit-input"
                                    placeholder="New email address"
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                />
                                <input
                                    type="password"
                                    className="edit-input"
                                    placeholder="Confirm with your password"
                                    value={editPassword}
                                    onChange={e => setEditPassword(e.target.value)}
                                />
                                {editError && <span className="edit-error">{editError}</span>}
                                {editSuccess && <span className="edit-success">{editSuccess}</span>}
                                <div className="edit-actions">
                                    <button className="edit-save-btn" onClick={handleUpdate}>Save</button>
                                    <button className="edit-cancel-btn" onClick={() => setEditField(null)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="detail-value-row">
                                <span className="detail-value">{user.email}</span>
                                <button className="edit-trigger-btn" onClick={() => openEditField('email')}>
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Phone — editable */}
                    <div className="account-detail-row">
                        <span className="detail-label">Phone</span>
                        {editField === 'phone' ? (
                            <div className="edit-inline">
                                <input
                                    type="tel"
                                    className="edit-input"
                                    placeholder="New phone number"
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    maxLength={10}
                                />
                                <input
                                    type="password"
                                    className="edit-input"
                                    placeholder="Confirm with your password"
                                    value={editPassword}
                                    onChange={e => setEditPassword(e.target.value)}
                                />
                                {editError && <span className="edit-error">{editError}</span>}
                                {editSuccess && <span className="edit-success">{editSuccess}</span>}
                                <div className="edit-actions">
                                    <button className="edit-save-btn" onClick={handleUpdate}>Save</button>
                                    <button className="edit-cancel-btn" onClick={() => setEditField(null)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="detail-value-row">
                                <span className="detail-value">{user.phone || '—'}</span>
                                <button className="edit-trigger-btn" onClick={() => openEditField('phone')}>
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Ticket history card, return & download*/}
            <div className="account-glass-card">
                <h3 className="account-section-label">Booking history</h3>

                {ticketsLoading ? (
                    <p className="tickets-loading">Loading your tickets...</p>
                ) : tickets.length === 0 ? (
                    <div className="tickets-empty">
                        <p>No bookings yet. Search for a route to get started.</p>
                    </div>
                ) : (
                    <div className="tickets-list">
                        {tickets.map(ticket => {
                            const expanded = expandedTicketId === ticket.id;
                            const confirming = returningTicketId === ticket.id;
                            const returnable = isReturnable(ticket);

                            return (
                                <div
                                    key={ticket.id}
                                    className={`ticket-card ${expanded ? 'ticket-expanded' : ''} ${returnable ? 'ticket-returnable' : ''}`}
                                    onClick={() => {
                                        if (!confirming) {
                                            setExpandedTicketId(expanded ? null : ticket.id);
                                            setReturningTicketId(null);
                                            setReturnError('');
                                        }
                                    }}
                                >
                                    <div className="ticket-route">
                                        <span className="ticket-origin">{ticket.origin}</span>
                                        <span className="ticket-arrow">→</span>
                                        <span className="ticket-destination">{ticket.destination}</span>
                                        <span className="ticket-type-badge">{ticket.transport_type}</span>
                                        {/*So only ticket past in time will show as expired*/}
                                        {isExpired(ticket) && (
                                            <span className="ticket-expired-badge">Expired</span>
                                        )}
                                    </div>

                                    <div className="ticket-details">
                                        <div className="ticket-detail">
                                            <span className="ticket-detail-label">Passenger</span>
                                            <span className="ticket-detail-value">{ticket.passenger_full_name}</span>
                                        </div>
                                        <div className="ticket-detail">
                                            <span className="ticket-detail-label">Date</span>
                                            <span className="ticket-detail-value">
                                                {new Date(ticket.departure_date).toLocaleDateString('en-GB', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="ticket-detail">
                                            <span className="ticket-detail-label">Seat</span>
                                            <span className="ticket-detail-value">{ticket.seat_number}</span>
                                        </div>
                                        <div className="ticket-detail">
                                            <span className="ticket-detail-label">Price paid</span>
                                            <span className="ticket-detail-value">
                                                {parseFloat(ticket.final_price).toFixed(2)} SEK
                                            </span>
                                        </div>
                                    </div>

                                    {expanded && (
                                        <div
                                            className="ticket-actions"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <div className="ticket-actions-divider" />

                                            {!confirming ? (
                                                <div className="ticket-action-buttons">
                                                    <button
                                                        className="ticket-download-btn"
                                                        onClick={() => generateTicketPDF(ticket)}
                                                    >
                                                        Download PDF
                                                    </button>
                                                    {returnable && (
                                                        <button
                                                            className="ticket-return-btn"
                                                            onClick={() => setReturningTicketId(ticket.id)}
                                                        >
                                                            Return ticket
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="ticket-confirm-return">
                                                    <p className="ticket-confirm-text">
                                                        Are you sure you want to return this ticket?
                                                        Your seat will be released and may be taken by someone else.
                                                        This cannot be undone.
                                                    </p>
                                                    {returnError && (
                                                        <p className="ticket-return-error">{returnError}</p>
                                                    )}
                                                    <div className="ticket-action-buttons">
                                                        <button
                                                            className="ticket-return-confirm-btn"
                                                            onClick={() => handleReturnTicket(ticket.id)}
                                                        >
                                                            Yes, return ticket
                                                        </button>
                                                        <button
                                                            className="ticket-cancel-btn"
                                                            onClick={() => {
                                                                setReturningTicketId(null);
                                                                setReturnError('');
                                                            }}
                                                        >
                                                            Keep ticket
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Account;