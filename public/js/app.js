//Book Library REST+CRUD scripts that handles all REST API calls
/*
    In this file we are handling teh following HTTP methods:
    - GET to retrieve data
    - POST to create new data
    - PATCH to update existing data
    - DELETE to remove data
    - What might a PUT method look like here?

    Each function interacts with the corresponding API endpoint defined in server.js
*/

//load books on page load
document.addEventListener('DOMContentLoaded', function() {
    loadItems();
});

//load all books (then display them)
async function loadItems() {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();
        displayBooks(items, 'items-display');
    } catch (error) {
        console.error('Error loading items:', error);
    }
}

//show all books
function displayBooks(books, containerId) {
    const container = document.querySelector('#' + containerId);
    if (books.length === 0) {
        container.innerHTML = '<p>No books found.</p>';
        return;
    }

    let bookHTMlStr = '';
    books.map(book => {
        const imageName = (book.hasImage ? book.isbn : 'PlaceholderBook') + '.jpg';
        bookHTMlStr += `<img src="/images/books/${imageName}" height="100"><p>ISBN: ${book.isbn}, Title: ${book.title}, Author: ${book.author}, Year: ${book.year}, Note: ${book.note}</p>`
    });
    container.innerHTML = bookHTMlStr;
}

// Add new book
//issue to consider for later is there is no check for a unique ISBN here (so we can have duplicates)
//also no way to add a new image URL. Maybe there should be a check to see if the image file exists on the server?
document.querySelector('#new-form').addEventListener('submit', async (e) => {
    e.preventDefault(); //prevent form submission
    const newBook = {
        isbn: parseInt(document.querySelector('#new-isbn').value),
        title: document.querySelector('#new-title').value,
        author: document.querySelector('#new-author').value,
        year: parseInt(document.querySelector('#new-year').value),
        note: document.querySelector('#new-note').value
    };
    try {
        const response = await fetch('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBook)
        });
        const result = await response.json();
        if (response.status === 201) {
            alert('Book added successfully!');
            loadItems(); // Refresh the list
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding book:', error);
    }
});

// Add note / Update book
document.querySelector('#update-form').addEventListener('submit', async (e) => {
    e.preventDefault();    //prevent form submission
    const isbn = parseInt(document.querySelector('#update-isbn').value);
    const updatedBook = {};
    const note = document.querySelector('#update-note').value;
    
    if (note) { 
        updatedBook.note = note;
    }

    console.log(note);

    try {
        const response = await fetch(`/api/books/isbn/${isbn}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBook)
        });
        const result = await response.json();
        if (response.status === 200) {
            alert('Book updated successfully!');
            loadItems(); // Refresh the list
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error updating book:', error);
    }
});

// Delete book
document.querySelector('#delete-form').addEventListener('submit', async (e) => {
    e.preventDefault(); //prevent form submission
    const isbn = parseInt(document.querySelector('#delete-isbn').value);
    try {
        const response = await fetch(`/api/books/isbn/${isbn}`, {
            method: 'DELETE'
        });
        if (response.status === 204) {
            alert('Book deleted successfully!');
            loadItems(); // Refresh the list
        } else {
            const result = await response.json();
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting book:', error);
    }
});