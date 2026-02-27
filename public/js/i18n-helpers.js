// ═══════════════════════════════════════════════════════════════
// 🌐 APP.JS - WITH i18n SUPPORT HELPER
// Helper functions to use translations in app.js
// ═══════════════════════════════════════════════════════════════

/**
 * Get translated text for a key
 * @param {string} key - Translation key
 * @returns {string} Translated text
 */
function t(key) {
    if (typeof i18n !== 'undefined' && i18n.translate) {
        return i18n.translate(key);
    }
    return key;
}

/**
 * Update all translatable elements on the page
 */
function updateTranslations() {
    if (typeof i18n !== 'undefined' && i18n.updatePageTranslations) {
        i18n.updatePageTranslations();
    }
}

/**
 * Show toast message with translation support
 * @param {string} messageKey - Translation key or direct message
 * @param {string} type - Toast type (success, error, info, warning)
 */
function showToastTranslated(messageKey, type = 'info') {
    const message = t(messageKey);
    if (typeof showToast === 'function') {
        showToast(message, type);
    } else {
        console.log(`[Toast ${type}]: ${message}`);
    }
}

/**
 * Format spin count with proper pluralization based on language
 * @param {number} count - Number of spins
 * @returns {string} Formatted spin text
 */
function formatSpinCount(count) {
    const lang = i18n?.currentLang || 'ar';
    
    if (lang === 'ar') {
        if (count === 0) return 'لا توجد دورات';
        if (count === 1) return 'دورة واحدة';
        if (count === 2) return 'دورتان';
        if (count >= 3 && count <= 10) return `${count} دورات`;
        return `${count} دورة`;
    } else if (lang === 'ru') {
        if (count === 0) return 'Нет вращений';
        if (count === 1) return '1 вращение';
        if (count >= 2 && count <= 4) return `${count} вращения`;
        return `${count} вращений`;
    } else { // English
        if (count === 0) return 'No spins';
        if (count === 1) return '1 spin';
        return `${count} spins`;
    }
}

/**
 * Format currency with proper direction based on language
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (TON, USD, etc.)
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency = 'TON') {
    const lang = i18n?.currentLang || 'ar';
    const formattedAmount = typeof amount === 'number' ? amount.toFixed(4) : amount;
    
    if (lang === 'ar') {
        return `${formattedAmount} ${currency}`;
    } else {
        return `${currency} ${formattedAmount}`;
    }
}

/**
 * Format date with proper locale
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const lang = i18n?.currentLang || 'ar';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const locales = {
        'ar': 'ar-EG',
        'en': 'en-US',
        'ru': 'ru-RU'
    };
    
    return dateObj.toLocaleDateString(locales[lang], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Export functions globally
if (typeof window !== 'undefined') {
    window.t = t;
    window.updateTranslations = updateTranslations;
    window.showToastTranslated = showToastTranslated;
    window.formatSpinCount = formatSpinCount;
    window.formatCurrency = formatCurrency;
    window.formatDate = formatDate;
}

console.log('✅ i18n helpers loaded');
