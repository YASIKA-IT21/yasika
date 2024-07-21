## Project Description
This project is a web application that allows users(admin) to create ,manage employees and their details. It includes features such as user authentication, employee creation, listing, and deletion.

## Features
- User Authentication (Login and Signup)
- Create, Read, Update, and Delete (CRUD) operations for employees
- JWT-based user authentication
- Search and Sort functionality for employee list
- Responsive design

## Technologies Used
- **Frontend:**
  - React
  - CSS
  - React Router

- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - JWT for authentication
  - bcrypt for password hashing

## Setup and Installation

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (running locally or a cloud instance)

API Endpoints
User Routes
POST /api/signup - Sign up a new user
POST /api/login - Log in an existing user
Employee Routes
GET /api/employees - Get all employees
POST /api/employees - Create a new employee
PUT /api/employees/:id - Update an existing employee
DELETE /api/employees/:id - Delete an employee
