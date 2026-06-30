import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './user/Home';
import Login from './user/Login';
import Register from './user/Register';
import Uhome from './user/Uhome';
import Cabs from './user/Cabs';
import BookCab from './user/BookCab';
import Mybookings from './user/Mybookings';

import Alogin from './admin/Alogin';
import Aregister from './admin/Aregister';
import Ahome from './admin/Ahome';
import Users from './admin/Users';
import UserEdit from './admin/UserEdit';
import Bookings from './admin/Bookings';
import Acabs from './admin/Acabs';
import Acabedit from './admin/Acabedit';
import Addcar from './admin/Addcar';

import Unav from './user/Unav';
import Anav from './admin/Anav';

// Guard for normal users
const UserRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Unav />
      <div className="container py-4">{children}</div>
    </>
  );
};

// Guard for admin users
const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) {
    return <Navigate to="/alogin" replace />;
  }
  return (
    <>
      <Anav />
      <div className="container py-4">{children}</div>
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/alogin" element={<Alogin />} />
        <Route path="/aregister" element={<Aregister />} />

        {/* Protected User Routes */}
        <Route path="/uhome" element={<UserRoute><Uhome /></UserRoute>} />
        <Route path="/cabs" element={<UserRoute><Cabs /></UserRoute>} />
        <Route path="/bookcab/:id" element={<UserRoute><BookCab /></UserRoute>} />
        <Route path="/mybookings" element={<UserRoute><Mybookings /></UserRoute>} />

        {/* Protected Admin Routes */}
        <Route path="/ahome" element={<AdminRoute><Ahome /></AdminRoute>} />
        <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
        <Route path="/users/:id" element={<AdminRoute><UserEdit /></AdminRoute>} />
        <Route path="/bookings" element={<AdminRoute><Bookings /></AdminRoute>} />
        <Route path="/acabs" element={<AdminRoute><Acabs /></AdminRoute>} />
        <Route path="/acabs/:id" element={<AdminRoute><Acabedit /></AdminRoute>} />
        <Route path="/addcar" element={<AdminRoute><Addcar /></AdminRoute>} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
