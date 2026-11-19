const fs = require('fs');
const path = require('path');
const cp = require('child_process');
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith('.js') ? [p] : [];
  });
}
const files = ['.sequelizerc', ...walk('src'), ...walk('tests'), ...walk('scripts')];
for (const p of files) {
  cp.execFileSync(process.execPath, ['--check', p], { stdio: 'pipe' });
}
console.log(`${files.length} arquivos JavaScript: sintaxe OK`);
