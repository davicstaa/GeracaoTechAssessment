const sequelize = require('../config/connection');
const User = require('./user')(sequelize);
const Category = require('./category')(sequelize);
const Product = require('./product')(sequelize);
const ProductImage = require('./productImage')(sequelize);
const ProductOption = require('./productOption')(sequelize);
const ProductCategory = require('./productCategory')(sequelize);

Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images', onDelete: 'CASCADE' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(ProductOption, { foreignKey: 'product_id', as: 'options', onDelete: 'CASCADE' });
ProductOption.belongsTo(Product, { foreignKey: 'product_id' });
Product.belongsToMany(Category, {
  through: ProductCategory, foreignKey: 'product_id', otherKey: 'category_id', as: 'categories'
});
Category.belongsToMany(Product, {
  through: ProductCategory, foreignKey: 'category_id', otherKey: 'product_id', as: 'products'
});
module.exports = { sequelize, User, Category, Product, ProductImage, ProductOption, ProductCategory };
