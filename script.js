// ============================================================
// ℕ𝔼𝕏 Empire - بدون تسجيل دخول
// شات NEX + شات الأفكار المطور
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ℕ𝔼𝕏 Empire - تم تحميل الصفحة');

    // ====== 1. تبديل الوضع ======
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

    // ====== 2. القائمة الجانبية ======
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

    // ====== 3. دوال فتح وإغلاق النوافذ ======
    function openOverlay(id) {
        const el = document.getElementById(id);
        if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
    }
    function closeOverlay(id) {
        const el = document.getElementById(id);
        if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
    }

    // ====== 4. شات NEX ======
    const chatOverlay = document.getElementById('chatOverlay');
    const chatClose = document.getElementById('chatClose');
    const devChatNex = document.getElementById('devChatNex');
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

    // ====== 5. شات الأفكار المطور ======
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
        updateIdeasStats();
    }

    function getIdeas() {
        return JSON.parse(localStorage.getItem('nex_ideas') || '[]');
    }

    function updateIdeasStats() {
        const ideas = getIdeas();
        const total = document.getElementById('totalIdeas');
        const today = document.getElementById('todayIdeas');
        if (total) total.textContent = ideas.length;
        if (today) {
            const todayDate = new Date().toDateString();
            const todayCount = ideas.filter(function(i) {
                return new Date(i.date).toDateString() === todayDate;
            }).length;
            today.textContent = todayCount;
        }
    }

    function sendIdea() {
        if (!ideasInput) return;
        const text = ideasInput.value.trim();
        if (!text) return;

        // كلمة المطور
        if (text === DEV_PASSWORD) {
            addIdeaMessage('🔓 تم التحقق من هوية المطور! مرحباً بك في لوحة التحكم.', 'dev');
            ideasInput.value = '';
            document.getElementById('devPanel')?.classList.add('open');
            updateDevPanel();
            return;
        }

        addIdeaMessage(text, 'user');
        saveIdea(text);
        ideasInput.value = '';

        // ردود تلقائية متطورة
        setTimeout(function() {
            const replies = [
                '💡 شكراً لفكرتك الرائعة! سنعمل على دراستها.',
                '✨ فكرة ممتازة! تم تسجيلها في سجلات الإمبراطورية.',
                '🚀 نشكرك على مساهميتك في تطوير ℕ𝔼𝕏!',
                '📝 تم حفظ فكرتك بنجاح، سنتواصل معك قريباً.',
                '🔥 فكرة قوية! سنضيفها إلى قائمة التطويرات.',
                '💪 شكراً لك! أنت جزء من بناء المستقبل الرقمي.'
            ];
            const reply = replies[Math.floor(Math.random() * replies.length)];
            addIdeaMessage(reply, 'system');
        }, 600);
    }

    if (ideasSend) ideasSend.onclick = sendIdea;
    if (ideasInput) {
        ideasInput.onkeydown = function(e) {
            if (e.key === 'Enter') { e.preventDefault(); sendIdea(); }
        };
    }

    // ====== 6. لوحة تحكم المطور ======
    function updateDevPanel() {
        const ideas = getIdeas();
        document.getElementById('ideasCount').textContent = ideas.length;

        const ideasList = document.getElementById('devIdeasList');
        if (ideasList) {
            ideasList.innerHTML = ideas.length ? ideas.map(function(i, index) {
                return '<div class="dev-idea-item"><span>#' + (index + 1) + ' ' + i.text + '</span><span class="date">' + new Date(i.date).toLocaleDateString('ar') + '</span></div>';
            }).join('') : '<div class="dev-idea-item">لا توجد أفكار حالياً</div>';
        }
    }

    document.getElementById('devPanelClose').onclick = function(e) {
        e.preventDefault();
        document.getElementById('devPanel')?.classList.remove('open');
    };
    document.getElementById('devPanel').onclick = function(e) {
        if (e.target === this) this.classList.remove('open');
    };

    // ====== 7. إغلاق النوافذ بـ Escape ======
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            ['chatOverlay', 'ideasOverlay'].forEach(function(id) {
                const el = document.getElementById(id);
                if (el && el.classList.contains('open')) closeOverlay(id);
            });
        }
    });

    // ====== 8. عداد الأرقام ======
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

    // ====== 9. رسالة ترحيب في شات NEX ======
    setTimeout(function() {
        if (chatNexMessages && !chatNexMessages.children.length) {
            const div = document.createElement('div');
            div.className = 'msg bot';
            div.innerHTML = '<div class="msg-avatar">⚡</div><div class="msg-bubble">مرحباً، أنا مساعد NEX الذكي. كيف يمكنني مساعدتك اليوم؟</div>';
            chatNexMessages.appendChild(div);
        }
    }, 500);

    // ====== 10. تحميل Tawk.to ======
    setTimeout(function() {
        const container = document.getElementById('tawkContainer');
        const iframe = document.querySelector('#tawk-container iframe');
        if (iframe && container) {
            container.innerHTML = '';
            container.appendChild(iframe);
            iframe.style.cssText = 'width:100%;height:100%;border:none;min-height:400px;';
        }
    }, 3000);

    // ====== 11. تحديث إحصائيات الأفكار ======
    updateIdeasStats();

    console.log('✅ ℕ𝔼𝕏 Empire - جميع الأزرار والوظائف تعمل!');
});
