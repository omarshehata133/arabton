// ═══════════════════════════════════════════════════════════════
// 🌍 MULTI-LANGUAGE SUPPORT (i18n)
// Arabic, English, Russian
// ═══════════════════════════════════════════════════════════════

const translations = {
    ar: {
        // Header & Navigation
        'app-title': 'Arab Ton Gifts',
        'balance': 'الرصيد',
        'spins-available': 'دورات متاحة',
        
        // Navigation Tabs
        'home': 'الرئيسية',
        'tasks': 'المهام',
        'referrals': 'الإحالات',
        'withdrawal': 'السحب',
        
        // Hero Section
        'welcome': 'مرحباً بك في',
        'hero-title': '🎁 Arab Ton Gifts',
        'hero-subtitle': 'اربح عملات TON مجاناً عن طريق الدوران والمهام!',
        
        // Wheel Section
        'wheel-title': '🎡 عجلة الحظ',
        'spin-now': 'دور الآن!',
        'no-spins': 'لا توجد دورات متاحة',
        'get-more-spins': 'احصل على دورات إضافية',
        'spins-left': 'دورة متبقية',
        'spins-left-plural': 'دورات متبقية',
        
        // Statistics Section
        'stats-title': '📊 إحصائياتك',
        'total-spins': 'إجمالي الدورات',
        'total-referrals': 'إجمالي الإحالات',
        'valid-referrals': 'إحالات صالحة',
        'total-earned': 'إجمالي الأرباح',
        
        // Spin Results
        'congratulations': 'تهانينا!',
        'won': 'لقد ربحت',
        'better-luck': 'حظ أوفر في المرة القادمة!',
        'try-again': 'حاول مرة أخرى',
        'close': 'إغلاق',
        
        // Tasks Section
        'tasks-title': '📋 المهام المتاحة',
        'tasks-subtitle': 'أكمل المهام للحصول على دورات إضافية',
        'no-tasks': 'لا توجد مهام متاحة حالياً',
        'complete-task': 'إتمام المهمة',
        'task-completed': '✅ تم الإنجاز',
        'verify-task': 'التحقق من المهمة',
        'task-reward': 'المكافأة',
        'spin': 'دورة',
        'spins': 'دورات',
        'pinned-task': '📌 مثبت',
        'tasks-progress': 'مهام مكتملة',
        'tasks-progress-subtitle': 'كل 5 مهام = 1 دورة إضافية',
        
        // Referrals Section
        'referral-title': '👥 برنامج الإحالة',
        'referral-subtitle': 'ادع أصدقائك واربح المزيد!',
        'referral-link': 'رابط الإحالة الخاص بك',
        'copy-link': 'نسخ الرابط',
        'link-copied': 'تم نسخ الرابط!',
        'share-telegram': 'مشاركة عبر تيليجرام',
        'referral-stats': 'إحصائيات الإحالات',
        'your-referrals': 'إحالاتك',
        'no-referrals': 'لم تقم بإحالة أي شخص بعد',
        'referral-reward': 'كل إحالة صالحة = 1 دورة',
        'referral-status-valid': 'صالح',
        'referral-status-pending': 'قيد الانتظار',
        'referral-joined': 'انضم في',
        
        // Additional translations for app.js
        'no-referrals-yet': 'لم تقم بدعوة أحد بعد! شارك رابطك الآن 🚀',
        'copy': 'نسخ',
        'share-link': 'مشاركة الرابط',
        'no-tasks-now': 'لا توجد مهام حالياً. تحقق لاحقاً!',
        'completed': 'مكتمل',
        'no-withdrawals-history': 'لا توجد سحوبات سابقة',
        'rejected': 'مرفوض',
        
        // Withdrawal Section
        'withdrawal-title': '💰 طلب سحب',
        'withdrawal-subtitle': 'اسحب أرباحك إلى محفظتك',
        'minimum-withdrawal': 'الحد الأدنى للسحب',
        'select-method': 'اختر طريقة السحب',
        'ton-wallet': 'محفظة TON',
        'vodafone-cash': 'فودافون كاش',
        'wallet-address': 'عنوان المحفظة',
        'phone-number': 'رقم الهاتف',
        'amount': 'المبلغ',
        'available-balance': 'الرصيد المتاح',
        'request-withdrawal': 'طلب سحب',
        'withdrawal-history': 'سجل السحوبات',
        'no-withdrawals': 'لا توجد عمليات سحب سابقة',
        'withdrawal-status-pending': 'قيد المعالجة',
        'withdrawal-status-completed': 'مكتمل',
        'withdrawal-status-rejected': 'مرفوض',
        'withdrawal-date': 'التاريخ',
        
        // Channels Check
        'channels-title': '📢 انضم للقنوات الإجبارية',
        'channels-subtitle': 'للاستخدام الكامل للبوت، انضم لجميع القنوات',
        'join-all-channels': 'انضم لجميع القنوات',
        'verify-subscription': 'تحقق من الاشتراك',
        'joined': 'مشترك',
        'not-joined': 'غير مشترك',
        'checking': 'جاري التحقق...',
        'all-joined': 'رائع! أنت مشترك في جميع القنوات',
        
        // Errors & Messages
        'error': 'خطأ',
        'success': 'نجح',
        'loading': 'جاري التحميل...',
        'please-wait': 'الرجاء الانتظار...',
        'session-expired': 'انتهت الجلسة. الرجاء إعادة فتح البوت',
        'network-error': 'خطأ في الاتصال. تحقق من الإنترنت',
        'insufficient-balance': 'رصيد غير كافٍ',
        'invalid-amount': 'مبلغ غير صالح',
        'invalid-address': 'عنوان محفظة غير صالح',
        'invalid-phone': 'رقم هاتف غير صالح',
        'withdrawal-success': 'تم إرسال طلب السحب بنجاح',
        'task-completed-success': 'تم إكمال المهمة!',
        'join-channels-first': 'يجب الانضمام لجميع القنوات أولاً',
        
        // Footer
        'all-rights-reserved': 'جميع الحقوق محفوظة',
        'powered-by': 'مدعوم بواسطة',
    },
    
    en: {
        // Header & Navigation
        'app-title': 'Arab Ton Gifts',
        'balance': 'Balance',
        'spins-available': 'Spins Available',
        
        // Navigation Tabs
        'home': 'Home',
        'tasks': 'Tasks',
        'referrals': 'Referrals',
        'withdrawal': 'Withdrawal',
        
        // Hero Section
        'welcome': 'Welcome to',
        'hero-title': '🎁 Arab Ton Gifts',
        'hero-subtitle': 'Earn TON coins for free by spinning and completing tasks!',
        
        // Wheel Section
        'wheel-title': '🎡 Wheel of Fortune',
        'spin-now': 'Spin Now!',
        'no-spins': 'No spins available',
        'get-more-spins': 'Get more spins',
        'spins-left': 'spin left',
        'spins-left-plural': 'spins left',
        
        // Statistics Section
        'stats-title': '📊 Your Statistics',
        'total-spins': 'Total Spins',
        'total-referrals': 'Total Referrals',
        'valid-referrals': 'Valid Referrals',
        'total-earned': 'Total Earned',
        
        // Spin Results
        'congratulations': 'Congratulations!',
        'won': 'You won',
        'better-luck': 'Better luck next time!',
        'try-again': 'Try again',
        'close': 'Close',
        
        // Tasks Section
        'tasks-title': '📋 Available Tasks',
        'tasks-subtitle': 'Complete tasks to earn more spins',
        'no-tasks': 'No tasks available at the moment',
        'complete-task': 'Complete Task',
        'task-completed': '✅ Completed',
        'verify-task': 'Verify Task',
        'task-reward': 'Reward',
        'spin': 'spin',
        'spins': 'spins',
        'pinned-task': '📌 Pinned',
        'tasks-progress': 'Completed Tasks',
        'tasks-progress-subtitle': 'Every 5 tasks = 1 extra spin',
        
        // Referrals Section
        'referral-title': '👥 Referral Program',
        'referral-subtitle': 'Invite your friends and earn more!',
        'referral-link': 'Your Referral Link',
        'copy-link': 'Copy Link',
        'link-copied': 'Link copied!',
        'share-telegram': 'Share via Telegram',
        'referral-stats': 'Referral Statistics',
        'your-referrals': 'Your Referrals',
        'no-referrals': "You haven't referred anyone yet",
        'referral-reward': 'Each valid referral = 1 spin',
        'referral-status-valid': 'Valid',
        'referral-status-pending': 'Pending',
        'referral-joined': 'Joined on',
        
        // Additional translations for app.js
        'no-referrals-yet': "You haven't invited anyone yet! Share your link now 🚀",
        'copy': 'Copy',
        'share-link': 'Share Link',
        'no-tasks-now': 'No tasks available right now. Check back later!',
        'completed': 'Completed',
        'no-withdrawals-history': 'No withdrawal history',
        'rejected': 'Rejected',
        
        // Withdrawal Section
        'withdrawal-title': '💰 Request Withdrawal',
        'withdrawal-subtitle': 'Withdraw your earnings to your wallet',
        'minimum-withdrawal': 'Minimum Withdrawal',
        'select-method': 'Select withdrawal method',
        'ton-wallet': 'TON Wallet',
        'vodafone-cash': 'Vodafone Cash',
        'wallet-address': 'Wallet Address',
        'phone-number': 'Phone Number',
        'amount': 'Amount',
        'available-balance': 'Available Balance',
        'request-withdrawal': 'Request Withdrawal',
        'withdrawal-history': 'Withdrawal History',
        'no-withdrawals': 'No previous withdrawals',
        'withdrawal-status-pending': 'Processing',
        'withdrawal-status-completed': 'Completed',
        'withdrawal-status-rejected': 'Rejected',
        'withdrawal-date': 'Date',
        
        // Channels Check
        'channels-title': '📢 Join Required Channels',
        'channels-subtitle': 'To use the bot fully, join all channels',
        'join-all-channels': 'Join All Channels',
        'verify-subscription': 'Verify Subscription',
        'joined': 'Joined',
        'not-joined': 'Not Joined',
        'checking': 'Checking...',
        'all-joined': 'Great! You are subscribed to all channels',
        
        // Errors & Messages
        'error': 'Error',
        'success': 'Success',
        'loading': 'Loading...',
        'please-wait': 'Please wait...',
        'session-expired': 'Session expired. Please reopen the bot',
        'network-error': 'Connection error. Check your internet',
        'insufficient-balance': 'Insufficient balance',
        'invalid-amount': 'Invalid amount',
        'invalid-address': 'Invalid wallet address',
        'invalid-phone': 'Invalid phone number',
        'withdrawal-success': 'Withdrawal request sent successfully',
        'task-completed-success': 'Task completed!',
        'join-channels-first': 'You must join all channels first',
        
        // Footer
        'all-rights-reserved': 'All rights reserved',
        'powered-by': 'Powered by',
    },
    
    ru: {
        // Header & Navigation
        'app-title': 'Arab Ton Gifts',
        'balance': 'Баланс',
        'spins-available': 'Доступно вращений',
        
        // Navigation Tabs
        'home': 'Главная',
        'tasks': 'Задачи',
        'referrals': 'Рефералы',
        'withdrawal': 'Вывод',
        
        // Hero Section
        'welcome': 'Добро пожаловать в',
        'hero-title': '🎁 Arab Ton Gifts',
        'hero-subtitle': 'Зарабатывайте монеты TON бесплатно, вращая колесо и выполняя задания!',
        
        // Wheel Section
        'wheel-title': '🎡 Колесо Фортуны',
        'spin-now': 'Крутить сейчас!',
        'no-spins': 'Нет доступных вращений',
        'get-more-spins': 'Получить больше вращений',
        'spins-left': 'вращение осталось',
        'spins-left-plural': 'вращений осталось',
        
        // Statistics Section
        'stats-title': '📊 Ваша статистика',
        'total-spins': 'Всего вращений',
        'total-referrals': 'Всего рефералов',
        'valid-referrals': 'Действительные рефералы',
        'total-earned': 'Всего заработано',
        
        // Spin Results
        'congratulations': 'Поздравляем!',
        'won': 'Вы выиграли',
        'better-luck': 'Удачи в следующий раз!',
        'try-again': 'Попробовать снова',
        'close': 'Закрыть',
        
        // Tasks Section
        'tasks-title': '📋 Доступные задачи',
        'tasks-subtitle': 'Выполняйте задачи, чтобы заработать больше вращений',
        'no-tasks': 'В настоящее время нет доступных задач',
        'complete-task': 'Выполнить задание',
        'task-completed': '✅ Выполнено',
        'verify-task': 'Проверить задачу',
        'task-reward': 'Награда',
        'spin': 'вращение',
        'spins': 'вращений',
        'pinned-task': '📌 Закреплено',
        'tasks-progress': 'Выполненные задачи',
        'tasks-progress-subtitle': 'Каждые 5 задач = 1 дополнительное вращение',
        
        // Referrals Section
        'referral-title': '👥 Реферальная программа',
        'referral-subtitle': 'Приглашайте друзей и зарабатывайте больше!',
        'referral-link': 'Ваша реферальная ссылка',
        'copy-link': 'Копировать ссылку',
        'link-copied': 'Ссылка скопирована!',
        'share-telegram': 'Поделиться в Telegram',
        'referral-stats': 'Статистика рефералов',
        'your-referrals': 'Ваши рефералы',
        'no-referrals': 'Вы еще никого не пригласили',
        'referral-reward': 'Каждый действительный реферал = 1 вращение',
        'referral-status-valid': 'Действительный',
        'referral-status-pending': 'В ожидании',
        'referral-joined': 'Присоединился',
        
        // Additional translations for app.js
        'no-referrals-yet': 'Вы еще никого не пригласили! Поделитесь своей ссылкой сейчас 🚀',
        'copy': 'Копировать',
        'share-link': 'Поделиться ссылкой',
        'no-tasks-now': 'Сейчас нет доступных задач. Проверьте позже!',
        'completed': 'Выполнено',
        'no-withdrawals-history': 'Нет истории выводов',
        'rejected': 'Отклонено',
        
        // Withdrawal Section
        'withdrawal-title': '💰 Запрос на вывод',
        'withdrawal-subtitle': 'Выведите свой заработок на кошелек',
        'minimum-withdrawal': 'Минимальный вывод',
        'select-method': 'Выберите способ вывода',
        'ton-wallet': 'Кошелек TON',
        'vodafone-cash': 'Vodafone Cash',
        'wallet-address': 'Адрес кошелька',
        'phone-number': 'Номер телефона',
        'amount': 'Сумма',
        'available-balance': 'Доступный баланс',
        'request-withdrawal': 'Запросить вывод',
        'withdrawal-history': 'История выводов',
        'no-withdrawals': 'Нет предыдущих выводов',
        'withdrawal-status-pending': 'Обрабатывается',
        'withdrawal-status-completed': 'Завершено',
        'withdrawal-status-rejected': 'Отклонено',
        'withdrawal-date': 'Дата',
        
        // Channels Check
        'channels-title': '📢 Подпишитесь на обязательные каналы',
        'channels-subtitle': 'Для полного использования бота подпишитесь на все каналы',
        'join-all-channels': 'Присоединиться ко всем каналам',
        'verify-subscription': 'Проверить подписку',
        'joined': 'Подписан',
        'not-joined': 'Не подписан',
        'checking': 'Проверка...',
        'all-joined': 'Отлично! Вы подписаны на все каналы',
        
        // Errors & Messages
        'error': 'Ошибка',
        'success': 'Успешно',
        'loading': 'Загрузка...',
        'please-wait': 'Пожалуйста, подождите...',
        'session-expired': 'Сессия истекла. Пожалуйста, откройте бот снова',
        'network-error': 'Ошибка соединения. Проверьте интернет',
        'insufficient-balance': 'Недостаточно средств',
        'invalid-amount': 'Неверная сумма',
        'invalid-address': 'Неверный адрес кошелька',
        'invalid-phone': 'Неверный номер телефона',
        'withdrawal-success': 'Запрос на вывод успешно отправлен',
        'task-completed-success': 'Задача выполнена!',
        'join-channels-first': 'Сначала необходимо подписаться на все каналы',
        
        // Footer
        'all-rights-reserved': 'Все права защищены',
        'powered-by': 'При поддержке',
    }
};

