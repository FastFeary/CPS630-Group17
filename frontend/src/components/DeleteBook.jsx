import { useState } from 'react';

function DeleteBook({ onBookDeleted }) {
  const [isbn, setIsbn] = useState('');

  console.log(isbn);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/books/isbn/${isbn}`, {
        method: 'DELETE'
      });
      
      if (response.status === 204) {
        alert('Book deleted successfully!');
        setIsbn('');
        if (onBookDeleted) onBookDeleted(); // Refresh the book list
      } else {
        const result = await response.json();
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <>
      <div id="delete-book">
        <h2>Delete Book</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="number" 
            placeholder="ISBN to Delete" 
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required 
          />
          <button type="submit">Delete Book</button>
        </form>
      </div>
    </>
  );
}

export default DeleteBook;
    