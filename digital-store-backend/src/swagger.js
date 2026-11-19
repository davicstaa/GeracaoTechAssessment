const id = { name: 'id', in: 'path', required: true, schema: { type: 'integer' } };
const jsonBody = (example, required = true) => ({
  required, content: { 'application/json': { schema: { type: 'object', example } } }
});
const resps = (create = false) => ({
  [create ? 201 : 204]: { description: create ? 'Criado' : 'Operação concluída, sem conteúdo' },
  400: { description: 'Dados inválidos ou token ausente' },
  404: { description: 'Recurso não encontrado' }
});
const auth = [{ bearerAuth: [] }];
const user = { firstname: 'Maria', surname: 'Silva', email: 'maria@example.com', password: 'Senha123', confirmPassword: 'Senha123' };
const category = { name: 'Tênis', slug: 'tenis', use_in_menu: true };
const product = {
  enabled: true, name: 'Tênis casual', slug: 'tenis-casual', stock: 12,
  description: 'Produto de demonstração', price: 199.9, price_with_discount: 169.9,
  category_ids: [1], images: [{ content: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' }],
  options: [{ title: 'Tamanho', shape: 'square', type: 'text', values: ['38','39','40'] }]
};
module.exports = {
  openapi: '3.0.3',
  info: { title: 'Digital Store API', version: '1.0.0', description: 'API REST para usuários, categorias e produtos. Cadastro e login públicos; alterações protegidas por JWT.' },
  servers: [{ url: 'http://localhost:3001' }],
  components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
  tags: [{ name: 'Usuários' }, { name: 'Categorias' }, { name: 'Produtos' }],
  paths: {
    '/health': { get: { summary: 'Health check', responses: { 200: { description: 'API online' } } } },
    '/v1/user': {
      post: { tags: ['Usuários'], summary: 'Cadastrar usuário', requestBody: jsonBody(user), responses: { 201: { description: 'Usuário criado' }, 400: { description: 'Dados inválidos' } } }
    },
    '/v1/user/token': {
      post: { tags: ['Usuários'], summary: 'Login e token JWT', requestBody: jsonBody({ email: user.email, password: user.password }), responses: {
        200: { description: 'Token de autenticação', content: { 'application/json': { schema: { type: 'object', properties: { token: { type: 'string' } } } } } },
        400: { description: 'Credenciais inválidas' }
      } }
    },
    '/v1/user/{id}': {
      get: { tags: ['Usuários'], summary: 'Buscar usuário', parameters: [id], responses: { 200: { description: 'Usuário sem senha' }, 404: { description: 'Não encontrado' } } },
      put: { tags: ['Usuários'], summary: 'Atualizar próprio usuário', security: auth, parameters: [id], requestBody: jsonBody({ firstname: 'Maria', surname: 'Silva', email: 'maria@example.com' }), responses: resps() },
      delete: { tags: ['Usuários'], summary: 'Excluir próprio usuário', security: auth, parameters: [id], responses: resps() }
    },
    '/v1/category/search': {
      get: { tags: ['Categorias'], summary: 'Pesquisar categorias', parameters: [
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 }, description: '-1 para todos' },
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'fields', in: 'query', schema: { type: 'string' }, example: 'name,slug' },
        { name: 'use_in_menu', in: 'query', schema: { type: 'boolean' } }
      ], responses: { 200: { description: 'data, total, limit e page' }, 400: { description: 'Busca inválida' } } }
    },
    '/v1/category': { post: { tags: ['Categorias'], summary: 'Criar categoria', security: auth, requestBody: jsonBody(category), responses: resps(true) } },
    '/v1/category/{id}': {
      get: { tags: ['Categorias'], summary: 'Obter categoria por ID', parameters: [id], responses: { 200: { description: 'Categoria' }, 404: { description: 'Não encontrada' } } },
      put: { tags: ['Categorias'], summary: 'Atualizar categoria', security: auth, parameters: [id], requestBody: jsonBody(category), responses: resps() },
      delete: { tags: ['Categorias'], summary: 'Excluir categoria', security: auth, parameters: [id], responses: resps() }
    },
    '/v1/product/search': {
      get: { tags: ['Produtos'], summary: 'Pesquisar produtos', parameters: [
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'fields', in: 'query', schema: { type: 'string' }, example: 'name,images,price' },
        { name: 'match', in: 'query', schema: { type: 'string' }, example: 'Tênis' },
        { name: 'category_ids', in: 'query', schema: { type: 'string' }, example: '1,2' },
        { name: 'price-range', in: 'query', schema: { type: 'string' }, example: '100-300' },
        { name: 'option[45]', in: 'query', schema: { type: 'string' }, example: '38,39' }
      ], responses: { 200: { description: 'data, total, limit e page' }, 400: { description: 'Busca inválida' } } }
    },
    '/v1/product': { post: { tags: ['Produtos'], summary: 'Criar produto com imagens e opções', security: auth, requestBody: jsonBody(product), responses: resps(true) } },
    '/v1/product/{id}': {
      get: { tags: ['Produtos'], summary: 'Obter produto por ID', parameters: [id], responses: { 200: { description: 'Produto' }, 404: { description: 'Não encontrado' } } },
      put: { tags: ['Produtos'], summary: 'Atualizar produto, imagens e opções', security: auth, parameters: [id], requestBody: jsonBody({ name: 'Nome atualizado', stock: 20 }), responses: resps() },
      delete: { tags: ['Produtos'], summary: 'Excluir produto', security: auth, parameters: [id], responses: resps() }
    }
  }
};
