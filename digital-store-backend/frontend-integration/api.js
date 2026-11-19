// Exemplo de serviço para usar no projeto React/Vite.
// Copie para src/services/api.js no front-end.
// Crie VITE_API_URL=http://localhost:3001 no .env do Vite.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
async function api(path, init = {}) {
  const response = await fetch(`${API_URL}${path}`, init);
  if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
  return response.status === 204 ? null : response.json();
}
export const getProducts = (params = {}) =>
  api('/v1/product/search?' + new URLSearchParams(params).toString());
export const getProduct = id => api(`/v1/product/${id}`);
export const getCategories = () => api('/v1/category/search?limit=-1');
export const login = (email, password) =>
  api('/v1/user/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
