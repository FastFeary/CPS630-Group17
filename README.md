# **CPS630 Group 17 Assignment 3 (Class Booking System)**
    Contributors: 
    - Freddy Koehlmann (501050151) 
    - Abdullah Hachimi (501178743)
    - Naureen Hossain (501239728)
    - Celestino Gellido (501103802)

## Overview
This web application rounds out all previous iterations to become a high-fidelity MERN application with additional components and changes to achieve a better user-friendly environment. 

In this final iteration we return to the initial concept from the first iteration, then borrowing the knowledge from the second to facilitate a more authentic user experience. So the concept is in line with the user booking classes at a community college, or creating classes they wish to teach.


## Documentation
Ensure that MongoDB and MongoDB Compass are installed, that way a connection is established between the database and the frontend, using the links below.

MongoDB: <ins>https://www.mongodb.com/try/download/community</ins>

MongoDB Compass: <ins>https://www.mongodb.com/try/download/compass</ins>

Download the project and open it through Visual Studio Code, ensure the Compass is running in tandem.

Upon opening two terminals, use the following command on either one:

```
brew services start mongodb/brew/mongodb-community
```

Open MongoDB Compass and click connect on the left.

On one terminal in VSCode, switch to the frontend and install Node by using the command:

```
cd frontend && npm install
```
On the other, switch to the backend and do the same with the command:
```
cd backend && npm install
```

Run the backend on the backend terminal using:
```
npm run start
```
and the frontend using the frontend terminal with:
```
npm run dev
```
Once both are running, open up a web browser and go to the following address in the search bar:
```
localhost:5173
```

Now, the user must log in before accessing any of the features available for use.

Basic users can only book/unbook classes, while admin users can add, update, and delete classes on top of booking (exclusive for an admin, so basic users cannot do those functions). Searching for classes is universal for both, only the instructor's name or class code can be used in the browse tab.

To log in as a basic user, the username is: **BasicUser2** and password is **TestPassword123**. You can only book classes by clicking book class under the desired class below in the Browse tab. You can then view booked classes in the Booked Classes tab, where you can also remove those classes from your bookings.

To log in as an admin user, the username is: **AdminUser1** and password is **Ch@rliePapaS1erra630**.

As an admin, the Add Class tab will take you to a page to fill out class details (Class Code, Class Name, Instructor name, Duration, Schedule, and an optional note). Once they've been filled out, click on Add Class and it will be added to the classes in the Browse tab.

Manage Classes tab will take you to the Update class and Delete class functions. To update, fill out the class code and the new note, and clicking Update Class will be carry out the change. In a similar fashion, fill out the class code in the Delete Class section, and clicking Delete Class will remove the class entirely.

All of the previously described functions will not only be visible on the frontend but the backend too, if the user keeps track using the Compass, refreshing every time a change has been made.

Notifications will also let the user when actions such as adding classes or booking classes have been executed successfully or unsuccessfully.

## Reflection
Submitted content for the final submission includes the frontend and backend, otherwise referred to as the key components of the MERN application.

Models on the backend have been changed to account for bookings, classes, and users. The frontend UI is more streamlined, and now features fields where you can login with username and password. Notifications are implemented using Socket.io to establish real-time communication between client and server, in the corner it shows the status of connection to the backend database. So if the user disconnected the backend while the frontend was running, it will know.

Authentication is structured in three parts: user creation, user login, and REST calls. In user creation, the password is hashed with bcrypt, then username, passwordHash and permission are stored in mongoDB. There is also an unused REST api for creating new users. For user login, it searches MongoDB for username and retrieves passwordHash and permission. Then verifies comparing with bcrypt that the submitted plaintext password fits with stored passwordHash. After that a JavaWebToken is created and sent with username and permission. Finally, on REST calls, requireAuth function is called to verify the JWT and checks if they have needed permission. It also sends back decrypted username in JWT token.

A major challenge that was overcome was the authentication for specific functions for an admin user. Initially an admin user could not add or update classes. But through inspection and debugging showed that the requireAuth function was being called before request.json. Which made it so requests and their payloads weren't being carried out from the frontend to backend. Switching the positions of the calls allowed the authentication to execute at a reasonable point in the request process.
