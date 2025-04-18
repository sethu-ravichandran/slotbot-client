import React from 'react';
import { Outlet } from 'react-router-dom';
import { CalendarClock } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Content */}
      <div className="flex w-full flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-1/2 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10">
            <div className="flex items-center">
              <CalendarClock size={36} className="text-primary-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">SlotBot</h1>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              AI-powered scheduling for seamless recruiting
            </p>
          </div>

          <Outlet />
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="People working in an office"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/70 to-primary-900/90 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Streamline Your Hiring Process</h3>
          <p className="text-white text-lg max-w-md">
            Let AI handle your scheduling so you can focus on finding the perfect candidates
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
