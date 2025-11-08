## ✨ Stack de Tecnologias

Este PROJETO oferece uma base robusta construída com:

### 🎯 Framework Principal
- **⚡ Next.js 15** – Framework React para produção com App Router
- **📘 TypeScript 5** – JavaScript tipado para melhor experiência do desenvolvedor
- **🎨 Tailwind CSS 4** – Framework CSS utilitário para desenvolvimento rápido de UI

### 🧩 Componentes de UI & Estilização
- **🧩 shadcn/ui** – Componentes acessíveis e de alta qualidade baseados em Radix UI
- **🎯 Lucide React** – Biblioteca de ícones bonita e consistente
- **🌈 Framer Motion** – Biblioteca de animações pronta para produção no React
- **🎨 Next Themes** – Modo escuro perfeito em 2 linhas de código

### 📋 Formulários & Validação
- **🎣 React Hook Form** – Formulários performáticos com validação fácil
- **✅ Zod** – Validação de esquemas com foco em TypeScript

### 🔄 Gerenciamento de Estado & Busca de Dados
- **🐻 Zustand** – Gerenciamento de estado simples e escalável
- **🔄 TanStack Query** – Sincronização poderosa de dados para React
- **🌐 Axios** – Cliente HTTP baseado em Promises

### 🗄️ Banco de Dados & Backend
- **🗄️ Prisma** – ORM de última geração para Node.js e TypeScript
- **🔐 NextAuth.js** – Solução completa e open-source para autenticação

### 🎨 Recursos Avançados de UI
- **📊 TanStack Table** – UI headless para construção de tabelas e datagrids
- **🖱️ DND Kit** – Toolkit moderno de drag and drop para React
- **📊 Recharts** – Biblioteca de gráficos redefinida com React e D3
- **🖼️ Sharp** – Processamento de imagens de alta performance

### 🌍 Internacionalização & Utilitários
- **🌍 Next Intl** – Biblioteca de internacionalização para Next.js
- **📅 Date-fns** – Biblioteca moderna de utilitários para datas em JavaScript
- **🪝 ReactUse** – Coleção de hooks essenciais para desenvolvimento moderno em React

## 🎯 Por que usar este Projeto?

- **🏎️ Desenvolvimento Rápido** – Ferramentas pré-configuradas e melhores práticas
- **🎨 UI Bonita** – Biblioteca completa de componentes shadcn/ui com interações avançadas
- **🔒 Tipagem Segura** – Configuração completa de TypeScript com validação Zod
- **📱 Responsivo** – Princípios de design mobile-first com animações suaves
- **🗄️ Pronto para Banco de Dados** – ORM Prisma configurado para desenvolvimento backend rápido
- **🔐 Autenticação Incluída** – NextAuth.js para fluxos de autenticação seguros
- **📊 Visualização de Dados** – Gráficos, tabelas e funcionalidade de drag-and-drop
- **🌍 Pronto para i18n** – Suporte multilíngue com Next Intl
- **🚀 Pronto para Produção** – Configurações otimizadas de build e deploy


## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

