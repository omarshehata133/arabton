// ═══════════════════════════════════════════════════════════════
// 📢 REQUIRED CHANNELS CHECK MODULE
// ═══════════════════════════════════════════════════════════════

console.log('🚀🚀🚀 channels-check.js is LOADING NOW! 🚀🚀🚀');
console.log('📂 channels-check.js: Starting module definition...');

const ChannelsCheck = {
    channels: [],

    getTelegramInitData() {
        return window.Telegram?.WebApp?.initData || window._restored_init_data || '';
    },
    
    async init() {
        console.log('📢 Initializing Required Channels Check...');
        if (typeof ChannelsLogger !== 'undefined') {
            ChannelsLogger.log('init() - Starting channels check initialization');
        }
        await this.loadChannels();
        await this.verifySubscription();
    },
    
    async loadChannels() {
        try {
            const apiUrl = `${CONFIG.API_BASE_URL}/required-channels`;
            const initData = this.getTelegramInitData();
            console.log('📡 Fetching required channels from API:', apiUrl);
            if (typeof ChannelsLogger !== 'undefined') {
                ChannelsLogger.log('loadChannels() - Fetching from: ' + apiUrl);
            }
            
            const response = await fetch(apiUrl, {
                headers: initData ? { 'X-Telegram-Init-Data': initData } : {}
            });
            const data = await response.json();
            
            console.log('📦 API Response:', data);
            if (typeof ChannelsLogger !== 'undefined') {
                ChannelsLogger.log('loadChannels() - API Response received', data);
            }
            
            if (data.success && data.channels && data.channels.length > 0) {
                this.channels = data.channels;
                console.log(`✅ Loaded ${this.channels.length} required channels:`, this.channels);
                if (typeof ChannelsLogger !== 'undefined') {
                    ChannelsLogger.log(`loadChannels() - ✅ Loaded ${this.channels.length} channels`, this.channels);
                }
            } else {
                console.warn('⚠️ No channels in API response, checking CONFIG...');
                if (typeof ChannelsLogger !== 'undefined') {
                    ChannelsLogger.log('loadChannels() - ⚠️ No channels in API, checking CONFIG');
                }
                // استخدام القنوات من CONFIG كبديل
                if (window.CONFIG && window.CONFIG.REQUIRED_CHANNELS && window.CONFIG.REQUIRED_CHANNELS.length > 0) {
                    this.channels = window.CONFIG.REQUIRED_CHANNELS.map(ch => ({
                        id: ch.id,
                        channel_id: ch.id,
                        channel_name: ch.name,
                        channel_url: ch.url
                    }));
                    console.log(`✅ Loaded ${this.channels.length} channels from CONFIG:`, this.channels);
                } else {
                    console.log('ℹ️ No channels configured anywhere');
                    this.channels = [];
                }
            }
        } catch (error) {
            console.error('❌ Error loading channels:', error);
            this.channels = [];
        }
    },
    
    async verifySubscription() {
        console.log('🔍 Starting channels verification...');
        if (typeof ChannelsLogger !== 'undefined') {
            ChannelsLogger.log('verifySubscription() - Starting verification');
        }
        
        if (this.channels.length === 0) {
            console.log('✅ No required channels');
            if (typeof ChannelsLogger !== 'undefined') {
                ChannelsLogger.log('verifySubscription() - ✅ No channels to verify');
            }
            return true;
        }
        
        console.log(`📢 Verifying ${this.channels.length} channels:`, this.channels);
        if (typeof ChannelsLogger !== 'undefined') {
            ChannelsLogger.log(`verifySubscription() - Checking ${this.channels.length} channels`, this.channels);
        }
        
        try {
            const userId = TelegramApp.getUserId();
            console.log(`👤 User ID: ${userId}`);
            
            // محاولتين مع timeout أطول
            let response;
            for (let attempt = 0; attempt < 2; attempt++) {
                try {
                    // AbortController لتحديد timeout
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 ثانية
                    
                    const apiUrl = `${CONFIG.API_BASE_URL}/verify-channels`;
                    const initData = this.getTelegramInitData();
                    response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Telegram-Init-Data': initData
                        },
                        body: JSON.stringify({user_id: userId}),
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);
                    break;
                    
                } catch (fetchError) {
                    if (attempt === 0) {
                        console.warn(`⚠️ Verification attempt ${attempt + 1} failed:`, fetchError.message);
                        await new Promise(resolve => setTimeout(resolve, 2000)); // انتظار ثانيتين
                        continue;
                    } else {
                        throw fetchError;
                    }
                }
            }
            
            if (!response || !response.ok) {
                throw new Error(`Server responded with status: ${response?.status || 'unknown'}`);
            }
            
            const data = await response.json();
            console.log('📊 Verification response:', data);
            if (typeof ChannelsLogger !== 'undefined') {
                ChannelsLogger.log('verifySubscription() - API Response', data);
            }
            
            if (!data.all_subscribed) {
                console.log('❌ User not subscribed to all channels. Missing:', data.not_subscribed);
                console.log('🔔 About to show subscription modal...');
                if (typeof ChannelsLogger !== 'undefined') {
                    ChannelsLogger.log('❌ User NOT subscribed - Missing channels', data.not_subscribed);
                }
                
                // التأكد من وجود قنوات غير مشترك فيها
                if (!data.not_subscribed || data.not_subscribed.length === 0) {
                    console.error('⚠️ API says not subscribed but no channels list provided!');
                    if (typeof ChannelsLogger !== 'undefined') {
                        ChannelsLogger.log('⚠️ ERROR: API says not subscribed but no channels list!');
                    }
                    return false;
                }
                
                if (typeof ChannelsLogger !== 'undefined') {
                    ChannelsLogger.log('🔔 Showing subscription modal', { channelsCount: data.not_subscribed.length });
                }
                this.showSubscriptionModal(data.not_subscribed);
                return false;
            }
            
            console.log('✅ User subscribed to all channels!');
            if (typeof ChannelsLogger !== 'undefined') {
                ChannelsLogger.log('✅ User subscribed to ALL channels!');
            }
            return true;
            
        } catch (error) {
            console.error('❌ Error verifying channels:', error);
            
            // في حالة timeout أو خطأ في الشبكة، نعطي فرصة أخرى
            if (error.name === 'AbortError' || error.message.includes('timeout') || error.message.includes('fetch')) {
                console.log('⚠️ Network issue detected, allowing user to continue');
                if (typeof showToast !== 'undefined') {
                    showToast('⚠️ مشكلة في الشبكة - يمكنك المتابعة مؤقتاً', 'warning');
                }
                return true; // السماح بالمتابعة في حالة مشاكل الشبكة
            }
            
            return false;
        }
    },
    
    showSubscriptionModal(notSubscribed) {
        console.log('🔔 Showing channels subscription modal for', notSubscribed.length, 'channels');
        if (typeof ChannelsLogger !== 'undefined') {
            ChannelsLogger.log(`showSubscriptionModal() - Creating modal for ${notSubscribed.length} channels`, notSubscribed);
        }
        
        // 🔥 إخفاء الـ loading overlay أولاً قبل عرض الـ modal
        if (typeof showLoading !== 'undefined') {
            showLoading(false);
        }
        
        // إنشاء modal للقنوات غير المشترك فيها
        let channelsHTML = '';
        
        notSubscribed.forEach(channel => {
            const channelLink = channel.channel_id.startsWith('@') 
                ? `https://t.me/${channel.channel_id.substring(1)}`
                : `https://t.me/${channel.channel_id}`;
            
            // استخدام صورة القناة من Telegram
            const channelInput = channelLink || channel.channel_url || channel.channel_id;
            const channelIconHTML = createChannelPhotoHTML(channelInput, '📢', '36px');
            
            channelsHTML += `
                <div class="required-channel-item">
                    <div class="channel-info">
                        ${channelIconHTML}
                        <span class="channel-name">${channel.channel_name}</span>
                    </div>
                    <button class="subscribe-channel-btn" onclick="ChannelsCheck.openChannel('${channelLink}')">
                        <img src="/img/links.png" alt="اشتراك" style="width: 16px; height: 16px; vertical-align: middle; margin-left: 4px;"> اشتراك
                    </button>
                </div>
            `;
        });
        
        const modalHTML = `
            <div id="channels-modal" class="channels-modal">
                <div class="channels-modal-content">
                    <div class="channels-modal-header">
                        <h2>🔔 اشتراك إجباري</h2>
                        <p>للاستمرار، يجب الاشتراك في القنوات التالية:</p>
                    </div>
                    <div class="channels-modal-body">
                        ${channelsHTML}
                    </div>
                    <div class="channels-modal-footer">
                        <button class="btn-verify-channels" onclick="ChannelsCheck.recheckSubscription()">
                            <img src="/img/payment-success.svg" alt="تحقق" style="width: 18px; height: 18px; vertical-align: middle; margin-left: 4px;"> تحققت من الاشتراك
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // إضافة المودال للصفحة
        const existingModal = document.getElementById('channels-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // التأكد من إضافة الـ modal
        const addedModal = document.getElementById('channels-modal');
        if (addedModal) {
            console.log('✅ Channels modal added to DOM successfully');
            console.log('📊 Modal element:', addedModal);
        } else {
            console.error('❌ Failed to add modal to DOM!');
        }
        
        // منع التفاعل مع بقية الصفحة
        document.body.style.overflow = 'hidden';
        
        // إزالة أي loading overlay قد يكون موجود
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
            console.log('🔄 Hidden loading overlay');
        }
    },
    
    openChannel(link) {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.openLink(link);
        } else {
            window.open(link, '_blank');
        }
    },
    
    async recheckSubscription() {
        const btn = event.target;
        const originalText = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = '⏳ جاري التحقق...';
        
        const result = await this.verifySubscription();
        
        if (result) {
            // نجح الاشتراك
            const modal = document.getElementById('channels-modal');
            if (modal) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
            
            if (typeof showToast !== 'undefined') {
                showToast('<img src="/img/payment-success.svg" style="width: 16px; height: 16px; vertical-align: middle;"> تم التحقق من الاشتراك بنجاح!', 'success');
            }
            
            // ⚠️ إزالة تسجيل الإحالة من هنا - سيتم في continueAppInitialization
            // تسجيل الإحالة المعلقة بعد التحقق من القنوات
            // if (typeof registerPendingReferral !== 'undefined') {
            //     await registerPendingReferral();
            // }
            
            // بدلاً من reload، استدعي استكمال تهيئة التطبيق مباشرة
            console.log('✅ Channels verified, continuing app initialization...');
            if (typeof continueAppInitialization !== 'undefined') {
                await continueAppInitialization();
            } else {
                // Fallback - reload if function not available  
                console.log('🔄 continueAppInitialization not found, reloading...');
                setTimeout(() => window.location.reload(), 1000);
            }
        } else {
            btn.disabled = false;
            btn.innerHTML = originalText;
            
            if (typeof showToast !== 'undefined') {
                showToast('<img src="/img/payment-failure.svg" style="width: 16px; height: 16px; vertical-align: middle;"> يجب الاشتراك في جميع القنوات أولاً', 'error');
            }
        }
    },
    
    /**
     * التحقق الدوري من القنوات عند عودة المستخدم للتطبيق
     */
    setupVisibilityCheck() {
        document.addEventListener('visibilitychange', async () => {
            if (!document.hidden) {
                console.log('👁️ User returned to app, re-checking channels...');
                await this.loadChannels();
                await this.verifySubscription();
            }
        });
        
        // التحقق عند استعادة التركيز
        window.addEventListener('focus', async () => {
            console.log('🔍 App focused, re-checking channels...');
            await this.loadChannels();
            await this.verifySubscription();
        });
        
        console.log('✅ Visibility check listeners registered');
    }
};

// ⚠️ لا تقم بالتشغيل التلقائي - سيتم الاستدعاء من app.js
// التشغيل التلقائي يسبب تضارب مع app.js initialization

console.log('✅✅✅ channels-check.js LOADED SUCCESSFULLY! ✅✅✅');
console.log('📦 ChannelsCheck object defined:', ChannelsCheck);
console.log('✅ ChannelsCheck module loaded successfully');
console.log('📦 ChannelsCheck:', ChannelsCheck);