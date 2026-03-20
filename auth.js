/* ========================================== */
/* ==== 【開發模組：雙軌金鑰驗證 - auth.js】 ==== */
/* ==== (V15.4 終極地雷版：1點擊+滑動即死) ==== */
/* ========================================== */

let isRestrictedMode = false; 
let validClickCount = 0;      
let hasLockedDown = false;    // 🔒 新增：確保鎖定咒語只會執行一次
const MAX_CLICKS = 1;         
const FREE_DAYS_LIMIT = 17;    

// 🌟 【新增】雙參數雷達：網址參數解析與記憶 (含防禦型計次)
async function trackReferrals() {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    const authorCode = urlParams.get('author');

    if (refCode) localStorage.setItem('qiJu_ref', refCode);
    if (authorCode) localStorage.setItem('qiJu_author', authorCode);

    // 🛡️ 防禦型點擊偵測：每人每天針對同一個推薦碼只發送一次 API
    if (refCode) {
        const today = new Date().toLocaleDateString('en-CA');
        const clickKey = `click_sent_${refCode}_${today}`;
        
        if (!localStorage.getItem(clickKey)) {
            try {
                // 🚀 呼叫 Vercel 後端 API 增加點擊數
                fetch('/api/track-click', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refCode: refCode })
                });
                localStorage.setItem(clickKey, 'true'); 
            } catch (e) {
                console.error("點擊追蹤失敗", e);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    trackReferrals();

    // 🕵️ 改良版後門：延遲 300 毫秒再啟動地雷模式，確保 localStorage 寫入完成
    if (window.location.search.includes('test=lock')) {
        setTimeout(() => {
            // 🛑 新增防護：如果本地已經有合法金鑰(已解鎖)，就直接作廢地雷！
            if (localStorage.getItem('qiJu_Key')) return;
            
            isRestrictedMode = true;
            console.log("🕵️ 管理員測試模式：推薦碼已紀錄，地雷已就緒");
        }, 300);
    }

    // ⚡ 瞬開魔法：讀取新的統一永久記憶
    let ADMIN_KEY = '';
    try { if (typeof config !== 'undefined') ADMIN_KEY = atob(config.adminCode); } catch(e) {}

    const localKey = localStorage.getItem('qiJu_Key');
    const expiresAt = localStorage.getItem('qiJu_ExpiresAt');

    if (localKey) {
        if (ADMIN_KEY && localKey === ADMIN_KEY) {
            window.isAdmin = true;
            fullUnlockSystem();
            return;
        }

        if (expiresAt) {
            const now = new Date();
            const expireDate = new Date(expiresAt);
            if (now < expireDate) {
                console.log('⚡ 金鑰尚在有效期限內，瞬間解鎖！');
                window.isAdmin = false;
                fullUnlockSystem();
                return;
            } else {
                localStorage.removeItem('qiJu_Key');
                localStorage.removeItem('qiJu_ExpiresAt');
            }
        } else {
            localStorage.removeItem('qiJu_Key');
        }
    }

    trackVisitorDays();
    window.isAdmin = false;
    openDoorForVisitor(); 
});

function trackVisitorDays() {
    const today = new Date().toLocaleDateString('en-CA'); 
    let visitedDays = JSON.parse(localStorage.getItem('qiJuVisitedDays')) || [];

    if (!visitedDays.includes(today)) {
        visitedDays.push(today);
        localStorage.setItem('qiJuVisitedDays', JSON.stringify(visitedDays));
    }

    if (visitedDays.length > FREE_DAYS_LIMIT) {
        isRestrictedMode = true; 
    }
}

// 全域點擊攔截
document.addEventListener('click', (e) => {
    if (!isRestrictedMode || hasLockedDown) return;
    if (e.target.closest('#authGate')) return;

    validClickCount++;

    if (validClickCount === 1) {
        // 🎯 第 1 次點擊：放行他，但偷偷埋下「滑動地雷」
        armMovementTrap();
    } else if (validClickCount > 1) {
        // 如果他手速極快，在地雷啟動前又點了第 2 下，直接引爆
        e.preventDefault();  
        e.stopPropagation(); 
        triggerLockdown();
    }
}, true); 

