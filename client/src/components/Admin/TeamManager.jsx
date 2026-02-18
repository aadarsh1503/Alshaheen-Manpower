import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaImage, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

const TeamManager = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    display_order: 0,
    is_active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/team/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeamMembers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      display_order: teamMembers.length + 1,
      is_active: true
    });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      display_order: member.display_order,
      is_active: member.is_active
    });
    setImageFile(null);
    setImagePreview(member.image_url);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setUploading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('display_order', formData.display_order);
      formDataToSend.append('is_active', formData.is_active);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingMember) {
        await axios.put(`/api/team/admin/${editingMember.id}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post('/api/team/admin', formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setShowModal(false);
      setUploading(false);
      fetchTeamMembers();
    } catch (error) {
      console.error('Error saving team member:', error);
      setUploading(false);
      alert('Error saving team member');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/team/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeleteConfirm(null);
      fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('Error deleting team member');
    }
  };

  const toggleActive = async (member) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`/api/team/admin/${member.id}`, {
        is_active: !member.is_active
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTeamMembers();
    } catch (error) {
      console.error('Error toggling member status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#B91C1C] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-md border-b-4 border-[#B91C1C]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Team Management</h1>
              <p className="text-gray-600">Manage your team members and their information</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-[#B91C1C] hover:bg-[#991515] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
            >
              <FaPlus className="text-lg" /> Add New Member
            </button>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {teamMembers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaImage className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Team Members Yet</h3>
            <p className="text-gray-600 mb-6">Start building your team by adding your first member</p>
            <button
              onClick={openAddModal}
              className="bg-[#B91C1C] hover:bg-[#991515] text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors font-semibold"
            >
              <FaPlus /> Add First Member
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  !member.is_active ? 'opacity-60 grayscale' : ''
                }`}
              >
                {/* Image Section */}
                <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaImage className="text-gray-400 text-6xl" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <button
                      onClick={() => toggleActive(member)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all ${
                        member.is_active
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gray-500 hover:bg-gray-600 text-white'
                      }`}
                      title={member.is_active ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                    >
                      {member.is_active ? <FaEye /> : <FaEyeSlash />}
                      {member.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  {/* Display Order Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-[#B91C1C] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      #{member.display_order}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2 min-h-[3.5rem]">
                    {member.name}
                  </h3>
                  <p className="text-[#B91C1C] text-sm font-semibold mb-4 uppercase tracking-wide">
                    {member.role}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(member)}
                      className="flex-1 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(member.id)}
                      className="flex-1 bg-[#B91C1C] hover:bg-[#991515] text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#B91C1C] to-[#991515] p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">
                  {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                {/* Image Preview */}
                {imagePreview && (
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-40 h-40 object-cover rounded-full border-4 border-[#B91C1C] shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-[#B91C1C] text-white p-2 rounded-full">
                        <FaImage />
                      </div>
                    </div>
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] transition-all text-gray-900 font-medium"
                  />
                </div>

                {/* Role Field */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Position/Role *
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Managing Director, Administrator"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] transition-all text-gray-900 font-medium"
                  />
                </div>

                {/* Display Order Field */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="Order number (lower appears first)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] transition-all text-gray-900 font-medium"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first on the website</p>
                </div>

                {/* Image Upload Field */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Profile Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#B91C1C] file:text-white file:font-semibold hover:file:bg-[#991515] file:cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Recommended: Square image, at least 400x400px (Max 5MB)</p>
                </div>

                {/* Active Status Checkbox */}
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-[#B91C1C] border-gray-300 rounded focus:ring-[#B91C1C] cursor-pointer"
                    />
                    <span className="ml-3 text-sm font-bold text-gray-900">
                      Active (Visible on website)
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-2 ml-8">
                    Uncheck to hide this member from the public website
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 mt-8 pt-6 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={uploading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-[#B91C1C] text-white rounded-lg hover:bg-[#991515] transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>{editingMember ? 'Update Member' : 'Add Member'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            {/* Warning Header */}
            <div className="bg-[#B91C1C] p-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <FaTrash size={28} className="text-[#B91C1C]" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Delete Team Member?</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Are you sure you want to permanently delete this team member? This action cannot be undone and will remove all associated data.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-6 py-3 bg-[#B91C1C] text-white rounded-lg hover:bg-[#991515] transition-all font-bold shadow-lg hover:shadow-xl"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManager;
