const resumeModel = require('../models/resumeModel');

function getStatus(req, res) {
  res.json({ status: 'ok', message: 'TechScreening backend is running.' });
}

async function uploadResume(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No resume file uploaded.' });
  }

  const record = {
    id: Date.now().toString(),
    originalName: req.file.originalname,
    fileName: req.file.filename,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedAt: new Date().toISOString()
  };

  await resumeModel.saveResume(record);

  res.json({ success: true, resume: record });
}

module.exports = { getStatus, uploadResume };
