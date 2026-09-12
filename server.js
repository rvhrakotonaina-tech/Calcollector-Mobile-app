const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize download count
const downloadFile = path.join(__dirname, 'downloads.json');
if (!fs.existsSync(downloadFile)) {
  fs.writeFileSync(downloadFile, JSON.stringify({ count: 0 }));
}

// API to get download count
app.get('/api/downloads', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(downloadFile, 'utf8'));
    res.json({ count: data.count });
  } catch (error) {
    res.json({ count: 0 });
  }
});

// API to increment download count
app.post('/api/downloads', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(downloadFile, 'utf8'));
    data.count += 1;
    fs.writeFileSync(downloadFile, JSON.stringify(data));
    res.json({ count: data.count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update download count' });
  }
});

// Download endpoint
app.get('/download', (req, res) => {
  const apkPath = path.join(__dirname, 'app-debug.apk');
  res.download(apkPath, 'Calcollector.apk', (err) => {
    if (err) {
      console.error('Download error:', err);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
