require('dotenv').config();
function config(database) {
  return {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database,
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: false,
    define: { underscored: true, timestamps: true },
    dialectOptions: { decimalNumbers: true }
  };
}
module.exports = {
  development: config(process.env.DB_NAME || 'digital_store'),
  test: config(process.env.DB_TEST_NAME || 'digital_store_test'),
  production: config(process.env.DB_NAME || 'digital_store')
};
