import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./component/Navbar";
import CardList from "./component/CardList";
import "./index.css";
import Hero from "./component/Hero";
import BookingPage from "./component/BookingPage.jsx";
import BookingTable from "./component/BookingTable";
import CardForm from "./component/CardForm";
import HotelList from "./component/HotelList";
import HotelBooking from "./component/HotelBooking";
import HotelBookingTable from "./component/HotelBookingTable";
import Login from "./component/Login";
import ProtectedRoute from "./component/ProtectedRoute";
import AdminDashboard from "./component/AdminDashboard";
import AdminLayout from "./component/AdminLayout";
import AdminCardManager from "./component/AdminCardManager";
import AdminHotelManager from "./component/AdminHotelManager";
import AdminDetailPageManager from "./component/AdminDetailPageManager";
import HotelDetailPage from "./component/HotelDetailPage";
import TourDetailPage from "./component/TourDetailPage";
import HomePage from "./HomePage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <HomePage />
            </>
          }
        />

        <Route
          path="/hotels"
          element={
            <>
              <Navbar />
              <div className="p-4">
                <HotelList />
              </div>
            </>
          }
        />

        <Route
          path="/hotel/:id"
          element={
            <>
              <Navbar />
              <HotelDetailPage />
            </>
          }
        />

        <Route
          path="/tour/:id"
          element={
            <>
              <Navbar />
              <TourDetailPage />
            </>
          }
        />

        <Route
          path="/hotel-booking"
          element={
            <>
              <Navbar />
              <div className="p-4">
                <HotelBooking />
              </div>
            </>
          }
        />

        <Route
          path="/booking"
          element={
            <>
              <Navbar />
              <div className="p-4">
                <BookingPage />
              </div>
            </>
          }
        />

        <Route path="/login" element={<Login />} />

        {/* Admin Routes - All protected and wrapped in AdminLayout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="group-bookings" element={<BookingTable />} />
          <Route path="hotel-bookings" element={<HotelBookingTable />} />
          <Route path="cards" element={<CardForm />} />
          <Route path="hotels" element={<HotelList />} />
          <Route path="card-manager" element={<AdminCardManager />} />
          <Route path="hotel-manager" element={<AdminHotelManager />} />
          <Route path="detail-manager" element={<AdminDetailPageManager />} />
        </Route>

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
