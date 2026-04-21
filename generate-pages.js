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

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${title} | CSC</title>
  <link rel="icon" type="image/png" href="${logoUrl}">

  <style>
    * { box-sizing: border-box; }

    body { 
      margin: 0; 
      background: #1E1E1E; 
      font-family: 'Segoe UI', Arial, sans-serif; 
      color: #e2e8f0; 
      overflow: hidden; 
      height: 100dvh; 
      width: 100vw; 
    }

    #rotate-message { 
      display: none; 
      position: fixed; 
      top: 0; left: 0; 
      width: 100%; height: 100%; 
      background: #1E1E1E; 
      z-index: 999; 
      flex-direction: column; 
      justify-content: center; 
      align-items: center; 
      text-align: center; 
    }

    @media (orientation: portrait) { 
      #rotate-message { display: flex; } 
    }

    .container { 
      width: 100%; 
      height: 100dvh; 
      display: flex; 
      flex-direction: column; 
    }

    .header-row { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      flex-shrink: 0; 
      height: 55px; 
      padding: 8px 10px; 
      position: relative; 
      z-index: 10;
    }

    .title-group { 
      flex: 1; 
      min-width: 0; 
      padding-left: 8px; 
      padding-right: 70px; 
    }

    .title { 
      font-size: 16px; 
      font-weight: bold; 
      color: #f8fafc; 
      margin: 0; 
      white-space: nowrap; 
      overflow: hidden; 
      text-overflow: ellipsis; 
    }

    .subtitle { 
      font-size: 11px; 
      color: #67e8f9; 
      text-decoration: none; 
      font-weight: bold; 
    }

    .sources { 
      font-size: 10px; 
      color: #94a3b8; 
    }

    .sources a { 
      color: #67e8f9; 
      text-decoration: none; 
    }

    .actions { 
      position: absolute !important;
      right: 8px;
      top: 8px;
      flex-direction: column; 
      gap: 6px; 
      align-items: flex-end;
      z-index: 20;
    }

    .btn { 
      background: #2a2a2a; 
      border: 1px solid #444; 
      color: #f8fafc; 
      padding: 10px;           
      border-radius: 8px;      
      cursor: pointer; 
      display: flex; 
      align-items: center; 
      text-decoration: none; 
    }

    .btn:hover { background: #383838; }

    .btn svg { 
      width: 24px;             
      height: 24px;            
      fill: currentColor; 
    }

    .btn.nav-btn { 
      color: #67e8f9; 
      padding: 7px 11px;       
    }

    .btn.nav-btn svg { 
      width: 28px;             
      height: 28px;            
      stroke: currentColor; 
      stroke-width: 2.5; 
      fill: none; 
    }

    #full-capture-area { 
      flex-grow: 1; 
      display: flex; 
      flex-direction: column; 
      position: relative; 
      overflow: hidden; 
      background: #1E1E1E; 
      padding: 0; 
      margin: 0;
    }

    .chart-container { 
      width: 100%; 
      flex-grow: 1; 
      display: flex; 
      justify-content: flex-start; 
      align-items: flex-start; 
      min-height: 0; 
      padding: 0;
    }

    img { 
      width: 100%; 
      height: auto; 
      max-height: 100%; 
      margin: 0; 
      display: block;
      object-fit: contain; 
      image-rendering: crisp-edges; 
    }

    @media (min-width: 1280px) {
      .btn { padding: 6px; }
      .btn svg { width: 18px; height: 18px; }
      .btn.nav-btn { padding: 4px 8px; }
      .btn.nav-btn svg { width: 22px; height: 22px; }

      .header-row { 
        height: auto;           
        min-height: 100px;       
        padding-top: 90px;      
        padding-left: 12%;      
        padding-right: 12%;     
        margin-bottom: 0px;    
        position: static;
        z-index: auto;
      }

      .title { 
        font-size: 36px;           
        font-weight: 700;          
        color: #f8fafc;            
        margin: 0 0 8px 0;
        line-height: 1.1;
      }

      .subtitle { 
        font-size: 24px;           
        color: #67e8f9; 
        font-weight: 600;
        display: block;
        margin-bottom: 6px;
      }

      .sources {
        font-size: 15px;         
        color: #94a3b8;
        display: block;
      }

      .title-group { 
        padding-left: 0; 
        padding-right: 0;
      }

      .actions {
        position: static !important;
        display: flex !important;
        flex-direction: row !important;
        gap: 12px !important;
        align-items: center !important;
      }

      #full-capture-area {
        padding: 15px;
      }

      .chart-container {
        justify-content: center;
        align-items: flex-start;
        padding-bottom: 60px;
      }

      .chart-container img {
        max-width: 90%;
        max-height: 100%;
      }
    }

    @media (max-width: 1279px) and (hover: none) and (pointer: coarse) {
      #prev-btn, #next-btn, .actions > div { 
        display: none !important; 
      }
    }

    @media (max-width: 1279px) {
      #full-capture-area {
        padding-left: 0 !important;
      }
      .chart-container {
        padding-left: 0 !important;
        justify-content: flex-start;
      }
      img {
        margin-left: 0 !important;
        width: 100% !important;
      }
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
    <div class="header-row">
      <div class="title-group">
        <div class="title" id="page-title">${title}</div>
        <a class="subtitle" href="https://commoditysupercycle.com/" target="_blank">commoditysupercycle.com</a>
        <span id="source-inline" class="sources"></span>
      </div>

      <div class="actions">
        <button class="btn" onclick="toggleFullScreen()">
          <svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
        </button>
        <button class="btn" onclick="takeScreenshot()">
          <svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9 2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
        </button>
        <a id="twitter-share" class="btn" href="" target="_blank">
          <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg>
        </a>
        <a id="fb-share" class="btn" href="" target="_blank">
          <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>

        <div style="width:1px; height:20px; background:#444; margin:0 4px;"></div>

        <button id="prev-btn" class="btn nav-btn" onclick="navigatePrev()">
          <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button id="next-btn" class="btn nav-btn" onclick="navigateNext()">
          <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </div>

    <div id="full-capture-area">
      <div class="chart-container">
        <img id="chart-image" src="charts/${file}">
      </div>
    </div>
  </div>

  <script>
    const chartsData = ${JSON.stringify(chartsData)};

    const getName = () => window.location.pathname.split('/').pop().replace('.html', '') || chartsData[0].name;
    let currentIndex = Math.max(0, chartsData.findIndex(c => c.name === getName()));

    function updatePage() {
      const c = chartsData[currentIndex];
      const validSources = (c.sources || []).filter(s => s.text && s.text.trim() !== '');

      document.getElementById('page-title').textContent = c.title;

      const sInline = document.getElementById('source-inline');
      sInline.innerHTML = validSources.length 
        ? '<span class="source-label">Sources:</span> ' + 
          validSources.map(s => '<a href="' + s.link + '" target="_blank">' + s.text + '</a>').join(' · ')
        : '';

      document.getElementById('chart-image').src = 'charts/' + c.file;

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
      if (e.key === 'ArrowRight' || e.code === 'Space') {
        e.preventDefault();
        navigateNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigatePrev();
      }
    });

    let tsX = 0;
    const area = document.getElementById('full-capture-area');
    area.addEventListener('touchstart', e => {
      if (e.touches.length === 1) tsX = e.touches[0].screenX;
    }, { passive: true });

    area.addEventListener('touchend', e => {
      if (e.changedTouches.length === 1) {
        const dx = e.changedTouches[0].screenX - tsX;
        if (Math.abs(dx) > 60) {
          if (dx < -60) navigateNext();
          else if (dx > 60) navigatePrev();
        }
      }
    });

    window.onpopstate = () => {
      currentIndex = Math.max(0, chartsData.findIndex(c => c.name === getName()));
      updatePage();
    };

    window.onload = updatePage;

    const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    };

    /* ====================== SCREENSHOT CON CANVAS NATIVO ====================== */
    function takeScreenshot() {
      const c = chartsData[currentIndex];
      const validSources = (c.sources || []).filter(s => s.text && s.text.trim() !== '');

      const img = document.getElementById('chart-image');
      
      const preload = new Image();
      preload.crossOrigin = "anonymous";
      preload.src = img.src;

      preload.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const WIDTH = 1450;
        const PADDING_X = 60;
        const PADDING_TOP = 80;
        const PADDING_BOTTOM = 100;
        const TITLE_HEIGHT = 110;
        const SUBTITLE_HEIGHT = 50;
        const SOURCES_HEIGHT = validSources.length ? 60 : 0;

        canvas.width = WIDTH;
        canvas.height = PADDING_TOP + TITLE_HEIGHT + SUBTITLE_HEIGHT + SOURCES_HEIGHT + 
                        preload.height * (WIDTH - 2 * PADDING_X) / preload.width + PADDING_BOTTOM;

        // Sfondo
        ctx.fillStyle = '#1E1E1E';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Titolo
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 42px Segoe UI, Arial';
        ctx.textAlign = 'left';
        ctx.fillText(c.title, PADDING_X, PADDING_TOP + 55);

        // Subtitle
        ctx.fillStyle = '#67e8f9';
        ctx.font = '600 32px Segoe UI, Arial';
        ctx.fillText('commoditysupercycle.com', PADDING_X, PADDING_TOP + TITLE_HEIGHT + 35);

        // Sources - subito sotto il sottotitolo
        if (validSources.length) {
          ctx.fillStyle = '#f8fafc';
          ctx.font = '500 22px Segoe UI, Arial';
          ctx.fillText('Sources:', PADDING_X, PADDING_TOP + TITLE_HEIGHT + SUBTITLE_HEIGHT + 35);

          ctx.fillStyle = '#94a3b8';
          ctx.font = '500 22px Segoe UI, Arial';
          const sourcesText = validSources.map(s => s.text).join(' · ');
          ctx.fillText(sourcesText, PADDING_X + 100, PADDING_TOP + TITLE_HEIGHT + SUBTITLE_HEIGHT + 35);
        }

        // Immagine del chart
        const imgX = PADDING_X;
        const imgY = PADDING_TOP + TITLE_HEIGHT + SUBTITLE_HEIGHT + SOURCES_HEIGHT;
        const imgW = WIDTH - 2 * PADDING_X;
        const imgH = preload.height * (imgW / preload.width);
        
        ctx.drawImage(preload, imgX, imgY, imgW, imgH);

        // Download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = c.name + '_CSC.png';
        link.href = dataUrl;
        link.click();

        console.log('✅ Screenshot generato con successo!');
      };

      if (preload.complete) preload.onload();
    }
  </script>
</body>
</html>`;
}

// Genera le pagine HTML
files.forEach((file) => {
  const htmlContent = createPage(file);
  fs.writeFileSync(file.replace('.png', '') + '.html', htmlContent);
});

console.log("🎉 Pagine HTML regenerate correttamente!");