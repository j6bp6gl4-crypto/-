/* ============================================================== */
/* ==== 【模組 B：核心引擎 - 主大腦】(真・極致包圍腰帶 + 切西瓜分流) ==== */
/* ============================================================== */

const DB_KEY = 'DashboardDB_V62_Final'; 
window.dataDB = JSON.parse(localStorage.getItem(DB_KEY));
window.isNegativeMode = false; // 🪄 魔法反向開關

if (!window.dataDB) { window.dataDB = JSON.parse(JSON.stringify(defaultDB)); }

// 🎨 全站核心 CSS 注入
if (!document.getElementById('pickTooltipStyle')) {
    const style = document.createElement('style'); style.id = 'pickTooltipStyle';
    style.innerHTML = `
        .pick-tooltip-container { position: relative; display: inline-flex; align-items: center; margin-left: 10px; }
        .pick-icon { font-size: 18px; cursor: pointer; background: #fffbeb; border: 1px solid #fde68a; padding: 4px 12px; border-radius: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); animation: floatPulse 2s infinite ease-in-out; display: inline-flex; align-items: center; justify-content: center; transition: 0.2s; }
        .pick-icon:hover { animation: none; transform: scale(1.08); background: #fef3c7; box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
        @keyframes floatPulse { 0% { transform: translateY(0px); } 50% { transform: translateY(-3px); } 100% { transform: translateY(0px); } }

        .pick-tooltip { visibility: hidden; opacity: 0; position: absolute; bottom: 130%; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #1e293b, #0f172a); color: #fbbf24; text-align: left; padding: 14px 18px; border-radius: 12px; border: 1px solid #fbbf24; min-width: 180px; max-width: 260px; white-space: normal; z-index: 10000; font-size: 15px; font-weight: bold; box-shadow: 0 10px 25px rgba(0,0,0,0.5); transition: 0.3s; pointer-events: auto; line-height: 1.6; letter-spacing: 0.5px; }
        .pick-tooltip::after { content: ""; position: absolute; top: 100%; left: 50%; margin-left: -6px; border-width: 6px; border-style: solid; border-color: #fbbf24 transparent transparent transparent; }
        .pick-tooltip-container:hover .pick-tooltip, .pick-tooltip.show-mobile { visibility: visible; opacity: 1; bottom: 145%; }
        .pk-column:hover { z-index: 10; } 
        .pk-column .pick-tooltip { bottom: auto; top: 130%; }
        .pk-column .pick-tooltip::after { top: auto; bottom: 100%; border-color: transparent transparent #fbbf24 transparent; }
        .pk-column .pick-tooltip-container:hover .pick-tooltip, .pk-column .pick-tooltip.show-mobile { bottom: auto; top: 145%; }

/* 🚀 宇宙飛入特效：從四面八方隨機匯聚 */
        @keyframes scatterFlyIn {
            0% { 
                opacity: 0; 
                transform: translate(var(--rx), var(--ry)) rotate(var(--rr)) scale(0.5); 
            }
            100% { 
                opacity: 1; 
                transform: translate(var(--tx, 0px), var(--ty, 0px)) rotate(var(--rot, 0deg)) scale(1); 
            }
        }

        .expert-card, .podium-card { 
            /* 設定隨機初始位置的變數 (CSS 亂數模擬) */
            --rx: 0px; --ry: 0px; --rr: 0deg;
            animation: scatterFlyIn 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) backwards; 
        }

        /* 為不同順序的卡片設定不同的發射點，達成「四面八方」感 */
        .expert-card:nth-child(4n+1) { --rx: -800px; --ry: -500px; --rr: -120deg; animation-delay: 0.05s; }
        .expert-card:nth-child(4n+2) { --rx: 800px;  --ry: -600px; --rr: 150deg;  animation-delay: 0.1s; }
        .expert-card:nth-child(4n+3) { --rx: -700px; --ry: 700px;  --rr: -90deg;  animation-delay: 0.15s; }
        .expert-card:nth-child(4n+4) { --rx: 900px;  --ry: 400px;  --rr: 180deg;  animation-delay: 0.2s; }
        
        .podium-card:nth-child(1) { --rx: 0px;    --ry: -1000px; --rr: 360deg; }
        .podium-card:nth-child(2) { --rx: -1200px; --ry: 0px;     --rr: -360deg; }
        .podium-card:nth-child(3) { --rx: 1200px;  --ry: 0px;     --rr: 720deg; }

        .pocket-btn-wrapper { margin-top: 10px; border-top: 1px dashed #475569; padding-top: 8px; text-align: right; }
        .pocket-add-btn { background: #3b82f6; color: white; border: none; padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .pocket-add-btn:hover { background: #2563eb; }
        .pocket-add-btn.saved { background: #10b981; color: white; }

        /* 🛑 休眠卡片樣式 */
        .sleep-card { background-color: #f8fafc; border-color: #cbd5e1; }
        .sleep-card .name { color: #94a3b8; }
        .sleep-card .badge { background-color: #e2e8f0; color: #94a3b8; }
        .sleep-card .sleep-text { color: #cbd5e1; }


/* 🪄 專屬反向模式：從白轉黑的翻轉動畫 */
@keyframes flipFromWhite {
            0% {
                opacity: 1; /* 翻轉開始時顯現 */
                /* 翻轉 180 度，且位置也要考慮進去 */
                transform: translate(var(--tx, 0px), var(--ty, 0px)) rotateY(180deg) rotate(var(--rot, 0deg));
                background-color: #ffffff;
                color: transparent;
                border-color: #e2e8f0;
            }
100% {
                opacity: 1; /* 強制結束時可見 */
                /* 翻轉回 0 度，並保持深 U 曲線的位置 */
                transform: translate(var(--tx, 0px), var(--ty, 0px)) rotateY(0deg) rotate(var(--rot, 0deg));
                background-color: #1e293b;
                color: #fca5a5;
                border-color: #450a0a;
            }
        }

        /* 🪄 暗黑/反向魔法模式 */
        body.mode-neg { background-color: #0f172a; color: #f8fafc; transition: background-color 0.5s; }

/* 🪄 魔法模式：卡片改為「白轉黑」翻轉，且取消原本的飛入 */
body.mode-neg .expert-card, 
        body.mode-neg .podium-card {
            animation: flipFromWhite 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards !important; 
            transform-style: preserve-3d; 
            perspective: 1000px;
            backface-visibility: hidden; /* 改回 hidden 翻轉效果更乾淨 */
            opacity: 0; 
            background: #1e293b;
            z-index: 1; /* 確保翻轉時在正確的平面 */
        }

        /* 🪄 設定 1 個 1 個依序翻轉的延遲時間 */
    
        /* 之後的卡片會套用預設動畫，若要更多可依此類推 */

        body.mode-neg .podium-card { background: linear-gradient(135deg, #7f1d1d, #450a0a); border-color: #ef4444; }

        .mode-neg .rank-net { color: #f87171 !important; }

        /* 魔法模式下的休眠卡片 (深淵灰) */
        body.mode-neg .sleep-card { background-color: #020617 !important; border-color: #1e293b !important; opacity: 0.7; }
        body.mode-neg .sleep-card .name { color: #475569 !important; }
        body.mode-neg .sleep-card .badge { background-color: #1e293b !important; color: #475569 !important; }
        body.mode-neg .sleep-card .sleep-text { color: #334155 !important; }

/* 🥋 寬鬆魔法腰帶版：卡片大小恢復 100%，增加橫向間距 */
        body.mode-neg #expertGrid { 
            display: grid !important;
            grid-template-columns: repeat(8, 1fr) !important; /* 核心：恢復 8 欄，卡片立即變大 */
            gap: 75px 25px !important; /* 加大間距，絕對不擠 */
            max-width: 1550px !important; 
            margin: 0px auto 80px auto !important; 
            position: relative;
            z-index: 50; 
            padding: 0 30px; 
        }
        
        body.mode-neg .expert-card {
            --tx: 0px; --ty: 0px; --rot: 0deg; 
            padding: 15px 5px !important; /* 恢復正常卡片高度 */
            border-radius: 12px !important; /* 恢復正常圓角 */
            transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); /* 移除 !important，交給動畫接管 */
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s !important;
        }

/* 🔥 8 欄位最終校正版：極致深 U 曲線 + 卡片絕對端正 */
        body.mode-neg .expert-card:nth-child(8n + 1) { --tx: 45px;  --ty: -125px; --rot: -1.5deg; }
        body.mode-neg .expert-card:nth-child(8n + 2) { --tx: 25px;  --ty: -65px;  --rot: -0.8deg; }
        body.mode-neg .expert-card:nth-child(8n + 3) { --tx: 10px;  --ty: -20px;  --rot: -0.3deg; }
        body.mode-neg .expert-card:nth-child(8n + 4) { --tx: 0px;   --ty: 0px;    --rot: 0deg;    }
        body.mode-neg .expert-card:nth-child(8n + 5) { --tx: 0px;   --ty: 0px;    --rot: 0deg;    }
        body.mode-neg .expert-card:nth-child(8n + 6) { --tx: -10px; --ty: -20px;  --rot: 0.3deg;  }
        body.mode-neg .expert-card:nth-child(8n + 7) { --tx: -25px; --ty: -65px;  --rot: 0.8deg;  }
        body.mode-neg .expert-card:nth-child(8n + 8) { --tx: -45px; --ty: -125px; --rot: 1.5deg;  }

/* 💡 滑鼠懸停修復：取消旋轉、微微放大、突顯層級，解決疊在一起看不到字的問題 */
        body.mode-neg .expert-card:hover {
            transform: translate(calc(var(--tx) * 0.8), calc(var(--ty) - 20px)) rotate(0deg) scale(1.3) !important;
            z-index: 100 !important;
            box-shadow: 0 15px 35px rgba(220, 38, 38, 0.7) !important;
        }

        /* 🔥 反向魔法專屬「點選」狀態：紅光、浮起、暗紅底，徹底蓋掉原本的藍色 */
        body.mode-neg .expert-card.active {
            transform: translate(calc(var(--tx) * 0.8), calc(var(--ty) - 20px)) rotate(0deg) scale(1.2) !important;
            z-index: 95 !important;
            border: 2.5px solid #ef4444 !important;
            background-color: #450a0a !important;
            box-shadow: 0 0 25px 5px rgba(220, 38, 38, 0.8) !important;
        }
        
        /* 🔥 前三名頒獎台的反向點選狀態 */
        body.mode-neg .podium-card.active {
            border: 3px solid #ef4444 !important;
            background: linear-gradient(135deg, #991b1b, #450a0a) !important;
            box-shadow: 0 0 30px 10px rgba(220, 38, 38, 0.8) !important;
            transform: translateY(-10px) !important;
        }

        .mode-toggle-wrapper { display: flex; justify-content: center; margin-bottom: 20px; gap: 15px; }
        .toggle-btn { padding: 10px 24px; border-radius: 50px; cursor: pointer; font-weight: bold; transition: 0.3s; border: 2px solid #cbd5e1; background: #fff; color: #64748b; }
        .toggle-btn.active-pos { background: #1877f2; color: white; border-color: #1877f2; box-shadow: 0 4px 10px rgba(24,119,242,0.3); }
        .toggle-btn.active-neg { background: #dc2626; color: white; border-color: #dc2626; box-shadow: 0 4px 10px rgba(220,38,38,0.3); }
    `;
    document.head.appendChild(style);
}

