const request = require('supertest');
const app = require('../src/app');
describe('API sem banco', () => {
  test('GET /health devolve 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
  test('rota inexistente devolve 404', async () => {
    const res = await request(app).get('/rota-desconhecida');
    expect(res.status).toBe(404);
  });
  test('POST protegido sem token devolve 400', async () => {
    const res = await request(app).post('/v1/category').send({ name: 'Teste', slug: 'teste' });
    expect(res.status).toBe(400);
  });
  test('GET /docs retorna a documentação Swagger', async () => {
    const res = await request(app).get('/docs/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Swagger UI');
  });
});
