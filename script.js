// ====== تبديل الوضع ======
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}

// ====== القائمة الجانبية ======
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

// إغلاق القائمة عند النقر على رابط
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', () => {
        if (sidebar) sidebar.classList.remove('open');
    });
});

// ====== تفعيل الرابط النشط في القائمة ======
const currentPath = window.location.hash || '#home';
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
    }
});

// ====== نافذة الشات الموحدة ======
const chatOverlay = document.getElementById('chatOverlay');
const chatClose = document.getElementById('chatClose');

function openChat(tab = 'nex') {
    if (!chatOverlay) return;
    chatOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // تفعيل التبويب المطلوب
    document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.chat-tab-content').forEach(c => c.classList.remove('active'));
    
    const tabButton = document.querySelector(`.chat-tab[data-tab="${tab}"]`);
    const tabContent = document.getElementById(`tab-${tab}`);
    
    if (tabButton) tabButton.classList.add('active');
    if (tabContent) tabContent.classList.add('active');
    
    if (tab === 'nex') {
        setTimeout(() => {
            const input = document.getElementById('chatNexInput');
            if (input) input.focus();
        }, 300);
    }
}

function closeChat() {
    if (!chatOverlay) return;
    chatOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

// ====== زر شات NEX في القائمة الجانبية ======
const chatNexToggle = document.getElementById('chatNexToggle');

if (chatNexToggle) {
    chatNexToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('✅ تم النقر على شات NEX');
        openChat('nex');
    });
}

// ====== زر شات NEX في الهيدر القديم (إن وجد) ======
document.querySelectorAll('a[href="#chat"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        openChat('nex');
    });
});

// ====== إغلاق الشات ======
if (chatClose) {
    chatClose.addEventListener('click', closeChat);
}

if (chatOverlay) {
    chatOverlay.addEventListener('click', (e) => {
        if (e.target === chatOverlay) closeChat();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatOverlay?.classList.contains('open')) closeChat();
});

// ====== تبديل علامات التبويب ======
document.querySelectorAll('.chat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.chat-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const content = document.getElementById(`tab-${target}`);
        if (content) content.classList.add('active');
        if (target === 'nex') {
            setTimeout(() => {
                const input = document.getElementById('chatNexInput');
                if (input) input.focus();
            }, 300);
        }
    });
});

// ====== خيارات شات NEX ======
let currentThinking = true;
let currentSearch = true;

document.querySelectorAll('.nex-option').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.id === 'nexNewChat') {
            const messages = document.getElementById('chatNexMessages');
            if (messages) {
                messages.innerHTML = `
                    <div class="message bot">
                        <div class="msg-avatar">⚡</div>
                        <div class="msg-bubble">مرحباً، تم بدء محادثة جديدة. كيف يمكنني مساعدتك؟</div>
                    </div>
                `;
                const input = document.getElementById('chatNexInput');
                if (input) input.focus();
            }
            return;
        }
        document.querySelectorAll('.nex-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentThinking = btn.dataset.thinking === 'true';
        currentSearch = btn.dataset.search === 'true';
    });
});

// ====== شات NEX ======
const chatNexMessages = document.getElementById('chatNexMessages');
const chatNexInput = document.getElementById('chatNexInput');
const chatNexSend = document.getElementById('chatNexSend');

function addNexMessage(text, type) {
    if (!chatNexMessages) return;
    const div = document.createElement('div');
    div.className = `message ${type}`;
    const avatar = type === 'bot' ? '⚡' : '👤';
    const formattedText = text.replace(/\n/g, '<br>');
    div.innerHTML = `
        <div class="msg-avatar">${avatar}</div>
        <div class="msg-bubble">${formattedText}</div>
    `;
    chatNexMessages.appendChild(div);
    chatNexMessages.scrollTop = chatNexMessages.scrollHeight;
}

// ====== رابط الـ API ======
const DEEPSEEK_API_URL = 'https://nex-empire1.vercel.app/api/deepseek';

async function callDeepSeek(query, thinking, search) {
    try {
        const params = new URLSearchParams();
        params.append('query', query);
        params.append('thinking', thinking ? 'true' : 'false');
        params.append('search', search ? 'true' : 'false');

        const response = await fetch(`${DEEPSEEK_API_URL}?${params.toString()}`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'فشل الاتصال بـ DeepSeek');
        }

        return data.response.reply;
    } catch (error) {
        throw new Error(error.message || 'فشل الاتصال بالخادم');
    }
}

