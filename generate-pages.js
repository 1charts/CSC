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

  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

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
      align-items: flex-start; 
      flex-shrink: 0; 
      height: auto; 
      padding: 15px 10px; 
      position: relative; 
      z-index: 10;
    }

    .title-group { 
      flex: 1; 
      min-width: 0; 
      padding-left: 8px; 
      padding-right: 90px; 
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
      top: 15px; 
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
      align-items: flex-end; 
      min-height: 0; 
      padding: 0 0 10px 0;   /* piccolo padding sotto per non attaccare troppo al bordo */
      margin: 0;
    }

    img { 
      width: 100%; 
      height: auto; 
      max-height: 100%; 
      margin: 0; 
      display: block;
      object-fit: contain; 
      object-position: left bottom; 
      image-rendering: crisp-edges; 
      flex-shrink: 0;           /* impedisce che l'immagine si rimpicciolisca inutilmente */
    }

    #screenshot-title-box { 
      display: none; 
      margin-bottom: 20px; 
      text-align: left; 
      padding: 0 10px; 
    }

    /* ====================== DESKTOP ====================== */
    @media (min-width: 1280px) {
      .header-row { 
        height: auto;            
        min-height: 100px;        
        padding-top: 90px;      
        padding-left: 12%;      
        padding-right: 12%;      
        margin-bottom: 0px;    
        position: static;
        z-index: auto;
        align-items: center;
      }

      .title { font-size: 36px; }
      .subtitle { font-size: 24px; }

      .actions {
        position: static !important;
        display: flex !important;
        flex-direction: row !important;
        gap: 12px !important;
        align-items: center !important;
      }

      #full-capture-area { padding: 15px; }

      .chart-container {
        justify-content: center; 
        align-items: flex-start;
        padding-bottom: 60px;
      }

      .chart-container img {
        max-width: 90%;
        object-position: center top; 
      }
    }

    @media (max-width: 1279px) and (hover: none) and (pointer: coarse) {
      #prev-btn, #next-btn, .actions > div { 
        display: none !important; 
      }
    }
  </style>
</head>
<body>
  <!-- resto del body identico a quello che avevi tu -->
  <div id="rotate-message">
    <svg width="50" height="50" viewBox="0 0 24 24" fill="#67e8f9">
      <path d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h2C24 4.96 19.1 0 13 0l-1.65 1.65 1.41 1.41 3.72-3.54zM7.52 21.48C4.25 19.93 1.91 16.76 1.55 13h-2C-.45 19.04 4.45 24 10.55 24l1.65-1.65-1.41-1.41-3.27 3.54zM21 5H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H3V7h18v10z"/>
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
        <!-- tutti i bottoni che avevi tu (fullscreen, screenshot, share, nav) -->
        <!-- ... copia qui il resto del tuo header-row ... -->
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
      <div class="chart-container">
        <img src="charts/${file}">
      </div>
    </div>
  </div>

  <!-- il tuo script JS resta identico -->
  <script>
    /* copia qui tutto il tuo <script> originale (updatePage, navigation, touch, screenshot, ecc.) */
  </script>
</body>
</html>`;
}