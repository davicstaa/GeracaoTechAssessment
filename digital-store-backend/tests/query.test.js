const { pagination, csvIds, fieldSet } = require('../src/lib/query');
test('pagina corretamente', () => {
  expect(pagination({ limit: '10', page: '3' })).toEqual({ limit: 10, page: 3, offset: 20 });
});
test('aceita limit -1', () => {
  expect(pagination({ limit: '-1', page: '2' })).toEqual({ limit: -1, page: 2, offset: 0 });
});
test('rejeita paginação negativa', () => {
  expect(() => pagination({ page: '-5' })).toThrow();
});
test('identifica IDs de categorias', () => {
  expect(csvIds('1,2,2', 'category_ids')).toEqual([1,2]);
});
test('rejeita fields desconhecidos', () => {
  expect(() => fieldSet('name,password', ['name','slug'])).toThrow();
});
