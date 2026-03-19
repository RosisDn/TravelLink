import React, { useState, useEffect } from 'react'
import './account.css'
import * as Icon from '../../icons'

function Account() {
    // states för att hålla koll på vad som är inloggat, vilket flik som visas, och vad användaren skriver
    const [user, setUser] = useState(null);
    const [tab, setTab] = useState('login'); // 'login' eller 'register'
    const [username, setUsername] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // körs en gång när sidan laddas, kollar om någon redan är inloggad
    useEffect(() => {
        const saved = localStorage.getItem('user');
        if (saved) setUser(JSON.parse(saved));
    }, []);

    const handleLogin = () => {
        // hämtar alla sparade konton från localStorage
        const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
        // kollar om användarnamnet finns och lösenordet stämmer
        if (accounts[username] && accounts[username].password === password) {
            const userData = { username, ...accounts[username] };
            localStorage.setItem('user', JSON.stringify(userData)); // sparar inloggad användare
            setUser(userData);
            setError('');
        } else {
            setError('Fel användarnamn eller lösenord');
        }
    };

    const handleRegister = () => {
        // kollar att alla fält är ifyllda
        if (!username || !password || !email || !phone || !lastName) {
            setError('Fyll i alla fält');
            return;
        }
        const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
        // kollar att användarnamnet inte redan är taget
        if (accounts[username]) {
            setError('Användarnamnet är redan taget');
            return;
        }
        // sparar hela användarprofilen och loggar in direkt
        accounts[username] = { password, email, phone, lastName };
        localStorage.setItem('accounts', JSON.stringify(accounts));
        const userData = { username, email, phone, lastName };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setError('');
    };

    const handleLogout = () => {
        // tar bort användaren från localStorage och återställer alla fält
        localStorage.removeItem('user');
        setUser(null);
        setUsername('');
        setLastName('');
        setEmail('');
        setPhone('');
        setPassword('');
    };

    // om ingen är inloggad visas login/register formuläret
    if (!user) return (
        <div className="inspiration-content">
            <div className="glass-card login-card">
                <Icon.User size={48} />

                {/* flikar för att växla mellan logga in och skapa konto */}
                <div className="tab-switcher">
                    <button
                        className={`tab-btn ${tab === 'login' ? 'active' : ''}`}
                        onClick={() => { setTab('login'); setError(''); }}
                    >Logga in</button>
                    <button
                        className={`tab-btn ${tab === 'register' ? 'active' : ''}`}
                        onClick={() => { setTab('register'); setError(''); }}
                    >Skapa konto</button>
                </div>

                {/* visar felmeddelande om något går fel */}
                {error && <p className="error-msg">{error}</p>}

                <div className="login-form">
                    {tab === 'login' ? (
                        // inloggningsformulär
                        <>
                            <input
                                type="text"
                                placeholder="Användarnamn"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="login-input"
                            />
                            <input
                                type="password"
                                placeholder="Lösenord"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="login-input"
                            />
                            <button className="login-btn" onClick={handleLogin}>Logga in</button>
                        </>
                    ) : (
                        // registreringsformulär
                        <>
                            <input
                                type="text"
                                placeholder="Användarnamn"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="login-input"
                            />
                            <input
                                type="text"
                                placeholder="Efternamn"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                className="login-input"
                            />
                            <input
                                type="email"
                                placeholder="E-post"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="login-input"
                            />
                            <input
                                type="tel"
                                placeholder="Telefonnummer"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="login-input"
                            />
                            <input
                                type="password"
                                placeholder="Lösenord"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="login-input"
                            />
                            <button className="login-btn" onClick={handleRegister}>Skapa konto</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    // om användaren är inloggad visas profilsidan
    return (
        <div className="inspiration-content">

            {/* personuppgifter */}
            <div className="glass-card">
                <div className="account-header">
                    <Icon.User size={40} />
                    <h2 className="section-heading">Mitt konto</h2>
                </div>

                <div className="account-section">
                    <h3>Personuppgifter</h3>
                    <div className="account-row">
                        <span className="account-label">Användarnamn</span>
                        <span className="account-value">{user.username}</span>
                    </div>
                    <div className="account-row">
                        <span className="account-label">Efternamn</span>
                        <span className="account-value">{user.lastName || '—'}</span>
                    </div>
                    <div className="account-row">
                        <span className="account-label">E-post</span>
                        <span className="account-value">{user.email || '—'}</span>
                    </div>
                    <div className="account-row">
                        <span className="account-label">Telefon</span>
                        <span className="account-value">{user.phone || '—'}</span>
                    </div>
                </div>

                <button className="logout-btn" onClick={handleLogout}>Logga ut</button>
            </div>

            {/* biljetthistorik, fylls i när backend är klar */}
            <div className="glass-card">
                <h3 className="section-heading">Biljetthistorik</h3>
                <div className="ticket-placeholder">
                    <p>Inga bokningar ännu</p>
                </div>
            </div>

        </div>
    );
}

export default Account