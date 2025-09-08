import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { UserGroupIcon } from '@heroicons/react/24/outline';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Side - Branding */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex flex-col justify-center text-white">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <UserGroupIcon className="w-12 h-12 mr-3" />
              <h1 className="text-3xl font-bold">EmpManager</h1>
            </div>
            <p className="text-blue-100 text-lg">
              Comprehensive Employee Management System for modern businesses
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 mr-4"></div>
              <div>
                <h3 className="font-semibold mb-1">Employee Management</h3>
                <p className="text-blue-200 text-sm">
                  Complete CRUD operations with advanced search and filtering
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 mr-4"></div>
              <div>
                <h3 className="font-semibold mb-1">Department Management</h3>
                <p className="text-blue-200 text-sm">
                  Organize teams and track departmental metrics
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 mr-4"></div>
              <div>
                <h3 className="font-semibold mb-1">Attendance Tracking</h3>
                <p className="text-blue-200 text-sm">
                  Real-time attendance monitoring and reporting
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 mr-4"></div>
              <div>
                <h3 className="font-semibold mb-1">Analytics Dashboard</h3>
                <p className="text-blue-200 text-sm">
                  Interactive charts and comprehensive insights
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Forms */}
        <div className="p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isLogin 
                ? 'Sign in to access your dashboard and manage your workforce'
                : 'Join our platform and start managing your employees efficiently'
              }
            </p>
          </div>

          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;