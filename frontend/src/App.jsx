import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import io from 'socket.io-client';

import DisplayBooks from './components/DisplayBooks';
import SearchBook from './components/SearchBook';
import NewBook from './components/NewBook';
import UpdateBook from './components/UpdateBook';
import DeleteBook from './components/DeleteBook';
import Login from './components/Login';
import NotificationCenter from './components/NotificationCenter';

import './css/App.css';

// Global socket instance
let socket = null;

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isConnected, setIsConnected]       = useState(false);
  const [notifications, setNotifications]   = useState([]);
  const [authToken, setAuthToken]           = useState('');
  const [menuOpen, setMenuOpen]             = useState(false);

  // ── Socket.io setup
  useEffect(() => {
    socket = io('http://localhost:8080', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on('connect',    () => { setIsConnected(true); });
    socket.on('disconnect', () => { setIsConnected(false); });

    socket.on('notification', (data) => {
      if (data.type !== 'welcome') addNotification(data);
    });

    socket.on('book_created', (data) => { addNotification(data); setRefreshTrigger(p => !p); });
    socket.on('book_updated', (data) => { addNotification(data); setRefreshTrigger(p => !p); });
    socket.on('book_deleted', (data) => { addNotification(data); setRefreshTrigger(p => !p); });

    return () => { if (socket) socket.disconnect(); };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Notifications 
  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleRefresh = () => setRefreshTrigger(p => !p);

  const handleUserLogin = (username) => {
    addNotification({ type: 'welcome', message: `Welcome, ${username}! You are now signed in.` });
  };

  const handleLoginFailure = (errorMessage) => {
    addNotification({ type: 'loginFailed', message: `Sign-in failed: ${errorMessage}` });
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">

      {/* Skip to content — accessibility */}
      <a className="skip-link" href="#main-content">Skip to main content</a>

      {/* Real-time Notification Center */}
      <NotificationCenter
        notifications={notifications}
        removeNotification={removeNotification}
        isConnected={isConnected}
      />

      <Router>
        {/* Navbar */}
        <header>
          <nav className="navbar" role="navigation" aria-label="Main navigation">

            {/* Brand */}
            <Link to="/" className="navbar__brand" onClick={closeMenu}>
              Class<span>Book</span>
            </Link>

            {/* Mobile hamburger button */}
            <button
              className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-expanded={menuOpen}
              aria-controls="nav-links"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              type="button"
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>

            {/* Nav links — hidden on mobile, visible as dropdown when open */}
            <div
              id="nav-links"
              className={`navbar__links ${menuOpen ? 'open' : ''}`}
              role="menubar"
            >
              <NavLink to="/" end onClick={closeMenu}
                className={({ isActive }) => isActive ? 'nav-active' : ''}>
                {({ isActive }) =>
                  <button type="button" className={isActive ? 'nav-active' : ''}>
                    Browse
                  </button>
                }
              </NavLink>

              {authToken && (
                <>
                  <NavLink to="/add" onClick={closeMenu}
                    className={({ isActive }) => isActive ? 'nav-active' : ''}>
                    {({ isActive }) =>
                      <button type="button" className={isActive ? 'nav-active' : ''}>
                        Add Book
                      </button>
                    }
                  </NavLink>

                  <NavLink to="/manage" onClick={closeMenu}
                    className={({ isActive }) => isActive ? 'nav-active' : ''}>
                    {({ isActive }) =>
                      <button type="button" className={isActive ? 'nav-active' : ''}>
                        Manage
                      </button>
                    }
                  </NavLink>
                </>
              )}
            </div>

            {/* Auth panel */}
            <div className="navbar__auth">
              <Login
                authToken={authToken}
                setAuthToken={setAuthToken}
                onUserLogin={handleUserLogin}
                onLoginFailure={handleLoginFailure}
              />
            </div>
          </nav>

          {/* Connection status bar */}
          <div className="status-bar" role="status" aria-live="polite">
            <span
              className={`status-dot ${isConnected ? 'status-dot--on' : 'status-dot--off'}`}
              aria-hidden="true"
            />
            {isConnected
              ? 'Live updates on'
              : 'Connecting to server…'}
          </div>
        </header>

        {/* Main content */}
        <main id="main-content" className="main-content">

          {/* Login panel — shown on mobile (not in navbar) */}
          <div className="mobile-login-wrapper" aria-label="Sign in">
            <Login
              authToken={authToken}
              setAuthToken={setAuthToken}
              onUserLogin={handleUserLogin}
              onLoginFailure={handleLoginFailure}
            />
          </div>
          {!authToken && (
            <div className="banner banner--info" role="alert">
              <span aria-hidden="true">ℹ️</span>
              Please sign in above to access all features — add, update, or delete books.
            </div>
          )}

          <Routes>
            {/* ── Home / Browse ── */}
            <Route
              path="/"
              element={
                <>
                  {/* Hero banner — only on home page */}
                  <div className="hero" role="banner">
                    <h1 className="hero__title">Welcome to ClassBook</h1>
                    <p className="hero__sub">
                      Browse the library collection, search by author or ISBN,
                      and manage your books — all in one place.
                    </p>
                    <button
                      className="hero__cta"
                      onClick={() => document.getElementById('books-display')?.scrollIntoView({ behavior: 'smooth' })}
                      type="button"
                    >
                      Browse collection ↓
                    </button>
                  </div>

                  {/* Browse layout — stacks on mobile, side-by-side on desktop */}
                  <div id="browse-container">
                    <SearchBook />
                    <DisplayBooks refreshTrigger={refreshTrigger} />
                  </div>
                </>
              }
            />

            {/* Add Book */}
            <Route
              path="/add"
              element={
                <>
                  <nav className="breadcrumb" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="breadcrumb__sep" aria-hidden="true">›</span>
                    <span className="breadcrumb__current">Add Book</span>
                  </nav>
                  <h2 className="page-heading">Add a New Book</h2>
                  <NewBook onBookAdded={handleRefresh} authToken={authToken} />
                </>
              }
            />

            {/* Manage Books */}
            <Route
              path="/manage"
              element={
                <>
                  <nav className="breadcrumb" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="breadcrumb__sep" aria-hidden="true">›</span>
                    <span className="breadcrumb__current">Manage Books</span>
                  </nav>
                  <h2 className="page-heading">Manage Books</h2>

                  <div className="manage-grid">
                    <UpdateBook onBookUpdated={handleRefresh} authToken={authToken} />
                    <DeleteBook onBookDeleted={handleRefresh} authToken={authToken} />
                  </div>
                </>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="app-footer" role="contentinfo">
          <span>© 2026 ClassBook — Library Management System</span>
          <span>CPS 630 · Group Project · A3</span>
        </footer>

      </Router>
    </div>
  );
}

export default App;
