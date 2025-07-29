import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Briefcase,
  Power,
  Sun,
  Moon,
  UserCogIcon,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// --- [INTERNAL] --- Admin Navbar Component (Unchanged)
const AdminNavbar = ({ onLogoutClick, darkMode, toggleDarkMode }) => {
  return (
    <div className="flex flex-col w-20 xl:w-64 bg-gray-900 text-gray-200 p-4 border-r border-gray-700/50">
      <div className="flex items-center justify-center xl:justify-start gap-3 mb-10 h-12">
        <motion.div
          className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <Briefcase size={22} className="text-white" />
        </motion.div>
        <h1 className="hidden xl:block text-xl font-bold text-white tracking-wider">
          V-MANAGER
        </h1>
      </div>
      <nav className="flex-grow ">
        <ul>
          <a href="/dashboard">
            <li className="relative">
              <button className="w-full flex mt-4 justify-center xl:justify-start items-center gap-4 py-3 px-3 rounded-lg bg-red-600/30 text-white font-semibold border border-red-500/50 shadow-inner shadow-red-900/50">
                <UserCogIcon size={22} />
                <span className="hidden xl:block">Dashboard</span>
              </button>
            </li>
          </a>
        </ul>
      </nav>
      <div className="mt-auto space-y-2">
        <button
          onClick={onLogoutClick}
          className="w-full flex justify-center xl:justify-start items-center gap-4 py-3 px-3 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          <Power size={22} />
          <span className="hidden xl:block">Logout</span>
        </button>
      </div>
    </div>
  );
};

// --- [HELPER FUNCTION FOR CROPPING] --- (Unchanged)
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

