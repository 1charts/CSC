const fs = require('fs');
const path = require('path');

// ==================== PERCORSI ====================
const baseDir = __dirname;
const svgPngDir = path.join(baseDir, 'charts', 'SVG-PNG');
const outputHtmlDir = path.join(baseDir, 'charts');

const seoPath = path.join(baseDir, 'seo.json');
const configPath = path.join(baseDir, 'config.json');

const templatePath = path.join(baseDir, 'template.json');
const mobilePath = path.join(baseDir, 'template-mobile.json');
const desktopPath = path.join(baseDir, 'template-desktop.json');

// ==================== CARICAMENTO ====================
const seoConfig = JSON.parse(fs.readFileSync(seoPath, 'utf-8'));
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
const mobile = JSON.parse(fs.readFileSync(mobilePath, 'utf-8'));
const desktop = JSON.parse(fs.readFileSync(desktopPath, 'utf-8'));

// ==================== ORDINE PAGINE ====================
const chartOrder = ["upstream-nyse","upstream-lse","upstream-tsx","upstream-tsxv","upstream-asx","upstream-global","midstream","downstream","og-equipment-services","drilling-contractors","tankers","lng","royalties-trusts","biofuels-biogas","oil-gas","gold-nyse","gold-lse","gold-tsx","gold-tsxv","gold-asx","silver","gold-silver","gold-copper","pgm","precious-metals","aluminum","copper","lead-zinc","lithium","iron-steel","nickel","rare-earths","uranium","antimony","beryllium","cobalt","magnesium","manganese","molybdenum-tungsten","niobium-tantalum","tin","titanium-zirconium","silicon","vanadium","base-metals","diversified","hydrogen","helium","coal","graphite-graphene","diamonds-gems","fertilizers-salt","industrial-minerals","mining-equipment-services","csc-index"];

const allFiles = fs.readdirSync(svgPngDir);

// ==================== CHARTS DATA ====================
const chartsData = chartOrder
  .filter(name => allFiles.includes(`${name}.svg`))
  .map(name => {
    const chartConfig = config[name] || {};
    const seo = seoConfig[name] || {};
    return {
      name,
      title: chartConfig.title,
      svgFile: `${name}.svg`,
      pngFile: `${name}.png`
    };
  });

function createPage(chart) {
  const { name, svgFile, pngFile, title: pageTitle } = chart;
  const seo = seoConfig[name] || {};

  const metaDescription = seo.metaDescription || `Historical market capitalization of ${name.replace(/-/g, ' ')} companies.`;
  const ogTitle         = seo.ogTitle || pageTitle;
  const ogDescription   = seo.ogDescription || metaDescription;
  const canonical       = seo.canonical || `https://commoditysupercycle.com/charts/${name}`;
  const keywordsStr     = Array.isArray(seo.keywords) ? seo.keywords.join(', ') : '';
  const ogImage         = seo.ogImage || pngFile;

  const seoHead = `
    <meta name="description" content="${metaDescription.replace(/"/g, '&quot;')}">
    ${keywordsStr ? `<meta name="keywords" content="${keywordsStr.replace(/"/g, '&quot;')}">` : ''}
    <meta property="og:title" content="${ogTitle.replace(/"/g, '&quot;')}">
    <meta property="og:description" content="${ogDescription.replace(/"/g, '&quot;')}">
    <meta property="og:image" content="https://commoditysupercycle.com/charts/SVG-PNG/${ogImage}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonical}">
    <link rel="canonical" href="${canonical}">
    <meta name="robots" content="index, follow">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${ogTitle.replace(/"/g, '&quot;')}">
    <meta name="twitter:description" content="${ogDescription.replace(/"/g, '&quot;')}">
    <meta name="twitter:image" content="https://commoditysupercycle.com/charts/SVG-PNG/${ogImage}">

    <link rel="preload" as="image" href="SVG-PNG/${svgFile}" fetchpriority="high">
  `.trim();

  let html = template.htmlStart
    .replace('{{TITLE}}', pageTitle)
    .replace('{{LOGO_URL}}', template.logoUrl || '');

  html = html.replace('<style>', seoHead + '\n  <style>');

  const fullCSS = template.commonCSS + "\n\n" + mobile.mobileCSS + "\n\n" + desktop.desktopCSS;
  html += fullCSS + "\n  </style>\n</head>\n<body>\n";

  // SR-ONLY
  html += `
  <div class="sr-only">
    <h2>${seo.h1 || pageTitle}</h2>
    <h3>${seo.h2 || 'Aggregate Market Capitalization'}</h3>
    ${seo.h3 ? `<p>${seo.h3}</p>` : ''}
    <p>${seo.extendedDescription || seo.svgDesc || metaDescription}</p>
  </div>
  `;

  // JSON-LD
  const jsonLd = seo.schemaOrg || {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "name": pageTitle, "description": metaDescription, "url": canonical },
      {
        "@type": "Dataset",
        "name": pageTitle,
        "description": metaDescription,
        "url": canonical,
        "image": `https://commoditysupercycle.com/charts/SVG-PNG/${ogImage}`,
        "temporalCoverage": "2016/2026",
        "measurementTechnique": "Aggregated equity market capitalization from public financial data"
      }
    ]
  };

  html += `<script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>\n`;

  // ====================== BODY ======================
  let bodyHtml = template.htmlBody.replace('{{TITLE}}', pageTitle);

  // Immagine principale con eager + high priority
  bodyHtml = bodyHtml.replace(
    /<img[^>]*id=["']chart-image["'][^>]*>/i,
    `<img id="chart-image" 
          src="SVG-PNG/${svgFile}" 
          alt="${seo.svgTitle || pageTitle}" 
          loading="eager" 
          fetchpriority="high"
          decoding="async">`
  );

  // LINK SEO PREV / NEXT
  const currentIdx = chartsData.findIndex(c => c.name === name);
  let seoNavLinks = '';

  if (currentIdx > 0) {
    const prev = chartsData[currentIdx - 1];
    seoNavLinks += `<a href="${prev.name}.html" class="seo-nav-link" rel="prev">Previous: ${prev.title}</a>\n`;
  }
  if (currentIdx < chartsData.length - 1) {
    const next = chartsData[currentIdx + 1];
    seoNavLinks += `<a href="${next.name}.html" class="seo-nav-link" rel="next">Next: ${next.title}</a>\n`;
  }

  bodyHtml = bodyHtml.replace(
    /(<button id="next-btn" class="btn nav-btn" onclick="navigateNext\(\)">[\s\S]*?<\/button>)/i,
    `$1\n      ${seoNavLinks}`
  );

  html += bodyHtml + template.htmlEnd
    .replace('{{CHARTS_DATA}}', JSON.stringify(chartsData))
    .replace('{{JAVASCRIPT}}', mobile.mobileJS);

  fs.writeFileSync(path.join(outputHtmlDir, `${name}.html`), html, 'utf-8');
  console.log(`✓ ${name}.html`);
}

chartsData.forEach(createPage);

console.log(`\n🎉 ${chartsData.length} pagine HTML generate con successo!`);