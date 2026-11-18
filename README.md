# Overview

Cloud Task Manager is a web application that allows users to manage their daily tasks using a cloud database. Users can create tasks, add descriptions and due dates, update information, mark tasks as completed, and delete tasks they no longer need.

The application connects to Google Firebase Firestore, which stores task information online instead of saving it directly on the computer. This allows the information to remain available after refreshing the browser.

To use the application, open the project with Live Server in Visual Studio Code. Enter a task title, description, due date, and status, then click Add Task. Saved tasks appear under My Tasks, where they can be edited, completed, or deleted.

I created this application to improve my understanding of cloud databases and learn how JavaScript communicates with Firebase. I also wanted to practice using asynchronous functions and performing database operations such as creating, reading, updating, and deleting records.

[Software Demo Video](https://youtu.be/Pm2R27Qty3E)

# Cloud Database

This project uses Google Firebase Cloud Firestore, a NoSQL cloud database.

Firestore stores data in collections and documents. Each document has a unique ID and contains fields with information about a task.

The application uses a collection named `tasks`.

Each task document contains the following fields:

- `title`: Name of the task.
- `description`: Additional information about the task.
- `dueDate`: Date when the task should be completed.
- `status`: Pending or Completed.
- `userId`: ID of the authenticated user.
- `createdAt`: Timestamp when the task was created.

The application uses Firebase Authentication with anonymous sign-in. This allows users to access their own tasks without creating a username and password.

JavaScript communicates with Firestore using the Firebase SDK to perform four database operations:

- Create: Add a new task.
- Read: Retrieve tasks from Firestore.
- Update: Edit task information or change its status.
- Delete: Remove a task from the database.

Firestore security rules restrict access to tasks belonging to the authenticated user.

# Development Environment

I developed this application using Visual Studio Code on macOS.

The project uses:

- HTML5 to create the application structure.
- CSS3 to design the user interface.
- JavaScript to handle user interactions and database operations.
- Firebase JavaScript SDK to communicate with Firebase.
- Google Cloud Firestore to store task information.
- Firebase Authentication for anonymous user authentication.
- Live Server to run and test the application locally.
- Git and GitHub for version control and publishing the project.

### AI Assistance

I used ChatGPT to help me with the design of the application, including the CSS styling, colors, layout, and task cards. ChatGPT also helped me understand how to connect JavaScript to Firebase and troubleshoot errors during development. I tested the application in VS Code and made changes as I worked on the project.

# Useful Websites

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [MDN JavaScript Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

# Future Work

- Add a search feature to find tasks by title.
- Add filters to display pending and completed tasks separately.
- Add task priorities such as low, medium, and high.
- Improve task organization by adding categories.
- Add Google sign-in so users can access their tasks from different devices.
