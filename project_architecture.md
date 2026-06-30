# Project Architecture & Documentation

This document outlines the technical architecture, data model relationships, user roles, system flows, feature list, and structural patterns governing the Ucab booking application.

---

## 1. Technical Architecture

### Client Layer (React.js)
This is the frontend – what the user sees and interacts with. Built using React.js, it includes UI Components like:
- **Cab Selection**: Where users choose from available cabs in the fleet.
- **Booking Form**: To select destination, pickup location, promo codes, refreshments, and offset donations.
- **Tracking Screen**: Real-time ride status tracking and bill breakdown.
- **Login/Signup**: Authenticational access controls for both normal riders and administrators.

### API Layer (Express.js)
Acts as the middleware between the frontend and database. Built using Express.js (a Node.js framework), it exposes RESTful APIs such as:
- `POST /api/bookings` → For booking a cab.
- `GET /api/bookings/mybookings` → Retrieve active/past user bookings.
- `GET /api/bookings/stats` → Aggregate stats (for Admins).
- `POST /api/users/register` & `POST /api/users/login` → Rider auth.
- `POST /api/admin/register` & `POST /api/admin/login` → Admin auth.
- `POST /api/cars` → Add new cars (Admin only).

### Service Layer
Contains the core business logic – it decides how the features function. Responsibilities include:
- **Fare Calculation**: Automatically evaluates price based on distance, promo codes, in-cabin refreshments, and carbon offset offset donations.
- **Ride Status & Proximity ETA**: Displays proximity notices and mocks pickup arrival timers.
- **Live Tracking Aggregations**: Keeps coordinates, order lists, and invoices synced.

### Data Access Layer (Mongoose ODM)
Uses Mongoose to interact with the database (MongoDB Atlas). Responsibilities include:
- Executing database operations (find, update, insert, delete).
- Defining Mongoose schemas for collections (e.g. `MyBookingSchema`, `CarSchema`, `UserSchema`).
- Abstracting raw MongoDB queries.

### Data Flow Example (Booking a Ride)
1. User selects pickup, drop-off location, cab type, and choices on the React frontend.
2. A `POST` request is sent to `/api/bookings` containing these ride details.
3. Backend processes the request, calculates price segments, validates credentials, and matches a vehicle.
4. The booking is successfully saved in MongoDB.
5. User retrieves live status updates on the history panel.

---

## 2. ER - Diagram Explanation

### User – Ride Relationship
- **Type**: One-to-Many
- **Meaning**: One user can book multiple rides, but each ride belongs to only one user.
- **Implementation**: The booking schema contains a `userId` reference to link each booking to its respective rider.
- **Real-life example**: A user logs in and schedules several rides over time; each ride entry maps back to that single user account.

### Ride – Driver Relationship (Assigned To)
- **Type**: Many-to-One
- **Meaning**: Multiple rides can be assigned to a driver, but each individual ride is handled by only one driver.
- **Implementation**: The booking record contains a vehicle reference (`carId`), which is assigned to a specific driver.
- **Real-life example**: A driver fulfills various ride bookings throughout their shift.

### Driver – Vehicle Relationship
- **Type**: One-to-One (or One-to-Many if shared shifts are implemented)
- **Meaning**: A driver drives one vehicle, and optionally, a vehicle can be used by multiple drivers.
- **Implementation**: The vehicle record (`carId`) represents the driver's vehicle in the system.
- **Real-life example**: Driver A is assigned to Car X for their shift.

---

## 3. Roles and Responsibilities

### User (Rider)
- Register a new account / Login to existing profile.
- Browse available cab categories (Mini, Sedan, SUV, etc.).
- Input location segments, select enhancements (refreshments, green offset donations, promo codes), and place bookings.
- Track ride status live and view digital receipts.
- View history of past bookings.

### Driver
- Sign in to view assigned ride tasks.
- Accept or reject incoming ride requests.
- Update ride statuses (Pending, Confirmed, Started, Completed).
- Monitor profile analytics, earnings, and completed histories.

### Admin
- Log in securely to the Administrator dashboard.
- Manage system users and drivers (edit profile details).
- Monitor active bookings, aggregate metrics, and revenue details.
- Add or remove vehicle entries in the global cab fleet (uploading driver images/cars via Multer).

---

## 4. User Flow

1. **Authentication**: User logs in or signs up on the frontend interface.
2. **Dashboard**: View active profile features or click to browse cabs.
3. **Selection**: Choose from available vehicle types (Mini, Sedan, SUV).
4. **Customization**: Input pickup/drop details, select carbon offsets, choose in-cabin refreshments, and apply promo discount codes.
5. **Booking**: Place booking. The screen displays an automatic payment notification (simulated billing) and starts live tracking.
6. **Ride Summary**: Review bill breakdown details, completed routes, and order histories.

---

## 5. Features

- **User and Driver Authentication**: Secure login/signup gates using JSON Web Tokens (JWT) and encrypted passwords.
- **Cab Type Selection**: Ability to filter through various categories (Mini, Sedan, SUV, Hybrid).
- **Advanced Pricing Breakdown**: Fare estimation factoring distance, green carbon offsets, in-cabin snacks/water, and promo coupons.
- **Live Ride Tracking Panel**: Displays progress indicators, driver profiles, arrival timers, and billing statuses.
- **Booking History**: Access complete invoices and records of previous rides.

---

## 6. MVC Pattern Explanation

The Cab booking application is structured using the **Model-View-Controller (MVC)** architectural pattern, which isolates concerns and enhances scalability.

```
       [ DATABASE ]
            ▲
            │ (DB Operations)
            ▼
        [ MODEL ]  ◄──(User/Admin Modifiers)
            ▲
            │
            ▼
      [ CONTROLLER ] ◄──(Response / Request)──► [ USER ]
            ▲
            │
            ▼
        [ VIEW ]   ◄──(Routes)
```

### Model Layer (Data Layer)
Responsible for database interaction. Using Mongoose, it defines schemas and models for `User`, `Car`, and `Booking`, validating and handling data transactions with MongoDB.

### Controller Layer
Contains the intermediate handling code. It takes incoming HTTP requests from the route layer, runs parameters validation, calls the appropriate models, runs calculations, and sends JSON payloads back to the client.

### View Layer (Routing Layer)
In a RESTful MERN backend, the view is represented by routes (using Express Router). Endpoints map specific URLs and HTTP methods to their controller counterparts, parsing URLs and preparing request streams.

### Advantages of Using MVC in Ucab
- **Separation of Concerns**: Isolated modular responsibilities make debugging and styling simple.
- **Scalability**: New endpoints and modules can be added easily without disrupting current controllers or models.
- **Reusability**: Shared helpers (like authentication middleware or distance calculations) can be used across multiple routes.
- **Independent Testing**: Facilitates writing distinct unit and integration test scripts.
