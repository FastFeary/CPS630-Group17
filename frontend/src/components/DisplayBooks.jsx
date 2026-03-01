import { useState, useEffect } from 'react';

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

  //without refreshTrigger, this would only load once on mount
  //without the dependency array, this would load on every render (infinite loop) - BAD!
  useEffect(() => {
    loadBooks();
  }, [refreshTrigger]); // Reload when refreshTrigger changes

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
      <h2>Display All Books</h2>
      <div id="books-display">
        {books.map(book => {
          const imageName = (book.hasImage ? book.isbn : 'PlaceholderBook') + '.jpg';
          return (
            <div key={book.isbn}>
              <img src={`/images/books/${imageName}`} height="100" alt={book.title} />
              <p>
                ISBN: {book.isbn}, Title: {book.title}, Author: {book.author}, 
                Year: {book.year}, Note: {book.note}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default DisplayBooks;