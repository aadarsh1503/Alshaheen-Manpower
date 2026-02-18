import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiBriefcase, FiUsers, FiMenu, FiX, FiLogOut, FiAlertCircle, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('✅ Logged out successfully');
    setShowLogoutModal(false);
    navigate('/alshaheen-pro-login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: <FiHome size={20} />,
      label: 'Dashboard',
      description: 'Candidate Management'
    },
    {
      path: '/admin/vacancies',
      icon: <FiBriefcase size={20} />,
      label: 'Vacancy Manager',
      description: 'Job Postings'
    },
    {
      path: '/admin/internships',
      icon: <FiUsers size={20} />,
      label: 'Internship Manager',
      description: 'Internship Applications'
    },
    {
      path: '/admin/blacklist',
      icon: <FiShield size={20} />,
      label: 'Blacklist',
      description: 'Blocked Candidates'
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[#B91C1C] text-white transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-red-800">
          {sidebarOpen && (
            <h1 className="text-xl font-bold">Admin Panel</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-red-800 rounded-lg transition"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-white text-[#B91C1C]'
                  : 'hover:bg-red-800'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <div className="flex-1">
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-red-800">
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-red-800 transition"
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <FiAlertCircle size={32} className="text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout? You will need to login again to access the admin panel.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelLogout}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
