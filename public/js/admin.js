/**
 * 🔧 ARAB TON GIFTS - ADMIN PANEL SCRIPT
 * Admin Dashboard Management
 */

console.log('📄 admin.js loaded successfully');

// 🔐 Admin Token Management (global للوصول من api.js)
window.adminToken = localStorage.getItem('admin_token');
window.adminTokenExpiry = localStorage.getItem('admin_token_expiry');

// Test: إضافة click listener للـ body للتأكد من الأحداث بتشتغل
document.addEventListener('click', (e) => {
    console.log('🖱️ Global click detected:', e.target.tagName, e.target.className);
}, true);

// ═══════════════════════════════════════════════════════════════
// 🔧 INITIALIZATION
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM Content Loaded - Starting Admin Panel');
    DebugError.add('🎯 Admin panel initializing...', 'info');
    
    console.log('Checking required globals:', {
        CONFIG: !!window.CONFIG,
        Telegram: !!window.Telegram,
        showToast: typeof showToast !== 'undefined'
    });
    
    DebugError.add('🔍 Checking admin authentication...', 'info', {
        hasToken: !!window.adminToken,
        tokenExpiry: window.adminTokenExpiry
    });
    
    try {
        // التحقق من admin token قبل تحميل أي شيء
        checkAdminAuth();
    } catch (error) {
        console.error('❌ Failed to initialize admin panel:', error);
        DebugError.add('❌ Initialization failed', 'error', error);
    }
});

// ═══════════════════════════════════════════════════════════════
// 🔐 ADMIN AUTHENTICATION
// ═══════════════════════════════════════════════════════════════

function checkAdminAuth() {
    console.log('🔐 Checking admin authentication...');
    
    // التحقق من وجود token وصلاحيته
    if (window.adminToken && window.adminTokenExpiry) {
        const expiryDate = new Date(window.adminTokenExpiry);
        const now = new Date();
        
        if (expiryDate > now) {
            console.log('✅ Valid admin token found');
            // إخفاء شاشة Login
            document.getElementById('admin-login-screen').classList.add('hidden');
            // تحميل Dashboard
            initAdminPanel();
            loadDashboardData();
            setupEventListeners();
            return;
        } else {
            console.log('⚠️ Admin token expired');
            // حذف token منتهي الصلاحية
            clearAdminToken();
        }
    }
    
    // عرض شاشة Login
    console.log('🔓 Showing login screen');
    document.getElementById('admin-login-screen').classList.remove('hidden');
}

async function handleAdminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();
    const errorMsg = document.getElementById('login-error-msg');
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const btnText = document.getElementById('login-btn-text');
    const btnLoading = document.getElementById('login-btn-loading');
    
    // إخفاء رسالة الخطأ
    errorMsg.style.display = 'none';
    
    // Disable button
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    
    try {
        // Get Telegram init data
        const initData = window.Telegram?.WebApp?.initData;
        if (!initData) {
            throw new Error('Telegram init data not found');
        }
        
        // إرسال طلب login
        const apiUrl = window.CONFIG.API_URL || window.CONFIG.API_BASE_URL || '';
        const response = await fetch(`${apiUrl}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Telegram-Init-Data': initData
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // حفظ token
            window.adminToken = data.admin_token;
            window.adminTokenExpiry = data.expires_at;
            localStorage.setItem('admin_token', window.adminToken);
            localStorage.setItem('admin_token_expiry', window.adminTokenExpiry);
            
            console.log('✅ Admin login successful');
            
            // إخفاء شاشة Login
            document.getElementById('admin-login-screen').classList.add('hidden');
            
            // تحميل Dashboard
            initAdminPanel();
            loadDashboardData();
            setupEventListeners();
            
        } else {
            throw new Error(data.error || 'فشل تسجيل الدخول');
        }
        
    } catch (error) {
        console.error('❌ Login error:', error);
        errorMsg.textContent = error.message || 'حدث خطأ أثناء تسجيل الدخول';
        errorMsg.style.display = 'block';
        
        // Enable button
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

function clearAdminToken() {
    window.adminToken = null;
    window.adminTokenExpiry = null;
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_token_expiry');
}

function logout() {
    clearAdminToken();
    location.reload();
}

// جعل الدوال عامة للوصول إليها من api.js
window.clearAdminToken = clearAdminToken;
window.logout = logout;

// ═══════════════════════════════════════════════════════════════
// 📊 DATA MANAGEMENT
// ═══════════════════════════════════════════════════════════════

let adminData = {
    prizes: [],
    users: [],
    withdrawals: [],
    tasks: [],
    channels: [],
    settings: {}
};

async function initAdminPanel() {
    console.log('🔧 Initializing Admin Panel...');
    console.log('CONFIG:', window.CONFIG);
    console.log('Telegram WebApp:', window.Telegram?.WebApp);
    
    // Initialize Telegram WebApp if available
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }
    
    // Check if user is admin (التحقق من Telegram user فقط للعرض)
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    console.log('Telegram User:', telegramUser);
    
    if (telegramUser) {
        console.log('✅ Admin authorized:', telegramUser.id);
        showToast(typeof t === 'function' ? t('admin-welcome') : '✅ مرحباً في لوحة التحكم!', 'success');
    }
}

async function loadDashboardData() {
    DebugError.add('🚀 Starting dashboard data load...', 'info');
    showLoading();
    
    // Safety timeout to hide loading after 10 seconds max
    const loadingTimeout = setTimeout(() => {
        console.warn('⏱️ Loading timeout - force hiding loading overlay');
        DebugError.add('⏱️ Loading timeout reached - some data may not have loaded', 'warn');
        hideLoading();
    }, 10000);
    
    try {
        DebugError.add('📡 Making parallel API requests...', 'info');
        
        // Load all data
        await Promise.all([
            loadStatistics(),
            loadAdvancedStats(),  // 📊 الإحصائيات المتقدمة الجديدة
            loadPrizes(),
            loadUsers(),
            loadWithdrawals(),
            loadTasks(),
            loadChannels(),
            loadSettings()
        ]);
        
        clearTimeout(loadingTimeout);
        hideLoading();
        DebugError.add('✅ Dashboard data loaded successfully', 'info');
        showToast(typeof t === 'function' ? t('data-loaded-success') : '✅ تم تحميل البيانات بنجاح', 'success');
    } catch (error) {
        clearTimeout(loadingTimeout);
        hideLoading();
        DebugError.add('❌ Dashboard loading failed', 'error', error);
        showToast(typeof t === 'function' ? t('data-load-failed') : '❌ خطأ في تحميل البيانات', 'error');
        console.error(error);
    }
}

async function loadStatistics() {
    try {
        DebugError.add('🔄 Loading main statistics...', 'info');
        
        const result = await API.request('/stats', 'GET');
        
        if (result.success && result.data) {
            const stats = result.data;
            document.getElementById('total-users').textContent = formatNumber(stats.total_users || 0);
            document.getElementById('total-spins').textContent = formatNumber(stats.total_spins || 0);
            document.getElementById('total-balance').textContent = (stats.total_distributed || 0).toFixed(2);
            document.getElementById('pending-withdrawals').textContent = formatNumber(stats.pending_withdrawals || 0);
            
            DebugError.add('✅ Statistics loaded successfully', 'info', stats);
        } else {
            DebugError.add('❌ Failed to load statistics - API error', 'error', result);
            // Set default values on error
            document.getElementById('total-users').textContent = '0';
            document.getElementById('total-spins').textContent = '0';
            document.getElementById('total-balance').textContent = '0.00';
            document.getElementById('pending-withdrawals').textContent = '0';
        }
    } catch (error) {
        DebugError.add(`💥 Error loading statistics: ${error.message}`, 'error', error);
        // Set default values on error
        document.getElementById('total-users').textContent = '0';
        document.getElementById('total-spins').textContent = '0';
        document.getElementById('total-balance').textContent = '0.00';
        document.getElementById('pending-withdrawals').textContent = '0';
    }
}

function formatNumber(num) {
    return new Intl.NumberFormat('ar-EG').format(num);
}

// ═══════════════════════════════════════════════════════════════
// 📊 ADVANCED STATISTICS
// ═══════════════════════════════════════════════════════════════

async function loadAdvancedStats() {
    try {
        const result = await API.request('/admin/advanced-stats', 'GET');
        
        if (result.success && result.data) {
            const stats = result.data;
            document.getElementById('stat-total-users').textContent = formatNumber(stats.total_users || 0);
            document.getElementById('stat-active-users').textContent = formatNumber(stats.active_users || 0);
            document.getElementById('stat-banned-users').textContent = formatNumber(stats.banned_users || 0);
            document.getElementById('stat-verified-users').textContent = formatNumber(stats.verified_users || 0);
            
            // إضافة click handlers للإحصائيات
            setupStatsClickHandlers();
        } else {
            console.error('Failed to load advanced stats:', result.error);
        }
    } catch (error) {
        console.error('Error loading advanced stats:', error);
    }
}

// إعداد click handlers للإحصائيات
function setupStatsClickHandlers() {
    // عند الضغط على المستخدمين النشطين
    const activeCard = document.querySelector('.stat-card.success');
    if (activeCard) {
        activeCard.style.cursor = 'pointer';
        activeCard.onclick = () => {
            switchTab('users');
            filterUsersByStatus('active');
        };
    }
    
    // عند الضغط على المحظورين
    const bannedCard = document.querySelector('.stat-card.danger');
    if (bannedCard) {
        bannedCard.style.cursor = 'pointer';
        bannedCard.onclick = () => {
            switchTab('users');
            filterUsersByStatus('banned');
        };
    }
    
    // عند الضغط على المتحقق منهم
    const verifiedCard = document.querySelector('.stat-card.info');
    if (verifiedCard) {
        verifiedCard.style.cursor = 'pointer';
        verifiedCard.onclick = () => {
            switchTab('users');
            filterUsersByStatus('verified');
        };
    }
}

// فلترة المستخدمين حسب الحالة
function filterUsersByStatus(status) {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;
    
    let filteredUsers = [];
    
    if (status === 'active') {
        // النشطين = غير محظورين
        filteredUsers = adminData.users.filter(user => !user.is_banned && user.is_banned !== true);
    } else if (status === 'banned') {
        // المحظورين = is_banned === true أو 1
        filteredUsers = adminData.users.filter(user => user.is_banned === true || user.is_banned === 1);
    } else if (status === 'verified') {
        filteredUsers = adminData.users.filter(user => user.is_verified === true);
    }
    
    console.log(`Filtering by ${status}:`, filteredUsers.length, 'users found');
    
    if (filteredUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #8b95a1;">لا توجد نتائج</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredUsers.map(user => {
        const isBanned = user.is_banned === true || user.is_banned === 1;
        const banBadge = isBanned ? `<span style="background: #ff4d4d; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-right: 8px;">محظور</span>` : '';
        const banReasonText = isBanned && user.ban_reason ? `<br><small style="color: #ff6b6b;">${user.ban_reason}</small>` : '';
        
        const actionButtons = isBanned 
            ? `<button class="icon-btn" style="background: #3fb950;" onclick="unbanUser(${user.id}, '${user.username}')">✅ إزالة الحظر</button>`
            : `<button class="icon-btn" onclick="viewUserReferrals(${user.id}, '${user.name}')">👁️ إحالات</button>
               <button class="icon-btn" style="background: #3fb950;" onclick="quickAddSpins(${user.id}, '${user.username}')">🎰 لفات</button>`;
        
        return `
        <tr style="${isBanned ? 'background: rgba(255, 77, 77, 0.1);' : ''}">
            <td>${user.id}</td>
            <td>${banBadge}${user.name}${banReasonText}</td>
            <td>${user.username}</td>
            <td>${user.balance.toFixed(4)} TON</td>
            <td>${user.spins}</td>
            <td>${user.referrals}</td>
            <td>${user.joined}</td>
            <td>${actionButtons}</td>
        </tr>
        `;
    }).join('');
}

// ═══════════════════════════════════════════════════════════════
// 🎁 PRIZES MANAGEMENT
// ═══════════════════════════════════════════════════════════════

async function loadPrizes() {
    try {
        DebugError.add('🔄 Loading prizes from API...', 'info');
        showLoading();
        
        const result = await API.request('/admin/prizes', 'GET');
        
        hideLoading();
        DebugError.add(`📥 Prizes API Response:`, 'info', result);
        
        if (result.success && result.data) {
            adminData.prizes = result.data;
            DebugError.add(`✅ Successfully loaded ${adminData.prizes.length} prizes`, 'info', adminData.prizes);
            
            // Render the list
            renderPrizesList();
            updatePrizesInfo();
            
            // Show success message only on explicit reload (not initial load)
            if (window._prizesLoadedOnce) {
                const msg = typeof t === 'function' ? t('prizes-loaded').replace('{count}', adminData.prizes.length) : `✅ تم تحميل ${adminData.prizes.length} جائزة`;
                showToast(msg, 'success');
            }
            window._prizesLoadedOnce = true;
        } else {
            DebugError.add(`❌ Failed to load prizes: ${result.error || 'Unknown error'}`, 'error', result);
            showToast(typeof t === 'function' ? t('prizes-load-failed') : '❌ فشل تحميل الجوائز', 'error');
            
            // استخدام جوائز افتراضية
            adminData.prizes = CONFIG.WHEEL_PRIZES.map((prize, index) => ({
                id: index + 1,
                name: prize.name,
                value: prize.amount,
                probability: prize.probability,
                color: prize.color || `#${Math.floor(Math.random()*16777215).toString(16)}`,
                position: index
            }));
            DebugError.add('⚠️ Using default prizes from CONFIG', 'warn', adminData.prizes);
            
            renderPrizesList();
            updatePrizesInfo();
        }
    } catch (error) {
        hideLoading();
        DebugError.add(`❌ Error loading prizes: ${error.message}`, 'error', {
            error: error.stack,
            url: CONFIG.API_BASE_URL
        });
        handleApiError(error, 'admin/prizes');
        
        // استخدام جوائز افتراضية في حالة الخطأ
        adminData.prizes = CONFIG.WHEEL_PRIZES.map((prize, index) => ({
            id: index + 1,
            name: prize.name,
            value: prize.amount,
            probability: prize.probability,
            color: prize.color || `#${Math.floor(Math.random()*16777215).toString(16)}`,
            position: index
        }));
        DebugError.add('⚠️ Fallback to default prizes', 'warn');
        
        renderPrizesList();
        updatePrizesInfo();
    }
}

