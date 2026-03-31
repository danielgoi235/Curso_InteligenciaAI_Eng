# Plataforma: IA Aplicada à Engenharia

Plataforma web completa: landing page + login + área de membros + encontros ao vivo + certificado digital + comunidade WhatsApp.

## 🚀 QUICKSTART (5 minutos)

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar ambiente
```bash
cp .env.example .env
# Edite o .env com suas configurações (Hotmart, emails, etc)
```

### 3. Iniciar o servidor
```bash
npm start
# Acesse: http://localhost:3000
```

## 📁 ESTRUTURA

```
project/
├── server/
│   └── index.js          ← Servidor Express (API + rotas)
├── public/
│   ├── index.html        ← Landing page
│   ├── login.html        ← Login/Registro
│   ├── course.html       ← Área de membros (curso)
│   ├── admin.html        ← Painel admin
│   └── thank-you.html    ← Pós-compra
├── data/
│   └── plataforma.db     ← SQLite (criado automaticamente)
├── config/
│   └── (configurações)
├── logs/
│   └── (logs da aplicação)
├── package.json
├── .env.example          ← Variáveis de ambiente
└── README.md
```

## 👤 ACESSO PADRÃO

```
Email: admin@citadel.com.br
Senha: Admin@2025!
```

⚠️ **Mude a senha imediatamente em produção.**

## 📊 API ENDPOINTS

### Auth
- `POST /api/auth/login` — Login
- `POST /api/auth/register` — Registro
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Dados do usuário logado

### Curso
- `GET /api/courses` — Listar cursos
- `GET /api/courses/:courseId/modules` — Módulos do curso
- `GET /api/modules/:moduleId/lessons` — Aulas do módulo
- `GET /api/lessons/:lessonId` — Conteúdo da aula

### Progresso
- `POST /api/progress` — Marcar aula como concluída
- `GET /api/progress` — Obter progresso

### Admin
- `GET /api/admin/stats` — Estatísticas (vendas, alunos, etc)
- `GET /api/admin/users` — Listar usuários

### Webhooks
- `POST /webhook/hotmart` — Webhook Hotmart (pagamentos)

### Health
- `GET /health` — Health check

## 💳 INTEGRAÇÃO HOTMART

1. Crie seu produto no Hotmart
2. Configure webhook: `POST https://seusite.com/webhook/hotmart?token=SEU_TOKEN`
3. Atualize `HOTMART_WEBHOOK_TOKEN` e `HOTMART_PRODUCT_ID` no `.env`
4. Atualize o link de compra em `public/index.html`

## 🌐 DEPLOY (Railway/Render)

### Railway
1. Conecte seu GitHub ao Railway
2. Configure variáveis de ambiente
3. Deploy automático

### Render
1. Crie novo Web Service
2. Aponte para seu repositório GitHub
3. Configure as variáveis `.env`

## 🔒 SEGURANÇA EM PRODUÇÃO

```env
JWT_SECRET=gere_uma_chave_com_64_chars_aleatorios_aqui
NODE_ENV=production
BASE_URL=https://seudominio.com.br
ADMIN_PASSWORD=altere_senha_forte
```

**Gerar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📦 DEPENDÊNCIAS

- **express** — Web framework
- **better-sqlite3** — Banco de dados (SQLite)
- **bcryptjs** — Hash de senhas
- **jsonwebtoken** — Autenticação JWT
- **cookie-parser** — Parsing de cookies
- **express-rate-limit** — Rate limiting
- **uuid** — Geração de IDs
- **cors** — CORS handling

## 🚫 TROUBLESHOOTING

### "Module not found: express"
```bash
npm install
```

### "Database locked"
- Verifique se a aplicação não está rodando em outro terminal
- Reinicie: `npm start`

### "Port 3000 already in use"
```bash
# Mude a porta no .env
PORT=3001
```

## 📧 SUPORTE

Para dúvidas, abra uma issue no GitHub ou entre em contato.

---

**Última atualização:** 31/03/2026
**Status:** Development (STORY 1.1 em progresso)
