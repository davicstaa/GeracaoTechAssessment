'use strict';
module.exports = {
  async up(qi, S) {
    await qi.createTable('categories', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      name: { type: S.STRING, allowNull: false },
      slug: { type: S.STRING, allowNull: false, unique: true },
      use_in_menu: { type: S.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: S.DATE, allowNull: false },
      updated_at: { type: S.DATE, allowNull: false }
    });
    await qi.createTable('products', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      enabled: { type: S.BOOLEAN, defaultValue: false },
      name: { type: S.STRING, allowNull: false },
      slug: { type: S.STRING, allowNull: false, unique: true },
      use_in_menu: { type: S.BOOLEAN, defaultValue: false },
      stock: { type: S.INTEGER, defaultValue: 0 },
      description: { type: S.STRING(2000), allowNull: true },
      price: { type: S.FLOAT, allowNull: false },
      price_with_discount: { type: S.FLOAT, allowNull: false },
      created_at: { type: S.DATE, allowNull: false },
      updated_at: { type: S.DATE, allowNull: false }
    });
    await qi.createTable('product_images', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      product_id: { type: S.INTEGER, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'CASCADE' },
      enabled: { type: S.BOOLEAN, defaultValue: false },
      path: { type: S.STRING(1000), allowNull: false }
    });
    await qi.createTable('product_options', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      product_id: { type: S.INTEGER, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'CASCADE' },
      title: { type: S.STRING, allowNull: false },
      shape: { type: S.ENUM('square','circle'), defaultValue: 'square' },
      radius: { type: S.INTEGER, defaultValue: 0 },
      type: { type: S.ENUM('text','color'), defaultValue: 'text' },
      values: { type: S.STRING, allowNull: false }
    });
    await qi.createTable('product_categories', {
      product_id: { type: S.INTEGER, allowNull: false, primaryKey: true, references: { model: 'products', key: 'id' }, onDelete: 'CASCADE' },
      category_id: { type: S.INTEGER, allowNull: false, primaryKey: true, references: { model: 'categories', key: 'id' }, onDelete: 'CASCADE' }
    });
  },
  async down(qi) {
    await qi.dropTable('product_categories');
    await qi.dropTable('product_options');
    await qi.dropTable('product_images');
    await qi.dropTable('products');
    await qi.dropTable('categories');
  }
};
