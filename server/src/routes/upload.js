const express = require('express');
const multer = require('multer');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/uploadService');

const router = express.Router();
const upload = multer(); // memory storage (buffer) for cloudinary streaming

// Upload file
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const folder = req.body.folder || 'uploads';
    const result = await uploadToCloudinary(req.file, folder);

    return res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      error: 'Upload failed',
      details: error.message,
    });
  }
});

// Delete file
router.delete('/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    if (!publicId) {
      return res.status(400).json({ error: 'No publicId provided' });
    }

    const result = await deleteFromCloudinary(publicId);

    return res.json({ result });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({
      error: 'Delete failed',
      details: error.message,
    });
  }
});

module.exports = router;
