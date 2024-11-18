import fs from 'fs';
import path from 'path';
import cron from 'node-cron';

// Schedule a cleanup every minute
cron.schedule('* * * * *', () => {
  const directory = path.join(__dirname, 'uploads/');
  console.log('Uploads directory path:', directory);

  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }

        const now = Date.now();
        const fileAge = now - stats.mtime.getTime();
        console.log(`File: ${file}, File Age: ${fileAge} ms`);

        // Delete files older than 1 minute (60,000 ms)
        if (fileAge > 60 * 1000) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Error deleting file:', err);
            } else {
              console.log('Deleted old file:', filePath);
            }
          });
        }
      });
    });
  });
});