window.userPocket = JSON.parse(localStorage.getItem('UserPocketDB')) || [];
window.selectedExperts = [];  
window.manualSwapList = []; // 🔀 存儲手動調整分流的好手名單

// 💡 手動切換紅黑榜功能
window.toggleManualSwap = function(name) {
    const idx = window.manualSwapList.indexOf(name);
    if (idx > -1) {
        window.manualSwapList.splice(idx, 1);
    } else {
        window.manualSwapList.push(name);
    }
    window.renderDisplay(); // 立即重新繪製排行榜
};
 
window.activeSportKey = "";  
window.excludedExperts = [];  
window.expandStates = {};
window.activeTrendFilter = 'all'; 
window.activeTrendSportKey = "";
window.currentHomeFilter = 'all';

window.toggleUserPocket = function(expertName, btnElement) {
    const idx = window.userPocket.indexOf(expertName);
    if (idx > -1) { window.userPocket.splice(idx, 1); btnElement.className = 'pocket-add-btn'; btnElement.innerHTML = '➕ 收錄口袋'; } 
    else { window.userPocket.push(expertName); btnElement.className = 'pocket-add-btn saved'; btnElement.innerHTML = '⭐ 已收錄'; }
    localStorage.setItem('UserPocketDB', JSON.stringify(window.userPocket));
    if (typeof window.updatePocketWidget === 'function') window.updatePocketWidget(); 
};

