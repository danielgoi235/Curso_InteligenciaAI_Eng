// ══════════════════════════════════════════════════════════
//  Plataforma: IA Aplicada à Engenharia
//  Servidor Principal - MVP
// ══════════════════════════════════════════════════════════
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookies = require('cookie-parser');
const rLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_in_prod';

// ── IN-MEMORY DATABASE (MVP) ────────────────────────────
const db = {
  users: [],
  courses: [],
  modules: [],
  lessons: [],
  exercises: [],
  progress: [],
  payments: [],
  certificates: []
};

// Create default admin
const adminEmail = process.env.ADMIN_EMAIL || 'admin@citadel.com.br';
const adminPass = process.env.ADMIN_PASSWORD || 'Admin@2025!';
if (!db.users.some(u => u.email === adminEmail)) {
  const hash = bcrypt.hashSync(adminPass, 10);
  db.users.push({
    id: uuidv4(),
    name: 'Administrador',
    email: adminEmail,
    password: hash,
    role: 'admin',
    status: 'active',
    plan: 'completo',
    progress: {},
    created_at: new Date().toISOString(),
    payment_src: 'system'
  });
  console.log(`✅ Admin criado: ${adminEmail}`);
}

// ── MIDDLEWARE ──────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookies());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

const limiter = rLimit({ windowMs: 15 * 60 * 1000, max: 200 });
const authLimiter = rLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Muitas tentativas. Aguarde 15 minutos.' } });
app.use(limiter);

// ── AUTH MIDDLEWARE ─────────────────────────────────────
function requireAuth(req, res, next) {
  const token = req.cookies.token || (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Não autenticado' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = db.users.find(u => u.id === payload.id && u.status === 'active');
    if (!user) return res.status(401).json({ error: 'Usuário inativo ou não encontrado' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso negado' });
    next();
  });
}

// ── ROTAS PÚBLICAS ──────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/entrar', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

app.get('/curso', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'course.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

app.get('/obrigado', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'thank-you.html'));
});

// ── API: AUTH ───────────────────────────────────────────
app.post('/api/auth/login', authLimiter, (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'E-mail e senha obrigatórios' });

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
  if (user.status !== 'active') return res.status(401).json({ error: 'Conta desativada' });
  if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Credenciais inválidas' });

  user.last_login = new Date().toISOString();
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'Lax', maxAge: 7 * 24 * 60 * 60 * 1000 });

  res.json({
    ok: true,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    redirect: user.role === 'admin' ? '/admin' : '/curso'
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  const u = req.user;
  res.json({ id: u.id, name: u.name, email: u.email, role: u.role, progress: u.progress });
});

app.post('/api/auth/register', authLimiter, (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  if (password.length < 8) return res.status(400).json({ error: 'Senha deve ter no mínimo 8 caracteres' });

  if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: 'E-mail já cadastrado' });
  }

  const hash = bcrypt.hashSync(password, 10);
  const id = uuidv4();
  db.users.push({
    id,
    name: name.trim(),
    email: email.toLowerCase(),
    password: hash,
    role: 'student',
    status: 'active',
    plan: 'completo',
    progress: {},
    created_at: new Date().toISOString(),
    payment_src: 'self_register'
  });

  const token = jwt.sign({ id, role: 'student' }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'Lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ ok: true, redirect: '/curso' });
});

// ── API: CURSO ──────────────────────────────────────────
app.get('/api/courses', requireAuth, (req, res) => {
  res.json(db.courses);
});

app.get('/api/courses/:courseId/modules', requireAuth, (req, res) => {
  const modules = db.modules.filter(m => m.course_id === req.params.courseId).sort((a, b) => a.order_num - b.order_num);
  res.json(modules);
});

app.get('/api/modules/:moduleId/lessons', requireAuth, (req, res) => {
  const lessons = db.lessons.filter(l => l.module_id === req.params.moduleId).sort((a, b) => a.order_num - b.order_num);
  res.json(lessons);
});

app.get('/api/lessons/:lessonId', requireAuth, (req, res) => {
  const lesson = db.lessons.find(l => l.id === req.params.lessonId);
  if (!lesson) return res.status(404).json({ error: 'Lição não encontrada' });
  res.json(lesson);
});

