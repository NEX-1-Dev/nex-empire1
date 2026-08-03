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

// ============================================================
// ====== القائمة الجانبية ======
// ============================================================
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        sidebar.classList.toggle('open');
        console.log('✅ القائمة الجانبية: تم النقر');
    });
}

// إغلاق القائمة عند النقر على رابط
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', function() {
        if (sidebar) sidebar.classList.remove('open');
    });
});

// ============================================================
// ====== شات NEX ======
// ============================================================
const chatOverlay = document.getElementById('chatOverlay');
const chatClose = document.getElementById('chatClose');
const chatNexMessages = document.getElementById('chatNexMessages');
const chatNexInput = document.getElementById('chatNexInput');
const chatNexSend = document.getElementById('chatNexSend');

// دالة فتح شات NEX
function openChatNex() {
    if (!chatOverlay) return;
    chatOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    console.log('✅ شات NEX: تم الفتح');
    setTimeout(() => {
        if (chatNexInput) chatNexInput.focus();
    }, 300);
}

// دالة إغلاق شات NEX
function closeChatNex() {
    if (!chatOverlay) return;
    chatOverlay.classList.remove('open');
    document.body.style.overflow = '';
    console.log('✅ شات NEX: تم الإغلاق');
}

// ====== ربط زر شات NEX من الشريط العلوي ======
const devChatNex = document.getElementById('devChatNex');
if (devChatNex) {
    devChatNex.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('✅ زر شات NEX (الشريط العلوي): تم النقر');
        openChatNex();
    });
}

// ====== ربط زر شات NEX من القائمة الجانبية ======
const chatNexToggle = document.getElementById('chatNexToggle');
if (chatNexToggle) {
    chatNexToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('✅ زر شات NEX (القائمة الجانبية): تم النقر');
        openChatNex();
    });
}

// ====== إغلاق شات NEX ======
if (chatClose) {
    chatClose.addEventListener('click', function(e) {
        e.stopPropagation();
        closeChatNex();
    });
}

if (chatOverlay) {
    chatOverlay.addEventListener('click', function(e) {
        if (e.target === chatOverlay) closeChatNex();
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && chatOverlay?.classList.contains('open')) closeChatNex();
});

// ====== خيارات شات NEX ======
let currentThinking = true;
let currentSearch = true;

document.querySelectorAll('.chat-opt').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.id === 'nexNewChat') {
            if (chatNexMessages) {
                chatNexMessages.innerHTML = `
                    <div class="msg bot">
                        <div class="msg-avatar">⚡</div>
                        <div class="msg-bubble">مرحباً، تم بدء محادثة جديدة. كيف يمكنني مساعدتك؟</div>
                    </div>
                `;
                if (chatNexInput) chatNexInput.focus();
            }
            return;
        }
        document.querySelectorAll('.chat-opt').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentThinking = this.dataset.thinking === 'true';
        currentSearch = this.dataset.search === 'true';
    });
});

// ====== وظائف شات NEX ======
function addNexMessage(text, type) {
    if (!chatNexMessages) return;
    const div = document.createElement('div');
    div.className = `msg ${type}`;
    const avatar = type === 'bot' ? '⚡' : '👤';
    const formattedText = text.replace(/\n/g, '<br>');
    div.innerHTML = `
        <div class="msg-avatar">${avatar}</div>
        <div class="msg-bubble">${formattedText}</div>
    `;
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

async function sendNexMessage() {
    if (!chatNexInput || !chatNexSend) return;
    
    const text = chatNexInput.value.trim();
    if (!text) return;

    addNexMessage(text, 'user');
    chatNexInput.value = '';
    chatNexInput.disabled = true;
    chatNexSend.disabled = true;

    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'msg bot';
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
    chatNexInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') sendNexMessage();
    });
}

// ============================================================
// ====== شات الأفكار ======
// ============================================================
const ideasOverlay = document.getElementById('ideasOverlay');
const ideasClose = document.getElementById('ideasClose');
const ideasMessages = document.getElementById('ideasMessages');
const ideasInput = document.getElementById('ideasInput');
const ideasSend = document.getElementById('ideasSend');

