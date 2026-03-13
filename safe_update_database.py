#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔄 Safe Database Update Script
تحديث آمن لقاعدة البيانات arabton.db
يضيف فقط الجداول والأعمدة الجديدة دون المساس بالبيانات الموجودة
"""

import sqlite3
from datetime import datetime
import os

# مسار قاعدة البيانات
DATABASE_PATH = 'arabton.db'

def safe_update_database():
    """تحديث آمن - إضافة التغييرات الجديدة فقط"""
    
    db_exists = os.path.exists(DATABASE_PATH)
    
    if not db_exists:
        print(f"⚠️  قاعدة البيانات غير موجودة: {DATABASE_PATH}")
        print("🔨 سيتم إنشاء قاعدة بيانات جديدة...")
    else:
        print(f"📂 تحديث قاعدة البيانات: {DATABASE_PATH}")
    
    print("="*60)
    
    try:
        conn = sqlite3.connect(DATABASE_PATH, timeout=30.0)
        conn.execute("PRAGMA journal_mode=WAL")
        cursor = conn.cursor()
        
        changes_made = 0
        
        # ═══════════════════════════════════════════════════════════
        # 1️⃣ إضافة جدول bot_settings إذا لم يكن موجوداً
        # ═══════════════════════════════════════════════════════════
        print("\n1️⃣ التحقق من جدول bot_settings...")
        
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='bot_settings'
        """)
        
        if cursor.fetchone() is None:
            print("   ⚙️  إنشاء جدول bot_settings...")
            cursor.execute("""
                CREATE TABLE bot_settings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    setting_key TEXT NOT NULL UNIQUE,
                    setting_value TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    updated_by INTEGER
                )
            """)
            print("   ✅ تم إنشاء جدول bot_settings")
            changes_made += 1
        else:
            print("   ℹ️  جدول bot_settings موجود بالفعل")
        
        # ═══════════════════════════════════════════════════════════
        # 2️⃣ إضافة الإعدادات الافتراضية (فقط إذا لم تكن موجودة)
        # ═══════════════════════════════════════════════════════════
        print("\n2️⃣ إضافة الإعدادات الافتراضية...")
        
        now = datetime.now().isoformat()
        default_settings = [
            ('min_withdrawal', '0.1', 'الحد الأدنى للسحب بالـ TON'),
            ('max_withdrawal', '100.0', 'الحد الأقصى للسحب بالـ TON'),
            ('referrals_per_spin', '5', 'عدد الإحالات المطلوبة للحصول على لفة واحدة'),
            ('auto_withdrawal_enabled', 'false', 'تفعيل السحب التلقائي'),
        ]
        
        settings_added = 0
        settings_exists = 0
        
        for key, value, description in default_settings:
            try:
                cursor.execute("""
                    INSERT OR IGNORE INTO bot_settings (setting_key, setting_value, updated_at)
                    VALUES (?, ?, ?)
                """, (key, value, now))
                
                if cursor.rowcount > 0:
                    print(f"   ✅ تمت إضافة: {key} = {value}")
                    print(f"      📝 {description}")
                    settings_added += 1
                    changes_made += 1
                else:
                    # التحقق من القيمة الحالية
                    cursor.execute("SELECT setting_value FROM bot_settings WHERE setting_key = ?", (key,))
                    current = cursor.fetchone()
                    if current:
                        print(f"   ℹ️  موجود: {key} = {current[0]}")
                        settings_exists += 1
            except Exception as e:
                print(f"   ⚠️  خطأ في إضافة {key}: {e}")
        
        # ═══════════════════════════════════════════════════════════
        # 3️⃣ التحقق من الأعمدة الإضافية في جدول users
        # ═══════════════════════════════════════════════════════════
        print("\n3️⃣ التحقق من أعمدة جدول users...")
        
        additional_columns = [
            ("users", "is_device_verified", "INTEGER DEFAULT 0", "حالة التحقق من الجهاز"),
            ("users", "verification_required", "INTEGER DEFAULT 1", "هل يتطلب التحقق"),
            ("users", "ban_reason", "TEXT", "سبب الحظر"),
            ("users", "language", "TEXT DEFAULT 'ar'", "لغة المستخدم"),
            ("users", "valid_referrals", "INTEGER DEFAULT 0", "عدد الإحالات الصحيحة"),
        ]
        
        columns_added = 0
        
        for table, column, definition, description in additional_columns:
            try:
                # التحقق من وجود العمود
                cursor.execute(f"PRAGMA table_info({table})")
                columns = [col[1] for col in cursor.fetchall()]
                
                if column not in columns:
                    cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")
                    print(f"   ✅ تمت إضافة عمود: {table}.{column}")
                    print(f"      📝 {description}")
                    columns_added += 1
                    changes_made += 1
                else:
                    print(f"   ℹ️  العمود {table}.{column} موجود")
            except Exception as e:
                print(f"   ⚠️  خطأ في إضافة {table}.{column}: {e}")
        
        # ═══════════════════════════════════════════════════════════
        # 4️⃣ التحقق من أعمدة جدول referrals
        # ═══════════════════════════════════════════════════════════
        print("\n4️⃣ التحقق من أعمدة جدول referrals...")
        
        referral_columns = [
            ("referrals", "channels_checked", "INTEGER DEFAULT 0", "تم التحقق من القنوات"),
            ("referrals", "device_verified", "INTEGER DEFAULT 0", "تم التحقق من الجهاز"),
            ("referrals", "validated_at", "TEXT", "تاريخ التحقق"),
        ]
        
        for table, column, definition, description in referral_columns:
            try:
                cursor.execute(f"PRAGMA table_info({table})")
                columns = [col[1] for col in cursor.fetchall()]
                
                if column not in columns:
                    cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")
                    print(f"   ✅ تمت إضافة عمود: {table}.{column}")
                    print(f"      📝 {description}")
                    columns_added += 1
                    changes_made += 1
                else:
                    print(f"   ℹ️  العمود {table}.{column} موجود")
            except Exception as e:
                print(f"   ⚠️  خطأ في إضافة {table}.{column}: {e}")
        
        # ═══════════════════════════════════════════════════════════
        # 5️⃣ حفظ التغييرات
        # ═══════════════════════════════════════════════════════════
        conn.commit()
        
        # ═══════════════════════════════════════════════════════════
        # 6️⃣ عرض ملخص التحديث
        # ═══════════════════════════════════════════════════════════
        print("\n" + "="*60)
        print("📊 ملخص التحديث:")
        print("="*60)
        print(f"✅ إعدادات جديدة: {settings_added}")
        print(f"ℹ️  إعدادات موجودة: {settings_exists}")
        print(f"✅ أعمدة جديدة: {columns_added}")
        print(f"📝 إجمالي التغييرات: {changes_made}")
        print("="*60)
        
        # ═══════════════════════════════════════════════════════════
        # 7️⃣ عرض الإعدادات الحالية
        # ═══════════════════════════════════════════════════════════
        print("\n📋 الإعدادات الحالية في bot_settings:")
        print("-"*60)
        
        cursor.execute("SELECT setting_key, setting_value, updated_at FROM bot_settings ORDER BY setting_key")
        settings = cursor.fetchall()
        
        if settings:
            for key, value, updated_at in settings:
                updated_date = updated_at[:19] if updated_at else 'N/A'
                print(f"   {key:25} = {value:15} ({updated_date})")
        else:
            print("   (لا توجد إعدادات)")
        
        print("-"*60)
        
        # ═══════════════════════════════════════════════════════════
        # 8️⃣ عرض إحصائيات قاعدة البيانات
        # ═══════════════════════════════════════════════════════════
        print("\n📊 إحصائيات قاعدة البيانات:")
        print("-"*60)
        
        # عدد المستخدمين
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        print(f"   👥 عدد المستخدمين: {user_count}")
        
        # عدد الإحالات
        cursor.execute("SELECT COUNT(*) FROM referrals")
        ref_count = cursor.fetchone()[0]
        print(f"   🔗 عدد الإحالات: {ref_count}")
        
        # عدد اللفات
        cursor.execute("SELECT COUNT(*) FROM spins")
        spin_count = cursor.fetchone()[0]
        print(f"   🎰 عدد اللفات: {spin_count}")
        
        # عدد السحوبات
        cursor.execute("SELECT COUNT(*) FROM withdrawals")
        withdrawal_count = cursor.fetchone()[0]
        print(f"   💸 عدد السحوبات: {withdrawal_count}")
        
        print("-"*60)
        
        conn.close()
        
        if changes_made > 0:
            print("\n✅ تم التحديث بنجاح!")
            print("💡 جميع البيانات الموجودة محفوظة ولم يتم المساس بها")
        else:
            print("\n✅ قاعدة البيانات محدثة بالفعل!")
            print("💡 لا توجد تغييرات مطلوبة")
        
        return True
        
    except Exception as e:
        print(f"\n❌ خطأ في تحديث قاعدة البيانات: {e}")
        import traceback
        traceback.print_exc()
        return False