function renderPrizesList() {
    const container = document.getElementById('prizes-list');
    if (!container) return;
    
    // 🎨 الألوان الزيتية بالترتيب (نفس العجلة)
    const oilColors = [
        '#00bfff',  // Blue (0.05 TON)
        '#ffa500',  // Orange (0.1 TON)  
        '#9370db',  // Purple (0.15 TON)
        '#32cd32',  // Green (0.5 TON)
        '#ff1493',  // Pink (1.0 TON)
        '#808080'   // Gray (حظ أوفر)
    ];
    
    container.innerHTML = adminData.prizes.map((prize, index) => {
        const color = oilColors[index % oilColors.length];
        const qtyAvailable = prize.quantity_available ?? -1;
        const qtyWon = prize.quantity_won ?? 0;
        const isLimited = qtyAvailable >= 0;
        const isSoldOut = isLimited && qtyWon >= qtyAvailable;
        
        let quantityBadge = '';
        if (isLimited) {
            const remaining = Math.max(0, qtyAvailable - qtyWon);
            quantityBadge = `<span class="stat-item" style="${isSoldOut ? 'color: #ff4444;' : ''}">🎫 ${remaining}/${qtyAvailable}</span>`;
        }
        
        return `
        <div class="prize-item-compact" data-id="${prize.id}" ${isSoldOut ? 'style="opacity: 0.6;"' : ''}>
            <div class="prize-color-bar" style="background: ${color};"></div>
            <div class="prize-info-compact">
                <div class="prize-name">${prize.name}${isSoldOut ? ' ❌' : ''}</div>
                <div class="prize-stats">
                    <span class="stat-item">💰 ${prize.value} TON</span>
                    <span class="stat-item">📊 ${prize.probability}%</span>
                    ${quantityBadge}
                </div>
            </div>
            <div class="prize-actions-compact">
                <button class="icon-btn-small edit" onclick="openEditPrizeModal(${prize.id})" title="تعديل">✏️</button>
                <button class="icon-btn-small delete" onclick="deletePrize(${prize.id})" title="حذف">🗑️</button>
            </div>
        </div>
    `}).join('');
}

function updatePrizesInfo() {
    const totalPrizes = adminData.prizes.length;
    const totalProbability = adminData.prizes.reduce((sum, p) => sum + p.probability, 0);
    const isValid = totalProbability === 100;
    
    document.getElementById('total-prizes-count').textContent = totalPrizes;
    document.getElementById('total-probability').textContent = `${totalProbability}%`;
    
    const statusEl = document.getElementById('system-status');
    if (isValid) {
        statusEl.innerHTML = '<img src="/img/payment-success.svg" alt="✓" style="width: 14px; height: 14px; vertical-align: middle; margin-left: 2px;"> صحيح';
        statusEl.className = 'status-ok';
    } else {
        statusEl.textContent = `✗ خطأ (${totalProbability}%)`;
        statusEl.className = 'status-error';
    }
}

function openAddPrizeModal() {
    const modal = document.getElementById('add-prize-modal');
    modal.classList.add('active');
}

function openEditPrizeModal(prizeId) {
    const prize = adminData.prizes.find(p => p.id === prizeId);
    if (!prize) return;
    
    document.getElementById('edit-prize-id').value = prize.id;
    document.getElementById('edit-prize-name').value = prize.name;
    document.getElementById('edit-prize-value').value = prize.value;
    document.getElementById('edit-prize-probability').value = prize.probability;
    document.getElementById('edit-prize-quantity').value = prize.quantity_available ?? -1;
    
    // Show quantity_won if it's a limited prize
    const qtyWonGroup = document.getElementById('edit-prize-quantity-won-group');
    const qtyWonInput = document.getElementById('edit-prize-quantity-won');
    if ((prize.quantity_available ?? -1) >= 0) {
        qtyWonGroup.style.display = 'block';
        qtyWonInput.value = prize.quantity_won ?? 0;
    } else {
        qtyWonGroup.style.display = 'none';
    }
    
    const modal = document.getElementById('edit-prize-modal');
    modal.classList.add('active');
}

