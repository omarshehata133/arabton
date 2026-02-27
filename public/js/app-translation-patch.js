// ═══════════════════════════════════════════════════════════════
// 🔧 APP.JS TRANSLATION PATCH
// يضيف الترجمات للنصوص الموجودة في app.js
// ═══════════════════════════════════════════════════════════════

(function() {
    'use strict';
    
    console.log('🔧 Loading app.js translation patch...');
    
    // انتظر تحميل i18n
    function waitForI18n(callback) {
        if (typeof i18n !== 'undefined' && typeof t !== 'undefined') {
            callback();
        } else {
            setTimeout(() => waitForI18n(callback), 100);
        }
    }
    
    waitForI18n(function() {
        console.log('✅ i18n loaded, applying translation patches...');
        
        // Override النصوص في الصفحات المختلفة
        
        // ═══════════════ صفحة الإحالات ═══════════════
        function patchReferralsPage() {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            
                            // إصلاح رسالة "لا توجد إحالات"
                            if (node.textContent && node.textContent.includes('لم تقم بدعوة أحد بعد')) {
                                node.textContent = t('no-referrals-yet');
                            }
                            
                            // إصلاح زر النسخ
                            const copyBtns = node.querySelectorAll ? node.querySelectorAll('.btn-text') : [];
                            copyBtns.forEach(btn => {
                                if (btn.textContent === 'نسخ' || btn.textContent === 'Copy') {
                                    btn.textContent = t('copy');
                                }
                                if (btn.textContent === 'مشاركة الرابط' || btn.textContent === 'Share Link') {
                                    btn.textContent = t('share-link');
                                }
                            });
                        }
                    });
                });
            });
            
            const referralsPage = document.querySelector('#page-referrals');
            if (referralsPage) {
                observer.observe(referralsPage, {
                    childList: true,
                    subtree: true
                });
            }
        }
        
        // ═══════════════ صفحة المهام ═══════════════
        function patchTasksPage() {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            
                            // إصلاح رسالة "لا توجد مهام"
                            if (node.textContent && node.textContent.includes('لا توجد مهام حالياً')) {
                                node.textContent = t('no-tasks-now');
                            }
                            
                            // إصلاح حالة "مكتمل"
                            if (node.innerHTML && node.innerHTML.includes('مكتمل')) {
                                const img = node.querySelector('img');
                                if (img) {
                                    node.innerHTML = `<img src="/img/payment-success.svg" alt="✓" style="width: 14px; height: 14px; vertical-align: middle; margin-left: 2px;"> ${t('completed')}`;
                                }
                            }
                        }
                    });
                });
            });
            
            const tasksPage = document.querySelector('#page-tasks');
            if (tasksPage) {
                observer.observe(tasksPage, {
                    childList: true,
                    subtree: true
                });
            }
        }
        
        // ═══════════════ صفحة السحب ═══════════════
        function patchWithdrawPage() {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            
                            // إصلاح رسالة "لا توجد سحوبات"
                            if (node.textContent && node.textContent.includes('لا توجد سحوبات سابقة')) {
                                node.textContent = t('no-withdrawals-history');
                            }
                            
                            // إصلاح حالات السحب
                            if (node.classList && node.classList.contains('withdrawal-status')) {
                                if (node.innerHTML.includes('مكتمل')) {
                                    node.innerHTML = `<img src="/img/payment-success.svg" alt="✓" style="width: 14px; height: 14px; vertical-align: middle; margin-left: 2px;"> ${t('completed')}`;
                                } else if (node.innerHTML.includes('مرفوض')) {
                                    node.innerHTML = `<img src="/img/payment-failure.svg" alt="✗" style="width: 14px; height: 14px; vertical-align: middle; margin-left: 2px;"> ${t('rejected')}`;
                                }
                            }
                        }
                    });
                });
            });
            
            const withdrawPage = document.querySelector('#page-withdraw');
            if (withdrawPage) {
                observer.observe(withdrawPage, {
                    childList: true,
                    subtree: true
                });
            }
        }
        
        // ═══════════════ تطبيق جميع الإصلاحات ═══════════════
        function applyAllPatches() {
            patchReferralsPage();
            patchTasksPage();
            patchWithdrawPage();
            
            // تحديث أي نصوص موجودة بالفعل
            updateExistingTexts();
        }
        
        // ═══════════════ تحديث النصوص الموجودة ═══════════════
        function updateExistingTexts() {
            // تحديث النصوص المباشرة
            document.querySelectorAll('p, span, button').forEach(el => {
                const text = el.textContent.trim();
                
                // قائمة النصوص للاستبدال
                const replacements = {
                    'لم تقم بدعوة أحد بعد! شارك رابطك الآن 🚀': 'no-referrals-yet',
                    'نسخ': 'copy',
                    'مشاركة الرابط': 'share-link',
                    'لا توجد مهام حالياً. تحقق لاحقاً!': 'no-tasks-now',
                    'مكتمل': 'completed',
                    'لا توجد سحوبات سابقة': 'no-withdrawals-history',
                    'مرفوض': 'rejected'
                };
                
                if (replacements[text]) {
                    // تحقق من عدم وجود data-i18n لتجنب التكرار
                    if (!el.hasAttribute('data-i18n')) {
                        el.textContent = t(replacements[text]);
                    }
                }
            });
        }
        
        // بدء التطبيق عند تحميل الصفحة
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', applyAllPatches);
        } else {
            applyAllPatches();
        }
        
        // إعادة تطبيق الترجمات عند تغيير اللغة
        document.addEventListener('languageChanged', function() {
            console.log('🔄 Language changed, updating patched texts...');
            updateExistingTexts();
        });
        
        console.log('✅ Translation patch applied successfully');
    });
})();
