import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import DisplayBooks from './components/DisplayBooks';
import SearchBook from './components/SearchBook';
import NewBook from './components/NewBook';
import UpdateBook from './components/UpdateBook';
import DeleteBook from './components/DeleteBook';

import './css/App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleRefresh = () => {
    setRefreshTrigger(prev => !prev);
  };

  return (
    <Router>
      {/* Navigation Links */}
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
          <NewBook onBookAdded={handleRefresh} />
        </>
      } />

      <Route path="/manage" element={
        <>
          <h2>Manage Books</h2>
          <UpdateBook onBookUpdated={handleRefresh} />
          <DeleteBook onBookDeleted={handleRefresh} />
        </>
      } />
    </Routes>
    </Router>
  );
}

export default App;