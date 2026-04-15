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

/* Box screenshot: nascosto di default */
#screenshot-title-box { display: none; margin-bottom: 15px; text-align: left; }
</style>
</head>

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
      <span id="source-inline" class="source-inline"></span>
    </div>
    
    <div class="actions">
      <button class="btn" onclick="toggleFullScreen()" title="Full Screen"><svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg></button>
      <button class="btn" onclick="takeScreenshot()" title="Screenshot"><svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></button>
      <a id="twitter-share" class="btn" href="https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareTextX}" target="_blank"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg></a>
      <a id="fb-share" class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${currentUrl}" target="_blank"><svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
      
      <div style="width: 1px; height: 20px; background: #334155; margin: 0 4px;"></div>

      <button id="prev-btn" class="btn nav-btn" onclick="navigatePrev()">
        <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button id="next-btn" class="btn nav-btn" onclick="navigateNext()">
        <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  </div>

  <div id="full-capture-area">
    <div id="screenshot-title-box">
        <div id="ss-title" style="font-size:24px; font-weight:bold; color:#f8fafc;">${title}</div>
        <div style="font-size:14px; color:#67e8f9;">commoditysupercycle.com</div>
        <div id="ss-source-bottom" style="display:none; color:#94a3b8; font-size:12px; margin-top:10px; text-align:left;">Source: <span id="ss-source-text"></span></div>
    </div>
    <div class="chart-container">
      <img src="charts/${file}">
    </div>
  </div>
</div>

<script>
// === DATI DI TUTTI I GRAFICI (embeddati in OGNI pagina) ===
const chartsData = ${JSON.stringify(chartsData)};

function getCurrentName() {
  const path = window.location.pathname.split('/').pop().replace('.html', '');
  return path || chartsData[0].name;
}

let currentIndex = chartsData.findIndex(c => c.name === getCurrentName());
if (currentIndex === -1) currentIndex = 0;

function updatePage() {
  const chart = chartsData[currentIndex];

  // Aggiorna titolo e source (header) - SOLO questa parte è stata corretta
  document.getElementById('page-title').textContent = chart.title;
  const sourceInlineEl = document.getElementById('source-inline');
  if (chart.sourceText) {
    sourceInlineEl.innerHTML = ` — Source: <a href="${chart.sourceLink}" target="_blank">${chart.sourceText}</a>`;
  } else {
    sourceInlineEl.innerHTML = '';
  }

  // Aggiorna immagine
  document.querySelector('img').src = `charts/${chart.file}`;

  // Aggiorna elementi screenshot
  document.getElementById('ss-title').textContent = chart.title;
  const ssSourceTextEl = document.getElementById('ss-source-text');
  if (ssSourceTextEl) ssSourceTextEl.textContent = chart.sourceText || '';

  // Aggiorna link condivisione
  const currentUrl = `https://1charts.github.io/CSC/${chart.name}.html`;
  const shareTextX = encodeURIComponent(`${chart.title} - via @CommodityCSC`);
  document.getElementById('twitter-share').href = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareTextX}`;
  document.getElementById('fb-share').href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;

  // Visibilità pulsanti nav
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  if (prevBtn) prevBtn.style.display = currentIndex > 0 ? 'flex' : 'none';
  if (nextBtn) nextBtn.style.display = currentIndex < chartsData.length - 1 ? 'flex' : 'none';

  // Aggiorna <title> della pagina
  document.title = `${chart.title} | CSC`;
}

function navigateTo(newIndex) {
  if (newIndex < 0 || newIndex >= chartsData.length) return;
  currentIndex = newIndex;
  updatePage();
  const chart = chartsData[currentIndex];
  const newUrl = `${chart.name}.html`;
  history.pushState({index: currentIndex}, '', newUrl);
}

function navigatePrev() {
  navigateTo(currentIndex - 1);
}

function navigateNext() {
  navigateTo(currentIndex + 1);
}

// Tastiera (Space / frecce) → navigazione SENZA uscire dallo schermo intero
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === 'ArrowRight') {
        e.preventDefault();
        navigateNext();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigatePrev();
    }
});

// === SWIPE MOBILE (nuova funzionalità richiesta) ===
let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
  if (touchEndX < touchStartX - 50) navigateNext();      // swipe sinistra → prossimo
  if (touchEndX > touchStartX + 50) navigatePrev();      // swipe destra → precedente
}

const captureArea = document.getElementById('full-capture-area');
captureArea.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});
captureArea.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

// Gestione back/forward del browser
window.addEventListener('popstate', (event) => {
    if (event.state && typeof event.state.index === 'number') {
        currentIndex = event.state.index;
    } else {
        currentIndex = chartsData.findIndex(c => c.name === getCurrentName());
        if (currentIndex === -1) currentIndex = 0;
    }
    updatePage();
});

// Al caricamento
window.addEventListener('load', () => {
    updatePage();
});

function toggleFullScreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
}

function takeScreenshot() {
    const area = document.getElementById('full-capture-area');
    const titleBox = document.getElementById('screenshot-title-box');
    const ssSource = document.getElementById('ss-source-bottom');
    
    titleBox.style.display = 'block';
    if (ssSource) ssSource.style.display = chartsData[currentIndex].sourceText ? 'block' : 'none';

    html2canvas(area, { backgroundColor: "#0f172a", scale: 2, useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${chartsData[currentIndex].name}_CSC.png`;
        link.href = canvas.toDataURL();
        link.click();
        titleBox.style.display = 'none';
        if (ssSource) ssSource.style.display = 'none';
    });
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