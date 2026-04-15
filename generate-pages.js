const fs = require('fs');
const path = require('path');

const chartsDir = path.join(__dirname, 'charts');
const configPath = path.join(__dirname, 'config.json');

let config = {};
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath));
}

const files = fs.readdirSync(chartsDir)
  .filter(f => f.endsWith('.png'))
  .sort();

function createPage(file, index) {
  const name = file.replace('.png', '');
  const prev = files[index - 1] ? files[index - 1].replace('.png','') : null;
  const next = files[index + 1] ? files[index + 1].replace('.png','') : null;

  const cfg = config[name] || {};
  const title = cfg.title || `Chart ${name}`;
  const sourceText = cfg.sourceText || "";
  const sourceLink = cfg.sourceLink || "#";
  
  const currentUrl = `https://1charts.github.io/CSC/${name}.html`;
  const chartImageUrl = `https://1charts.github.io/CSC/charts/${file}`;
  const logoUrl = "https://commoditysupercycle.com/assets/logo192-C5BlHOLs.png";
  
  const shareTextX = encodeURIComponent(`${title} - via @CommodityCSC`);

  const sourceHtmlInline = sourceText 
    ? `<span class="source-inline"> — Source: <a href="${sourceLink}" target="_blank">${sourceText}</a></span>` 
    : "";
    
  const screenshotSourceBottom = sourceText ? `<div id="ss-source-bottom" style="display:none; color:#94a3b8; font-size:12px; margin-top:10px; text-align:left;">Source: ${sourceText}</div>` : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>${title} | CSC</title>

<link rel="icon" type="image/png" href="${logoUrl}">
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

<style>
* { box-sizing: border-box; }
body { margin:0; background:#0f172a; font-family: 'Segoe UI', Arial, sans-serif; color:#e2e8f0; overflow: hidden; height: 100vh; width: 100vw; }

#rotate-message { display: none; position: fixed; top:0; left:0; width:100%; height:100%; background:#0f172a; z-index: 999; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
@media (orientation: portrait) { #rotate-message { display: flex; } }

.container { width: 100%; height: 100vh; display: flex; flex-direction: column; padding: 5px 15px; }

.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; flex-shrink: 0; height: 50px; }
.title-group { flex: 1; min-width: 0; }
.title { font-size: 18px; font-weight: bold; color:#f8fafc; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.subtitle { font-size: 12px; color:#67e8f9; text-decoration: none; }
.source-inline { font-size: 11px; color: #94a3b8; font-weight: normal; }
.source-inline a { color: #67e8f9; text-decoration: none; }

.actions { display: flex; gap: 6px; align-items: center; }
.btn { background: #1e293b; border: 1px solid #334155; color: #f8fafc; padding: 6px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; text-decoration: none; }
.btn:hover { background: #334155; }
.btn svg { width: 18px; height: 18px; fill: currentColor; }
.btn.nav-btn { color: #67e8f9; padding: 4px 8px; }
.btn.nav-btn svg { width: 22px; height: 22px; stroke: currentColor; stroke-width: 2.5; fill: none; }

#full-capture-area { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden; background: #0f172a; padding: 10px; }
.chart-container { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }
img { max-width: 100%; max-height: 100%; object-fit: contain; }

#screenshot-title-box { display: none; margin-bottom: 15px; text-align: left; }
</style>
</head>

<body>

<div id="rotate-message">
    <h2 style="margin-top:20px">Ruota il dispositivo</h2>
</div>

<div class="container">
  <div class="header-row">
    <div class="title-group">
      <div class="title">${title}</div>
      <a class="subtitle" href="https://commoditysupercycle.com/" target="_blank">commoditysupercycle.com</a>
      ${sourceHtmlInline}
    </div>
    
    <div class="actions">
      <button class="btn" onclick="toggleFullScreen()">FULL</button>

      ${prev ? `<a id="prev-btn" class="btn nav-btn" href="${prev}.html" onclick="beforeNav()">←</a>` : ''}
      ${next ? `<a id="next-btn" class="btn nav-btn" href="${next}.html" onclick="beforeNav()">→</a>` : ''}
    </div>
  </div>

  <div id="full-capture-area">
    <div class="chart-container">
      <img src="charts/${file}">
    </div>
    ${screenshotSourceBottom}
  </div>
</div>

<script>

// 🔥 SALVA STATO FULLSCREEN
function beforeNav() {
    if (document.fullscreenElement) {
        sessionStorage.setItem('wasFullscreen', 'true');
    }
}

// 🔥 RIPRISTINA FULLSCREEN (fix principale)
window.addEventListener('load', () => {
    if (sessionStorage.getItem('wasFullscreen') === 'true') {
        sessionStorage.removeItem('wasFullscreen');

        setTimeout(() => {
            document.documentElement.requestFullscreen().catch(() => {});
        }, 300);
    }
});

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

</script>
</body>
</html>
`;
}

files.forEach((file, i) => {
  const html = createPage(file, i);
  const name = file.replace('.png','');
  fs.writeFileSync(`${name}.html`, html);
  console.log("✔ created:", `${name}.html`);
});