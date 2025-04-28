import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'
import InputField from '../components/ui/InputField'
import { Save } from 'lucide-react'

const Profile = () => {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateProfile = (e) => {
    e.preventDefault()

    if (!name || !email) {
      toast.error('Name and email are required')
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      toast.success('Profile updated successfully')
      setIsLoading(false)
    }, 1000)
  }

  const handleUpdatePassword = (e) => {
    e.preventDefault()

    if (!currentPassword) {
      toast.error('Current password is required')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      toast.success('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update your account information and preferences.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Personal Information
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Update your personal details.</p>
          </div>

          <form
            onSubmit={handleUpdateProfile}
            className="mt-5 space-y-6 sm:max-w-lg"
          >
            <InputField
              id="name"
              label="Full name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />

            <InputField
              id="email"
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="mt-1 bg-gray-50 py-2 px-3 rounded-md border border-gray-300 text-gray-700 capitalize">
                {user?.role}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Your account type cannot be changed.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              icon={<Save size={18} />}
            >
              Save Changes
            </Button>
          </form>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Change Password
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Update your password to maintain account security.</p>
          </div>

          <form
            onSubmit={handleUpdatePassword}
            className="mt-5 space-y-6 sm:max-w-lg"
          >
            <InputField
              id="current-password"
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              required
            />

            <InputField
              id="new-password"
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />

            <InputField
              id="confirm-password"
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
            />

            <Button type="submit" variant="primary" isLoading={isLoading}>
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
