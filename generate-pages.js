1  | const fs = require('fs'), path = require('path');
2  | const chartsDir = path.join(__dirname, 'charts'), configPath = path.join(__dirname, 'config.json'), config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {};
3  | const files = fs.readdirSync(chartsDir)
4  |   .filter(f => f.endsWith('.png'))
5  |   .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
6  | 
7  | const chartsData = files.map(file => {
8  |   const name = path.basename(file, '.png');
9  |   const key = name; // "01", "02", ... "54"
10 |   const cfg = config[key] || {};
11 |   return {
12 |     name,
13 |     file,
14 |     title: cfg.title || `Chart ${name}`,
15 |     sources: Array.isArray(cfg.sources) ? cfg.sources : []
16 |   };
17 | });
18 | 
19 | function createPage(file, index) {
20 |   const name = path.basename(file, '.png');
21 |   const key = name; // "01" - "54"
22 |   const cfg = config[key] || {};
23 |   const title = cfg.title || `Chart ${name}`;
24 |   const logoUrl = "https://commoditysupercycle.com/assets/logo192-C5BlHOLs.png";
25 |   const currentUrl = `https://1charts.github.io/CSC/${name}.html`;
26 |   const shareTextX = encodeURIComponent(`${title} - via @CommodityCSC`);
27 |   const sourceHtmlInline = `<span id="source-inline" class="source-inline"></span>`;
28 | 
29 |   return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
30 | <title>${title} | CSC</title><link rel="icon" type="image/png" href="${logoUrl}">
31 | <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
32 | <style>
33 |   * { box-sizing: border-box; }
34 |   body { margin:0; background:#0f172a; font-family: 'Segoe UI', Arial, sans-serif; color:#e2e8f0; overflow: hidden; height: 100vh; width: 100vw; }
35 |   #rotate-message { display: none; position: fixed; top:0; left:0; width:100%; height:100%; background:#0f172a; z-index: 999; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
36 |   @media (orientation: portrait) { #rotate-message { display: flex; } }
37 |   .container { width: 100%; height: 100vh; display: flex; flex-direction: column; padding: 5px 15px; }
38 |   .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; flex-shrink: 0; height: 50px; }
39 |   .title-group { flex: 1; min-width: 0; }
40 |   .title { font-size: 18px; font-weight: bold; color:#f8fafc; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
41 |   .subtitle { font-size: 12px; color:#67e8f9; text-decoration: none; }
42 |   .source-inline { font-size: 11px; color: #94a3b8; font-weight: normal; }
43 |   .source-inline a { color: #67e8f9; text-decoration: none; }
44 |   .actions { display: flex; gap: 6px; align-items: center; }
45 |   .btn { background: #1e293b; border: 1px solid #334155; color: #f8fafc; padding: 6px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; text-decoration: none; }
46 |   .btn:hover { background: #334155; }
47 |   .btn svg { width: 18px; height: 18px; fill: currentColor; }
48 |   .btn.nav-btn { color: #67e8f9; padding: 4px 8px; }
49 |   .btn.nav-btn svg { width: 22px; height: 22px; stroke: currentColor; stroke-width: 2.5; fill: none; }
50 |   #full-capture-area { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden; background: #0f172a; padding: 10px; }
51 |   .chart-container { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }
52 |   img { max-width: 100%; max-height: 100%; object-fit: contain; }
53 |   #screenshot-title-box { display: none; margin-bottom: 15px; text-align: left; }
54 | </style></head>
55 | <body>
56 | <div id="rotate-message">
57 |   <svg width="50" height="50" viewBox="0 0 24 24" fill="#67e8f9"><path d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h2C24 4.96 19.1 0 13 0l-1.65 1.65 1.41 1.41 3.72-3.54zM7.52 21.48C4.25 19.93 1.91 16.76 1.55 13h-2C-.45 19.04 4.45 24 10.55 24l1.65-1.65-1.41-1.41-3.27 3.54zM21 5H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H3V7h18v10z"/></svg>
58 |   <h2 style="margin-top:20px">Ruota il dispositivo</h2>
59 | </div>
60 | <div class="container">
61 |   <div class="header-row">
62 |     <div class="title-group">
63 |       <div class="title" id="page-title">${title}</div>
64 |       <a class="subtitle" href="https://commoditysupercycle.com/" target="_blank">commoditysupercycle.com</a>
65 |       ${sourceHtmlInline}
66 |       <button class="btn" onclick="toggleFullScreen()"><svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg></button>
67 |       <button class="btn" onclick="takeScreenshot()"><svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></button>
68 |       <a id="twitter-share" class="btn" href="" target="_blank"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg></a>
69 |       <a id="fb-share" class="btn" href="" target="_blank"><svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
70 |       <div style="width:1px; height:20px; background:#334155; margin:0 4px;"></div>
71 |       <button id="prev-btn" class="btn nav-btn" onclick="navigatePrev()"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
72 |       <button id="next-btn" class="btn nav-btn" onclick="navigateNext()"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>
73 |     </div>
74 |   </div>
75 |   <div id="full-capture-area">
76 |     <div id="screenshot-title-box">
77 |       <div id="ss-title" style="font-size:24px; font-weight:bold; color:#f8fafc;">${title}</div>
78 |       <div style="font-size:14px; color:#67e8f9;">commoditysupercycle.com</div>
79 |       <div id="ss-source-bottom" style="display:none; color:#94a3b8; font-size:12px; margin-top:10px;"><span id="ss-source-text"></span></div>
80 |     </div>
81 |     <div class="chart-container"><img src="charts/${file}"></div>
82 |   </div>
83 | </div>
84 | <script>
85 | const chartsData = ${JSON.stringify(chartsData)};
86 | const getName = () => window.location.pathname.split('/').pop().replace('.html', '') || chartsData[0].name;
87 | let currentIndex = Math.max(0, chartsData.findIndex(c => c.name === getName()));
88 | 
89 | function updatePage() {
90 |   const c = chartsData[currentIndex], sInline = document.getElementById('source-inline'), ssEl = document.getElementById('ss-source-text');
91 |   const validSources = (c.sources || []).filter(s => s.text && s.text.trim() !== '');
92 |   document.getElementById('page-title').textContent = c.title;
93 |   sInline.innerHTML = validSources.length ? ` — ` + validSources.map(s => `<a href="${s.link}" target="_blank">${s.text}</a>`).join(' · ') : '';
94 |   document.querySelector('img').src = `charts/${c.file}`;
95 |   document.getElementById('ss-title').textContent = c.title;
96 |   if (ssEl) ssEl.innerHTML = validSources.length ? 'Source: ' + validSources.map(s => s.text).join(' · ') : '';
97 |   const url = `https://1charts.github.io/CSC/\${c.name}.html`, txt = encodeURIComponent(`\${c.title} - via @CommodityCSC`);
98 |   document.getElementById('twitter-share').href = `https://twitter.com/intent/tweet?url=\${url}&text=\${txt}`;
99 |   document.getElementById('fb-share').href = `https://www.facebook.com/sharer/sharer.php?u=\${url}`;
100 |   document.getElementById('prev-btn').style.display = currentIndex > 0 ? 'flex' : 'none';
101 |   document.getElementById('next-btn').style.display = currentIndex < chartsData.length - 1 ? 'flex' : 'none';
102 |   document.title = `\${c.title} | CSC`;
103 | }
104 | 
105 | function navigateTo(idx) {
106 |   if (idx < 0 || idx >= chartsData.length) return;
107 |   currentIndex = idx; updatePage();
108 |   history.pushState({index: currentIndex}, '', `\${chartsData[currentIndex].name}.html`);
109 | }
110 | 
111 | const navigatePrev = () => navigateTo(currentIndex - 1), navigateNext = () => navigateTo(currentIndex + 1);
112 | 
113 | document.addEventListener('keydown', e => {
114 |   if (['Space', 'ArrowRight'].includes(e.code) || e.key === 'ArrowRight') { e.preventDefault(); navigateNext(); }
115 |   if (e.key === 'ArrowLeft') { e.preventDefault(); navigatePrev(); }
116 | });
117 | 
118 | let tsX = 0;
119 | const area = document.getElementById('full-capture-area');
120 | area.addEventListener('touchstart', e => tsX = e.changedTouches[0].screenX);
121 | area.addEventListener('touchend', e => { 
122 |   const dx = e.changedTouches[0].screenX - tsX;
123 |   if (dx < -50) navigateNext(); if (dx > 50) navigatePrev();
124 | });
125 | 
126 | window.onpopstate = e => { 
127 |   currentIndex = (e.state && typeof e.state.index === 'number') ? e.state.index : Math.max(0, chartsData.findIndex(c => c.name === getName())); 
128 |   updatePage(); 
129 | };
130 | window.onload = updatePage;
131 | const toggleFullScreen = () => !document.fullscreenElement ? document.documentElement.requestFullscreen() : document.exitFullscreen();
132 | 
133 | function takeScreenshot() {
134 |   const tBox = document.getElementById('screenshot-title-box'), ssS = document.getElementById('ss-source-bottom');
135 |   const validSources = (chartsData[currentIndex].sources || []).filter(s => s.text && s.text.trim() !== '');
136 |   tBox.style.display = 'block'; if (ssS) ssS.style.display = validSources.length ? 'block' : 'none';
137 |   html2canvas(area, { backgroundColor: "#0f172a", scale: 2, useCORS: true }).then(canvas => {
138 |     const link = document.createElement('a'); link.download = `${chartsData[currentIndex].name}_CSC.png`;
139 |     link.href = canvas.toDataURL(); link.click();
140 |     tBox.style.display = 'none'; if (ssS) ssS.style.display = 'none';
141 |   });
142 | }
143 | </script></body></html>\`;
144 | }
145 | 
146 | files.forEach((file, i) => {
147 |   fs.writeFileSync(`${file.replace('.png','')}.html`, createPage(file, i));
148 | });
149 | console.log("🎉 Pagine HTML generate con successo!");
