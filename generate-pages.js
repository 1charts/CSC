1  | const fs = require('fs'), path = require('path');
2  | const chartsDir = path.join(__dirname, 'charts'), configPath = path.join(__dirname, 'config.json'), config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {};
3  | const files = fs.readdirSync(chartsDir).filter(f => f.endsWith('.png')).sort();
4  | 
5  | const chartsData = files.map(file => {
6 |   const name = file.replace('.png', ''), key = name.padStart(2, '0'), cfg = config[key] || {};
7  |   return { name, file, title: cfg.title || `Chart ${name}`, sources: cfg.sources || [] };
8  | });
9  | 
10 | function createPage(file, index) {
11 |   const name = file.replace('.png', ''), key = name.padStart(2, '0'), cfg = config[key] || {}, title = cfg.title || `Chart ${name}`, logoUrl = "https://commoditysupercycle.com/assets/logo192-C5BlHOLs.png";
12 |   const currentUrl = `https://1charts.github.io/CSC/${name}.html`, shareTextX = encodeURIComponent(`${title} - via @CommodityCSC`), sourceHtmlInline = `<span id="source-inline" class="source-inline"></span>`;
13 |   
14 |   return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
15 | <title>${title} | CSC</title><link rel="icon" type="image/png" href="${logoUrl}">
16 | <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
17 | <style>
18 |   * { box-sizing: border-box; }
19 |   body { margin:0; background:#0f172a; font-family: 'Segoe UI', Arial, sans-serif; color:#e2e8f0; overflow: hidden; height: 100vh; width: 100vw; }
20 |   #rotate-message { display: none; position: fixed; top:0; left:0; width:100%; height:100%; background:#0f172a; z-index: 999; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
21 |   @media (orientation: portrait) { #rotate-message { display: flex; } }
22 |   .container { width: 100%; height: 100vh; display: flex; flex-direction: column; padding: 5px 15px; }
23 |   .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; flex-shrink: 0; height: 50px; }
24 |   .title-group { flex: 1; min-width: 0; }
25 |   .title { font-size: 18px; font-weight: bold; color:#f8fafc; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
26 |   .subtitle { font-size: 12px; color:#67e8f9; text-decoration: none; }
27 |   .source-inline { font-size: 11px; color: #94a3b8; font-weight: normal; }
28 |   .source-inline a { color: #67e8f9; text-decoration: none; }
29 |   .actions { display: flex; gap: 6px; align-items: center; }
30 |   .btn { background: #1e293b; border: 1px solid #334155; color: #f8fafc; padding: 6px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; text-decoration: none; }
31 |   .btn:hover { background: #334155; }
32 |   .btn svg { width: 18px; height: 18px; fill: currentColor; }
33 |   .btn.nav-btn { color: #67e8f9; padding: 4px 8px; }
34 |   .btn.nav-btn svg { width: 22px; height: 22px; stroke: currentColor; stroke-width: 2.5; fill: none; }
35 |   #full-capture-area { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden; background: #0f172a; padding: 10px; }
36 |   .chart-container { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }
37 |   img { max-width: 100%; max-height: 100%; object-fit: contain; }
38 |   #screenshot-title-box { display: none; margin-bottom: 15px; text-align: left; }
39 | </style></head>
40 | <body>
41 | <div id="rotate-message">
42 |   <svg width="50" height="50" viewBox="0 0 24 24" fill="#67e8f9"><path d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h2C24 4.96 19.1 0 13 0l-1.65 1.65 1.41 1.41 3.72-3.54zM7.52 21.48C4.25 19.93 1.91 16.76 1.55 13h-2C-.45 19.04 4.45 24 10.55 24l1.65-1.65-1.41-1.41-3.27 3.54zM21 5H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H3V7h18v10z"/></svg>
43 |   <h2 style="margin-top:20px">Ruota il dispositivo</h2>
44 | </div>
45 | <div class="container">
46 |   <div class="header-row">
47 |     <div class="title-group">
48 |       <div class="title" id="page-title">${title}</div>
49 |       <a class="subtitle" href="https://commoditysupercycle.com/" target="_blank">commoditysupercycle.com</a>
50 |       ${sourceHtmlInline}
51 |     </div>
52 |     <div class="actions">
53 |       <button class="btn" onclick="toggleFullScreen()"><svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg></button>
54 |       <button class="btn" onclick="takeScreenshot()"><svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></button>
55 |       <a id="twitter-share" class="btn" href="" target="_blank"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg></a>
56 |       <a id="fb-share" class="btn" href="" target="_blank"><svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
57 |       <div style="width:1px; height:20px; background:#334155; margin:0 4px;"></div>
58 |       <button id="prev-btn" class="btn nav-btn" onclick="navigatePrev()"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
59 |       <button id="next-btn" class="btn nav-btn" onclick="navigateNext()"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>
60 |     </div>
61 |   </div>
62 |   <div id="full-capture-area">
63 |     <div id="screenshot-title-box">
64 |       <div id="ss-title" style="font-size:24px; font-weight:bold; color:#f8fafc;">${title}</div>
65 |       <div style="font-size:14px; color:#67e8f9;">commoditysupercycle.com</div>
66 |       <div id="ss-source-bottom" style="display:none; color:#94a3b8; font-size:12px; margin-top:10px;"><span id="ss-source-text"></span></div>
67 |     </div>
68 |     <div class="chart-container"><img src="charts/${file}"></div>
69 |   </div>
70 | </div>
71 | <script>
72 | const chartsData = ${JSON.stringify(chartsData)};
73 | const getName = () => window.location.pathname.split('/').pop().replace('.html', '') || chartsData[0].name;
74 | let currentIndex = Math.max(0, chartsData.findIndex(c => c.name === getName()));
75 | 
76 | function updatePage() {
77 |   const c = chartsData[currentIndex], sInline = document.getElementById('source-inline'), ssEl = document.getElementById('ss-source-text');
78 |   const validSources = (c.sources || []).filter(s => s.text && s.text.trim() !== '');
79 |   document.getElementById('page-title').textContent = c.title;
80 |   sInline.innerHTML = validSources.length ? ` — ` + validSources.map(s => `<a href="${s.link}" target="_blank">${s.text}</a>`).join(' · ') : '';
81 |   document.querySelector('img').src = `charts/${c.file}`;
82 |   document.getElementById('ss-title').textContent = c.title;
83 |   if (ssEl) ssEl.textContent = validSources.map(s => s.text).join(' · ');
84 |   const url = `https://1charts.github.io/CSC/${c.name}.html`, txt = encodeURIComponent(`${c.title} - via @CommodityCSC`);
85 |   document.getElementById('twitter-share').href = `https://twitter.com/intent/tweet?url=${url}&text=${txt}`;
86 |   document.getElementById('fb-share').href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
87 |   document.getElementById('prev-btn').style.display = currentIndex > 0 ? 'flex' : 'none';
88  |   document.getElementById('next-btn').style.display = currentIndex < chartsData.length - 1 ? 'flex' : 'none';
89  |   document.title = `${c.title} | CSC`;
90  | }
91  | 
92  | function navigateTo(idx) {
93  |   if (idx < 0 || idx >= chartsData.length) return;
94  |   currentIndex = idx; updatePage();
95  |   history.pushState({index: currentIndex}, '', `${chartsData[currentIndex].name}.html`);
96  | }
97  | 
98  | const navigatePrev = () => navigateTo(currentIndex - 1), navigateNext = () => navigateTo(currentIndex + 1);
99  | 
100 | document.addEventListener('keydown', e => {
101 |   if (['Space', 'ArrowRight'].includes(e.code) || e.key === 'ArrowRight') { e.preventDefault(); navigateNext(); }
102 |   if (e.key === 'ArrowLeft') { e.preventDefault(); navigatePrev(); }
103 | });
104 | 
105 | let tsX = 0;
106 | const area = document.getElementById('full-capture-area');
107 | area.addEventListener('touchstart', e => tsX = e.changedTouches[0].screenX);
108 | area.addEventListener('touchend', e => { 
109 |   const dx = e.changedTouches[0].screenX - tsX;
110 |   if (dx < -50) navigateNext(); if (dx > 50) navigatePrev();
111 | });
112 | 
113 | window.onpopstate = e => { currentIndex = (e.state && typeof e.state.index === 'number') ? e.state.index : Math.max(0, chartsData.findIndex(c => c.name === getName())); updatePage(); };
114 | window.onload = updatePage;
115 | const toggleFullScreen = () => !document.fullscreenElement ? document.documentElement.requestFullscreen() : document.exitFullscreen();
116 | 
117 | function takeScreenshot() {
118 |   const tBox = document.getElementById('screenshot-title-box'), ssS = document.getElementById('ss-source-bottom');
119 |   const validSources = (chartsData[currentIndex].sources || []).filter(s => s.text && s.text.trim() !== '');
120 |   tBox.style.display = 'block'; if (ssS) ssS.style.display = validSources.length ? 'block' : 'none';
121 |   html2canvas(area, { backgroundColor: "#0f172a", scale: 2, useCORS: true }).then(canvas => {
122 |     const link = document.createElement('a'); link.download = `${chartsData[currentIndex].name}_CSC.png`;
123 |     link.href = canvas.toDataURL(); link.click();
124 |     tBox.style.display = 'none'; if (ssS) ssS.style.display = 'none';
125 |   });
126 | }
127 | </script></body></html>\`;
128 | }
129 | 
130 | files.forEach((file, i) => {
131 |   fs.writeFileSync(`${file.replace('.png','')}.html`, createPage(file, i));
132 | });
133 | console.log("🎉 Pagine HTML generate con successo!");