async function addPrize() {
    const name = document.getElementById('prize-name').value.trim();
    const value = parseFloat(document.getElementById('prize-value').value);
    const probability = parseFloat(document.getElementById('prize-probability').value);
    const quantity = parseInt(document.getElementById('prize-quantity').value);
    
    if (!name || isNaN(value) || isNaN(probability)) {
        showToast(typeof t === 'function' ? t('fill-all-fields') : '❌ يرجى ملء جميع الحقول بشكل صحيح', 'error');
        return;
    }
    
    if (probability < 0 || probability > 100) {
        showToast(typeof t === 'function' ? t('percentage-range') : '❌ النسبة يجب أن تكون بين 0 و 100', 'error');
        return;
    }
    
    try {
        showLoading();
        DebugError.add('🔄 Adding new prize...', 'info', { name, value, probability, quantity });
        
        const result = await API.request('/admin/prizes', 'POST', {
            name,
            value,
            probability,
            quantity_available: isNaN(quantity) ? -1 : quantity,
            position: adminData.prizes.length
        });
        
        hideLoading();
        DebugError.add('📥 Add prize response:', 'info', result);
        
        if (result.success) {
            DebugError.add('✅ Prize added successfully', 'info');
            showToast(typeof t === 'function' ? t('prize-added') : '✅ تم إضافة الجائزة بنجاح', 'success');
            
            // Clear form
            document.getElementById('prize-name').value = '';
            document.getElementById('prize-value').value = '';
            document.getElementById('prize-probability').value = '';
            document.getElementById('prize-quantity').value = '-1';
            
            // Close modal first
            closeModal('add-prize-modal');
            
            // Reload prizes
            await loadPrizes();
            
            // 🔄 Reload wheel in main app
            if (typeof window.reloadWheel === 'function') {
                try {
                    await window.reloadWheel();
                    console.log('✅ Wheel reloaded after adding prize');
                } catch (e) {
                    console.warn('⚠️ Could not reload wheel:', e);
                }
            }
        } else {
            DebugError.add('❌ Failed to add prize', 'error', result);
            const msg = typeof t === 'function' ? t('prize-add-failed').replace('{error}', result.error || 'خطأ غير معروف') : '❌ فشل إضافة الجائزة: ' + (result.error || 'خطأ غير معروف');
            showToast(msg, 'error');
        }
    } catch (error) {
        hideLoading();
        console.error('❌ Error adding prize:', error);
        DebugError.add('❌ Exception in addPrize', 'error', error);
        const msg = typeof t === 'function' ? t('prize-add-failed').replace('{error}', error.message) : '❌ خطأ في إضافة الجائزة: ' + error.message;
        showToast(msg, 'error');
    }
}

async function updatePrize() {
    const id = parseInt(document.getElementById('edit-prize-id').value);
    const prize = adminData.prizes.find(p => p.id === id);
    
    if (!prize) {
        showToast('❌ الجائزة غير موجودة', 'error');
        return;
    }
    
    const name = document.getElementById('edit-prize-name').value.trim();
    const value = parseFloat(document.getElementById('edit-prize-value').value);
    const probability = parseFloat(document.getElementById('edit-prize-probability').value);
    const quantity = parseInt(document.getElementById('edit-prize-quantity').value);
    
    if (!name || isNaN(value) || isNaN(probability)) {
        showToast('❌ يرجى ملء جميع الحقول بشكل صحيح', 'error');
        return;
    }
    
    if (probability < 0 || probability > 100) {
        showToast('❌ النسبة يجب أن تكون بين 0 و 100', 'error');
        return;
    }
    
    const updatedData = {
        id,
        name,
        value,
        probability,
        quantity_available: isNaN(quantity) ? -1 : quantity,
        position: prize.position || 0
    };
    
    try {
        showLoading();
        DebugError.add('🔄 Updating prize...', 'info', updatedData);
        
        const result = await API.request('/admin/prizes', 'PUT', updatedData);
        
        hideLoading();
        DebugError.add('📥 Update prize response:', 'info', result);
        
        if (result.success) {
            DebugError.add('✅ Prize updated successfully', 'info');
            showToast('✅ تم تحديث الجائزة بنجاح', 'success');
            
            // Close modal first
            closeModal('edit-prize-modal');
            
            // Reload prizes
            await loadPrizes();
            
            // 🔄 Reload wheel in main app
            if (typeof window.reloadWheel === 'function') {
                try {
                    await window.reloadWheel();
                    console.log('✅ Wheel reloaded after updating prize');
                } catch (e) {
                    console.warn('⚠️ Could not reload wheel:', e);
                }
            }
        } else {
            DebugError.add('❌ Failed to update prize', 'error', result);
            showToast('❌ فشل تحديث الجائزة: ' + (result.error || 'خطأ غير معروف'), 'error');
        }
    } catch (error) {
        hideLoading();
        console.error('❌ Error updating prize:', error);
        DebugError.add('❌ Exception in updatePrize', 'error', error);
        showToast('❌ خطأ في تحديث الجائزة: ' + error.message, 'error');
    }
}

async function deletePrize(prizeId) {
    const prize = adminData.prizes.find(p => p.id === prizeId);
    const prizeName = prize ? prize.name : `ID ${prizeId}`;
    
    if (!confirm(`هل أنت متأكد من حذف جائزة ${prizeName}؟`)) return;
    
    try {
        showLoading();
        DebugError.add('🔄 Deleting prize...', 'info', { prizeId, prizeName });
        
        const result = await API.request(`/admin/prizes?id=${prizeId}`, 'DELETE');
        
        hideLoading();
        DebugError.add('📥 Delete prize response:', 'info', result);
        
        if (result.success) {
            DebugError.add('✅ Prize deleted successfully', 'info');
            showToast(`✅ تم حذف ${prizeName} بنجاح`, 'success');
            
            // Reload prizes
            await loadPrizes();
            
            // 🔄 Reload wheel in main app
            if (typeof window.reloadWheel === 'function') {
                try {
                    await window.reloadWheel();
                    console.log('✅ Wheel reloaded after deleting prize');
                } catch (e) {
                    console.warn('⚠️ Could not reload wheel:', e);
                }
            }
        } else {
            DebugError.add('❌ Failed to delete prize', 'error', result);
            showToast('❌ فشل حذف الجائزة: ' + (result.error || 'خطأ غير معروف'), 'error');
        }
    } catch (error) {
        hideLoading();
        console.error('❌ Error deleting prize:', error);
        DebugError.add('❌ Exception in deletePrize', 'error', error);
        showToast('❌ خطأ في حذف الجائزة: ' + error.message, 'error');
    }
}

async function resetPrizesToDefault() {
    if (!confirm('⚠️ هل أنت متأكد من إعادة تعيين جميع الجوائز إلى القيم الافتراضية؟\n\nسيتم حذف جميع الجوائز الحالية واستبدالها بـ:\n\n🎯 0.25 TON - 94%\n💎 0.5 TON - 5%\n⭐ 1 TON - 1%\n🌟 1.5 TON - 0%\n✨ 2 TON - 0%\n💰 3 TON - 0%\n🖼️ NFT - 0%\n🚀 8 TON - 0%')) {
        return;
    }
    
    try {
        showLoading();
        DebugError.add('🔄 Resetting prizes to default...', 'info');
        
        const result = await API.request('/admin/reset-prizes', 'POST');
        
        hideLoading();
        
        if (result.success) {
            DebugError.add(`✅ Prizes reset successfully: ${result.count} prizes added`, 'info');
            showToast(`✅ ${result.message}`, 'success');
            await loadPrizes();
            
            // 🔄 Reload wheel in main app
            if (typeof window.reloadWheel === 'function') {
                try {
                    await window.reloadWheel();
                    console.log('✅ Wheel reloaded after resetting prizes');
                } catch (e) {
                    console.warn('⚠️ Could not reload wheel:', e);
                }
            }
        } else {
            DebugError.add('❌ Failed to reset prizes', 'error', result);
            showToast('❌ فشل إعادة تعيين الجوائز: ' + result.error, 'error');
        }
    } catch (error) {
        hideLoading();
        console.error('Error resetting prizes:', error);
        DebugError.add('❌ Error resetting prizes', 'error', error);
        showToast('❌ خطأ في إعادة تعيين الجوائز', 'error');
    }
}

// ═══════════════════════════════════════════════════════════════
// 👥 USERS MANAGEMENT
// ═══════════════════════════════════════════════════════════════

