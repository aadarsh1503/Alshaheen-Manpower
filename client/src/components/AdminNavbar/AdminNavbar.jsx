import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/alshaheen-pro-login');
  };

  const openConfirmation = () => {
    setShowConfirmation(true);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Welcome back, Admin</h1>
        <button
          onClick={openConfirmation}
          className="bg-red-500 cursor-pointer hover:bg-red-600 px-4 py-2 rounded text-sm font-medium"
        >
          Logout
        </button>
      </nav>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Are you sure you want to logout?</h3>
            <p className="text-sm text-gray-500 mb-6">This will end your current admin session.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeConfirmation}
                className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 cursor-pointer text-white rounded-md text-sm font-medium hover:bg-red-600"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;