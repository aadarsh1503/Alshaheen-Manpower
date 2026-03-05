import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Filters from '../../Filters/Filters';
import Skeleton from '../../Skeleton/Skeleton';
import Toggle from '../../Toggle/Toggle';
import { FiDownload, FiEdit2, FiTrash2, FiShield, FiSettings, FiLock } from 'react-icons/fi';
const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPDF, setShowPDF] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
   
    return savedMode ? JSON.parse(savedMode) : false; 
  });
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedEntry, setEditedEntry] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [version, setVersion] = useState('1.0.0');
  const [blacklistConfirm, setBlacklistConfirm] = useState(null);
  const [filters, setFilters] = useState({
    email: '',
    nationality: '',
    currentlyEmployed: '',
    dateRange: 'all',
    customStart: '',
    customEnd: '',
    canTravel: '',
    drivingLicense: '',  
    gender: '',      
    educationLevel: '',
    searchTerm: '',
    employmentDesired: '',
    yearsOfExperience: '' // Add this line
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const fetchEntries = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');

    // If no token exists, redirect to login page immediately
    if (!token) {
      toast.error("Access denied. Please log in.");
      navigate("/alshaheen-pro-login"); // Use the correct login route
      return;
    }

    try {
      const response = await axios.get(`/api/admin/form-entries`, {
        headers: {
          // Send the token for authorization
          'Authorization': `Bearer ${token}`
        }
      });
      // Filter out blacklisted candidates
      const nonBlacklistedEntries = response.data.filter(entry => !entry.isBlacklisted);
      setEntries(nonBlacklistedEntries);
      setFilteredEntries(nonBlacklistedEntries);
    } catch (err) {
      console.error('Failed to fetch entries:', err);
      // Handle expired or invalid token
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem('adminToken');
        navigate("/alshaheen-pro-login");
      } else {
        toast.error("Failed to fetch candidate data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...entries];
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(entry => 
        (entry.fullName?.toLowerCase().includes(term)) ||
        (entry.email?.toLowerCase().includes(term)) ||
        (entry.skills?.toLowerCase().includes(term))
      );
    }

    if (filters.nationality) {
      result = result.filter(entry => 
        entry.nationality?.toLowerCase().includes(filters.nationality.toLowerCase())
      );
    }

    if (filters.employmentDesired) {
      result = result.filter(entry => 
        entry.employmentDesired === filters.employmentDesired
      );
    }
    
    if (filters.currentlyEmployed) {
      result = result.filter(entry => 
        String(entry.currentlyEmployed).toUpperCase() === filters.currentlyEmployed.toUpperCase()
      );
    }

    if (filters.educationLevel) {
      result = result.filter(entry => 
        entry.educationLevel === filters.educationLevel
      );
    }
      // Add driving license filter
  if (filters.drivingLicense) {
    result = result.filter(entry => 
      String(entry.drivingLicense).toUpperCase() === filters.drivingLicense.toUpperCase()
    );
  }

  // Add gender filter
  if (filters.gender) {
    result = result.filter(entry => 
      entry.gender?.toLowerCase() === filters.gender.toLowerCase()
    );
  }
  if (filters.canTravel) {
    result = result.filter(entry => 
      entry.canTravel?.toLowerCase() === filters.canTravel.toLowerCase()
    );
  }

  if (filters.dateRange && filters.dateRange !== 'all') {
    let now = new Date();
    let startDate = new Date();
  
    switch (filters.dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        break;
        case '1y':
          const lastYear = now.getFullYear() - 1;
          startDate = new Date(`${lastYear}-01-01T00:00:00`);
          now = new Date(`${lastYear}-12-31T23:59:59`);
          break;
        
      case 'custom':
        if (filters.customStart) {
          startDate = new Date(filters.customStart);
          startDate.setHours(0, 0, 0, 0);
        }
        if (filters.customEnd) {
          now = new Date(filters.customEnd);
          now.setHours(23, 59, 59, 999);
        }
        break;
    }
  
    result = result.filter(entry => {
      const entryDate = new Date(entry.submittedAt);
      return entryDate >= startDate && entryDate <= now;
    });
  }
  
    if (filters.yearsOfExperience) {
      const expFilter = filters.yearsOfExperience.toLowerCase();
      
      result = result.filter(entry => {
        const entryExp = entry.yearsOfExperience ? 
          entry.yearsOfExperience.toString().toLowerCase() : 
          '';
        
        // If "fresher" is selected
        if (expFilter === 'fresher') {
          return entryExp === '0' || !entryExp;
        }
        // If a number is entered
        else if (!isNaN(expFilter)) {
          return entryExp === expFilter;
        }
        // If partial match (like "f" for fresher)
        return entryExp.includes(expFilter);
      });
    }
    setFilteredEntries(result);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      applyFilters();
    }
  }, [filters, entries]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const openModal = (entry) => {
    setSelectedEntry(entry);
    setEditedEntry({ ...entry });
    setIsEditMode(false);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditedEntry(null);
    document.body.style.overflow = 'auto';
  };

  // Handle Edit Mode
  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedEntry({ ...selectedEntry });
  };

  const handleInputChange = (field, value) => {
    setEditedEntry(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error("Access denied. Please log in.");
      return;
    }

    try {
      const response = await axios.put(
        `/api/admin/form-entries/${editedEntry.id}`,
        editedEntry,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast.success("✅ Candidate updated successfully!");
      
      // Update local state
      setEntries(prev => prev.map(e => e.id === editedEntry.id ? editedEntry : e));
      setFilteredEntries(prev => prev.map(e => e.id === editedEntry.id ? editedEntry : e));
      setSelectedEntry(editedEntry);
      setIsEditMode(false);
    } catch (err) {
      console.error('Failed to update entry:', err);
      toast.error("❌ Failed to update candidate.");
    }
  };

  // Handle Delete
  const openDeleteModal = (entry) => {
    setEntryToDelete(entry);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEntryToDelete(null);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error("Access denied. Please log in.");
      return;
    }

    try {
      await axios.delete(
        `/api/admin/form-entries/${entryToDelete.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast.success("✅ Candidate deleted successfully!");
      
      // Update local state
      setEntries(prev => prev.filter(e => e.id !== entryToDelete.id));
      setFilteredEntries(prev => prev.filter(e => e.id !== entryToDelete.id));
      
      closeDeleteModal();
      if (isModalOpen && selectedEntry?.id === entryToDelete.id) {
        closeModal();
      }
    } catch (err) {
      console.error('Failed to delete entry:', err);
      toast.error("❌ Failed to delete candidate.");
    }
  };

  const clearAllFilters = () => {
    setFilters({
      email: '',
      nationality: '',
      currentlyEmployed: '',
      dateRange: 'all',
      customStart: '',
      drivingLicense: '',
      canTravel: '',
      gender: '',
      customEnd: '',
      educationLevel: '',
      searchTerm: '',
      employmentDesired: '',
      yearsOfExperience: '' // Add this line
    });
  };

  // Fetch Settings
  const fetchSettings = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await axios.get(`/api/admin/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setVersion(response.data.version || '1.0.0');
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  // Update Version
  const updateVersion = async (newVersion) => {
    const token = localStorage.getItem('adminToken');
    try {
      await axios.put(`/api/admin/settings`, 
        { key: 'version', value: newVersion },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      toast.success('✅ Version updated successfully!');
      setVersion(newVersion);
      setIsSettingsModalOpen(false);
    } catch (err) {
      toast.error('❌ Failed to update version');
    }
  };

  // Handle Blacklist Toggle
  const handleBlacklistToggle = async (entry) => {
    const newStatus = !entry.isBlacklisted;
    setBlacklistConfirm({ entry, newStatus });
  };

  const confirmBlacklist = async () => {
    const { entry, newStatus } = blacklistConfirm;
    const token = localStorage.getItem('adminToken');
    
    try {
      await axios.patch(
        `/api/admin/form-entries/${entry.id}/blacklist`,
        { isBlacklisted: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      toast.success(newStatus ? '🚫 Candidate blacklisted successfully' : '✅ Candidate removed from blacklist');
      
      if (newStatus) {
        // If blacklisting, remove from the current view immediately
        setEntries(prev => prev.filter(e => e.id !== entry.id));
        setFilteredEntries(prev => prev.filter(e => e.id !== entry.id));
      } else {
        // If unblacklisting, update the status
        setEntries(prev => prev.map(e => 
          e.id === entry.id ? { ...e, isBlacklisted: newStatus } : e
        ));
        setFilteredEntries(prev => prev.map(e => 
          e.id === entry.id ? { ...e, isBlacklisted: newStatus } : e
        ));
      }
      
      setBlacklistConfirm(null);
    } catch (err) {
      toast.error('❌ Failed to update blacklist status');
    }
  };

  // Change Password
  const handleChangePassword = async (currentPassword, newPassword) => {
    const token = localStorage.getItem('adminToken');
    
    try {
      await axios.post(
        `/api/admin/change-password`,
        { currentPassword, newPassword },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      toast.success('✅ Password changed successfully!');
      setIsPasswordModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Failed to change password');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      });
    } catch (error) {
      return dateString;
    }
  };

  const renderField = (label, value, isDate = false) => {
    if (!value) return null;
    const displayValue = isDate ? formatDate(value) : value;
    return (
      <p className={`mt-1 text-sm font-noto-serif ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <strong className={darkMode ? 'text-[#DC2626]' : 'text-[#DC2626]'}>{label}:</strong> {displayValue}
      </p>
    );
  };

  const renderEditableField = (label, field, value, type = 'text') => {
    const isDateField = type === 'date' || field.includes('Validity') || field.includes('dateOfBirth') || field.includes('Date');
    
    if (isEditMode) {
      // For date inputs, format the value to YYYY-MM-DD
      let inputValue = value || '';
      if (isDateField && value) {
        try {
          const date = new Date(value);
          inputValue = date.toISOString().split('T')[0];
        } catch (error) {
          inputValue = value;
        }
      }
      
      return (
        <div className="mt-2">
          <label className={`text-sm font-semibold ${darkMode ? 'text-[#DC2626]' : 'text-[#DC2626]'}`}>
            {label}:
          </label>
          <input
            type={isDateField ? 'date' : type}
            value={inputValue}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={`w-full mt-1 px-3 py-2 rounded-lg border ${
              darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>
      );
    }
    return renderField(label, value, isDateField);
  };

  const exportData = (format) => {
    const dataToExport = filteredEntries.length > 0 ? filteredEntries : entries;
    
    switch(format) {
      case 'csv':
        exportToCSV(dataToExport);
        break;
      case 'excel':
        exportToExcel(dataToExport);
        break;
      case 'pdf':
        exportToPDF(dataToExport);
        break;
      default:
        exportToCSV(dataToExport);
    }
  };

  // Export All Data (Candidates + Vacancies)
  const exportAllData = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error("Access denied. Please log in.");
      return;
    }

    try {
      toast.loading("Fetching all data...");
      
      // Fetch vacancies data
      const vacanciesResponse = await axios.get(`/api/admin/vacancies`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch internship applications data
      const internshipsResponse = await axios.get(`/api/internships/applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const XLSX = await import('xlsx');
      
      // Prepare candidates data
      const candidatesData = entries.map(entry => ({
        'Name': entry.fullName,
        'Email': entry.email,
        'Nationality': entry.nationality,
        'Date of Birth': entry.dateOfBirth ? new Date(entry.dateOfBirth).toLocaleDateString('en-GB') : '',
        'Gender': entry.gender,
        'Mobile Contact': entry.mobileContact,
        'WhatsApp': entry.whatsapp,
        'Postal Code': entry.postalCode || '',
        'City': entry.city || '',
        'Country': entry.country || '',
        'Current Address': entry.currentAddress,
        'CPR/National ID': entry.cprNationalId,
        'Passport ID': entry.passportId,
        'Passport Validity': entry.passportValidity ? new Date(entry.passportValidity).toLocaleDateString('en-GB') : '',
        'Education Level': entry.educationLevel,
        'Course/Degree': entry.courseDegree,
        'Currently Employed': entry.currentlyEmployed === 'YES' ? 'Employed' : 'Not Employed',
        'Employment Desired': entry.employmentDesired,
        'Years of Experience': entry.yearsOfExperience ? `${entry.yearsOfExperience} years` : '',
        'Available Start': entry.availableStart,
        'Shift Available': entry.shiftAvailable,
        'Can Travel': entry.canTravel,
        'Driving License': entry.drivingLicense,
        'Skills': entry.skills,
        'Visa Status': entry.visaStatus,
        'Visa Validity': entry.visaValidity ? new Date(entry.visaValidity).toLocaleDateString('en-GB') : '',
        'Expected Salary': entry.expectedSalary,
        'Client Leads Strategy': entry.clientLeadsStrategy,
        'Reference 1 Name': entry.ref1Name,
        'Reference 1 Contact': entry.ref1Contact,
        'Reference 1 Email': entry.ref1Email,
        'Reference 2 Name': entry.ref2Name,
        'Reference 2 Contact': entry.ref2Contact,
        'Reference 2 Email': entry.ref2Email,
        'Reference 3 Name': entry.ref3Name,
        'Reference 3 Contact': entry.ref3Contact,
        'Reference 3 Email': entry.ref3Email,
        'Resume File': 'Resume Link',
        'Submitted At': entry.submittedAt ? new Date(entry.submittedAt).toISOString().split('T')[0] : '',
      }));

      // Prepare vacancies data
      const vacanciesData = vacanciesResponse.data.map(vacancy => ({
        'ID': vacancy.id,
        'Subject': vacancy.subject,
        'Image URL': vacancy.imageUrl,
        'Created At': vacancy.createdAt ? new Date(vacancy.createdAt).toLocaleDateString() : '',
      }));

      // Prepare internship applications data
      const internshipsData = internshipsResponse.data.data.map(app => ({
        'Name': app.name,
        'Email': app.email,
        'Mobile': app.mobile,
        'Date of Birth': app.dob ? new Date(app.dob).toLocaleDateString() : '',
        'Gender': app.gender,
        'Qualification': app.qualification,
        'University': app.university,
        'Department': app.department,
        'Internship Coordinator': app.internship_coordinator,
        'Hours': app.hours,
        'Joining Date': app.joining_date ? new Date(app.joining_date).toLocaleDateString() : '',
        'Place': app.place,
        'Disability': app.disability,
        'Disability Type': app.disability_type || '',
        'Stage': app.stage,
        'Resume URL': app.resume_url,
        'Applied Date': app.created_at ? new Date(app.created_at).toLocaleDateString() : '',
      }));

      // Create workbook with multiple sheets
      const workbook = XLSX.utils.book_new();
      
      // Add Candidates sheet
      const candidatesSheet = XLSX.utils.json_to_sheet(candidatesData);
      const candidatesHeader = Object.keys(candidatesData[0] || {});
      const resumeColIndex = candidatesHeader.indexOf('Resume File');
      
      candidatesSheet['!cols'] = candidatesHeader.map(() => ({ wch: 25 }));
      if (resumeColIndex !== -1) {
        candidatesSheet['!cols'][resumeColIndex] = { wch: 40 };
      }
      
      // Add resume hyperlinks
      entries.forEach((entry, idx) => {
        if (entry.resumeFile && resumeColIndex !== -1) {
          const cellAddress = XLSX.utils.encode_cell({ c: resumeColIndex, r: idx + 1 });
          candidatesSheet[cellAddress] = {
            v: 'Resume Link',
            t: 's',
            l: {
              Target: entry.resumeFile,
              Tooltip: 'Open Resume',
            }
          };
        }
      });
      
      XLSX.utils.book_append_sheet(workbook, candidatesSheet, 'Candidates');
      
      // Add Vacancies sheet
      const vacanciesSheet = XLSX.utils.json_to_sheet(vacanciesData);
      vacanciesSheet['!cols'] = [
        { wch: 10 },  // ID
        { wch: 40 },  // Subject
        { wch: 50 },  // Image URL
        { wch: 20 },  // Created At
      ];
      
      XLSX.utils.book_append_sheet(workbook, vacanciesSheet, 'Vacancies');
      
      // Add Internships sheet
      const internshipsSheet = XLSX.utils.json_to_sheet(internshipsData);
      internshipsSheet['!cols'] = [
        { wch: 25 },  // Name
        { wch: 30 },  // Email
        { wch: 15 },  // Mobile
        { wch: 15 },  // DOB
        { wch: 10 },  // Gender
        { wch: 20 },  // Qualification
        { wch: 30 },  // University
        { wch: 15 },  // Department
        { wch: 25 },  // Coordinator
        { wch: 10 },  // Hours
        { wch: 15 },  // Joining Date
        { wch: 20 },  // Place
        { wch: 10 },  // Disability
        { wch: 20 },  // Disability Type
        { wch: 15 },  // Stage
        { wch: 40 },  // Resume URL
        { wch: 15 },  // Applied Date
      ];
      
      XLSX.utils.book_append_sheet(workbook, internshipsSheet, 'Internships');
      
      // Download the file
      XLSX.writeFile(workbook, `complete_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
      
      toast.dismiss();
      toast.success("All data exported successfully!");
    } catch (err) {
      toast.dismiss();
      console.error('Error exporting all data:', err);
      toast.error("Failed to export all data.");
    }
  };

  const exportToCSV = (data) => {
    const headers = [
      ['Name', 'fullName'],
      ['Email', 'email'],
      ['Nationality', 'nationality'],
      ['Date of Birth', 'dateOfBirth'],
      ['Gender', 'gender'],
      ['Mobile Contact', 'mobileContact'],
      ['WhatsApp', 'whatsapp'],
      ['Current Address', 'currentAddress'],
      ['Postal Code', 'postalCode'],
      ['City', 'city'],
      ['Country', 'country'],
      ['CPR/National ID', 'cprNationalId'],
      ['Passport ID', 'passportId'],
      ['Passport Validity', 'passportValidity'],
      ['Education Level', 'educationLevel'],
      ['Course/Degree', 'courseDegree'],
      ['Currently Employed', 'currentlyEmployed'],
      ['Employment Desired', 'employmentDesired'],
      ['Years of Experience', 'yearsOfExperience'],
      ['Available Start', 'availableStart'],
      ['Shift Available', 'shiftAvailable'],
      ['Can Travel', 'canTravel'],
      ['Driving License', 'drivingLicense'],
      ['Skills', 'skills'],
      ['Visa Status', 'visaStatus'],
      ['Visa Validity', 'visaValidity'],
      ['Expected Salary', 'expectedSalary'],
      ['Client Leads Strategy', 'clientLeadsStrategy'],
      ['Reference 1 Name', 'ref1Name'],
      ['Reference 1 Contact', 'ref1Contact'],
      ['Reference 1 Email', 'ref1Email'],
      ['Reference 2 Name', 'ref2Name'],
      ['Reference 2 Contact', 'ref2Contact'],
      ['Reference 2 Email', 'ref2Email'],
      ['Reference 3 Name', 'ref3Name'],
      ['Reference 3 Contact', 'ref3Contact'],
      ['Reference 3 Email', 'ref3Email'],
      ['Submitted At', 'submittedAt'],
      ['Resume File', 'resumeFile']
    ];
  
    let csv = headers.map(h => h[0]).join(',') + '\n';
  
    data.forEach(entry => {
      const row = headers.map(([label, key]) => {
        let value = entry[key] || '';
  
        // Custom formatting
        if (key === 'currentlyEmployed') {
          value = value === 'YES' ? 'Employed' : 'Not Employed';
        } else if (key === 'submittedAt') {
          value = new Date(value).toLocaleString();
        } else if (key === 'dateOfBirth' || key === 'passportValidity' || key === 'visaValidity') {
          value = value ? new Date(value).toLocaleDateString('en-GB') : '';
        } else if (key === 'resumeFile') {
          value = value ? entry.resumeFile : '';
        }
  
        return `"${String(value).replace(/"/g, '""')}"`;
      });
  
      csv += row.join(',') + '\n';
    });
  
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `candidates_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  
  const exportToExcel = async (data) => {
    try {
      const XLSX = await import('xlsx');
  
      const excelData = data.map(entry => ({
        'Name': entry.fullName,
        'Email': entry.email,
        'Nationality': entry.nationality,
        'Date of Birth': entry.dateOfBirth ? new Date(entry.dateOfBirth).toLocaleDateString('en-GB') : '',
        'Gender': entry.gender,
        'Mobile Contact': entry.mobileContact,
        'WhatsApp': entry.whatsapp,
        'Postal Code': entry.postalCode || '',
        'City': entry.city || '',
        'Country': entry.country || '',
        'Current Address': entry.currentAddress,
        'CPR/National ID': entry.cprNationalId,
        'Passport ID': entry.passportId,
        'Passport Validity': entry.passportValidity ? new Date(entry.passportValidity).toLocaleDateString('en-GB') : '',
        'Education Level': entry.educationLevel,
        'Course/Degree': entry.courseDegree,
        'Currently Employed': entry.currentlyEmployed === 'YES' ? 'Employed' : 'Not Employed',
        'Employment Desired': entry.employmentDesired,
        'Years of Experience': entry.yearsOfExperience ? `${entry.yearsOfExperience} years` : '',
        'Available Start': entry.availableStart,
        'Shift Available': entry.shiftAvailable,
        'Can Travel': entry.canTravel,
        'Driving License': entry.drivingLicense,
        'Skills': entry.skills,
        'Visa Status': entry.visaStatus,
        'Visa Validity': entry.visaValidity ? new Date(entry.visaValidity).toLocaleDateString('en-GB') : '',

        'Expected Salary': entry.expectedSalary,
        'Client Leads Strategy': entry.clientLeadsStrategy,
        'Reference 1 Name': entry.ref1Name,
        'Reference 1 Contact': entry.ref1Contact,
        'Reference 1 Email': entry.ref1Email,
        'Reference 2 Name': entry.ref2Name,
        'Reference 2 Contact': entry.ref2Contact,
        'Reference 2 Email': entry.ref2Email,
        'Reference 3 Name': entry.ref3Name,
        'Reference 3 Contact': entry.ref3Contact,
        'Reference 3 Email': entry.ref3Email,
        'Resume File': 'Resume Link', // show only label, not link
        'Submitted At': entry.submittedAt ? new Date(entry.submittedAt).toISOString().split('T')[0] : '',

      }));
  
      const worksheet = XLSX.utils.json_to_sheet(excelData);
  
      // Dynamically get column index of "Resume File"
      const header = Object.keys(excelData[0]);
      const resumeColIndex = header.indexOf('Resume File');
  
      worksheet['!cols'] = header.map(() => ({ wch: 25 }));
      worksheet['!cols'][resumeColIndex] = { wch: 40 };
  
      // Replace "Resume File" cells with hyperlinks
      data.forEach((entry, idx) => {
        if (entry.resumeFile) {
          const cellAddress = XLSX.utils.encode_cell({ c: resumeColIndex, r: idx + 1 });
          worksheet[cellAddress] = {
            v: 'Resume Link',
            t: 's',
            l: {
              Target: entry.resumeFile,
              Tooltip: 'Open Resume',
            }
          };
        }
      });
  
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates');
      XLSX.writeFile(workbook, `candidates_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error('Error exporting to Excel:', err);
    }
  };
  
  
  const exportToPDF = async (data) => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
  
      const doc = new jsPDF();
  
      // Check if data is empty
      if (!data || data.length === 0) {
        doc.text('No candidate data available', 14, 20);
        doc.save(`candidates_export_${new Date().toISOString().slice(0, 10)}.pdf`);
        return;
      }
  
      // Title
      doc.setFontSize(18);
      doc.text('Candidate Export', 14, 15);
      doc.setFontSize(11);
      doc.setTextColor(100);
  
      // Prepare table data for the summary page
      const tableData = data.map(entry => [
        entry.fullName || '-',
        entry.email || '-',
        entry.gender || '-',
        entry.nationality || '-',
        entry.currentlyEmployed === 'YES' ? 'Employed' : 'Not Employed',
        entry.employmentDesired || '-',
        entry.expectedSalary || '-',
        entry.submittedAt ? new Date(entry.submittedAt).toLocaleDateString() : '-'
      ]);
  
      // Add summary table
      autoTable(doc, {
        head: [['Name', 'Email', 'Gender', 'Nationality', 'Employment', 'Employment Desired', 'Expected Salary', 'Date Submitted']],
        body: tableData,
        startY: 25,
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      });
  
      // Get the last Y position after the summary table
      const summaryEndY = doc.lastAutoTable.finalY;
  
      // Add detailed pages for each candidate
      data.forEach((entry, index) => {
        let yPos;
  
        if (index === 0) {
          // For the first candidate detailed page,
          // decide if start on same page or new page based on space left
          if (summaryEndY + 100 > 280) {
            // Not enough space, add a new page
            doc.addPage();
            yPos = 20;
          } else {
            // Enough space, start below the summary table
            yPos = summaryEndY + 10;
          }
        } else {
          // For subsequent candidates, always add a new page
          doc.addPage();
          yPos = 20;
        }
  
        // Candidate Details header
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text(`Candidate Details: ${entry.fullName || 'Unknown'}`, 14, yPos);
        yPos += 10;
  
        // Basic info lines
        doc.setFontSize(12);
        const details = [
          `Email: ${entry.email || '-'}`,
          `Nationality: ${entry.nationality || '-'}`,
          `Date of Birth: ${entry.dateOfBirth ? new Date(entry.dateOfBirth).toLocaleDateString('en-GB') : '-'}`,
          `Gender: ${entry.gender || '-'}`,
`Years of Experience: ${entry.yearsOfExperience || '-'} years`,
          `Contact: ${entry.mobileContact || '-'}`,
          `WhatsApp: ${entry.whatsapp || '-'}`,
          `Postal Code: ${entry.postalCode || '-'}`,
          `City: ${entry.city || '-'}`,
          `Country: ${entry.country || '-'}`,
          `Address: ${entry.currentAddress || '-'}`,
          `CPR/National ID: ${entry.cprNationalId || '-'}`,
          `Passport: ${entry.passportId || '-'} (Valid until: ${entry.passportValidity ? new Date(entry.passportValidity).toLocaleDateString('en-GB') : '-'})`,
          `Visa: ${entry.visaStatus || '-'} (Valid until: ${entry.visaValidity ? new Date(entry.visaValidity).toLocaleDateString('en-GB') : '-'})`,
          `Education: ${entry.educationLevel || '-'}`,
          `Course/Degree: ${entry.courseDegree || '-'}`,
          `Skills: ${entry.skills || '-'}`,
          `Expected Salary: ${entry.expectedSalary || '-'}`,
        `Resume: ${entry.resumeFile || 'None'}`
        ];
  
        details.forEach(detail => {
          // Check if a new page is needed (leave 20mm margin at bottom)
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(detail, 14, yPos);
          yPos += 7;
        });
  
        // Space before tables
        yPos += 10;
  
        // Employment details table
        const employmentDetails = [
          ['Field', 'Value'],
          ['Currently Employed', entry.currentlyEmployed === 'YES' ? 'Yes' : 'No'],
          ['Desired Employment', entry.employmentDesired || '-'],
          ['Available Start Date', entry.availableStart || '-'],
          ['Shift Availability', entry.shiftAvailable || '-'],
          ['Can Travel', entry.canTravel || '-'],
          ['Driving License', entry.drivingLicense || '-']
        ];
  
        autoTable(doc, {
          startY: yPos,
          head: [employmentDetails[0]],
          body: employmentDetails.slice(1),
          theme: 'grid',
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold'
          }
        });
  
        // Update yPos after employment table
        yPos = doc.lastAutoTable.finalY + 10;
  
        // References table (if available)
        const references = [];
        if (entry.ref1Name || entry.ref1Contact || entry.ref1Email) {
          references.push(['Reference 1', entry.ref1Name || '', entry.ref1Contact || '', entry.ref1Email || '']);
        }
        if (entry.ref2Name || entry.ref2Contact || entry.ref2Email) {
          references.push(['Reference 2', entry.ref2Name || '', entry.ref2Contact || '', entry.ref2Email || '']);
        }
        if (entry.ref3Name || entry.ref3Contact || entry.ref3Email) {
          references.push(['Reference 3', entry.ref3Name || '', entry.ref3Contact || '', entry.ref3Email || '']);
        }
  
        if (references.length > 0) {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
  
          autoTable(doc, {
            startY: yPos,
            head: [['Reference', 'Name', 'Contact', 'Email']],
            body: references,
            theme: 'grid',
            headStyles: {
              fillColor: [41, 128, 185],
              textColor: 255,
              fontStyle: 'bold'
            }
          });
        }
      });
  
      // Save the PDF
      doc.save(`candidates_export_${new Date().toISOString().slice(0, 10)}.pdf`);
  
    } catch (err) {
      console.error('Error exporting to PDF:', err);
      alert('Error generating PDF: ' + err.message);
    }
  };
  
  
  return (
    <div className={`min-h-screen transition-colors font-noto-serif duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: darkMode ? '#1F2937' : '#FFFFFF',
            color: darkMode ? '#F9FAFB' : '#111827',
            border: darkMode ? '1px solid #374151' : '1px solid #E5E7EB',
          },
          success: {
            iconTheme: {
              primary: '#DC2626',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
  <motion.h1 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`text-3xl font-noto-serif font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}
  >
    Applications Dashboard
  </motion.h1>

  {/* Action buttons */}
  <div className='flex items-center space-x-4'>

    {/* Settings Button */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsSettingsModalOpen(true)}
      className={`flex items-center space-x-2 px-4 py-2 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${
        darkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-800 border border-gray-300'
      }`}
    >
      <FiSettings size={18} />
      <span>Version</span>
    </motion.button>

    {/* Change Password Button */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsPasswordModalOpen(true)}
      className={`flex items-center space-x-2 px-4 py-2 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${
        darkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-800 border border-gray-300'
      }`}
    >
      <FiLock size={18} />
      <span>Change Password</span>
    </motion.button>

    {/* <Toggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> */}
  </div>
</div>

        <Filters 
          filters={filters} 
          setFilters={setFilters} 
          darkMode={darkMode} 
          clearAllFilters={clearAllFilters}
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {[...Array(6)].map((_, idx) => (
              <Skeleton key={idx} darkMode={darkMode} />
            ))}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mt-6 mb-4">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Showing <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{filteredEntries.length}</span> candidates
              </p>
              <div className="flex space-x-2">
                <button 
                  onClick={fetchEntries}
                  className={`px-3 py-1 cursor-pointer text-xs rounded-full transition-colors ${
                    darkMode ? 'bg-red-100 text-indigo-200 hover:bg-indigo-800' 
                    : 'bg-red-100 text-[#FF0000] hover:bg-indigo-200'
                  }`}
                >
                  Refresh
                </button>
                <div className="relative">
      <button 
        onClick={toggleDropdown}
        className={`px-3 py-1 cursor-pointer text-xs rounded-full transition-colors ${
          darkMode ? 'bg-green-900 text-green-200 hover:bg-green-800' 
          : 'bg-green-100 text-green-700 hover:bg-green-200'
        }`}
      >
        Export Data
      </button>
      
      {showDropdown && (
  <div className={`absolute right-0 mt-1 w-40 rounded-md shadow-lg py-1 z-10 ${
    darkMode ? 'bg-gray-700 text-white' : 'bg-white'
  }`}>
    <button 
      onClick={() => {
        exportData('excel');
        setShowDropdown(false);
      }}
      className="block w-full text-left px-4 py-2 text-sm hover:bg-indigo-100 dark:hover:bg-gray-600"
    >
      Excel Format
    </button>
    <button 
      onClick={() => {
        exportData('pdf');
        setShowDropdown(false);
      }}
      className="block w-full text-left px-4 py-2 text-sm hover:bg-indigo-100 dark:hover:bg-gray-600"
    >
      PDF Format
    </button>
    <button 
      onClick={() => {
        exportData('csv');
        setShowDropdown(false);
      }}
      className="block w-full text-left px-4 py-2 text-sm hover:bg-indigo-100 dark:hover:bg-gray-600"
    >
      CSV Format
    </button>
  </div>
)}

    </div>
                <button 
                  onClick={exportAllData}
                  className={`px-3 py-1 cursor-pointer text-xs rounded-full transition-colors ${
                    darkMode ? 'bg-blue-900 text-blue-200 hover:bg-blue-800' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  Export All
                </button>
              </div>
            </div>

            {filteredEntries.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No candidates found
                </p>
              </motion.div>
            ) : (
              <>
              <div className={`overflow-x-auto rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <tr>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Name
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Nationality
                      </th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Contact
                      </th>
                      <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    <AnimatePresence>
                      {filteredEntries
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((entry) => (
                        <motion.tr
                          key={entry.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={`transition-colors hover:bg-opacity-50 ${
                            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                          } ${entry.isBlacklisted ? 'opacity-40' : ''}`}
                        >
                          <td className={`px-4 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                                darkMode ? 'bg-indigo-900' : 'bg-red-50'
                              }`}>
                                <span className={`font-semibold ${darkMode ? 'text-indigo-300' : 'text-[#DC2626]'}`}>
                                  {entry.fullName?.charAt(0) || '?'}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {entry.fullName || 'No Name'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className={`px-4 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <div className="text-sm">{entry.email || '-'}</div>
                          </td>
                          <td className={`px-4 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              darkMode ? 'bg-blue-900 text-blue-200' : 'bg-red-50 text-[#DC2626]'
                            }`}>
                              {entry.nationality || '-'}
                            </span>
                          </td>
                          <td className={`px-4 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <div className="text-sm">{entry.mobileContact || '-'}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBlacklistToggle(entry);
                                }}
                                className={`p-2 cursor-pointer rounded-lg transition-colors ${
                                  entry.isBlacklisted 
                                    ? 'bg-[#DC2626] text-white hover:bg-[#DC2626]/80' 
                                    : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                title={entry.isBlacklisted ? 'Remove from Blacklist' : 'Add to Blacklist'}
                              >
                                <FiShield className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(entry);
                                  setTimeout(() => setIsEditMode(true), 100);
                                }}
                                className={`p-2 cursor-pointer rounded-lg transition-colors ${
                                  darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                title="Edit"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteModal(entry);
                                }}
                                className="p-2 cursor-pointer bg-[#DC2626] text-white rounded-lg hover:bg-[#DC2626]/80 transition-colors"
                                title="Delete"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openModal(entry)}
                                className="px-3 py-2 cursor-pointer bg-[#DC2626] text-white text-xs rounded-lg hover:bg-[#DC2626]/80 transition-colors"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              <div className={`flex items-center justify-between px-6 py-4 rounded-b-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Show
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 rounded-lg border text-sm ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    per page
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Page {currentPage} of {Math.ceil(filteredEntries.length / itemsPerPage)}
                  </span>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        currentPage === 1
                          ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      First
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        currentPage === 1
                          ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Previous
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredEntries.length / itemsPerPage)))}
                      disabled={currentPage === Math.ceil(filteredEntries.length / itemsPerPage)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        currentPage === Math.ceil(filteredEntries.length / itemsPerPage)
                          ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Next
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage(Math.ceil(filteredEntries.length / itemsPerPage))}
                      disabled={currentPage === Math.ceil(filteredEntries.length / itemsPerPage)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        currentPage === Math.ceil(filteredEntries.length / itemsPerPage)
                          ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Last
                    </button>
                  </div>
                </div>
              </div>
              </>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {isDeleteModalOpen && entryToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
              onClick={closeDeleteModal}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className={`relative max-w-md w-full rounded-2xl shadow-2xl p-6 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Confirm Delete
                </h3>
                <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Are you sure you want to delete <strong>{entryToDelete.fullName}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeDeleteModal}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detailed Modal View */}
        <AnimatePresence>
          {isModalOpen && selectedEntry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className={`relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeModal}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                >
                  <svg className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="p-8">
                  {/* Action Buttons */}
                  {!isEditMode && (
                    <div className="absolute top-4 right-16 flex space-x-2">
                      <button
                        onClick={handleEditClick}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          closeModal();
                          openDeleteModal(selectedEntry);
                        }}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {isEditMode && (
                    <div className="absolute top-4 right-16 flex space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-20 w-20 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-indigo-900' : 'bg-red-50'
                    }`}>
                      <span className={`text-2xl ${darkMode ? 'text-red-50' : ' text-[#FF0000]'}`}>
                        {(isEditMode ? editedEntry : selectedEntry).fullName?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div className="ml-6">
                      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {(isEditMode ? editedEntry : selectedEntry).fullName || 'No Name'}
                      </h2>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          darkMode ? 'bg-blue-900 text-blue-200' : 'bg-red-50 text-[#FF0000]'
                        }`}>
                          {(isEditMode ? editedEntry : selectedEntry).nationality}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-[#FF0000]' : 'text-[#FF0000]'}`}>
                          Personal Details
                        </h3>
                        {renderEditableField('Full Name', 'fullName', (isEditMode ? editedEntry : selectedEntry).fullName)}
                        {renderEditableField('Email', 'email', (isEditMode ? editedEntry : selectedEntry).email, 'email')}
                        {renderEditableField('Nationality', 'nationality', (isEditMode ? editedEntry : selectedEntry).nationality)}
                        {renderEditableField('Date of Birth', 'dateOfBirth', (isEditMode ? editedEntry : selectedEntry).dateOfBirth?.slice(0, 10), 'date')}
                        {renderEditableField('Gender', 'gender', (isEditMode ? editedEntry : selectedEntry).gender)}
                        {renderEditableField('Mobile Contact', 'mobileContact', (isEditMode ? editedEntry : selectedEntry).mobileContact)}
                        {renderEditableField('WhatsApp', 'whatsapp', (isEditMode ? editedEntry : selectedEntry).whatsapp)}
                        {renderEditableField('Current Address', 'currentAddress', (isEditMode ? editedEntry : selectedEntry).currentAddress)}
                        {renderEditableField('Postal Code', 'postalCode', (isEditMode ? editedEntry : selectedEntry).postalCode)}
                        {renderEditableField('City', 'city', (isEditMode ? editedEntry : selectedEntry).city)}
                        {renderEditableField('Country', 'country', (isEditMode ? editedEntry : selectedEntry).country)}
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-[#FF0000]' : 'text-[#FF0000]'}`}>
                          Identification
                        </h3>
                        {renderEditableField('CPR/National ID', 'cprNationalId', (isEditMode ? editedEntry : selectedEntry).cprNationalId)}
                        {renderEditableField('Passport ID', 'passportId', (isEditMode ? editedEntry : selectedEntry).passportId)}
                        {renderEditableField('Passport Validity', 'passportValidity', (isEditMode ? editedEntry : selectedEntry).passportValidity)}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-[#FF0000]' : 'text-[#FF0000]'}`}>
                          Education & Employment
                        </h3>
                        {renderEditableField('Education Level', 'educationLevel', (isEditMode ? editedEntry : selectedEntry).educationLevel)}
                        {renderEditableField('Course/Degree', 'courseDegree', (isEditMode ? editedEntry : selectedEntry).courseDegree)}
                        {renderEditableField('Currently Employed', 'currentlyEmployed', (isEditMode ? editedEntry : selectedEntry).currentlyEmployed)}
                        {renderEditableField('Employment Desired', 'employmentDesired', (isEditMode ? editedEntry : selectedEntry).employmentDesired)}
                        {renderEditableField('Years of Experience', 'yearsOfExperience', (isEditMode ? editedEntry : selectedEntry).yearsOfExperience, 'number')}
                        {renderEditableField('Available Start Date', 'availableStart', (isEditMode ? editedEntry : selectedEntry).availableStart)}
                        {renderEditableField('Shift Available', 'shiftAvailable', (isEditMode ? editedEntry : selectedEntry).shiftAvailable)}
                        {renderEditableField('Can Travel', 'canTravel', (isEditMode ? editedEntry : selectedEntry).canTravel)}
                        {renderEditableField('Driving License', 'drivingLicense', (isEditMode ? editedEntry : selectedEntry).drivingLicense)}
                      </div>

                      {(isEditMode ? editedEntry : selectedEntry).skills && (
                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-[#FF0000]' : 'text-[#FF0000]'}`}>
                            Skills
                          </h3>
                          {isEditMode ? (
                            <textarea
                              value={(isEditMode ? editedEntry : selectedEntry).skills || ''}
                              onChange={(e) => handleInputChange('skills', e.target.value)}
                              className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                                darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-800'
                              }`}
                              rows="3"
                              placeholder="Comma-separated skills"
                            />
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {(isEditMode ? editedEntry : selectedEntry).skills.split(',').map((skill, i) => (
                                <span 
                                  key={i} 
                                  className={`px-3 py-1 rounded-full text-sm ${
                                    darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-black'
                                  }`}
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* References Section */}
                  {(selectedEntry.ref1Name || selectedEntry.ref2Name || selectedEntry.ref3Name) && (
                    <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-[#FF0000]' : 'text-[#FF0000]'}`}>
                        References
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedEntry.ref1Name && (
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                            <h4 className={darkMode ? 'text-white' : 'text-gray-800'}>Reference 1</h4>
                            {renderField('Name', selectedEntry.ref1Name)}
                            {renderField('Contact', selectedEntry.ref1Contact)}
                            {renderField('Email', selectedEntry.ref1Email)}
                          </div>
                        )}
                        {selectedEntry.ref2Name && (
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                            <h4 className={darkMode ? 'text-white' : 'text-gray-800'}>Reference 2</h4>
                            {renderField('Name', selectedEntry.ref2Name)}
                            {renderField('Contact', selectedEntry.ref2Contact)}
                            {renderField('Email', selectedEntry.ref2Email)}
                          </div>
                        )}
                        {selectedEntry.ref3Name && (
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                            <h4 className={darkMode ? 'text-white' : 'text-gray-800'}>Reference 3</h4>
                            {renderField('Name', selectedEntry.ref3Name)}
                            {renderField('Contact', selectedEntry.ref3Contact)}
                            {renderField('Email', selectedEntry.ref3Email)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-[#FF0000]' : 'text-[#FF0000]'}`}>
                        Visa & Salary
                      </h3>
                      {renderEditableField('Visa Status', 'visaStatus', (isEditMode ? editedEntry : selectedEntry).visaStatus)}
                      {renderEditableField('Visa Validity', 'visaValidity', (isEditMode ? editedEntry : selectedEntry).visaValidity?.slice(0, 10), 'date')}
                      {renderEditableField('Expected Salary', 'expectedSalary', (isEditMode ? editedEntry : selectedEntry).expectedSalary)}
                    </div>

                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-[#FF0000]' : 'text-[#FF0000]'}`}>
                        Strategy
                      </h3>
                      {isEditMode ? (
                        <div className="mt-2">
                          <label className={`text-sm font-semibold ${darkMode ? 'text-[#FF0000]' : 'text-[#FF0000]'}`}>
                            Client Leads Strategy:
                          </label>
                          <textarea
                            value={(isEditMode ? editedEntry : selectedEntry).clientLeadsStrategy || ''}
                            onChange={(e) => handleInputChange('clientLeadsStrategy', e.target.value)}
                            className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                              darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-800'
                            }`}
                            rows="3"
                          />
                        </div>
                      ) : (
                        renderField('Client Leads Strategy', (isEditMode ? editedEntry : selectedEntry).clientLeadsStrategy)
                      )}
                    </div>
                  </div>
                  {selectedEntry.resumeFile && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowPDF(true)}
            className="px-6 py-3 bg-[#FF0000] text-white rounded-lg hover:bg-[#ff0000af] transition-colors flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Full Resume
          </button>
        </div>
      )}

    {/* PDF Modal Viewer */}
    {showPDF && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg overflow-hidden w-[90%] h-[90%] relative shadow-lg">
      <button
        onClick={() => setShowPDF(false)}
        className="absolute top-2 right-1 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-50 hover:bg-red-500 hover:text-white transition"
        title="Close"
      >
        &times;
      </button>

      <button
  onClick={async () => {
    try {
      const response = await fetch(selectedEntry.resumeFile);
      if (!response.ok) throw new Error('Failed to fetch file');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const filename = selectedEntry.resumeFile.split('/').pop() ||
        `resume_${selectedEntry.fullName || 'candidate'}.pdf`;

      link.setAttribute('download', filename);
      link.setAttribute('target', '_blank');

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file. Please try again or contact support.');
    }
  }}
  className="absolute top-2 right-20 cursor-pointer bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-50 hover:bg-blue-800 transition"
  title="Download"
>
  <FiDownload size={20} />
</button>

      <iframe
        src={selectedEntry.resumeFile}
        title="Resume Viewer"
        className="w-full h-full border-none"
      ></iframe>
    </div>
  </div>
)}


                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Modal */}
        <AnimatePresence>
          {isSettingsModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
              onClick={() => setIsSettingsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className={`relative max-w-md w-full rounded-2xl shadow-2xl p-6 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Version Number
                    </label>
                    <input
                      type="text"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                      }`}
                      placeholder="e.g., 1.0.0"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setIsSettingsModalOpen(false)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateVersion(version)}
                    className="px-4 py-2 bg-[#DC2626] text-white rounded-lg hover:bg-[#DC2626]/80 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Change Password Modal */}
        <AnimatePresence>
          {isPasswordModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
              onClick={() => setIsPasswordModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className={`relative max-w-md w-full rounded-2xl shadow-2xl p-6 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Change Password
                </h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const currentPassword = e.target.currentPassword.value;
                  const newPassword = e.target.newPassword.value;
                  const confirmPassword = e.target.confirmPassword.value;
                  
                  if (newPassword !== confirmPassword) {
                    toast.error('New passwords do not match');
                    return;
                  }
                  
                  if (newPassword.length < 6) {
                    toast.error('Password must be at least 6 characters');
                    return;
                  }
                  
                  handleChangePassword(currentPassword, newPassword);
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        required
                        className={`w-full px-3 py-2 rounded-lg border ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        required
                        className={`w-full px-3 py-2 rounded-lg border ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        className={`w-full px-3 py-2 rounded-lg border ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsPasswordModalOpen(false)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#DC2626] text-white rounded-lg hover:bg-[#DC2626]/80 transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blacklist Confirmation Modal */}
        <AnimatePresence>
          {blacklistConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
              onClick={() => setBlacklistConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className={`relative max-w-md w-full rounded-2xl shadow-2xl p-6 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Confirm {blacklistConfirm.newStatus ? 'Blacklist' : 'Remove from Blacklist'}
                </h3>
                <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Are you sure you want to {blacklistConfirm.newStatus ? 'blacklist' : 'remove from blacklist'} <strong>{blacklistConfirm.entry.fullName}</strong>?
                  {blacklistConfirm.newStatus && (
                    <span className="block mt-2 text-sm text-yellow-500">
                      This candidate will appear blurred in the list.
                    </span>
                  )}
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setBlacklistConfirm(null)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmBlacklist}
                    className={`px-4 py-2 rounded-lg text-white transition-colors ${
                      blacklistConfirm.newStatus 
                        ? 'bg-[#DC2626] hover:bg-[#DC2626]/80' 
                        : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;