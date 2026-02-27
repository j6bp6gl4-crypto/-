/* ============================================================== */
/* ==== 【模組 C：外掛包】 (V14.0 終極修復版 + 完整口袋系統) ==== */
/* ============================================================== */

/**
 * --------------------------------------------------------------
 * 🛠️ [PART 1: 核心管理員操作模組]
 * --------------------------------------------------------------
 */
window.adminDelRecord = function(expertName, sportKey, dateStr, wlStr) { 
    const confirmMsg = `⚠️ 安全確認\n\n您即將刪除：${expertName}\n項目：${sportKey}\n日期：${dateStr}\n戰績：[${wlStr}]\n\n確定執行此操作且無法復原？`;
    if(!confirm(confirmMsg)) return; 
    
    if (window.dataDB[expertName] && window.dataDB[expertName][sportKey]) {
        let idx = window.dataDB[expertName][sportKey].findIndex(r => r[0] === dateStr && r[1] === wlStr); 
        if(idx > -1) { 
            window.dataDB[expertName][sportKey].splice(idx, 1); 
            localStorage.setItem('DashboardDB_V62_Final', JSON.stringify(window.dataDB)); 
            if (typeof window.renderDisplay === 'function') window.renderDisplay(); 
            if (typeof window.init === 'function') window.init(); 
        } 
    }
};

window.adminAddRecord = function(expertName, sportKey) { 
    let dateInput = prompt(`【手動新增紀錄】\n專家：${expertName}\n項目：${sportKey}\n\n請輸入日期 (格式 MM/DD):`, "02/25"); 
    if(!dateInput) return; 
    
    let wlInput = prompt(`請輸入戰績文字 (例如: 2勝 1敗):`); 
    if(!wlInput) return; 
    
    let netInput = prompt(`請輸入淨勝場次 (例如: +1 或 -2):`); 
    if(!netInput) return; 
    
    if(!window.dataDB[expertName]) window.dataDB[expertName] = {};
    if(!window.dataDB[expertName][sportKey]) window.dataDB[expertName][sportKey] = []; 
    
    let finalNet = netInput.includes('+') ? netInput : (parseInt(netInput) >= 0 ? '+' + netInput : netInput);
    window.dataDB[expertName][sportKey].unshift([dateInput, wlInput, finalNet]); 
    
    const currentYear = new Date().getFullYear(); 
    window.dataDB[expertName][sportKey].sort((a, b) => { 
        const parseDate = (dStr) => { 
            let d = new Date(`${currentYear}/${dStr}`); 
            if (d.getMonth() === 11 && new Date().getMonth() <= 2) d.setFullYear(currentYear - 1); 
            return d.getTime(); 
        }; 
        return parseDate(b[0]) - parseDate(a[0]); 
    }); 
    
    localStorage.setItem('DashboardDB_V62_Final', JSON.stringify(window.dataDB)); 
    if (typeof window.renderDisplay === 'function') window.renderDisplay(); 
    if (typeof window.init === 'function') window.init(); 
};

/**
 * --------------------------------------------------------------
 * 💾 [PART 2: 數據庫備份匯出模組]
 * --------------------------------------------------------------
 */
window.exportToDataJS = function() { 
    let output = "/* ============================================================== */\n";
    output += "/* ==== 【數據庫模組 - data.js】(管理系統自動匯出版本) ==== */\n";
    output += "/* ============================================================== */\n\n";
    output += "const defaultDB = " + JSON.stringify(window.dataDB, null, 4) + ";\n\n"; 
    output += "// 以上代碼已包含最新所有戰績，請全選覆蓋 data.js 的內容。";

    navigator.clipboard.writeText(output).then(() => { 
        alert("🎉 完整數據庫代碼已成功複製到剪貼簿！\n\n1. 開啟您的 data.js 檔案\n2. 全選並刪除所有內容\n3. 貼上剛才複製的內容並存檔\n\n一切就大功告成了！"); 
    }).catch(err => { 
        alert("❌ 複製失敗，請至瀏覽器控制台手動選取輸出內容。"); 
        console.log(output);
    }); 
};

