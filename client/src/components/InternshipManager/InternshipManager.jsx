import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaDownload, FaEye, FaTrash, FaEnvelope, FaWhatsapp, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const InternshipManager = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  
  const [filters, setFilters] = useState({
    stage: '',
    department: '',
    university: '',
    month: '',
    year: ''
  });

  const [interviewData, setInterviewData] = useState({
    interview_date: '',
    interview_time: '',
    interview_venue: ''
  });

  const stages = ['Applied', 'Interview', 'Accepted', 'Rejected', 'Completion', 'Certification'];
  const departments = ['IT', 'Finance', 'Admin'];

  useEffect(() => {
    fetchApplications();
  }, []);

  useEf