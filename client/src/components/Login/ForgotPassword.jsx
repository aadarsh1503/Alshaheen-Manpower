import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch(`${baseUrl}/api/admin/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.message || 'Failed to send reset link.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-noto-serif bg-gradient-to-t from-rose-500 to-rose-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-white text-center">
            <img 
              src="https://alshaheen.pro/assets/i21-Bo7dbSjO.jpg" 
              alt="Alshaheen Manpower Logo"
              className="h-20 w-auto mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
            <p className="opacity-90">Enter your email to receive a reset link</p>
          </div>

          <form onSubmit={handleRequestReset} className="p-8 space-y-6">
            {message && <div className="p-3 bg-green-100 text-green-800 rounded-lg">{message}</div>}
            {error && <div className="p-3 bg-red-100 text-red-800 rounded-lg">{error}</div>}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 transition" required
              />
            </div>

            <button
              type="submit" disabled={isLoading || message}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition ${isLoading || message ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div className="text-center">
              <Link to="/alshaheen-pro-login" className="font-medium text-red-600 hover:text-red-500">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;