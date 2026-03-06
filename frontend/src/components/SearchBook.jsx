import { useState } from 'react';

//let's search for books by author name (we won't spend time allowing a partial search - it must be exact match)
//partial search matching would be nice to add later though ;)
function SearchBook() {
  //set up our state variables
  const [author, setAuthor] = useState('');
  const [books, setBooks] = useState([]);
  const [searched, setSearched] = useState(false);

  //function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    //trim whitespace and check for empty input
    if (!author.trim()) {
      alert('Please enter an author name');
      return;
    }

    //use a try statement to catch any errors during the fetch
    try {
      //let's make the fetch call to our backend API
      //we use url encoding to handle special characters in author names
      //we must encode as we can't have characters like spaces in the URLs and the node/express backend will decode
      const response = await fetch(`/api/books/search?author=${encodeURIComponent(author)}`);
      const result = await response.json();
      
      //if the response is successful, we update our books state with the results and set searched to true to show results
      if (response.status === 200) {
        setBooks(result);
        setSearched(true);
      } else {
        alert('Error: ' + result.error);
        setBooks([]);
        setSearched(true);
      }
    } catch (error) {
      console.error('Error searching books:', error);
      alert(`An error occurred while searching for books. ${error.message}`);
    }
  };

  return (
    <>
      <div id="search-book" className="search-card">
        <h2>Search Books by Author</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Enter author name" 
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
              setSearched(false);
            }}
          />
          <button type="submit">Search</button>
        </form>

        {searched && (
          <>
            {books.length > 0 ? (
              <div id="search-results">
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
              <p>No books found for author "{author}".</p>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default SearchBook;
