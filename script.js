// ============================================================
// ملف script.js - نسخة نظيفة ومنسقة بدون أي تعارض
// تم دمج جميع الوظائف في مكان واحد
// ============================================================

// ====== انتظار تحميل الصفحة ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ℕ𝔼𝕏 Empire - تم تحميل الصفحة');

    // ============================================================
    // 1. تبديل الوضع (ليلي/نهاري)
    // ============================================================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            body.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme);
        }

        themeToggle.addEventListener('click', function() {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        const icon = themeToggle?.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // ============================================================
    // 2. القائمة الجانبية
    // ============================================================
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });

        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.addEventListener('click', function() {
                sidebar.classList.remove('open');
            });
        });
    }

    // ============================================================
    // 3. دوال فتح وإغلاق النوافذ (وظائف عامة)
    // ============================================================
    function openOverlay(overlayId) {
        const overlay = document.getElementById(overlayId);
        if (overlay) {
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            console.log(`✅ فتح: ${overlayId}`);
            return true;
        }
        console.error(`❌ العنصر غير موجود: ${overlayId}`);
        return false;
    }

    function closeOverlay(overlayId) {
        const overlay = document.getElementById(overlayId);
        if (overlay) {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
            console.log(`✅ إغلاق: ${overlayId}`);
            return true;
        }
        console.error(`❌ العنصر غير موجود: ${overlayId}`);
        return false;
    }

    // ============================================================
    // 4. شات NEX (فتح وإغلاق)
    // ============================================================
    const chatOverlay = document.getElementById('chatOverlay');
    const chatClose = document.getElementById('chatClose');
    const devChatNex = document.getElementById('devChatNex');
    const chatNexToggle = document.getElementById('chatNexToggle');
    const chatNexInput = document.getElementById('chatNexInput');

    function openChatNex() {
        if (openOverlay('chatOverlay')) {
            setTimeout(() => { if (chatNexInput) chatNexInput.focus(); }, 300);
        }
    }

    if (devChatNex) {
        devChatNex.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openChatNex();
        });
    }

    if (chatNexToggle) {
        chatNexToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openChatNex();
        });
    }

    if (chatClose) {
        chatClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeOverlay('chatOverlay');
        });
    }

    if (chatOverlay) {
        chatOverlay.addEventListener('click', function(e) {
            if (e.target === chatOverlay) closeOverlay('chatOverlay');
        });
    }

    // ============================================================
    // 5. شات الأفكار (مع الإرسال)
    // ============================================================
    const ideasOverlay = document.getElementById('ideasOverlay');
    const ideasClose = document.getElementById('ideasClose');
    const devIdeasToggle = document.getElementById('devIdeasToggle');
    const ideasFloat = document.getElementById('ideasFloat');
    const ideasMessages = document.getElementById('ideasMessages');
    const ideasInput = document.getElementById('ideasInput');
    const ideasSend = document.getElementById('ideasSend');

    // كلمة السر للمطور
    const DEV_PASSWORD = process.env.dev_password || '8520261962026';

    // فتح شات الأفكار
    function openIdeasChat() {
        if (openOverlay('ideasOverlay')) {
            setTimeout(() => { if (ideasInput) ideasInput.focus(); }, 300);
        }
    }

    if (devIdeasToggle) {
        devIdeasToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openIdeasChat();
        });
    }

    if (ideasFloat) {
        ideasFloat.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openIdeasChat();
        });
    }

    if (ideasClose) {
        ideasClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeOverlay('ideasOverlay');
        });
    }

    if (ideasOverlay) {
        ideasOverlay.addEventListener('click', function(e) {
            if (e.target === ideasOverlay) closeOverlay('ideasOverlay');
        });
    }

    // وظائف شات الأفكار
    function addIdeaMessage(text, type) {
        if (!ideasMessages) return;
        const div = document.createElement('div');
        div.className = `idea-message ${type}`;
        div.textContent = text;
        ideasMessages.appendChild(div);
        ideasMessages.scrollTop = ideasMessages.scrollHeight;
    }

    function saveIdea(text) {
        let ideas = JSON.parse(localStorage.getItem('nex_ideas') || '[]');
        ideas.push({ text, date: new Date().toISOString(), user: 'مستخدم' });
        localStorage.setItem('nex_ideas', JSON.stringify(ideas));
    }

    function getIdeas() {
        return JSON.parse(localStorage.getItem('nex_ideas') || '[]');
    }

    // دالة إرسال الفكرة
    function sendIdea() {
        if (!ideasInput) return;
        const text = ideasInput.value.trim();
        if (!text) return;

        // التحقق من كلمة السر للمطور
        if (text === DEV_PASSWORD) {
            addIdeaMessage('🔓 تم التحقق من هوية المطور! مرحباً بك في لوحة التحكم.', 'system');
            ideasInput.value = '';
            openDevPanel();
            return;
        }

        // إرسال الفكرة كـ مستخدم عادي
        addIdeaMessage(text, 'user');
        saveIdea(text);
        ideasInput.value = '';

        setTimeout(() => {
            const replies = [
                '💡 شكراً لفكرتك! سنقوم بدراستها',
                '✨ فكرة رائعة! تم تسجيلها',
                '🚀 نشكرك على مساهميتك في تطوير الإمبراطورية',
                '📝 تم حفظ فكرتك، سنعمل عليها قريباً'
            ];
            addIdeaMessage(replies[Math.floor(Math.random() * replies.length)], 'system');
        }, 1000);
    }

    if (ideasSend) {
        ideasSend.addEventListener('click', function(e) {
            e.preventDefault();
            sendIdea();
        });
    }

    if (ideasInput) {
        ideasInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendIdea();
            }
        });
    }

    // ============================================================
    // 6. لوحة تحكم المطور
    // ============================================================
    const devPanel = document.getElementById('devPanel');
    const devPanelClose = document.getElementById('devPanelClose');

    function openDevPanel() {
        if (!devPanel) return;
        devPanel.classList.add('open');
        document.body.style.overflow = 'hidden';
        updateDevPanel();
    }

    function closeDevPanel() {
        if (!devPanel) return;
        devPanel.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (devPanelClose) {
        devPanelClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeDevPanel();
        });
    }

    if (devPanel) {
        devPanel.addEventListener('click', function(e) {
            if (e.target === devPanel) closeDevPanel();
        });
    }

    function updateDevPanel() {
        const users = JSON.parse(localStorage.getItem('nex_users') || '[]');
        const userCount = document.getElementById('userCount');
        if (userCount) userCount.textContent = users.length;

        const ideas = getIdeas();
        const ideasCount = document.getElementById('ideasCount');
        if (ideasCount) ideasCount.textContent = ideas.length;

        const ideasList = document.getElementById('devIdeasList');
        if (ideasList) {
            ideasList.innerHTML = ideas.length === 0 ? 
                '<div class="dev-idea-item">لا توجد أفكار حالياً</div>' :
                ideas.map((idea, index) => `
                    <div class="dev-idea-item">
                        <span>${idea.text}</span>
                        <span class="date">${new Date(idea.date).toLocaleDateString('ar')}</span>
                    </div>
                `).join('');
        }

        const usersList = document.getElementById('devUsersList');
        if (usersList) {
            usersList.innerHTML = users.length === 0 ?
                '<div class="dev-user-item">لا يوجد مستخدمين مسجلين</div>' :
                users.map(user => `
                    <div class="dev-user-item">
                        <span>${user.name} (${user.email})</span>
                        <span class="date">${new Date(user.date).toLocaleDateString('ar')}</span>
                    </div>
                `).join('');
        }
    }

    // ============================================================
    // 7. تسجيل الدخول
    // ============================================================
    const authOverlay = document.getElementById('authOverlay');
    const authClose = document.getElementById('authClose');
    const authToggle = document.getElementById('authToggle');

    if (authToggle) {
        authToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openOverlay('authOverlay');
        });
    }

    if (authClose) {
        authClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeOverlay('authOverlay');
        });
    }

    if (authOverlay) {
        authOverlay.addEventListener('click', function(e) {
            if (e.target === authOverlay) closeOverlay('authOverlay');
        });
    }

    // تبديل علامات التبويب
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.tab;
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            document.getElementById(`auth-${target}`).classList.add('active');
        });
    });

    // تسجيل الدخول
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            
            if (!email || !password) {
                alert('الرجاء إدخال البريد الإلكتروني وكلمة السر');
                return;
            }

            const users = JSON.parse(localStorage.getItem('nex_users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem('nex_current_user', JSON.stringify(user));
                alert(`مرحباً ${user.name}! تم تسجيل الدخول بنجاح`);
                closeOverlay('authOverlay');
                updateUserUI(user);
            } else {
                alert('البريد الإلكتروني أو كلمة السر غير صحيحة');
            }
        });
    }

    // إنشاء حساب
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value.trim();
            const confirm = document.getElementById('regConfirm').value.trim();

            if (!name || !email || !password || !confirm) {
                alert('الرجاء ملء جميع الحقول');
                return;
            }

            if (password !== confirm) {
                alert('كلمة السر غير متطابقة');
                return;
            }

            if (password.length < 6) {
                alert('كلمة السر يجب أن تكون 6 أحرف على الأقل');
                return;
            }

            let users = JSON.parse(localStorage.getItem('nex_users') || '[]');
            if (users.find(u => u.email === email)) {
                alert('هذا البريد الإلكتروني مسجل بالفعل');
                return;
            }

            const newUser = { name, email, password, date: new Date().toISOString() };
            users.push(newUser);
            localStorage.setItem('nex_users', JSON.stringify(users));
            localStorage.setItem('nex_current_user', JSON.stringify(newUser));

            alert(`مرحباً ${name}! تم إنشاء حسابك بنجاح`);
            closeOverlay('authOverlay');
            updateUserUI(newUser);
        });
    }

    // تسجيل الدخول بجوجل
    const googleLogin = document.getElementById('googleLogin');
    if (googleLogin) {
        googleLogin.addEventListener('click', function(e) {
            e.preventDefault();
            const email = prompt('الرجاء إدخال بريدك الإلكتروني على جوجل:');
            if (email) {
                const name = email.split('@')[0];
                const users = JSON.parse(localStorage.getItem('nex_users') || '[]');
                let user = users.find(u => u.email === email);
                
                if (!user) {
                    user = { name, email, password: 'google_auth', date: new Date().toISOString() };
                    users.push(user);
                    localStorage.setItem('nex_users', JSON.stringify(users));
                }
                
                localStorage.setItem('nex_current_user', JSON.stringify(user));
                alert(`مرحباً ${user.name}! تم تسجيل الدخول بجوجل بنجاح`);
                closeOverlay('authOverlay');
                updateUserUI(user);
            }
        });
    }

    // تحديث واجهة المستخدم بعد تسجيل الدخول
    function updateUserUI(user) {
        const authLink = document.querySelector('.sidebar-nav a[href="#"]');
        if (authLink) {
            authLink.innerHTML = `<i class="fas fa-user-check"></i> <span>مرحباً ${user.name}</span>`;
            authLink.style.color = '#6c5ce7';
        }
        
        const sidebarNav = document.querySelector('.sidebar-nav');
        if (sidebarNav) {
            const oldLogout = sidebarNav.querySelector('.logout-btn');
            if (oldLogout) oldLogout.remove();
            
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.className = 'logout-btn';
            logoutBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> <span>تسجيل الخروج</span>`;
            logoutBtn.style.color = '#e74c3c';
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('nex_current_user');
                location.reload();
            });
            sidebarNav.appendChild(logoutBtn);
        }
    }

    const currentUser = JSON.parse(localStorage.getItem('nex_current_user') || 'null');
    if (currentUser) {
        updateUserUI(currentUser);
    }

    // ============================================================
    // 8. إغلاق النوافذ بزر Escape
    // ============================================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (chatOverlay?.classList.contains('open')) closeOverlay('chatOverlay');
            if (ideasOverlay?.classList.contains('open')) closeOverlay('ideasOverlay');
            if (authOverlay?.classList.contains('open')) closeOverlay('authOverlay');
        }
    });

    // ============================================================
    // 9. عداد الأرقام المتحرك
    // ============================================================
    const numbers = document.querySelectorAll('.number');
    if (numbers.length > 0) {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        numbers.forEach(num => {
                            const target = parseInt(num.getAttribute('data-target'));
                            const duration = 2000;
                            const step = target / (duration / 16);
                            let current = 0;
                            const updateNumber = () => {
                                current += step;
                                if (current >= target) {
                                    num.textContent = target;
                                    return;
                                }
                                num.textContent = Math.floor(current);
                                requestAnimationFrame(updateNumber);
                            };
                            updateNumber();
                        });
                        observer.disconnect();
                    }
                });
            });
            observer.observe(heroSection);
        }
    }

    // ============================================================
    // 10. رسالة ترحيب في شات NEX
    // ============================================================
    setTimeout(() => {
        const chatNexMessages = document.getElementById('chatNexMessages');
        if (chatNexMessages && chatNexMessages.children.length === 0) {
            const div = document.createElement('div');
            div.className = 'msg bot';
            div.innerHTML = `
                <div class="msg-avatar">⚡</div>
                <div class="msg-bubble">مرحباً، أنا مساعد NEX الذكي. كيف يمكنني مساعدتك اليوم؟</div>
            `;
            chatNexMessages.appendChild(div);
        }
    }, 500);

    // ============================================================
    // 11. تحميل Tawk.to
    // ============================================================
    setTimeout(() => {
        const tawkContainer = document.getElementById('tawkContainer');
        const tawkIframe = document.querySelector('#tawk-container iframe');
        if (tawkIframe && tawkContainer) {
            tawkContainer.innerHTML = '';
            tawkContainer.appendChild(tawkIframe);
            tawkIframe.style.width = '100%';
            tawkIframe.style.height = '100%';
            tawkIframe.style.border = 'none';
            tawkIframe.style.minHeight = '400px';
        }
    }, 3000);

    console.log('✅ ℕ𝔼𝕏 Empire - جميع الأزرار والوظائف جاهزة!');
});
