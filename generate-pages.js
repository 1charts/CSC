const fs = require('fs');
const path = require('path');

const chartsDir = path.join(__dirname, 'charts');
const configPath = path.join(__dirname, 'config.json');
const config = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath))
  : {};

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
  const logoUrl = "https://commoditysupercycle.com/assets/logo192-C5BlHOLs.png";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} | CSC</title>

<link rel="icon" href="${logoUrl}">

<style>
* { box-sizing: border-box; }

body {
  margin:0;
  background:#0f172a;
  font-family: Arial;
  color:#e2e8f0;
  height:100vh;
}

.container {
  height:100%;
  display:flex;
  flex-direction:column;
}

/* HEADER BASE */
.header-row {
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:10px;
}

.title { font-size:18px; }
.subtitle { font-size:12px; color:#67e8f9; }
.source-inline { font-size:11px; }

.actions {
  display:flex;
  gap:6px;
}

/* IMAGE */
.chart-container {
  flex:1;
  display:flex;
  justify-content:center;
  align-items:center;
}

img {
  max-width:100%;
  max-height:100%;
}

/* ================= DESKTOP ================= */
@media (min-width:768px) {

  .container {
    position:relative;
  }

  /* NON overlay totale */
  .header-row {
    position:relative;
    height:0;
  }

  /* TESTO */
  .title-group {
    position:absolute;
    bottom:20px;
    right:20px;
    text-align:right;
    z-index:10;
  }

  /* BOTTONI */
  .actions {
    position:absolute;
    bottom:20px;
    left:20px;
    z-index:10;
  }

  img {
    max-width:80%;
    max-height:80%;
  }
}

/* ================= MOBILE ================= */
@media (max-width:767px) {

  .header-row {
    position:relative;
  }

  .actions {
    position:absolute;
    top:10px;
    right:10px;
    flex-direction:column;
  }

}
</style>
</head>

<body>

<div class="container">

  <div class="header-row">

    <div class="title-group">
      <div class="title">${title}</div>
      <div class="subtitle">commoditysupercycle.com</div>
      <div id="source-inline"></div>
    </div>

    <div class="actions">
      <button onclick="alert('fullscreen')">⛶</button>
      <button onclick="alert('screenshot')">📷</button>
    </div>

  </div>

  <div class="chart-container">
    <img src="charts/${file}">
  </div>

</div>

<script>
const chartsData = ${JSON.stringify(chartsData)};
</script>

</body>
</html>`;
}

files.forEach(file => {
  fs.writeFileSync(
    file.replace('.png', '.html'),
    createPage(file)
  );
});

console.log("✅ HTML generati");