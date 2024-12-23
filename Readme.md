# Online Claim System Backend

## Overview

This project serves as the backend for the Online Claim System. It manages user claims, feedback, and repair center functionalities. The backend is built with:

- Node.js with Express
- PostgreSQL for relational database management
- MongoDB for feedback storage
- JWT for authentication
- Swagger for API documentation

---

## Setup

### 1. Prerequisites

Make sure you have the following installed:

- Node.js (v16 or higher)
- Docker and Docker Compose
- PostgreSQL (if not using Docker)
- MongoDB (if not using Docker)

---

### 2. Clone the Repository

```bash
git clone https://github.com/your-repo/online-claim-system-backend.git
cd online-claim-system-backend
```

---

### 3. Install Dependencies

```bash
npm install
```

---

### 4. Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```env
# Server
PORT=5000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h

# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=online_claim_system
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# MongoDB
MONGO_URI=mongodb://mongo:27017/online_claim_system
```

---

### 5. Using Docker

#### a. Start the Docker Containers

Start the containers using Docker Compose:

```bash
docker-compose up -d
```

This will start:

- PostgreSQL on port `5432`
- MongoDB on port `27017`
- The backend server on port `5000`

#### b. Stop the Docker Containers

To stop the containers, use:

```bash
docker-compose down
```

---

### 6. Without Docker

#### a. PostgreSQL Setup

Ensure your PostgreSQL database is running and that the environment variables in `.env` are correctly configured.

#### b. MongoDB Setup

Ensure your MongoDB instance is running and that `MONGO_URI` in `.env` points to your MongoDB instance.

#### c. Start the Server

```bash
npm run dev
```

---

### 7. Verify the Setup

#### API Documentation

Visit the API documentation at:  
[http://localhost:5000/api-docs](http://localhost:5000/api-docs)

#### Health Check

Visit the root endpoint:  
[http://localhost:5000/](http://localhost:5000/)

---

## Usage

### Available Scripts

| Script         | Description                                      |
| -------------- | ------------------------------------------------ |
| `npm run dev`  | Starts the server in development mode            |
| `npm run build`| Builds the application                           |
| `npm start`    | Starts the server in production mode             |
| `npm test`     | Runs all unit tests                              |

---

## Features

### 1. User Authentication
- Register, Login, and Forgot Password using JWT.

### 2. Claim Management
- Submit, update, cancel, and appeal claims.
- List active and rejected claims.

### 3. Feedback Submission
- Collect user feedback using MongoDB.

### 4. Repair Center Locator
- Display nearby repair centers using geolocation (future enhancement).

---

## Folder Structure

```
src/
├── config/             # Database and environment configurations
├── controllers/        # API controllers for different resources
├── middleware/         # Express middlewares
├── models/             # Database models for PostgreSQL and MongoDB
├── routes/             # Express route handlers
├── utils/              # Utility functions (e.g., JWT, email)
└── tests/              # Unit tests for backend functionalities
```

---

## Technology Stack

| Technology         | Purpose                                |
| ------------------ | -------------------------------------- |
| Node.js        | Server-side JavaScript runtime         |
| Express.js     | Backend framework                      |
| PostgreSQL     | Relational database management         |
| MongoDB        | NoSQL database for feedback storage    |
| JWT            | Authentication                        |
| Swagger        | API documentation                     |
| Docker         | Containerization                      |

---

## Testing

Run unit tests with:

```bash
npm test
```


## License

This project is licensed under the [MIT License](LICENSE).