# **CPS630 Group 17 Assignment 2 (Library Book System)**
    Contributors: 
    - Freddy Koehlmann (501050151) 
    - Abdullah Hachimi (501178743)
    - Naureen Hossain (501239728)
    - Celestino Gellido (501103802)

##  Overview
This web application builds on the ideas and foundation of the previously built application in a new context, but serves to stand as a medium-fidelity MERN application. 

The concept for this iteration revolves around a Library Book System, in which users can create, read, update, and delete books within the library based on information such as author name and isbn inputted by said user. The purpose of this application is to demonstrate the basic functions of a web application's backend and frontend, while maintaining full interaction with a database.

The general framework of the book schema is utilized in such a way to emulate the user experience of checking out books in a library through a computer system. Instead of just seeing it as an emulated database in JSON files, the user can see it through the library's book database being updated in real time.

## Documentation
Prior to interacting with the project any further, ensure that MongoDB and MongoDB Compass are installed using the links below. Both will ensure connection to the database and show the connections made during the running of the frontend and backend.

MongoDB: <ins>https://www.mongodb.com/try/download/community</ins>

MongoDB Compass: <ins>https://www.mongodb.com/try/download/compass</ins>


Upon download of the project, unzip the file and open in Visual Studio Code.

Open two terminals, and on either one use the command: 
```
brew services start mongodb/brew/mongodb-community
```
This will connect us to localhost. Open MongoDB Compass and click connect on the left to the port 27017 which is the MongoDB port.

On one terminal, use the command:
```
cd frontend && npm install
```
and on the other, use:
```
cd backend && npm install
```
Essentially, one terminal will run the backend plus the server, and the other will run the frontend and the page itself.

On the backend terminal, run the command:
```
npm run start
```
Now that there is a connection to the database, go the the Compass and refresh beside localhost to see book_library. This will be important in seeing the user's interactions.

From here you can open up the frontend by using the following on the frontend terminal:
```
npm run dev
```
Open a web broswer and enter the address in the search bar:
```
localhost:5173
```
Now on the home page, we can see the library's catalogue of books available. The user can search for books by providing the full first and last name of the author (e.g. "Liu Cixin", not just "Liu" or "Cixin") in the search bar and then clicking search.

The navigation bar on the top can take the user to the Add Book and Manage Books page. On Add Book, it will prompt the user to fill out the fields of the ISBN, title, author, year, and note of the book they would like to add to the catalog. Once clicking Add Book, checking the home page will now include the updated book. 

Upon doing that however, access the MongoDB Compass and click the refresh documents button near the right, now notice the new book is properly added to the database as well. 

Manage Books will take the user to the next page of updating and deleting books. The functions operate in a similar way before but the update operation requires the ISBN and the new note to replace for the intended book. Deleting books also requires the ISBN, just like the add book operation, executing will see the book gone from the frontend catalog in the home page and the database in the Compass once refreshed.


## Reflection
Submitted material primarily includes the backend and frontend of the application. The backend is structured in the standard Node.js and Express frameworks, with the book schema containing key information such as author name, book title, isbn, and year. Both server.js and the book schema were designed to ensure connection to MongoDB/Mongoose, and contain the main functions of the application. The frontend is implemented with React+Vite  framework with multiple views, each jsx component serving specific CRUD operations situated inside server.js through the REST API. 

The overlying functions of the application follow the CRUD principles. The user can navigate through the application with the navigation bar overhead. They are able to view the library catalog and search for books according to the author's first and last name, can add books to the catalog on one page, and update or delete books in the other.

During the process of making this application, we were able to navigate the encountered challenges with practiced ease. A notable challenge involved the Read operation from the REST API. It was quickly realized that both the author's first and last name are required for the operation to work properly. However the successes came when they mattered, such as establishing the connection on MongoDB and developing the remainder of the REST API.
