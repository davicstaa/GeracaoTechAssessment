const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');
const { badRequest } = require('../lib/errors');
const uploadDir = path.resolve(__dirname, '../../uploads');
const supported = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/webp': 'webp' };

async function toPath(image, savedFiles = []) {
  const content = image.content ?? image.path;
  if (typeof content !== 'string' || !content.trim()) throw badRequest('Imagem sem content válido.');
  // URL pública ou caminho relativo de imagem existente; não faz download remoto.
  if (/^https?:\/\//i.test(content) || /^\/uploads\/[a-zA-Z0-9_.-]+$/.test(content)) return content;
  let mime = image.type;
  let raw = content;
  const dataUrl = /^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/is.exec(content);
  if (dataUrl) { mime = dataUrl[1].toLowerCase(); raw = dataUrl[2]; }
  if (!supported[mime]) throw badRequest('Tipo de imagem não permitido. Use PNG, JPEG ou WEBP.');
  if (raw.length > 7_100_000 || !/^[A-Za-z0-9+/\s]*={0,2}$/.test(raw)) throw badRequest('Imagem base64 inválida ou grande demais.');
  const buffer = Buffer.from(raw.replace(/\s/g, ''), 'base64');
  if (!buffer.length || buffer.length > 5 * 1024 * 1024) throw badRequest('Imagem deve ter até 5 MB.');
  // Confere a assinatura do arquivo para não confiar só no MIME do cliente.
  const png = buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const jpg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const webp = buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
  if (!(mime === 'image/png' && png || ['image/jpeg','image/jpg'].includes(mime) && jpg || mime === 'image/webp' && webp)) {
    throw badRequest('Conteúdo da imagem não corresponde ao tipo informado.');
  }
  await fs.mkdir(uploadDir, { recursive: true });
  const filename = randomUUID() + '.' + supported[mime];
  const target = path.join(uploadDir, filename);
  await fs.writeFile(target, buffer);
  savedFiles.push(target);
  return '/uploads/' + filename;
}
async function cleanup(paths) { await Promise.all(paths.map(p => fs.unlink(p).catch(() => {}))); }
function absolutePath(req, value) {
  if (/^https?:\/\//i.test(value)) return value;
  return req.protocol + '://' + req.get('host') + (value.startsWith('/') ? value : '/' + value);
}
module.exports = { toPath, cleanup, absolutePath };
