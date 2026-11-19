# Digital Store - Back-end

Projeto de API REST de uma loja virtual, de acordo com [o escopo do projeto Back-end da Digital College](https://github.com/digitalcollegebr/projeto-backend).

**Tecnologias:** Node.js, Express, MySQL, Sequelize, JWT, bcrypt, Swagger e Jest.

## Preparação no Windows

Requisitos: Node.js 18+ e um servidor MySQL iniciado (MySQL Server ou MySQL do XAMPP).

1. Extraia este projeto e abra a pasta `digital-store-backend` no VS Code. Confirme que ela contém `package.json`.
2. Inicie o MySQL e crie um banco vazio no phpMyAdmin, MySQL Workbench ou cliente SQL:

   ```sql
   CREATE DATABASE digital_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. No terminal do VS Code, instale as dependências:

   ```bash
   npm install
   ```

4. No Windows PowerShell, copie as configurações:

   ```powershell
   Copy-Item .env.example .env
   ```

   Ajuste as variáveis do `.env`: `DB_USER`, `DB_PASSWORD`, `DB_PORT` (MySQL: 3306) e especialmente `JWT_SECRET` (use segredo único e longo). Exemplo de geração de segredo com Node:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. Crie as tabelas do banco via migrations:

   ```bash
   npm run db:migrate
   ```

6. (Opcional) Carregue categorias e produtos de exemplo:

   ```bash
   npm run db:seed
   ```

7. Inicie o servidor:

   ```bash
   npm run dev
   ```

API: **http://localhost:3001** · Swagger: **http://localhost:3001/docs** · Health: **http://localhost:3001/health**

> O arquivo `.env` está no `.gitignore` e não deve ir para o GitHub.

## Endpoints

| Método | Endpoint | Requer JWT |
|---|---|---|
| POST | `/v1/user` | Não (cadastro inicial) |
| POST | `/v1/user/token` | Não (login) |
| GET | `/v1/user/:id` | Não |
| PUT, DELETE | `/v1/user/:id` | Sim (próprio usuário) |
| GET | `/v1/category/search` | Não |
| GET | `/v1/category/:id` | Não |
| POST | `/v1/category` | Sim |
| PUT, DELETE | `/v1/category/:id` | Sim |
| GET | `/v1/product/search` | Não |
| GET | `/v1/product/:id` | Não |
| POST | `/v1/product` | Sim |
| PUT, DELETE | `/v1/product/:id` | Sim |

O registro de usuários e o endpoint de login ficam públicos para permitir criar a primeira conta. Os demais POST, PUT e DELETE exigem `Authorization: Bearer TOKEN`. Falta de token retorna 400 conforme o escopo do projeto.

## Teste rápido da autenticação

Primeiro crie um usuário via Swagger, na rota `POST /v1/user`, com:

```json
{
  "firstname": "Maria",
  "surname": "Silva",
  "email": "maria@example.com",
  "password": "Senha123",
  "confirmPassword": "Senha123"
}
```

Depois execute `POST /v1/user/token` com:

```json
{ "email": "maria@example.com", "password": "Senha123" }
```

Copie o `token` retornado e, no Swagger, clique em **Authorize** e cole o token. Agora teste as rotas de escrita.

## Exemplos de busca

- `GET /v1/category/search?use_in_menu=true&limit=-1`
- `GET /v1/product/search?match=tenis&limit=12&page=1`
- `GET /v1/product/search?category_ids=1&price-range=100-300`
- `GET /v1/product/search?fields=name,images,price`
- `GET /v1/product/search?option[1]=38,39` (opção identificada pelo ID e valor)

**Modelo de produtos**: `products` tem `images`, `options` e `category_ids`; o relacionamento muitos-para-muitos é salvo em `product_categories`. Filtros de categoria e preço são aplicados antes da paginação.

As imagens de produtos aceitam URL pública, caminho `/uploads/...` ou uma imagem Base64 com `type` informado (`image/png`, `image/jpeg` ou `image/webp`). Arquivos Base64 são armazenados em `uploads/` e publicados sob `/uploads`.

## Front-end React

Este projeto é o servidor da loja Digital Store, mas **o front-end não foi automaticamente modificado**. Para conectar o React:

1. Copie `frontend-integration/api.js` para `src/services/api.js` do React.
2. No `.env` do front-end Vite, coloque `VITE_API_URL=http://localhost:3001`.
3. Substitua os arrays estáticos de produtos/categorias pelas chamadas `getProducts()`, `getProduct(id)` e `getCategories()`.
4. Faça a adaptação de campos conforme os componentes React existentes, sobretudo `images[0].content` e `price_with_discount`.

No projeto Vite, rode `npm run dev`; o CORS da API permite `http://localhost:5173`.

## Qualidade e entrega

```bash
npm run check
npm test
```

Os testes Jest incluídos cobrem health check, Swagger, roteamento, ausência de token e validações de paginação (não exigem banco). Teste também o CRUD completo no Swagger com o MySQL em execução.

Para publicar:
```bash
git init
git branch -M main
git add .
git commit -m "feat: implementa API REST Digital Store"
git remote add origin https://github.com/SEU-USUARIO/digital-store-backend.git
git push -u origin main
```

**Não inclua `node_modules/`, `uploads/` nem `.env` no GitHub**. Indique os integrantes do grupo no repositório ou na entrega. A aplicação é acadêmica e não inclui processamento de pagamentos nem painel de administração.
