import { useState } from 'react';

function NewBook({ onBookAdded, authToken }) {
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    year: '',
    note: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    //!! Class 3: block protected action if not logged in
    if (!authToken) {
      alert('Please login first to add books.');
      return;
    }

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
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(newBook)
      });
      const result = await response.json();
      
      if (response.status === 201) {
        setFormData({ isbn: '', title: '', author: '', year: '', note: '' }); // Reset form
        if (onBookAdded) onBookAdded(); // Refresh the book list
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
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
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