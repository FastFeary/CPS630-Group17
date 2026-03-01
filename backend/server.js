const express   = require('express');
const cors      = require('cors');
const app       = express();
const path      = require('path');
const { default: mongoose } = require('mongoose');
const Book = require('./models/Book');

const PORT          = 8080;
const DATABASE_HOST = 'localhost';
const DATABASE_PORT = 27017;

//Enable CORS for frontend requests
app.use(cors());

//database connect
const dbURL = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/book_library`;
mongoose.connect(dbURL);

const db = mongoose.connection;
db.on('error', function(e) {
    comnsole.log('error connecting:' + e);
});
db.on('open', function() {
    console.log('database connected!');
});

//The International Standard Book Number (ISBN) is a numeric commercial book identifier that is intended to be unique.
//we are using the ISBN 13 format more commonly used after 2007 to expand the numbering system capability
//Liu Cixin pronounced approximately as "Lee-ooo Suh-sheen"
let book_library = [
    { isbn:9780765382030, hasImage:true, title:"The Three-Body Problem",   author:"Liu Cixin",           year:2008, note:""},
    { isbn:9780765386694, hasImage:true, title:"The Dark Forest",          author:"Liu Cixin",           year:2008, note:""},
    { isbn:9780765386632, hasImage:true, title:"Death's End",              author:"Liu Cixin",           year:2010, note:""},
    { isbn:9781501197987, hasImage:true, title:"Contact",                  author:"Carl Sagan",          year:1985, note:""},
    { isbn:9780553287899, hasImage:true, title:"Rendezvous With Rama",     author:"Arthur C. Clarke",    year:1973, note:""},
    { isbn:9780358380221, hasImage:true, title:"Rendezvous With Rama",     author:"Arthur C. Clarke",    year:1973, note:""}
];

//!! let's add a function called addTestBooksToMongoDB()
//we will add soem test data to the database (if there is not already data in the database)
async function addTestBooksToMongoDB() {
    const bookCount = await Book.countDocuments();

    if (bookCount === 0) {
        console.log('Adding test books to db ...');

        book_library.forEach(book => {
            const newBook = new Book(book);
            newBook.save()
                .then(() => console.log('Book added with ISBN' + book.isbn))
                .catch(err => console.error('Error adding book with ISBN' + book.isbn + ' ' + err));
        });
    }
    else {
        console.log('Boosk already exist. Not adding test books.');
        return;
    }
}
addTestBooksToMongoDB();

//don't need this as our vite server is serving content.
// //we will only have one web page - maybe we can add more later
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '/views/index.html'));
// });

/*************************************************/
/********* Defining (CRUD) API routes ************/
/*************************************************/

/************************/
/******* SERVER *********/
/******** READ **********/
/************************/
//get all books
app.get('/api/books', (req, res) => {
    res.json(book_library);
    console.log(book_library);  //want to see results for debugging
});

/************************/
/******* SERVER *********/
/******** READ **********/
/************************/
//get book by ISBN (unique id)
//In Express.js route definitions, the colon (:) prefix indicates a route parameter (also called a path parameter)
app.get('/api/books/isbn/:isbn', (req, res) => {
    //compare ISBN as string to avoid precision loss with large numbers
    const isbn = req.params.isbn;
    //array.find() returns the first matching element (or undefined if none found)
    const book = book_library.find(b => b.isbn.toString() === isbn);
    if (book) {
        res.status(200).json(book); //status code 200 = OK
    } else {
        res.status(404).json({ error: "Book not found" });  //status 404 code = NOT FOUND
    }
});

/************************/
/******* SERVER *********/
/******** READ **********/
/************************/
//return a json object with all books that match the author (could be more than one e.g., multiple editions)
//ideally this search would be more flexible (e.g., partial match) but for simplicity we are doing an exact match here
//Consider what other cases to be checked and status codes might be appropriate in some of these functions ...
//Using query parameter to avoid route conflicts: /api/books/search?author=AuthorName
app.get('/api/books/search', (req, res) => {
    const bookAuthor = req.query.author;
    
    if (!bookAuthor) {
        return res.status(400).json({ error: "Author query parameter is required" });
    }

    //remember === in JavaScript is a strict equality operator that checks for both value and type equality.
    //both lowercase to reduce case sensitivity check issues (still does not handle partial matches or special characters)
    //array.filter() returns an array of all matching elements
    const books = book_library.filter(b => b.author.toLowerCase() === bookAuthor.toLowerCase());
    if (books.length > 0) {
        res.status(200).json(books);
    } else {
        res.status(404).json({ error: "Book(s) not found" });
    }
});

/************************/
/******* SERVER *********/
/******* CREATE *********/
/************************/
//create new book
app.post('/api/books', express.json(), (req, res) => {
    const newBook = req.body;
    if (newBook && newBook.title && newBook.author && newBook.year) {

        if (!newBook.hasImage) {
            newBook.hasImage = false; //default value
        }

        book_library.push(newBook);
        res.status(201).json(newBook);
    } else {
        res.status(400).json({ error: "Invalid book data" });
    }
});

/************************/
/******* SERVER *********/
/******* UPDATE *********/
/************************/
//add note / update book by unique id, i.e., ISBN
app.patch('/api/books/isbn/:isbn', express.json(), (req, res) => {
    console.log("PATCH request received");

    const bookId = req.params.isbn;
    const updatedBook = req.body;
    const bookIndex = book_library.findIndex(b => b.isbn.toString() === bookId);
    if (bookIndex !== -1) {
        book_library[bookIndex].note = updatedBook.note;
        res.status(200).json(book_library[bookIndex]);
    } else {
        res.status(404).json({ error: "Book not found" });
    }
}); 

/************************/
/******* SERVER *********/
/******* DELETE *********/
/************************/
//delete by unique id, i.e., ISBN (can only delete one)
app.delete('/api/books/isbn/:isbn', (req, res) => {
    const bookId = req.params.isbn;
    const bookIndex = book_library.findIndex(b => b.isbn.toString() === bookId);
    if (bookIndex !== -1) {
        book_library.splice(bookIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: "Book not found" });
    }
});

//starts server
app.listen(PORT, () => { console.log("Server started on port: " + PORT) });