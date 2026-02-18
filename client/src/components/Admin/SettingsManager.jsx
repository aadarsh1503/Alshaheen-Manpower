import React, { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaEdit, FaTrash, FaImage, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

const SettingsManager = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Contact Settings State
  const [contactSettings, setContactSettings] = useState({
    contact_address: '',
    contact_phone: '',
    contact_email: '',
    social_facebook: '',
    social_instagram: '',
    social_linkedin: '',
    social_twitter: ''
  });

  // News/Events State
  const [newsEvents, setNewsEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    heading: '',
    description: '',
    display_order: 0,
    is_active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchSettings();
    fetchNewsEvents();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/settings/public', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContactSettings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
    }
  };

  const fetchNewsEvents = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/settings/news-events/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewsEvents(response.data);
    } catch (error) {
      console.error('Error fetching news/events:', error);
    }
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveContact = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put('/api/settings/admin', contactSettings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  };

  // News/Events Functions
  const handleEventInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventFormData(prev => ({
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
    setEditingEvent(null);
    setEventFormData({
      heading: '',
      description: '',
      display_order: newsEvents.length + 1,
      is_active: true
    });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setEventFormData({
      heading: event.heading,
      description: event.description,
      display_order: event.display_order,
      is_active: event.is_active
    });
    setImageFile(null);
    setImagePreview(event.image_url);
    setShowModal(true);
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    
    setUploading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();
      
      formDataToSend.append('heading', eventFormData.heading);
      formDataToSend.append('description', eventFormData.description);
      formDataToSend.append('display_order', eventFormData.display_order);
      formDataToSend.append('is_active', eventFormData.is_active);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingEvent) {
        await axios.put(`/api/settings/news-events/admin/${editingEvent.id}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post('/api/settings/news-events/admin', formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setShowModal(false);
      setUploading(false);
      fetchNewsEvents();
    } catch (error) {
      console.error('Error saving news/event:', error);
      setUploading(false);
      alert('Error saving news/event');
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/settings/news-events/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeleteConfirm(null);
      fetchNewsEvents();
    } catch (error) {
      console.error('Error deleting news/event:', error);
      alert('Error deleting news/event');
    }
  };

  const toggleEventActive = async (event) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`/api/settings/news-events/admin/${event.id}`, {
        is_active: !event.is_active
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNewsEvents();
    } catch (error) {
      console.error('Error toggling event status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#B91C1C] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b-4 border-[#B91C1C]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings Management</h1>
          <p className="text-gray-600">Manage contact information, social media links, and news/events</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-md p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'contact'
                ? 'bg-[#B91C1C] text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Contact & Social Media
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'news'
                ? 'bg-[#B91C1C] text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            News & Events
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {activeTab === 'contact' ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information & Social Media</h2>
            
            <div className="space-y-6">
              {/* Contact Info Section */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide">Contact Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Address</label>
                    <textarea
                      name="contact_address"
                      value={contactSettings.contact_address}
                      onChange={handleContactChange}
                      rows="2"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Phone</label>
                    <input
                      type="text"
                      name="contact_phone"
                      value={contactSettings.contact_phone}
                      onChange={handleContactChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                    <input
                      type="email"
                      name="contact_email"
                      value={contactSettings.contact_email}
                      onChange={handleContactChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Facebook URL</label>
                    <input
                      type="url"
                      name="social_facebook"
                      value={contactSettings.social_facebook}
                      onChange={handleContactChange}
                      placeholder="https://facebook.com/..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Instagram URL</label>
                    <input
                      type="url"
                      name="social_instagram"
                      value={contactSettings.social_instagram}
                      onChange={handleContactChange}
                      placeholder="https://instagram.com/..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">LinkedIn URL</label>
                    <input
                      type="url"
                      name="social_linkedin"
                      value={contactSettings.social_linkedin}
                      onChange={handleContactChange}
                      placeholder="https://linkedin.com/..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Twitter/X URL</label>
                    <input
                      type="url"
                      name="social_twitter"
                      value={contactSettings.social_twitter}
                      onChange={handleContactChange}
                      placeholder="https://x.com/..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-6 border-t">
                <button
                  onClick={handleSaveContact}
                  className="bg-[#B91C1C] hover:bg-[#991515] text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-all font-bold shadow-lg hover:shadow-xl"
                >
                  <FaSave /> Save Changes
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* News/Events Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">News & Events</h2>
                  <p className="text-gray-600 mt-1">Manage carousel items on the homepage</p>
                </div>
                <button
                  onClick={openAddModal}
                  className="bg-[#B91C1C] hover:bg-[#991515] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  <FaPlus /> Add News/Event
                </button>
              </div>
            </div>

            {/* News/Events Grid */}
            {newsEvents.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaImage className="text-gray-400 text-4xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No News/Events Yet</h3>
                <p className="text-gray-600 mb-6">Start adding news and events to display on your homepage carousel</p>
                <button
                  onClick={openAddModal}
                  className="bg-[#B91C1C] hover:bg-[#991515] text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors font-semibold"
                >
                  <FaPlus /> Add First Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                      !event.is_active ? 'opacity-60 grayscale' : ''
                    }`}
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.heading}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaImage className="text-gray-400 text-5xl" />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <button
                          onClick={() => toggleEventActive(event)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all ${
                            event.is_active
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-gray-500 hover:bg-gray-600 text-white'
                          }`}
                        >
                          {event.is_active ? <FaEye /> : <FaEyeSlash />}
                          {event.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </div>

                      {/* Order Badge */}
                      <div className="absolute top-3 right-3">
                        <div className="bg-[#B91C1C] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          #{event.display_order}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                        {event.heading}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {event.description}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(event)}
                          className="flex-1 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all font-semibold shadow-md hover:shadow-lg"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(event.id)}
                          className="flex-1 bg-[#B91C1C] hover:bg-[#991515] text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all font-semibold shadow-md hover:shadow-lg"
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
                  {editingEvent ? 'Edit News/Event' : 'Add News/Event'}
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
            <form onSubmit={handleEventSubmit} className="p-6">
              <div className="space-y-5">
                {/* Image Preview */}
                {imagePreview && (
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-w-md h-48 object-cover rounded-lg border-4 border-[#B91C1C] shadow-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Heading */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Heading *
                  </label>
                  <input
                    type="text"
                    name="heading"
                    value={eventFormData.heading}
                    onChange={handleEventInputChange}
                    required
                    placeholder="Enter news/event heading"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] transition-all text-gray-900 font-medium"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={eventFormData.description}
                    onChange={handleEventInputChange}
                    rows="4"
                    placeholder="Enter description"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] transition-all text-gray-900 font-medium"
                  />
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    value={eventFormData.display_order}
                    onChange={handleEventInputChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] transition-all text-gray-900 font-medium"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in the carousel</p>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-[#B91C1C] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#B91C1C] file:text-white file:font-semibold hover:file:bg-[#991515] file:cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 1200x800px (Max 5MB)</p>
                </div>

                {/* Active Status */}
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={eventFormData.is_active}
                      onChange={handleEventInputChange}
                      className="w-5 h-5 text-[#B91C1C] border-gray-300 rounded focus:ring-[#B91C1C] cursor-pointer"
                    />
                    <span className="ml-3 text-sm font-bold text-gray-900">
                      Active (Visible on website)
                    </span>
                  </label>
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
                    <span>{editingEvent ? 'Update' : 'Add'} News/Event</span>
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
            <div className="bg-[#B91C1C] p-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <FaTrash size={28} className="text-[#B91C1C]" />
                </div>
              </div>
            </div>

            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Delete News/Event?</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Are you sure you want to permanently delete this news/event? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteEvent(deleteConfirm)}
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

export default SettingsManager;
