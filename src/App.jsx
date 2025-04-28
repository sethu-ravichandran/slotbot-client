import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './contexts/AuthContext'

import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CandidateAvailability from './pages/CandidateAvailability'
import MeetingDetails from './pages/MeetingDetails'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import RecruiterCandidates from './pages/RecruiterCandidates'
import Schedule from './pages/Schedule'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
          <p className="text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/dashboard" />}
          />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/availability"
            element={
              user?.role === 'candidate' ? (
                <CandidateAvailability />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/schedule"
            element={user ? <Schedule /> : <Navigate to="/login" />}
          />
          <Route
            path="/candidates"
            element={
              user?.role === 'recruiter' ? (
                <RecruiterCandidates />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/meetings/:id"
            element={user ? <MeetingDetails /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Fragment>
  )
}

export default App
