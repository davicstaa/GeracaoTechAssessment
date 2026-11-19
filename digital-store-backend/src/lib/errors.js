function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}
function wrap(handler) {
  return (req, res, next) => Promise.resolve().then(() => handler(req, res, next)).catch(next);
}
function handleErrors(err, req, res, next) {
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ message: 'Dados inválidos.', errors: err.errors.map(e => e.message) });
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ message: 'Registro relacionado a outro recurso.' });
  }
  if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ message: 'JSON inválido.' });
  if (err.status && err.status < 500) return res.status(err.status).json({ message: err.message });
  console.error('Erro interno:', err);
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}
module.exports = { badRequest, wrap, handleErrors };