// ====== إرسال رسالة NEX ======
async function sendNexMessage() {
    if (!chatNexInput || !chatNexSend) return;
    
    const text = chatNexInput.value.trim();
    if (!text) return;

    addNexMessage(text, 'user');
    chatNexInput.value = '';
    chatNexInput.disabled = true;
    chatNexSend.disabled = true;

    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'message bot';
    loadingMsg.id = 'nexLoading';
    loadingMsg.innerHTML = `
        <div class="msg-avatar">⚡</div>
        <div class="msg-bubble">⏳ جاري التفكير... <span class="dot-loader">● ● ●</span></div>
    `;
    if (chatNexMessages) {
        chatNexMessages.appendChild(loadingMsg);
        chatNexMessages.scrollTop = chatNexMessages.scrollHeight;
    }

    try {
        const reply = await callDeepSeek(text, currentThinking, currentSearch);
        const loading = document.getElementById('nexLoading');
        if (loading) loading.remove();
        addNexMessage(reply, 'bot');
    } catch (error) {
        const loading = document.getElementById('nexLoading');
        if (loading) loading.remove();
        addNexMessage(`❌ عذراً، حدث خطأ: ${error.message}`, 'bot');
    }

    chatNexInput.disabled = false;
    chatNexSend.disabled = false;
    chatNexInput.focus();
}

if (chatNexSend) {
    chatNexSend.addEventListener('click', sendNexMessage);
}

if (chatNexInput) {
    chatNexInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendNexMessage();
    });
}

// ====== خيارات Tawk.to ======
document.querySelectorAll('.tawk-option').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tawk-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const container = document.getElementById('tawkContainer');
        if (!container) return;
        
        if (btn.id === 'tawkLive') {
            container.innerHTML = `
                <div class="message system">
                    <div class="msg-bubble" style="background:var(--input-bg);color:var(--text-secondary);">
                        <i class="fas fa-circle" style="color:#00c853;"></i> الدعم المباشر جاهز
                        <br><small>فريق الدعم في انتظارك</small>
                    </div>
                </div>
            `;
            const tawkIframe = document.querySelector('#tawk-container iframe');
            if (tawkIframe) {
                container.innerHTML = '';
                container.appendChild(tawkIframe);
                tawkIframe.style.width = '100%';
                tawkIframe.style.height = '100%';
                tawkIframe.style.border = 'none';
            }
        } else if (btn.id === 'tawkHistory') {
            container.innerHTML = `
                <div class="message system">
                    <div class="msg-bubble" style="background:var(--input-bg);color:var(--text-secondary);">
                        <i class="fas fa-history"></i> سجل المحادثات
                        <br><small>سيتم عرض تاريخ محادثاتك هنا</small>
                    </div>
                </div>
            `;
        } else if (btn.id === 'tawkNew') {
            container.innerHTML = `
                <div class="message system">
                    <div class="msg-bubble" style="background:var(--input-bg);color:var(--text-secondary);">
                        <i class="fas fa-plus"></i> بدء محادثة جديدة
                        <br><small>جاري الاتصال بأحد ممثلي الدعم...</small>
                    </div>
                </div>
            `;
        }
    });
});

// ====== عداد الأرقام المتحرك ======
const numbers = document.querySelectorAll('.number');

const animateNumbers = () => {
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
};

const heroSection = document.querySelector('.hero');
if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.disconnect();
            }
        });
    });
    observer.observe(heroSection);
}

// ====== إشعار ترحيبي ======
console.log('⚡ ℕ𝔼𝕏 Empire | منصة الذكاء الرقمي');
console.log('💻 المطور: 𝑵𝑬𝑿_𝑫𝑬𝑽_𝑽𝟏');

// ====== رسالة ترحيب في شات NEX ======
setTimeout(() => {
    addNexMessage('مرحباً، أنا مساعد NEX الذكي. كيف يمكنني مساعدتك اليوم؟', 'bot');
}, 500);

// ====== محاولة تحميل Tawk في الخلفية ======
setTimeout(() => {
    const tawkContainer = document.getElementById('tawkContainer');
    const tawkIframe = document.querySelector('#tawk-container iframe');
    if (tawkIframe && tawkContainer) {
        tawkContainer.innerHTML = '';
        tawkContainer.appendChild(tawkIframe);
        tawkIframe.style.width = '100%';
        tawkIframe.style.height = '100%';
        tawkIframe.style.border = 'none';
        tawkIframe.style.borderRadius = '0';
        tawkIframe.style.minHeight = '400px';
    }
}, 3000);
