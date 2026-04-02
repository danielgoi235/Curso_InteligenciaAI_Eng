# 🔧 Hotmart Integration Setup

## 1️⃣ Criar Conta Hotmart

1. Acesse: **https://hotmart.com/pt-BR**
2. Clique em **"Começar agora"** ou **"Criar conta"**
3. Escolha: **Produtor de Conteúdo** (não cliente)
4. Preencha seus dados

---

## 2️⃣ Criar Produto

### Passo 1: Novo Produto
```
Dashboard → Meus Produtos → + Novo Produto
```

### Passo 2: Configurar Produto
- **Nome**: `IA para Engenharia`
- **Descrição**: Curso prático de IA para engenheiros
- **Categoria**: Cursos Online
- **Preço**: R$ 790,00
- **Formato**: Digital (Acesso Online)
- **Cobertura**: Brasil (ou global)

### Passo 3: Obter PRODUCT_ID
Após criar, você terá uma URL como:
```
https://pay.hotmart.com/C123456789A
                       ↑
                   PRODUCT_ID
```

**Copie o PRODUCT_ID** (ex: `C123456789A`)

---

## 3️⃣ Configurar Webhook

### Passo 1: Acessar Webhooks
```
Dashboard → Configurações → Webhooks
```

### Passo 2: Adicionar Webhook
Clique em **"+ Novo Webhook"**

| Campo | Valor |
|-------|-------|
| **URL** | `https://seu-dominio.com/webhook/hotmart` |
| **Evento** | Selecione: `purchase.approved`, `purchase.refunded` |
| **Token** (opcional) | Gere um token seguro |

**Para testes locais**, use:
```
http://localhost:3000/webhook/hotmart
```
(Nota: Hotmart não consegue acessar localhost, então teste em produção)

---

## 4️⃣ Atualizar Código

### Arquivo: `public/index.html` (linha ~335)
```javascript
const HOTMART_PRODUCT_ID = 'C123456789A'; // Substitua pelo seu ID
```

### Arquivo: `.env`
```env
HOTMART_PRODUCT_ID=C123456789A
HOTMART_WEBHOOK_TOKEN=seu_token_seguro_aqui
```

---

## 5️⃣ Testar Integração

### Teste Local (desenvolvimento)
```bash
npm start
# Acesse: http://localhost:3000
```

1. Preencha o formulário de checkout
2. Clique em **"Pagar com Hotmart"**
3. Você será redirecionado para Hotmart (sem cobrar em teste)
4. Conclua o pagamento em modo teste

### Webhook em Localhost
Como Hotmart não consegue acessar localhost, você tem 2 opções:

**Opção A: Usar ngrok (Recomendado)**
```bash
# Terminal 1: seu servidor
npm start

# Terminal 2: exposição pública
ngrok http 3000
# Você vai ter uma URL pública: https://xyz.ngrok.io
```

Então no Hotmart, configure:
```
https://xyz.ngrok.io/webhook/hotmart
```

**Opção B: Fazer deploy em produção**
Faça deploy no Railway/Render primeiro, depois configure no Hotmart.

---

## 6️⃣ Verificar Pagamentos

Após pagamento no Hotmart:

### No Hotmart Dashboard
```
Produtos → Meu Produto → Pedidos
```
Você verá a venda registrada

### No Seu Servidor
```
localhost:3000
GET /api/admin/stats  (com autenticação de admin)
```

Você verá `payments` e `revenue` atualizados

---

## 📊 Flow Completo

```
1. User preenche checkout (email, name, specialty)
2. Clica em "Pagar com Hotmart"
3. Redireciona para: https://pay.hotmart.com/{PRODUCT_ID}?email=...
4. User paga no Hotmart
5. Hotmart envia webhook para: /webhook/hotmart
6. Servidor cria usuário + registra pagamento
7. User recebe confirmação (email)
8. User acessa plataforma com email usado no checkout
```

---

## 🔐 Credenciais de Teste

Hotmart fornece cartões de teste em sandbox:

| Card Number | Válido? |
|------------|---------|
| 4111 1111 1111 1111 | Sim (aprovado) |
| 5555 5555 5555 4444 | Sim (com autenticação) |
| 378282246310005 | Sim (AMEX) |

**Data**: Qualquer data futura
**CVV**: Qualquer número

---

## ❌ Problemas Comuns

### Webhook não está recebendo
- [ ] Hotmart webhook está apontando para URL pública (não localhost)?
- [ ] Token no Hotmart está igual ao `.env`?
- [ ] Servidor está rodando? (`npm start`)
- [ ] Porta 3000 está aberta?

### Pagamento não aparece na dashboard
- [ ] Esperar 30-60 segundos
- [ ] Verificar logs do servidor: `npm start`
- [ ] Hotmart pode estar em modo sandbox/teste

### Redirecionamento não funciona
- [ ] HOTMART_PRODUCT_ID está correto?
- [ ] Produto existe no Hotmart e está ativo?
- [ ] URL está bem formada: `https://pay.hotmart.com/PRODUCT_ID`?

---

## 📞 Links Úteis

- Documentação Hotmart: https://central.hotmart.com/docs/
- Dashboard: https://app.hotmart.com/
- Suporte: suporte@hotmart.com

---

**Próximo passo**: Uma vez confirmado que tudo funciona, vamos:
- ✅ Integrar Zoom para os 3 encontros
- ✅ Criar dashboard de admin
- ✅ Começar conteúdo das aulas
