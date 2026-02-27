"""
═══════════════════════════════════════════════════════════════════
🌐 BOT LANGUAGE HANDLERS - كود إضافي للغات
═══════════════════════════════════════════════════════════════════
أضف هذا الكود في ملف panda_giveaways_bot.py
"""

# ═══════════════════════════════════════════════════════════════
# 🌐 LANGUAGE COMMAND & CALLBACKS
# ═══════════════════════════════════════════════════════════════

async def language_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """معالج أمر تغيير اللغة /language"""
    user_id = update.effective_user.id
    
    # إنشاء أزرار اختيار اللغة
    keyboard = [
        [
            InlineKeyboardButton(
                t('btn_lang_ar', user_id),
                callback_data="lang_ar"
            ),
            InlineKeyboardButton(
                t('btn_lang_en', user_id),
                callback_data="lang_en"
            ),
            InlineKeyboardButton(
                t('btn_lang_ru', user_id),
                callback_data="lang_ru"
            )
        ]
    ]
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        t('language_select', user_id),
        parse_mode=ParseMode.HTML,
        reply_markup=reply_markup
    )

async def language_selection_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """معالج اختيار اللغة من الأزرار"""
    query = update.callback_query
    await query.answer()
    
    user_id = query.from_user.id
    data = query.data
    
    if data.startswith('lang_'):
        lang_code = data.replace('lang_', '')
        
        # حفظ اللغة في قاعدة البيانات
        if I18N_AVAILABLE and i18n:
            success = i18n.set_user_language(user_id, lang_code)
            
            if success:
                await query.edit_message_text(
                    t('language_changed', user_id),
                    parse_mode=ParseMode.HTML
                )
                logger.info(f"✅ User {user_id} language changed to {lang_code}")
            else:
                await query.edit_message_text("❌ Failed to change language. Try again.")
        return

# ═══════════════════════════════════════════════════════════════
# 📝 تسجيل المعالجات (أضف في دالة main)
# ═══════════════════════════════════════════════════════════════

# أضف هذا السطر مع CommandHandlers الأخرى:
# application.add_handler(CommandHandler("language", language_command))

# أضف هذا السطر مع CallbackQueryHandlers الأخرى:
# application.add_handler(CallbackQueryHandler(language_selection_callback, pattern="^lang_"))

# ═══════════════════════════════════════════════════════════════
# 🎨 تعديل القائمة الرئيسية لإضافة زر اللغة
# ═══════════════════════════════════════════════════════════════

# في دالة إنشاء القائمة الرئيسية (start_command بعد التحقق من القنوات)، أضف:
"""
# زر تغيير اللغة
keyboard.append([InlineKeyboardButton(t('btn_language', user_id), callback_data="open_language_menu")])
"""

# وفي language_selection_callback، أضف معالج لـ "open_language_menu":
"""
    elif data == "open_language_menu":
        keyboard = [
            [
                InlineKeyboardButton(t('btn_lang_ar', user_id), callback_data="lang_ar"),
                InlineKeyboardButton(t('btn_lang_en', user_id), callback_data="lang_en"),
                InlineKeyboardButton(t('btn_lang_ru', user_id), callback_data="lang_ru")
            ]
        ]
        await query.edit_message_text(
            t('language_select', user_id),
            parse_mode=ParseMode.HTML,
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
        return
"""