async function loadUsers() {
    // تحميل المستخدمين من API
    try {
        showLoading();
        DebugError.add('🔄 Starting to load users from API...', 'info');
        
        const result = await API.request('/admin/users', 'GET');
        
        // تشخيص مفصل للـ response
        console.log('📊 Users API Full Response:', result);
        console.log('📊 Users Data:', result.data);
        console.log('📊 Users Count:', result.count);
        
        hideLoading();
        
        if (result.success) {
            adminData.users = result.data || [];
            DebugError.add(`✅ Successfully loaded ${adminData.users.length} users`, 'info', {
                totalUsers: adminData.users.length,
                sampleUser: adminData.users[0] || null,
                allUsers: adminData.users
            });
            
            // تسجيل معلومات عن المستخدمين المحظورين
            const bannedUsers = adminData.users.filter(u => u.is_banned === true || u.is_banned === 1);
            if (bannedUsers.length > 0) {
                DebugError.add(`🔴 Found ${bannedUsers.length} banned users`, 'warn', bannedUsers.map(u => ({id: u.id, name: u.name, is_banned: u.is_banned, ban_reason: u.ban_reason})));
            }
            
            // تحذير إذا كانت القائمة فارغة
            if (adminData.users.length === 0) {
                DebugError.add('⚠️ No users returned from API - database may be empty', 'warn');
                showToast('لا يوجد مستخدمين في قاعدة البيانات', 'warn');
            }
        } else {
            DebugError.add('❌ Failed to load users - API returned error', 'error', result);
            adminData.users = [];
            showToast('فشل تحميل المستخدمين', 'error');
        }
    } catch (error) {
        hideLoading();
        DebugError.add(`💥 Error loading users: ${error.message}`, 'error', error);
        adminData.users = [];
        showToast('خطأ في تحميل المستخدمين', 'error');
    }
    
    renderUsersTable();
}

function renderUsersTable() {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) {
        DebugError.add('❌ users-table-body element not found in DOM', 'error');
        return;
    }
    
    DebugError.add(`🔄 Rendering users table with ${adminData.users.length} users`, 'info', adminData.users);
    
    if (adminData.users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #999;">لا توجد بيانات مستخدمين</td></tr>';
        DebugError.add('⚠️ No users to display in table', 'warn');
        return;
    }
    
    tbody.innerHTML = adminData.users.map(user => {
        const isBanned = user.is_banned === true || user.is_banned === 1;
        const banBadge = isBanned ? `<span style="background: #ff4d4d; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-right: 8px;">محظور</span>` : '';
        const banReasonText = isBanned && user.ban_reason ? `<br><small style="color: #ff6b6b;">${user.ban_reason}</small>` : '';
        
        const actionButtons = isBanned 
            ? `<button class="icon-btn" style="background: #3fb950;" onclick="unbanUser(${user.id}, '${user.username}')">✅ السماح</button>`
            : `<button class="icon-btn" onclick="viewUserReferrals(${user.id}, '${user.name}')">إحالات</button>
               <button class="icon-btn" style="background: #3fb950;" onclick="quickAddSpins(${user.id}, '${user.username}')">لفات</button>`;
        
        return `
        <tr style="${isBanned ? 'background: rgba(255, 77, 77, 0.1);' : ''}">
            <td>${user.id}</td>
            <td>${banBadge}${user.name}${banReasonText}</td>
            <td>${user.username}</td>
            <td>${user.balance.toFixed(4)} TON</td>
            <td>${user.spins}</td>
            <td>${user.referrals}</td>
            <td>${user.joined}</td>
            <td>${actionButtons}</td>
        </tr>
        `;
    }).join('');
}

// إلغاء حظر مستخدم
async function unbanUser(userId, username) {
    if (!confirm(`هل تريد السماح للمستخدم ${username} بالدخول بدون تحقق؟`)) {
        return;
    }
    
    try {
        showLoading();
        const result = await API.request('/admin/unban-user', 'POST', { user_id: userId });
        hideLoading();
        
        if (result.success) {
            showToast('تم السماح للمستخدم بنجاح ✅', 'success');
            await loadUsers(); // إعادة تحميل قائمة المستخدمين
            await loadAdvancedStats(); // تحديث الإحصائيات
        } else {
            showToast(result.error || 'فشل إلغاء الحظر', 'error');
        }
    } catch (error) {
        hideLoading();
        console.error('Error unbanning user:', error);
        showToast('خطأ في إلغاء الحظر', 'error');
    }
}

// تصفية جدول المستخدمين حسب البحث
function filterUsersTable(query) {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;
    
    const filteredUsers = adminData.users.filter(user => {
        const searchText = `${user.id} ${user.name} ${user.username}`.toLowerCase();
        return searchText.includes(query);
    });
    
    if (filteredUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #8b95a1;">لا توجد نتائج</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredUsers.map(user => {
        const isBanned = user.is_banned === true || user.is_banned === 1;
        const banBadge = isBanned ? `<span style="background: #ff4d4d; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-right: 8px;">محظور</span>` : '';
        const banReasonText = isBanned && user.ban_reason ? `<br><small style="color: #ff6b6b;">${user.ban_reason}</small>` : '';
        
        const actionButtons = isBanned 
            ? `<button class="icon-btn" style="background: #3fb950;" onclick="unbanUser(${user.id}, '${user.username}')">✅ السماح</button>`
            : `<button class="icon-btn" onclick="viewUserReferrals(${user.id}, '${user.name}')">إحالات</button>
               <button class="icon-btn" style="background: #3fb950;" onclick="quickAddSpins(${user.id}, '${user.username}')">لفات</button>`;
        
        return `
        <tr style="${isBanned ? 'background: rgba(255, 77, 77, 0.1);' : ''}">
            <td>${user.id}</td>
            <td>${banBadge}${user.name}${banReasonText}</td>
            <td>${user.username}</td>
            <td>${user.balance.toFixed(4)} TON</td>
            <td>${user.spins}</td>
            <td>${user.referrals}</td>
            <td>${user.joined}</td>
            <td>${actionButtons}</td>
        </tr>
        `;
    }).join('');
}

// ═══════════════════════════════════════════════════════════════
// 💸 WITHDRAWALS MANAGEMENT
// ═══════════════════════════════════════════════════════════════

async function loadWithdrawals() {
    // تحميل طلبات السحب من API
    try {
        const result = await API.request('/withdrawals', 'GET');
        
        if (result.success) {
            adminData.withdrawals = result.data || [];
        } else {
            adminData.withdrawals = [];
        }
    } catch (error) {
        console.error('Error loading withdrawals:', error);
        adminData.withdrawals = [];
    }
    
    renderWithdrawals('pending');
}

function renderWithdrawals(status = 'pending') {
    const container = document.getElementById('withdrawals-list');
    if (!container) return;
    
    let filtered = adminData.withdrawals;
    if (status !== 'all') {
        filtered = adminData.withdrawals.filter(w => w.status === status);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">لا توجد طلبات سحب</p>';
        return;
    }
    
    container.innerHTML = filtered.map(w => {
        const date = w.requested_at ? new Date(w.requested_at).toLocaleString('ar-EG') : 'غير محدد';
        const method = w.withdrawal_type || 'غير محدد';
        const address = w.wallet_address || 'غير محدد';
        const phone = w.phone_number || 'غير محدد';
        
        return `
        <div class="withdrawal-item">
            <div class="withdrawal-info">
                <h4>👤 ${w.user_name || 'Unknown'} (${w.user_id})</h4>
                <div class="withdrawal-details">
                    <span>💰 ${w.amount} TON</span>
                    <span>📱 ${method}</span>
                    <span>🕐 ${date}</span>
                    ${method.toUpperCase().includes('TON') ? `<span>📍 ${address}</span>` : `<span>📞 ${phone}</span>`}
                </div>
            </div>
            ${w.status === 'pending' ? `
                <div class="withdrawal-actions">
                    <button class="approve-btn" onclick="approveWithdrawal(${w.id})"><img src="/img/payment-success.svg" alt="✓" style="width: 14px; height: 14px; vertical-align: middle; margin-left: 2px;"> قبول</button>
                    <button class="reject-btn" onclick="rejectWithdrawal(${w.id})"><img src="/img/payment-failure.svg" alt="✗" style="width: 14px; height: 14px; vertical-align: middle; margin-left: 2px;"> رفض</button>
                </div>
            ` : `
                <span class="status-badge ${w.status}">${w.status === 'completed' ? '<img src="/img/payment-success.svg" alt="✓" style="width: 14px; height: 14px; vertical-align: middle; margin-left: 2px;"> ' + (typeof t === 'function' ? t('accepted') : 'مقبول') : '<img src="/img/payment-failure.svg" alt="✗" style="width: 14px; height: 14px; vertical-align: middle; margin-left: 2px;"> ' + (typeof t === 'function' ? t('rejected') : 'مرفوض')}</span>
            `}
        </div>
        `;
    }).join('');
}

async function approveWithdrawal(id) {
    const withdrawal = adminData.withdrawals.find(w => w.id === id);
    if (!withdrawal) return;
    
    if (!confirm(`هل أنت متأكد من قبول طلب السحب؟\n\nالمبلغ: ${withdrawal.amount} TON\nالمستخدم: ${withdrawal.user_name}`)) {
        return;
    }
    
    try {
        showLoading();
        const result = await API.request('/withdrawal/approve', 'POST', {
            withdrawal_id: id
        });
        hideLoading();
        
        if (result.success) {
            showToast('✅ تم قبول طلب السحب بنجاح', 'success');
            loadWithdrawals(); // إعادة تحميل القائمة
        } else {
            showToast('❌ فشل قبول الطلب: ' + result.error, 'error');
        }
    } catch (error) {
        hideLoading();
        console.error('Error approving withdrawal:', error);
        showToast('❌ خطأ في قبول الطلب', 'error');
    }
}

