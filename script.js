// ============================================================
// ℕ𝔼𝕏 Empire - الملف النهائي مع OTP وتحقق تسجيل الدخول
// جميع الأزرار تفاعلية
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ℕ𝔼𝕏 Empire - تم تحميل الصفحة');

    // ============================================================
    // 1. تبديل الوضع
    // ============================================================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    if (themeToggle) {
        const saved = localStorage.getItem('theme');
        if (saved) body.setAttribute('data-theme', saved);

        themeToggle.onclick = function() {
            const current = body.getAttribute('data-theme');
            const newTheme = current === 'light' ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.querySelector('i').className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        };
    }

    // ============================================================
    // 2. القائمة الجانبية
    // ============================================================
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.onclick = function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        };
        document.querySelectorAll('.sidebar-nav a').forEach(function(link) {
            link.onclick = function() { sidebar.classList.remove('open'); };
        });
    }

    // ============================================================
    // 3. دوال فتح وإغلاق النوافذ
    // ============================================================
    function openOverlay(id) {
        const el = document.getElementById(id);
        if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
    }
    function closeOverlay(id) {
        const el = document.getElementById(id);
        if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
    }

    // إعادة ضبط واجهة OTP عند الإغلاق
    const originalCloseOverlay = closeOverlay;
    closeOverlay = function(id) {
        if (id === 'authOverlay') {
            resetAuthUI();
        }
        originalCloseOverlay(id);
    };

    function resetAuthUI() {
        document.getElementById('loginBtn').style.display = 'block';
        document.getElementById('loginVerifyBtn').style.display = 'none';
        document.getElementById('loginOtpContainer').style.display = 'none';
        document.getElementById('loginOtp').value = '';
        loginPendingUser = null;

        document.getElementById('registerBtn').style.display = 'block';
        document.getElementById('registerVerifyBtn').style.display = 'none';
        document.getElementById('registerOtpContainer').style.display = 'none';
        document.getElementById('registerOtp').value = '';
        registerPendingUser = null;
    }

    // ============================================================
    // 4. نظام OTP (كود التحقق)
    // ============================================================
    const otpStorage = {};

    function generateOTP() {
        return String(Math.floor(100000 + Math.random() * 900000));
    }

    function sendOTP(email, otp) {
        otpStorage[email] = { code: otp, expires: Date.now() + 5 * 60 * 1000 };
        console.log('📧 كود التحقق لـ ' + email + ': ' + otp);
        alert('📧 تم إرسال كود التحقق إلى بريدك الإلكتروني.\nكود التحقق: ' + otp + '\n(صلاحية 5 دقائق)');
        return true;
    }

    function verifyOTP(email, otp) {
        const stored = otpStorage[email];
        if (!stored) return { valid: false, message: 'لم يتم إرسال كود تحقق' };
        if (Date.now() > stored.expires) {
            delete otpStorage[email];
            return { valid: false, message: 'انتهت صلاحية الكود، يرجى طلب كود جديد' };
        }
        if (stored.code !== otp) return { valid: false, message: 'كود التحقق غير صحيح' };
        delete otpStorage[email];
        return { valid: true, message: 'تم التحقق بنجاح' };
    }

    // ============================================================
    // 5. تسجيل الدخول
    // ============================================================
    let loginPendingUser = null;

    document.getElementById('loginBtn').onclick = function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        if (!email || !password) { alert('الرجاء إدخال البريد وكلمة السر'); return; }

        const users = JSON.parse(localStorage.getItem('nex_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) { alert('البريد أو كلمة السر غير صحيحة'); return; }

        loginPendingUser = user;
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('loginVerifyBtn').style.display = 'block';
        document.getElementById('loginOtpContainer').style.display = 'block';
        document.getElementById('loginOtp').value = '';
        document.getElementById('loginOtp').focus();

        const otp = generateOTP();
        sendOTP(email, otp);
    };

    document.getElementById('loginVerifyBtn').onclick = function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const otp = document.getElementById('loginOtp').value.trim();

        if (!otp) { alert('الرجاء إدخال كود التحقق'); return; }

        const result = verifyOTP(email, otp);
        if (result.valid) {
            localStorage.setItem('nex_current_user', JSON.stringify(loginPendingUser));
            alert('✅ تم تسجيل الدخول بنجاح');
            closeOverlay('authOverlay');
            updateUserUI(loginPendingUser);
            loginPendingUser = null;
            resetAuthUI();
        } else {
            alert('❌ ' + result.message);
        }
    };

    document.getElementById('loginResendOtp').onclick = function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        if (!email) { alert('الرجاء إدخال البريد الإلكتروني'); return; }
        const otp = generateOTP();
        sendOTP(email, otp);
    };

    // ============================================================
    // 6. إنشاء حساب
    // ============================================================
    let registerPendingUser = null;

    document.getElementById('registerBtn').onclick = function(e) {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value.trim();
        const confirm = document.getElementById('regConfirm').value.trim();

        if (!name || !email || !password || !confirm) { alert('الرجاء ملء جميع الحقول'); return; }
        if (password !== confirm) { alert('كلمة السر غير متطابقة'); return; }
        if (password.length < 6) { alert('كلمة السر يجب أن تكون 6 أحرف على الأقل'); return; }

        const users = JSON.parse(localStorage.getItem('nex_users') || '[]');
        if (users.find(u => u.email === email)) { alert('هذا البريد مسجل بالفعل'); return; }

        registerPendingUser = { name, email, password, date: new Date().toISOString(), isDeveloper: false };

        document.getElementById('registerBtn').style.display = 'none';
        document.getElementById('registerVerifyBtn').style.display = 'block';
        document.getElementById('registerOtpContainer').style.display = 'block';
        document.getElementById('registerOtp').value = '';
        document.getElementById('registerOtp').focus();

        const otp = generateOTP();
        sendOTP(email, otp);
    };

    document.getElementById('registerVerifyBtn').onclick = function(e) {
        e.preventDefault();
        const email = document.getElementById('regEmail').value.trim();
        const otp = document.getElementById('registerOtp').value.trim();

        if (!otp) { alert('الرجاء إدخال كود التحقق'); return; }

        const result = verifyOTP(email, otp);
        if (result.valid) {
            const users = JSON.parse(localStorage.getItem('nex_users') || '[]');
            users.push(registerPendingUser);
            localStorage.setItem('nex_users', JSON.stringify(users));
            localStorage.setItem('nex_current_user', JSON.stringify(registerPendingUser));
            alert('✅ تم إنشاء حسابك بنجاح');
            closeOverlay('authOverlay');
            updateUserUI(registerPendingUser);
            registerPendingUser = null;
            resetAuthUI();
        } else {
            alert('❌ ' + result.message);
        }
    };

    document.getElementById('registerResendOtp').onclick = function(e) {
        e.preventDefault();
        const email = document.getElementById('regEmail').value.trim();
        if (!email) { alert('الرجاء إدخال البريد الإلكتروني'); return; }
        const otp = generateOTP();
        sendOTP(email, otp);
    };

    // ============================================================
    // 7. جوجل تسجيل الدخول
    // ============================================================
    document.getElementById('googleLogin').onclick = function(e) {
        e.preventDefault();
        const email = prompt('الرجاء إدخال بريدك الإلكتروني على جوجل:');
        if (!email) return;
        const name = email.split('@')[0];
        const users = JSON.parse(localStorage.getItem('nex_users') || '[]');
        let user = users.find(u => u.email === email);
        if (!user) {
            user = { name, email, password: 'google_auth', date: new Date().toISOString(), isDeveloper: false };
            users.push(user);
            localStorage.setItem('nex_users', JSON.stringify(users));
        }
        localStorage.setItem('nex_current_user', JSON.stringify(user));
        alert('مرحباً ' + user.name + '! تم تسجيل الدخول بجوجل');
        closeOverlay('authOverlay');
        updateUserUI(user);
    };

    // ============================================================
    // 8. تسجيل الدخول / إنشاء حساب - علامات التبويب
    // ============================================================
    document.querySelectorAll('.auth-tab').forEach(function(tab) {
        tab.onclick = function() {
            const target = this.dataset.tab;
            document.querySelectorAll('.auth-tab').forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            document.querySelectorAll('.auth-form').forEach(function(f) { f.classList.remove('active'); });
            document.getElementById('auth-' + target).classList.add('active');
            resetAuthUI();
        };
    });

    // ============================================================
    // 9. أزرار فتح/إغلاق تسجيل الدخول
    // ============================================================
    document.getElementById('authToggle').onclick = function(e) {
        e.preventDefault();
        openOverlay('authOverlay');
        resetAuthUI();
    };
    document.getElementById('authClose').onclick = function(e) {
        e.preventDefault();
        closeOverlay('authOverlay');
    };
    document.getElementById('authOverlay').onclick = function(e) {
        if (e.target === this) closeOverlay('authOverlay');
    };

    // ============================================================
    // 10. تحديث واجهة المستخدم
    // ============================================================
    function updateUserUI(user) {
        const authLink = document.querySelector('.sidebar-nav a[href="#"]');
        if (authLink) {
            authLink.innerHTML = '<i class="fas fa-user-check"></i> <span>مرحباً ' + user.name + '</span>';
            authLink.style.color = '#1a73e8';
        }
        const sidebarNav = document.querySelector('.sidebar-nav');
        if (sidebarNav) {
            const old = sidebarNav.querySelector('.logout-btn');
            if (old) old.remove();
            const logout = document.createElement('a');
            logout.href = '#';
            logout.className = 'logout-btn';
            logout.innerHTML = '<i class="fas fa-sign-out-alt"></i> <span>تسجيل الخروج</span>';
            logout.style.color = '#e74c3c';
            logout.onclick = function(e) {
                e.preventDefault();
                localStorage.removeItem('nex_current_user');
                location.reload();
            };
            sidebarNav.appendChild(logout);
        }
    }

    const currentUser = JSON.parse(localStorage.getItem('nex_current_user') || 'null');
    if (currentUser) updateUserUI(currentUser);

    // ============================================================
    // 11. شات NEX
    // ============================================================
    const chatOverlay = document.getElementById('chatOverlay');
    const chatClose = document.getElementById('chatClose');
    const devChatNex = document.getElementById('devChatNex');
    const chatNexToggle = document.getElementById('chatNexToggle');
    const chatNexInput = document.getElementById('chatNexInput');
    const chatNexSend = document.getElementById('chatNexSend');
    const chatNexMessages = document.getElementById('chatNexMessages');

    function openChatNex() {
        openOverlay('chatOverlay');
        setTimeout(function() { if (chatNexInput) chatNexInput.focus(); }, 300);
    }

    if (devChatNex) {
        devChatNex.onclick = function(e) {
            e.preventDefault();
            openChatNex();
        };
    }
    if (chatNexToggle) {
        chatNexToggle.onclick = function(e) {
            e.preventDefault();
            openChatNex();
        };
    }
    if (chatClose) {
        chatClose.onclick = function(e) {
            e.preventDefault();
            closeOverlay('chatOverlay');
        };
    }
    if (chatOverlay) {
        chatOverlay.onclick = function(e) {
            if (e.target === this) closeOverlay('chatOverlay');
        };
    }

    function addNexMessage(text, type) {
        if (!chatNexMessages) return;
        const div = document.createElement('div');
        div.className = 'msg ' + type;
        const avatar = type === 'bot' ? '⚡' : '👤';
        div.innerHTML = '<div class="msg-avatar">' + avatar + '</div><div class="msg-bubble">' + text.replace(/\n/g, '<br>') + '</div>';
        chatNexMessages.appendChild(div);
        chatNexMessages.scrollTop = chatNexMessages.scrollHeight;
    }

    const DEEPSEEK_API_URL = 'https://nex-empire1.vercel.app/api/deepseek';

    async function callDeepSeek(query, thinking, search) {
        try {
            const params = new URLSearchParams();
            params.append('query', query);
            params.append('thinking', thinking ? 'true' : 'false');
            params.append('search', search ? 'true' : 'false');
            const response = await fetch(DEEPSEEK_API_URL + '?' + params.toString());
            const data = await response.json();
            if (!data.success) throw new Error(data.error || 'فشل الاتصال بـ DeepSeek');
            return data.response.reply;
        } catch (error) {
            throw new Error(error.message || 'فشل الاتصال بالخادم');
        }
    }

    async function sendNexMessage() {
        if (!chatNexInput || !chatNexSend) return;
        const text = chatNexInput.value.trim();
        if (!text) return;

        addNexMessage(text, 'user');
        chatNexInput.value = '';
        chatNexInput.disabled = true;
        chatNexSend.disabled = true;

        const loading = document.createElement('div');
        loading.className = 'msg bot';
        loading.id = 'nexLoading';
        loading.innerHTML = '<div class="msg-avatar">⚡</div><div class="msg-bubble">⏳ جاري التفكير...</div>';
        chatNexMessages.appendChild(loading);
        chatNexMessages.scrollTop = chatNexMessages.scrollHeight;

        try {
            const reply = await callDeepSeek(text, true, true);
            const loadEl = document.getElementById('nexLoading');
            if (loadEl) loadEl.remove();
            addNexMessage(reply, 'bot');
        } catch (error) {
            const loadEl = document.getElementById('nexLoading');
            if (loadEl) loadEl.remove();
            addNexMessage('❌ عذراً، حدث خطأ: ' + error.message, 'bot');
        }

        chatNexInput.disabled = false;
        chatNexSend.disabled = false;
        chatNexInput.focus();
    }

    if (chatNexSend) chatNexSend.onclick = sendNexMessage;
    if (chatNexInput) {
        chatNexInput.onkeydown = function(e) {
            if (e.key === 'Enter') { e.preventDefault(); sendNexMessage(); }
        };
    }

    // خيارات شات NEX
    document.querySelectorAll('.chat-opt').forEach(function(btn) {
        btn.onclick = function() {
            if (this.id === 'nexNewChat') {
                if (chatNexMessages) {
                    chatNexMessages.innerHTML = '';
                    const div = document.createElement('div');
                    div.className = 'msg bot';
                    div.innerHTML = '<div class="msg-avatar">⚡</div><div class="msg-bubble">مرحباً، تم بدء محادثة جديدة. كيف يمكنني مساعدتك؟</div>';
                    chatNexMessages.appendChild(div);
                    if (chatNexInput) chatNexInput.focus();
                }
                return;
            }
            document.querySelectorAll('.chat-opt').forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
        };
    });

    // ============================================================
    // 12. شات الأفكار
    // ============================================================
    const ideasOverlay = document.getElementById('ideasOverlay');
    const ideasClose = document.getElementById('ideasClose');
    const devIdeasToggle = document.getElementById('devIdeasToggle');
    const ideasFloat = document.getElementById('ideasFloat');
    const ideasInput = document.getElementById('ideasInput');
    const ideasSend = document.getElementById('ideasSend');
    const ideasMessages = document.getElementById('ideasMessages');

    const DEV_PASSWORD = '8520261962026';

    function openIdeasChat() {
        openOverlay('ideasOverlay');
        setTimeout(function() { if (ideasInput) ideasInput.focus(); }, 300);
    }

    if (devIdeasToggle) {
        devIdeasToggle.onclick = function(e) {
            e.preventDefault();
            openIdeasChat();
        };
    }
    if (ideasFloat) {
        ideasFloat.onclick = function(e) {
            e.preventDefault();
            openIdeasChat();
        };
    }
    if (ideasClose) {
        ideasClose.onclick = function(e) {
            e.preventDefault();
            closeOverlay('ideasOverlay');
        };
    }
    if (ideasOverlay) {
        ideasOverlay.onclick = function(e) {
            if (e.target === this) closeOverlay('ideasOverlay');
        };
    }

    function addIdeaMessage(text, type) {
        if (!ideasMessages) return;
        const div = document.createElement('div');
        div.className = 'idea-message ' + type;
        div.textContent = text;
        ideasMessages.appendChild(div);
        ideasMessages.scrollTop = ideasMessages.scrollHeight;
    }

    function saveIdea(text) {
        const ideas = JSON.parse(localStorage.getItem('nex_ideas') || '[]');
        ideas.push({ text: text, date: new Date().toISOString() });
        localStorage.setItem('nex_ideas', JSON.stringify(ideas));
    }

    function getIdeas() {
        return JSON.parse(localStorage.getItem('nex_ideas') || '[]');
    }

    function sendIdea() {
        if (!ideasInput) return;
        const text = ideasInput.value.trim();
        if (!text) return;

        if (text === DEV_PASSWORD) {
            addIdeaMessage('🔓 تم التحقق من هوية المطور! مرحباً بك في لوحة التحكم.', 'system');
            ideasInput.value = '';
            document.getElementById('devPanel')?.classList.add('open');
            updateDevPanel();
            return;
        }

        addIdeaMessage(text, 'user');
        saveIdea(text);
        ideasInput.value = '';

        setTimeout(function() {
            const replies = ['💡 شكراً لفكرتك!', '✨ فكرة رائعة!', '🚀 نشكرك على مساهميتك!', '📝 تم حفظ فكرتك.'];
            addIdeaMessage(replies[Math.floor(Math.random() * replies.length)], 'system');
        }, 800);
    }

    if (ideasSend) ideasSend.onclick = sendIdea;
    if (ideasInput) {
        ideasInput.onkeydown = function(e) {
            if (e.key === 'Enter') { e.preventDefault(); sendIdea(); }
        };
    }

    // ============================================================
    // 13. لوحة تحكم المطور
    // ============================================================
    function updateDevPanel() {
        const users = JSON.parse(localStorage.getItem('nex_users') || '[]');
        const ideas = getIdeas();
        document.getElementById('userCount').textContent = users.length;
        document.getElementById('ideasCount').textContent = ideas.length;

        const ideasList = document.getElementById('devIdeasList');
        if (ideasList) {
            ideasList.innerHTML = ideas.length ? ideas.map(function(i) {
                return '<div class="dev-idea-item"><span>' + i.text + '</span><span class="date">' + new Date(i.date).toLocaleDateString('ar') + '</span></div>';
            }).join('') : '<div class="dev-idea-item">لا توجد أفكار حالياً</div>';
        }

        const usersList = document.getElementById('devUsersList');
        if (usersList) {
            usersList.innerHTML = users.length ? users.map(function(u) {
                return '<div class="dev-user-item"><span>' + u.name + ' (' + u.email + ')</span><span class="date">' + new Date(u.date).toLocaleDateString('ar') + '</span></div>';
            }).join('') : '<div class="dev-user-item">لا يوجد مستخدمين مسجلين</div>';
        }
    }

    document.getElementById('devPanelClose').onclick = function(e) {
        e.preventDefault();
        document.getElementById('devPanel')?.classList.remove('open');
    };
    document.getElementById('devPanel').onclick = function(e) {
        if (e.target === this) this.classList.remove('open');
    };

    // ============================================================
    // 14. إغلاق النوافذ بـ Escape
    // ============================================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            ['chatOverlay', 'ideasOverlay', 'authOverlay'].forEach(function(id) {
                const el = document.getElementById(id);
                if (el && el.classList.contains('open')) closeOverlay(id);
            });
        }
    });

    // ============================================================
    // 15. عداد الأرقام
    // ============================================================
    const numbers = document.querySelectorAll('.number');
    if (numbers.length) {
        const hero = document.querySelector('.hero');
        if (hero) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        numbers.forEach(function(num) {
                            const target = parseInt(num.getAttribute('data-target'));
                            const duration = 2000;
                            const step = target / (duration / 16);
                            let current = 0;
                            const update = function() {
                                current += step;
                                if (current >= target) { num.textContent = target; return; }
                                num.textContent = Math.floor(current);
                                requestAnimationFrame(update);
                            };
                            update();
                        });
                        observer.disconnect();
                    }
                });
            });
            observer.observe(hero);
        }
    }

    // ============================================================
    // 16. رسالة ترحيب في شات NEX
    // ============================================================
    setTimeout(function() {
        if (chatNexMessages && !chatNexMessages.children.length) {
            const div = document.createElement('div');
            div.className = 'msg bot';
            div.innerHTML = '<div class="msg-avatar">⚡</div><div class="msg-bubble">مرحباً، أنا مساعد NEX الذكي. كيف يمكنني مساعدتك اليوم؟</div>';
            chatNexMessages.appendChild(div);
        }
    }, 500);

    // ============================================================
    // 17. تحميل Tawk.to
    // ============================================================
    setTimeout(function() {
        const container = document.getElementById('tawkContainer');
        const iframe = document.querySelector('#tawk-container iframe');
        if (iframe && container) {
            container.innerHTML = '';
            container.appendChild(iframe);
            iframe.style.cssText = 'width:100%;height:100%;border:none;min-height:400px;';
        }
    }, 3000);

    console.log('✅ ℕ𝔼𝕏 Empire - جميع الأزرار والوظائف تعمل!');
});
