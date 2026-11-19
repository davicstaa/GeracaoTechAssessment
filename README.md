# Digital Store — Geração Tech | Digital College

Projeto acadêmico de e-commerce desenvolvido para as atividades de **Front-end** e **Back-end** da Digital College. Este repositório reúne uma interface React e uma API REST com Node.js e MySQL.

## Tecnologias

| Front-end | Back-end |
| --- | --- |
| React 18 | Node.js e Express |
| Vite | MySQL e Sequelize |
| React Router | JWT e bcrypt |
| CSS responsivo e Lucide React | Swagger e Jest |

## Organização do repositório

```text
GeracaoTechAssessment/
├── src/                    # Front-end na raiz
├── index.html
├── package.json            # Scripts do Front-end
├── digital-store/          # Segunda cópia do Front-end
├── digital-store-backend/  # API REST
│   ├── src/
│   ├── tests/
│   ├── package.json
│   └── README.md           # Instruções detalhadas da API
└── README.md               # Este arquivo
```

> O Front-end está publicado na raiz **e** na pasta `digital-store/`. As instruções abaixo utilizam a **versão da raiz**. O Back-end fica em `digital-store-backend/`.

## Executando o Front-end

Com Node.js 18+ instalado, abra um terminal na **raiz do repositório**:

```bash
npm install
npm run dev
```

A interface normalmente estará disponível em **http://localhost:5173**. Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

**Funcionalidades:** página inicial, banner e coleções, listagem de produtos com filtros e ordenação, detalhes com galeria e opções, navegação responsiva e carrinho demonstrativo.

**Estado da integração:** o Front-end ainda usa dados locais de `src/data/products.js`; não consome automaticamente a API. Login e carrinho são demonstrativos, sem pagamento real.

## Executando o Back-end

Requisitos: Node.js 18+, npm e MySQL iniciado (servidor local ou XAMPP).

### 1. Instalar dependências

A partir da raiz do repositório:

```powershell
cd digital-store-backend
npm install
```

### 2. Criar o banco

No MySQL ou no phpMyAdmin, execute:

```sql
CREATE DATABASE digital_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configurar o ambiente

```powershell
Copy-Item .env.example .env
```

Edite `.env` com as configurações do banco (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`) e uma chave `JWT_SECRET` secreta e aleatória. Você pode gerar a chave com:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Nunca envie `.env` ou sua chave JWT para o GitHub.**

### 4. Criar as tabelas e iniciar a API

```powershell
npm run db:migrate
npm run db:seed
npm run dev
```

`db:seed` carrega dados de demonstração e pode ser omitido.

### Endereços locais

- API: **http://localhost:3001**
- Documentação Swagger: **http://localhost:3001/docs**
- Health check: **http://localhost:3001/health**
- Produtos: **http://localhost:3001/v1/product/search**

## Funcionalidades da API

| Recurso | Rotas principais |
| --- | --- |
| Usuários | `POST /v1/user`, `POST /v1/user/token`, `GET/PUT/DELETE /v1/user/:id` |
| Categorias | `GET /v1/category/search`, `GET /v1/category/:id`, `POST /v1/category`, `PUT/DELETE /v1/category/:id` |
| Produtos | `GET /v1/product/search`, `GET /v1/product/:id`, `POST /v1/product`, `PUT/DELETE /v1/product/:id` |

A API implementa CRUD, associações entre produtos e categorias, imagens, opções de produtos, filtros, paginação e migrations do Sequelize. Alterações protegidas requerem `Authorization: Bearer <token>`; cadastro e login são públicos para permitir a criação da primeira conta.

Para executar as verificações disponíveis, dentro de `digital-store-backend`:

```powershell
npm run check
npm test
```

Mais informações: [README específico do Back-end](digital-store-backend/README.md).

## Integração entre Front-end e Back-end

A API está preparada para atender à loja React, mas a integração ainda precisa ser realizada no Front-end. Há um exemplo de cliente HTTP em `digital-store-backend/frontend-integration/api.js`. Para integrar, copie/adapte esse serviço aos componentes React, substituindo os arrays estáticos por requisições à API.

As duas aplicações podem funcionar simultaneamente: React na porta **5173** e API na porta **3001**.

## Referências oficiais

- [Projeto Front-end — Digital College](https://github.com/digitalcollegebr/projeto-digital-store)
- [Projeto Back-end — Digital College](https://github.com/digitalcollegebr/projeto-backend)
- [React](https://react.dev/)
- [Express](https://expressjs.com/)

## Equipe e entrega

**Integrantes:** preencher com os nomes dos participantes da equipe antes da entrega.

Projeto para fins acadêmicos. Não contém integração com pagamentos reais.
