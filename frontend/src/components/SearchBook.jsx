import { useState } from 'react';

function SearchBook() {
  // State variables for multiple search fields
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [year, setYear] = useState('');
  const [books, setBooks] = useState([]);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Check if at least one search field is filled
    if (!author.trim() && !isbn.trim() && !year.trim()) {
      setErrorMessage('Please enter at least one search criterion (author, ISBN, or year)');
      setBooks([]);
      setSearched(false);
      return;
    }

    try {
      // Build query parameters dynamically
      const params = new URLSearchParams();
      if (author.trim()) params.append('author', author);
      if (isbn.trim()) params.append('isbn', isbn);
      if (year.trim()) params.append('year', year);

      const response = await fetch(`/api/books/search?${params.toString()}`);
      const result = await response.json();

      if (response.status === 200) {
        setBooks(result);
        setErrorMessage('');
      } else {
        setErrorMessage(result.error || 'No books found');
        setBooks([]);
      }
      setSearched(true);
    } catch (error) {
      console.error('Error searching books:', error);
      setErrorMessage(`An error occurred: ${error.message}`);
      setBooks([]);
      setSearched(true);
    }
  };

  const handleClear = () => {
    setAuthor('');
    setIsbn('');
    setYear('');
    setBooks([]);
    setSearched(false);
    setErrorMessage('');
  };

  return (
    <>
      <div id="search-book" className="search-card">
        <h2>Search Books</h2>
        <form onSubmit={handleSubmit}>
          <div className="search-fields">
            <div className="search-field">
              <label htmlFor="author">Author (partial match):</label>
              <input 
                id="author"
                type="text" 
                placeholder="e.g., 'Liu' or 'Carl'" 
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            <div className="search-field">
              <label htmlFor="isbn">ISBN:</label>
              <input 
                id="isbn"
                type="text" 
                placeholder="e.g., '9780765'" 
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
              />
            </div>

            <div className="search-field">
              <label htmlFor="year">Year:</label>
              <input 
                id="year"
                type="number" 
                placeholder="e.g., 2008" 
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>

          <div className="search-buttons">
            <button type="submit">Search</button>
            <button type="button" onClick={handleClear}>Clear</button>
          </div>
        </form>

        {errorMessage && (
          <div className="search-error">
            <p>{errorMessage}</p>
          </div>
        )}

        {searched && (
          <>
            {books.length > 0 ? (
              <div id="search-results">
                <p className="result-count">Found {books.length} book(s)</p>
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
            ) : (
              <p className="no-results">No books found matching your search criteria.</p>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default SearchBook;
