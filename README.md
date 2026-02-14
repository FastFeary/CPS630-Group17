# **CPS630 Group 17 Assignment 1 (Class Booking System)**
    Contributors: 
    - Freddy Koehlmann (501050151) 
    - Abdullah Hachimi (501178743)
    - Naureen Hossain (501239728)
    - Celestino Gellido (501103802)

## Overview
This web application was designed with basic functionalities of Express servers, with web pages and routes, and a REST API handling interactions between the client and the server.

Fitted around the concept of class booking systems, the application allows the user to manage classes online at a local community centre by booking and removing classes on their account. They can even contribute by adding classes they would offer themselves to teach.

This system is fitted for future extensions and iterations, such as the functionality to process payments, manage scheduling, or even waitlist management for the application itself. A web application's potential for further implementation is a vital aspect of web development overall.

## Documentation
After unzipping the project and opening it in Visual Studio Code, open a terminal and run the command in order to use Express commands:

```
npm i
```
Run the server using the Express command in the same terminal:
```
node server.js
```
The site is run on localhost 8080, so once the command runs the user should access it in their preferred search engine by putting the address below in the search bar:
```
localhost:8080
```
Here, the user can freely book available classes on the "classes" page in the top right, by clicking "book" under the class they would like to book. After that, they can view their bookings under the "booked" page in the top right, which is also where they are able to remove their booked classes and it will return back to the classes page.

The user may also go under "add class" in the top right, and after filling out the name and details of the class, they can add it and it will update the current classes to include the user-submitted one.

Classes can also be deleted altogether through "delete class" under the current available classes, which after that will not be available until they add more classes to the website.

## Reflection (will fill rest out after testing)
Submitted material includes the Node.js server, one JSON file with a list of items/classes each with an id, title, description and image. There are also the HTML/CSS files for available classes, current bookings, and creating classes.

The main functions lie in server.js, with REST API routes providing interaction between the client and the server: GET may either retrieve all classes or a single class by ID, POST adds a new class to the JSON file, and DELETE removes classes by ID.

In terms of fundamental challenges, the one which came forefront were the get, post and delete functions. Once the basic logic was implemented, a minor success came in using appropriate status codes standard for web applications, such as 200 for a success and 404 for a failure in our REST routes. 

Major success came with the overall appearnance of the application, this iteration providing a neutral yet friendly interface suited for a community centre class booking application.
