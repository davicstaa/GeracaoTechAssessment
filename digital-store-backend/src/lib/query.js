const { badRequest } = require('./errors');
function positiveInt(value, fallback, name) {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(String(value)) || Number(value) < 1 || !Number.isSafeInteger(Number(value))) {
    throw badRequest(name + ' deve ser inteiro positivo.');
  }
  return Number(value);
}
function pagination(query) {
  let limit = 12;
  if (query.limit === '-1') limit = -1;
  else if (query.limit !== undefined) limit = Math.min(positiveInt(query.limit, 12, 'limit'), 100);
  const page = positiveInt(query.page, 1, 'page');
  return { limit, page, offset: limit === -1 ? 0 : (page - 1) * limit };
}
function csvIds(value, name) {
  if (!value) return [];
  const parts = String(value).split(',');
  if (parts.some(p => !/^\d+$/.test(p.trim()) || Number(p) < 1)) throw badRequest(name + ' inválido.');
  return [...new Set(parts.map(Number))];
}
function fieldSet(value, allowed) {
  if (!value) return null;
  const parts = String(value).split(',').map(s => s.trim()).filter(Boolean);
  if (!parts.length || parts.some(x => !allowed.includes(x))) throw badRequest('fields contém campos inválidos.');
  return new Set(parts);
}
module.exports = { pagination, csvIds, fieldSet };
