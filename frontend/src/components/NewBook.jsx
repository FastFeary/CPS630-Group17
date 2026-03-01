import { useState } from 'react';

function NewBook({ onBookAdded }) {
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    year: '',
    note: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newBook = {
      isbn: formData.isbn,
      title: formData.title,
      author: formData.author,
      year: parseInt(formData.year),
      note: formData.note
    };

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      });
      const result = await response.json();
      
      if (response.status === 201) {
        alert('Book added successfully!');
        setFormData({ isbn: '', title: '', author: '', year: '', note: '' }); // Reset form
        if (onBookAdded) onBookAdded(); // Refresh the book list
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <div id="new-form">
        <h2>Add New Book</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="number" 
            name="isbn" 
            placeholder="ISBN" 
            value={formData.isbn}
            onChange={handleChange}
            required 
          />
          <input 
            type="text" 
            name="title" 
            placeholder="Title" 
            value={formData.title}
            onChange={handleChange}
            required 
          />
          <input 
            type="text" 
            name="author" 
            placeholder="Author" 
            value={formData.author}
            onChange={handleChange}
            required 
          />
          <input 
            type="number" 
            name="year" 
            placeholder="Year" 
            value={formData.year}
            onChange={handleChange}
            required 
          />
          <input 
            type="text" 
            name="note" 
            placeholder="Note" 
            value={formData.note}
            onChange={handleChange}
            required 
          />
          <button type="submit">Add Book</button>
        </form>
      </div>
    </>
  );
}

export default NewBook;