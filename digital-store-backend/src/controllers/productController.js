const { Product } = require('../models');
const service = require('../services/products');
exports.search = async (req, res) => res.json(await service.search(req));
exports.get = async (req, res) => {
  const p = await service.find(req, req.params.id);
  if (!p) return res.status(404).json({ message: 'Produto não encontrado.' });
  res.json(p);
};
exports.create = async (req, res) => res.status(201).json(await service.create(req));
exports.update = async (req, res) => {
  const found = await service.update(req, req.params.id);
  if (!found) return res.status(404).json({ message: 'Produto não encontrado.' });
  res.status(204).end();
};
exports.remove = async (req, res) => {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.status(404).json({ message: 'Produto não encontrado.' });
  await p.destroy();
  res.status(204).end();
};
