# Steps for Execution

Follow these steps to set up and run the Ucab application locally.

## Prerequisites

Before starting, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or a local MongoDB database
- Git (optional)

---

## 1. Setup Backend Server

Navigate to the `server` directory and set up the server instance:

1. **Open your terminal and navigate to the server folder**:
   ```bash
   cd ucab/server
   ```

2. **Install the backend npm dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `server` directory:
   ```bash
   # You can copy the template file to start
   cp .env.example .env
   ```
   Open the newly created `.env` file and set the configuration parameters:
   - `PORT`: The server port (e.g. `5000`)
   - `MONGO_URI`: Your MongoDB connection URL (e.g. `mongodb+srv://<username>:<password>@cluster0.mongodb.net/ucab`)
   - `JWT_SECRET`: Any secret string used for signing tokens (e.g. `my_super_secret_jwt_key_123`)
   - `ALLOWED_ORIGINS`: Origins allowed to communicate with server APIs (e.g. `http://localhost:5173`)

4. **Run the server in development mode**:
   ```bash
   npm run dev
   ```
   If successful, you will see output indicating that the server is running on the specified port and has connected to MongoDB.

---

## 2. Setup Client Frontend

Open a new terminal window, navigate to the `client` directory, and set up the frontend:

1. **Navigate to the client folder**:
   ```bash
   cd ucab/client
   ```

2. **Install the frontend npm packages**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `client` directory:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file to ensure the API endpoint points to your backend instance:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Launch the client app**:
   ```bash
   npm run dev
   ```
   Once started, open the local development server URL (usually `http://localhost:5173`) in your web browser.

---

## 3. Initial App Flow & Configurations

1. **Accessing Admin panel**:
   - Navigate to the admin login section. Register an administrator account first at `/admin/register` (or via API).
   - Once logged in, add vehicles to the fleet in the admin control board.
2. **Booking as Rider**:
   - Register a rider account on the landing page.
   - Enter your pickup/drop points, choose a ride category (Mini, Sedan, SUV, Hybrid), add upgrades/promo codes, and verify the ride receipt structure.
