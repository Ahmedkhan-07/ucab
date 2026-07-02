# Features

This document provides a comprehensive overview of the features implemented in the Ucab booking application, categorized by user authentication, rider bookings, live tracking, and administrator management.

---

## 🔐 1. User & Admin Authentication

- **Dual-Role Access Control**:
  - Separate authentication and database models for normal riders (`UserSchema`) and administrators (`AdminSchema`).
- **Secure Password Hashing**:
  - Implementation of password cryptography via `bcryptjs` during registration and authentication.
- **JWT-Based Session Tokens**:
  - Server generates JSON Web Tokens (JWT) upon successful login to authorize REST endpoints.
  - Expiry and authorization gates verify access headers for protected paths (e.g., adding/editing cars).
- **Session Persistence**:
  - Client state stores the login payload and token locally (`localStorage`), allowing seamless dashboard reloads.

---

## 🚗 2. Dynamic Cab Fleet Browsing

- **Vehicle Categorization**:
  - Classification of fleet cars into distinct categories: `Mini`, `Sedan`, `SUV`, and `Hybrid`.
- **Granular Vehicle Metadata**:
  - Tracks specific vehicle registration details (Number Plate), driver descriptive summaries, and availability statuses.
- **Image Upload Integration**:
  - Admin uploads vehicle images handled via `multer` storage on the server, serving assets from a dedicated static path `/uploads`.

---

## 🧾 3. Advanced Booking & Fare Customization

- **Real-Time Fare Estimator**:
  - Computes ride costs dynamically on the client before booking based on distance:
    $$\text{Base Fare} = \text{Price per km} \times \text{Distance}$$
- **Eco-Conscious Carbon Offsets**:
  - An optional check to include a flat `$2.00` green offset donation in the total ride invoice.
- **Hospitality Enhancements (Amenities)**:
  - Multi-select choices for adding in-cabin refreshments:
    - Bottled Water: `+$1.50`
    - Packaged Snack: `+$3.50`
- **Promo Coupon Verification**:
  - Validation engine checking coupon eligibility:
    - `WELCOME10`: 10% discount off the base mileage fare.
    - `DISCOUNT10`: 10% discount off the base mileage fare.
    - `AIRPORT20`: 20% discount off the base mileage fare.

---

## 📍 4. Live Ride Tracking & State Machine Simulation

- **Interactive Progress Indicators**:
  - Simulated timeline representing driver dispatch milestones:
    - **Pending state**: Displays a progress bar at `25%` indicating driver matching.
    - **Confirmed state**: Animates the progress bar to `65%` and alerts the user of proximity notices (e.g., "Arriving in ~3 minutes").
- **Simulated Payment Gateway**:
  - Automatically authorizes payments against a mock default card: `Saved Visa (**** 9876)`.
- **Rider Booking Archive**:
  - Dashboard panel showing histories of past, cancelled, and active bookings, allowing real-time cancellations for pending dispatches.

---

## 🛠️ 5. Administrator Control Board

- **System-Wide Analytics**:
  - Visual charts or counters aggregating overall performance metrics:
    - Total registered platform users.
    - Overall completed and active ride bookings.
    - Cumulative revenue calculations.
- **User & Fleet Management (CRUD)**:
  - View list of registered accounts and edit user parameters.
  - Complete CRUD interface for vehicles: Add new cabs, edit names/pricing details, delete cars, or toggle live availability.
- **Global Booking Monitor**:
  - Full list views of all system bookings with tools to modify statuses directly from the administrator panel.

