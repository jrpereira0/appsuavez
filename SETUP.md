# Guia de Configuração

## 1. Pré-requisitos

- Node.js 18+ instalado
- Conta no Neon (https://neon.tech) - Gratuita
- Conta no Vercel (https://vercel.com) - Gratuita

## 2. Configurar Banco de Dados Neon

1. Acesse https://neon.tech e faça login
2. Crie um novo projeto PostgreSQL
3. Copie a connection string (ex: `postgresql://user:password@host/database`)

## 3. Configuração Local

1. Clone o repositório ou acesse a pasta do projeto

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Renomeie `.env.local` ou crie um novo arquivo `.env.local`
   - Adicione as seguintes variáveis:

```env
DATABASE_URL="sua-connection-string-do-neon-aqui"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
```

Para gerar o `NEXTAUTH_SECRET`, execute:
```bash
openssl rand -base64 32
```

4. Execute as migrations do Prisma:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. (Opcional) Popule o banco com dados de teste:
```bash
npx prisma db seed
```

Credenciais de teste criadas pelo seed:
- **Dono**: dono@exemplo.com / 123456
- **Barbeiro 1**: carlos@exemplo.com / 123456
- **Barbeiro 2**: pedro@exemplo.com / 123456
- **Barbeiro 3**: lucas@exemplo.com / 123456

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

7. Acesse http://localhost:3000

## 4. Deploy na Vercel

### Via GitHub (Recomendado)

1. Faça push do código para o GitHub
2. Acesse https://vercel.com
3. Clique em "Import Project"
4. Selecione seu repositório GitHub
5. Configure as variáveis de ambiente:
   - `DATABASE_URL`: Sua connection string do Neon
   - `NEXTAUTH_URL`: URL do seu projeto na Vercel (ex: https://seu-projeto.vercel.app)
   - `NEXTAUTH_SECRET`: Mesma chave gerada localmente
6. Clique em "Deploy"

### Via CLI da Vercel

1. Instale a CLI da Vercel:
```bash
npm i -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Adicione as variáveis de ambiente no painel da Vercel

## 5. Primeiro Acesso

1. Acesse a página inicial
2. Clique em "Cadastre sua barbearia"
3. Preencha os dados:
   - Nome da barbearia
   - Seu nome (dono)
   - Email
   - Senha
4. Você será redirecionado para o dashboard do dono

## 6. Funcionalidades

### Como Dono/Admin:
- **Dashboard**: Visualize resumo da fila e estatísticas
- **Fila**: Gerencie a fila de atendimento em tempo real
  - Adicione barbeiros à fila
  - Reordene posições
  - Inicie atendimento
  - Conclua atendimento (registra valores e tipo de serviço)
- **Barbeiros**: Gerencie seus barbeiros
  - Adicione novos barbeiros
  - Pause/Reative barbeiros
  - Remova barbeiros
- **Histórico**: Visualize todos os atendimentos e estatísticas

### Como Barbeiro:
- **Fila**: Veja sua posição em tempo real (atualiza a cada 5 segundos)
- **Histórico**: Veja seus atendimentos e estatísticas pessoais

## 7. Estrutura Multi-Tenant

- Cada barbearia opera de forma isolada
- Dados completamente separados entre barbearias
- Um dono pode gerenciar apenas sua barbearia
- Barbeiros veem apenas a fila da sua barbearia

## 8. Troubleshooting

### Erro de conexão com banco de dados
- Verifique se a connection string do Neon está correta
- Confirme que o banco está ativo no Neon

### Erro "Module not found"
```bash
npm install
npx prisma generate
```

### Erro de autenticação
- Verifique se `NEXTAUTH_SECRET` está configurado
- Confirme que `NEXTAUTH_URL` está correto

### Fila não atualiza automaticamente
- Verifique o console do navegador por erros
- Confirme que a API está respondendo em `/api/queue/get`

## 9. Tecnologias Utilizadas

- **Next.js 14**: Framework React
- **TypeScript**: Tipagem estática
- **Prisma**: ORM para PostgreSQL
- **NextAuth.js**: Autenticação
- **Neon**: PostgreSQL serverless
- **Tailwind CSS**: Estilização
- **Vercel**: Hospedagem

## 10. Suporte

Para problemas ou dúvidas, verifique:
1. Logs do console do navegador
2. Logs do servidor (terminal)
3. Logs da Vercel (se em produção)


