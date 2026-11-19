# Digital Store — Projeto Front-end

Projeto acadêmico de e-commerce desenvolvido com React, Vite e React Router, seguindo os requisitos descritos no repositório oficial da Digital College.

## Requisitos
- Node.js 18 ou superior
- npm

## Como executar
1. Extraia o arquivo ZIP.
2. Abra a pasta `digital-store` no VS Code.
3. Abra o terminal na pasta do projeto.
4. Instale as dependências:
   ```bash
   npm install
   ```
5. Inicie o servidor:
   ```bash
   npm run dev
   ```
6. Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

## Build de produção
```bash
npm run build
npm run preview
```

## Funcionalidades implementadas
- Home com banner/carrossel, coleções e produtos em destaque.
- Cabeçalho com busca por query string, navegação, cadastro/login demonstrativos e carrinho.
- Listagem com filtros por marca, categoria e gênero, além de ordenação por preço.
- Página de detalhes com galeria, miniaturas, seleção de cor/tamanho e botão comprar.
- Carrinho local durante a sessão.
- Componentes reutilizáveis: Logo, Header, Footer, Section, ProductCard, ProductListing, Gallery, FilterGroup, ProductOptions e BuyBox.
- Rotas `/`, `/products`, `/produtos`, `/product/:id`, `/produto/:id`, `/cart`, `/login`, `/register` e `/orders`.
- Layout responsivo para celular, tablet e desktop.

## Observações
- Os produtos são dados demonstrativos mantidos em `src/data/products.js`.
- As imagens são carregadas de URLs públicas do Unsplash; é necessária conexão com a internet para exibi-las.
- Login, cadastro e checkout são demonstrativos, sem autenticação ou pagamento real.
- O projeto não possui integração com API ou banco de dados, pois o consumo de API é opcional na proposta.

## Publicar no GitHub
Crie um repositório no seu GitHub e envie os arquivos desta pasta. Não envie a pasta `node_modules`.
