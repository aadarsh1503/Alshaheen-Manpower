import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Filters from '../../Filters/Filters';
import Skeleton from '../../Skeleton/Skeleton';
import Toggle from '../../Toggle/Toggle';
import AdminNavbar from '../../AdminNavbar/AdminNavbar';
import { FiDownload } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FiBriefcase } from 'react-icons/fi';

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPDF, setShowPDF] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    try {
      const response = await axios.get('https://alshaheen-manpower.onrender.com/admin/form-entries');
      setEntries(response.data);
      setFilteredEntries(response.data);
    } catch (err) {
      console.error('Failed to fetch entries:', err);
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
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
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
  const renderField = (label, value) => {
    if (!value) return null;
    return (
      <p className={`mt-1 text-sm font-noto-serif ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <strong className={darkMode ? 'text-indigo-400' : 'text-indigo-600'}>{label}:</strong> {value}
      </p>
    );
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
        'Date of Birth': entry.dateOfBirth ? new Date(entry.dateOfBirth).toISOString().split('T')[0] : '',

        'Gender': entry.gender,
        'Mobile Contact': entry.mobileContact,
        'WhatsApp': entry.whatsapp,
        'Postal Code': entry.postalCode || '',
        'City': entry.city || '',
        'Country': entry.country || '',
        'Current Address': entry.currentAddress,
        'CPR/National ID': entry.cprNationalId,
        'Passport ID': entry.passportId,
        'Passport Validity': entry.passportValidity,
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
        'Visa Validity': entry.visaValidity ? new Date(entry.visaValidity).toISOString().split('T')[0] : '',

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
          `Date of Birth: ${entry.dateOfBirth || '-'}`,
          `Gender: ${entry.gender || '-'}`,
`Years of Experience: ${entry.yearsOfExperience || '-'} years`,
          `Contact: ${entry.mobileContact || '-'}`,
          `WhatsApp: ${entry.whatsapp || '-'}`,
          `Postal Code: ${entry.postalCode || '-'}`,
          `City: ${entry.city || '-'}`,
          `Country: ${entry.country || '-'}`,
          `Address: ${entry.currentAddress || '-'}`,
          `CPR/National ID: ${entry.cprNationalId || '-'}`,
          `Passport: ${entry.passportId || '-'} (Valid until: ${entry.passportValidity || '-'})`,
          `Visa: ${entry.visaStatus || '-'} (Valid until: ${entry.visaValidity || '-'})`,
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
      <AdminNavbar />
      <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
  <motion.h1 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`text-3xl mt-20 font-noto-serif font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}
  >
    Applications Dashboard
  </motion.h1>

  {/* MODIFIED THIS DIV and ADDED THE BUTTON */}
  <div className='mt-20 flex items-center space-x-4'>
    
    {/* === ADD THIS SEXY ANIMATED BUTTON === */}
    <Link to="/admin/vacancies">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <FiBriefcase size={18} />
        <span>Vacancy Manager</span>
      </motion.button>
    </Link>
    {/* === END OF NEW BUTTON === */}

    <Toggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
  </div>
</div>

        <Filters 
          filters={filters} 
          setFilters={setFilters} 
          darkMode={darkMode} 
          clearAllFilters={clearAllFilters}
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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
                    darkMode ? 'bg-indigo-900 text-indigo-200 hover:bg-indigo-800' 
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
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
              </div>
            </div>

            {filteredEntries.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                {/* No results message */}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                <AnimatePresence>
                  {filteredEntries.map((entry) => (
                    <motion.div
                      key={entry._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className={`rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                      }`}
                    >
                      <div className="p-5">
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
                            darkMode ? 'bg-indigo-900' : 'bg-indigo-100'
                          }`}>
                            <span className={darkMode ? 'text-indigo-300' : 'text-indigo-600'}>
                              {entry.fullName?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <h2 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {entry.fullName || 'No Name'}
                            </h2>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {entry.nationality} • {String(entry.currentlyEmployed).toUpperCase() === 'YES' ? 'Employed' : 'Not Employed'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          {renderField('Email', entry.email)}
                          {renderField('Contact', entry.mobileContact)}
                          {renderField('Education', entry.educationLevel)}
                          
                          {entry.skills && (
                            <div className="mt-2">
                              <p className={`text-xs ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>SKILLS</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {entry.skills.split(',').slice(0, 3).map((skill, i) => (
                                  <span 
                                    key={i} 
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                                    }`}
                                  >
                                    {skill.trim()}
                                  </span>
                                ))}
                                {entry.skills.split(',').length > 3 && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'
                                  }`}>
                                    +{entry.skills.split(',').length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className={`mt-6 pt-4 flex justify-between items-center ${
                          darkMode ? 'border-gray-700' : 'border-gray-200'
                        } border-t`}>
                          <div className="flex items-center space-x-2">
                            {entry.resumeFile && (
                              <a
                                href={entry.resumeFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-xs flex items-center ${
                                  darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
                                }`}
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Resume
                              </a>
                            )}
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Submitted at: {new Date(entry.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            onClick={() => openModal(entry)}
                            className="px-4 py-2 cursor-pointer bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            View Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}

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
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-20 w-20 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-indigo-900' : 'bg-indigo-100'
                    }`}>
                      <span className={`text-2xl ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                        {selectedEntry.fullName?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div className="ml-6">
                      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {selectedEntry.fullName || 'No Name'}
                      </h2>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedEntry.nationality}
                        </span>
                        {/* <span className={`px-3 py-1 text-xs rounded-full ${
                          selectedEntry.currentlyEmployed === 'Yes' 
                            ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                            : darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedEntry.currentlyEmployed === 'Yes' ? 'Currently Employed' : 'Available'}
                        </span> */}
                        {/* {selectedEntry.visaStatus && (
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            selectedEntry.visaStatus === 'Expired'
                              ? darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                              : darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {selectedEntry.visaStatus}
                          </span>
                        )} */}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                          Personal Details
                        </h3>
                        {renderField('Email', selectedEntry.email)}
  {renderField('Nationality', selectedEntry.nationality)}
  {renderField('Date of Birth', selectedEntry.dateOfBirth?.slice(0, 10))}
  {renderField('Gender', selectedEntry.gender)}
  {renderField('Mobile Contact', selectedEntry.mobileContact)}
  {renderField('WhatsApp', selectedEntry.whatsapp)}
  {renderField('Current Address', selectedEntry.currentAddress)}
  {renderField('Postal Code', selectedEntry.postalCode)}
  {renderField('City', selectedEntry.city)}
  {renderField('Country', selectedEntry.country)}
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                          Identification
                        </h3>
                        {renderField('CPR/National ID', selectedEntry.cprNationalId)}
                        {renderField('Passport ID', selectedEntry.passportId)}
                        {renderField('Passport Validity', selectedEntry.passportValidity)}
                      </div>
                    </div>

                    <div className="space-y-4">
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
  <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
    Education & Employment
  </h3>
  {renderField('Education Level', selectedEntry.educationLevel)}
  {renderField('Course/Degree', selectedEntry.courseDegree)}
  {renderField('Currently Employed', selectedEntry.currentlyEmployed)}
  {renderField('Employment Desired', selectedEntry.employmentDesired)}
  {renderField('Years of Experience', 
  selectedEntry.yearsOfExperience === '0' || !selectedEntry.yearsOfExperience ? 
    'Fresher' : 
    `${selectedEntry.yearsOfExperience} years`
)}
  {renderField('Available Start Date', selectedEntry.availableStart)}
  {renderField('Shift Available', selectedEntry.shiftAvailable)}
  {renderField('Can Travel', selectedEntry.canTravel)}
  {renderField('Driving License', selectedEntry.drivingLicense)}
</div>

                      {selectedEntry.skills && (
                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                            Skills
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedEntry.skills.split(',').map((skill, i) => (
                              <span 
                                key={i} 
                                className={`px-3 py-1 rounded-full text-sm ${
                                  darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                                }`}
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* References Section */}
                  {(selectedEntry.ref1Name || selectedEntry.ref2Name || selectedEntry.ref3Name) && (
                    <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
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
                      <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        Visa & Salary
                      </h3>
                      {renderField('Visa Status', selectedEntry.visaStatus)}
                      {renderField('Visa Validity', selectedEntry.visaValidity?.slice(0, 10))}
                      {renderField('Expected Salary', selectedEntry.expectedSalary)}
                    </div>

                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className={`font-semibold text-lg mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        Strategy
                      </h3>
                      {renderField('Client Leads Strategy', selectedEntry.clientLeadsStrategy)}
                    </div>
                  </div>
                  {selectedEntry.resumeFile && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowPDF(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
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
      </div>
    </div>
  );
};

export default Dashboard;