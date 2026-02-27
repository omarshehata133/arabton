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
        'help_title': "<tg-emoji emoji-id='5472096095280569232'> 🎁</tg-emoji> <b>مساعدة Arab Ton Gifts</b>",
        'help_commands_title': "<b><tg-emoji emoji-id='5197269100878907942'>📋</tg-emoji> الأوامر المتاحة:</b>",
        'help_cmd_start': '/start - بدء البوت',
        'help_cmd_help': '/help - عرض المساعدة',
        'help_cmd_stats': '/stats - إحصائياتك الشخصية',
        'help_cmd_referrals': '/referrals - عرض إحالاتك',
        'help_cmd_balance': '/balance - عرض رصيدك',
        'help_wheel_title': "<b><tg-emoji emoji-id='5202046839678866384'>🎰</tg-emoji> كيف تعمل عجلة الحظ؟</b>",
        'help_wheel_1': '• افتح Mini App من زر "افتح Arab Ton Gifts"',
        'help_wheel_2': '• إستخدم لفاتك المتاحة',
        'help_wheel_3': '• اربح TON فوراً!',
        'help_referrals_title': "<b><tg-emoji emoji-id='5453957997418004470'>👥</tg-emoji> نظام الإحالات:</b>",
        'help_referrals_1': '• كل {refs} إحالات صحيحة = لفة مجانية',
        'help_referrals_2': '• شارك رابطك مع الأصدقاء',
        'help_referrals_3': '• تأكد من اشتراكهم بالقنوات',
        'help_withdrawals_title': "<b><tg-emoji emoji-id='5278467510604160626'>💰</tg-emoji> السحوبات:</b>",
        'help_withdrawals_min': '• الحد الأدنى: {min} TON',
        'help_withdrawals_2': '• ادخل من قسم السحب في Mini App',
        'help_withdrawals_3': '• اربط محفظة TON أو رقم فودافون كاش',
        'help_withdrawals_4': '• انتظر موافقة الأدمن',
        'help_support_title': "<b><tg-emoji emoji-id='5472201536727686043'>📞</tg-emoji> للدعم:</b>",
        'help_support_contact': 'تواصل مع @FPIOG',
        
        # Stats
        'stats_title_text': "<tg-emoji emoji-id='5422360266618707867'>📊</tg-emoji> <b>إحصائياتك الشخصية</b>",
        'stats_name': "<tg-emoji emoji-id='5453957997418004470'>👥</tg-emoji> <b>الاسم:</b> {name}",
        'stats_username': "<tg-emoji emoji-id='5812093549042210992'>🆔</tg-emoji> <b>المعرف:</b> @{username}",
        'stats_balance': "<tg-emoji emoji-id='5278467510604160626'>💰</tg-emoji> <b>الرصيد:</b> {balance:.4f} TON",
        'stats_spins': "<tg-emoji emoji-id='5202046839678866384'>🎰</tg-emoji> <b>لفات متاحة:</b> {spins}",
        'stats_total_spins': "<tg-emoji emoji-id='5226513232549664618'>🔢</tg-emoji> <b>إجمالي اللفات:</b> {total}",
        'stats_referrals': "<tg-emoji emoji-id='5453957997418004470'>👥</tg-emoji> <b>الإحالات:</b> {referrals}",
        'stats_next_spin': "<tg-emoji emoji-id='5217697679030637222'>⏳</tg-emoji> <b>متبقي للفة القادمة:</b> {remaining} إحالات",
        'stats_member_since': "<tg-emoji emoji-id='5373236586760651455'>📅</tg-emoji> <b>عضو منذ:</b> {date}",
        'stats_last_active': "<tg-emoji emoji-id='5345905193005371012'>⚡️</tg-emoji> <b>آخر نشاط:</b> {date}",
        'btn_get_ref_link': '🔗 رابط الدعوة',
        
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
        
        # Welcome Message (Main)
        'welcome_title': "<tg-emoji emoji-id=\'5472096095280569232\'>🎁</tg-emoji> <b>مرحباً بك في Arab Ton Gifts!</b> <tg-emoji emoji-id=\'5472096095280569232\'>🎁</tg-emoji>",
        'welcome_intro': "<b>{name}</b>، أهلاً بك في أفضل بوت للأرباح والهدايا! <tg-emoji emoji-id=\'5897920748101571572\'>🌟</tg-emoji>",
        'welcome_your_balance': "<tg-emoji emoji-id=\'5278467510604160626\'>💰</tg-emoji> <b>رصيدك الحالي:</b> {balance:.2f} TON",
        'welcome_your_spins': "<tg-emoji emoji-id=\'5202046839678866384\'>🎰</tg-emoji> <b>لفاتك المتاحة:</b> {spins}",
        'welcome_your_referrals': "<tg-emoji emoji-id=\'5453957997418004470\'>👥</tg-emoji> <b>إحالاتك:</b> {referrals}",
        'welcome_how_to_earn': "<b><tg-emoji emoji-id=\'5461009483314517035\'>🎯</tg-emoji> كيف تربح؟</b>",
        'welcome_invite_friends': '• قم بدعوة أصدقائك (كل {refs} إحالات = لفة مجانية)',
        'welcome_complete_tasks': '• أكمل المهام اليومية',
        'welcome_play_wheel': '• إلعب عجلة الحظ واربح TON!',
        'welcome_withdraw': '• إسحب أرباحك مباشرة إلى محفظتك',
        'welcome_start_now': "<b><tg-emoji emoji-id=\'5188481279963715781\'>🚀</tg-emoji> ابدأ الآن واستمتع بالأرباح!</b>",
        'btn_open_mini_app': '🎰 افتح Arab Ton Gifts',
        'btn_share_ref_link': '📤 مشاركة رابط الدعوة',
        'btn_withdrawals_channel': '📊 قناة السحوبات والإثباتات',
        'share_ref_text': "<tg-emoji emoji-id=\'5472096095280569232\'>🎁</tg-emoji> انضم لـ Arab Ton Gifts واربح TON مجاناً!\n\n{link}",        
        # Subscription Required
        'subscription_required_title': '<tg-emoji emoji-id=\'5370599459661045441\'>🤍</tg-emoji> <b>اشتراك إجباري</b>',
        'subscription_required_message': 'عزيزي <b>{name}</b>، للاستمرار في استخدام البوت، يجب الاشتراك في القناة التالية:\n\n• <b>{channel_name}</b>\n\nبعد الاشتراك، اضغط على زر "<tg-emoji emoji-id=\'5260463209562776385\'>✅</tg-emoji> تحققت من الاشتراك" أدناه.',
        'btn_subscribed': '✅ تحققت من الاشتراك',
        'btn_change_language': '🌐 تغيير اللغة',
        'btn_open_mini_app_text': 'افتح Arab Ton Gifts 🎁',
        'btn_share_ref_link_text': '📤 مشاركة رابط الدعوة',
        'btn_withdrawals_channel_text': '📊 قناة السحوبات والإثباتات',
        'ref_link_label': '🔗 <b>رابط الدعوة الخاص بك:</b>',    },
    
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
        'help_title': "<tg-emoji emoji-id='5472096095280569232'> 🎁</tg-emoji> <b>Arab Ton Gifts Help</b>",
        'help_commands_title': "<b><tg-emoji emoji-id='5197269100878907942'>📋</tg-emoji> Available Commands:</b>",
        'help_cmd_start': '/start - Start the bot',
        'help_cmd_help': '/help - Show help',
        'help_cmd_stats': '/stats - Your personal stats',
        'help_cmd_referrals': '/referrals - Show your referrals',
        'help_cmd_balance': '/balance - Show your balance',
        'help_wheel_title': "<b><tg-emoji emoji-id='5202046839678866384'>🎰</tg-emoji> How does the lucky wheel work?</b>",
        'help_wheel_1': '• Open Mini App from "Open Arab Ton Gifts" button',
        'help_wheel_2': '• Use your available spins',
        'help_wheel_3': '• Win TON instantly!',
        'help_referrals_title': "<b><tg-emoji emoji-id='5453957997418004470'>👥</tg-emoji> Referral System:</b>",
        'help_referrals_1': '• Every {refs} valid referrals = 1 free spin',
        'help_referrals_2': '• Share your link with friends',
        'help_referrals_3': '• Make sure they subscribe to channels',
        'help_withdrawals_title': "<b><tg-emoji emoji-id='5278467510604160626'>💰</tg-emoji> Withdrawals:</b>",
        'help_withdrawals_min': '• Minimum: {min} TON',
        'help_withdrawals_2': '• Enter from withdrawal section in Mini App',
        'help_withdrawals_3': '• Link TON wallet or Vodafone Cash number',
        'help_withdrawals_4': '• Wait for admin approval',
        'help_support_title': "<b><tg-emoji emoji-id='5472201536727686043'>📞</tg-emoji> Support:</b>",
        'help_support_contact': 'Contact @FPIOG',
        
        # Stats
        'stats_title_text': "<tg-emoji emoji-id='5422360266618707867'>📊</tg-emoji> <b>Your Personal Stats</b>",
        'stats_name': "<tg-emoji emoji-id='5453957997418004470'>👥</tg-emoji> <b>Name:</b> {name}",
        'stats_username': "<tg-emoji emoji-id='5812093549042210992'>🆔</tg-emoji> <b>Username:</b> @{username}",
        'stats_balance': "<tg-emoji emoji-id='5278467510604160626'>💰</tg-emoji> <b>Balance:</b> {balance:.4f} TON",
        'stats_spins': "<tg-emoji emoji-id='5202046839678866384'>🎰</tg-emoji> <b>Available Spins:</b> {spins}",
        'stats_total_spins': "<tg-emoji emoji-id='5226513232549664618'>🔢</tg-emoji> <b>Total Spins:</b> {total}",
        'stats_referrals': "<tg-emoji emoji-id='5453957997418004470'>👥</tg-emoji> <b>Referrals:</b> {referrals}",
        'stats_next_spin': "<tg-emoji emoji-id='5217697679030637222'>⏳</tg-emoji> <b>Remaining for next spin:</b> {remaining} referrals",
        'stats_member_since': "<tg-emoji emoji-id='5373236586760651455'>📅</tg-emoji> <b>Member Since:</b> {date}",
        'stats_last_active': "<tg-emoji emoji-id='5345905193005371012'>⚡️</tg-emoji> <b>Last Active:</b> {date}",
        'btn_get_ref_link': '🔗 Referral Link',
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
        
        # Welcome Message (Main)
        'welcome_title': "<tg-emoji emoji-id=\'5472096095280569232\'>🎁</tg-emoji> <b>Welcome to Arab Ton Gifts!</b> <tg-emoji emoji-id=\'5472096095280569232\'>🎁</tg-emoji>",
        'welcome_intro': "<b>{name}</b>, welcome to the best bot for earnings and gifts! <tg-emoji emoji-id=\'5897920748101571572\'>🌟</tg-emoji>",
        'welcome_your_balance': "<tg-emoji emoji-id=\'5278467510604160626\'>💰</tg-emoji> <b>Your Current Balance:</b> {balance:.2f} TON",
        'welcome_your_spins': "<tg-emoji emoji-id=\'5202046839678866384\'>🎰</tg-emoji> <b>Your Available Spins:</b> {spins}",
        'welcome_your_referrals': "<tg-emoji emoji-id=\'5453957997418004470\'>👥</tg-emoji> <b>Your Referrals:</b> {referrals}",
        'welcome_how_to_earn': "<b><tg-emoji emoji-id=\'5461009483314517035\'>🎯</tg-emoji> How to Earn?</b>",
        'welcome_invite_friends': '• Invite your friends ({refs} referrals = 1 free spin)',
        'welcome_complete_tasks': '• Complete daily tasks',
        'welcome_play_wheel': '• Play the lucky wheel and win TON!',
        'welcome_withdraw': '• Withdraw your earnings directly to your wallet',
        'welcome_start_now': "<b><tg-emoji emoji-id=\'5188481279963715781\'>🚀</tg-emoji> Start now and enjoy the profits!</b>",
        'btn_open_mini_app': '🎰 Open Arab Ton Gifts',
        'btn_share_ref_link': '📤 Share Referral Link',
        'btn_withdrawals_channel': '📊 Withdrawals & Proofs Channel',
        'share_ref_text': "<tg-emoji emoji-id=\'5472096095280569232\'>🎁</tg-emoji> Join Arab Ton Gifts and earn TON for free!\n\n{link}",        
        # Subscription Required
        'subscription_required_title': '<tg-emoji emoji-id=\'5370599459661045441\'>🤍</tg-emoji> <b>Subscription Required</b>',
        'subscription_required_message': 'Dear <b>{name}</b>, to continue using the bot, you must subscribe to the following channel:\n\n• <b>{channel_name}</b>\n\nAfter subscribing, click the "<tg-emoji emoji-id=\'5260463209562776385\'>✅</tg-emoji> I\'ve Subscribed" button below.',
        'btn_subscribed': '✅ I\'ve Subscribed',
        'btn_change_language': '🌐 Change Language',
        'btn_open_mini_app_text': 'Open Arab Ton Gifts 🎁',
        'btn_share_ref_link_text': '📤 Share Referral Link',
        'btn_withdrawals_channel_text': '📊 Withdrawals & Proofs Channel',
        'ref_link_label': '🔗 <b>Your Referral Link:</b>',    },
    
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
        'help_title': "<tg-emoji emoji-id='5472096095280569232'> 🎁</tg-emoji> <b>Помощь Arab Ton Gifts</b>",
        'help_commands_title': "<b><tg-emoji emoji-id='5197269100878907942'>📋</tg-emoji> Доступные команды:</b>",
        'help_cmd_start': '/start - Запустить бота',
        'help_cmd_help': '/help - Показать помощь',
        'help_cmd_stats': '/stats - Ваша личная статистика',
        'help_cmd_referrals': '/referrals - Показать ваших рефералов',
        'help_cmd_balance': '/balance - Показать ваш баланс',
        'help_wheel_title': "<b><tg-emoji emoji-id='5202046839678866384'>🎰</tg-emoji> Как работает колесо удачи?</b>",
        'help_wheel_1': '• Откройте Mini App с кнопки "Открыть Arab Ton Gifts"',
        'help_wheel_2': '• Используйте доступные вращения',
        'help_wheel_3': '• Выигрывайте TON мгновенно!',
        'help_referrals_title': "<b><tg-emoji emoji-id='5453957997418004470'>👥</tg-emoji> Реферальная система:</b>",
        'help_referrals_1': '• Каждые {refs} действительных реферала = 1 бесплатное вращение',
        'help_referrals_2': '• Поделитесь ссылкой с друзьями',
        'help_referrals_3': '• Убедитесь, что они подписались на каналы',
        'help_withdrawals_title': "<b><tg-emoji emoji-id='5278467510604160626'>💰</tg-emoji> Выводы:</b>",
        'help_withdrawals_min': '• Минимум: {min} TON',
        'help_withdrawals_2': '• Войдите в раздел вывода в Mini App',
        'help_withdrawals_3': '• Привяжите кошелек TON или номер Vodafone Cash',
        'help_withdrawals_4': '• Дождитесь одобрения администратора',
        'help_support_title': "<b><tg-emoji emoji-id='5472201536727686043'>📞</tg-emoji> Поддержка:</b>",
        'help_support_contact': 'Связаться с @FPIOG',
        
        # Stats
        'stats_title_text': "<tg-emoji emoji-id='5422360266618707867'>📊</tg-emoji> <b>Ваша личная статистика</b>",
        'stats_name': "<tg-emoji emoji-id='5453957997418004470'>👥</tg-emoji> <b>Имя:</b> {name}",
        'stats_username': "<tg-emoji emoji-id='5812093549042210992'>🆔</tg-emoji> <b>Никнейм:</b> @{username}",
        'stats_balance': "<tg-emoji emoji-id='5278467510604160626'>💰</tg-emoji> <b>Баланс:</b> {balance:.4f} TON",
        'stats_spins': "<tg-emoji emoji-id='5202046839678866384'>🎰</tg-emoji> <b>Доступные вращения:</b> {spins}",
        'stats_total_spins': "<tg-emoji emoji-id='5226513232549664618'>🔢</tg-emoji> <b>Всего вращений:</b> {total}",
        'stats_referrals': "<tg-emoji emoji-id='5453957997418004470'>👥</tg-emoji> <b>Рефералы:</b> {referrals}",
        'stats_next_spin': "<tg-emoji emoji-id='5217697679030637222'>⏳</tg-emoji> <b>Осталось до следующего вращения:</b> {remaining} рефералов",
        'stats_member_since': "<tg-emoji emoji-id='5373236586760651455'>📅</tg-emoji> <b>Участник с:</b> {date}",
        'stats_last_active': "<tg-emoji emoji-id='5345905193005371012'>⚡️</tg-emoji> <b>Последняя активность:</b> {date}",
        'btn_get_ref_link': '🔗 Реферальная ссылка',
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
        'error_occurred': '❌ Произошла ошибка. Попробуйте снова.',
        'user_not_found': '❌ Ваш аккаунт не найден. Сначала используйте /start.',
        
        # Welcome Message (Main)
        'welcome_title': "<tg-emoji emoji-id=\'5472096095280569232\'>🎁</tg-emoji> <b>Добро пожаловать в Arab Ton Gifts!</b> <tg-emoji emoji-id=\'5472096095280569232\'>🎁</tg-emoji>",
        'welcome_intro': "<b>{name}</b>, добро пожаловать в лучшего бота для заработка и подарков! <tg-emoji emoji-id=\'5897920748101571572\'>🌟</tg-emoji>",
        'welcome_your_balance': "<tg-emoji emoji-id=\'5278467510604160626\'>💰</tg-emoji> <b>Ваш текущий баланс:</b> {balance:.2f} TON",
        'welcome_your_spins': "<tg-emoji emoji-id=\'5202046839678866384\'>🎰</tg-emoji> <b>Ваши доступные вращения:</b> {spins}",
        'welcome_your_referrals': "<tg-emoji emoji-id=\'5453957997418004470\'>👥</tg-emoji> <b>Ваши рефералы:</b> {referrals}",
        'welcome_how_to_earn': "<b><tg-emoji emoji-id=\'5461009483314517035\'>🎯</tg-emoji> Как заработать?</b>",
        'welcome_invite_friends': '• Приглашайте друзей ({refs} рефералов = 1 бесплатное вращение)',
        'welcome_complete_tasks': '• Выполняйте ежедневные задания',
        'welcome_play_wheel': '• Крутите колесо удачи и выигрывайте TON!',
        'welcome_withdraw': '• Выводите заработок прямо на свой кошелек',
        'welcome_start_now': "<b><tg-emoji emoji-id=\'5188481279963715781\'>🚀</tg-emoji> Начните сейчас и наслаждайтесь прибылью!</b>",
        'btn_open_mini_app': '🎰 Открыть Arab Ton Gifts',
        'btn_share_ref_link': '📤 Поделиться реферальной ссылкой',
        'btn_withdrawals_channel': '📊 Канал выводов и доказательств',
        'share_ref_text': "<tg-emoji emoji-id=\'5472096095280569232\'>🎁</tg-emoji> Присоединяйтесь к Arab Ton Gifts и зарабатывайте TON бесплатно!\n\n{link}",        
        # Subscription Required
        'subscription_required_title': '<tg-emoji emoji-id=\'5370599459661045441\'>🤍</tg-emoji> <b>Обязательная подписка</b>',
        'subscription_required_message': 'Дорогой <b>{name}</b>, для продолжения использования бота, вы должны подписаться на следующий канал:\n\n• <b>{channel_name}</b>\n\nПосле подписки, нажмите кнопку "<tg-emoji emoji-id=\'5260463209562776385\'>✅</tg-emoji> Я подписался" ниже.',
        'btn_subscribed': '✅ Я подписался',
        'btn_change_language': '🌐 Изменить язык',
        'btn_open_mini_app_text': 'Открыть Arab Ton Gifts 🎁',
        'btn_share_ref_link_text': '📤 Поделиться реферальной ссылкой',
        'btn_withdrawals_channel_text': '📊 Канал выводов и доказательств',
        'ref_link_label': '🔗 <b>Ваша реферальная ссылка:</b>',    },
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
            
            cursor.execute("SELECT language FROM users WHERE user_id = ?", (user_id,))
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
                WHERE user_id = ?
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





