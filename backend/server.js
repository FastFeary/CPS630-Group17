const express   = require('express');
const cors      = require('cors');
const app       = express();
const path      = require('path');
const { default: mongoose } = require('mongoose');
const http      = require('http');
const { Server: SocketIOServer } = require('socket.io');
const Book = require('./models/Book');

const PORT          = 8080;
const DATABASE_HOST = 'localhost';
const DATABASE_PORT = 27017;

//Basic Auth Values from Node environment variables
const AUTH_USERNAME = process.env.AUTH_USERNAME;
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

// Create HTTP server and Socket.io instance
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

//Enable CORS for frontend requests
app.use(cors());

//database connect
const dbURL = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/book_library`;
mongoose.connect(dbURL);

const db = mongoose.connection;
const booksColl = db.collection("books");
db.on('error', function(e) {
    console.log('error connecting:' + e);
});
db.on('open', function() {
    console.log('database connected!');
    addTestBooksToMongoDB();
});

//Socket.io Connection Handler
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle client sending a message
    socket.on('message', (data) => {
        console.log('Message received:', data);
        // Broadcast the message to all connected clients
        io.emit('message', data);
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });

    // Send welcome message to the connected client
    socket.emit('notification', {
        type: 'welcome',
        message: 'Welcome to the Library System! You are now connected.'
    });
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
//we will add some test data to the database (if there is not already data in the database)
async function addTestBooksToMongoDB() {
    try {
        const bookCount = await Book.countDocuments();

        if (bookCount === 0) {
            console.log('Adding test books to db ...');

            const savePromises = book_library.map(book => {
                const newBook = new Book(book);
                return newBook.save()
                    .then(() => console.log('Book added with ISBN ' + book.isbn))
                    .catch(err => console.error('Error adding book with ISBN ' + book.isbn + ': ' + err));
            });

            await Promise.all(savePromises);
            console.log('All test books added successfully!');
        }
        else {
            console.log('Books already exist. Not adding test books.');
        }
    } catch (err) {
        console.error('Error in addTestBooksToMongoDB: ' + err);
    }
}

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    //we are expecting the auth header to be in the format "Bearer <token>", so we check for that and extract the token
    //"Bearer " is part of the HTTP standard for authorization headers and indicates that the client is sending a token for authentication.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    const token = authHeader.substring(7); //just extract token part after "Bearer "
    if (token !== AUTH_TOKEN) {
        return res.status(401).json({ error: 'Invalid auth token' });
    }

    next();
}

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
/******* AUTH ***********/
/************************/
//Simple login route that returns a static demo token
app.post('/api/auth/login', express.json(), (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
        return res.status(200).json({
            message: 'Login successful',
            token: AUTH_TOKEN
        });
    }

    return res.status(401).json({ error: 'Invalid username or password' });
});

/************************/
/******* SERVER *********/
/******** READ **********/
/************************/
//get all books
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
        console.log('Retrieved ' + books.length + ' books from database');  //want to see results for debugging
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving books: ' + err });
    }
});

/************************/
/******* SERVER *********/
/******** READ **********/
/************************/
//get book by ISBN (unique id)
//In Express.js route definitions, the colon (:) prefix indicates a route parameter (also called a path parameter)
app.get('/api/books/isbn/:isbn', async (req, res) => {
    try {
        //convert ISBN to number to match the database type
        const isbn = Number(req.params.isbn);
        //findOne() returns the first matching document (or null if none found)
        const book = await Book.findOne({ isbn: isbn });
        if (book) {
            res.status(200).json(book); //status code 200 = OK
        } else {
            res.status(404).json({ error: "Book not found" });  //status 404 code = NOT FOUND
        }
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving book: ' + err });
    }
});

/************************/
/******* SERVER *********/
/******** READ **********/
/************************/
//return a json object with all books that match the author (could be more than one e.g., multiple editions)
//ideally this search would be more flexible (e.g., partial match) but for simplicity we are doing an exact match here
//Enhanced search: supports partial matching by author, ISBN, or year
//Using query parameters: /api/books/search?author=Name&isbn=123&year=2020
app.get('/api/books/search', async (req, res) => {
    try {
        const { author, isbn, year } = req.query;
        
        // At least one search parameter must be provided
        if (!author && !isbn && !year) {
            return res.status(400).json({ error: "Please provide at least one search parameter (author, isbn, or year)" });
        }

        // Build dynamic filter using regex for partial, case-insensitive matching
        const bookFilter = {};
        
        if (author) {
            // Partial match, case-insensitive
            bookFilter.author = { $regex: author, $options: 'i' };
        }
        
        if (isbn) {
            // Exact match for ISBN or partial if provided as string
            bookFilter.isbn = { $regex: isbn, $options: 'i' };
        }
        
        if (year) {
            // Exact year match
            bookFilter.year = parseInt(year);
        }

        const books = await booksColl.find(bookFilter).toArray();
        if (books.length > 0) {
            res.status(200).json(books);
        } else {
            res.status(404).json({ error: "No books found matching your search criteria" });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error searching books: ' + err });
    }
});

/************************/
/******* SERVER *********/
/******* CREATE *********/
/************************/
//create new book
app.post('/api/books', requireAuth, express.json(), async (req, res) => {
    try {
        const newBook = req.body;
        if (newBook && newBook.title && newBook.author && newBook.year) {

            if (!newBook.hasImage) {
                newBook.hasImage = false; //default value
            }

            const book = new Book(newBook);
            const savedBook = await book.save();
            
            // Emit real-time notification to all connected clients
            io.emit('book_created', {
                type: 'book_added',
                message: `New book added: "${savedBook.title}" by ${savedBook.author}`,
                book: savedBook
            });
            
            res.status(201).json(savedBook);
        } else {
            res.status(400).json({ error: "Invalid book data" });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error creating book: ' + err });
    }
});

/************************/
/******* SERVER *********/
/******* UPDATE *********/
/************************/
//update book by ISBN(unique)
app.patch('/api/books/isbn/:isbn', requireAuth, express.json(), async (req, res) => {
    try {
        console.log("PATCH request received");

        const bookISBN = Number(req.params.isbn);
        const bookFilter = { isbn: bookISBN };
        
        const newNote = req.body.note;
        const updateNote = {
            $set: {
                note: newNote
            },
        };

        const book = await booksColl.updateOne(bookFilter, updateNote);
        if (book) {
            // Emit real-time notification to all connected clients
            io.emit('book_updated', {
                type: 'book_modified',
                message: `Book with ISBN ${bookISBN} has been updated`,
                isbn: bookISBN,
                note: newNote
            });
            
            res.status(200).json(book);
        } else {
            res.status(404).json({ error: "Book not found" });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error updating book: ' + err });
    }
}); 

/************************/
/******* SERVER *********/
/******* DELETE *********/
/************************/
//delete by unique id, i.e., ISBN (can only delete one)
app.delete('/api/books/isbn/:isbn', requireAuth, async (req, res) => {
    try {
        const bookISBN = Number(req.params.isbn);
        const bookFilter= { isbn: bookISBN };

        const book = booksColl.deleteOne(bookFilter);
        if (book) {
            // Emit real-time notification to all connected clients
            io.emit('book_deleted', {
                type: 'book_removed',
                message: `Book with ISBN ${bookISBN} has been deleted`,
                isbn: bookISBN
            });
            
            res.status(204).send();
        } else {
            res.status(404).json({ error: "Book not found" });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error deleting book: ' + err });
    }
});

//starts server
server.listen(PORT, () => { console.log("Server started on port: " + PORT) });