async function rejectWithdrawal(id) {
    const withdrawal = adminData.withdrawals.find(w => w.id === id);
    if (!withdrawal) return;
    
    const reason = prompt('سبب الرفض (اختياري):');
    if (reason === null) return; // ألغى المستخدم
    
    try {
        showLoading();
        const result = await API.request('/withdrawal/reject', 'POST', {
            withdrawal_id: id,
            reason: reason || 'لم يتم تحديد سبب'
        });
        hideLoading();
        
        if (result.success) {
            showToast('✅ تم رفض طلب السحب وإرجاع المبلغ', 'success');
            loadWithdrawals(); // إعادة تحميل القائمة
        } else {
            showToast('❌ فشل رفض الطلب: ' + result.error, 'error');
        }
    } catch (error) {
        hideLoading();
        console.error('Error rejecting withdrawal:', error);
        showToast('❌ خطأ في رفض الطلب', 'error');
    }
}

// ═══════════════════════════════════════════════════════════════
// 📝 TASKS MANAGEMENT
// ═══════════════════════════════════════════════════════════════

async function loadTasks() {
    console.log('📥 Loading tasks from API...');
    try {
        // ✅ استخدام API.request للتأكد من إرسال initData
        const result = await API.request('/admin/tasks', 'GET');
        console.log('✅ Tasks loaded:', result);
        
        if (result.success && result.tasks) {
            adminData.tasks = result.tasks;
            renderAdminTasks();
            showToast('✅ تم تحميل المهام', 'success');
        } else {
            console.error('❌ Failed to load tasks:', result.message);
            showToast('فشل تحميل المهام', 'error');
            adminData.tasks = [];
            renderAdminTasks();
        }
    } catch (error) {
        console.error('❌ Error loading tasks:', error);
        showToast(`خطأ في تحميل المهام: ${error.message}`, 'error');
        // استخدام بيانات تجريبية في حالة الخطأ
        adminData.tasks = [];
        renderAdminTasks();
    }
}

/**
 * عرض المهام في صفحة الإدمن
 */
