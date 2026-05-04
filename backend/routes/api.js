const express = require('express');
const path = require('path');
const multer = require('multer');
const { getStatus, uploadResume } = require('../controllers/resumeController');

const uploadDir = path.join(__dirname, '../../uploads');
const upload = multer({ dest: uploadDir, limits: { fileSize: 5 * 1024 * 1024 } });
const router = express.Router();

router.get('/status', getStatus);
router.post('/upload', upload.single('resume'), uploadResume);

module.exports = router;
