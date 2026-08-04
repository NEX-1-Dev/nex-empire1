// ============================================================
// ℕ𝔼𝕏 Empire - الملف المصحح بالكامل
// جميع الأزرار تعمل الآن
// ============================================================

// ====== انتظار تحميل الصفحة بالكامل ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ℕ𝔼𝕏 Empire - تم تحميل الصفحة');

    // ============================================================
    // 1. تبديل الوضع (ليلي/نهاري)
    // ============================================================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) body.setAttribute('data-theme', savedTheme);

        themeToggle.onclick = function() {
            const current = body.getAttribute('data-theme');
            const newTheme = current === 'light' ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            const icon = this.querySelector('i');
            if (icon) icon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
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

    // ============================================================
    // 4. شات NEX
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

    // ربط أزرار فتح شات NEX
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

    // إضافة رسالة في شات NEX
    function addNexMessage(text, type) {
        if (!chatNexMessages) return;
        const div = document.createElement('div');
        div.className = 'msg ' + type;
        const avatar = type === 'bot' ? '⚡' : '👤';
        div.innerHTML = '<div class="msg-avatar">' + avatar + '</div><div class="msg-bubble">' + text.replace(/\n/g, '<br>') + '</div>';
        chatNexMessages.appendChild(div);
        chatNexMessages.scrollTop = chatNexMessages.scrollHeight;
    }

    // الاتصال بـ DeepSeek API
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
    // 5. شات الأفكار
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
        ideas.push({ text: text, date: new Date().toISOString(), votes: 0 });
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
    // 6. المجتمع (الأفكار العامة + الشات)
    // ============================================================
    function renderCommunityIdeas() {
        const list = document.getElementById('communityIdeasList');
        if (!list) return;
        const ideas = getIdeas();
        if (ideas.length === 0) {
            list.innerHTML = '<div class="idea-item" style="text-align:center;color:var(--text-secondary);">لا توجد أفكار حالياً، كن أول من يشارك!</div>';
            return;
        }
        list.innerHTML = ideas.map(function(idea, index) {
            return '<div class="idea-item">' +
                '<span class="idea-text">' + idea.text + '</span>' +
                '<div class="idea-votes">' +
                '<button onclick="voteIdea(' + index + ', -1)"><i class="fas fa-thumbs-down"></i></button>' +
                '<span class="count" id="voteCount' + index + '">' + (idea.votes || 0) + '</span>' +
                '<button onclick="voteIdea(' + index + ', 1)"><i class="fas fa-thumbs-up"></i></button>' +
                '<span class="idea-date">' + new Date(idea.date).toLocaleDateString('ar') + '</span>' +
                '</div></div>';
        }).join('');
    }

    window.voteIdea = function(index, value) {
        const ideas = getIdeas();
        if (!ideas[index]) return;
        ideas[index].votes = (ideas[index].votes || 0) + value;
        localStorage.setItem('nex_ideas', JSON.stringify(ideas));
        renderCommunityIdeas();
    };

    document.getElementById('communityIdeaSend')?.addEventListener('click', function() {
        const input = document.getElementById('communityIdeaInput');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;
        saveIdea(text);
        input.value = '';
        renderCommunityIdeas();
        addCommunityMessage('💡 تم إضافة فكرة جديدة: "' + text + '"', 'system');
    });

    document.getElementById('communityIdeaInput')?.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('communityIdeaSend')?.click();
        }
    });

    // شات المجتمع
    let communityMessages = JSON.parse(localStorage.getItem('nex_community_messages') || '[]');

    function renderCommunityChat() {
        const container = document.getElementById('communityChatMessages');
        if (!container) return;
        container.innerHTML = communityMessages.map(function(msg) {
            return '<div class="chat-message ' + msg.type + '"><span class="username">' + msg.user + ':</span> ' + msg.text + '</div>';
        }).join('');
        container.scrollTop = container.scrollHeight;
    }

    function addCommunityMessage(text, type, user) {
        if (!user) user = 'نظام';
        if (type === 'user') {
            const currentUser = JSON.parse(localStorage.getItem('nex_current_user') || 'null');
            user = currentUser ? currentUser.name : 'مستخدم';
        }
        communityMessages.push({ text: text, type: type, user: user });
        localStorage.setItem('nex_community_messages', JSON.stringify(communityMessages));
        renderCommunityChat();
    }

    document.getElementById('communityChatSend')?.addEventListener('click', function() {
        const input = document.getElementById('communityChatInput');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;
        addCommunityMessage(text, 'user');
        input.value = '';
    });

    document.getElementById('communityChatInput')?.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('communityChatSend')?.click();
        }
    });

    function renderCommunityUsers() {
        const container = document.getElementById('communityChatUsers');
        if (!container) return;
        const users = ['NEX_DEV 👑', 'المستخدم_1', 'المستخدم_2'];
        container.innerHTML = users.map(function(user) {
            const isOnline = user.includes('👑') || Math.random() > 0.3;
            return '<span><i class="fas fa-circle ' + (isOnline ? 'online' : 'offline') + '"></i> ' + user + '</span>';
        }).join('');
    }

    // ============================================================
    // 7. لوحة تحكم المطور
    // ============================================================
    function updateDevPanel() {
        const users = JSON.parse(localStorage.getItem('nex_users') || '[]');
        const ideas = getIdeas();
        document.getElementById('userCount').textContent = users.length;
        document.getElementById('ideasCount').textContent = ideas.length;

        const ideasList = document.getElementById('devIdeasList');
        if (ideasList) {
            ideasList.innerHTML = ideas.length ? ideas.map(function(i) {
                return '<div class="dev-idea-item"><span>' + i.text + '</span><span class="date">' + new Date(i.date).toLocaleDateString('ar') + ' | 👍 ' + (i.votes || 0) + '</span></div>';
            }).join('') : '<div class="dev-idea-item">لا توجد أفكار حالياً</div>';
        }

        const usersList = document.getElementById('devUsersList');
        if (usersList) {
            usersList.innerHTML = users.length ? users.map(function(u) {
                return '<div class="dev-user-item"><span>' + u.name + ' (' + u.email + ')</span><span class="date">' + new Date(u.date).toLocaleDateString('ar') + '</span></div>';
            }).join('') : '<div class="dev-user-item">لا يوجد مستخدمين مسجلين</div>';
        }
    }

    document.getElementById('devPanelClose')?.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('devPanel')?.classList.remove('open');
    });
    document.getElementById('devPanel')?.addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('open');
    });

    // ============================================================
    // 8. تسجيل الدخول
    // ============================================================
    const DEVELOPER_EMAIL = 'nexbev111@gmail.com';

    document.getElementById('authToggle')?.addEventListener('click', function(e) {
        e.preventDefault();
        openOverlay('authOverlay');
    });
    document.getElementById('authClose')?.addEventListener('click', function(e) {
        e.preventDefault();
        closeOverlay('authOverlay');
    });
    document.getElementById('authOverlay')?.addEventListener('click', function(e) {
        if (e.target === this) closeOverlay('authOverlay');
    });

    document.querySelectorAll('.auth-tab').forEach(function(tab) {
        tab.onclick = function() {
            const target = this.dataset.tab;
            document.querySelectorAll('.auth-tab').forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            document.querySelectorAll('.auth-form').forEach(function(f) { f.classList.remove('active'); });
            document.getElementById('auth-' + target).classList.add('active');
        };
    });

    document.getElementById('loginBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        if (!email || !password) { alert('الرجاء إدخال البريد الإلكتروني وكلمة السر'); return; }

        const users = JSON.parse(localStorage.getItem('nex_users') || '[]');
        let user = users.find(function(u) { return u.email === email && u.password === password; });

        if (email === DEVELOPER_EMAIL) {
            user = users.find(function(u) { return u.email === email; });
            if (!user) {
                user = { name: 'المطور NEX', email: email, password: password, date: new Date().toISOString(), isDeveloper: true };
                users.push(user);
                localStorage.setItem('nex_users', JSON.stringify(users));
            } else {
                user.isDeveloper = true;
            }
            localStorage.setItem('nex_current_user', JSON.stringify(user));
            alert('👑 مرحباً أيها المطور! تم تسجيل الدخول بنجاح');
            closeOverlay('authOverlay');
            updateUserUI(user);
            setTimeout(function() {
                document.getElementById('devPanel')?.classList.add('open');
                updateDevPanel();
            }, 500);
            return;
        }

        if (user) {
            localStorage.setItem('nex_current_user', JSON.stringify(user));
            alert('مرحباً ' + user.name + '! تم تسجيل الدخول بنجاح');
            closeOverlay('authOverlay');
            updateUserUI(user);
        } else {
            alert('البريد الإلكتروني أو كلمة السر غير صحيحة');
        }
    });

    document.getElementById('registerBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value.trim();
        const confirm = document.getElementById('regConfirm').value.trim();

        if (!name || !email || !password || !confirm) { alert('الرجاء ملء جميع الحقول'); return; }
        if (password !== confirm) { alert('كلمة السر غير متطابقة'); return; }
        if (password.length < 6) { alert('كلمة السر يجب أن تكون 6 أحرف على الأقل'); return; }

        const users = JSON.parse(localStorage.getItem('nex_users') || '[]');
        if (users.find(function(u) { return u.email === email; })) {
            alert('هذا البريد الإلكتروني مسجل بالفعل');
            return;
        }

        const newUser = { name: name, email: email, password: password, date: new Date().toISOString(), isDeveloper: false };
        users.push(newUser);
        localStorage.setItem('nex_users', JSON.stringify(users));
        localStorage.setItem('nex_current_user', JSON.stringify(newUser));
        alert('مرحباً ' + name + '! تم إنشاء حسابك بنجاح');
        closeOverlay('authOverlay');
        updateUserUI(newUser);
    });

    document.getElementById('googleLogin')?.addEventListener('click', function(e) {
        e.preventDefault();
        const email = prompt('الرجاء إدخال بريدك الإلكتروني على جوجل:');
        if (!email) return;
        const name = email.split('@')[0];
        const users = JSON.parse(localStorage.getItem('nex_users') || '[]');
        let user = users.find(function(u) { return u.email === email; });
        if (!user) {
            user = { name: name, email: email, password: 'google_auth', date: new Date().toISOString(), isDeveloper: false };
            users.push(user);
            localStorage.setItem('nex_users', JSON.stringify(users));
        }
        localStorage.setItem('nex_current_user', JSON.stringify(user));
        alert('مرحباً ' + user.name + '! تم تسجيل الدخول بجوجل بنجاح');
        closeOverlay('authOverlay');
        updateUserUI(user);
    });

    function updateUserUI(user) {
        const authLink = document.querySelector('.sidebar-nav a[href="#"]');
        if (authLink) {
            const isDev = user.email === DEVELOPER_EMAIL;
            authLink.innerHTML = '<i class="fas fa-user-check"></i> <span>مرحباً ' + user.name + (isDev ? ' 👑' : '') + '</span>';
            authLink.style.color = isDev ? '#ffd700' : '#6c5ce7';
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
    if (currentUser) {
        updateUserUI(currentUser);
        if (currentUser.email === DEVELOPER_EMAIL) {
            setTimeout(function() {
                document.getElementById('devPanel')?.classList.add('open');
                updateDevPanel();
            }, 500);
        }
    }

    // ============================================================
    // 9. إغلاق النوافذ بـ Escape
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
    // 10. عداد الأرقام
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
    // 11. رسالة ترحيب في شات NEX
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
    // 12. تحميل Tawk.to
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

    // ============================================================
    // 13. عرض المجتمع عند التحميل
    // ============================================================
    renderCommunityIdeas();
    renderCommunityChat();
    renderCommunityUsers();

    console.log('✅ ℕ𝔼𝕏 Empire - جميع الأزرار والوظائف تعمل!');
});

// ============================================================
// تنبيه في Console للمطور
// ============================================================
console.log('👑 ℕ𝔼𝕏 Empire - قيد التطوير');
console.log('📧 حساب المطور: nexbev111@gmail.com');