setTimeout(() => { 
    if(!document.getElementById('exportBtn')){
        const btn = document.createElement("div"); 
        btn.id = 'exportBtn';
        btn.innerHTML = "💾 備份與匯出實體檔案代碼"; 
        btn.style.cssText = "position:fixed; bottom:25px; right:25px; background:linear-gradient(135deg, #1877f2, #0056b3); color:white; padding:14px 22px; border-radius:50px; cursor:pointer; font-weight:bold; box-shadow:0 6px 20px rgba(0,0,0,0.4); z-index:9999; border: 1px solid rgba(255,255,255,0.2); transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);"; 
        btn.onmouseover = function() { this.style.transform = "scale(1.05) translateY(-3px)"; };
        btn.onmouseout = function() { this.style.transform = "scale(1) translateY(0)"; };
        btn.onclick = window.exportToDataJS; 
        document.body.appendChild(btn); 
    }
}, 1800);

/**
 * --------------------------------------------------------------
 * 🎛️ [PART 3: 賽果智能結構化分流中心] (V14.0 拔除 .5 陷阱修復版)
 * --------------------------------------------------------------
 */
(function initAdminWidget() {
    if (!document.getElementById('adminWidgetStyle')) {
        const style = document.createElement('style'); style.id = 'adminWidgetStyle';
        style.innerHTML = `
            .admin-widget-btn { position: fixed; top: 25px; left: 25px; z-index: 9998; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 12px 20px; border-radius: 10px; font-weight: bold; cursor: pointer; border: 1px solid rgba(255,255,255,0.3); box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: 0.3s; }
            .admin-widget-btn:hover { background: linear-gradient(135deg, #2563eb, #1e40af); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4); }
            .admin-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(12px); z-index: 10000; display: none; justify-content: center; align-items: center; opacity: 0; transition: 0.4s ease; }
            .admin-modal-overlay.show { display: flex; opacity: 1; }
            .admin-modal-content { background: #1e293b; width: 95%; max-width: 850px; border-radius: 24px; border: 1px solid #334155; overflow: hidden; display: flex; flex-direction: column; max-height: 92vh; box-shadow: 0 30px 100px rgba(0,0,0,0.8); transform: translateY(30px); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            .admin-modal-overlay.show .admin-modal-content { transform: translateY(0); }
            .admin-modal-header { background: #0f172a; padding: 20px 28px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; }
            .admin-tab { flex: 1; text-align: center; padding: 16px; color: #94a3b8; font-weight: 900; cursor: pointer; border-bottom: 3px solid transparent; transition: 0.3s; letter-spacing: 1px; }
            .admin-tab.active { color: #fbbf24; background: #1e293b; border-bottom-color: #fbbf24; }
            .admin-input { width: 60px; height: 38px; text-align: center; background: #020617; border: 1px solid #475569; color: #fbbf24; border-radius: 8px; font-weight: 900; font-size: 16px; outline: none; }
            .admin-input:focus { border-color: #3b82f6; box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); }
            .settle-card { background: #334155; padding: 20px; border-radius: 20px; margin-bottom: 18px; border-left: 8px solid #10b981; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
            .group-box { background: rgba(15, 23, 42, 0.6); border-radius: 15px; padding: 15px; margin-top: 15px; border: 1px solid rgba(255,255,255,0.05); }
            .group-title { font-size: 13px; font-weight: 900; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; }
            .badge-team { color: #3b82f6; text-transform: uppercase; } 
            .badge-total { color: #a78bfa; text-transform: uppercase; }
            .status-warn { background: #b45309; color: white; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; }
            .item-tag { background: rgba(255,255,255,0.1); color: #f8fafc; padding: 4px 10px; border-radius: 6px; font-size: 14px; font-weight: bold; margin-bottom: 8px; display: inline-block; margin-right: 8px; border: 1px solid rgba(255,255,255,0.05); }
        `; document.head.appendChild(style);
    }

    const btn = document.createElement('div'); btn.className = 'admin-widget-btn'; btn.innerHTML = '🤖 啟動智能分流結算中心'; document.body.appendChild(btn);
    const overlay = document.createElement('div'); overlay.className = 'admin-modal-overlay';
    overlay.innerHTML = `
        <div class="admin-modal-content">
            <div class="admin-modal-header">
                <div style="display:flex; flex-direction:column;">
                    <h3 style="color:white;margin:0;font-size:20px;letter-spacing:1px;">🤖 結構化項目分流歸位系統</h3>
                    <small style="color:#94a3b8;font-size:11px;margin-top:4px;">版本號：V14.0 (徹底修復 76人與 .5 讓分誤判)</small>
                </div>
                <div style="color:#94a3b8;cursor:pointer;font-size:40px;line-height:1;" onclick="closeAdminModal()">&times;</div>
            </div>
            <div id="adminTabs" style="display:flex;background:#0f172a;">
                <div class="admin-tab active" onclick="switchAdminTab('NBA', this)">🏀 NBA 美國職籃</div>
                <div class="admin-tab" onclick="switchAdminTab('MLB', this)">⚾ MLB 美國職棒</div>
            </div>
            <div id="adminMainArea" style="padding:24px; overflow-y:auto; flex:1; background: #1e293b;"></div>
            <div id="adminFooter" style="padding:20px; border-top:1px solid #334155; background:#0f172a;"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    let curTab = 'NBA';
    btn.onclick = () => { overlay.classList.add('show'); renderInputStage(); };
    window.closeAdminModal = () => overlay.classList.remove('show');
    window.switchAdminTab = (t, el) => { curTab = t; document.querySelectorAll('.admin-tab').forEach(x=>x.classList.remove('active')); el.classList.add('active'); renderInputStage(); };

    function renderInputStage() {
        const listArea = document.getElementById('adminMainArea');
        const schedule = (typeof todaySchedule !== 'undefined') ? todaySchedule[curTab] : [];
        let html = schedule.map((m, i) => `
            <div style="display:flex;align-items:center;justify-content:space-between;background:#334155;padding:18px;border-radius:18px;margin-bottom:12px;border:1px solid #475569;box-shadow:inset 0 2px 4px rgba(0,0,0,0.1);">
                <div style="color:white;width:35%;text-align:center;font-weight:900;font-size:18px;">${m[0]}</div>
                <div style="display:flex;align-items:center;gap:15px;"><input type="number" id="away_${i}" class="admin-input"> <b style="color:#94a3b8;font-size:14px;">VS</b> <input type="number" id="home_${i}" class="admin-input"></div>
                <div style="color:white;width:35%;text-align:center;font-weight:900;font-size:18px;">${m[1]}</div>
            </div>`).join('');
        listArea.innerHTML = html || '<div style="color:#94a3b8;text-align:center;padding:80px;font-size:18px;font-weight:bold;">😢 本日暫無賽程資料</div>';
        document.getElementById('adminFooter').innerHTML = `<button onclick="startAutoClassificationSettle()" style="width:100%;padding:18px;background:#10b981;color:white;border:none;border-radius:15px;font-weight:bold;cursor:pointer;font-size:20px;box-shadow: 0 10px 25px rgba(16,185,129,0.3); letter-spacing:2px;">⚡ 輸入比分完畢，啟動項目細分對獎</button>`;
    }

    window.startAutoClassificationSettle = () => {
        const schedule = todaySchedule[curTab] || [];
        let matches = [];
        let allTeams = [];
        schedule.forEach((m, i) => {
            let a = parseInt(document.getElementById(`away_${i}`).value);
            let h = parseInt(document.getElementById(`home_${i}`).value);
            if(!isNaN(a) && !isNaN(h)) { matches.push({ away: m[0], home: m[1], aScore: a, hScore: h }); }
            allTeams.push(m[0], m[1]); 
        });
        if(matches.length === 0) return alert("請至少輸入一場正式比分！");

        let settleHtml = `<div style="color:#34d399;font-weight:bold;margin-bottom:25px;background:#020617;padding:18px;border-radius:15px;font-size:15px;border:1px solid #1e293b;line-height:1.8;">📌 本日賽果參考 (以此為對獎基準)：<br>${matches.map(m=>`<span style="background:#1e293b;padding:2px 8px;border-radius:5px;margin-right:8px;color:#f8fafc;">${m.away} <b style="color:#fbbf24;">${m.aScore}:${m.hScore}</b> ${m.home}</span>`).join(' ')}</div>`;
        
        Object.keys(window.dataDB).forEach(name => {
            let raw = todayPicks[name] || ""; if(!raw.trim()) return;
            
            // 🔴 項目防火牆 
            let pickContext = "";
            let segs = raw.split(/(NBA推薦|MLB推薦|美籃推薦|美棒推薦|美棒隊伍|美籃隊伍)/i);
            const targetHead = curTab === 'NBA' ? /NBA推薦|美籃推薦|美籃隊伍/i : /MLB推薦|美棒推薦|美棒隊伍/i;
            for(let i=0; i<segs.length; i++){
                if(targetHead.test(segs[i])){
                    pickContext = segs[i+1] || "";
                    let nextTag = pickContext.match(/(NBA推薦|MLB推薦|美籃推薦|美棒推薦|美棒隊伍|美籃隊伍)/i);
                    if(nextTag) pickContext = pickContext.substring(0, nextTag.index);
                    break;
                }
            }
            if(!pickContext && !/(NBA推薦|MLB推薦|美籃推薦|美棒推薦)/i.test(raw)) pickContext = raw;
            if(!pickContext) return;

            // 🟢 V14.0 切割法：支援所有別名與錯字
            let parsedText = pickContext.replace(/\n/g, '|'); 
            allTeams.forEach(team => {
                parsedText = parsedText.split(team).join(`|${team}`);
                // 替換別名
                if (team.includes('七六') || team.includes('76')) parsedText = parsedText.replace(/76人?/g, m => `|${m}`);
                if (team.match(/[賽塞]爾/)) parsedText = parsedText.replace(/[賽塞]爾(?:提克)?/g, m => `|${m}`);
                if (team.includes('獨行') || team.includes('小牛')) parsedText = parsedText.replace(/小牛|獨行俠?/g, m => `|${m}`);
                if (team.includes('拓荒')) parsedText = parsedText.replace(/拓荒(?:者)?/g, m => `|${m}`);
            });
            parsedText = parsedText.replace(/\|+/g, '|'); 

            let res = { team: { w:0, l:0, n:0, items:[] }, total: { w:0, l:0, n:0, items:[] }, warn: false };
            let rawLines = parsedText.split('|').map(s=>s.trim()).filter(s=>s);

            rawLines.forEach(seg => {
                let matchedMatch = matches.find(m => {
                    const checkAlias = (t) => {
                        if (seg.includes(t)) return true;
                        if ((t.includes('七六') || t.includes('76')) && seg.match(/76人?|七六人?/)) return true;
                        if (t.match(/[賽塞]爾/) && seg.match(/[賽塞]爾(?:提克)?/)) return true;
                        if ((t.includes('獨行') || t.includes('小牛')) && seg.match(/小牛|獨行俠?/)) return true;
                        if (t.includes('拓荒') && seg.match(/拓荒(?:者)?/)) return true;
                        return false;
                    };
                    return checkAlias(m.away) || checkAlias(m.home);
                });

                if (!matchedMatch) return; 

                // 🟢 終極分類修正：只認「大、小、總分」，拔除 \.5 的致命陷阱！
                let isTotal = /(大|小|總分)/.test(seg);
                let target = isTotal ? res.total : res.team;
                
                const checkAliasStrict = (t) => {
                    if (seg.includes(t)) return true;
                    if ((t.includes('七六') || t.includes('76')) && seg.match(/76人?|七六人?/)) return true;
                    if (t.match(/[賽塞]爾/) && seg.match(/[賽塞]爾(?:提克)?/)) return true;
                    if ((t.includes('獨行') || t.includes('小牛')) && seg.match(/小牛|獨行俠?/)) return true;
                    if (t.includes('拓荒') && seg.match(/拓荒(?:者)?/)) return true;
                    return false;
                };

                let isPickAway = checkAliasStrict(matchedMatch.away);
                let pScore = isPickAway ? matchedMatch.aScore : matchedMatch.hScore;
                let oScore = isPickAway ? matchedMatch.hScore : matchedMatch.aScore;
                let totalScore = matchedMatch.aScore + matchedMatch.hScore;

                if(isTotal) {
                    // 🛡️ 76人數字防護盾：在抓取大小分門檻(如230.5)前，先隱藏隊伍名稱裡的數字，防止誤抓 76！
                    let cleanSeg = seg.replace(matchedMatch.away, '').replace(matchedMatch.home, '').replace(/76人?|七六人?/g, '');
                    let valMatch = cleanSeg.match(/(\d+\.?\d*)/);
                    
                    if(valMatch) {
                        let threshold = parseFloat(valMatch[1]);
                        if (seg.includes('大')) {
                            if (totalScore > threshold) { target.w++; target.n++; }
                            else if (totalScore < threshold) { target.l++; target.n--; }
                        } else if (seg.includes('小')) {
                            if (totalScore < threshold) { target.w++; target.n++; }
                            else if (totalScore > threshold) { target.l++; target.n--; }
                        } else {
                            res.warn = true; // 有數字但沒寫大或小
                        }
                        target.items.push(seg);
                    } else { 
                        res.warn = true; target.items.push(seg); 
                    }
                } else {
                    let spreadMatch = seg.match(/([+-]\s*\d+\.?\d*)/) || seg.match(/(受讓|讓)\s*(\d+\.?\d*)/);
                    let spread = 0;
                    if(spreadMatch) {
                        if(spreadMatch[0].includes('受讓')) spread = parseFloat(spreadMatch[2]);
                        else if(spreadMatch[0].includes('讓')) spread = -parseFloat(spreadMatch[2]);
                        else spread = parseFloat(spreadMatch[0].replace(/\s/g,''));
                    }
                    if((pScore + spread) > oScore) { target.w++; target.n++; }
                    else if((pScore + spread) < oScore) { target.l++; target.n--; }
                    else { /* 走水不計 */ }
                    target.items.push(seg);
                }
            });

            if(res.team.items.length > 0 || res.total.items.length > 0) {
                settleHtml += `
                <div class="settle-card">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <span style="color:#60a5fa;font-weight:900;font-size:20px;letter-spacing:1px;">👤 ${name}</span>
                        ${res.warn ? '<span class="status-warn">⚠️ 盤口特殊，建議手動複查</span>' : '<span style="color:#10b981;font-size:13px;font-weight:bold;">✅ 結構分流判讀完成</span>'}
                    </div>
                    <div class="group-box">
                        ${res.team.items.length > 0 ? `
                        <div class="group-title badge-team">🟦 隊伍推薦 - 上方分流區</div>
                        <div style="margin-bottom:12px;">${res.team.items.map(it=>`<span class="item-tag">${it}</span>`).join('')}</div>
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
                            <div style="background:#0f172a;padding:5px 12px;border-radius:8px;border:1px solid #475569;">
                                <input type="number" class="admin-input val-w" data-name="${name}" data-type="team" value="${res.team.w}"> 勝 
                                <input type="number" class="admin-input val-l" data-name="${name}" data-type="team" value="${res.team.l}"> 敗
                            </div>
                            <div style="background:#0f172a;padding:5px 12px;border-radius:8px;border:1px solid #475569;">
                                淨 <input type="number" class="admin-input val-n" data-name="${name}" data-type="team" value="${res.team.n}">
                            </div>
                        </div>` : ''}
                        
                        ${res.total.items.length > 0 ? `
                        <div class="group-title badge-total" style="margin-top:15px;">🟪 大小推薦 - 下方分流區</div>
                        <div style="margin-bottom:12px;">${res.total.items.map(it=>`<span class="item-tag" style="border-color:#8b5cf6;">${it}</span>`).join('')}</div>
                        <div style="display:flex;align-items:center;gap:10px;">
                            <div style="background:#0f172a;padding:5px 12px;border-radius:8px;border:1px solid #475569;">
                                <input type="number" class="admin-input val-w" data-name="${name}" data-type="total" value="${res.total.w}"> 勝 
                                <input type="number" class="admin-input val-l" data-name="${name}" data-type="total" value="${res.total.l}"> 敗
                            </div>
                            <div style="background:#0f172a;padding:5px 12px;border-radius:8px;border:1px solid #475569;">
                                淨 <input type="number" class="admin-input val-n" data-name="${name}" data-type="total" value="${res.total.n}">
                            </div>
                        </div>` : ''}
                    </div>
                </div>`;
            }
        });

        document.getElementById('adminMainArea').innerHTML = settleHtml || '<div style="color:#94a3b8;text-align:center;padding:100px;font-size:20px;">此分頁項目本日無對應預測</div>';
        document.getElementById('adminFooter').innerHTML = `<button onclick="executeBatchStructuralSave()" style="width:100%;padding:18px;background:linear-gradient(135deg, #f59e0b, #d97706);color:white;border:none;border-radius:15px;font-weight:bold;cursor:pointer;font-size:20px;box-shadow: 0 10px 30px rgba(245,158,11,0.3);letter-spacing:2px;">🚀 分流核對無誤，一鍵歸位植入資料庫</button>`;
    };

    window.executeBatchStructuralSave = () => {
        let dateKey = prompt("請確認寫入日期 (MM/DD)", "02/25"); if(!dateKey) return;
        let finalCount = 0;
        document.querySelectorAll('.settle-card').forEach(card => {
            let name = card.querySelector('.val-w').getAttribute('data-name');
            ['team', 'total'].forEach(type => {
                let wInp = card.querySelector(`.val-w[data-type="${type}"]`);
                if(wInp) {
                    let w = parseInt(wInp.value) || 0, l = parseInt(card.querySelector(`.val-l[data-type="${type}"]`).value) || 0, n = parseInt(card.querySelector(`.val-n[data-type="${type}"]`).value) || 0;
                    if(w+l > 0) {
                        let k = (curTab==='NBA') ? (type==='team'?'nba_team':'nba_total') : (type==='team'?'mlb_team':'mlb_total');
                        if(!window.dataDB[name][k]) window.dataDB[name][k] = [];
                        
                        let isDup = window.dataDB[name][k].some(r => r[0] === dateKey && r[1] === `${w}勝 ${l}敗`);
                        if(!isDup) {
                            window.dataDB[name][k].unshift([dateKey, `${w}勝 ${l}敗`, (n>=0?'+':'')+n]);
                            finalCount++;
                        }
                    }
                }
            });
        });
        localStorage.setItem('DashboardDB_V62_Final', JSON.stringify(window.dataDB));
        alert(`🎉 歸位成功！\n\n系統已精準植入 ${finalCount} 筆戰績。\n76人、賽爾提克等錯字與別名已全數追回並結算完畢！`); 
        closeAdminModal(); 
        if(typeof window.init === 'function') window.init();
    };
})();

/**
 * --------------------------------------------------------------
 * 📥 [PART 4: 預測口袋收錄系統]
 * --------------------------------------------------------------
 */
(function initPocketWidget() {
    if (!document.getElementById('pocketWidgetStyle')) {
        const style = document.createElement('style'); style.id = 'pocketWidgetStyle';
        style.innerHTML = `
            .floating-pocket-btn { position: fixed; top: 50%; right: -8px; transform: translateY(-50%); z-index: 9995; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 22px 16px 22px 28px; border-radius: 45px 0 0 45px; font-weight: 900; cursor: pointer; box-shadow: -8px 8px 30px rgba(0,0,0,0.5); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; flex-direction: column; align-items: center; gap: 8px; border: 2px solid rgba(255,255,255,0.2); text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
            .floating-pocket-btn:hover { right: 0; background: linear-gradient(135deg, #fbbf24, #f59e0b); padding-right: 22px; transform: translateY(-50%) scale(1.05); }
            .pocket-badge { background: #dc2626; color: white; border-radius: 50%; padding: 3px 10px; font-size: 14px; font-weight: 900; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); position: relative; top: -5px; }
            .pocket-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.88); backdrop-filter: blur(15px); z-index: 10001; display: none; justify-content: center; align-items: center; opacity: 0; transition: 0.4s ease; }
            .pocket-modal-overlay.show { display: flex; opacity: 1; }
            .pocket-modal-content { background: #f8fafc; width: 92%; max-width: 550px; border-radius: 30px; overflow: hidden; box-shadow: 0 50px 120px rgba(0,0,0,0.8); transform: translateY(50px) scale(0.9); transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            .pocket-modal-overlay.show .pocket-modal-content { transform: translateY(0) scale(1); }
            .pocket-modal-header { background: linear-gradient(135deg, #1e293b, #0f172a); padding: 25px 35px; display: flex; justify-content: space-between; align-items: center; color: #fbbf24; border-bottom: 5px solid #fbbf24; }
            .pocket-list { max-height: 55vh; overflow-y: auto; padding: 15px 0; margin: 0; list-style: none; }
            .pocket-item { padding: 25px 35px; border-bottom: 1px solid #e2e8f0; animation: pocketItemIn 0.5s ease-out backwards; }
            @keyframes pocketItemIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
            .pocket-item-name { font-weight: 900; font-size: 24px; color: #0f172a; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
            .pocket-item-text { color: #334155; font-size: 16px; line-height: 1.8; background: white; padding: 20px; border-radius: 20px; border: 1px solid #cbd5e1; box-shadow: inset 0 3px 10px rgba(0,0,0,0.05); font-weight: 500; }
            .pocket-remove-btn { color: #dc2626; font-size: 14px; cursor: pointer; font-weight: bold; background: #fee2e2; padding: 8px 16px; border-radius: 10px; transition: 0.2s; border: 1px solid transparent; }
            .pocket-remove-btn:hover { background: #fca5a5; border-color: #ef4444; }
            .pocket-modal-footer { padding: 30px; text-align: center; background: white; border-top: 1px solid #e2e8f0; }
            .pocket-clear-btn { background: #f1f5f9; color: #64748b; border: 2px solid #cbd5e1; padding: 14px 35px; border-radius: 15px; cursor: pointer; font-weight: 900; transition: 0.3s; font-size: 16px; }
            .pocket-clear-btn:hover { background: #dc2626; color: white; border-color: #dc2626; transform: scale(1.05); }
        `; document.head.appendChild(style);
    }

    const floatBtn = document.createElement('div'); floatBtn.className = 'floating-pocket-btn';
    floatBtn.onclick = () => window.openPocketModal();
    document.body.appendChild(floatBtn);

    const overlay = document.createElement('div'); overlay.className = 'pocket-modal-overlay';
    overlay.innerHTML = `
        <div class="pocket-modal-content">
            <div class="pocket-modal-header">
                <h3 style="margin:0;font-size:24px;letter-spacing:1px;">📥 我的今日精選預測名單</h3>
                <div style="cursor:pointer;font-size:50px;line-height:1;" onclick="closePocketModal()">&times;</div>
            </div>
            <ul class="pocket-list" id="pocketListArea"></ul>
            <div class="pocket-modal-footer">
                <button class="pocket-clear-btn" onclick="clearPocket()">🗑️ 清空所有收錄預測單</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    window.updatePocketWidget = () => {
        if (window.userPocket.length > 0) { 
            floatBtn.style.display = 'flex'; 
            floatBtn.innerHTML = `<span>📥</span><span style="font-size:14px;margin-top:5px;">預測</span><span style="font-size:14px;">收錄</span><span class="pocket-badge">${window.userPocket.length}</span>`; 
        } else { 
            floatBtn.style.display = 'none'; 
        }
    };

    window.openPocketModal = () => {
        const listArea = document.getElementById('pocketListArea'); listArea.innerHTML = '';
        if (window.userPocket.length === 0) { 
            listArea.innerHTML = '<div style="padding: 100px 20px; text-align: center; color: #94a3b8; font-weight:bold; font-size:20px;">您的預測口袋目前空空如也！<br><small style="font-weight:normal;">快去排行榜點擊「➕ 收錄口袋」吧！</small></div>'; 
        } else {
            window.userPocket.forEach((name, index) => {
                let pickText = (typeof todayPicks !== 'undefined' && todayPicks[name]) ? todayPicks[name].replace(/\n/g, '<br>') : '今日該好手尚未發布任何推薦';
                listArea.innerHTML += `
                <li class="pocket-item" style="animation-delay: ${index * 0.1}s;">
                    <div class="pocket-item-name">${name} <span class="pocket-remove-btn" onclick="window.removePocketItem('${name}')">移除</span></div>
                    <div class="pocket-item-text">${pickText}</div>
                </li>`;
            });
        }
        overlay.classList.add('show');
    };

    window.closePocketModal = () => overlay.classList.remove('show');
    
    window.removePocketItem = (name) => {
        const idx = window.userPocket.indexOf(name);
        if(idx > -1) { 
            window.userPocket.splice(idx, 1); 
            localStorage.setItem('UserPocketDB', JSON.stringify(window.userPocket)); 
            window.updatePocketWidget(); 
            window.openPocketModal(); 
            if (typeof window.renderDisplay === 'function') window.renderDisplay(); 
        }
    };

    window.clearPocket = () => {
        if(!confirm('🚨 確定要清空所有的收錄預測單嗎？')) return;
        window.userPocket = []; 
        localStorage.setItem('UserPocketDB', JSON.stringify(window.userPocket)); 
        window.updatePocketWidget(); 
        window.closePocketModal(); 
        if (typeof window.renderDisplay === 'function') window.renderDisplay();
    };

    window.updatePocketWidget();
})();