// --- Vacancy Modal with Image Cropping --- (Unchanged)
const VacancyModal = ({ isOpen, onClose, onSave, vacancy, darkMode }) => {
  const [subject, setSubject] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedImageBlob, setCroppedImageBlob] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (vacancy) {
        setSubject(vacancy.subject);
        setImgSrc(vacancy.imageUrl);
      } else {
        setSubject("");
        setImgSrc("");
        setCrop(undefined);
        setCompletedCrop(null);
        setCroppedImageBlob(null);
      }
    }
  }, [vacancy, isOpen]);

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 16 / 9));
  }

  useEffect(() => {
    async function getCroppedImage() {
      const image = imgRef.current;
      if (!image || !completedCrop) return;
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = Math.floor(completedCrop.width * scaleX);
      canvas.height = Math.floor(completedCrop.height * scaleY);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No 2d context");
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
      canvas.toBlob(
        (blob) => {
          if (blob) setCroppedImageBlob(blob);
        },
        "image/jpeg",
        0.95
      );
    }
    if (completedCrop?.width && completedCrop?.height && imgRef.current)
      getCroppedImage();
  }, [completedCrop]);

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("subject", subject);
    // If the user is editing but hasn't selected a new image, don't append one.
    // The backend will know to only update the subject.
    if (croppedImageBlob) {
        formData.append("image", croppedImageBlob, "cropped-image.jpg");
    } else if (!vacancy) { // If creating new, image is required
        toast.error("An image is required to create a new vacancy.");
        return;
    }
    await onSave(formData, vacancy?.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 font-noto-serif">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-4xl rounded-xl shadow-2xl ${
              darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
            }`}
          >
            <div className="p-8">
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${
                  darkMode
                    ? "text-gray-400 hover:bg-gray-700"
                    : "text-gray-500 hover:bg-gray-200"
                }`}
              >
                <X size={24} />
              </button>
              <h2
                className={`text-2xl font-bold mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {vacancy ? "Edit Vacancy" : "Create New Vacancy"}
              </h2>
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label
                      className={`block text-sm font-semibold ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Cover Image (16:9 aspect ratio)
                    </label>
                    <input
                      type="file"
                      onChange={onSelectFile}
                      accept="image/*"
                      className={`block w-full text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      } file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
                        darkMode
                          ? "file:bg-indigo-600/30 file:text-indigo-300 hover:file:bg-indigo-600/40"
                          : "file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      }`}
                    />
                    <div
                      className={`w-full aspect-video rounded-lg flex items-center justify-center text-center border-2 border-dashed ${
                        darkMode
                          ? "bg-gray-700/50 border-gray-600"
                          : "bg-gray-100 border-gray-300"
                      }`}
                    >
                      {imgSrc ? (
                        <ReactCrop
                          crop={crop}
                          onChange={(_, percentCrop) => setCrop(percentCrop)}
                          onComplete={(c) => setCompletedCrop(c)}
                          aspect={16 / 9}
                          className="max-h-[400px]"
                        >
                          <img
                            ref={imgRef}
                            alt="Crop me"
                            src={imgSrc}
                            onLoad={onImageLoad}
                          />
                        </ReactCrop>
                      ) : (
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {vacancy ? 'Current image is used. Upload a new one to replace it.' : 'Upload an image to crop'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="subject"
                        className={`block text-sm font-semibold mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Vacancy Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className={`w-full p-3 rounded-lg transition-colors border ${
                          darkMode
                            ? "bg-gray-700 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                            : "bg-gray-100 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        }`}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`pt-8 mt-8 border-t flex justify-end space-x-3 ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-5 py-2 rounded-lg font-semibold transition-colors ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-red-500/40 transition-shadow"
                  >
                    {vacancy ? "Save Changes" : "Create"}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- [INTERNAL] --- Logout Confirmation Modal (Unchanged)
const LogoutConfirmationModal = ({ isOpen, onConfirm, onCancel, darkMode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 font-noto-serif">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-md rounded-2xl p-8 text-center shadow-2xl ${
              darkMode ? "bg-gray-800 border border-red-500/30" : "bg-white"
            }`}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-8 left-48 -translate-x-1/2 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50"
            >
              <Power size={32} className="text-white " />
            </motion.div>
            <h2
              className={`text-2xl font-bold mt-8 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Confirm Logout
            </h2>
            <p
              className={`mt-2 text-base ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Are you sure you want to end your current session?
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCancel}
                className={`px-8 py-2 rounded-lg font-semibold transition-colors ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                Stay
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className="px-8 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md shadow-red-500/30 transition-all"
              >
                Logout
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- [MAIN COMPONENT - MODIFIED FOR AUTHENTICATION] ---
const VacancyManager = () => {
  const [vacancies, setVacancies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : true;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // ✅ MODIFIED: Function to handle expired tokens and redirect
  const handleAuthError = (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("adminToken");
        navigate("/alshaheen-pro-login");
    } else {
        // For other errors, just show the toast
        throw error;
    }
  };

  const fetchVacancies = async () => {
    // ✅ ADDED: Get token from storage
    const token = localStorage.getItem("adminToken");
    if (!token) {
        navigate("/alshaheen-pro-login");
        return;
    }

    try {
      const response = await axios.get(
        `${baseUrl}/api/admin/vacancies`, {
            // ✅ ADDED: Authorization header
            headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setVacancies(response.data);
    } catch (err) {
      handleAuthError(err);
      if (!err.response || (err.response.status !== 401 && err.response.status !== 403)) {
          toast.error("Failed to fetch vacancies.");
      }
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const filteredAndSortedVacancies = useMemo(() => {
    let processedVacancies = [...vacancies].filter((vacancy) =>
      vacancy.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
    processedVacancies.sort((a, b) => {
      switch (sortBy) {
        case "date_asc": return new Date(a.createdAt) - new Date(b.createdAt);
        case "subject_asc": return a.subject.localeCompare(b.subject);
        case "subject_desc": return b.subject.localeCompare(a.subject);
        case "date_desc": default: return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    return processedVacancies;
  }, [vacancies, searchQuery, sortBy]);

  const handleOpenAddModal = () => {
    setEditingVacancy(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vacancy) => {
    setEditingVacancy(vacancy);
    setIsModalOpen(true);
  };

  const handleSave = async (formData, id) => {
    const isEditing = !!id;
    // ✅ ADDED: Get token from storage
    const token = localStorage.getItem("adminToken");
    if (!token) {
        navigate("/alshaheen-pro-login");
        return;
    }
    
    // ✅ ADDED: Authorization header to config
    const config = { 
        headers: { 
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`
        } 
    };

    await toast.promise(
      (isEditing
        ? axios.put(`${baseUrl}/api/admin/vacancies/${id}`, formData, config)
        : axios.post(`${baseUrl}/api/admin/vacancies`, formData, config)
      ).then(() => {
        setIsModalOpen(false);
        fetchVacancies();
      }),
      {
        loading: "Saving vacancy...",
        success: `Vacancy ${isEditing ? "updated" : "created"} successfully!`,
        error: (err) => {
            handleAuthError(err);
            return `Failed to ${isEditing ? "update" : "create"} vacancy.`;
        },
      }
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this vacancy?")) return;
    
    // ✅ ADDED: Get token from storage
    const token = localStorage.getItem("adminToken");
    if (!token) {
        navigate("/alshaheen-pro-login");
        return;
    }
    
    await toast.promise(
      axios.delete(`${baseUrl}/api/admin/vacancies/${id}`, {
            // ✅ ADDED: Authorization header
            headers: { 'Authorization': `Bearer ${token}` }
      }).then(() => {
          fetchVacancies();
        }),
      {
        loading: "Deleting vacancy...",
        success: "Vacancy deleted successfully!",
        error: (err) => {
            handleAuthError(err);
            return "Failed to delete vacancy.";
        },
      }
    );
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully!");
    navigate("/alshaheen-pro-login");
  };

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: `font-noto-serif ${
            darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
          }`,
        }}
      />
      <VacancyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        vacancy={editingVacancy}
        darkMode={darkMode}
      />
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        darkMode={darkMode}
      />

      <div
        className={`flex min-h-screen font-noto-serif transition-colors duration-300 ${
          darkMode ? "dark bg-gray-900" : "bg-gray-100"
        }`}
      >
        <AdminNavbar
          onLogoutClick={() => setShowLogoutModal(true)}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Vacancy Manager
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 md:gap-4 w-full md:w-auto"
            >
              <div className="relative flex-grow md:flex-grow-0">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border transition-colors ${
                    darkMode
                      ? "bg-gray-800 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                      : "bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  }`}
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`rounded-lg border py-2 px-6 text-sm transition-colors ${
                  darkMode
                    ? "bg-gray-800 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                    : "bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
              >
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="subject_asc">Subject (A-Z)</option>
                <option value="subject_desc">Subject (Z-A)</option>
              </select>
              <motion.button
                onClick={handleOpenAddModal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-red-500/40 transition-shadow duration-300"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Vacancy</span>
              </motion.button>
            </motion.div>
          </div>
          {filteredAndSortedVacancies.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            >
              {filteredAndSortedVacancies.map((vacancy) => (
                <motion.div
                  key={vacancy.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className={`group rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    darkMode
                      ? "bg-gray-800 border border-gray-700/50 hover:border-indigo-500/50 hover:shadow-indigo-500/20"
                      : "bg-white hover:shadow-indigo-500/20"
                  }`}
                >
                  <div className="overflow-hidden h-40">
                    <img
                      src={vacancy.imageUrl}
                      alt={vacancy.subject}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3
                      className={`font-bold text-base truncate ${
                        darkMode ? "text-gray-100" : "text-gray-900"
                      }`}
                      title={vacancy.subject}
                    >
                      {vacancy.subject}
                    </h3>
                    <p
                      className={`text-xs mt-1 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Created:{" "}
                      {new Date(vacancy.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className={`p-2 border-t flex justify-end space-x-1 ${
                      darkMode
                        ? "bg-gray-800/50 border-gray-700"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <button
                      onClick={() => handleOpenEditModal(vacancy)}
                      className={`p-2 rounded-full transition-colors ${
                        darkMode
                          ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                          : "text-gray-500 hover:bg-gray-200 hover:text-indigo-600"
                      }`}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(vacancy.id)}
                      className={`p-2 rounded-full transition-colors ${
                        darkMode
                          ? "text-gray-400 hover:bg-gray-700 hover:text-red-400"
                          : "text-gray-500 hover:bg-gray-200 hover:text-red-500"
                      }`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <Search
                size={48}
                className={`mx-auto ${
                  darkMode ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <p
                className={`mt-4 text-lg ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {searchQuery
                  ? "No vacancies match your search."
                  : "No vacancies found."}
              </p>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {searchQuery
                  ? "Try a different search term or clear the search."
                  : "Click 'Add Vacancy' to create one."}
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default VacancyManager;