# 🐻 Bewear

**Bewear** é uma aplicação desenvolvida com **Next.js 15** e **React 19**, utilizando **Tailwind CSS 4**, **Radix UI** e **React Query** para criar uma interface moderna, responsiva e de alta performance.  
O projeto segue boas práticas de arquitetura e tipagem com **TypeScript** e **Zod**, garantindo escalabilidade e segurança no desenvolvimento.

---

## 🚀 Tecnologias Utilizadas

- **Next.js 15** – Framework React para aplicações web e APIs
- **React 19** – Biblioteca para construção de interfaces
- **Tailwind CSS 4** – Estilização rápida e responsiva
- **Radix UI** – Componentes acessíveis e estilizados
- **React Query** – Gerenciamento de estado assíncrono e cache
- **React Hook Form** – Gerenciamento de formulários
- **Zod** – Validação e tipagem de dados
- **Drizzle ORM** – ORM moderno para banco de dados Postgres
- **PostgreSQL** – Banco de dados relacional
- **Better Auth** – Autenticação segura
- **Lucide Icons** – Ícones minimalistas
- **Next Themes** – Tema escuro/claro com persistência

---

## 📂 Estrutura do Projeto (simplificada)

```plaintext
bewear/
│
├── public/              # Arquivos estáticos
├── src/                 # Código-fonte
│   ├── components/      # Componentes reutilizáveis
│   ├── hooks/           # Hooks customizados
│   ├── lib/             # Configurações e utilitários
│   ├── pages/           # Rotas da aplicação
│   ├── services/        # Serviços (APIs, auth, etc.)
│   ├── styles/          # Estilos globais
│   └── types/           # Tipagens TypeScript
│
├── drizzle.config.ts    # Configuração do Drizzle ORM
├── tailwind.config.ts   # Configuração do Tailwind CSS
├── tsconfig.json        # Configuração do TypeScript
├── package.json         # Dependências e scripts
└── README.md            # Documentação
```

```
⚡ Como Rodar o Projeto
1️⃣ Clonar o repositório
bash
Copiar
Editar
git clone https://github.com/seuusuario/bewear.git
cd bewear
2️⃣ Instalar dependências
bash
Copiar
Editar
npm install
```

# ou

yarn install

# ou

```
pnpm install
3️⃣ Configurar variáveis de ambiente
Crie um arquivo .env na raiz do projeto:

env
Copiar
Editar
DATABASE_URL=postgres://user:password@localhost:5432/bewear
NEXTAUTH_SECRET=sua_chave_secreta
NEXT_PUBLIC_API_URL=http://localhost:3000
4️⃣ Executar a aplicação
bash
Copiar
Editar
npm run dev
Acesse em: http://localhost:3000
```

📦 Scripts Disponíveis

```
Comando Descrição
npm run dev Inicia o servidor de desenvolvimento
npm run build Gera a build de produção
npm run start Inicia a aplicação em modo produção
npm run lint Executa a verificação de lint
```

🛠 Funcionalidades
🌗 Tema escuro/claro com Next Themes

🔐 Autenticação segura com Better Auth

📄 Validação de formulários com React Hook Form + Zod

📦 Gerenciamento de estado assíncrono com React Query

🎨 UI acessível e personalizável com Radix UI

🗄 Integração com banco de dados PostgreSQL via Drizzle ORM

⚡ Estilização rápida com Tailwind CSS

✍ Autor: Mauricio Macedo
📅 Versão: 0.1.0
📜 Licença: MIT