def create_backup():
    """إنشاء نسخة احتياطية سريعة"""
    if not os.path.exists(DATABASE_PATH):
        print("ℹ️  لا توجد قاعدة بيانات للنسخ الاحتياطي")
        return True
    
    import shutil
    backup_name = f"Arab_ton_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db"
    
    try:
        shutil.copy2(DATABASE_PATH, backup_name)
        print(f"✅ تم إنشاء نسخة احتياطية: {backup_name}")
        return True
    except Exception as e:
        print(f"⚠️  فشل إنشاء النسخة الاحتياطية: {e}")
        print("❓ هل تريد المتابعة بدون نسخة احتياطية؟ (y/n)")
        response = input().lower()
        return response == 'y'

if __name__ == "__main__":
    print("="*60)
    print("🔄 تحديث آمن لقاعدة البيانات arabton.db")
    print("="*60)
    print("\n⚠️  هذا السكريبت:")
    print("   ✅ يضيف فقط الجداول والأعمدة الجديدة")
    print("   ✅ لا يحذف أي بيانات موجودة")
    print("   ✅ لا يعدل أي بيانات موجودة")
    print("   ✅ آمن 100% للاستخدام على قاعدة بيانات حية")
    
    # إنشاء نسخة احتياطية
    print("\n📦 إنشاء نسخة احتياطية...")
    if not create_backup():
        print("❌ تم الإلغاء")
        exit(1)
    
    # تحديث قاعدة البيانات
    print("\n🔄 بدء التحديث الآمن...")
    success = safe_update_database()
    
    if success:
        print("\n" + "="*60)
        print("✅ انتهى التحديث بنجاح!")
        print("="*60)
        print("\n💡 الخطوات التالية:")
        print("   1. شغّل البوت والموقع")
        print("   2. من لوحة الأدمن، يمكنك تغيير الإعدادات")
        print("   3. التغييرات ستطبق فوراً")
    else:
        print("\n" + "="*60)
        print("❌ فشل التحديث")
        print("="*60)