function renderAdminTasks() {
    const tasksGrid = document.getElementById('tasks-grid');
    if (!tasksGrid) {
        console.error('❌ Tasks grid not found');
        return;
    }
    
    // فلترة المهام النشطة فقط
    const activeTasks = adminData.tasks.filter(task => task.is_active !== false);
    
    if (!activeTasks || activeTasks.length === 0) {
        const noTasksText = typeof t === 'function' ? t('no-tasks-now') : 'لا توجد مهام حالياً';
        tasksGrid.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #8b95a1;">
                <p style="font-size: 48px; margin-bottom: 16px;">📝</p>
                <p style="font-size: 18px;">${noTasksText}</p>
                <p style="font-size: 14px; margin-top: 8px;">ابدأ بإضافة مهمة جديدة</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    activeTasks.forEach(task => {
        const statusBadge = task.is_active 
            ? '<span class="task-status active">نشط</span>' 
            : '<span class="task-status">غير نشط</span>';
        
        const pinnedBadge = task.is_pinned 
            ? '<span style="background: #ffd436; color: #000; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; margin-left: 8px;">📌 مثبت</span>' 
            : '';
        
        const typeIcon = task.task_type === 'channel' ? '📢' : '🔗';
        const typeText = task.task_type === 'channel' ? 'قناة' : 'رابط';
        
        html += `
            <div class="admin-task-card">
                <div class="task-header">
                    <h3>${typeIcon} ${task.task_name}</h3>
                    ${pinnedBadge}
                    ${statusBadge}
                </div>
                
                ${task.task_description ? `<p class="task-description">${task.task_description}</p>` : ''}
                
                <div class="task-details">
                    <div><strong>النوع:</strong> ${typeText}</div>
                    <div><strong>الرابط:</strong> <a href="${task.task_link}" target="_blank" class="channel-link">${task.task_link}</a></div>
                    ${task.channel_username ? `<div><strong>القناة:</strong> ${task.channel_username}</div>` : ''}
                    <div><strong>المكافأة:</strong> <span class="task-reward">جزء من نظام 5 مهمات = 1 دورة</span></div>
                    <div><strong>تاريخ الإضافة:</strong> ${new Date(task.added_at).toLocaleDateString('ar-EG')}</div>
                </div>
                
                <div class="task-footer">
                    <button class="btn-secondary" onclick="editTask(${task.id})">
                        ✏️ تعديل
                    </button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">
                        🗑️ حذف
                    </button>
                </div>
            </div>
        `;
    });
    
    tasksGrid.innerHTML = html;
}

/**
 * تعديل مهمة موجودة
 */
function editTask(taskId) {
    console.log('✏️ Editing task:', taskId);
    
    // البحث عن المهمة
    const task = adminData.tasks.find(t => t.id === taskId);
    if (!task) {
        showToast('❌ لم يتم العثور على المهمة', 'error');
        return;
    }
    
    // فتح المودال
    const modal = document.getElementById('add-task-modal');
    if (!modal) {
        showToast('❌ خطأ: لم يتم العثور على النموذج', 'error');
        return;
    }
    
    // ملء البيانات الحالية
    document.getElementById('task-name').value = task.task_name || '';
    document.getElementById('task-link').value = task.task_link || '';
    document.getElementById('task-description').value = task.task_description || '';
    document.getElementById('task-pinned').checked = task.is_pinned || false;
    document.getElementById('task-active').checked = task.is_active !== false;
    
    // تعيين النوع
    selectTaskType(task.task_type || 'channel');
    
    // ملء اسم القناة إذا كان النوع قناة
    if (task.task_type === 'channel' && task.channel_username) {
        document.getElementById('channel-username').value = task.channel_username;
    }
    
    // تغيير عنوان المودال وزر الحفظ
    const modalTitle = modal.querySelector('.modal-header h2');
    if (modalTitle) {
        modalTitle.textContent = '✏️ تعديل مهمة';
    }
    
    const saveBtn = document.getElementById('task-submit-btn');
    if (saveBtn) {
        saveBtn.innerHTML = '<img src="/img/payment-success.svg" alt="✓" style="width: 14px; height: 14px; vertical-align: middle; margin-left: 2px;"> حفظ التعديل';
        saveBtn.onclick = () => updateTask(taskId);
    }
    
    // عرض المودال
    modal.classList.add('active');
    console.log('✅ Edit modal opened for task:', taskId);
}

/**
 * تحديث مهمة موجودة
 */
async function updateTask(taskId) {
    console.log('💾 Updating task:', taskId);
    
    try {
        const taskName = document.getElementById('task-name').value.trim();
        const taskLink = document.getElementById('task-link').value.trim();
        const taskDescription = document.getElementById('task-description').value.trim();
        const isPinned = document.getElementById('task-pinned').checked;
        const isActive = document.getElementById('task-active').checked;
        const taskType = document.querySelector('input[name="task-type"]:checked')?.value || 'channel';
        const channelUsername = document.getElementById('channel-username').value.trim();
        
        // التحقق من البيانات المطلوبة
        if (!taskName) {
            showToast('⚠️ الرجاء إدخال اسم المهمة', 'warning');
            return;
        }
        
        if (!taskLink) {
            showToast('⚠️ الرجاء إدخال رابط المهمة', 'warning');
            return;
        }
        
        if (taskType === 'channel' && !channelUsername) {
            showToast('⚠️ الرجاء إدخال معرف القناة', 'warning');
            return;
        }
        
        // بيانات المهمة المحدثة
        const taskData = {
            task_id: taskId,
            task_name: taskName,
            task_link: taskLink,
            task_description: taskDescription,
            task_type: taskType,
            is_pinned: isPinned,
            is_active: isActive,
            admin_id: 1797127532
        };
        
        if (taskType === 'channel') {
            taskData.channel_username = channelUsername.startsWith('@') ? channelUsername : '@' + channelUsername;
        }
        
        console.log('📤 Sending update:', taskData);
        
        // إرسال البيانات إلى API
        showLoading();
        const result = await API.request('/admin/tasks', 'PUT', taskData);
        hideLoading();
        
        console.log('📥 Server response:', result);
        
        if (result.success) {
            showToast('✅ تم تحديث المهمة بنجاح!', 'success');
            closeModal('add-task-modal');
            loadTasks(); // إعادة تحميل القائمة
        } else {
            const errorMsg = result.message || 'فشل تحديث المهمة';
            showToast(`❌ ${errorMsg}`, 'error');
            console.error('❌ Task update failed:', result);
        }
        
    } catch (error) {
        hideLoading();
        console.error('❌ Error updating task:', error);
        showToast('❌ خطأ في الاتصال بالسيرفر', 'error');
    }
}

/**
 * حذف مهمة
 */
async function deleteTask(taskId) {
    if (!confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
        return;
    }
    
    try {
        showLoading();
        const result = await API.request(`/admin/tasks?task_id=${taskId}`, 'DELETE');
        hideLoading();
        
        if (result.success) {
            showToast('✅ تم حذف المهمة بنجاح', 'success');
            loadTasks(); // إعادة تحميل القائمة
        } else {
            showToast('❌ فشل حذف المهمة', 'error');
        }
    } catch (error) {
        hideLoading();
        console.error('❌ Error deleting task:', error);
        showToast('❌ خطأ في الاتصال', 'error');
    }
}

async function loadChannels() {
    console.log('📥 Loading channels from API...');
    try {
        // ✅ استخدام API.request للتأكد من إرسال initData
        const result = await API.request('/admin/channels', 'GET');
        console.log('✅ Channels loaded:', result);
        
        if (result.success && result.channels) {
            adminData.channels = result.channels;
            renderAdminChannels();
            showToast('✅ تم تحميل القنوات', 'success');
        } else {
            console.error('❌ Failed to load channels:', result.message);
            showToast('فشل تحميل القنوات', 'error');
            adminData.channels = [];
            renderAdminChannels();
        }
    } catch (error) {
        console.error('❌ Error loading channels:', error);
        showToast(`خطأ في تحميل القنوات: ${error.message}`, 'error');
        adminData.channels = [];
        renderAdminChannels();
    }
}

/**
 * عرض القنوات في صفحة الإدمن
 */
function renderAdminChannels() {
    const channelsGrid = document.getElementById('channels-grid');
    if (!channelsGrid) {
        console.error('❌ Channels grid not found');
        return;
    }
    
    if (!adminData.channels || adminData.channels.length === 0) {
        channelsGrid.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #8b95a1;">
                <p style="font-size: 48px; margin-bottom: 16px;">📢</p>
                <p style="font-size: 18px;">لا توجد قنوات حالياً</p>
                <p style="font-size: 14px; margin-top: 8px;">ابدأ بإضافة قناة إجبارية</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    adminData.channels.forEach(channel => {
        const statusBadge = channel.is_active 
            ? '<span class="task-status active">نشط</span>' 
            : '<span class="task-status">غير نشط</span>';
        
        html += `
            <div class="admin-task-card">
                <div class="task-header">
                    <h3>📢 ${channel.channel_name}</h3>
                    ${statusBadge}
                </div>
                
                <div class="task-details">
                    <div><strong>المعرف:</strong> ${channel.channel_id}</div>
                    <div><strong>الرابط:</strong> <a href="${channel.channel_url}" target="_blank" class="channel-link">${channel.channel_url}</a></div>
                    <div><strong>تاريخ الإضافة:</strong> ${new Date(channel.added_at).toLocaleDateString('ar-EG')}</div>
                </div>
                
                <div class="task-footer">
                    <button class="delete-btn" onclick="deleteChannel('${channel.channel_id}')">
                        🗑️ حذف
                    </button>
                </div>
            </div>
        `;
    });
    
    channelsGrid.innerHTML = html;
}

/**
 * فتح نموذج إضافة قناة
 */
function openAddChannelModal() {
    console.log('🎯 Opening Add Channel Modal');
    const modal = document.getElementById('add-channel-modal');
    if (!modal) {
        console.error('❌ Modal not found');
        showToast('❌ خطأ: لم يتم العثور على النموذج', 'error');
        return;
    }
    
    // إعادة تعيين النموذج
    document.getElementById('channel-name').value = '';
    document.getElementById('channel-id').value = '';
    document.getElementById('channel-url').value = '';
    
    // عرض النموذج
    modal.style.display = 'flex';
    console.log('✅ Modal opened');
}

/**
 * إغلاق نموذج إضافة القناة
 */
function closeAddChannelModal() {
    console.log('🚪 Closing Add Channel Modal');
    const modal = document.getElementById('add-channel-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * إنشاء قناة جديدة
 */
async function createChannel() {
    console.log('📝 Creating new channel...');
    
    try {
        const channelName = document.getElementById('channel-name').value.trim();
        const channelId = document.getElementById('channel-id').value.trim();
        const channelUrl = document.getElementById('channel-url').value.trim();
        const isActive = document.getElementById('channel-active').checked;
        
        // التحقق من البيانات المطلوبة
        if (!channelName) {
            showToast('⚠️ الرجاء إدخال اسم القناة', 'warning');
            return;
        }
        
        if (!channelId) {
            showToast('⚠️ الرجاء إدخال معرف القناة', 'warning');
            return;
        }
        
        if (!channelUrl) {
            showToast('⚠️ الرجاء إدخال رابط القناة', 'warning');
            return;
        }
        
        // بيانات القناة
        const channelData = {
            channel_name: channelName,
            channel_id: channelId.startsWith('@') ? channelId : '@' + channelId,
            channel_url: channelUrl,
            is_active: isActive,
            admin_id: 1797127532
        };
        
        console.log('📤 Sending channel data:', channelData);
        
        // إرسال البيانات إلى API
        showLoading();
        const result = await API.request('/admin/channels', 'POST', channelData);
        hideLoading();
        
        console.log('📥 Server response:', result);
        
        if (result.success) {
            showToast('✅ تم إضافة القناة بنجاح!', 'success');
            closeAddChannelModal();
            loadChannels(); // إعادة تحميل القائمة
        } else {
            const errorMsg = result.message || 'فشل إضافة القناة';
            showToast(`❌ ${errorMsg}`, 'error');
            console.error('❌ Channel creation failed:', result);
        }
        
    } catch (error) {
        hideLoading();
        console.error('❌ Error creating channel:', error);
        showToast(`❌ ${error?.message || 'خطأ في الاتصال بالسيرفر'}`, 'error');
    }
}

// ═══════════════════════════════════════════════════════════════
// ⚙️ SETTINGS MANAGEMENT
// ═══════════════════════════════════════════════════════════════

async function loadSettings() {
    try {
        // جلب الإعدادات من الـ API
        const result = await API.request('/settings', 'GET');
        
        if (result.success && result.data) {
            // تحميل الإعدادات
            document.getElementById('min-withdrawal').value = result.data.min_withdrawal || 0.1;
            document.getElementById('max-withdrawal').value = result.data.max_withdrawal || 100;
            document.getElementById('auto-withdrawal').checked = result.data.auto_withdrawal_enabled || false;
            document.getElementById('referrals-per-spin').value = result.data.referrals_per_spin || 5;
            
            console.log('✅ Settings loaded:', result.data);
        } else {
            // استخدام القيم الافتراضية
            document.getElementById('min-withdrawal').value = window.CONFIG?.MIN_WITHDRAWAL_AMOUNT || 0.1;
            document.getElementById('max-withdrawal').value = 100;
            document.getElementById('auto-withdrawal').checked = false;
            document.getElementById('referrals-per-spin').value = window.CONFIG?.SPINS_PER_REFERRALS || 5;
        }
        
        // تحميل إعدادات التحقق من التعدد
        const adminId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
        if (adminId) {
            const verificationResult = await API.request(`/admin/verification-settings?admin_id=${adminId}`, 'GET');
            
            if (verificationResult.success) {
                document.getElementById('verification-enabled').checked = verificationResult.verification_enabled !== false;
                console.log('✅ Verification settings loaded:', verificationResult.verification_enabled);
            } else {
                document.getElementById('verification-enabled').checked = true;
            }
        }
        
    } catch (error) {
        console.error('Error loading settings:', error);
        // استخدام القيم الافتراضية
        document.getElementById('min-withdrawal').value = window.CONFIG?.MIN_WITHDRAWAL_AMOUNT || 0.1;
        document.getElementById('max-withdrawal').value = 100;
        document.getElementById('auto-withdrawal').checked = false;
        document.getElementById('verification-enabled').checked = true;
        document.getElementById('referrals-per-spin').value = window.CONFIG?.SPINS_PER_REFERRALS || 5;
    }
    
    // باقي الإعدادات
    document.getElementById('rate-limiting').checked = true;
    document.getElementById('event-logging').checked = true;
}

async function saveSettings() {
    showLoading();
    
    try {
        // جمع الإعدادات
        const settings = {
            minWithdrawal: parseFloat(document.getElementById('min-withdrawal').value),
            maxWithdrawal: parseFloat(document.getElementById('max-withdrawal').value),
            auto_withdrawal_enabled: document.getElementById('auto-withdrawal').checked,
            referralsPerSpin: parseInt(document.getElementById('referrals-per-spin').value),
            rateLimiting: document.getElementById('rate-limiting').checked,
            eventLogging: document.getElementById('event-logging').checked
        };
        
        console.log('Saving settings:', settings);
        
        // حفظ الإعدادات في الـ API
        const result = await API.request('/settings', 'POST', settings);
        
        hideLoading();
        
        if (result.success) {
            showToast('✅ تم حفظ الإعدادات بنجاح', 'success');
            
            // تحديث النص بناءً على الحالة
            const autoWithdrawalStatus = settings.auto_withdrawal_enabled ? 'مفعّل ✅' : 'معطّل ❌';
            console.log(`💡 السحب التلقائي الآن: ${autoWithdrawalStatus}`);
        } else {
            showToast('❌ فشل حفظ الإعدادات: ' + (result.error || 'خطأ غير معروف'), 'error');
        }
        
    } catch (error) {
        console.error('Error saving settings:', error);
        hideLoading();
        showToast('❌ فشل حفظ الإعدادات', 'error');
    }
}

// ═══════════════════════════════════════════════════════════════
// 🎯 EVENT LISTENERS
// ═══════════════════════════════════════════════════════════════

function setupEventListeners() {
    console.log('🎯 Setting up event listeners...');
    
    // Tab switching
    const tabs = document.querySelectorAll('.admin-tab');
    console.log('Found tabs:', tabs.length);
    console.log('Tabs list:', Array.from(tabs).map(t => ({
        text: t.textContent.trim(),
        dataset: t.dataset.tab,
        classList: Array.from(t.classList)
    })));
    
    if (tabs.length === 0) {
        console.error('❌ NO TABS FOUND! Check if .admin-tab elements exist in HTML');
    }
    
    tabs.forEach((tab, index) => {
        console.log(`Adding click listener to tab ${index}:`, tab.dataset.tab);
        tab.addEventListener('click', (e) => {
            console.log('🖱️ Tab clicked:', tab.dataset.tab, e);
            const targetTab = tab.dataset.tab;
            switchTab(targetTab);
        });
    });
    
    console.log('✅ Event listeners setup complete');
    
    // Auto-withdrawal toggle listener
    const autoWithdrawalToggle = document.getElementById('auto-withdrawal');
    if (autoWithdrawalToggle) {
        autoWithdrawalToggle.addEventListener('change', async (e) => {
            const isEnabled = e.target.checked;
            console.log('🔄 Auto-withdrawal toggled:', isEnabled);
            
            try {
                const result = await API.request('/settings', 'POST', { auto_withdrawal_enabled: isEnabled });
                
                if (result.success) {
                    const status = isEnabled ? '✅ مفعّل' : '❌ معطّل';
                    showToast(`السحب التلقائي الآن ${status}`, 'success');
                } else {
                    showToast('❌ فشل تحديث الإعداد', 'error');
                    // إرجاع الحالة السابقة
                    e.target.checked = !isEnabled;
                }
            } catch (error) {
                console.error('Error toggling auto-withdrawal:', error);
                showToast('❌ خطأ في الاتصال', 'error');
                // إرجاع الحالة السابقة
                e.target.checked = !isEnabled;
            }
        });
    }
    
    // Verification toggle listener
    const verificationToggle = document.getElementById('verification-enabled');
    if (verificationToggle) {
        verificationToggle.addEventListener('change', async (e) => {
            const isEnabled = e.target.checked;
            console.log('🔄 Verification toggled:', isEnabled);
            
            const adminId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
            if (!adminId) {
                showToast('❌ غير مصرح لك', 'error');
                e.target.checked = !isEnabled;
                return;
            }
            
            try {
                const result = await API.request('/admin/verification-settings', 'POST', {
                    admin_id: adminId,
                    enabled: isEnabled
                });
                
                if (result.success) {
                    const status = isEnabled ? '✅ مفعّل' : '❌ معطّل';
                    showToast(`التحقق من التعدد الآن ${status}`, 'success');
                } else {
                    showToast('❌ فشل تحديث الإعداد', 'error');
                    e.target.checked = !isEnabled;
                }
            } catch (error) {
                console.error('Error toggling verification:', error);
                showToast('❌ خطأ في الاتصال', 'error');
                e.target.checked = !isEnabled;
            }
        });
    }
    
    // Filter buttons for withdrawals
    const filterBtns = document.querySelectorAll('.filter-btn');
    console.log('Found filter buttons:', filterBtns.length);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Filter clicked:', btn.dataset.status);
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderWithdrawals(btn.dataset.status);
        });
    });
    
    // User search
    const searchInput = document.getElementById('user-search');
    if (searchInput) {
        console.log('User search input found');
        // البحث عند الخروج من حقل النص
        searchInput.addEventListener('blur', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query) {
                filterUsersTable(query);
            } else {
                renderUsersTable(); // إعادة عرض جميع المستخدمين
            }
        });
        
        // البحث عند الضغط على Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.toLowerCase().trim();
                if (query) {
                    filterUsersTable(query);
                } else {
                    renderUsersTable();
                }
            }
        });
    }
    
    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Add Task Modal - Type selector buttons
    const typeChannelBtn = document.getElementById('type-channel');
    const typeLinkBtn = document.getElementById('type-link');
    
    if (typeChannelBtn) {
        typeChannelBtn.addEventListener('click', () => selectTaskType('channel'));
        console.log('✅ Channel type button listener added');
    }
    
    if (typeLinkBtn) {
        typeLinkBtn.addEventListener('click', () => selectTaskType('link'));
        console.log('✅ Link type button listener added');
    }
    
    // Add Task Modal - Close button
    const closeTaskModalBtn = document.querySelector('#add-task-modal .close-modal');
    if (closeTaskModalBtn) {
        closeTaskModalBtn.addEventListener('click', closeAddTaskModal);
        console.log('✅ Close task modal button listener added');
    }
    
    // Add Task Modal - Cancel button
    const cancelTaskBtn = document.querySelector('#add-task-modal .btn-cancel');
    if (cancelTaskBtn) {
        cancelTaskBtn.addEventListener('click', closeAddTaskModal);
        console.log('✅ Cancel task button listener added');
    }
    
    // Add Task Modal - Character counters
    setupCharacterCounters();
}

