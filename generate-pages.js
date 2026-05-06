const fs = require('fs');
const path = require('path');

const chartsDir = path.join(__dirname, 'charts');
const configPath = path.join(__dirname, 'config.json');

const config = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
  : {};

const files = fs.readdirSync(chartsDir)
  .filter(f => f.toLowerCase().endsWith('.png'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

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

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
  <title>${title} | CSC</title>
  <link rel="icon" type="image/png" href="https://commoditysupercycle.com/assets/logo192-C5BlHOLs.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    * { box-sizing: border-box; }

    body { 
      margin: 0; 
      background: #1E1E1E; 
      font-family: 'Inter', sans-serif; 
      color: #e2e8f0; 
      height: 100dvh; 
      width: 100vw; 
      overflow: hidden;
    }

    #rotate-message { 
      display: none; 
      position: fixed; top: 0; left: 0; 
      width: 100%; height: 100%; 
      background: #1E1E1E; z-index: 999; 
      flex-direction: column; justify-content: center; align-items: center;
    }
    @media (orientation: portrait) { #rotate-message { display: flex; } }

    /* ==================== FLOATING TITLE (MOBILE) ==================== */
    #floating-title {
      position: absolute;
      top: 12px; left: 12px; right: 12px;
      background: rgba(30, 30, 30, 0.95);
      border: 1px solid #444;
      border-radius: 12px;
      padding: 12px 16px;
      z-index: 100;
      box-shadow: 0 4px 15px rgba(0,0,0,0.6);
      touch-action: none;
      user-select: none;
    }
    #floating-title .title {
      font-size: 17px;
      font-weight: 700;
      line-height: 1.3;
      margin: 0;
    }

    .container { width: 100%; height: 100dvh; display: flex; flex-direction: column; }

    .header-row { display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; height: 55px; padding: 8px 10px; position: relative; z-index: 10; }

    .title-group { flex: 1; min-width: 0; padding-left: 8px; padding-right: 70px; }
    .title { font-size: 16px; font-weight: 700; color: #f8fafc; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .actions { position: absolute; right: 8px; top: 8px; z-index: 20; }

    .btn { background: #2a2a2a; border: 1px solid #444; color: #f8fafc; padding: 10px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; text-decoration: none; }
    .btn:hover { background: #383838; }
    .btn svg { width: 24px; height: 24px; fill: currentColor; }

    #full-capture-area { 
      flex-grow: 1; 
      position: relative; 
      overflow: auto; 
      -webkit-overflow-scrolling: touch;
    }

    .chart-container { 
      width: 100%; 
      min-height: 100%; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      padding: 0;
      margin-top: 75px;
    }

    #chart-image { 
      width: 100% !important;
      height: auto !important;
      max-width: 100%;
      object-fit: contain;
      image-rendering: crisp-edges;
    }

    /* ==================== DESKTOP ==================== */
    @media (min-width: 1280px) {
      #floating-title { display: none !important; }
      .header-row { height: auto; min-height: 100px; padding: 90px 12% 20px 12%; }
      .title { font-size: 36px; }
      .chart-container { margin-top: 0; padding: 15px; }
      #chart-image { max-width: 90%; }
    }

    @media (max-width: 1279px) {
      .header-row { display: none !important; }
      .chart-container { margin-top: 75px; padding: 0; }
    }
  </style>
</head>
<body>

  <div id="rotate-message">
    <svg width="50" height="50" viewBox="0 0 24 24" fill="#67e8f9">
      <path d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h2C24 4.96 19.1 0 13 0l-1.65 1.65 1.41 1.41 3.72-3.54zM7.52 21.48C4.25 19.93 1.91 16.76 1.55 13h-2C-.45 19.04 4.45 24 10.55 24l1.65-1.65-1.41-1.41-3.27 3.54zM21 5H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0 1.1-.9-2-2-2zm0 12H3V7h18v10z"/>
    </svg>
    <h2 style="margin-top:20px">Ruota il dispositivo</h2>
  </div>

  <div class="container">
    <!-- Header solo Desktop -->
    <div class="header-row">
      <div class="title-group">
        <div class="title" id="page-title-desktop">${title}</div>
      </div>
      <div class="actions">
        <button class="btn" onclick="toggleFullScreen()">🔍</button>
        <button class="btn" onclick="takeScreenshot()">📸</button>
        <button id="prev-btn" class="btn nav-btn" onclick="navigatePrev()">←</button>
        <button id="next-btn" class="btn nav-btn" onclick="navigateNext()">→</button>
      </div>
    </div>

    <!-- Title box mobile trascinabile -->
    <div id="floating-title">
      <div class="title" id="page-title">${title}</div>
    </div>

    <div id="full-capture-area">
      <div class="chart-container">
        <img id="chart-image" src="charts/${file}">
      </div>
    </div>
  </div>

  <script>
    const chartsData = ${JSON.stringify(chartsData)};

    let currentIndex = Math.max(0, chartsData.findIndex(c => c.name === (window.location.pathname.split('/').pop().replace('.html','') || chartsData[0].name)));

    function updatePage() {
      const c = chartsData[currentIndex];
      document.getElementById('page-title').textContent = c.title;
      if (document.getElementById('page-title-desktop')) document.getElementById('page-title-desktop').textContent = c.title;
      document.getElementById('chart-image').src = 'charts/' + c.file;
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

    // Drag per title box
    function makeDraggable(el) {
      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      el.addEventListener('touchstart', dragStart, { passive: false });
      el.addEventListener('mousedown', dragStart);

      function dragStart(e) {
        pos3 = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        pos4 = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        document.addEventListener('touchmove', dragMove, { passive: false });
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('touchend', dragEnd);
        document.addEventListener('mouseup', dragEnd);
      }

      function dragMove(e) {
        e.preventDefault();
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        pos1 = pos3 - clientX;
        pos2 = pos4 - clientY;
        pos3 = clientX;
        pos4 = clientY;
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
        el.style.right = "auto";
      }

      function dragEnd() {
        document.removeEventListener('touchmove', dragMove);
        document.removeEventListener('mousemove', dragMove);
      }
    }

    window.onload = () => {
      updatePage();
      makeDraggable(document.getElementById('floating-title'));
    };

    const toggleFullScreen = () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    };

    function takeScreenshot() {
      alert("Screenshot in sviluppo - usa la funzione originale se vuoi");
    }
  </script>
</body>
</html>`;
}

// ====================== GENERAZIONE ======================
files.forEach((file) => {
  const htmlContent = createPage(file);
  fs.writeFileSync(file.replace('.png', '.html'), htmlContent);
  console.log(`✅ Generato: ${file.replace('.png', '.html')}`);
});

console.log(`\n🎉 FINITO! ${files.length} pagine HTML regenerate.`);