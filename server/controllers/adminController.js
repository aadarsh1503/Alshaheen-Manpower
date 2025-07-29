const pool = require('../config/db');
const imagekit = require('../config/imagekit');

const getAdminVacancies = async (req, res) => {
  try {
    const [vacancies] = await pool.execute('SELECT id, subject, imageUrl, imageFileId, createdAt FROM vacancies ORDER BY id DESC');
    res.json(vacancies);
  } catch (error) {
    console.error('Error fetching admin vacancies:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createVacancy = async (req, res) => {
  const { subject } = req.body;
  const file = req.file;

  if (!subject || !file) {
    return res.status(400).json({ message: 'Subject and image are required.' });
  }
  try {
    const imageKitResult = await imagekit.upload({ file: file.buffer, fileName: file.originalname, folder: "vacancies" });
    const [result] = await pool.execute('INSERT INTO vacancies (subject, imageUrl, imageFileId) VALUES (?, ?, ?)', [subject, imageKitResult.url, imageKitResult.fileId]);
    res.status(201).json({ id: result.insertId, subject, imageUrl: imageKitResult.url });
  } catch (error) {
    console.error('Error creating vacancy:', error);
    res.status(500).json({ message: 'Failed to create vacancy' });
  }
};

const updateVacancy = async (req, res) => {
  const { id } = req.params;
  const { subject } = req.body;
  const file = req.file;
  if (!subject) return res.status(400).json({ message: 'Subject is required.' });

  try {
    if (file) {
      const [currentVacancy] = await pool.execute('SELECT imageFileId FROM vacancies WHERE id = ?', [id]);
      const oldImageFileId = currentVacancy.length > 0 ? currentVacancy[0].imageFileId : null;
      const newImageResult = await imagekit.upload({ file: file.buffer, fileName: file.originalname, folder: "vacancies" });
      await pool.execute('UPDATE vacancies SET subject = ?, imageUrl = ?, imageFileId = ? WHERE id = ?', [subject, newImageResult.url, newImageResult.fileId, id]);
      if (oldImageFileId) await imagekit.deleteFile(oldImageFileId).catch(err => console.error("Old ImageKit file delete failed:", err));
    } else {
      await pool.execute('UPDATE vacancies SET subject = ? WHERE id = ?', [subject, id]);
    }
    res.status(200).json({ message: 'Vacancy updated successfully.' });
  } catch (error) {
    console.error(`Error updating vacancy ${id}:`, error);
    res.status(500).json({ message: 'Failed to update vacancy.' });
  }
};

const deleteVacancy = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT imageFileId FROM vacancies WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Vacancy not found' });
    
    if (rows[0].imageFileId) {
        await imagekit.deleteFile(rows[0].imageFileId).catch(err => console.error("ImageKit file delete failed:", err));
    }
    await pool.execute('DELETE FROM vacancies WHERE id = ?', [id]);
    res.status(200).json({ message: 'Vacancy deleted successfully' });
  } catch (error) {
    console.error(`Error deleting vacancy ${id}:`, error);
    res.status(500).json({ message: 'Failed to delete vacancy' });
  }
};

const getFormEntries = async (req, res) => {
  try {
    const [columns] = await pool.execute(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'form_entries' AND COLUMN_NAME = 'originalFilename'`);
    const hasOriginalFilename = columns.length > 0;
    
    let baseQuery = hasOriginalFilename ? 'SELECT *, originalFilename FROM form_entries' : 'SELECT * FROM form_entries';
    const conditions = [];
    const values = [];

    if (req.query.searchTerm) {
      conditions.push('(fullName LIKE ? OR email LIKE ? OR skills LIKE ? OR city LIKE ? OR country LIKE ?)');
      values.push(`%${req.query.searchTerm}%`, `%${req.query.searchTerm}%`, `%${req.query.searchTerm}%`, `%${req.query.searchTerm}%`, `%${req.query.searchTerm}%`);
    }
    if (req.query.email) {
      conditions.push('email LIKE ?');
      values.push(`%${req.query.email}%`);
    }
    if (req.query.nationality) {
      conditions.push('LOWER(nationality) LIKE LOWER(?)');
      values.push(`%${req.query.nationality}%`);
    }
    if (req.query.city) {
      conditions.push('LOWER(city) LIKE LOWER(?)');
      values.push(`%${req.query.city}%`);
    }
    if (req.query.country) {
      conditions.push('LOWER(country) LIKE LOWER(?)');
      values.push(`%${req.query.country}%`);
    }
    if (req.query.educationLevel) {
      conditions.push('educationLevel = ?');
      values.push(req.query.educationLevel);
    }
    if (req.query.visaStatus) {
      if (req.query.visaStatus === 'Expired') conditions.push('(passportValidity IS NOT NULL AND passportValidity < CURRENT_DATE)');
      else if (req.query.visaStatus === 'Valid') conditions.push('(passportValidity IS NOT NULL AND passportValidity >= CURRENT_DATE)');
      else if (req.query.visaStatus === 'None') conditions.push('passportValidity IS NULL');
    }
    if (req.query.dateRange && req.query.dateRange !== 'all') {
      switch (req.query.dateRange) {
        case 'today': conditions.push('DATE(submittedAt) = CURRENT_DATE'); break;
        case '24h': conditions.push('submittedAt >= DATE_SUB(NOW(), INTERVAL 24 HOUR)'); break;
        case '7d': conditions.push('submittedAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)'); break;
        case '30d': conditions.push('submittedAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)'); break;
        case '1y': conditions.push('submittedAt >= DATE_SUB(NOW(), INTERVAL 1 YEAR)'); break;
        case 'custom':
          if (req.query.customStart) {
            conditions.push('submittedAt >= ?');
            values.push(new Date(req.query.customStart).toISOString().slice(0, 19).replace('T', ' '));
          }
          if (req.query.customEnd) {
            conditions.push('submittedAt <= ?');
            values.push(new Date(req.query.customEnd).toISOString().slice(0, 19).replace('T', ' '));
          }
          break;
      }
    }

    baseQuery += conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';
    baseQuery += ' ORDER BY submittedAt DESC';

    const [results] = await pool.execute(baseQuery, values);
    
    const processedResults = results.map(entry => ({
      ...entry,
      currentlyEmployed: entry.currentlyEmployed,
      visaStatus: entry.visaStatus || null,
      originalFilename: hasOriginalFilename ? entry.originalFilename : null
    }));

    res.status(200).json(processedResults);
  } catch (err) {
    console.error('Error retrieving form entries:', err);
    res.status(500).send('Error retrieving data');
  }
};

module.exports = {
  getAdminVacancies,
  createVacancy,
  updateVacancy,
  deleteVacancy,
  getFormEntries
};