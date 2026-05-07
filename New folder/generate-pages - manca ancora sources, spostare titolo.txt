const fs = require('fs'), path = require('path');

const chartsDir = path.join(__dirname, 'charts');
const configPath = path.join(__dirname, 'config.json');
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {};

const files = fs.readdirSync(chartsDir)
  .filter(f => f.endsWith('.png'))
  .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

const chartsData = files.map(file => {
  const name = path.basename(file, '.png');
  const key = name;
  const cfg = config[key] || {};
  return {
    name,
    file,
    title: cfg.title || `Chart ${name}`,
    sources: Array.isArray(cfg.sources) ? cfg.sources : []
  };
});

function createPage(file) {
  const name = path.basename(file, '.png');
  const key = name;
  const cfg = config[key] || {};
  const title = cfg.title || `Chart ${name}`;
  const logoUrl = "https://commoditysupercycle.com/assets/logo192-C5BlHOLs.png";
  const sourceHtmlInline = `<span id="source-inline" class="source-inline"></span>`;

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>${title} | CSC</title><link rel="icon" type="image/png" href="${logoUrl}">
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

  #full-capture-area { 
    flex-grow: 1; 
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    position: relative; 
    overflow: hidden; 
    background: #0f172a; 
    padding: 15px; 
  }
  .chart-container { 
    width: 100%; 
    flex-grow: 1; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    min-height: 0;
  }
  img { 
    max-width: 100%; 
    max-height: 100%; 
    object-fit: contain; 
    image-rendering: crisp-edges;
  }

  #screenshot-title-box { 
    display: none; 
    margin-bottom: 20px; 
    text-align: left; 
    padding: 0 10px;
  }
  #ss-title { 
    font-size: 28px; 
    font-weight: bold; 
    color: #f8fafc; 
    margin-bottom: 6px;
  }
  #ss-subtitle { 
    font-size: 15px; 
    color: #67e8f9; 
    margin-bottom: 8px;
  }
  #ss-source-bottom { 
    color: #f8fafc; 
    font-size: 14px; 
    font-weight: 500;
  }
  .source-label { color: #f8fafc; font-weight: bold; }
</style></head>
<body>
<div id="rotate-message">
  <svg width="50" height="50" viewBox="0 0 24 24" fill="#67e8f9"><path d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h2C24 4.96 19.1 0 13 0l-1.65 1.65 1.41 1.41 3.72-3.54zM7.52 21.48C4.25 19.93 1.91 16.76 1.55 13h-2C-.45 19.04 4.45 24 10.55 24l1.65-1.65-1.41-1.41-3.27 3.54zM21 5H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H3V7h18v10z"/></svg>
  <h2 style="margin-top:20px">Ruota il dispositivo</h2>
</div>
<div class="container">
  <div class="header-row">
    <div class="title-group">
      <div class="title" id="page-title">${title}</div>
      <a class="subtitle" href="https://commoditysupercycle.com/" target="_blank">commoditysupercycle.com</a>
      ${sourceHtmlInline}
    </div>
    <div class="actions">
      <button class="btn" onclick="toggleFullScreen()"><svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg></button>
      <button class="btn" onclick="takeScreenshot()"><svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></button>
      <a id="twitter-share" class="btn" href="" target="_blank"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg></a>
      <a id="fb-share" class="btn" href="" target="_blank"><svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
      <div style="width:1px; height:20px; background:#334155; margin:0 4px;"></div>
      <button id="prev-btn" class="btn nav-btn" onclick="navigatePrev()"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
      <button id="next-btn" class="btn nav-btn" onclick="navigateNext()"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>
    </div>
  </div>
  <div id="full-capture-area">
    <div id="screenshot-title-box">
      <div id="ss-title" style="font-size:28px; font-weight:bold; color:#f8fafc;">${title}</div>
      <div id="ss-subtitle" style="font-size:15px; color:#67e8f9;">commoditysupercycle.com</div>
      <div id="ss-source-bottom" style="display:none; margin-top:8px;">
        <span class="source-label">Sources:</span> 
        <span id="ss-source-text"></span>
      </div>
    </div>
    <div class="chart-container"><img src="charts/${file}"></div>
  </div>
</div>
<script>
const chartsData = ${JSON.stringify(chartsData)};

const getName = () => window.location.pathname.split('/').pop().replace('.html', '') || chartsData[0].name;
let currentIndex = Math.max(0, chartsData.findIndex(c => c.name === getName()));

function updatePage() {
  const c = chartsData[currentIndex];
  const sInline = document.getElementById('source-inline');
  const ssEl = document.getElementById('ss-source-text');
  const validSources = (c.sources || []).filter(s => s.text && s.text.trim() !== '');

  document.getElementById('page-title').textContent = c.title;
  sInline.innerHTML = validSources.length ? ' — ' + validSources.map(s => '<a href="' + s.link + '" target="_blank">' + s.text + '</a>').join(' · ') : '';
  document.querySelector('img').src = 'charts/' + c.file;
  document.getElementById('ss-title').textContent = c.title;
  if (ssEl) ssEl.innerHTML = validSources.length ? validSources.map(s => s.text).join(' · ') : '';

  const url = 'https://1charts.github.io/CSC/' + c.name + '.html';
  const txt = encodeURIComponent(c.title + ' - via @CommodityCSC');
  document.getElementById('twitter-share').href = 'https://twitter.com/intent/tweet?url=' + url + '&text=' + txt;
  document.getElementById('fb-share').href = 'https://www.facebook.com/sharer/sharer.php?u=' + url;

  document.getElementById('prev-btn').style.display = currentIndex > 0 ? 'flex' : 'none';
  document.getElementById('next-btn').style.display = currentIndex < chartsData.length - 1 ? 'flex' : 'none';
  document.title = c.title + ' | CSC';
}

function navigateTo(idx) {
  if (idx < 0 || idx >= chartsData.length) return;
  currentIndex = idx;
  updatePage();
  history.pushState({index: currentIndex}, '', chartsData[currentIndex].name + '.html');
}

const navigatePrev = () => navigateTo(currentIndex - 1);
const navigateNext = () => navigateTo(currentIndex + 1);

document.addEventListener('keydown', e => {
  if (['Space', 'ArrowRight'].includes(e.code) || e.key === 'ArrowRight') { e.preventDefault(); navigateNext(); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); navigatePrev(); }
});

