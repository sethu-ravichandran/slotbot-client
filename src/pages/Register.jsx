import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus } from 'lucide-react';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(name, email, password, role);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <form className="space-y-6" onSubmit={handleSubmit}>
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

        <InputField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            I am a:
          </label>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                id="candidate"
                name="role"
                type="radio"
                checked={role === 'candidate'}
                onChange={() => setRole('candidate')}
                className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <label htmlFor="candidate" className="ml-2 block text-sm text-gray-700">
                Candidate
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="recruiter"
                name="role"
                type="radio"
                checked={role === 'recruiter'}
                onChange={() => setRole('recruiter')}
                className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <label htmlFor="recruiter" className="ml-2 block text-sm text-gray-700">
                Recruiter
              </label>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          icon={<UserPlus size={18} />}
        >
          Create account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
