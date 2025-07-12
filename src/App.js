import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { initializeAuth, isAuthenticated } from "./utils/auth";
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
import GroupTours from "./component/GroupTours";
import Services from "./component/Services";

import AdminStatsManager from "./component/AdminStatsManager";
import Contact from "./component/Contact";
import ContactTable from "./component/ContactTable";
import Footer from "./component/Footer";

const App = () => {
  const [authInitialized, setAuthInitialized] = useState(false);

  // Fast initialization
  useEffect(() => {
    initializeAuth();
    setAuthInitialized(true);
  }, []);

  // Show minimal loading
  if (!authInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
              {/* <Footer /> */}
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
              <Footer />
            </>
          }
        />

        <Route
          path="/hotel/:id"
          element={
            <>
              <Navbar />
              <HotelDetailPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/tour/:id"
          element={
            <>
              <Navbar />
              <TourDetailPage />
              <Footer />
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
              <Footer />
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
              <Footer />
            </>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route
          path="/group-tours"
          element={
            <>
              <GroupTours />
              <Footer />
            </>
          }
        />

        <Route
          path="/services"
          element={
            <>
              <Navbar />
              <Services />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact-table"
          element={
            <>
              <Navbar />
              <ContactTable />
              <Footer />
            </>
          }
        />

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
          <Route path="contact-messages" element={<ContactTable />} />
          <Route
            path="/admin/stats-manager"
            element={
              <ProtectedRoute>
                <AdminStatsManager />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
