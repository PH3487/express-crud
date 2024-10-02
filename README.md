# Express JWT Authentication

This is a simple Express.js application that implements basic user authentication using JSON Web Tokens (JWT). It includes features for user registration, login, and protected routes. The application uses MySQL as the database and bcrypt for password hashing.

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)


## Features

- User Registration
- User Login
- Protected Routes with JWT Authorization
- Input Validation using `express-validator`
- Basic Books CRUD

## Project Structure

```
📂 express-crud
├── 📂 controllers
│   └── authController.js                       # Handles login, registration, and user info
│   └── booksController.js                      # Handles CRUD operations for books
├── 📂 middlewares
│   └── auth.js                                 # JWT Authentication middleware
├── 📂 routes
│   └── auth.js                                 # Auth-related routes (login, register, me)
│   └── books.js                                # Books-related routes (CRUD)
│   └── index.js                                # Main router that includes all routes
├── 📂 sql
│   └── express-jwt.sql                         # SQL file
├── 📂 utils
│   └── db.js                                   # Database connection utility
│   └── jwt.js                                  # JWT utility functions (sign, verify)
├── .env                                        # Environment variables
├── .gitignore                                  # Gitignore file
├── Express JWT Auth.postman_collection.json    # Postman collection
├── index.js                                    # Main Express application file
├── LICENSE                                     # License file
├── package.json                                # Project dependencies and scripts
└── README.md                                   # Project documentation (this file)
```

## Getting Started

### Prerequisites

- Node.js (v14.x or later)
- MySQL Database
- Postman (for API testing, optional)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/PH3487/express-crud.git
   ```

2. Navigate to the project directory:

   ```bash
   cd express-crud
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_db_password
   DB_NAME=your_database_name
   ```

5. Set up the MySQL database:
   - Create a MySQL database matching the name in `.env`.
   - Import sql file from sql/express-jwt.sql
   - Run any necessary migrations or use your preferred database migration tool.

### Running the Application

To start the application in development mode:

```bash
npm run dev
```

The application will be running at: `http://localhost:3000`.

### Postman Collection

A Postman collection is available for testing the API endpoints. You can import it by using the following steps:

1. Import the `Express JWT Auth.postman_collection.json` file (located in the project root) into Postman.
2. Ensure that you set up the environment with the variable `HOST` set to `http://localhost:3000`.

### API Endpoints

#### **POST** `/auth/register`

- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "username": "newuser",
    "password": "newpassword"
  }
  ```

#### **POST** `/auth/login`

- **Description**: Log in with username and password
- **Request Body**:
  ```json
  {
    "username": "newuser",
    "password": "newpassword"
  }
  ```
- **Response**:
  - Success: Returns a JWT token
  ```json
  {
    "success": true,
    "message": "Logged in successfully",
    "data": {
      "uid": "user_id",
      "token": "jwt_token"
    }
  }
  ```

#### **GET** `/auth/me`

- **Description**: Get logged-in user details (Protected)
- **Headers**:
  - `Authorization: Bearer <jwt_token>`

#### **Books CRUD**

##### **GET** `/books`

- **Description**: Get all books
- **Response**:
  ```json
  {
    "books": [...]
  }
  ```

##### **GET** `/books/:id`

- **Description**: Get a specific book by ID
- **Response**:
  ```json
  {
    "book": {...}
  }
  ```

##### **POST** `/books`

- **Description**: Add a new book (Protected)
- **Headers**:
  - `Authorization: Bearer <jwt_token>`
- **Request Body**:
  ```json
  {
    "bookName": "Book Title",
    "bookDescription": "Description",
    "bookPrice": 19.99
  }
  ```

##### **PUT** `/books`

- **Description**: Update a book (Protected)
- **Headers**:
  - `Authorization: Bearer <jwt_token>`
- **Request Body**:
  ```json
  {
    "bookId": 1,
    "bookName": "Updated Book Title",
    "bookDescription": "Updated Description",
    "bookPrice": 24.99
  }
  ```

##### **DELETE** `/books`

- **Description**: Delete a book (Protected)
- **Headers**:
  - `Authorization: Bearer <jwt_token>`
- **Request Body**:
  ```json
  {
    "bookId": 1
  }
  ```

### Running Tests

To run the tests using Jest and Supertest:

```bash
npm test
```

### License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
