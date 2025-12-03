# 💈 Sistema de Fila para Barbearias

Sistema SaaS multi-tenant completo para gestão de filas de atendimento em barbearias. Permite que múltiplas barbearias operem de forma independente com seus próprios barbeiros, filas e históricos.

## ✨ Funcionalidades

### Para o Dono/Admin
- 📊 Dashboard com métricas e estatísticas em tempo real
- 👥 Gestão completa de barbeiros (adicionar, pausar, remover)
- 🔄 Gerenciamento da fila com atualização automática (5s)
- 💰 Registro de atendimentos com valores e tipos de serviço
- 📋 Histórico completo com filtros e estatísticas
- ⏸️ Pausar barbeiros temporariamente (almoço, pausa, etc)

### Para o Barbeiro
- 👀 Visualização da fila em tempo real
- 📍 Destaque da sua posição atual
- 📊 Histórico pessoal de atendimentos
- 📈 Estatísticas individuais

### Sistema
- 🏢 Multi-tenant (múltiplas barbearias isoladas)
- 🔐 Autenticação segura com NextAuth
- 📱 Interface responsiva (mobile/tablet/desktop)
- ⚡ Atualização em tempo real via polling
- 🎨 UI moderna com Tailwind CSS

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Prisma ORM** - Gerenciamento de banco de dados
- **Neon PostgreSQL** - Banco de dados serverless
- **NextAuth.js** - Autenticação completa
- **Tailwind CSS** - Estilização moderna
- **Vercel** - Hospedagem e deploy

## 📦 Instalação Rápida

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
# Copie .env.local e adicione suas credenciais
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[gere com: openssl rand -base64 32]"

# 3. Configurar banco de dados
npx prisma generate
npx prisma migrate dev --name init

# 4. (Opcional) Adicionar dados de teste
npx prisma db seed

# 5. Iniciar servidor
npm run dev
```

Acesse: http://localhost:3000

## 📖 Documentação Completa

Consulte o arquivo [SETUP.md](SETUP.md) para instruções detalhadas de:
- Configuração do Neon
- Deploy na Vercel
- Troubleshooting
- Estrutura do projeto

## 🎯 Como Usar

### 1. Cadastrar Barbearia
- Acesse a página inicial
- Clique em "Cadastre sua barbearia"
- Preencha nome da barbearia, seu nome, email e senha
- Faça login automaticamente

### 2. Adicionar Barbeiros
- Acesse "Barbeiros" no menu lateral
- Clique em "+ Adicionar Barbeiro"
- Preencha nome, email e senha
- O barbeiro poderá fazer login com essas credenciais

### 3. Gerenciar Fila
- Acesse "Fila" no menu lateral
- Adicione barbeiros à fila na ordem desejada
- Reordene conforme necessário
- Marque "Iniciar Atendimento" quando começar
- Ao finalizar, clique em "Concluir" e registre:
  - Tipo de serviço (corte, barba, completo, etc)
  - Valor cobrado
  - Observações

### 4. Visualizar como Barbeiro
- Faça login com a conta do barbeiro
- Veja a fila em tempo real
- Acompanhe sua posição
- Acesse seu histórico pessoal

## 🗂️ Estrutura do Projeto

```
├── app/                    # Páginas Next.js 14 (App Router)
│   ├── api/               # API Routes
│   │   ├── auth/         # NextAuth
│   │   ├── barbershop/   # APIs de barbearia
│   │   ├── barber/       # APIs de barbeiros
│   │   ├── queue/        # APIs de fila
│   │   └── attendance/   # APIs de atendimentos
│   ├── owner/            # Páginas do dono
│   ├── dashboard/        # Páginas do barbeiro
│   └── cadastro/         # Cadastro de barbearia
├── components/            # Componentes React
├── hooks/                # Hooks customizados
├── lib/                  # Utilitários e configurações
├── prisma/               # Schema e migrations
└── types/                # Definições TypeScript
```

## 🔒 Segurança

- ✅ Senhas com hash bcrypt
- ✅ Sessões JWT com NextAuth
- ✅ Middleware de proteção de rotas
- ✅ Validação de dados com Zod
- ✅ Isolamento completo entre barbearias
- ✅ Validação de barbershopId em todas queries

## 📊 Schema do Banco

- **Barbershop** - Dados da barbearia
- **User** - Donos e barbeiros (com roles)
- **Queue** - Fila de atendimento
- **Attendance** - Histórico de atendimentos

Veja o schema completo em [`prisma/schema.prisma`](prisma/schema.prisma)

## 🚢 Deploy

### Vercel (Recomendado)

1. Faça push para GitHub
2. Conecte repositório na Vercel
3. Adicione variáveis de ambiente
4. Deploy automático!

Veja instruções detalhadas em [SETUP.md](SETUP.md)

## 📝 Scripts Disponíveis

```bash
npm run dev              # Desenvolvimento
npm run build            # Build para produção
npm run start            # Iniciar produção
npm run lint             # Verificar código

npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Executar migrations
npm run prisma:seed      # Povoar banco com dados de teste
npm run prisma:studio    # Abrir Prisma Studio
npm run prisma:reset     # Resetar banco de dados
```

## 🎨 Credenciais de Teste

Após executar `npm run prisma:seed`:

- **Dono**: dono@exemplo.com / 123456
- **Barbeiro 1**: carlos@exemplo.com / 123456
- **Barbeiro 2**: pedro@exemplo.com / 123456
- **Barbeiro 3**: lucas@exemplo.com / 123456

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é de código aberto para fins educacionais.

## 🌟 Features Futuras

- [ ] Notificações push/email
- [ ] Tela pública para TV
- [ ] Relatórios em PDF
- [ ] Integração WhatsApp
- [ ] Temas customizados por barbearia
- [ ] Sistema de agendamento

---

Desenvolvido com ❤️ para facilitar a gestão de barbearias

