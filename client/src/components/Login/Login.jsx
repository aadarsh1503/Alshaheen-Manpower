import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Assuming your .env file is set up correctly
const baseUrl = import.meta.env.VITE_API_BASE_URL;

// For demonstration, using a placeholder URL. Replace with your actual base URL logic.
// const baseUrl = 'https://app.crmgcc.net/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${baseUrl}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/dashboard');
      } else {
        // You can replace this with a more elegant notification like react-hot-toast
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Changed background to a neutral dark theme to make the red card pop
    <div className="min-h-screen font-noto-serif bg-gradient-to-t from-rose-500 to-rose-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header section with red gradient and new logo */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-white text-center">
            <img 
              src="https://alshaheen.pro/assets/i21-Bo7dbSjO.jpg" 
              alt="Alshaheen Manpower Logo"
              className="h-20 w-auto mx-auto mb-4" // Centered logo
            />
            <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
            <p className="opacity-90">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                // Changed focus ring color to red
                className="w-full px-4 py-3 rounded-lg border border-gray-300  transition"
                required
              />
            </div>

            <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {/* NEW: Forgot password link */}
                <Link to="/forgot-password" className="text-sm text-red-600 hover:text-red-500">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 transition" required
              />
            

            <button
              type="submit"
              disabled={isLoading}
              // Changed button color to red and updated focus ring
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
          </form>

          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Alshaheen Manpower. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;