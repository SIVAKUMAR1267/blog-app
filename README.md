# Bloglist Application 📝

This is a full-stack blog application developed as part of the **Full Stack Open** course, specifically focusing on Part 7. The project extends the bloglist application from earlier parts of the course by adding features like routing, user views, and advanced state management.

---

## ✨ Features

* **User Authentication:** Users can sign up and log in to the application to manage their own blogs.
* **Blog Management:** Authenticated users can create, view, like, and delete their own blog posts.
* **Comments:** Users can add comments to blog posts.
* **User Views:**
    * A main view that lists all blog posts.
    * A separate view for all registered users, showing the number of blogs they have created.
    * Individual user pages that list all the blogs created by that specific user.
* **Routing:** The application uses **React Router** to provide smooth navigation between different views.
* **State Management:** The application's state is managed using **Redux** or **React Query** and Context, ensuring a clean and scalable architecture.
* **Styling:** The front end is styled with a modern UI framework like **React Bootstrap** or **Material-UI**.

---

## 🛠️ Technologies Used

This project is built using a **MERN (MongoDB, Express, React, Node.js)** stack.

### Frontend
* **React:** A JavaScript library for building user interfaces.
* **React Router:** For handling client-side routing and navigation.
* **Redux (or React Query/Context):** For centralized state management.
* **Axios:** A promise-based HTTP client for making API requests.
* **React Bootstrap / Material-UI:** For styling and UI components.

### Backend
* **Node.js:** A JavaScript runtime environment.
* **Express:** A fast, unopinionated, minimalist web framework for Node.js.
* **MongoDB:** A NoSQL database for storing blog and user data.
* **Mongoose:** An object data modeling (ODM) library for MongoDB and Node.js.
* **Bcrypt:** For password hashing and security.
* **JSON Web Tokens (JWT):** For user authentication.

---

## ⚙️ Installation

To run this project locally, follow these steps.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/SIVAKUMAR1267/blog-app.git](https://github.com/SIVAKUMAR1267/blog-app)
    cd Blog-app
    ```

2.  **Install dependencies:**
    npm install
    ```

3.  **Set up the environment variables for the backend:**
    Create a `.env` file in the `backend` directory with the following variables:
    ```
    MONGODB_URI=<Your MongoDB connection string>
    SECRET=<A strong, random secret key for JWT>
    ```

4.  **Start the backend server:**
    ```bash
    npm start
    ```