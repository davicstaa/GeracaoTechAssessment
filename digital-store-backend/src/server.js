require('dotenv').config();
const { sequelize } = require('./models');
const app = require('./app');
const port = Number(process.env.PORT || 3001);
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'SUBSTITUA_POR_UMA_CHAVE_LONGA_ALEATORIA') {
  console.error('Configure um JWT_SECRET seguro em .env antes de executar.');
  process.exit(1);
}
sequelize.authenticate()
  .then(() => app.listen(port, () => console.log(`API: http://localhost:${port} | Swagger: http://localhost:${port}/docs`)))
  .catch(error => { console.error('Erro de conexão com MySQL:', error.message); process.exit(1); });
