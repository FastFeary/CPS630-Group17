# Backend Setup Documentation

## Overview
This backend implements a Node.js/Express server with MongoDB and Mongoose for managing a book library database.

## Requirements Met

### 1. **Node.js and Express Server**
- Express.js server running on `localhost:8080`
- CORS enabled for frontend communication
- Modular route structure with CRUD operations

### 2. **MongoDB Connection**
- Connects to MongoDB on `localhost:27017`
- Database: `book_library`
- Connection event handlers for logging and initialization

### 3. **Mongoose Integration**
- Book model with schema validation
- Fields: ISBN (Number, unique), title, author, year, hasImage, note
- Proper data type handling and validation

### 4. **Test Data Function - `addTestBooksToMongoDB()`**
- **Trigger**: Automatically runs when database connection is established
- **Functionality**: 
  - Checks if the `book` collection has any documents
  - If empty (collection doesn't exist or has no data), seeds database with 6 classic sci-fi books
  - If data exists, skips seeding to prevent duplicates
- **Books Seeded**:
  - The Three-Body Problem
  - The Dark Forest
  - Death's End
  - Contact (Carl Sagan)
  - Rendezvous With Rama (Arthur C. Clarke) - 2 editions

### 5. **API Routes**
All routes use MongoDB queries:

#### READ Operations
- `GET /api/books` - Retrieve all books
- `GET /api/books/isbn/:isbn` - Get book by ISBN
- `GET /api/books/search?author=name` - Search books by author (case-insensitive)

#### CREATE Operations
- `POST /api/books` - Add new book

#### UPDATE Operations
- `PATCH /api/books/isbn/:isbn` - Update book notes

#### DELETE Operations
- `DELETE /api/books/isbn/:isbn` - Delete book by ISBN

## Running the Server

### Prerequisites
1. **MongoDB Server** must be running locally on port 27017
   - Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
   - Start the MongoDB service

2. **Dependencies**: Already installed (express, mongoose, cors)

### Start the Server
```bash
npm run start
```

Or manually:
```bash
node server.js
```

### Expected Output
```
Server started on port: 8080
database connected!
Adding test books to db ...
Book added with ISBN 9780765382030
Book added with ISBN 9780765386694
Book added with ISBN 9780765386632
Book added with ISBN 9781501197987
Book added with ISBN 9780553287899
Book added with ISBN 9780358380221
All test books added successfully!
```

## File Structure
```
backend/
├── server.js          # Main Express server
├── models/
│   └── Book.js        # Mongoose Book schema
├── package.json       # Dependencies and scripts
└── SETUP.md          # This file
```

## Key Improvements Made
1. ✅ Fixed typo in error logging (`comnsole` → `console`)
2. ✅ Updated Database ISBN field type to match test data (String → Number)
3. ✅ Implemented proper async/await in seeding function
4. ✅ Used Promise.all() for concurrent saves
5. ✅ Converted all API routes to use MongoDB queries
6. ✅ Added proper error handling in all routes
7. ✅ Moved `addTestBooksToMongoDB()` call to database connection event
8. ✅ Enhanced ISBN parameter handling (converts to Number for queries)

## Testing
Use tools like Postman or curl to test the endpoints:

```bash
# Get all books
curl http://localhost:8080/api/books

# Get book by ISBN
curl http://localhost:8080/api/books/isbn/9780765382030

# Search by author
curl http://localhost:8080/api/books/search?author=Liu%20Cixin

# Add a new book
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -d '{"isbn":9780123456789,"title":"New Book","author":"Author Name","year":2024,"hasImage":false}'
```

## Troubleshooting
- **"Cannot connect to MongoDB"**: Ensure MongoDB service is running
- **"ISBN already exists"**: ISBN must be unique; remove the document or use a different ISBN
- **CORS errors**: Frontend should be on different port (Vite dev server on 5173, Express on 8080)
