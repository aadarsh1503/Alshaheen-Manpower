import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch(`${baseUrl}/admin/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message + " You will be redirected to login shortly.");
        setTimeout(() => navigate('/alshaheen-pro-login'), 3000);
      } else {
        setError(data.message || 'Failed to reset password.');
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
            <h1 className="text-3xl font-bold mb-2">Reset Your Password</h1>
            <p className="opacity-90">Enter and confirm your new password</p>
          </div>

          <form onSubmit={handleResetPassword} className="p-8 space-y-6">
            {message && <div className="p-3 bg-green-100 text-green-800 rounded-lg">{message}</div>}
            {error && <div className="p-3 bg-red-100 text-red-800 rounded-lg">{error}</div>}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 transition" required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 transition" required
              />
            </div>

            <button
              type="submit" disabled={isLoading || message}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition ${isLoading || message ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
             {message && (
              <div className="text-center">
                  <Link to="/alshaheen-pro-login" className="font-medium text-red-600 hover:text-red-500">
                    Go to Login
                  </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;