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

// ==================== ORDINE PERSONALIZZATO (IMPORTANTE) ====================
const chartOrder = [
  "upstream-nyse",
  "upstream-lse",
  "upstream-tsx",
  "upstream-tsxv",
  "upstream-asx",
  "upstream-global",
  "midstream",
  "downstream",
  "og-equipment-services",
  "drilling-contractors",
  "tankers",
  "lng",
  "royalties-trusts",
  "biofuels-biogas",
  "oil-gas",
  "gold-nyse",
  "gold-lse",
  "gold-tsx",
  "gold-tsxv",
  "gold-asx",
  "silver",
  "gold-silver",
  "gold-copper",
  "pgm",
  "precious-metals",
  "aluminum",
  "copper",
  "lead-zinc",
  "lithium",
  "iron-steel",
  "nickel",
  "rare-earths",
  "uranium",
  "antimony",
  "beryllium",
  "cobalt",
  "magnesium",
  "manganese",
  "molybdenum-tungsten",
  "niobium-tantalum",
  "tin",
  "titanium-zirconium",
  "silicon",
  "vanadium",
  "base-metals",
  "diversified",
  "hydrogen",
  "helium",
  "coal",
  "graphite-graphene",
  "diamonds-gems",
  "fertilizers-salt",
  "industrial-minerals",
  "mining-equipment-services",
  "total-csc"
];

// Leggi tutti i file PNG presenti
const allFiles = fs.readdirSync(chartsDir).filter(f => f.endsWith('.png'));

// Costruisci chartsData rispettando l'ordine desiderato
const chartsData = chartOrder
  .filter(name => allFiles.some(f => path.basename(f, '.png') === name))
  .map(name => {
    const file = allFiles.find(f => path.basename(f, '.png') === name);
    const cfg = config[name] || {};
    return {
      name,
      file,
      title: cfg.title || `Chart ${name}`,
      sources: Array.isArray(cfg.sources) ? cfg.sources : []
    };
  });

function createPage(chart) {
  const { name, file, title } = chart;
  const cfg = config[name] || {};

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

// Genera le pagine
chartsData.forEach(chart => createPage(chart));

console.log(`🎉 ${chartsData.length} pagine HTML generate correttamente nell'ordine corretto!`);