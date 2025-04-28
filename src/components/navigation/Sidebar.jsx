import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  CalendarClock,
  LayoutDashboard,
  Calendar,
  Clock,
  Users,
  Settings,
  LogOut,
  X
} from 'lucide-react'

const Sidebar = ({ mobile, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-2 my-1 text-sm font-medium rounded-md ${
      isActive
        ? 'bg-primary-50 text-primary-700'
        : 'text-gray-600 hover:bg-gray-100'
    }`

  const MobileHeader = () =>
    mobile ? (
      <div className="px-4 pb-4 flex items-center justify-between border-b border-gray-200 mb-4">
        <div className="flex items-center">
          <CalendarClock size={24} className="text-primary-600" />
          <h1 className="ml-2 text-xl font-bold text-gray-900">SlotBot</h1>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
    ) : null

  return (
    <div
      className={`flex flex-col ${
        mobile ? 'w-full' : 'w-64'
      } bg-white border-r border-gray-200 p-4`}
    >
      <MobileHeader />

      {!mobile && (
        <div className="flex items-center px-4 py-4">
          <CalendarClock size={24} className="text-primary-600" />
          <h1 className="ml-2 text-xl font-bold text-gray-900">SlotBot</h1>
        </div>
      )}

      <div className="flex flex-col flex-1 mt-5 overflow-y-auto">
        <div className="space-y-1">
          <NavLink to="/dashboard" className={navLinkClasses}>
            <LayoutDashboard size={20} className="mr-3" />
            Dashboard
          </NavLink>

          {user?.role === 'candidate' && (
            <NavLink to="/availability" className={navLinkClasses}>
              <Clock size={20} className="mr-3" />
              My Availability
            </NavLink>
          )}

          <NavLink to="/schedule" className={navLinkClasses}>
            <Calendar size={20} className="mr-3" />
            My Schedule
          </NavLink>

          {user?.role === 'recruiter' && (
            <NavLink to="/candidates" className={navLinkClasses}>
              <Users size={20} className="mr-3" />
              Candidates
            </NavLink>
          )}

          <NavLink to="/profile" className={navLinkClasses}>
            <Settings size={20} className="mr-3" />
            Settings
          </NavLink>
        </div>
      </div>

      <div className="mt-auto border-t border-gray-200 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100"
        >
          <LogOut size={20} className="mr-3" />
          Sign out
        </button>

        <div className="flex items-center px-4 py-4 mt-2">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
            <p className="text-xs font-medium text-gray-500 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