let tsX = 0;
const area = document.getElementById('full-capture-area');
area.addEventListener('touchstart', e => tsX = e.changedTouches[0].screenX);
area.addEventListener('touchend', e => { 
  const dx = e.changedTouches[0].screenX - tsX;
  if (dx < -50) navigateNext(); 
  if (dx > 50) navigatePrev();
});

window.onpopstate = e => { 
  currentIndex = (e.state && typeof e.state.index === 'number') ? e.state.index : Math.max(0, chartsData.findIndex(c => c.name === getName())); 
  updatePage(); 
};

window.onload = updatePage;
const toggleFullScreen = () => !document.fullscreenElement ? document.documentElement.requestFullscreen() : document.exitFullscreen();

function takeScreenshot() {
  const tBox = document.getElementById('screenshot-title-box');
  const ssS = document.getElementById('ss-source-bottom');
  const validSources = (chartsData[currentIndex].sources || []).filter(s => s.text && s.text.trim() !== '');

  tBox.style.display = 'block'; 
  if (ssS) ssS.style.display = validSources.length ? 'block' : 'none';

  html2canvas(document.getElementById('full-capture-area'), { 
    backgroundColor: "#0f172a", 
    scale: 2, 
    useCORS: true,
    logging: false
  }).then(canvas => {
    const link = document.createElement('a'); 
    link.download = chartsData[currentIndex].name + '_CSC.png';
    link.href = canvas.toDataURL('image/png'); 
    link.click();
    tBox.style.display = 'none'; 
    if (ssS) ssS.style.display = 'none';
  });
}
</script></body></html>`;
}

files.forEach((file) => {
  fs.writeFileSync(file.replace('.png', '') + '.html', createPage(file));
});

console.log("🎉 Pagine HTML generate con successo!");