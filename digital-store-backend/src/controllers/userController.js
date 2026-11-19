const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { badRequest } = require('../lib/errors');

function validName(value) { return typeof value === 'string' && value.trim().length > 0; }
function validEmail(value) { return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }

exports.create = async (req, res) => {
  const { firstname, surname, email, password, confirmPassword } = req.body;
  if (!validName(firstname) || !validName(surname) || !validEmail(email) ||
      typeof password !== 'string' || password.length < 6 || password !== confirmPassword) {
    throw badRequest('Informe nome, sobrenome, e-mail válido e senha de no mínimo 6 caracteres com confirmação igual.');
  }
  const u = await User.create({ firstname: firstname.trim(), surname: surname.trim(), email: email.trim().toLowerCase(), password });
  res.status(201).json({ id: u.id, firstname: u.firstname, surname: u.surname, email: u.email });
};
exports.token = async (req, res) => {
  const { email, password } = req.body;
  if (!validEmail(email) || typeof password !== 'string') throw badRequest('Informe e-mail e senha.');
  const u = await User.scope('withPassword').findOne({ where: { email: email.trim().toLowerCase() } });
  if (!u || !(await bcrypt.compare(password, u.password))) throw badRequest('Credenciais inválidas.');
  res.json({ token: jwt.sign({ id: u.id, email: u.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }) });
};
exports.get = async (req, res) => {
  const u = await User.findByPk(req.params.id);
  if (!u) return res.status(404).json({ message: 'Usuário não encontrado.' });
  res.json({ id: u.id, firstname: u.firstname, surname: u.surname, email: u.email });
};
exports.update = async (req, res) => {
  if (String(req.user.id) !== String(req.params.id)) return res.status(403).json({ message: 'Sem permissão para alterar outro usuário.' });
  const u = await User.findByPk(req.params.id);
  if (!u) return res.status(404).json({ message: 'Usuário não encontrado.' });
  const data = {};
  if (req.body.firstname !== undefined) {
    if (!validName(req.body.firstname)) throw badRequest('firstname inválido.');
    data.firstname = req.body.firstname.trim();
  }
  if (req.body.surname !== undefined) {
    if (!validName(req.body.surname)) throw badRequest('surname inválido.');
    data.surname = req.body.surname.trim();
  }
  if (req.body.email !== undefined) {
    if (!validEmail(req.body.email)) throw badRequest('email inválido.');
    data.email = req.body.email.trim().toLowerCase();
  }
  if (!Object.keys(data).length) throw badRequest('Informe algum campo para atualizar.');
  await u.update(data);
  res.status(204).end();
};
exports.remove = async (req, res) => {
  if (String(req.user.id) !== String(req.params.id)) return res.status(403).json({ message: 'Sem permissão para excluir outro usuário.' });
  const u = await User.findByPk(req.params.id);
  if (!u) return res.status(404).json({ message: 'Usuário não encontrado.' });
  await u.destroy();
  res.status(204).end();
};
