const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const [scheme, token] = (req.get('Authorization') || '').split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(400).json({ message: 'Envie Authorization: Bearer <token>.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(400).json({ message: 'Token inválido ou expirado.' });
  }
};
