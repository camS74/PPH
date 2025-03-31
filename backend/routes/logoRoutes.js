import express from 'express';
import multer from 'multer';
import path from 'path';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, 'logo-' + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.post('/upload-logo', authenticateToken, upload.single('logo'), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can upload a logo.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const filePath = `/uploads/${req.file.filename}`;

    res.status(200).json({
      message: 'Logo uploaded successfully',
      path: filePath,
    });
  } catch (error) {
    console.error('Logo upload failed:', error);
    res.status(500).json({ message: 'Logo upload failed', error: error.message });
  }
});

export default router;