/**
 * إعداد عدادات الأحرف للحقول
 */
function setupCharacterCounters() {
    const fields = [
        { id: 'task-name', max: 50, counterId: 'name-count' },
        { id: 'task-link', max: 200, counterId: 'link-count' },
        { id: 'task-description', max: 100, counterId: 'desc-count' },
        { id: 'channel-name', max: 100, counterId: 'channel-name-count' },
        { id: 'channel-url', max: 200, counterId: 'channel-url-count' }
    ];
    
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        const counter = document.getElementById(field.counterId);
        
        if (input && counter) {
            input.addEventListener('input', () => {
                const length = input.value.length;
                counter.textContent = `${length}/${field.max}`;
                
                // تغيير اللون عند الاقتراب من الحد الأقصى
                if (length > field.max * 0.9) {
                    counter.style.color = '#ef5350';
                } else if (length > field.max * 0.7) {
                    counter.style.color = '#ffd436';
                } else {
                    counter.style.color = '#8b95a1';
                }
            });
            
            // تحديد الحد الأقصى
            input.setAttribute('maxlength', field.max);
        }
    });
}

function switchTab(tabName) {
    console.log('🔀 Switching to tab:', tabName);
    
    // Update tab buttons
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const targetTab = document.querySelector(`.admin-tab[data-tab="${tabName}"]`);
    if (targetTab) {
        targetTab.classList.add('active');
        console.log('✅ Tab button activated');
    } else {
        console.error('❌ Tab button not found for:', tabName);
    }
    
    // Update tab content
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const targetContent = document.getElementById(`tab-${tabName}`);
    if (targetContent) {
        targetContent.classList.add('active');
        console.log('✅ Tab content activated');
    } else {
        console.error('❌ Tab content not found for:', tabName);
    }
}

// ═══════════════════════════════════════════════════════════════
// 🛠 UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function refreshData() {
    showToast('🔄 جاري تحديث البيانات...', 'info');
    loadDashboardData();
}

function logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        window.Telegram?.WebApp?.close();
    }
}

function showLoading() {
    console.log('🔄 Showing loading overlay');
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('active');
        console.log('✅ Loading overlay activated');
    } else {
        console.error('❌ Loading overlay element not found!');
    }
}

