const express = require('express');
const path = require('path');
const apiRouter = require('./routes/api');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const frontendPath = path.join(__dirname, '../frontend');
const uploadPath = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRouter);
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
