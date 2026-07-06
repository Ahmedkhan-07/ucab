# Roles and Responsibilities

In the Ucab Booking Application, system privileges and operations are divided into three user roles: **User (Rider)**, **Driver**, and **Admin**. Below is a detailed breakdown of their functions and responsibilities.

---

### 1. User (Rider)

The Rider represents the end-consumer of the platform who requests transportation services. 

#### A. Authentication & Profile Management
*   **Sign-Up & Registration**: Register a new account with name, email, password, and contact phone number.
*   **Secure Access**: Authenticate securely using email and password to receive a JWT access token.
*   **Profile Control**: View and update contact information, phone numbers, and profile details.

#### B. Booking Lifecycle
*   **Route Setup**: Input pick-up location, drop-off destination, and scheduling date/time.
*   **Fleet Categories Selection**: Browse and compare different cab types (e.g., Mini, Sedan, SUV) and see live estimated pricing.
*   **Trip Enhancements**:
    *   Apply promotional discount codes.
    *   Order in-ride refreshments (snacks, water, beverages).
    *   Select voluntary carbon-offset green donations to balance emissions.
*   **Requesting a Cab**: Submit the request, which calculates the exact fare and sends it to the routing layer.

#### C. Live Ride Experience & History
*   **Real-time Tracking**: Monitor ride booking status (Pending, Confirmed, Started, Completed, Cancelled).
*   **Digital Receipts**: Receive complete price breakdowns upon ride completion, including base fare, offsets, refreshments, and applied discounts.
*   **Personal Logs**: Access historical trip archives to review past routes, booking dates, and payment summaries.

---

### 2. Driver

The Driver is the service provider responsible for managing vehicle operations and completing assigned trips.

#### A. Shift & Duty Management
*   **Secure Sign-In**: Access driver logs and portals through secure authenticated paths.
*   **Vehicle Linking**: Connect with the assigned vehicle in the database (associated with parameters like registration numbers and capacity).

#### B. Request Handling
*   **Request Queue**: View incoming ride matching requests originating from nearby users.
*   **Dispatch Acceptance**: Accept or decline bookings based on availability.

#### C. Live Status Updates
*   **Progress Tracking**: Transition ride status throughout the booking lifecycle:
    1.  *Confirm* the booking (notifying the user).
    2.  *Start* the trip once the rider is picked up.
    3.  *Complete* the trip at the destination (initiating fare calculation).
*   **Earnings Tracking**: Review total mileage, completed routes, and daily/monthly earnings reports.

---

### 3. Admin

The Admin manages the fleet, users, system settings, and billing analysis.

#### A. Administrative Operations & Control
*   **Dashboard Access**: Secure administrator credentials protect the central control panel.
*   **User & Driver Management**: 
    *   Audit active rider profiles.
    *   Verify, update, or remove driver permissions and status fields.

#### B. Fleet Operations
*   **Fleet CRUD**: Add, edit, or decommission vehicles from the global fleet list.
*   **Media Uploads**: Manage files (driver profile photos and vehicle model images) using Multer multipart middleware on the server.
*   **Fare Adjustment**: Configure the default `pricePerKm` rate settings for different cab classes.

#### C. Monitoring & Analytics
*   **Live Booking Feeds**: Oversee active booking states, locations, and schedules globally.
*   **Financial Metrics**: Aggregate platform stats to calculate gross revenue, carbon offset donations collected, and promo code usage rates.