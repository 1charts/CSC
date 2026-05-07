const fs = require('fs');
const path = require('path');

const chartsDir = path.join(__dirname, 'charts');
const configPath = path.join(__dirname, 'config.json');

const templatePath = path.join(__dirname, 'template.json');
const mobilePath = path.join(__dirname, 'template-mobile.json');
const desktopPath = path.join(__dirname, 'template-desktop.json');

// Carica tutti i template
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {};
const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
const mobile = JSON.parse(fs.readFileSync(mobilePath, 'utf-8'));
const desktop = JSON.parse(fs.readFileSync(desktopPath, 'utf-8'));

const files = fs.readdirSync(chartsDir)
  .filter(f => f.endsWith('.png'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

// Genera chartsData una sola volta
const chartsData = files.map(file => {
  const name = path.basename(file, '.png');
  const cfg = config[name] || {};
  return {
    name,
    file,
    title: cfg.title || `Chart ${name}`,
    sources: Array.isArray(cfg.sources) ? cfg.sources : []
  };
});

function createPage(file) {
  const name = path.basename(file, '.png');
  const cfg = config[name] || {};
  const title = cfg.title || `Chart ${name}`;

  // Combina CSS (mobile + desktop + extra futuro)
  const fullCss = mobile.cssMobile + '\n\n' + desktop.cssDesktop + '\n\n' + desktop.extraCssDesktop;

  let html = template.htmlTemplate
    .replace('{{TITLE}}', title)
    .replace('{{LOGO_URL}}', template.logoUrl)
    .replace('{{FULL_CSS}}', fullCss)
    .replace('{{BODY_HTML}}', mobile.bodyHtml
      .replace('{{TITLE}}', title)
      .replace('{{CHART_FILE}}', file) + desktop.extraBodyDesktop)
    .replace('{{CHARTS_DATA}}', JSON.stringify(chartsData))
    .replace('{{JAVASCRIPT}}', mobile.javascript);

  fs.writeFileSync(name + '.html', html);
}

// Genera tutte le pagine
files.forEach(file => createPage(file));

console.log(`🎉 ${files.length} pagine HTML regenerate correttamente!`);
console.log(`📁 File generati: ${files.map(f => f.replace('.png', '.html')).join(', ')}`);