// كلمة السر للمطور
const DEV_PASSWORD = '8520261962026';
let isDevMode = false;

// دالة فتح شات الأفكار
function openIdeasChat() {
    if (!ideasOverlay) return;
    ideasOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    console.log('✅ شات الأفكار: تم الفتح');
    setTimeout(() => {
        if (ideasInput) ideasInput.focus();
    }, 300);
}

// دالة إغلاق شات الأفكار
function closeIdeasChat() {
    if (!ideasOverlay) return;
    ideasOverlay.classList.remove('open');
    document.body.style.overflow = '';
    console.log('✅ شات الأفكار: تم الإغلاق');
}

// ====== ربط زر شات الأفكار من الشريط العلوي ======
const devIdeasToggle = document.getElementById('devIdeasToggle');
if (devIdeasToggle) {
    devIdeasToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('✅ زر شات الأفكار (الشريط العلوي): تم النقر');
        openIdeasChat();
    });
}

// ====== ربط زر شات الأفكار العائم ======
const ideasFloat = document.getElementById('ideasFloat');
if (ideasFloat) {
    ideasFloat.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('✅ زر شات الأفكار (العائم): تم النقر');
        openIdeasChat();
    });
}

// ====== إغلاق شات الأفكار ======
if (ideasClose) {
    ideasClose.addEventListener('click', function(e) {
        e.stopPropagation();
        closeIdeasChat();
    });
}

if (ideasOverlay) {
    ideasOverlay.addEventListener('click', function(e) {
        if (e.target === ideasOverlay) closeIdeasChat();
    });
}

// ====== وظائف شات الأفكار ======
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

// ====== إرسال فكرة ======
async function sendIdea() {
    if (!ideasInput) return;
    const text = ideasInput.value.trim();
    if (!text) return;

    // التحقق من كلمة السر للمطور
    if (text === DEV_PASSWORD) {
        isDevMode = true;
        addIdeaMessage('🔓 تم التحقق من هوية المطور! مرحباً بك في لوحة التحكم.', 'system');
        ideasInput.value = '';
        openDevPanel();
        return;
    }

    addIdeaMessage(text, 'user');
    saveIdea(text);
    ideasInput.value = '';

    // رد تلقائي
    setTimeout(() => {
        const replies = [
            '💡 شكراً لفكرتك! سنقوم بدراستها',
            '✨ فكرة رائعة! تم تسجيلها',
            '🚀 نشكرك على مساهميتك في تطوير الإمبراطورية',
            '📝 تم حفظ فكرتك، سنعمل عليها قريباً'
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        addIdeaMessage(reply, 'system');
    }, 1000);
}

if (ideasSend) {
    ideasSend.addEventListener('click', sendIdea);
}

if (ideasInput) {
    ideasInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') sendIdea();
    });
}

// ============================================================
// ====== لوحة تحكم المطور ======
// ============================================================
const devPanel = document.getElementById('devPanel');
const devPanelClose = document.getElementById('devPanelClose');

function openDevPanel() {
    if (!devPanel) return;
    devPanel.classList.add('open');
    document.body.style.overflow = 'hidden';
    console.log('✅ لوحة المطور: تم الفتح');
    updateDevPanel();
}

function closeDevPanel() {
    if (!devPanel) return;
    devPanel.classList.remove('open');
    document.body.style.overflow = '';
    console.log('✅ لوحة المطور: تم الإغلاق');
}

