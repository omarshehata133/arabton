"""
═══════════════════════════════════════════════════════════
🌐 BOT INTERNATIONALIZATION (i18n) SYSTEM
═══════════════════════════════════════════════════════
نظام الترجمة الشامل لجميع رسائل البوت
يدعم 3 لغات: العربية، الإنجليزية، الروسية
"""

import sqlite3
from typing import Dict, Optional

# ═══════════════════════════════════════════════════════════
# 📚 TRANSLATIONS DATABASE
# ═══════════════════════════════════════════════════════════

TRANSLATIONS = {
    # ══════════════ ARABIC (ar) ══════════════
    'ar': {
        # Start Command & Verification
        'welcome_verified': '🎉 <b>مرحباً بك في Arab Ton Gifts!</b>',
        'device_verification_title': '🔐 <b>التحقق من الجهاز</b>',
        'dear_user': 'عزيزي <b>{name}</b>، مرحباً بك! 👋',
        'verification_required': 'للحفاظ على نزاهة النظام ومنع التلاعب، يجب التحقق من جهازك أولاً.',
        'one_time_only': '<b>⚡️ هذه الخطوة تتم مرة واحدة فقط!</b>',
        'why_verification': '<b>لماذا التحقق مهم؟</b>\n• ضمان عدالة الإحالات\n• منع الحسابات المزيفة والتلاعب',
        'no_personal_data': '<b>✅ النظام لا يستخدم بياناتك الشخصية</b>',
        'press_button_below': 'اضغط على الزر أدناه للبدء 👇',
        'btn_verify_device': '🔐 تحقق من جهازك',
        'btn_continue_to_bot': '✅ متابعة إلى البوت',
        'verification_success': '✅ <b>تم التحقق من جهازك بنجاح!</b>',
        'verification_complete': 'عزيزي <b>{name}</b>، تم التحقق من جهازك بنجاح! 🎉',
        
        # Bot Status
        'bot_disabled_title': '🔴 <b>البوت مغلق حالياً</b>',
        'bot_disabled_msg': 'البوت غير متاح في الوقت الحالي للصيانة.\n\n⏰ سيتم تفعيل البوت قريباً، يرجى المحاولة لاحقاً.\n\n🤍 تابعنا للحصول على آخر التحديثات!',
        
        # Ban Message
        'banned_title': '⛔ <b>تم حظرك من البوت</b>',
        'banned_msg': 'حسابك محظور من استخدام البوت.\n\n<b>السبب:</b> {reason}\n<b>🔐 حالة الحساب:</b> محظور\n\nإذا كنت تعتقد أن هذا خطأ، تواصل مع الدعم.',
        
        # Main Menu
        'main_menu_title': '🎁 <b>القائمة الرئيسية</b>',
        'your_balance': '💰 <b>رصيدك:</b> {balance} TON',
        'available_spins': '🎰 <b>لفات متاحة:</b> {spins}',
        'total_referrals': '👥 <b>إحالاتك:</b> {referrals}',
        'choose_action': 'اختر ما تريد:',
        
        # Buttons
        'btn_open_app': '🎰 افتح Mini App',
        'btn_ref_link': '🔗 رابط الدعوة',
        'btn_stats': '📊 إحصائياتي',
        'btn_withdrawals': '💸 السحوبات',
        'btn_help': '❓ المساعدة',
        'btn_language': '🌐 تغيير اللغة',
        'btn_admin_panel': '⚙️ لوحة المالكين',
        'btn_admin_dashboard': '🖥️ لوحة الأدمن',
        
        # Referrals
        'ref_title': '👥 <b>قائمة المدعوين</b>',
        'total_refs': '📊 <b>إجمالي الإحالات:</b> {total}',
        'valid_refs': '✅ <b>الإحالات الصحيحة:</b> {valid}',
        'spins_from_refs': '🎰 <b>لفاتك المتاحة:</b> {spins}',
        'next_spin_in': '⏳ <b>متبقي للفة القادمة:</b> {remaining} إحالات',
        'last_10_refs': '<b>آخر 10 مدعوين:</b>',
        'no_refs_yet': 'لم تقم بدعوة أحد بعد! شارك رابط الدعوة الآن 🚀',
        'your_ref_link': '🔗 <b>رابط الدعوة الخاص بك:</b>\n<code>{link}</code>',
        'btn_share_link': '📤 مشاركة الرابط',
        
        # Stats
        'stats_title': '📊 <b>إحصائياتك الشخصية</b>',
        'name_label': '👥 <b>الاسم:</b> {name}',
        'username_label': '🆔 <b>المعرف:</b> @{username}',
        'balance_label': '💰 <b>الرصيد:</b> {balance} TON',
        'spins_label': '🎰 <b>لفات متاحة:</b> {spins}',
        'total_spins_label': '🔢 <b>إجمالي اللفات:</b> {total}',
        'referrals_label': '👥 <b>الإحالات:</b> {referrals}',
        'member_since': '📅 <b>عضو منذ:</b> {date}',
        'last_active': '⚡️ <b>آخر نشاط:</b> {date}',
        
        # Balance
        'balance_title': '💰 <b>رصيدك</b>',
        'current_balance': '💵 <b>الرصيد الحالي:</b> {balance} TON',
        'can_withdraw': '✅ يمكنك سحب {balance} TON',
        'min_withdrawal': '⚠️ الحد الأدنى للسحب: {min} TON',
        'btn_withdraw_now': '💸 اسحب الآن',
        'btn_play_earn': '🎰 العب واربح',
        
        # Help
        'help_title': '❓ <b>مساعدة - كيف تستخدم البوت؟</b>',
        'help_how_to_earn': '<b>🎯 كيف تربح TON؟</b>',
        'help_earn_1': '1️⃣ <b>لف العجلة:</b> العب واربح مكافآت فورية',
        'help_earn_2': '2️⃣ <b>ادعُ أصدقاء:</b> احصل على لفة مجانية لكل {refs} إحالات',
        'help_earn_3': '3️⃣ <b>اجمع الأرباح:</b> اسحب رصيدك عند بلوغ الحد الأدنى',
        'help_commands': '<b>📋 الأوامر المتاحة:</b>',
        'help_cmd_start': '/start - عرض القائمة الرئيسية',
        'help_cmd_stats': '/stats - عرض إحصائياتك',
        'help_cmd_ref': '/ref - قائمة المدعوين',
        'help_cmd_balance': '/balance - عرض رصيدك',
        'help_cmd_help': '/help - عرض هذه المساعدة',
        'help_withdrawal': '<b>💸 السحب:</b>',
        'help_withdrawal_min': '• الحد الأدنى: {min} TON',
        'help_withdrawal_methods': '• الطرق: TON Wallet، Vodafone Cash',
        'help_support': '<b>💬 الدعم:</b>',
        'help_contact': 'تواصل مع @FPIOG',
        
        # Language Selection
        'language_select': '🌐 <b>اختر اللغة / Choose Language / Выберите язык</b>',
        'language_changed': '✅ تم تغيير اللغة إلى العربية',
        'btn_lang_ar': '🇸🇦 العربية',
        'btn_lang_en': '🇬🇧 English',
        'btn_lang_ru': '🇷🇺 Русский',
        
        # Channels
        'channels_title': '📢 <b>القنوات الإجبارية</b>',
        'channels_msg': 'للاستمرار، يجب الاشتراك في هذه القنوات:',
        'btn_join_channel': '✅ انضم للقناة',
        'btn_check_subscription': '🔄 تحقق من الاشتراك',
        'not_subscribed': '❌ لم تشترك في جميع القنوات بعد',
        'channels_verified': '✅ رائع! أنت مشترك في جميع القنوات',
        
        # Errors
        'error_occurred': '❌ حدث خطأ. حاول مرة أخرى.',
        'user_not_found': '❌ لم يتم العثور على حسابك. استخدم /start أولاً.',
    },
    
    # ══════════════ ENGLISH (en) ══════════════
    'en': {
        # Start Command & Verification
        'welcome_verified': '🎉 <b>Welcome to Arab Ton Gifts!</b>',
        'device_verification_title': '🔐 <b>Device Verification</b>',
        'dear_user': 'Dear <b>{name}</b>, welcome! 👋',
        'verification_required': 'To maintain system integrity and prevent fraud, you must verify your device first.',
        'one_time_only': '<b>⚡️ This step is done only once!</b>',
        'why_verification': '<b>Why is verification important?</b>\n• Ensure fair referrals\n• Prevent fake accounts and fraud',
        'no_personal_data': '<b>✅ The system does not use your personal data</b>',
        'press_button_below': 'Press the button below to start 👇',
        'btn_verify_device': '🔐 Verify Your Device',
        'btn_continue_to_bot': '✅ Continue to Bot',
        'verification_success': '✅ <b>Device verified successfully!</b>',
        'verification_complete': 'Dear <b>{name}</b>, your device has been verified successfully! 🎉',
        
        # Bot Status
        'bot_disabled_title': '🔴 <b>Bot Currently Disabled</b>',
        'bot_disabled_msg': 'The bot is currently unavailable for maintenance.\n\n⏰ It will be activated soon, please try again later.\n\n🤍 Follow us for updates!',
        
        # Ban Message
        'banned_title': '⛔ <b>You Are Banned</b>',
        'banned_msg': 'Your account is banned from using the bot.\n\n<b>Reason:</b> {reason}\n<b>🔐 Account Status:</b> Banned\n\nIf you believe this is a mistake, contact support.',
        
        # Main Menu
        'main_menu_title': '🎁 <b>Main Menu</b>',
        'your_balance': '💰 <b>Your Balance:</b> {balance} TON',
        'available_spins': '🎰 <b>Available Spins:</b> {spins}',
        'total_referrals': '👥 <b>Your Referrals:</b> {referrals}',
        'choose_action': 'Choose what you want:',
        
        # Buttons
        'btn_open_app': '🎰 Open Mini App',
        'btn_ref_link': '🔗 Referral Link',
        'btn_stats': '📊 My Stats',
        'btn_withdrawals': '💸 Withdrawals',
        'btn_help': '❓ Help',
        'btn_language': '🌐 Change Language',
        'btn_admin_panel': '⚙️ Owner Panel',
        'btn_admin_dashboard': '🖥️ Admin Dashboard',
        
        # Referrals
        'ref_title': '👥 <b>Referral List</b>',
        'total_refs': '📊 <b>Total Referrals:</b> {total}',
        'valid_refs': '✅ <b>Valid Referrals:</b> {valid}',
        'spins_from_refs': '🎰 <b>Your Available Spins:</b> {spins}',
        'next_spin_in': '⏳ <b>Remaining for next spin:</b> {remaining} referrals',
        'last_10_refs': '<b>Last 10 Referrals:</b>',
        'no_refs_yet': 'You haven\'t invited anyone yet! Share your referral link now 🚀',
        'your_ref_link': '🔗 <b>Your Referral Link:</b>\n<code>{link}</code>',
        'btn_share_link': '📤 Share Link',
        
        # Stats
        'stats_title': '📊 <b>Your Personal Stats</b>',
        'name_label': '👥 <b>Name:</b> {name}',
        'username_label': '🆔 <b>Username:</b> @{username}',
        'balance_label': '💰 <b>Balance:</b> {balance} TON',
        'spins_label': '🎰 <b>Available Spins:</b> {spins}',
        'total_spins_label': '🔢 <b>Total Spins:</b> {total}',
        'referrals_label': '👥 <b>Referrals:</b> {referrals}',
        'member_since': '📅 <b>Member Since:</b> {date}',
        'last_active': '⚡️ <b>Last Active:</b> {date}',
        
        # Balance
        'balance_title': '💰 <b>Your Balance</b>',
        'current_balance': '💵 <b>Current Balance:</b> {balance} TON',
        'can_withdraw': '✅ You can withdraw {balance} TON',
        'min_withdrawal': '⚠️ Minimum withdrawal: {min} TON',
        'btn_withdraw_now': '💸 Withdraw Now',
        'btn_play_earn': '🎰 Play & Earn',
        
        # Help
        'help_title': '❓ <b>Help - How to Use the Bot?</b>',
        'help_how_to_earn': '<b>🎯 How to Earn TON?</b>',
        'help_earn_1': '1️⃣ <b>Spin the Wheel:</b> Play and win instant rewards',
        'help_earn_2': '2️⃣ <b>Invite Friends:</b> Get a free spin for every {refs} referrals',
        'help_earn_3': '3️⃣ <b>Collect Earnings:</b> Withdraw your balance when you reach the minimum',
        'help_commands': '<b>📋 Available Commands:</b>',
        'help_cmd_start': '/start - Show main menu',
        'help_cmd_stats': '/stats - Show your stats',
        'help_cmd_ref': '/ref - Referral list',
        'help_cmd_balance': '/balance - Show your balance',
        'help_cmd_help': '/help - Show this help',
        'help_withdrawal': '<b>💸 Withdrawal:</b>',
        'help_withdrawal_min': '• Minimum: {min} TON',
        'help_withdrawal_methods': '• Methods: TON Wallet, Vodafone Cash',
        'help_support': '<b>💬 Support:</b>',
        'help_contact': 'Contact @FPIOG',
        
        # Language Selection
        'language_select': '🌐 <b>Choose Language / اختر اللغة / Выберите язык</b>',
        'language_changed': '✅ Language changed to English',
        'btn_lang_ar': '🇸🇦 العربية',
        'btn_lang_en': '🇬🇧 English',
        'btn_lang_ru': '🇷🇺 Русский',
        
        # Channels
        'channels_title': '📢 <b>Required Channels</b>',
        'channels_msg': 'To continue, you must subscribe to these channels:',
        'btn_join_channel': '✅ Join Channel',
        'btn_check_subscription': '🔄 Check Subscription',
        'not_subscribed': '❌ You haven\'t subscribed to all channels yet',
        'channels_verified': '✅ Great! You\'re subscribed to all channels',
        
        # Errors
        'error_occurred': '❌ An error occurred. Try again.',
        'user_not_found': '❌ Your account was not found. Use /start first.',
    },
    
    # ══════════════ RUSSIAN (ru) ══════════════
    'ru': {
        # Start Command & Verification
        'welcome_verified': '🎉 <b>Добро пожаловать в Arab Ton Gifts!</b>',
        'device_verification_title': '🔐 <b>Проверка устройства</b>',
        'dear_user': 'Дорогой <b>{name}</b>, добро пожаловать! 👋',
        'verification_required': 'Для поддержания целостности системы и предотвращения мошенничества необходимо сначала проверить ваше устройство.',
        'one_time_only': '<b>⚡️ Этот шаг выполняется только один раз!</b>',
        'why_verification': '<b>Почему важна проверка?</b>\n• Обеспечение честных рефералов\n• Предотвращение поддельных аккаунтов и мошенничества',
        'no_personal_data': '<b>✅ Система не использует ваши личные данные</b>',
        'press_button_below': 'Нажмите кнопку ниже, чтобы начать 👇',
        'btn_verify_device': '🔐 Проверить устройство',
        'btn_continue_to_bot': '✅ Перейти к боту',
        'verification_success': '✅ <b>Устройство успешно проверено!</b>',
        'verification_complete': 'Дорогой <b>{name}</b>, ваше устройство было успешно проверено! 🎉',
        
        # Bot Status
        'bot_disabled_title': '🔴 <b>Бот временно отключен</b>',
        'bot_disabled_msg': 'Бот в данный момент недоступен из-за технического обслуживания.\n\n⏰ Он будет активирован в ближайшее время, повторите попытку позже.\n\n🤍 Следите за обновлениями!',
        
        # Ban Message
        'banned_title': '⛔ <b>Вы забанены</b>',
        'banned_msg': 'Ваш аккаунт заблокирован.\n\n<b>Причина:</b> {reason}\n<b>🔐 Статус аккаунта:</b> Заблокирован\n\nЕсли вы считаете, что это ошибка, свяжитесь с поддержкой.',
        
        # Main Menu
        'main_menu_title': '🎁 <b>Главное меню</b>',
        'your_balance': '💰 <b>Ваш баланс:</b> {balance} TON',
        'available_spins': '🎰 <b>Доступные вращения:</b> {spins}',
        'total_referrals': '👥 <b>Ваши рефералы:</b> {referrals}',
        'choose_action': 'Выберите действие:',
        
        # Buttons
        'btn_open_app': '🎰 Открыть приложение',
        'btn_ref_link': '🔗 Реферальная ссылка',
        'btn_stats': '📊 Моя статистика',
        'btn_withdrawals': '💸 Выводы',
        'btn_help': '❓ Помощь',
        'btn_language': '🌐 Изменить язык',
        'btn_admin_panel': '⚙️ Панель владельца',
        'btn_admin_dashboard': '🖥️ Панель администратора',
        
        # Referrals
        'ref_title': '👥 <b>Список рефералов</b>',
        'total_refs': '📊 <b>Всего рефералов:</b> {total}',
        'valid_refs': '✅ <b>Действительных рефералов:</b> {valid}',
        'spins_from_refs': '🎰 <b>Ваши доступные вращения:</b> {spins}',
        'next_spin_in': '⏳ <b>Осталось до следующего вращения:</b> {remaining} рефералов',
        'last_10_refs': '<b>Последние 10 рефералов:</b>',
        'no_refs_yet': 'Вы еще никого не пригласили! Поделитесь своей реферальной ссылкой сейчас 🚀',
        'your_ref_link': '🔗 <b>Ваша реферальная ссылка:</b>\n<code>{link}</code>',
        'btn_share_link': '📤 Поделиться ссылкой',
        
        # Stats
        'stats_title': '📊 <b>Ваша личная статистика</b>',
        'name_label': '👥 <b>Имя:</b> {name}',
        'username_label': '🆔 <b>Никнейм:</b> @{username}',
        'balance_label': '💰 <b>Баланс:</b> {balance} TON',
        'spins_label': '🎰 <b>Доступные вращения:</b> {spins}',
        'total_spins_label': '🔢 <b>Всего вращений:</b> {total}',
        'referrals_label': '👥 <b>Рефералы:</b> {referrals}',
        'member_since': '📅 <b>Участник с:</b> {date}',
        'last_active': '⚡️ <b>Последняя активность:</b> {date}',
        
        # Balance
        'balance_title': '💰 <b>Ваш баланс</b>',
        'current_balance': '💵 <b>Текущий баланс:</b> {balance} TON',
        'can_withdraw': '✅ Вы можете вывести {balance} TON',
        'min_withdrawal': '⚠️ Минимальная сумма вывода: {min} TON',
        'btn_withdraw_now': '💸 Вывести сейчас',
        'btn_play_earn': '🎰 Играть и зарабатывать',
        
        # Help
        'help_title': '❓ <b>Помощь - Как использовать бота?</b>',
        'help_how_to_earn': '<b>🎯 Как заработать TON?</b>',
        'help_earn_1': '1️⃣ <b>Крутите колесо:</b> Играйте и выигрывайте мгновенные награды',
        'help_earn_2': '2️⃣ <b>Приглашайте друзей:</b> Получайте бесплатное вращение за каждые {refs} рефералов',
        'help_earn_3': '3️⃣ <b>Собирайте заработок:</b> Выводите баланс при достижении минимума',
        'help_commands': '<b>📋 Доступные команды:</b>',
        'help_cmd_start': '/start - Показать главное меню',
        'help_cmd_stats': '/stats - Показать вашу статистику',
        'help_cmd_ref': '/ref - Список рефералов',
        'help_cmd_balance': '/balance - Показать ваш баланс',
        'help_cmd_help': '/help - Показать эту помощь',
        'help_withdrawal': '<b>💸 Вывод средств:</b>',
        'help_withdrawal_min': '• Минимум: {min} TON',
        'help_withdrawal_methods': '• Способы: TON Кошелек, Vodafone Cash',
        'help_support': '<b>💬 Поддержка:</b>',
        'help_contact': 'Связаться с @FPIOG',
        
        # Language Selection
        'language_select': '🌐 <b>Выберите язык / Choose Language / اختر اللغة</b>',
        'language_changed': '✅ Язык изменен на русский',
        'btn_lang_ar': '🇸🇦 العربية',
        'btn_lang_en': '🇬🇧 English',
        'btn_lang_ru': '🇷🇺 Русский',
        
        # Channels
        'channels_title': '📢 <b>Обязательные каналы</b>',
        'channels_msg': 'Для продолжения подпишитесь на эти каналы:',
        'btn_join_channel': '✅ Присоединиться к каналу',
        'btn_check_subscription': '🔄 Проверить подписку',
        'not_subscribed': '❌ Вы еще не подписались на все каналы',
        'channels_verified': '✅ Отлично! Вы подписаны на все каналы',
        
        # Errors
        'error_occurred': '❌ Произошла ошибка. Попробуйте еще раз.',
        'user_not_found': '❌ Ваш аккаунт не найден. Сначала используйте /start.',
    }
}

