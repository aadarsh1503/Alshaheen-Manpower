import express from 'express';
import cors from 'cors';
import emailRouter from './email.js'; // Import the email handler

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/contact', emailRouter); // Handling POST requests from the contact form

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
