const fs = require('fs');
const path = require('path');

const chartsDir = path.join(__dirname, 'charts');
const configPath = path.join(__dirname, 'config.json');
const seoPath = path.join(__dirname, 'seo.json');
const templatePath = path.join(__dirname, 'template.json');
const mobilePath = path.join(__dirname, 'template-mobile.json');
const desktopPath = path.join(__dirname, 'template-desktop.json');

// ==================== CARICAMENTO ====================
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf-8')) : {};
const seoConfig = fs.existsSync(seoPath) ? JSON.parse(fs.readFileSync(seoPath, 'utf-8')) : {};

const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
const mobile = JSON.parse(fs.readFileSync(mobilePath, 'utf-8'));
const desktop = JSON.parse(fs.readFileSync(desktopPath, 'utf-8'));

// ==================== ORDINE PAGINE ====================
const chartOrder = [ /* il tuo array rimane identico */ 
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
  "csc-index"
];

const allFiles = fs.readdirSync(chartsDir);

// Prendiamo sia .svg che .png, ma preferiamo SVG
const chartsData = chartOrder
  .filter(name => allFiles.some(f => path.basename(f, '.svg') === name || path.basename(f, '.png') === name))
  .map(name => {
    const svgFile = `${name}.svg`;
    const pngFile = `${name}.png`;
    
    const file = allFiles.includes(svgFile) ? svgFile : pngFile; // preferisce SVG
    
    const cfg = config[name] || {};
    const seo = seoConfig[name] || {};
    
    return { 
      name, 
      file, 
      pngFallback: pngFile,   // salviamo anche il png per il fallback
      title: cfg.title || `Chart ${name}`, 
      sources: cfg.sources || [], 
      seo 
    };
  });

function createPage(chart) {
  const { name, file, pngFallback, seo } = chart;

  const fullCSS = template.commonCSS + "\n\n" + mobile.mobileCSS + "\n\n" + desktop.desktopCSS;

  let html = template.htmlStart
    .replace('{{TITLE}}', seo.title || `${name} Market Cap | CommoditySuperCycle`)
    .replace('{{LOGO_URL}}', template.logoUrl);

  // META SEO (usiamo PNG per og:image perché più compatibile con i social)
  const ogImage = seo.ogImage || pngFallback || file;
  const seoHead = `
    <meta name="description" content="${(seo.metaDescription || '').replace(/"/g, '&quot;')}">
    <meta property="og:title" content="${(seo.ogTitle || seo.title || '').replace(/"/g, '&quot;')}">
    <meta property="og:description" content="${(seo.ogDescription || '').replace(/"/g, '&quot;')}">
    <meta property="og:image" content="https://commoditysupercycle.com/charts/${ogImage}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${seo.canonical}">
    <link rel="canonical" href="${seo.canonical}">
    <meta name="robots" content="index, follow">
  `.trim();

  html = html.replace('<style>', seoHead + '\n  <style>');

  html += fullCSS + "\n  </style>\n</head>\n<body>\n";

  // JSON-LD (rimane uguale)
  const jsonLd = { /* ... rimane identico ... */ };
  html += `\n    <script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n    </script>\n`;

  // ==================== BODY CON PICTURE (SVG + PNG fallback) ====================
  let bodyHtml = template.htmlBody
    .replace('{{TITLE}}', seo.title || chart.title);

  // Sostituiamo l'img con <picture>
  bodyHtml = bodyHtml.replace(
    /<img id="chart-image" src="charts\/[^"]*"/i,
    `<picture>
        <source srcset="charts/${file}" type="image/svg+xml">
        <img id="chart-image" 
             src="charts/${pngFallback}" 
             alt="${(seo.title || chart.title).replace(/"/g, '&quot;')}"
             loading="lazy"
             decoding="async">
      </picture>`
  );

  // Fonti statiche (rimane uguale)
  let sourcesText = '';
  if (chart.sources && chart.sources.length > 0) {
    const valid = chart.sources.filter(s => s.text && s.text.trim() !== '');
    if (valid.length > 0) {
      sourcesText = valid.map(s => s.link && s.link !== '#' ? `${s.text} - ${s.link}` : s.text).join(' · ');
    }
  }

  if (sourcesText) {
    bodyHtml = bodyHtml.replace(
      '<!-- Fonti statiche per i crawler (nascoste) -->\n        <div id="sources-static" style="display:none;">\n          Sources: {{SOURCES_STATIC}}\n        </div>',
      `<!-- Fonti statiche per i crawler -->\n        <div id="sources-static" style="display:none;">\n          Sources: ${sourcesText}\n        </div>`
    );
  } else {
    bodyHtml = bodyHtml.replace(/<!-- Fonti statiche per i crawler \(nascoste\) -->[\s\S]*?<\/div>/, '');
  }

  html += bodyHtml;

  html += template.htmlEnd
    .replace('{{CHARTS_DATA}}', JSON.stringify(chartsData))
    .replace('{{JAVASCRIPT}}', mobile.mobileJS);

  fs.writeFileSync(name + '.html', html, 'utf-8');
}

chartsData.forEach(chart => createPage(chart));

console.log(`🎉 ${chartsData.length} pagine generate con SVG + PNG fallback!`);
console.log(`   → SVG prioritario, PNG come fallback`);