Abra [http://localhost:3000](http://localhost:3000) para ver sua aplicação rodando.

## 📁 Estrutura do Projeto

```
src/
├── domain/              # Entidades e interfaces do domínio
├── application/         # Serviços e casos de uso
├── infrastructure/      # Implementações técnicas (DB, API, cache)
├── presentation/        # Controllers, rotas, views
├── shared/              # Tipos, utils, hooks comuns
├── app/                 # Páginas do App Router do Next.js
├── components/          # Componentes React reutilizáveis
│   └── ui/             # Componentes shadcn/ui
├── hooks/              # Hooks personalizados do React
└── lib/                # Funções utilitárias e configurações
```

## 🛠️ Contribuindo com o Projeto

Siga o fluxo abaixo para garantir qualidade e rastreabilidade:

1. **Crie uma branch para sua alteração**
   ```bash
   git checkout -b feature/nome-da-feature
   ```

2. **Faça commits semânticos**
   - Use prefixos: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, etc.
   - Exemplo:
     ```bash
     git commit -m "feat: add user authentication flow"
     ```

3. **Envie sua branch para o GitHub**
   ```bash
   git push origin feature/nome-da-feature
   ```

4. **Abra um Pull Request**
   - Descreva claramente o que foi feito.
   - Aguarde revisão e aprovação.

5. **Testes automatizados**
   - Execute `npm test` antes de abrir o PR.
   - O CI (GitHub Actions) irá validar lint e testes automaticamente.

6. **Merge após aprovação**
   - Só faça merge após aprovação de pelo menos um revisor.

7. **Proteção de branch**
   - Commits diretos na `main`/`master` são bloqueados.
   - Sempre use Pull Request.

## 🏛️ Arquitetura do Projeto

- **Clean Architecture**: Separação clara entre domínio, aplicação, infraestrutura e apresentação.
- **Controllers**: Orquestram requisições e respostas.
- **Services**: Regras de negócio.
- **Repositories**: Persistência de dados.
- **UI**: Desacoplada da lógica de negócio.

## 🚦 Convenções e Boas Práticas

- Padronize nomes de arquivos, funções e variáveis em inglês.
- Documente funções e componentes.
- Adote testes unitários e integrados.
- Use variáveis de ambiente com fallback e validação.
- Adote mensagens de commit semânticas.
- Siga o fluxo de Pull Request para toda alteração.

## 🎨 Funcionalidades & Componentes Disponíveis

Este PROJETO inclui um conjunto abrangente de ferramentas modernas para desenvolvimento web:

### 🧩 Componentes de UI (shadcn/ui)
- **Layout**: Card, Separator, Aspect Ratio, Painéis redimensionáveis
- **Formulários**: Input, Textarea, Select, Checkbox, Radio Group, Switch
- **Feedback**: Alert, Toast (Sonner), Progress, Skeleton
- **Navegação**: Breadcrumb, Menubar, Navigation Menu, Pagination
- **Overlay**: Dialog, Sheet, Popover, Tooltip, Hover Card
- **Exibição de Dados**: Badge, Avatar, Calendar

### 📊 Recursos Avançados de Dados
- **Tabelas**: Tabelas poderosas com ordenação, filtro e paginação (TanStack Table)
- **Gráficos**: Visualizações bonitas com Recharts
- **Formulários**: Formulários tipados com React Hook Form + validação Zod

### 🎨 Funcionalidades Interativas
- **Animações**: Microinterações suaves com Framer Motion
- **Drag & Drop**: Funcionalidade moderna de arrastar e soltar com DND Kit
- **Troca de Tema**: Suporte embutido para modo claro/escuro

### 🔐 Integração com Backend
- **Autenticação**: Fluxos prontos para uso com NextAuth.js
- **Banco de Dados**: Operações tipadas com Prisma
- **Cliente API**: Requisições HTTP com Axios + TanStack Query
- **Gerenciamento de Estado**: Simples e escalável com Zustand

### 🌍 Recursos de Produção
- **Internacionalização**: Suporte multilíngue com Next Intl
- **Otimização de Imagens**: Processamento automático de imagens com Sharp
- **Tipagem Segura**: TypeScript de ponta a ponta com validação Zod
- **Hooks Essenciais**: 100+ hooks úteis do ReactUse para padrões comuns


</div align="center">

📧 Contato do Autor

Nome: Denis Cugler

E-mail: deniscugler@gmail.com

GitHub: https://github.com/Dcugleer

LinkedIn: https://www.linkedin.com/in/denis-cugler/

Website / Portfólio: (https://denis-cugler.vercel.app/)

</div>

---

> **ℹ️ Sempre que alterar este README.md, execute:**
> ```bash
> git add README.md
> git commit -m "docs: update README with latest conventions and architecture"
> git push origin sua-branch
> ```
> E abra um Pull Request para revisão e merge!

