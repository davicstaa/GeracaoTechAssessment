'use strict';
module.exports = {
  async up(qi) {
    const now = new Date();
    await qi.bulkInsert('categories', [
      { name: 'Tênis', slug: 'tenis', use_in_menu: true, created_at: now, updated_at: now },
      { name: 'Roupas', slug: 'roupas', use_in_menu: true, created_at: now, updated_at: now },
      { name: 'Acessórios', slug: 'acessorios', use_in_menu: true, created_at: now, updated_at: now }
    ]);
    const cats = await qi.sequelize.query("SELECT id, slug FROM categories WHERE slug IN ('tenis','roupas','acessorios')", { type: qi.sequelize.QueryTypes.SELECT });
    const idOf = slug => cats.find(c => c.slug === slug).id;
    await qi.bulkInsert('products', [
      { enabled: true, name: 'Tênis esportivo vermelho', slug: 'tenis-esportivo-vermelho', stock: 24, description: 'Tênis confortável para o dia a dia.', price: 259.9, price_with_discount: 199.9, created_at: now, updated_at: now },
      { enabled: true, name: 'Tênis branco casual', slug: 'tenis-branco-casual', stock: 18, description: 'Visual casual para diversas ocasiões.', price: 299.9, price_with_discount: 249.9, created_at: now, updated_at: now },
      { enabled: true, name: 'Camiseta básica', slug: 'camiseta-basica', stock: 30, description: 'Camiseta de algodão.', price: 79.9, price_with_discount: 59.9, created_at: now, updated_at: now }
    ]);
    const products = await qi.sequelize.query("SELECT id, slug FROM products WHERE slug IN ('tenis-esportivo-vermelho','tenis-branco-casual','camiseta-basica')", { type: qi.sequelize.QueryTypes.SELECT });
    const pid = slug => products.find(p => p.slug === slug).id;
    await qi.bulkInsert('product_categories', [
      { product_id: pid('tenis-esportivo-vermelho'), category_id: idOf('tenis') },
      { product_id: pid('tenis-branco-casual'), category_id: idOf('tenis') },
      { product_id: pid('camiseta-basica'), category_id: idOf('roupas') }
    ]);
    await qi.bulkInsert('product_images', [
      { product_id: pid('tenis-esportivo-vermelho'), enabled: true, path: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700' },
      { product_id: pid('tenis-branco-casual'), enabled: true, path: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=700' },
      { product_id: pid('camiseta-basica'), enabled: true, path: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=700' }
    ]);
    await qi.bulkInsert('product_options', [
      { product_id: pid('tenis-esportivo-vermelho'), title: 'Tamanho', shape: 'square', radius: 4, type: 'text', values: '38,39,40,41,42' },
      { product_id: pid('tenis-branco-casual'), title: 'Tamanho', shape: 'square', radius: 4, type: 'text', values: '37,38,39,40' },
      { product_id: pid('camiseta-basica'), title: 'Tamanho', shape: 'square', radius: 4, type: 'text', values: 'P,M,G,GG' }
    ]);
  },
  async down(qi) {
    const products = await qi.sequelize.query("SELECT id FROM products WHERE slug IN ('tenis-esportivo-vermelho','tenis-branco-casual','camiseta-basica')", { type: qi.sequelize.QueryTypes.SELECT });
    const ids = products.map(x => x.id);
    if (ids.length) {
      await qi.bulkDelete('product_options', { product_id: ids });
      await qi.bulkDelete('product_images', { product_id: ids });
      await qi.bulkDelete('product_categories', { product_id: ids });
      await qi.bulkDelete('products', { id: ids });
    }
    await qi.bulkDelete('categories', { slug: ['tenis','roupas','acessorios'] });
  }
};
