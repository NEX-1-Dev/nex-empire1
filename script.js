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

// ====== القائمة المتنقلة ======
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
});

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
    });
});

// ====== شات NEX مع DeepSeek ======
const chatNexToggle = document.getElementById('chatNexToggle');
const chatNexWindow = document.getElementById('chatNexWindow');
const chatNexClose = document.getElementById('chatNexClose');
const chatNexMessages = document.getElementById('chatNexMessages');
const chatNexInput = document.getElementById('chatNexInput');
const chatNexSend = document.getElementById('chatNexSend');

// خيارات DeepSeek
let currentThinking = true;
let currentSearch = true;

document.querySelectorAll('.nex-option').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nex-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentThinking = btn.dataset.thinking === 'true';
        currentSearch = btn.dataset.search === 'true';
    });
});

// فتح/إغلاق الشات
chatNexToggle.addEventListener('click', () => {
    chatNexWindow.classList.toggle('open');
});

chatNexClose.addEventListener('click', () => {
    chatNexWindow.classList.remove('open');
});

// إضافة رسالة
function addNexMessage(text, type) {
    const div = document.createElement('div');
    div.className = `nex-message ${type}`;
    const avatar = type === 'bot' ? '🤖' : '👤';
    div.innerHTML = `
        <div class="nex-avatar">${avatar}</div>
        <div class="nex-bubble">${text}</div>
    `;
    chatNexMessages.appendChild(div);
    chatNexMessages.scrollTop = chatNexMessages.scrollHeight;
}

// ====== الاتصال بـ DeepSeek API ======
// 🚨 استبدل هذا الرابط برابط API الخاص بك بعد النشر على Vercel
const DEEPSEEK_API_URL = 'https://your-api-url.vercel.app/api/deepseek';

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

        // تحويل النص إلى HTML لعرضه بشكل جميل
        let reply = data.response.reply;
        reply = reply.replace(/\n/g, '<br>');
        return reply;
    } catch (error) {
        throw new Error(error.message || 'فشل الاتصال بالخادم');
    }
}

// ====== إرسال رسالة ======
async function sendNexMessage() {
    const text = chatNexInput.value.trim();
    if (!text) return;

    addNexMessage(text, 'user');
    chatNexInput.value = '';
    chatNexInput.disabled = true;
    chatNexSend.disabled = true;

    // عرض رسالة "جاري التفكير..."
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'nex-message bot';
    loadingMsg.id = 'nexLoading';
    loadingMsg.innerHTML = `
        <div class="nex-avatar">🤖</div>
        <div class="nex-bubble">⏳ جاري التفكير والبحث... <span class="dot-loader">● ● ●</span></div>
    `;
    chatNexMessages.appendChild(loadingMsg);
    chatNexMessages.scrollTop = chatNexMessages.scrollHeight;

    try {
        const reply = await callDeepSeek(text, currentThinking, currentSearch);
        document.getElementById('nexLoading')?.remove();
        addNexMessage(reply, 'bot');
    } catch (error) {
        document.getElementById('nexLoading')?.remove();
        addNexMessage(`❌ عذراً، حدث خطأ: ${error.message}`, 'bot');
    }

    chatNexInput.disabled = false;
    chatNexSend.disabled = false;
    chatNexInput.focus();
}

chatNexSend.addEventListener('click', sendNexMessage);
chatNexInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendNexMessage();
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
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            observer.disconnect();
        }
    });
});
observer.observe(heroSection);

// ====== إشعار ترحيبي ======
console.log('🚀 ℕ𝔼𝕏 Empire | إمبراطورية البوتات والذكاء الاصطناعي');
console.log('💻 المطور: 𝑵𝑬𝑿_𝑫𝑬𝑽_𝑽𝟏');
console.log('🌟 تابعنا على تليغرام وواتساب!');

// ====== رسالة ترحيب في شات NEX ======
setTimeout(() => {
    addNexMessage('👋 مرحباً بك في ℕ𝔼𝕏! أنا شات NEX المدعوم بذكاء DeepSeek. كيف يمكنني مساعدتك اليوم؟', 'bot');
}, 500);