function hideLoading() {
    console.log('🔄 Hiding loading overlay');
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        console.log('✅ Loading overlay deactivated', 'Has active class:', overlay.classList.contains('active'));
    } else {
        console.error('❌ Loading overlay element not found!');
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ═══════════════════════════════════════════════════════════════
// ➕ ADD TASK MODAL FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * فتح نموذج إضافة مهمة جديدة
 */
function openAddTaskModal() {
    console.log('🎯 Opening Add Task Modal');
    const modal = document.getElementById('add-task-modal');
    if (!modal) {
        console.error('❌ Modal not found');
        showToast('❌ خطأ: لم يتم العثور على النموذج', 'error');
        return;
    }
    
    // إعادة تعيين النموذج
    document.getElementById('task-name').value = '';
    document.getElementById('task-link').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-pinned').checked = false;
    document.getElementById('task-active').checked = true;
    document.getElementById('channel-username').value = '';
    
    // تعيين النوع الافتراضي إلى قناة
    selectTaskType('channel');
    
    // إعادة تعيين عنوان المودال وزر الحفظ
    const modalTitle = modal.querySelector('.modal-header h2');
    if (modalTitle) {
        modalTitle.textContent = '➕ إضافة مهمة جديدة';
    }
    
    const saveBtn = document.getElementById('task-submit-btn');
    if (saveBtn) {
        saveBtn.innerHTML = '<img src="/img/checksup.png" alt="✓" style="width: 14px; height: 14px; vertical-align: middle; margin-left: 2px;"> إنشاء المهمة';
        saveBtn.onclick = createTask;
    }
    
    // عرض النموذج
    modal.classList.add('active');
    console.log('✅ Modal opened');
}

/**
 * إغلاق نموذج إضافة المهمة
 */
function closeAddTaskModal() {
    console.log('🚪 Closing Add Task Modal');
    const modal = document.getElementById('add-task-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * اختيار نوع المهمة (قناة أو رابط)
 */
function selectTaskType(type) {
    console.log('🔄 Selecting task type:', type);
    
    // تحديث أزرار النوع
    const channelBtn = document.getElementById('type-channel');
    const linkBtn = document.getElementById('type-link');
    const channelUsernameGroup = document.getElementById('channel-username-group');
    
    if (!channelBtn || !linkBtn || !channelUsernameGroup) {
        console.error('❌ Type buttons or channel group not found');
        return;
    }
    
    if (type === 'channel') {
        channelBtn.classList.add('active');
        linkBtn.classList.remove('active');
        channelUsernameGroup.style.display = 'block';
    } else {
        linkBtn.classList.add('active');
        channelBtn.classList.remove('active');
        channelUsernameGroup.style.display = 'none';
    }
}

/**
 * إنشاء مهمة جديدة
 */
async function createTask() {
    console.log('📝 Creating new task...');
    
    try {
        // جمع البيانات من النموذج
        const taskName = document.getElementById('task-name').value.trim();
        const taskLink = document.getElementById('task-link').value.trim();
        const taskDescription = document.getElementById('task-description').value.trim();
        const isPinned = document.getElementById('task-pinned').checked;
        const isActive = document.getElementById('task-active').checked;
        
        // تحديد نوع المهمة
        const isChannel = document.getElementById('type-channel').classList.contains('active');
        const taskType = isChannel ? 'channel' : 'link';
        
        // التحقق من البيانات المطلوبة
        if (!taskName) {
            showToast('⚠️ الرجاء إدخال اسم المهمة', 'warning');
            return;
        }
        
        if (!taskLink) {
            showToast('⚠️ الرجاء إدخال الرابط', 'warning');
            return;
        }
        
        // بيانات المهمة
        const taskData = {
            task_name: taskName,
            task_link: taskLink,
            task_type: taskType,
            task_description: taskDescription,
            is_pinned: isPinned,
            is_active: isActive
        };
        
        // إضافة معرف القناة إذا كان النوع قناة
        if (isChannel) {
            const channelUsername = document.getElementById('channel-username').value.trim();
            if (!channelUsername) {
                showToast('⚠️ الرجاء إدخال معرف القناة', 'warning');
                return;
            }
            taskData.channel_username = channelUsername;
        }
        
        console.log('📤 Sending task data:', taskData);
        
        // إرسال البيانات إلى API
        showLoading();
        const result = await API.request('/admin/tasks', 'POST', taskData);
        hideLoading();
        
        console.log('📥 Server response:', result);
        
        if (result.success) {
            showToast('✅ تم إضافة المهمة بنجاح!', 'success');
            closeAddTaskModal();
            
            // تحديث قائمة المهام
            if (typeof loadAdminTasks === 'function') {
                loadAdminTasks();
            }
        } else {
            const errorMsg = result.message || 'فشل إضافة المهمة';
            showToast(`❌ ${errorMsg}`, 'error');
            console.error('❌ Task creation failed:', result);
        }
        
    } catch (error) {
        hideLoading();
        console.error('❌ Error creating task:', error);
        showToast('❌ خطأ في الاتصال بالسيرفر', 'error');
    }
}

// ═══════════════════════════════════════════════════════════════
// 📤 EXPORT TO BACKEND (OLD CODE - WILL BE REMOVED LATER)
// ═══════════════════════════════════════════════════════════════

async function openAddChannelModal() {
    const channelId = prompt('معرف القناة (مثال: @ChannelName):');
    if (!channelId) return;
    
    const channelName = prompt('اسم القناة:');
    if (!channelName) return;
    
    const channelUrl = prompt('رابط القناة (https://t.me/...):');
    if (!channelUrl) return;
    
    try {
        showLoading();
        const result = await API.request('/admin/channels', 'POST', {
            channel_id: channelId,
            channel_name: channelName,
            channel_url: channelUrl,
            admin_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 1797127532
        });
        hideLoading();
        
        if (result.success) {
            showToast('✅ تم إضافة القناة بنجاح!', 'success');
            loadChannels();
        } else {
            showToast('❌ فشل إضافة القناة', 'error');
        }
    } catch (error) {
        hideLoading();
        showToast('❌ خطأ في الاتصال', 'error');
        console.error(error);
    }
}



// ═══════════════════════════════════════════════════════════════
// 🎰 ADD SPINS TO USER
// ═══════════════════════════════════════════════════════════════

// إضافة لفات سريعة لمستخدم محدد
function quickAddSpins(userId, username) {
    const spins = prompt(`🎰 كم لفة تريد إضافتها لـ ${username}?`);
    
    if (!spins) return;
    
    const spinsAmount = parseInt(spins);
    
    if (isNaN(spinsAmount) || spinsAmount < 1) {
        showToast('❌ يرجى إدخال عدد صحيح', 'error');
        return;
    }
    
    addSpinsToUserByUsername(username, spinsAmount);
}

async function addSpinsToUserByUsername(username, spinsAmount) {
    try {
        showLoading();
        
        const result = await API.request('/admin/add-spins', 'POST', {
            username: username,
            spins_count: spinsAmount,
            admin_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 1797127532
        });
        
        hideLoading();
        
        if (result.success) {
            showToast(`✅ تم إضافة ${spinsAmount} لفة لـ ${username}`, 'success');
            loadUsers();
        } else {
            showToast('❌ فشل إضافة اللفات: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error adding spins:', error);
        hideLoading();
        showToast('❌ خطأ في إضافة اللفات', 'error');
    }
}

function openAddSpinsModal() {
    const modal = document.getElementById('add-spins-modal');
    if (modal) {
        modal.classList.add('active');
        // Clear previous inputs
        document.getElementById('target-username').value = '';
        document.getElementById('spins-amount').value = '';
    }
}

async function addSpinsToUser() {
    const username = document.getElementById('target-username').value.trim();
    const spinsAmount = parseInt(document.getElementById('spins-amount').value);
    
    if (!username) {
        showToast('❌ يرجى إدخال اسم المستخدم', 'error');
        return;
    }
    
    if (!spinsAmount || spinsAmount < 1) {
        showToast('❌ يرجى إدخال عدد صحيح من اللفات', 'error');
        return;
    }
    
    try {
        showLoading();
        
        const result = await API.request('/admin/add-spins', 'POST', {
            username: username,
            spins_count: spinsAmount,
            admin_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 1797127532
        });
        
        hideLoading();
        
        if (result.success) {
            showToast(`✅ تم إضافة ${spinsAmount} لفة لـ ${username}`, 'success');
            closeModal('add-spins-modal');
            
            // Reload users list if on users tab
            if (document.getElementById('tab-users').classList.contains('active')) {
                loadUsers();
            }
        } else {
            showToast('❌ فشل إضافة اللفات: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error adding spins:', error);
        hideLoading();
        showToast('❌ خطأ في إضافة اللفات', 'error');
    }
}

// ═══════════════════════════════════════════════════════════════
// 🔧 HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

async function deleteChannel(channelId) {
    if (!confirm('هل تريد حذف هذه القناة؟')) return;
    
    try {
        showLoading();
        const result = await API.request(`/admin/channels?channel_id=${channelId}`, 'DELETE');
        hideLoading();
        
        if (result.success) {
            showToast('✅ تم حذف القناة', 'success');
            loadChannels();
        } else {
            showToast('❌ فشل الحذف', 'error');
        }
    } catch (error) {
        hideLoading();
        showToast('❌ خطأ في الاتصال', 'error');
    }
}

// عرض إحالات المستخدم
async function viewUserReferrals(userId, userName) {
    try {
        showLoading();
        const result = await API.request(`/admin/user-referrals?user_id=${userId}`, 'GET');
        
        hideLoading();
        
        if (result.success) {
            const referrals = result.data || [];
            showReferralsModal(userName, referrals);
        } else {
            showToast('❌ فشل تحميل الإحالات', 'error');
        }
    } catch (error) {
        hideLoading();
        console.error('Error loading referrals:', error);
        showToast('❌ خطأ في تحميل الإحالات', 'error');
    }
}

// عرض modal الإحالات
function showReferralsModal(userName, referrals) {
    const modal = document.getElementById('user-referrals-modal');
    if (!modal) {
        // إنشاء modal جديد
        const modalHtml = `
            <div id="user-referrals-modal" class="modal active">
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <h2>👥 إحالات ${userName}</h2>
                        <button class="close-modal" onclick="closeModal('user-referrals-modal')">✕</button>
                    </div>
                    <div class="modal-body" id="referrals-list-container">
                        <!-- سيتم ملؤها بالبيانات -->
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    } else {
        modal.classList.add('active');
    }
    
    // ملء قائمة الإحالات
    const container = document.getElementById('referrals-list-container');
    
    if (referrals.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #8b95a1;">
                <p style="font-size: 48px; margin-bottom: 16px;">👥</p>
                <p style="font-size: 18px;">لا توجد إحالات</p>
                <p style="font-size: 14px; margin-top: 8px;">لم يقم أحد بالتسجيل عبر رابط هذا المستخدم بعد</p>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div style="max-height: 500px; overflow-y: auto;">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>الاسم</th>
                            <th>اسم المستخدم</th>
                            <th>تاريخ التسجيل</th>
                            <th>الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${referrals.map(ref => `
                            <tr>
                                <td>${ref.id}</td>
                                <td>${ref.name}</td>
                                <td>${ref.username || '-'}</td>
                                <td>${new Date(ref.joined_at).toLocaleDateString('ar-EG')}</td>
                                <td><span class="status-badge ${ref.is_verified ? 'active' : ''}">${ref.is_verified ? '✅ مفعّل' : '⏳ معلق'}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div style="padding: 20px; text-align: center; color: #8b95a1; border-top: 1px solid #30363d; margin-top: 20px;">
                    <strong>إجمالي الإحالات:</strong> ${referrals.length}
                </div>
            </div>
        `;
    }
}