// 🧠 【嚴格切西瓜濾網 3.0】：保證不同賽事絕對不混在一起
window.getPickTooltipHtml = function(name) {
    if (typeof todayPicks === 'undefined' || !todayPicks[name]) return '';
    
    let rawText = todayPicks[name];
    let sportKey = window.activeSportKey || "";
    let finalContent = ""; 
    
    // 把可能出現的 <br> 統一換成標準換行符號 \n，方便逐行切斷
    rawText = rawText.replace(/<br\s*[\/]?>/gi, '\n');
    
    if (sportKey !== "") {
        let targetKeywords = [];
        // 根據當前頁面，決定要抓取的關鍵字
        if (sportKey.includes('nba')) targetKeywords = ['nba', '籃', '🏀'];
        else if (sportKey.includes('mlb')) targetKeywords = ['mlb', '棒', '⚾'];
        else if (sportKey.includes('soccer')) targetKeywords = ['足', '⚽', '英超', '西甲'];
        else if (sportKey.includes('nhl') || sportKey.includes('khl')) targetKeywords = ['冰', '🏒', 'nhl', 'khl'];
        else if (['euro','nbl','jp','kbl','cba'].some(k => sportKey.includes(k))) targetKeywords = ['籃', '🏀'];
        else if (sportKey.includes('lol')) targetKeywords = ['電競', '🎮', 'lol'];
        
        // 🚨 這是所有的地雷關鍵字，一旦碰到「不是目標」的地雷，馬上停止抓取！
        let allCategoryRegex = /(nba|mlb|nhl|khl|⚽|🏒|🏀|⚾|🎮|美籃|美棒|足球|冰球|籃|棒|電競)/i;
        
        if (allCategoryRegex.test(rawText) && targetKeywords.length > 0) {
            let targetRegex = new RegExp("(" + targetKeywords.join('|') + ")", "i");
            let lines = rawText.split('\n');
            let outputLines = [];
            let isMatchingBlock = false;
            
            for (let line of lines) {
                let textLine = line.trim();
                if (!textLine) continue; // 略過空白行
                
                let isCategoryHeader = allCategoryRegex.test(textLine);
                let isTargetHeader = targetRegex.test(textLine);
                
                if (isTargetHeader) {
                    isMatchingBlock = true; // 抓到對的賽事！開啟錄音機
                    outputLines.push(line);
                } else if (isCategoryHeader) {
                    isMatchingBlock = false; // 撞到別的賽事！立刻關閉錄音機
                } else {
                    if (isMatchingBlock) outputLines.push(line); // 把推薦內容錄下來
                }
            }
            
            if (outputLines.length > 0) {
                finalContent = outputLines.join('<br>');
            } else {
                return ''; // 🛑 如果該好手今天沒寫這項賽事，氣泡框直接消失！
            }
        } else {
            finalContent = rawText.replace(/\n/g, '<br>'); // 如果全篇都沒寫標籤符號，就全秀
        }
    } else {
        finalContent = rawText.replace(/\n/g, '<br>');
    }

    if (!finalContent.trim()) return '';

    let isSaved = window.userPocket.includes(name);
    let btnText = isSaved ? '⭐ 已收錄' : '➕ 收錄口袋';
    let btnClass = isSaved ? 'pocket-add-btn saved' : 'pocket-add-btn';
    return `<div class="pick-tooltip-container"><span class="pick-icon" onclick="event.stopPropagation(); window.toggleMobileTooltip(this);" title="點擊查看今日推薦">💬</span><div class="pick-tooltip"><div class="pick-content">${finalContent}</div><div class="pocket-btn-wrapper"><button class="${btnClass}" onclick="event.stopPropagation(); window.toggleUserPocket('${name}', this)">${btnText}</button></div></div></div>`;
};

window.toggleMobileTooltip = function(iconElement) { document.querySelectorAll('.pick-tooltip.show-mobile').forEach(el => { if (el !== iconElement.nextElementSibling) el.classList.remove('show-mobile'); }); iconElement.nextElementSibling.classList.toggle('show-mobile'); };
document.addEventListener('click', (e) => { if(!e.target.closest('.pick-icon') && !e.target.closest('.pick-tooltip')) { document.querySelectorAll('.pick-tooltip.show-mobile').forEach(el => el.classList.remove('show-mobile')); } });

if (typeof dailyUpdates !== 'undefined') {
    dailyUpdates.forEach(([expert, sport, date, wl, net]) => {
        if (!window.dataDB[expert]) window.dataDB[expert] = {};
        if (!window.dataDB[expert][sport]) window.dataDB[expert][sport] = [];
        let isDuplicate = window.dataDB[expert][sport].some(r => r[0] === date && r[1] === wl && r[2] === net);
        if (!isDuplicate) window.dataDB[expert][sport].unshift([date, wl, net]); 
    });
    const currentYear = new Date().getFullYear();
    for (let exp in window.dataDB) { for (let sp in window.dataDB[exp]) { window.dataDB[exp][sp].sort((a, b) => { const parseDate = (dStr) => { let d = new Date(`${currentYear}/${dStr}`); if (d.getMonth() === 11 && new Date().getMonth() <= 2) d.setFullYear(currentYear - 1); return d.getTime(); }; return parseDate(b[0]) - parseDate(a[0]); }); } }
}
localStorage.setItem(DB_KEY, JSON.stringify(window.dataDB));

