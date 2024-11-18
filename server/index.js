import express from 'express';
import cors from 'cors';
import emailRouter from './email.js'; // Import the email handler
import path from 'path';
import { fileURLToPath } from 'url';

// Handle ES module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/contact', emailRouter); // Handling POST requests from the contact form

// Server status route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Export the app for Vercel
export default app;
