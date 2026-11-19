const { Op, fn, col, where: sw } = require('sequelize');
const { sequelize, Product, Category, ProductImage, ProductOption } = require('../models');
const { badRequest } = require('../lib/errors');
const { pagination, csvIds, fieldSet } = require('../lib/query');
const { toPath, cleanup, absolutePath } = require('./images');

const publicFields = ['id','enabled','name','slug','use_in_menu','stock','description','price','price_with_discount','category_ids','images','options'];
function parseValues(values) { return String(values).split(',').map(x => x.trim()).filter(Boolean); }
function serialize(req, product, selected = null) {
  const p = product.toJSON();
  const output = {
    id: p.id, enabled: p.enabled, name: p.name, slug: p.slug, use_in_menu: p.use_in_menu,
    stock: p.stock, description: p.description, price: p.price, price_with_discount: p.price_with_discount,
    category_ids: (p.categories || []).map(c => c.id),
    images: (p.images || []).map(img => ({ id: img.id, content: absolutePath(req, img.path) })),
    options: (p.options || []).map(o => ({ id: o.id, title: o.title, shape: o.shape, radius: o.radius, type: o.type, values: parseValues(o.values) }))
  };
  if (!selected) return output;
  return Object.fromEntries(Object.entries(output).filter(([key]) => selected.has(key)));
}
const relations = [
  { model: ProductImage, as: 'images' },
  { model: ProductOption, as: 'options' },
  { model: Category, as: 'categories', through: { attributes: [] } }
];
async function search(req) {
  const { limit, page, offset } = pagination(req.query);
  const selected = fieldSet(req.query.fields, publicFields);
  const productWhere = {};
  if (req.query.match) {
    const match = String(req.query.match).trim();
    productWhere[Op.or] = [{ name: { [Op.like]: '%' + match + '%' } }, { description: { [Op.like]: '%' + match + '%' } }];
  }
  if (req.query['price-range'] !== undefined) {
    const match = /^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/.exec(String(req.query['price-range']));
    if (!match || Number(match[1]) > Number(match[2])) throw badRequest('price-range deve ser mínimo-máximo.');
    productWhere.price = { [Op.between]: [Number(match[1]), Number(match[2])] };
  }
  const categoryIds = csvIds(req.query.category_ids, 'category_ids');
  let includes = relations.map(x => ({ ...x }));
  if (categoryIds.length) {
    // Aplica filtro ANTES da paginação, inclusive para o total.
    includes[2] = { ...includes[2], where: { id: { [Op.in]: categoryIds } }, required: true };
  }
  // option[ID]=X,Y significa produto com opção ID e algum dos valores.
  const filters = Object.entries(req.query).filter(([k]) => /^option\[\d+\]$/.test(k));
  // Express também pode interpretar option[45]=GG como req.query.option['45'].
  if (req.query.option && typeof req.query.option === 'object') {
    for (const [id, value] of Object.entries(req.query.option)) {
      if (!/^\d+$/.test(id)) throw badRequest('ID da opção inválido.');
      filters.push([`option[${id}]`, value]);
    }
  }
  for (const [key, rawValues] of filters) {
    const id = Number(key.match(/\d+/)[0]);
    const values = String(rawValues).split(',').map(s => s.trim()).filter(Boolean);
    if (!values.length) throw badRequest('Filtro de opção vazio.');
    const options = await ProductOption.findAll({
      where: { id, [Op.or]: values.map(v => sw(fn('FIND_IN_SET', v, col('values')), { [Op.gt]: 0 })) },
      attributes: ['product_id']
    });
    const ids = options.map(o => o.product_id);
    if (!ids.length) return { data: [], total: 0, limit, page };
    productWhere.id = productWhere.id ? { [Op.in]: ids.filter(i => productWhere.id[Op.in].includes(i)) } : { [Op.in]: ids };
  }
  const opts = { where: productWhere, include: includes, distinct: true, order: [['id','ASC']], subQuery: true };
  if (limit !== -1) { opts.limit = limit; opts.offset = offset; }
  const { count, rows } = await Product.findAndCountAll(opts);
  // Para o retorno, carregamos todas as categorias mesmo quando a busca filtra uma.
  if (categoryIds.length && rows.length) {
    const full = await Product.findAll({ where: { id: { [Op.in]: rows.map(x => x.id) } }, include: relations, order: [['id','ASC']] });
    const order = new Map(full.map(p => [p.id, p]));
    return { data: rows.map(p => serialize(req, order.get(p.id), selected)), total: count, limit, page };
  }
  return { data: rows.map(p => serialize(req, p, selected)), total: count, limit, page };
}
async function find(req, id) {
  const p = await Product.findByPk(id, { include: relations });
  return p ? serialize(req, p) : null;
}
function validate(body, isCreate) {
  const data = {};
  for (const k of ['enabled','name','slug','use_in_menu','stock','description','price','price_with_discount']) {
    if (body[k] !== undefined) data[k] = body[k];
  }
  if (isCreate && (!data.name || !data.slug || data.price === undefined || data.price_with_discount === undefined)) {
    throw badRequest('name, slug, price e price_with_discount são obrigatórios.');
  }
  if ('name' in data && (typeof data.name !== 'string' || !data.name.trim())) throw badRequest('name inválido.');
  if ('slug' in data && (typeof data.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug))) throw badRequest('slug inválido.');
  for (const k of ['enabled','use_in_menu']) if (k in data && typeof data[k] !== 'boolean') throw badRequest(k + ' deve ser booleano.');
  if ('stock' in data && (!Number.isInteger(data.stock) || data.stock < 0)) throw badRequest('stock inválido.');
  for (const k of ['price','price_with_discount']) if (k in data && (typeof data[k] !== 'number' || !Number.isFinite(data[k]) || data[k] < 0)) throw badRequest(k + ' inválido.');
  if ('description' in data && typeof data.description !== 'string') throw badRequest('description inválida.');
  for (const k of ['images','options','category_ids']) if (k in body && !Array.isArray(body[k])) throw badRequest(k + ' deve ser uma lista.');
  return data;
}
function optionData(item, create) {
  const d = {};
  if (item.title !== undefined) { if (typeof item.title !== 'string' || !item.title.trim()) throw badRequest('title da opção inválido.'); d.title = item.title.trim(); }
  if (item.shape !== undefined) { if (!['square','circle'].includes(item.shape)) throw badRequest('shape inválido.'); d.shape = item.shape; }
  if (item.type !== undefined) { if (!['text','color'].includes(item.type)) throw badRequest('type inválido.'); d.type = item.type; }
  if (item.radius !== undefined) {
    const radius = typeof item.radius === 'string' && /^\d+px$/.test(item.radius) ? Number(item.radius.slice(0,-2)) : item.radius;
    if (!Number.isInteger(radius) || radius < 0) throw badRequest('radius inválido.');
    d.radius = radius;
  }
  const vals = item.values ?? item.value;
  if (vals !== undefined) {
    if (!Array.isArray(vals) && typeof vals !== 'string') throw badRequest('values deve ser lista ou string.');
    const arr = Array.isArray(vals) ? vals : vals.split(',');
    if (!arr.length || arr.some(v => typeof v !== 'string' || !v.trim() || v.includes(','))) throw badRequest('values inválido.');
    d.values = arr.map(v => v.trim()).join(',');
  }
  if (create && (!d.title || !d.values)) throw badRequest('Opção requer title e values.');
  return d;
}
async function saveRelations(product, body, transaction, savedFiles) {
  if (body.category_ids !== undefined) {
    const ids = body.category_ids;
    if (ids.some(x => !Number.isInteger(x) || x <= 0)) throw badRequest('category_ids inválido.');
    const found = await Category.findAll({ where: { id: { [Op.in]: ids } }, transaction });
    if (found.length !== new Set(ids).size) throw badRequest('Categoria informada não existe.');
    await product.setCategories(found, { transaction });
  }
  for (const item of body.images || []) {
    if (!item || typeof item !== 'object') throw badRequest('Imagem inválida.');
    if (item.id !== undefined) {
      const image = await ProductImage.findOne({ where: { id: item.id, product_id: product.id }, transaction });
      if (!image) throw badRequest('Imagem não pertence ao produto.');
      if (item.deleted) await image.destroy({ transaction });
      else if (item.content !== undefined || item.path !== undefined) {
        await image.update({ path: await toPath(item, savedFiles) }, { transaction });
      }
    } else if (!item.deleted) {
      await ProductImage.create({ product_id: product.id, path: await toPath(item, savedFiles), enabled: true }, { transaction });
    }
  }
  for (const item of body.options || []) {
    if (!item || typeof item !== 'object') throw badRequest('Opção inválida.');
    if (item.id !== undefined) {
      const option = await ProductOption.findOne({ where: { id: item.id, product_id: product.id }, transaction });
      if (!option) throw badRequest('Opção não pertence ao produto.');
      if (item.deleted) await option.destroy({ transaction });
      else await option.update(optionData(item, false), { transaction });
    } else if (!item.deleted) {
      await ProductOption.create({ ...optionData(item, true), product_id: product.id }, { transaction });
    }
  }
}
async function create(req) {
  const data = validate(req.body, true);
  const savedFiles = [];
  try {
    const p = await sequelize.transaction(async transaction => {
      const obj = await Product.create(data, { transaction });
      await saveRelations(obj, req.body, transaction, savedFiles);
      return obj;
    });
    return find(req, p.id);
  } catch (err) { await cleanup(savedFiles); throw err; }
}
async function update(req, id) {
  const product = await Product.findByPk(id);
  if (!product) return false;
  const data = validate(req.body, false);
  const savedFiles = [];
  try {
    await sequelize.transaction(async transaction => {
      if (Object.keys(data).length) await product.update(data, { transaction });
      await saveRelations(product, req.body, transaction, savedFiles);
    });
    return true;
  } catch (err) { await cleanup(savedFiles); throw err; }
}
module.exports = { search, find, create, update };
