const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = sequelize => sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstname: { type: DataTypes.STRING, allowNull: false },
  surname: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'users',
  defaultScope: { attributes: { exclude: ['password'] } },
  scopes: { withPassword: { attributes: ['id', 'email', 'password'] } },
  hooks: {
    beforeCreate: async u => { u.password = await bcrypt.hash(u.password, 10); },
    beforeUpdate: async u => { if (u.changed('password')) u.password = await bcrypt.hash(u.password, 10); }
  }
});
