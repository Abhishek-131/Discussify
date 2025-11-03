import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import UploadAvatar from "./pages/profile/UploadAvatar";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import CommunitiesList from "./pages/CommunitiesList";
import Explore from "./pages/Explore";
import CommunityResources from "./pages/CommunityResource";
import Home from "./pages/Home";

import AdminPanel from "./admin/AdminPanel";




const App: React.FC = () => {


  

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload-avatar"
          element={
            <ProtectedRoute>
              <UploadAvatar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/communities"
          element={
            <ProtectedRoute>
              <CommunitiesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community/:id/discussions"
          element={
            <ProtectedRoute>
              <CommunitiesList />
            </ProtectedRoute>
          }
        />
        // ...
        <Route
          path="/communities/:id/resources"
          element={
            <ProtectedRoute>
              <CommunityResources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
