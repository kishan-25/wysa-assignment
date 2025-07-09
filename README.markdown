# WySa Sleep API

## Features Implemented
- **User Authentication**:
  - Register and login with email, password, and name.
  - JWT-based authentication stored in HTTP-only cookies.
  - Role-based access control (USER and ADMIN roles).
  - Logout and authentication check endpoints.
- **Sleep Assessment**:
  - Submit sleep assessments with goals, weekly struggles, bed times, and sleep duration.
  - Retrieve assessments for the authenticated user.
- **Security**:
  - Input validation and sanitization to prevent XSS and injection attacks.
  - Password hashing with bcrypt (12 rounds).
  - Secure HTTP headers with Helmet.
  - CORS with restricted origin.
  - JWT with 7-day expiry and secure cookie settings.

## Clone and Install
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/kishan-25/wysa-assignment.git
   cd wysa-assignment
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   Required packages: `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `validator`, `xss`, `helmet`, `cors`, `cookie-parser`, `dotenv`, `nodemon`.

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory with the following:
   ```
   MONGODB_URI="make modifications"
   JWT_SECRET="make modifications"
   PORT=5000
   ```

4. **Run the Application**:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`.