# 🚀 Próximos Passos - Configure Agora!

## ✅ O que já está pronto:
- ✅ Dependências instaladas
- ✅ Prisma Client gerado
- ✅ Todo o código implementado

## 📝 O que VOCÊ precisa fazer:

### 1️⃣ Criar conta no Neon (2 minutos)

1. Acesse: https://neon.tech
2. Clique em "Sign Up" (pode usar conta GitHub)
3. Crie um novo projeto PostgreSQL
4. Nome sugerido: "barbearia-fila"
5. Escolha a região mais próxima (US East ou Europe)
6. Clique em "Create Project"

### 2️⃣ Copiar Connection String

Após criar o projeto no Neon:
1. Na dashboard do Neon, você verá "Connection String"
2. Copie a string que começa com `postgresql://...`
3. Ela será algo como:
   ```
   postgresql://usuario:senha@ep-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

### 3️⃣ Gerar NEXTAUTH_SECRET

Abra o Git Bash (ou terminal) e execute:
```bash
openssl rand -base64 32
```

Copie o resultado (será algo como: `abc123XYZ...`)

### 4️⃣ Configurar .env.local

1. Abra o arquivo `.env.local` na raiz do projeto
2. Substitua os valores:

```env
DATABASE_URL="cole-sua-connection-string-do-neon-aqui"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="cole-o-secret-gerado-aqui"
```

**Exemplo preenchido:**
```env
DATABASE_URL="postgresql://usuario:senha@ep-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="Kd9fj3KLmn2P8qRt5vWxYz/A+BcDeF1gH="
```

### 5️⃣ Executar Migrations (volte aqui depois de configurar)

Após configurar o `.env.local`, volte ao terminal e execute:

```bash
# Gerar Prisma Client e criar tabelas
npx prisma generate
npx prisma migrate dev --name init

# Adicionar dados de teste (OPCIONAL mas recomendado)
npx prisma db seed

# Iniciar o servidor
npm run dev
```

### 6️⃣ Testar o Sistema

1. Acesse: http://localhost:3000
2. Clique em "Cadastre sua barbearia"
3. Preencha:
   - Nome da barbearia: "Minha Barbearia"
   - Seu nome: "João Silva"
   - Email: seu@email.com
   - Senha: 123456

**OU use as credenciais de teste (se executou o seed):**
- **Dono**: dono@exemplo.com / 123456
- **Barbeiro**: carlos@exemplo.com / 123456

## 🎯 Checklist Rápido

- [ ] Criei conta no Neon
- [ ] Copiei connection string
- [ ] Gerei NEXTAUTH_SECRET
- [ ] Editei .env.local com os valores
- [ ] Executei `npx prisma migrate dev --name init`
- [ ] (Opcional) Executei `npx prisma db seed`
- [ ] Executei `npm run dev`
- [ ] Acessei http://localhost:3000

## ⚠️ Problemas Comuns

### Erro: "Environment variable not found: DATABASE_URL"
👉 Você não configurou o `.env.local` corretamente

### Erro: "Can't reach database server"
👉 Verifique se a connection string do Neon está correta

### Erro ao fazer login
👉 Verifique se o NEXTAUTH_SECRET está configurado

## 🆘 Precisa de Ajuda?

1. Verifique se o `.env.local` está na raiz do projeto
2. Confirme que não há espaços extras nas variáveis
3. Reinicie o servidor após alterar o `.env.local`
4. Consulte SETUP.md para mais detalhes

## 🎉 Quando Funcionar

Você terá acesso a:
- ✨ Cadastro de barbearias
- 👥 Gestão de barbeiros
- 🔄 Fila com atualização automática
- 💰 Registro de atendimentos
- 📊 Estatísticas completas
- 📱 Interface responsiva

---

💡 **Dica:** Faça o seed para ter dados de exemplo e testar todas as funcionalidades!