// ── API: PROGRESS ───────────────────────────────────────
app.post('/api/progress', requireAuth, (req, res) => {
  const { lessonId } = req.body;
  db.progress.push({
    id: uuidv4(),
    user_id: req.user.id,
    lesson_id: lessonId,
    status: 'completed',
    completed_at: new Date().toISOString()
  });
  res.json({ ok: true });
});

app.get('/api/progress', requireAuth, (req, res) => {
  const progress = db.progress.filter(p => p.user_id === req.user.id);
  res.json(progress);
});

// ── API: ADMIN ──────────────────────────────────────────
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const students = db.users.filter(u => u.role === 'student');
  const active = students.filter(u => u.status === 'active');
  const today = new Date().toISOString().split('T')[0];
  const todayUsers = students.filter(u => u.created_at.startsWith(today));
  const payments = db.payments.filter(p => p.status === 'approved');
  const revenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  res.json({
    total: students.length,
    active: active.length,
    today: todayUsers.length,
    payments: payments.length,
    revenue
  });
});

app.get('/api/admin/users', requireAdmin, (req, res) => {
  const students = db.users
    .filter(u => u.role === 'student')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 50)
    .map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      created_at: u.created_at
    }));
  res.json(students);
});

// ── WEBHOOKS ────────────────────────────────────────────
app.post('/webhook/hotmart', (req, res) => {
  const token = req.query.token || req.headers['x-hotmart-token'];

  // Validação do token (apenas em prod)
  if (process.env.NODE_ENV === 'production' && token !== process.env.HOTMART_WEBHOOK_TOKEN) {
    console.warn('[Hotmart] Webhook com token inválido');
    return res.status(401).send('Unauthorized');
  }

  const { status, customer, product } = req.body;

  console.log(`[Hotmart] Webhook: ${status} | Cliente: ${customer?.email} | Produto: ${product?.id}`);

  // Processa aprovação de pagamento
  if (status === 'approved' || status === 'billet_paid') {
    const userEmail = customer?.email?.toLowerCase();
    const userName = customer?.name || 'Aluno';

    if (!userEmail) {
      console.warn('[Hotmart] Email não encontrado no webhook');
      return res.status(400).json({ error: 'Email obrigatório' });
    }

    // Registra pagamento
    db.payments.push({
      id: uuidv4(),
      email: userEmail,
      status: 'approved',
      amount: product?.price || 790,
      hotmart_id: product?.id,
      created_at: new Date().toISOString()
    });

    // Cria usuário se não existir
    if (!db.users.some(u => u.email === userEmail)) {
      const hash = bcrypt.hashSync('TempPassword123!', 10);
      db.users.push({
        id: uuidv4(),
        name: userName,
        email: userEmail,
        password: hash,
        role: 'student',
        status: 'active',
        plan: 'completo',
        progress: {},
        created_at: new Date().toISOString(),
        payment_src: 'hotmart',
        paid_at: new Date().toISOString()
      });
      console.log(`✅ Novo usuário criado via Hotmart: ${userEmail}`);
    } else {
      // Ativa usuário existente
      const user = db.users.find(u => u.email === userEmail);
      user.status = 'active';
      user.paid_at = new Date().toISOString();
    }

    res.json({ ok: true, message: 'Pagamento processado' });
  } else if (status === 'refunded' || status === 'refund_request') {
    // Processa reembolso
    const userEmail = customer?.email?.toLowerCase();
    const user = db.users.find(u => u.email === userEmail);
    if (user) {
      user.status = 'inactive';
      console.log(`⚠️  Usuário desativado por reembolso: ${userEmail}`);
    }
    res.json({ ok: true, message: 'Reembolso processado' });
  } else {
    // Status desconhecido
    res.json({ ok: true, message: `Status ${status} recebido (sem ação)` });
  }
});

// ── HEALTH CHECK ────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── ERROR HANDLING ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Erro:', err.message);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// ── START SERVER ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Plataforma rodando em http://localhost:${PORT}`);
  console.log(`   Admin: ${adminEmail}`);
  console.log(`   Status: ✅ Development (MVP)\n`);
});

module.exports = app;