// 💣 埋設滑動地雷 (延遲 0.8 秒啟動，給他看完第1次點擊效果的時間)
function armMovementTrap() {
    setTimeout(() => {
        if (hasLockedDown) return; 

        // 監聽：滑鼠移動、頁面滾動、手機觸控滑動、鍵盤按壓
        const trapEvents = ['mousemove', 'scroll', 'touchmove', 'keydown'];
        
        const detonateTrap = (e) => {
            if (hasLockedDown) return;
            // 如果他的滑鼠是在金鑰視窗裡面動，就不理他
            if (e.target && e.target.closest && e.target.closest('#authGate')) return;
            
            // 💥 引爆地雷！瞬間鎖死！
            triggerLockdown();

            // 拆除地雷監聽器 (避免重複觸發浪費效能)
            trapEvents.forEach(evt => document.removeEventListener(evt, detonateTrap, true));
        };

        // 把地雷掛載到全網頁
        trapEvents.forEach(evt => document.addEventListener(evt, detonateTrap, true));
        console.log("💣 滑動地雷已佈署！滑鼠一動即刻鎖死！");

    }, 800); // 800 毫秒的黃金延遲
}

// 🎯 關門放狗 + 終極鎖死 + 抹除泡泡框
function triggerLockdown() {
    if (hasLockedDown) return; 
    hasLockedDown = true; // 標記為已死亡狀態

    const authGate = document.getElementById('authGate');
    const mainContent = document.getElementById('mainContent');
    
    if (authGate) {
        authGate.style.display = 'block'; 
        authGate.classList.add('scatter-fly-in');  

        // 🚫 【終極鎖死魔法 1】禁止滾動、禁止反白、背景點擊失效
        document.body.style.overflow = 'hidden'; 
        document.body.style.userSelect = 'none'; 
        if (mainContent) {
            mainContent.style.pointerEvents = 'none'; 
            mainContent.style.filter = 'blur(8px)';   
        }

        // 🚫 【終極鎖死魔法 2】強制抹除所有推薦泡泡框！(防偷看)
        if (!document.getElementById('nukeTooltipsStyle')) {
            const style = document.createElement('style');
            style.id = 'nukeTooltipsStyle';
            style.innerHTML = `
                .pick-tooltip-container, .pick-tooltip {
                    display: none !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                    transform: scale(0) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

async function checkPasscode() {
    let userInput = '';
    let errorMsg = null;
    
    const iframe = document.querySelector('#authGate iframe');
    if (iframe && iframe.contentWindow) {
        const iframeDoc = iframe.contentWindow.document;
        const inputEl = iframeDoc.getElementById('passcodeInput');
        if (inputEl) userInput = inputEl.value;
        errorMsg = iframeDoc.getElementById('errorMsg');
    } else {
        const inputEl = document.getElementById('passcodeInput');
        if (inputEl) userInput = inputEl.value;
        errorMsg = document.getElementById('errorMsg');
    }
    
    if (!userInput) return;


    // 管理員金鑰走原本邏輯
    try {
        const ADMIN_KEY = atob(config.adminCode);
        if (userInput === ADMIN_KEY) {
            window.isAdmin = true;
            localStorage.setItem('qiJu_Key', ADMIN_KEY);
            const adminExpire = new Date();
            adminExpire.setDate(adminExpire.getDate() + 30); // 給管理員 30 天免再輸入
            localStorage.setItem('qiJu_ExpiresAt', adminExpire.toISOString());
            fullUnlockSystem();
            return;
        }
    } catch(e) {}

    // 會員金鑰走 API 驗證
    try {
        // 🚀 共存智慧分流：以金鑰是否包含 "V2" (不分大小寫) 來決定走哪支 API
        const isV2Key = userInput.toUpperCase().includes('V2');
        const apiUrl = isV2Key ? '/api/verify-key-v2' : '/api/verify-key';
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: userInput })
        });

        const result = await response.json(); // 👈 就是這行！把它補回來！


        if (result.valid) {
            // 🛑 【新增】前端雙重防護：檢查後端傳來的剩餘天數，或到期時間是否已經過期
            const isExpiredByDays = result.remaining_days !== undefined && result.remaining_days <= 0;
            const isExpiredByDate = result.expires_at && (new Date(result.expires_at) <= new Date());

            if (isExpiredByDays || isExpiredByDate) {
                // 就算後端說 valid，只要天數 <= 0 或時間過了，強制判定為過期！
                if (errorMsg) {
                    errorMsg.style.display = 'block';
                    errorMsg.innerHTML = '❌ 金鑰已過期，請聯絡版大續約';
                }
                // 清除可能殘留的本地記憶，防止刷新後又跑進來
                localStorage.removeItem('qiJu_Key');
                localStorage.removeItem('qiJu_ExpiresAt');
                return; // 終止執行，不准開門！
            }

            // ⚡ 統一改為永久記憶，並加上到期時間防呆
            localStorage.setItem('qiJu_Key', userInput);
            let expireDateStr = result.expires_at;
            if (!expireDateStr) {
                const tomorrow = new Date();
                tomorrow.setHours(tomorrow.getHours() + 24);
                expireDateStr = tomorrow.toISOString();
            }
            localStorage.setItem('qiJu_ExpiresAt', expireDateStr);
            
            sessionStorage.removeItem('verifiedKey'); // 順便幫使用者清掉舊版垃圾
            localStorage.removeItem('verifiedKey_v2');
            
            // 新制額外提示剩餘天數
            if (result.remaining_days !== undefined) {
                alert(`✅ 驗證成功！剩餘天數：${result.remaining_days} 天`);
            }
            
            window.isAdmin = false;
            fullUnlockSystem();
        } else {
            if (errorMsg) errorMsg.style.display = 'block';
            if (result.reason === 'used') {
                if (errorMsg) errorMsg.innerHTML = '❌ 此金鑰已被使用過';
            } else if (result.reason === 'expired') {
                if (errorMsg) errorMsg.innerHTML = '❌ 金鑰已過期，請聯絡版大續約';
            } else {
                if (errorMsg) errorMsg.innerHTML = '❌ 密鑰錯誤或已過期';
            }
        }
    
    } catch (e) {
        if (errorMsg) {
            errorMsg.style.display = 'block';
            errorMsg.innerHTML = '❌ 系統錯誤，請稍後再試';
        }
    }
}
function openDoorForVisitor() {
    const authGate = document.getElementById('authGate');
    const mainContent = document.getElementById('mainContent');
    
    if (authGate) authGate.style.display = 'none'; 
    if (mainContent) mainContent.style.display = 'block'; 

    if (typeof window.init === 'function') window.init(); 
}

// 輸入正確密碼後的「完全解鎖與恢復原狀」
function fullUnlockSystem() {
    const authGate = document.getElementById('authGate');
    const mainContent = document.getElementById('mainContent');
    
    if (authGate) {
        authGate.classList.remove('scatter-fly-in');
        authGate.style.display = 'none'; 
    }
    if (mainContent) mainContent.style.display = 'block';

    // 🔓 解除所有鎖死魔法
    document.body.style.overflow = '';
    document.body.style.userSelect = '';
    if (mainContent) {
        mainContent.style.pointerEvents = '';
        mainContent.style.filter = '';
    }

    // 🔓 移除抹除泡泡框的咒語
    const nukeStyle = document.getElementById('nukeTooltipsStyle');
    if (nukeStyle) nukeStyle.remove();

    isRestrictedMode = false;
    validClickCount = 0;
    hasLockedDown = false; // 重置地雷狀態

    if (window.isAdmin === true) {
        if (typeof window.initAdminWidget === 'function') window.initAdminWidget();
        if (typeof window.initBackupWidget === 'function') window.initBackupWidget();
    }

    if (typeof window.init === 'function') window.init();
}

document.addEventListener('keypress', (e) => {
    const authGate = document.getElementById('authGate');
    if (authGate && authGate.style.display !== 'none' && e.key === 'Enter') {
        checkPasscode();
    }
});

// 🌟 【新增】LINE 收網組裝機：動態產生帶有記憶參數的官方連結
window.getDynamicLineUrl = function() {
    const LINE_OFFICIAL_ID = "@yhd0256r"; 
    const ref = localStorage.getItem('qiJu_ref');
    const author = localStorage.getItem('qiJu_author');
    
    let message = "版大你好，我要買金鑰！";
    if (author && ref && author !== ref) {
        message += ` (原創碼：${author}，推廣碼：${ref})`;
    } else if (ref || author) {
        const singleCode = ref || author;
        message += ` (推薦碼：${singleCode})`;
    } else {
        message += ` (無推薦人)`;
    }

    return `https://line.me/R/oaMessage/${LINE_OFFICIAL_ID}/?${encodeURIComponent(message)}`;
};

// 🌟 【新增】推廣者專用：產生雙軌分潤連結
window.generateShareLink = function(authorCode, promoterCode) {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?author=${authorCode}&ref=${promoterCode}`;
};