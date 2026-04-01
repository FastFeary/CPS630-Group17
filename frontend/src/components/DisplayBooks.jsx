import { useState, useEffect } from 'react';
import io from 'socket.io-client';

function DisplayBooks({ refreshTrigger }) {
  const [books, setBooks] = useState([]);

  const loadBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  // Load books on mount and when refreshTrigger changes
  useEffect(() => {
    loadBooks();
  }, [refreshTrigger]);

  // Listen for real-time Socket.io events and refresh books
  useEffect(() => {
    const socket = io('http://localhost:8080');

    const handleRefresh = () => {
      loadBooks();
    };

    socket.on('book_created', handleRefresh);
    socket.on('book_updated', handleRefresh);
    socket.on('book_deleted', handleRefresh);

    return () => {
      socket.off('book_created', handleRefresh);
      socket.off('book_updated', handleRefresh);
      socket.off('book_deleted', handleRefresh);
      socket.disconnect();
    };
  }, []);

  if (books.length === 0) {
    return (
      <>
        <h2>Display All Books</h2>
        <div id="books-display">
          <p>No books found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h2>Browse Books</h2>
      <div id="books-display">
        {books.map(book => {
          const imageName = (book.hasImage ? book.isbn : 'PlaceholderBook') + '.jpg';
          return (
            <div key={book.isbn} className="book-card">
              <img src={`/images/books/${imageName}`} height="120" alt={book.title} />
              <div className="book-info">
                <p><strong>{book.title}</strong></p>
                <p>Author: {book.author}</p>
                <p>ISBN: {book.isbn}</p>
                <p>Year: {book.year}</p>
                {book.note && <p>Note: {book.note}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default DisplayBooks;