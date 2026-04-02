# 🚀 Deploy em 3 Minutos

## Opção 1: Railway (Recomendado - Grátis)

### Passo 1: Acesse Railway
https://railway.app/

### Passo 2: Fazer Deploy
1. Clique: **"Deploy Now"** (em canto superior)
2. **Authorize GitHub** (faça login)
3. Selecione seu repositório: `Curso_InteligenciaAI_Eng`
4. Clique **"Deploy"**

**Railway vai automaticamente:**
- Ler `railway.json`
- Instalar dependências
- Rodar `npm start`
- Gerar URL pública

### Passo 3: Usar Link
Após ~3 minutos, você terá:
```
https://seu-app-production.up.railway.app
```

---

## Opção 2: Render (Alternativa)

### Passo 1: Acesse Render
https://render.com/

### Passo 2: Novo Serviço
1. **New** → **Web Service**
2. **Connect GitHub**
3. Selecione `Curso_InteligenciaAI_Eng`
4. Preencha:
   - **Name**: `ia-engenharia-platform`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Passo 3: Deploy
Clique **"Create Web Service"** e espere ~2 minutos

---

## Opção 3: Vercel (Somente Frontend)

Se quiser separar frontend (Vercel) + backend (Railway):

### Frontend no Vercel
```bash
cd public
vercel deploy
```

### Backend no Railway
Siga Opção 1 acima

---

## ⚙️ Variáveis de Ambiente

Após deploy, configure variáveis no painel:

### Railway
```
Settings → Variables → Add Variable
```

### Render
```
Environment → Environment Variables
```

**Adicione:**
```
PORT=3000
NODE_ENV=production
JWT_SECRET=sua_chave_super_secreta_aqui_minimo_32_caracteres
ADMIN_EMAIL=admin@citadel.com.br
ADMIN_PASSWORD=Admin@2025!
HOTMART_PRODUCT_ID=C123456789A
HOTMART_WEBHOOK_TOKEN=seu_webhook_token
```

---

## 🧪 Testar Deploy

Após obter o link público (ex: https://seu-app.railway.app):

### 1. Acessar Homepage
```
https://seu-app.railway.app
```
Você deve ver a landing page

### 2. Testar API
```
https://seu-app.railway.app/health
```
Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2026-04-02T..."
}
```

### 3. Atualizar Hotmart
No arquivo `public/index.html`, se você mudar de URL:

```javascript
// Se estiver testando localmente:
const API_URL = 'http://localhost:3000';

// Se estiver em produção:
const API_URL = 'https://seu-app.railway.app';
```

---

## 🔗 Webhook Hotmart

Agora que você tem URL pública, configure no Hotmart:

```
Dashboard → Webhooks → + Novo Webhook
URL: https://seu-app.railway.app/webhook/hotmart
Token: (mesmo token do .env)
```

---

## 📊 Monitorar Deploy

### Railway
Dashboard mostra logs em tempo real:
- Acessar app
- Ver tráfego
- Ver erros

### Render
- Logs → view em tempo real
- Metrics → monitorar uso

---

## ✅ Checklist Pós-Deploy

- [ ] Homepage carrega
- [ ] `/health` retorna ok
- [ ] Formulário de checkout funciona
- [ ] Redirecionamento Hotmart funciona
- [ ] Webhooks Hotmart configuradas
- [ ] Variáveis de ambiente todas preenchidas
- [ ] Admin consegue fazer login

---

## 🚨 Problemas Comuns

### "Build failed"
- [ ] `package.json` existe?
- [ ] Dependências instaladas? (`npm install`)
- [ ] `server/index.js` tem erro de sintaxe?

### "Cannot GET /"
- [ ] `public/index.html` existe?
- [ ] Express está servindo arquivos estáticos? (linha 57 em server/index.js)

### "Connection refused"
- [ ] Porta 3000 está mapeada?
- [ ] URL é HTTPS (não HTTP)?

### "Webhook não recebe"
- [ ] URL no Hotmart está igual ao deploy? (sem /webhook no final!)
- [ ] Token está correto?

---

## 📞 Suporte

- Railway: https://docs.railway.app/
- Render: https://render.com/docs/
- Vercel: https://vercel.com/docs

---

**Após deploy estar online:**
- Compartilhe link com amigos para testar
- Comece a gravar aulas
- Configure Zoom para os 3 encontros
