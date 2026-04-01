import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Initialize Socket.io connection on mount
  useEffect(() => {
    socket = io('http://localhost:8080', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    // Connection event
    socket.on('connect', () => {
      console.log('Connected to Socket.io server');
      setIsConnected(true);
    });

    // Disconnection event
    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
      setIsConnected(false);
    });

    // Notification event (ignore welcome message on initial connection)
    socket.on('notification', (data) => {
      console.log('Notification received:', data);
      if (data.type !== 'welcome') {
        addNotification(data);
      }
    });

    // Book created event
    socket.on('book_created', (data) => {
      console.log('Book created event:', data);
      addNotification(data);
      setRefreshTrigger(prev => !prev);
    });

    // Book updated event
    socket.on('book_updated', (data) => {
      console.log('Book updated event:', data);
      addNotification(data);
      setRefreshTrigger(prev => !prev);
    });

    // Book deleted event
    socket.on('book_deleted', (data) => {
      console.log('Book deleted event:', data);
      addNotification(data);
      setRefreshTrigger(prev => !prev);
    });

    // Cleanup on unmount
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const addNotification = (notification) => {
    const id = Date.now();
    const notificationWithId = { ...notification, id };
    
    setNotifications(prev => [...prev, notificationWithId]);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => !prev);
  };

  const handleUserLogin = (username) => {
    addNotification({
      type: 'welcome',
      message: `Welcome ${username}`
    });
  };

  const handleLoginFailure = (errorMessage) => {
    addNotification({
      type: 'loginFailed',
      message: `Login failed: ${errorMessage}`
    });
  };

  //store auth token in app state
  const [authToken, setAuthToken] = useState('');

  return (
    <>
      {/* Real-time Notification Center - Always visible */}
      <NotificationCenter 
        notifications={notifications} 
        removeNotification={removeNotification}
        isConnected={isConnected}
      />

      <Login authToken={authToken} setAuthToken={setAuthToken} onUserLogin={handleUserLogin} onLoginFailure={handleLoginFailure} />
      {/* //!! Class 3: show app features only when user is logged in */}
      {authToken && (
        <>
          <Router>
            <h1>Online Library System</h1>
            <nav>
              <Link to="/">Home</Link> |{" "}
              <Link to="/add">Add Book</Link> |{" "}
              <Link to="/manage">Manage Books</Link>
            </nav>

            <Routes>
              <Route
                path="/"
                element={
                  <div id="browse-container">
                    <SearchBook />
                    <DisplayBooks refreshTrigger={refreshTrigger} />
                  </div>
                }
              />

              <Route path="/add" element={
                <>
                  <h2>Add New Book</h2>
                  <NewBook onBookAdded={handleRefresh} authToken={authToken} />
                </>
              } />

              <Route path="/manage" element={
                <>
                  <h2>Manage Books</h2>
                  <UpdateBook onBookUpdated={handleRefresh} authToken={authToken} />
                  <DeleteBook onBookDeleted={handleRefresh} authToken={authToken} />
                </>
              } />
            </Routes>
          </Router>
        </>
      )}
    </>
  );
}

export default App;