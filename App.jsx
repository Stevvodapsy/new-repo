import React from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import ListingsPage from "./pages/ListingsPage.jsx";
import PropertyDetailPage from "./pages/PropertyDetailPage.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import Profile from "./components/auth/Profile.jsx";
import ProfileDetails from "./components/auth/ProfileDetails.jsx";
import ChatBox from "./components/ChatBox.jsx";
import AdminVerifyUsers from "./components/auth/AdminVerifyUsers.jsx";
import AdminRoute from "./components/auth/AdminRoute.jsx";
import AdminDashboard from "./components/auth/AdminDashboard.jsx";

function App() {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-neutral-50 font-sans text-neutral-800">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile-details" element={<ProfileDetails />} />
            <Route path="/chat" element={<ChatRouteWrapper />} />
            <Route
              path="/admin/verify-users"
              element={
                <AdminRoute>
                  <AdminVerifyUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

// Wrapper to extract chatPartner from location state and pass to ChatBox
function ChatRouteWrapper() {
  const location = useLocation();
  const chatPartner = location.state?.chatPartner;
  return <ChatBox chatPartner={chatPartner} />;
}

export default App;
