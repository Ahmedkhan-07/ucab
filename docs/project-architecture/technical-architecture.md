# Technical Architecture

![Technical Architecture Diagram](https://drive.google.com/uc?export=view&id=1GoadqgZgbU0dp3x2IAFnlgPpqzdqD4Qd)

### Client Layer (React.js)

This is the frontend – what the user sees and interacts with. Built using React.js, it includes UI Components like:
*   **Cab Selection**: Where users choose from available cabs.
*   **Booking Form**: To select destination and pickup location.
*   **Tracking Screen**: Real-time ride tracking.
*   **Login/Signup**: Authentication pages.

### API Layer (Express.js)

Acts as the middleware between frontend and backend logic. Built using Express.js (a Node.js framework), it exposes RESTful APIs like:
*   `POST /api/rides/book` → For booking a ride.
*   `GET /api/users/:id` → Fetch user profile.
*   `PUT /api/rides/:id` → Update ride status.
*   `DELETE /api/rides/:id` → Cancel a ride, etc.

### Service Layer

Contains the core business logic – it decides how things work. Responsibilities include:
*   **Fare Calculation**: Based on distance and time.
*   **Ride Matching**: Finds the closest available driver.
*   **Tracking Logic**: Updates locations and ride progress in real-time.
*   **Workflow Enforcement**: Ensures business rules and workflows are applied correctly.

### Data Access Layer (Mongoose ODM)

This layer uses Mongoose to communicate with the database (MongoDB). Responsibilities include:
*   Running queries (like find, update, insert, delete).
*   Defining schemas and models for users, drivers, rides, etc.
*   Acting as an abstraction layer over raw MongoDB commands.

### Data Flow Example (Booking a Ride)

1.  User selects destination on the React frontend.
2.  A `POST` request is made to `/api/rides/book` with ride details.
3.  Backend processes the request and finds nearby drivers.
4.  The ride is successfully saved in MongoDB.
5.  Driver and user both get updated status in real-time.