if (devPanelClose) {
    devPanelClose.addEventListener('click', function(e) {
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
    document.getElementById('userCount').textContent = users.length;

    const ideas = getIdeas();
    document.getElementById('ideasCount').textContent = ideas.length;

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
// ====== نظام تسجيل الدخول ======
// ============================================================
const authOverlay = document.getElementById('authOverlay');
const authClose = document.getElementById('authClose');
const authToggle = document.getElementById('authToggle');

// دالة فتح تسجيل الدخول
function openAuth() {
    if (!authOverlay) return;
    authOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    console.log('✅ تسجيل الدخول: تم الفتح');
}

// دالة إغلاق تسجيل الدخول
function closeAuth() {
    if (!authOverlay) return;
    authOverlay.classList.remove('open');
    document.body.style.overflow = '';
    console.log('✅ تسجيل الدخول: تم الإغلاق');
}

// ====== ربط زر تسجيل الدخول ======
if (authToggle) {
    authToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('✅ زر تسجيل الدخول (القائمة الجانبية): تم النقر');
        openAuth();
    });
}

if (authClose) {
    authClose.addEventListener('click', function(e) {
        e.stopPropagation();
        closeAuth();
    });
}

if (authOverlay) {
    authOverlay.addEventListener('click', function(e) {
        if (e.target === authOverlay) closeAuth();
    });
}

// ====== تبديل علامات التبويب في تسجيل الدخول ======
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const target = this.dataset.tab;
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        document.getElementById(`auth-${target}`).classList.add('active');
    });
});

// ====== تسجيل دخول ======
document.getElementById('loginBtn').addEventListener('click', function() {
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
        closeAuth();
        updateUserUI(user);
    } else {
        alert('البريد الإلكتروني أو كلمة السر غير صحيحة');
    }
});

// ====== إنشاء حساب ======
document.getElementById('registerBtn').addEventListener('click', function() {
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
    closeAuth();
    updateUserUI(newUser);
});

// ====== تسجيل الدخول بجوجل (محاكاة) ======
document.getElementById('googleLogin').addEventListener('click', function() {
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
        closeAuth();
        updateUserUI(user);
    }
});

// ====== تحديث واجهة المستخدم بعد تسجيل الدخول ======
function updateUserUI(user) {
    const authLink = document.querySelector('.sidebar-nav a[href="#"]');
    if (authLink) {
        authLink.innerHTML = `<i class="fas fa-user-check"></i> <span>مرحباً ${user.name}</span>`;
        authLink.style.color = '#6c5ce7';
        authLink.id = 'userLoggedIn';
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

// ====== التحقق من وجود مستخدم مسجل ======
const currentUser = JSON.parse(localStorage.getItem('nex_current_user') || 'null');
if (currentUser) {
    updateUserUI(currentUser);
}

// ============================================================
// ====== عداد الأرقام المتحرك ======
// ============================================================
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

// ============================================================
// ====== رسائل ترحيبية ======
// ============================================================
console.log('⚡ ℕ𝔼𝕏 Empire | منصة الذكاء الرقمي');
console.log('💻 المطور: 𝑵𝑬𝑿_𝑫𝑬𝑽_𝑽𝟏');
console.log('📌 جميع الأزرار تعمل!');

// رسالة ترحيب في شات NEX
setTimeout(() => {
    addNexMessage('مرحباً، أنا مساعد NEX الذكي. كيف يمكنني مساعدتك اليوم؟', 'bot');
}, 500);

// محاولة تحميل Tawk في الخلفية
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

// ============================================================
// ====== التنبيه عند تحميل الصفحة ======
// ============================================================
window.addEventListener('load', function() {
    console.log('✅ تم تحميل الصفحة بالكامل');
    console.log('🔍 تحقق من الأزرار:');
    console.log('   - شات NEX (الشريط العلوي):', document.getElementById('devChatNex') ? '✅ موجود' : '❌ غير موجود');
    console.log('   - شات الأفكار (الشريط العلوي):', document.getElementById('devIdeasToggle') ? '✅ موجود' : '❌ غير موجود');
    console.log('   - شات الأفكار (العائم):', document.getElementById('ideasFloat') ? '✅ موجود' : '❌ غير موجود');
    console.log('   - تسجيل الدخول (القائمة):', document.getElementById('authToggle') ? '✅ موجود' : '❌ غير موجود');
    console.log('   - شات NEX (القائمة):', document.getElementById('chatNexToggle') ? '✅ موجود' : '❌ غير موجود');
});
