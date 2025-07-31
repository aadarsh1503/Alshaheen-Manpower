const clamd = require('clamdjs');
const { Readable } = require('stream');

const scanner = clamd.createScanner('127.0.0.1', 3310);

const scanFile = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    console.log(`Scanning file with clamdjs: ${req.file.originalname}`);

    const fileStream = Readable.from(req.file.buffer);

    const result = await scanner.scanStream(fileStream);

    if (result.includes('FOUND')) {
      const virusName = result.replace('stream:', '').replace('FOUND', '').trim();
      console.error(`Virus detected: ${virusName}`);
      return res.status(400).json({
        message: `Virus detected (${virusName}). Please upload a clean file.`,
      });
    } else if (result.includes('OK')) {
      console.log(`File is clean: ${req.file.originalname}`);
      next();
    } else {
      throw new Error(`Unknown response from scanner: ${result}`);
    }

  } catch (error) {
    console.error('ClamAV Scan Error:', error);
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ message: 'Could not connect to virus scanner service. Is it running?' });
    }
    return res.status(500).json({
      message: 'An error occurred during the file scan.',
      error: error.message
    });
  }
};

module.exports = scanFile;