// ═══════════════════════════════════════════════════════════════
// 🌐 LANGUAGE MANAGER
// ═══════════════════════════════════════════════════════════════

class LanguageManager {
    constructor() {
        // Get saved language or detect from Telegram
        this.currentLang = this.getSavedLanguage() || this.detectLanguage();
        this.direction = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    }
    
    detectLanguage() {
        // Detect from Telegram user language
        if (typeof Telegram !== 'undefined' && Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
            const userLang = Telegram.WebApp.initDataUnsafe.user?.language_code;
            if (userLang) {
                if (userLang.startsWith('ar')) return 'ar';
                if (userLang.startsWith('ru')) return 'ru';
                if (userLang.startsWith('en')) return 'en';
            }
        }
        
        // Default to Arabic
        return 'ar';
    }
    
    getSavedLanguage() {
        return localStorage.getItem('app-language');
    }
    
    setLanguage(lang) {
        if (!translations[lang]) {
            console.error(`Language ${lang} not supported`);
            return false;
        }
        
        this.currentLang = lang;
        this.direction = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Save to localStorage
        localStorage.setItem('app-language', lang);
        
        // Update HTML attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = this.direction;
        document.body.dir = this.direction;
        
        // Update all translatable elements
        this.updatePageTranslations();
        
        // Dispatch language change event for listeners
        const event = new CustomEvent('languageChanged', { detail: { lang: lang } });
        document.dispatchEvent(event);
        
        console.log(`✅ Language changed to: ${lang}`);
        return true;
    }
    
    translate(key) {
        return translations[this.currentLang][key] || translations['ar'][key] || key;
    }
    
    t(key) {
        return this.translate(key);
    }
    
    updatePageTranslations() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            
            // Update text or placeholder based on element type
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // Update title attribute for tooltips
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.translate(key);
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// 🚀 INITIALIZE LANGUAGE MANAGER
// ═══════════════════════════════════════════════════════════════

const i18n = new LanguageManager();

// Apply language on load
document.addEventListener('DOMContentLoaded', () => {
    i18n.setLanguage(i18n.currentLang);
});

console.log('✅ i18n loaded - Current language:', i18n.currentLang);
