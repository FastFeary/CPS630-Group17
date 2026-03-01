import { useState } from 'react';

function UpdateBook({ onBookUpdated }) {
  const [isbn, setIsbn] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedBook = {};
    if (note) {
      updatedBook.note = note;
    }

    try {
      const response = await fetch(`/api/books/isbn/${isbn}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBook)
      });
      const result = await response.json();
      
      if (response.status === 200) {
        alert('Book updated successfully!');
        setIsbn('');
        setNote('');
        if (onBookUpdated) onBookUpdated(); // Refresh the book list
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  return (
    <>
      <div id="update-book">
        <h2>Add Note (Update Book)</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="number" 
            placeholder="ISBN to Update" 
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required 
          />
          <input 
            type="text" 
            placeholder="New Note" 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required 
          />
          <button type="submit">Update Book</button>
        </form>
      </div>
    </>
  );
}

export default UpdateBook;