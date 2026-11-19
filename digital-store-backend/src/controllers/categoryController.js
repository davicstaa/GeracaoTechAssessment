const { Category } = require('../models');
const { pagination, fieldSet } = require('../lib/query');
const { badRequest } = require('../lib/errors');
const allowed = ['id','name','slug','use_in_menu','created_at','updated_at'];

function payload(body, update=false) {
  const data = {};
  if (!update || body.name !== undefined) {
    if (typeof body.name !== 'string' || !body.name.trim()) throw badRequest('name é obrigatório.');
    data.name = body.name.trim();
  }
  if (!update || body.slug !== undefined) {
    if (typeof body.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug)) throw badRequest('slug inválido.');
    data.slug = body.slug;
  }
  if (body.use_in_menu !== undefined) {
    if (typeof body.use_in_menu !== 'boolean') throw badRequest('use_in_menu deve ser booleano.');
    data.use_in_menu = body.use_in_menu;
  }
  if (update && !Object.keys(data).length) throw badRequest('Informe um campo para atualizar.');
  return data;
}
exports.search = async (req, res) => {
  const { limit, page, offset } = pagination(req.query);
  const fields = fieldSet(req.query.fields, allowed);
  const where = {};
  if (req.query.use_in_menu !== undefined) {
    if (!['true','false'].includes(req.query.use_in_menu)) throw badRequest('use_in_menu precisa ser true ou false.');
    where.use_in_menu = req.query.use_in_menu === 'true';
  }
  const options = { where, order: [['id','ASC']] };
  if (fields) options.attributes = [...fields];
  if (limit !== -1) { options.limit = limit; options.offset = offset; }
  const { rows, count } = await Category.findAndCountAll(options);
  res.json({ data: rows, total: count, limit, page });
};
exports.get = async (req, res) => {
  const obj = await Category.findByPk(req.params.id);
  if (!obj) return res.status(404).json({ message: 'Categoria não encontrada.' });
  res.json(obj);
};
exports.create = async (req, res) => res.status(201).json(await Category.create(payload(req.body)));
exports.update = async (req, res) => {
  const obj = await Category.findByPk(req.params.id);
  if (!obj) return res.status(404).json({ message: 'Categoria não encontrada.' });
  await obj.update(payload(req.body, true));
  res.status(204).end();
};
exports.remove = async (req, res) => {
  const obj = await Category.findByPk(req.params.id);
  if (!obj) return res.status(404).json({ message: 'Categoria não encontrada.' });
  await obj.destroy();
  res.status(204).end();
};
