const fs = require('fs');
const path = require('path');

const chartsDir = path.join(__dirname, 'charts');
const configPath = path.join(__dirname, 'config.json');
const templatePath = path.join(__dirname, 'template.json');
const mobilePath = path.join(__dirname, 'template-mobile.json');
const desktopPath = path.join(__dirname, 'template-desktop.json');

const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {};
const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
const mobile = JSON.parse(fs.readFileSync(mobilePath, 'utf-8'));
const desktop = JSON.parse(fs.readFileSync(desktopPath, 'utf-8'));

const files = fs.readdirSync(chartsDir)
  .filter(f => f.endsWith('.png'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

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

  const fullCSS = template.commonCSS + "\n\n" + mobile.mobileCSS + "\n\n" + desktop.desktopCSS;

  let html = template.htmlStart
    .replace('{{TITLE}}', title)
    .replace('{{LOGO_URL}}', template.logoUrl);

  html += fullCSS + "\n  </style>\n</head>\n<body>\n";

  html += template.htmlBody
    .replace('{{TITLE}}', title)
    .replace('{{FILE}}', file);

  html += template.htmlEnd
    .replace('{{CHARTS_DATA}}', JSON.stringify(chartsData))
    .replace('{{JAVASCRIPT}}', mobile.mobileJS);

  fs.writeFileSync(name + '.html', html);
}

files.forEach(file => createPage(file));

console.log(`🎉 ${files.length} pagine HTML generate correttamente!`);