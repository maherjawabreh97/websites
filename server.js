const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Admin credentials (change password after first login)
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'musamim2024';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (admin folder NOT exposed publicly)
app.use(express.static(__dirname));

// ====== DATA STORAGE ======
const DATA_DIR = path.join(__dirname, 'data');
const VISITORS_FILE = path.join(DATA_DIR, 'visitors.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

function readJSON(file) {
  try {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch { return []; }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ====== VISITOR TRACKING ======
app.post('/api/track', (req, res) => {
  const { page, referrer } = req.body;
  const visitors = readJSON(VISITORS_FILE);
  visitors.push({
    page: page || '/',
    referrer: referrer || '',
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.headers['user-agent'] || '',
    timestamp: new Date().toISOString()
  });
  writeJSON(VISITORS_FILE, visitors);
  res.json({ ok: true });
});

app.get('/api/visitors', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !checkAuth(auth)) return res.status(401).json({ error: 'Unauthorized' });
  const visitors = readJSON(VISITORS_FILE);
  // Return last 200 visits
  res.json(visitors.slice(-200).reverse());
});

// ====== FORM SUBMISSIONS ======
app.post('/api/submit', (req, res) => {
  const { name, email, type, message } = req.body;
  const submissions = readJSON(SUBMISSIONS_FILE);
  submissions.push({
    id: crypto.randomBytes(4).toString('hex'),
    name: name || 'غير محدد',
    email: email || 'غير محدد',
    type: type || 'غير محدد',
    message: message || '',
    timestamp: new Date().toISOString(),
    read: false
  });
  writeJSON(SUBMISSIONS_FILE, submissions);
  res.json({ ok: true, message: 'تم استلام طلبك بنجاح!' });
});

app.get('/api/submissions', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !checkAuth(auth)) return res.status(401).json({ error: 'Unauthorized' });
  const submissions = readJSON(SUBMISSIONS_FILE);
  res.json(submissions.slice().reverse());
});

app.post('/api/submissions/:id/read', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !checkAuth(auth)) return res.status(401).json({ error: 'Unauthorized' });
  const submissions = readJSON(SUBMISSIONS_FILE);
  const idx = submissions.findIndex(s => s.id === req.params.id);
  if (idx !== -1) {
    submissions[idx].read = true;
    writeJSON(SUBMISSIONS_FILE, submissions);
  }
  res.json({ ok: true });
});

app.delete('/api/submissions/:id', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !checkAuth(auth)) return res.status(401).json({ error: 'Unauthorized' });
  let submissions = readJSON(SUBMISSIONS_FILE);
  submissions = submissions.filter(s => s.id !== req.params.id);
  writeJSON(SUBMISSIONS_FILE, submissions);
  res.json({ ok: true });
});

// ====== AUTH ======
function checkAuth(authHeader) {
  const base64 = authHeader.split(' ')[1] || '';
  const decoded = Buffer.from(base64, 'base64').toString();
  const [user, pass] = decoded.split(':');
  return user === ADMIN_USER && pass === ADMIN_PASS;
}

app.post('/api/auth', (req, res) => {
  const { user, pass } = req.body;
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    const token = Buffer.from(`${user}:${pass}`).toString('base64');
    res.json({ ok: true, token });
  } else {
    res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
  }
});

// ====== STATS ======
app.get('/api/stats', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !checkAuth(auth)) return res.status(401).json({ error: 'Unauthorized' });
  const visitors = readJSON(VISITORS_FILE);
  const submissions = readJSON(SUBMISSIONS_FILE);
  
  const today = new Date().toISOString().split('T')[0];
  const todayVisits = visitors.filter(v => v.timestamp.startsWith(today)).length;
  const uniqueIPs = new Set(visitors.map(v => v.ip)).size;
  const unread = submissions.filter(s => !s.read).length;
  const pages = {};
  visitors.forEach(v => { pages[v.page] = (pages[v.page] || 0) + 1; });

  res.json({
    totalVisits: visitors.length,
    todayVisits,
    uniqueVisitors: uniqueIPs,
    totalSubmissions: submissions.length,
    unreadSubmissions: unread,
    topPages: Object.entries(pages).sort((a, b) => b[1] - a[1]).slice(0, 10)
  });
});

// ====== ADMIN PAGE ======
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '_private_admin', 'index.html'));
});

// ====== START ======
app.listen(PORT, () => {
  console.log(`🚀 السيرفر شغال على: http://localhost:${PORT}`);
  console.log(`📊 لوحة التحكم: http://localhost:${PORT}/admin`);
  console.log(`🔑 username: admin | password: musamim2024`);
});
