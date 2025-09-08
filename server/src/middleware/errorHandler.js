const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Multer error handling
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
  }
  
  if (err.message === 'Only image and PDF files are allowed') {
    return res.status(400).json({ error: err.message });
  }

  // Default error
  res.status(500).json({ error: 'Something went wrong!' });
};

module.exports = errorHandler;
