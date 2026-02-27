/* ========================================== */
/* ==== 【開發模組：金鑰驗證 - auth.js】 ==== */
/* ========================================== */

// 1. 網頁一載入時，先默默檢查有沒有登入過
document.addEventListener('DOMContentLoaded', () => {
    const savedKey = sessionStorage.getItem('verifiedKey');

    if (typeof SYSTEM_DAILY_KEY !== 'undefined' && savedKey === SYSTEM_DAILY_KEY) {
        // 已經登入過：直接隱藏鎖屏，讓背後的主畫面露出來
        document.getElementById('authGate').style.display = 'none';
        
        // （由於 HTML 中我們已經讓主畫面顯示，且觸發了 init()，這裡就不需要再重複做了）
    } else {
        // 沒登入過或密碼已更新：鎖屏畫面預設就是顯示的，不需要額外動作
    }
});

// 2. 當用戶在畫面上點擊「解鎖看板」按鈕時執行的動作
function checkPasscode() {
    const userInput = document.getElementById('passcodeInput').value;
    const errorMsg = document.getElementById('errorMsg');
    
    if (userInput === SYSTEM_DAILY_KEY) {
        // ✅ 密碼正確：把密碼存進瀏覽器記憶體
        sessionStorage.setItem('verifiedKey', SYSTEM_DAILY_KEY);
        
        // 隱藏鎖屏，這時背後已經渲染好的主畫面就會完美呈現
        document.getElementById('authGate').style.display = 'none';
        
    } else {
        // ❌ 密碼錯誤：顯示錯誤提示字眼
        errorMsg.style.display = 'block';
        
        // 給輸入框一個小小的震動特效（質感提升）
        const authBox = document.querySelector('.auth-box');
        if (authBox) {
            authBox.style.transform = 'translateX(10px)';
            setTimeout(() => authBox.style.transform = 'translateX(-10px)', 100);
            setTimeout(() => authBox.style.transform = 'translateX(0)', 200);
        }
    }
}

// 3. 支援按下 Enter 鍵直接解鎖
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('passcodeInput');
    if(input) {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') checkPasscode();
        });
    }
});