# ═══════════════════════════════════════════════════════════
# 🌐 TRANSLATION MANAGER CLASS
# ═══════════════════════════════════════════════════════════

class BotI18n:
    """مدير الترجمة الذكي للبوت"""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
        self.default_lang = 'ar'
    
    def get_user_language(self, user_id: int) -> str:
        """جلب لغة المستخدم من قاعدة البيانات"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute("SELECT language FROM users WHERE id = ?", (user_id,))
            result = cursor.fetchone()
            
            conn.close()
            
            if result and result[0]:
                return result[0]
            return self.default_lang
        except Exception as e:
            print(f"Error getting user language: {e}")
            return self.default_lang
    
    def set_user_language(self, user_id: int, lang_code: str) -> bool:
        """حفظ لغة المستخدم في قاعدة البيانات"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute("""
                UPDATE users 
                SET language = ? 
                WHERE id = ?
            """, (lang_code, user_id))
            
            conn.commit()
            conn.close()
            
            return True
        except Exception as e:
            print(f"Error setting user language: {e}")
            return False
    
    def t(self, key: str, user_id: int = None, lang: str = None, **kwargs) -> str:
        """
        ترجمة النص حسب لغة المستخدم
        
        Args:
            key: مفتاح الترجمة
            user_id: معرف المستخدم (اختياري)
            lang: اللغة المباشرة (اختياري)
            **kwargs: متغيرات للاستبدال في النص
        
        Returns:
            النص المترجم
        """
        # تحديد اللغة
        if lang:
            lang_code = lang
        elif user_id:
            lang_code = self.get_user_language(user_id)
        else:
            lang_code = self.default_lang
        
        # التأكد من أن اللغة مدعومة
        if lang_code not in TRANSLATIONS:
            lang_code = self.default_lang
        
        # جلب الترجمة
        text = TRANSLATIONS.get(lang_code, {}).get(key, key)
        
        # استبدال المتغيرات
        if kwargs:
            try:
                text = text.format(**kwargs)
            except:
                pass
        
        return text
    
    def get_available_languages(self) -> list:
        """الحصول على قائمة اللغات المتاحة"""
        return list(TRANSLATIONS.keys())

# ═══════════════════════════════════════════════════════════
# 🚀 QUICK ACCESS
# ═══════════════════════════════════════════════════════════

def init_i18n(db_path: str) -> BotI18n:
    """تهيئة نظام الترجمة"""
    return BotI18n(db_path)
