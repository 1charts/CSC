const fs = require('fs');
const path = require('path');

const chartsDir = path.join(__dirname, 'charts');
const configPath = path.join(__dirname, 'config.json');
const seoPath = path.join(__dirname, 'seo.json');
const templatePath = path.join(__dirname, 'template.json');
const mobilePath = path.join(__dirname, 'template-mobile.json');
const desktopPath = path.join(__dirname, 'template-desktop.json');

const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {};
const seoConfig = fs.existsSync(seoPath) ? JSON.parse(fs.readFileSync(seoPath)) : {};

const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
const mobile = JSON.parse(fs.readFileSync(mobilePath, 'utf-8'));
const desktop = JSON.parse(fs.readFileSync(desktopPath, 'utf-8'));

// ==================== ORDINE ESATTO (aggiornato con csc-index) ====================
const chartOrder = [
  "upstream-nyse", "upstream-lse", "upstream-tsx", "upstream-tsxv", "upstream-asx",
  "upstream-global", "midstream", "downstream", "og-equipment-services",
  "drilling-contractors", "tankers", "lng", "royalties-trusts", "biofuels-biogas",
  "oil-gas",
  "gold-nyse", "gold-lse", "gold-tsx", "gold-tsxv", "gold-asx",
  "silver", "gold-silver", "gold-copper", "pgm", "precious-metals",
  "aluminum", "copper", "lead-zinc", "lithium", "iron-steel", "nickel",
  "rare-earths", "uranium", "antimony", "beryllium", "cobalt", "magnesium",
  "manganese", "molybdenum-tungsten", "niobium-tantalum", "tin",
  "titanium-zirconium", "silicon", "vanadium", "base-metals",
  "diversified", "hydrogen", "helium", "coal", "graphite-graphene",
  "diamonds-gems", "fertilizers-salt", "industrial-minerals",
  "mining-equipment-services",
  "csc-index"          // ← corretto
];

// Leggi tutti i PNG presenti
const allFiles = fs.readdirSync(chartsDir).filter(f => f.endsWith('.png'));

// Costruisci chartsData rispettando l'ordine
const chartsData = chartOrder
  .filter(name => allFiles.some(f => path.basename(f, '.png') === name))
  .map(name => {
    const file = allFiles.find(f => path.basename(f, '.png') === name);
    const cfg = config[name] || {};
    const seo = seoConfig[name] || {};

    return {
      name,
      file,
      title: cfg.title || `Chart ${name}`,
      sources: Array.isArray(cfg.sources) ? cfg.sources : [],
      seo: seo
    };
  });

function createPage(chart) {
  const { name, file, seo } = chart;

  const fullCSS = template.commonCSS + "\n\n" + mobile.mobileCSS + "\n\n" + desktop.desktopCSS;

  let html = template.htmlStart
    .replace('{{TITLE}}', seo.title || `${name} Market Cap | CommoditySuperCycle`)
    .replace('{{LOGO_URL}}', template.logoUrl);

  // ==================== SEO INIEZIONE ====================
  const seoHead = `
    <meta name="description" content="${seo.metaDescription || ''}">
    <meta property="og:title" content="${seo.ogTitle || seo.title}">
    <meta property="og:description" content="${seo.ogDescription || ''}">
    <meta property="og:image" content="https://commoditysupercycle.com/charts/${seo.ogImage || file}">
    <meta property="og:type" content="website">
    <link rel="canonical" href="${seo.canonical}">
  `;

  html = html.replace('</head>', seoHead + '\n</head>');

  html += fullCSS + "\n  </style>\n</head>\n<body>\n";

  html += template.htmlBody
    .replace('{{TITLE}}', seo.title || chart.title)
    .replace('{{FILE}}', file);

  html += template.htmlEnd
    .replace('{{CHARTS_DATA}}', JSON.stringify(chartsData))
    .replace('{{JAVASCRIPT}}', mobile.mobileJS);

  fs.writeFileSync(name + '.html', html);
}

// Genera le pagine
chartsData.forEach(chart => createPage(chart));

console.log(`🎉 ${chartsData.length} pagine HTML generate correttamente con SEO completa!`);