import express from 'express';
import cors from 'cors';
import emailRouter from './email.js'; // Import the email handler

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/contact', emailRouter); // Handling POST requests from the contact form

// Server status route
app.get('/status', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Export the app for Vercel
export default app;
