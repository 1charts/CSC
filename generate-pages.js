const fs = require('fs');
const path = require('path');

// ==================== PERCORSI ====================
const baseDir = __dirname;
const svgPngDir = path.join(baseDir, 'charts', 'SVG-PNG');
const outputHtmlDir = path.join(baseDir, 'charts');

const configPath = path.join(baseDir, 'config.json');
const seoPath = path.join(baseDir, 'CSC', 'seo.json');
const templatePath = path.join(baseDir, 'template.json');
const mobilePath = path.join(baseDir, 'template-mobile.json');
const desktopPath = path.join(baseDir, 'template-desktop.json');

// ==================== CARICAMENTO ====================
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf-8')) : {};
const seoConfig = fs.existsSync(seoPath) ? JSON.parse(fs.readFileSync(seoPath, 'utf-8')) : {};

const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
const mobile = JSON.parse(fs.readFileSync(mobilePath, 'utf-8'));
const desktop = JSON.parse(fs.readFileSync(desktopPath, 'utf-8'));

// ==================== ORDINE PAGINE ====================
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
  "csc-index"
];

const allFiles = fs.readdirSync(svgPngDir);

const chartsData = chartOrder
  .filter(name => allFiles.includes(`${name}.svg`))
  .map(name => {
    const seo = seoConfig[name] || {};
    const cfg = config[name] || {};
    return {
      name,
      svgFile: `${name}.svg`,
      pngFile: `${name}.png`,
      title: seo.title || `Market Cap - ${name}`,
      sources: cfg.sources || [],
      seo
    };
  });

function createPage(chart) {
  const { name, svgFile, pngFile, title: cleanTitle, seo } = chart;

  let html = template.htmlStart
    .replace('{{TITLE}}', cleanTitle)
    .replace('{{LOGO_URL}}', template.logoUrl || '');

  // ==================== META SEO ====================
  const seoHead = `
    <meta name="description" content="${(seo.metaDescription || '').replace(/"/g, '&quot;')}">
    <meta property="og:title" content="${(seo.ogTitle || cleanTitle).replace(/"/g, '&quot;')}">
    <meta property="og:description" content="${(seo.ogDescription || '').replace(/"/g, '&quot;')}">
    <meta property="og:image" content="https://commoditysupercycle.com/charts/SVG-PNG/${pngFile}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${seo.canonical || '#'}">
    <link rel="canonical" href="${seo.canonical || '#'}">
    <meta name="robots" content="index, follow">
  `.trim();

  html = html.replace('<style>', seoHead + '\n  <style>');

  const fullCSS = template.commonCSS + "\n\n" + mobile.mobileCSS + "\n\n" + desktop.desktopCSS;
  html += fullCSS + "\n  </style>\n</head>\n<body>\n";

  // ==================== JSON-LD ====================
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": cleanTitle,
    "description": seo.metaDescription || "",
    "url": seo.canonical,
    "image": `https://commoditysupercycle.com/charts/SVG-PNG/${svgFile}`
  };

  html += `<script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>\n`;

  // ==================== BODY ====================
  let bodyHtml = template.htmlBody.replace('{{TITLE}}', cleanTitle);

  // Replace sicuro dell'immagine
  bodyHtml = bodyHtml.replace(
    /<img[^>]*id=["']chart-image["'][^>]*>/i,
    `<img id="chart-image" src="SVG-PNG/${svgFile}" alt="${cleanTitle}" loading="lazy" decoding="async">`
  );

  html += bodyHtml + template.htmlEnd
    .replace('{{CHARTS_DATA}}', JSON.stringify(chartsData))
    .replace('{{JAVASCRIPT}}', mobile.mobileJS);

  // ==================== SALVA ====================
  fs.writeFileSync(path.join(outputHtmlDir, `${name}.html`), html, 'utf-8');
  console.log(`✓ ${name}.html`);
}

chartsData.forEach(createPage);

console.log(`\n🎉 ${chartsData.length} pagine HTML generate con successo!`);
console.log(`   HTML → ${outputHtmlDir}`);
console.log(`   SVG/PNG → ${svgPngDir}`);