window.getSystemLatestDate = function(sportKey) { let maxTime = 0; let maxStr = "01/01"; let currentYear = new Date().getFullYear(); for (let expert in window.dataDB) { if (window.dataDB[expert][sportKey] && window.dataDB[expert][sportKey].length > 0) { let dateStr = window.dataDB[expert][sportKey][0][0]; let d = new Date(`${currentYear}/${dateStr}`); if (d.getMonth() === 11 && new Date().getMonth() <= 2) d.setFullYear(currentYear - 1); if (d.getTime() > maxTime) { maxTime = d.getTime(); maxStr = dateStr; } } } return maxStr; };
window.getDaysDiff = function(recordDateStr, systemLatestStr) { if(!recordDateStr || !systemLatestStr) return 999; let currentYear = new Date().getFullYear(); let d1 = new Date(`${currentYear}/${systemLatestStr}`); let d2 = new Date(`${currentYear}/${recordDateStr}`); if (d1.getMonth() === 0 && d2.getMonth() === 11) d2.setFullYear(currentYear - 1); else if (d1.getMonth() === 11 && d2.getMonth() === 0) d1.setFullYear(currentYear - 1); return Math.floor(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24)); };
window.changeHomeRanking = function(val, btn) { window.currentHomeFilter = val; document.querySelectorAll('.r-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); window.init(); };

// 🧠 魔法切換大腦
window.toggleIndexMode = function(mode) {
    window.isNegativeMode = (mode === 'neg');
    if (window.isNegativeMode) document.body.classList.add('mode-neg');
    else document.body.classList.remove('mode-neg');
    window.init();
};

window.init = function() {
    const grid = document.getElementById('expertGrid'); 
    const podiumArea = document.getElementById('podiumArea');
    const targetSport = window.activeSportKey || "nba_team"; 
    let systemLatestDate = window.getSystemLatestDate(targetSport); 
    let rankedList = [];

    for (let name in window.dataDB) {
        let records = window.dataDB[name][targetSport] || []; 
        if (records.length === 0) continue;
        let diffDays = window.getDaysDiff(records[0][0], systemLatestDate); 
        let isActive = diffDays <= 3;
        let sliceRec = window.currentHomeFilter === 'all' ? records : records.slice(0, window.currentHomeFilter);
        let net = sliceRec.reduce((sum, r) => sum + parseInt(r[2] || 0), 0);
        rankedList.push({ name, net, isActive, totalCount: records.length });
    }

    // 🚀 正反向排序邏輯
    rankedList.sort((a, b) => { 
        if (a.isActive && !b.isActive) return -1; 
        if (!a.isActive && b.isActive) return 1; 
        return window.isNegativeMode ? (a.net - b.net) : (b.net - a.net); 
    });

    if(podiumArea) {
        podiumArea.innerHTML = ''; 
        const top3 = rankedList.slice(0, 3); 
        const order = [1, 0, 2]; 
        order.forEach(i => {
            if (top3[i] && top3[i].isActive) { 
                const exp = top3[i]; 
                const isActiveSelect = window.selectedExperts.includes(exp.name) ? 'active' : '';
                const card = document.createElement('div'); 
                card.className = `podium-card rank-${i + 1} ${isActiveSelect}`;
                card.setAttribute('data-name', exp.name); // 🛡️ 補回身分證，保證上下連動熄滅
                
                // 💡 動態設定延遲：只有魔法反向模式才一個個翻
                card.style.animationDelay = window.isNegativeMode ? `${(i + 1) * 0.1}s` : '0s';

                card.innerHTML = `<div class="rank-number">RANK ${i + 1}</div><span class="rank-crown">${window.isNegativeMode ? '🪄' : (i===0?'👑':(i===1?'🥈':'🥉'))}</span><div class="name" style="font-size:20px; display:flex; align-items:center; justify-content:center;">${exp.name} ${window.getPickTooltipHtml(exp.name)}</div><span class="rank-net">${exp.net >= 0 ? '+' : ''}${exp.net} <span style="font-size:14px;">注</span></span><div style="font-size:12px; color:#64748b; margin-top:5px;">${itemNames[targetSport] || '紀錄'}</div>`;
                card.onclick = () => window.toggleExpert(exp.name, card); 
                podiumArea.appendChild(card);
            }
        });
    }

    if(grid) {
        grid.innerHTML = ''; 
        const theRest = rankedList.slice(3);
        theRest.forEach((exp, idx) => {
            const card = document.createElement('div'); 
            const isActiveSelect = window.selectedExperts.includes(exp.name) ? 'active' : ''; 
            card.className = `expert-card ${isActiveSelect}`;
            card.setAttribute('data-name', exp.name); // 🛡️ 補回身分證
            
            // 💡 動態設定延遲：正向同時出，反向一個個翻
            card.style.animationDelay = window.isNegativeMode ? `${(idx * 0.1) + 0.4}s` : '0s';
            
            if (exp.isActive) {
                card.innerHTML = `<div style="font-size:11px; color:#94a3b8; margin-bottom:5px;">NO.${idx + 4}</div><div class="name" style="display:flex; align-items:center; justify-content:center;">${exp.name} ${window.getPickTooltipHtml(exp.name)}</div><span class="badge" style="color:#1877f2;">淨值 ${exp.net >= 0 ? '+' : ''}${exp.net}</span>`;
            } else {
                card.classList.add('sleep-card');
                card.innerHTML = `<div class="sleep-icon">zZzZ</div><div class="sleep-text" style="font-size:11px; margin-bottom:5px;">無近期數據</div><span class="name" style="display:flex; align-items:center; justify-content:center;">${exp.name}</span><span class="badge" style="padding:2px 5px; border-radius:4px;">💤 休眠中</span>`;
            }
            card.onclick = () => window.toggleExpert(exp.name, card); 
            grid.appendChild(card);
        });
    }

    let toggleDiv = document.getElementById('modeToggle');
    if (!toggleDiv) {
        toggleDiv = document.createElement('div');
        toggleDiv.id = 'modeToggle';
        toggleDiv.className = 'mode-toggle-wrapper';
        const podium = document.getElementById('podiumArea');
        if(podium) podium.parentNode.insertBefore(toggleDiv, podium);
    }
    if(toggleDiv) {
        toggleDiv.innerHTML = `
            <div class="toggle-btn ${!window.isNegativeMode ? 'active-pos' : ''}" onclick="window.toggleIndexMode('pos')">📈 正向動能排行</div>
            <div class="toggle-btn ${window.isNegativeMode ? 'active-neg' : ''}" onclick="window.toggleIndexMode('neg')">🪄 反轉魔法排行</div>
        `;
    }

    const tabs = document.getElementById('tabContainer');
    if (tabs && tabs.innerHTML === '') {
        const categories = [ { name: '🏀 美籃 NBA', items: [ { id: 'nba_team', label: 'NBA 隊伍' }, { id: 'nba_total', label: 'NBA 大小' } ] }, { name: '⚾ 美棒 MLB', items: [ { id: 'mlb_team', label: '美棒隊伍' }, { id: 'mlb_total', label: '美棒大小' }, { id: 'mlb_ml', label: '獨贏(正常)' }, { id: 'mlb_ml_high', label: '獨贏(高賠)' } ] }, { name: '⚽ 足球系列', items: [ { id: 'soccer_team', label: '足球隊伍' }, { id: 'soccer_total', label: '足球大小' }, { id: 'soccer_ml', label: '足球獨贏' }, { id: 'soccer_btts', label: '兩隊進球' } ] }, { name: '🏒 冰球系列', items: [ { id: 'nhl_team_ot', label: '冰球隊伍(含時)' }, { id: 'nhl_team_reg', label: '冰球隊伍(不時)' }, { id: 'nhl_ml', label: '冰球獨贏(含時)' }, { id: 'nhl_ml_reg', label: '獨贏(不時)' }, { id: 'nhl_spread_ot', label: '讓盤(含時)' }, { id: 'nhl_spread_reg', label: '讓盤(不時)' }, { id: 'nhl_total_ot', label: '大小(含時)' }, { id: 'nhl_total_reg', label: '大小(不時)' }, { id: 'khl_team', label: '俄冰隊伍' }, { id: 'khl_total', label: '俄冰大小' } ] }, { name: '🌏 亞洲/歐籃', items: [ { id: 'euro_team', label: '歐籃隊伍' }, { id: 'euro_total', label: '歐籃大小' }, { id: 'nbl_team', label: '澳籃隊伍' }, { id: 'nbl_total', label: '澳籃大小' }, { id: 'jp_team', label: '日籃隊伍' }, { id: 'kbl_team', label: '韓籃隊伍' }, { id: 'kbl_total', label: '韓籃大小' }, { id: 'cba_team', label: '中籃隊伍' }, { id: 'cba_total', label: '中籃大小' } ] }, { name: '🎮 電競系列', items: [ { id: 'lol_team', label: '電競隊伍' }, { id: 'lol_total', label: '電競大小' } ] } ];
        categories.forEach(cat => {
            const wrapper = document.createElement('div'); wrapper.className = 'dropdown-wrapper';
            wrapper.innerHTML = `<div class="category-btn" id="cat-${cat.name}">${cat.name}</div><div class="dropdown-content"></div>`;
            const content = wrapper.querySelector('.dropdown-content'); cat.items.forEach(item => window.appendTab(item.id, item.label, content)); tabs.appendChild(wrapper);
        });
    }
    if(typeof window.updateTabHighlights === 'function') window.updateTabHighlights();
};


window.appendTab = function(key, label, container) { const btn = document.createElement('label'); btn.className = `sport-tab`; btn.id = `l-${key}`; btn.innerHTML = label; btn.onclick = () => window.selectSport(key, btn); container.appendChild(btn); };
window.updateTabHighlights = function() {
    const categories = document.querySelectorAll('.dropdown-wrapper'); const tabs = document.querySelectorAll('.sport-tab');
    if (window.selectedExperts.length === 0) { categories.forEach(w => { const btn = w.querySelector('.category-btn'); if(btn) btn.classList.remove('tab-highlight', 'tab-dimmed'); }); tabs.forEach(t => t.classList.remove('tab-highlight', 'tab-dimmed')); return; }
    categories.forEach(wrapper => {
        const catBtn = wrapper.querySelector('.category-btn'); const subTabs = wrapper.querySelectorAll('.sport-tab'); if(!catBtn) return; let catHasData = false; 
        subTabs.forEach(t => {
            let key = t.id.replace('l-', '').replace('t-', ''); let itemHasData = false; window.selectedExperts.forEach(n => { if (window.dataDB[n] && window.dataDB[n][key] && window.dataDB[n][key].length > 0) itemHasData = true; });
            if (itemHasData) { t.classList.remove('tab-dimmed'); t.classList.add('tab-highlight'); catHasData = true; } else { t.classList.remove('tab-highlight'); t.classList.add('tab-dimmed'); }
        });
        if (catHasData) { catBtn.classList.remove('tab-dimmed'); catBtn.classList.add('tab-highlight'); } else { catBtn.classList.remove('tab-highlight'); catBtn.classList.add('tab-dimmed'); }
    });
};

window.selectSport = function(key, el) {
    if (window.activeSportKey === key) { window.activeSportKey = ""; el.classList.remove('active'); } else { window.activeSportKey = key; document.querySelectorAll('#tabContainer .sport-tab').forEach(t => t.classList.remove('active')); el.classList.add('active'); }
    window.init(); 
    if (document.getElementById('details').style.display === 'block') { window.renderDisplay(); }
};
window.toggleExpert = function(n, el) { 
    const i = window.selectedExperts.indexOf(n); 
    let isAdding = false; // 💡 記號：判斷現在是新增還是取消

    if(i > -1) { 
        // 狀態：取消選取
        window.selectedExperts.splice(i, 1); 
        if(el) el.classList.remove('active'); 
        
        // 💡 終極防護：使用 data-name 身分證精準抓取
        document.querySelectorAll(`.expert-card[data-name="${n}"], .podium-card[data-name="${n}"]`).forEach(c => {
            c.classList.remove('active');
        });
    } else { 
        // 狀態：新增選取
        if(window.selectedExperts.length >= 6) return alert('最多比較6位'); 
        window.selectedExperts.push(n); 
        if(el) el.classList.add('active'); 
        isAdding = true; // 💡 標記為「新增」狀態
    } 
    window.updateTabHighlights(); 
    
    // 💡 魔法聯動：下方區塊若開著，免按送出直接重繪
    const detailsArea = document.getElementById('details'); 
    if (detailsArea && detailsArea.style.display === 'block') { 
        window.renderDisplay(); 
        
        // 🚀 終極修復：如果是新增好手，強制將橫向捲軸滑動到最右邊，展示新卡片！
        if (isAdding) {
            setTimeout(() => {
                const pkLayout = document.getElementById('pkMainLayout');
                if (pkLayout) pkLayout.scrollTo({ left: pkLayout.scrollWidth, behavior: 'smooth' });
            }, 50); // 給瀏覽器 0.05 秒重繪畫面再滑動，確保滑到最底
        }
    } 
};

window.handleCompare = function() { window.excludedExperts = []; window.expandStates = {}; if (window.selectedExperts.length === 0 && window.activeSportKey === "") return alert('請點選好手'); document.getElementById('details').style.display = 'block'; window.renderDisplay(); document.getElementById('details').scrollIntoView({ behavior: 'smooth' }); };

window.renderDisplay = function() {
    const display = document.getElementById('displayArea'); const header = document.getElementById('singleHeader');
    const layouts = display.querySelectorAll('.pk-layout'); const scrollMap = {}; layouts.forEach(l => { if(l.id) scrollMap[l.id] = l.scrollLeft; });
    const mainScroll = display.scrollLeft; 
    display.innerHTML = ''; 
    display.className = ''; 
    display.style.flexDirection = ''; /* 💡 終極解法：清除單人模式遺留的上下排版綁架！ */
    header.style.display = 'none';
    if (window.selectedExperts.length === 0 && window.activeSportKey !== "") window.renderRankMode(); else if (window.selectedExperts.length === 1) window.renderNormalMode(); else window.renderPKMode();
    setTimeout(() => { const newLayouts = display.querySelectorAll('.pk-layout'); newLayouts.forEach(l => { if(l.id && scrollMap[l.id]) l.scrollLeft = scrollMap[l.id]; }); display.scrollLeft = mainScroll; }, 0);
};

window.toggleExpand = function(n) { window.expandStates[n] = !window.expandStates[n]; window.renderDisplay(); };

window.renderPKMode = function() {
    const display = document.getElementById('displayArea'); 
    if (!display) return; // 🛡️ 安全防護
    const key = window.activeSportKey || "nba_team"; 
    display.className = 'pk-layout'; 
    // 🛑 致命元凶拔除：絕對不能改寫容器的 ID，否則第二次更新會因為找不到目標而崩潰死機！
    
    let htmlStr = ''; 
    
    window.selectedExperts.forEach(n => {
        try {
            let dbData = (window.dataDB[n] && window.dataDB[n][key]) ? window.dataDB[n][key] : [];
            const hasMore = dbData.length > 20; 
            const showFull = window.expandStates[n];
            const btnHtml = hasMore ? `<button class="expand-btn" onclick="window.toggleExpand('${n}')">${showFull ? '🔼 收起歷史' : '🔍 展開更多歷史'}</button>` : '';
            
            // 💡 核心變更：onclick 現在只要呼叫 toggleExpert，剩下的自動交給它處理！
            htmlStr += `<div class="pk-column"><div class="close-x" onclick="window.toggleExpert('${n}', null);">×</div><div class="pk-name-label" style="display:flex; align-items:center; justify-content:center;">${n} ${window.getPickTooltipHtml(n)}</div>${window.getRankBanner(typeof itemNames !== 'undefined' && itemNames[key] ? itemNames[key] : '紀錄', n, key)}<div class="table-header"><div>日期</div><div style="width:70px;text-align:center;">戰績</div><div style="flex:1;padding-left:5px;">反饋</div></div>${window.buildHTML(dbData, !showFull, n, key)}${btnHtml}</div>`;
        } catch(e) {
            console.error("資料異常跳過:", n);
        }
    });
    
    display.innerHTML = htmlStr; 
};

window.renderRankMode = function() {
    const display = document.getElementById('displayArea'); let allSorted = []; let systemLatestDate = window.getSystemLatestDate(window.activeSportKey);
    for(let name in window.dataDB) {
        if(window.excludedExperts.includes(name)) continue; let list = window.dataDB[name][window.activeSportKey] || []; if(list.length === 0) continue;
        let diffDays = window.getDaysDiff(list[0][0], systemLatestDate); if (diffDays > 3) continue;
        let w=0, l=0, n20=0; list.slice(0, 20).forEach(r => { const wm = r[1].match(/(\d+)勝/); const lm = r[1].match(/(\d+)敗/); if(wm) w += parseInt(wm[1]); if(lm) l += parseInt(lm[1]); n20 += parseInt(r[2] || 0); }); let rate = (w+l) > 0 ? (w/(w+l)) : 0; allSorted.push({ name, w, l, net: n20, rate });
    }
    allSorted.sort((a,b) => b.rate - a.rate || b.net - a.net);
// 💡 判定是否為紅榜好手 (考慮手動翻轉)
    const isActuallyPositive = (item) => {
        const naturallyPositive = item.rate >= 0.5;
        const isSwapped = window.manualSwapList.includes(item.name);
        return isSwapped ? !naturallyPositive : naturallyPositive;
    };

    const top6 = allSorted.filter(item => isActuallyPositive(item)).slice(0, 6); 
    const bottom6 = allSorted.filter(item => !isActuallyPositive(item)).sort((a,b) => a.rate - b.rate || a.net - b.net).slice(0, 6);

    display.innerHTML = `<div class="rank-group-title" style="color:#16a34a; border-bottom:2px solid #bbf7d0;">🏆 ${itemNames[window.activeSportKey]} - 戰力紅榜</div><div class="pk-layout" id="topLayout"></div><div class="rank-group-title" style="color:#dc3545; border-bottom:2px solid #fecaca;">💀 ${itemNames[window.activeSportKey]} - 戰力黑榜</div><div class="pk-layout" id="bottomLayout"></div>`;
    top6.forEach((item, i) => document.getElementById('topLayout').innerHTML += window.renderRankCard(item, i, window.activeSportKey, false));
    bottom6.forEach((item, i) => document.getElementById('bottomLayout').innerHTML += window.renderRankCard(item, i, window.activeSportKey, true));
};

window.renderRankCard = function(item, idx, key, isReverse) {
    let cls = isReverse ? "title-rank-neg" : (idx===0 ? "title-rank-1" : (idx===1 ? "title-rank-2" : (idx===2 ? "title-rank-3" : "title-unranked")));
    let bCls = isReverse ? "rank-neg-badge" : (idx===0 ? "rank-1-badge" : (idx===1 ? "rank-2-badge" : (idx===2 ? "rank-3-badge" : "")));
    const showFull = window.expandStates[item.name]; const hasMore = window.dataDB[item.name][key] && window.dataDB[item.name][key].length > 20;
    const btnHtml = hasMore ? `<button class="expand-btn" onclick="window.toggleExpand('${item.name}')">${showFull ? '🔼 收起' : '🔍 展開歷史'}</button>` : '';

// 💡 根據區域決定文字：紅榜顯示「暫居反向」，黑榜顯示「暫居正向」
    const swapText = isReverse ? '暫居正向區' : '暫居反向區';
    const swapColor = isReverse ? '#16a34a' : '#dc3545';
    
    // 🎨 樣式升級：font-size 調至 13px，padding 調至 4.5px 12px，完全對齊旁邊的綠色按鈕
    const swapBtn = `<button onclick="event.stopPropagation(); window.toggleManualSwap('${item.name}')" 
        style="cursor:pointer; font-size:13px; color:${swapColor}; border:1.5px solid ${swapColor}; 
        padding:4.5px 12px; border-radius:4px; font-weight:900; white-space:nowrap; 
        background:transparent; transition:0.2s; height:28px; line-height:1;">${swapText}</button>`;

    return `<div class="pk-column">
        <div class="close-x" onclick="window.excludeAndRedraw('${item.name}')">×</div>
        <div class="pk-name-label" style="display:flex; align-items:center; justify-content:center; padding: 10px 5px;">
            ${item.name} ${window.getPickTooltipHtml(item.name)}
        </div>
        <div class="title-container ${cls}">
            <h4 class="section-title">勝率 ${(item.rate*100).toFixed(0)}%</h4>
            <span class="rank-badge ${bCls}">${isReverse?'反向':''} NO.${idx+1} (${item.net>=0?'+'+item.net:item.net})</span>
        </div>
        ${window.buildHTML(window.dataDB[item.name][key] || [], !showFull, item.name, key, swapBtn)}
        ${btnHtml}
    </div>`;
};

window.excludeAndRedraw = function(name) { window.excludedExperts.push(name); window.renderDisplay(); };

window.renderNormalMode = function() {
    const area = document.getElementById('displayArea'); const header = document.getElementById('singleHeader'); 
    const key = window.activeSportKey || "nba_team"; const n = window.selectedExperts[0]; const base = key.split('_')[0];
    header.style.display = 'flex';
    document.getElementById('expertTitle').innerHTML = `${n} ${window.getPickTooltipHtml(n)} <span style="font-size: 16px; color:#94a3b8; font-weight:normal; margin-left:10px;">- 專家戰力履歷</span>`;
    document.getElementById('topBadge').innerText = base.toUpperCase();
    const records = window.dataDB[n][key] || []; let totalW = 0, totalL = 0, totalNet = 0;
    records.forEach(r => { const wm = r[1].match(/(\d+)勝/); const lm = r[1].match(/(\d+)敗/); if(wm) totalW += parseInt(wm[1]); if(lm) totalL += parseInt(lm[1]); totalNet += parseInt(r[2] || 0); });
    const totalRate = (totalW + totalL) > 0 ? Math.round((totalW / (totalW + totalL)) * 100) : 0;
    const getRate = (num) => { let w = 0, l = 0; records.slice(0, num).forEach(r => { const wm = r[1].match(/(\d+)勝/); const lm = r[1].match(/(\d+)敗/); if(wm) w += parseInt(wm[1]); if(lm) l += parseInt(lm[1]); }); return (w + l) > 0 ? Math.round((w / (w + l)) * 100) : 0; };
    const radarHtml = `<div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 25px; margin-bottom: 30px; background: #1e293b; color: white; padding: 35px; border-radius: 20px; box-shadow: 0 12px 30px rgba(0,0,0,0.2);"><div style="border-right: 1px solid #475569; padding-right: 30px;"><div style="font-size: 20px; color: #94a3b8; margin-bottom: 12px; font-weight: bold;">🏆 全賽季實力總榜</div><div style="font-size: 56px; font-weight: 900; color: #fbbf24; line-height: 1;">${totalNet >= 0 ? '+' : ''}${totalNet} <span style="font-size: 26px; color: #fff;">注</span></div><div style="font-size: 26px; margin-top: 15px; font-weight: bold;">總勝率：<span style="color: #34d399;">${totalRate}%</span></div><div style="font-size: 16px; color: #94a3b8; margin-top: 8px;">(${totalW}勝 ${totalL}敗 / 歷史留存)</div></div><div style="display: flex; justify-content: space-around; align-items: center; text-align: center;"><div style="min-width: 100px;"><div style="color: #94a3b8; font-size: 16px; margin-bottom: 8px; font-weight: bold;">3日熱度</div><div style="font-size: 34px; font-weight: 900; color: ${getRate(3)>=60?'#f87171':'#fff'}">${getRate(3)}%</div></div><div style="min-width: 100px;"><div style="color: #94a3b8; font-size: 16px; margin-bottom: 8px; font-weight: bold;">7日動能</div><div style="font-size: 34px; font-weight: 900;">${getRate(7)}%</div></div><div style="min-width: 100px;"><div style="color: #94a3b8; font-size: 16px; margin-bottom: 8px; font-weight: bold;">20日穩定度</div><div style="font-size: 34px; font-weight: 900;">${getRate(20)}%</div></div><div style="min-width: 100px;"><div style="color: #94a3b8; font-size: 16px; margin-bottom: 8px; font-weight: bold;">30日指標</div><div style="font-size: 34px; font-weight: 900; color: #34d399;">${getRate(30)}%</div></div></div></div>`;
    const isSingleColumn = key.includes('_total') || key.includes('_ml') || key.includes('_reg') || key.includes('_spread') || key.includes('_btts') || key === 'nbl_team' || key === 'jp_team' || key === 'kbl_team';
    area.className = 'data-layout'; area.style.flexDirection = 'column';
    if (isSingleColumn) { area.innerHTML = `${radarHtml} <div class="record-column" style="max-width: 100%;">${window.getRankBanner(itemNames[key] || '紀錄', n, key)}<div class="table-header"><div>日期</div><div style="width:80px;text-align:center;">戰績</div><div style="flex:1;padding-left:10px;">反饋</div></div>${window.buildHTML(records, false, n, key)}</div>`; } else { let rightKey = base + '_total'; if (key === 'nhl_team_ot') rightKey = 'nhl_total_ot'; area.innerHTML = `${radarHtml} <div style="display:flex; gap:20px;"><div class="record-column">${window.getRankBanner(itemNames[key] || '隊伍紀錄', n, key)}<div class="table-header"><div>日期</div><div style="width:80px;text-align:center;">戰績</div><div style="flex:1;padding-left:10px;">反饋</div></div>${window.buildHTML(records, false, n, key)}</div><div class="record-column">${window.getRankBanner('大小紀錄', n, rightKey)}<div class="table-header"><div>日期</div><div style="width:80px;text-align:center;">戰績</div><div style="flex:1;padding-left:10px;">反饋</div></div>${window.buildHTML(window.dataDB[n][rightKey] || [], false, n, rightKey)}</div></div>`; }
};
window.getRankBanner = function(title, name, key) {
    let list = []; let systemLatestDate = window.getSystemLatestDate(key);
    for(let n in window.dataDB) { if(window.dataDB[n][key] && window.dataDB[n][key].length > 0){ let diffDays = window.getDaysDiff(window.dataDB[n][key][0][0], systemLatestDate); if (diffDays > 3) continue; let w=0, l=0, n20=0; window.dataDB[n][key].slice(0, 20).forEach(r => { const wm = r[1].match(/(\d+)勝/); const lm = r[1].match(/(\d+)敗/); if(wm) w += parseInt(wm[1]); if(lm) l += parseInt(lm[1]); n20 += parseInt(r[2] || 0); }); let rate = (w+l) > 0 ? (w/(w+l)) : 0; list.push({name: n, net: n20, rate: rate}); } }
    const target = list.find(r => r.name === name); if (!target) return `<div class="title-container title-unranked"><h4 class="section-title">${title}</h4><span class="rank-badge" style="background:#f1f5f9; color:#94a3b8;">未激活榜單</span></div>`;
    let isReverse = target.rate < 0.5; let rankIdx = -1; let cls = "title-unranked"; let bCls = ""; let rankPrefix = "近況";
    if (!isReverse) { let topList = list.filter(item => item.rate >= 0.5); topList.sort((a,b) => b.rate - a.rate || b.net - a.net); rankIdx = topList.findIndex(r => r.name === name); if(rankIdx === 0) { cls = "title-rank-1"; bCls = "rank-1-badge"; } else if(rankIdx === 1) { cls = "title-rank-2"; bCls = "rank-2-badge"; } else if(rankIdx === 2) { cls = "title-rank-3"; bCls = "rank-3-badge"; } } else { let bottomList = list.filter(item => item.rate < 0.5); bottomList.sort((a,b) => a.rate - b.rate || a.net - b.net); rankIdx = bottomList.findIndex(r => r.name === name); rankPrefix = "反向"; cls = "title-rank-neg"; bCls = "rank-neg-badge"; }
    return `<div class="title-container ${cls}"><h4 class="section-title">${title}</h4><span class="rank-badge ${bCls}">${(rankIdx !== -1)?`${rankPrefix} NO.${rankIdx+1}`:'近況'} (${target.net>=0?'+'+target.net:target.net})</span></div>`;
};
window.buildHTML = function(list, limitTo20, expertName = null, sportKey = null, prefixBtn = '') {
    // 💡 功能區優化：讓「暫居按鈕」出現在左側，「新增戰績」保持在右側
    let addBtnHtml = (expertName && sportKey && typeof window.adminAddRecord === 'function') ? 
        `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div class="func-left">${prefixBtn}</div>
            <button onclick="window.adminAddRecord('${expertName}', '${sportKey}')" style="background:#10b981; color:white; border:none; padding:5px 12px; border-radius:4px; font-size:13px; font-weight:bold; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,0.1);">➕ 新增戰績</button>
        </div>` : (prefixBtn ? `<div style="margin-bottom:10px;">${prefixBtn}</div>` : '');


    if(!list || list.length === 0) { let hint = ''; if (expertName && window.dataDB[expertName]) { let avail = []; for (let k in window.dataDB[expertName]) { if (window.dataDB[expertName][k].length > 0 && itemNames[k]) avail.push(itemNames[k]); } if (avail.length > 0) hint = `<div style="margin-top:10px;font-size:14px;color:#f59e0b;">💡 該好手主要預測：<b>${avail.join('、')}</b></div>`; } return `${addBtnHtml}<div style="padding:40px 20px;text-align:center;color:#94a3b8;background:#f8fafc;border-radius:8px;">目前項目無數據${hint}</div>`; }
    let show = limitTo20 ? list.slice(0, 20) : list; let html = addBtnHtml;
    for (let i = 0; i < show.length; i += 10) {
        const chunk = show.slice(i, i + 10); let w=0, l=0, n=0; chunk.forEach(r => { const wm = r[1].match(/(\d+)勝/); const lm = r[1].match(/(\d+)敗/); if(wm) w += parseInt(wm[1]); if(lm) l += parseInt(lm[1]); n += parseInt(r[2] || 0); }); const rate = Math.round((w/(w+l))*100) || 0; let sCls = (rate>=55)?"summary-pos":(rate<=40?"summary-neg":"summary-neu");
        html += `<div class="summary-row ${sCls}"><div class="summary-stats">${w}勝 ${l}敗 | 淨勝 ${n>=0?'+'+n:n} | ${rate}%</div></div>`;
        chunk.forEach((r, idx) => { let val = parseInt(r[2] || 0); let bg = val > 0 ? "bg-pos" : (val < 0 ? "bg-neg" : "bg-neu"); let sH = val > 0 ? `<span class="score-pos">+${val}</span>` : (val < 0 ? `<span class="score-neg">${val}</span>` : `<span class="score-neu">0</span>`); let delBtnHtml = (expertName && sportKey && typeof window.adminDelRecord === 'function') ? `<span onclick="window.adminDelRecord('${expertName}', '${sportKey}', '${r[0]}', '${r[1]}')" style="cursor:pointer; position:absolute; right:10px; font-size:14px; filter:grayscale(100%); transition:0.2s;" onmouseover="this.style.filter='none'" onmouseout="this.style.filter='grayscale(100%)'" title="刪除此筆">🗑️</span>` : '';
            html += `<div class="record-row ${bg} ${idx===chunk.length-1 && i+10<show.length?'ten-day-gap':''}"><div class="col-date">${r[0]}</div><div class="col-record">${r[1]}</div><div class="score-wrapper" style="display:flex; align-items:center; position:relative;">${sH}${delBtnHtml}</div></div>`; });


    } return html;
};

window.appendTrendTab = function(key, label, container) { const btn = document.createElement('label'); btn.className = `sport-tab`; btn.innerHTML = label; btn.onclick = () => { document.querySelectorAll('#trendTabContainer .sport-tab').forEach(t => t.classList.remove('active')); btn.classList.add('active'); window.activeTrendSportKey = key; document.getElementById('trendFilters').style.display = 'flex'; window.renderTrendChart(); }; container.appendChild(btn); };
window.setTrendFilter = function(val) { window.activeTrendFilter = val; document.querySelectorAll('.t-filter-btn').forEach(btn => btn.classList.remove('active')); document.getElementById('t-filter-' + val).classList.add('active'); if(window.activeTrendSportKey) window.renderTrendChart(); };
window.openTrendPage = function() { document.getElementById('trendPage').style.display = 'block'; document.body.style.overflow = 'hidden'; };
window.closeTrendPage = function() { document.getElementById('trendPage').style.display = 'none'; document.body.style.overflow = 'auto'; };
window.renderTrendChart = function() {
    if (!window.activeTrendSportKey) return; let key = window.activeTrendSportKey; const chartBody = document.getElementById('trendChartBody'); let systemLatestDate = window.getSystemLatestDate(key); let filterText = window.activeTrendFilter === 'all' ? '歷史總榜' : `近 ${window.activeTrendFilter} 次預測`; document.getElementById('trendChartTitle').innerText = `${itemNames[key]} - 戰績勢力分布 (${filterText})`; chartBody.innerHTML = ''; let chartData = [];
    for (let name in window.dataDB) {
        if (window.dataDB[name][key] && window.dataDB[name][key].length > 0) {
            let records = window.dataDB[name][key]; let diffDays = window.getDaysDiff(records[0][0], systemLatestDate); let isActive = diffDays <= 3; let w30 = 0, l30 = 0;
            records.slice(0, 30).forEach(r => { let wm = r[1].match(/(\d+)勝/); let lm = r[1].match(/(\d+)敗/); if(wm) w30 += parseInt(wm[1]); if(lm) l30 += parseInt(lm[1]); });
            let rate30 = (w30 + l30) > 0 ? Math.round((w30 / (w30 + l30)) * 100) : 0; let rateColor = rate30 >= 55 ? '#16a34a' : (rate30 < 50 ? '#dc2626' : '#64748b'); let baseBadge = `<span style="font-size:12px; border:1px solid ${rateColor}; color:${rateColor}; padding:2px 6px; border-radius:4px; margin-left:8px; background:white; line-height:1;" title="近30次整體勝率">30日 ${rate30}%</span>`;
            let streakStr = ""; let currentStreak = 0; let streakType = null; 
            for(let i=0; i<records.length; i++) { let net = parseInt(records[i][2] || 0); if(net === 0) break; if(streakType === null) streakType = net > 0 ? 'win' : 'loss'; if((streakType === 'win' && net > 0) || (streakType === 'loss' && net < 0)) currentStreak++; else break; }
            if(currentStreak >= 2) streakStr = `<span class="streak-badge ${streakType === 'win' ? 'streak-win' : 'streak-loss'}">${streakType === 'win' ? '🔥' : '❄️'} ${currentStreak}連${streakType === 'win' ? '勝' : '敗'}</span>`;
            let targetRecords = window.activeTrendFilter === 'all' ? records : records.slice(0, parseInt(window.activeTrendFilter));
            if (targetRecords.length > 0) { let totalNet = targetRecords.reduce((sum, r) => sum + parseInt(r[2] || 0), 0); chartData.push({ name, net: totalNet, streak: streakStr, baseBadge: baseBadge, isActive }); }
        }
    }
    chartData.sort((a, b) => { if (a.isActive && !b.isActive) return -1; if (!a.isActive && b.isActive) return 1; return b.net - a.net; });
    if (chartData.length === 0) return chartBody.innerHTML = '<p style="text-align:center; padding:50px; color:#999; font-weight:bold; font-size:18px;">該項目此區間段尚無數據</p>';
    const maxNet = Math.max(...chartData.map(d => Math.abs(d.net))); const scale = maxNet === 0 ? 1 : maxNet;
    chartData.forEach((d, i) => { const barWidth = (Math.abs(d.net) / scale) * 100; const barColorClass = d.isActive ? (d.net >= 0 ? 'bar-pos' : 'bar-neg') : ''; const inactiveStyle = !d.isActive ? 'background: #cbd5e1;' : ''; const nameColor = d.isActive ? '#1e293b' : '#94a3b8'; const sign = d.net > 0 ? '+' : ''; chartBody.innerHTML += `<div class="bar-row" style="animation-delay: ${i * 0.05}s; opacity: ${d.isActive ? 1 : 0.6};"><div class="bar-name" style="color: ${nameColor};">${d.isActive ? d.streak : '<span class="streak-badge" style="background:#e2e8f0; color:#64748b;">💤 休眠</span>'} ${d.isActive ? d.baseBadge : ''}<span style="margin-left:10px; text-decoration: ${d.isActive ? 'none' : 'line-through'};">${d.name}</span></div><div class="bar-wrapper"><div class="bar-fill ${barColorClass}" style="width: ${barWidth}%; ${inactiveStyle}">${Math.abs(d.net) > 0 ? sign + d.net : ''}</div></div><div class="bar-val" style="color: ${nameColor};">${sign}${d.net}</div></div>`; });
};