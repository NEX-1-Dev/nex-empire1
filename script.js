// ====== تبديل الوضع الليلي/النهاري ======
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// التحقق من الوضع المحفوظ
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
    if (theme === 'light') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// ====== القائمة المتنقلة (Mobile Menu) ======
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
});

// إغلاق القائمة عند النقر على رابط
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
    });
});

// ====== شات الدعم ======
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

// رسائل تلقائية للرد
const autoReplies = [
    'شكراً لتواصلك! سنرد عليك قريباً 💙',
    'أهلاً بك! كيف يمكننا مساعدتك؟ 😊',
    'تم استلام رسالتك، فريق الدعم يعمل على ذلك 🚀',
    'مرحباً! هل تحتاج مساعدة في أحد البوتات؟ 🤖',
    'نحن هنا من أجلك على مدار الساعة 🕐'
];

// إرسال رسالة
function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // إضافة رسالة المستخدم
    addMessage(text, 'user');
    chatInput.value = '';

    // محاكاة الرد التلقائي
    setTimeout(() => {
        const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        addMessage(randomReply, 'bot');
    }, 1000 + Math.random() * 1500);
}

// إضافة رسالة للشات
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `<span>${text}</span>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// أحداث الشات
chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
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

// تشغيل العداد عند ظهور القسم
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

// ====== نموذج التواصل ======
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // محاكاة الإرسال
    const btn = contactForm.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    btn.disabled = true;

    setTimeout(() => {
        alert(`✅ شكراً ${name}! تم استلام رسالتك بنجاح. سنرد عليك قريباً 💙`);
        contactForm.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1500);
});

// ====== إضافة رسالة ترحيب تلقائية عند تحميل الصفحة ======
window.addEventListener('load', () => {
    setTimeout(() => {
        addMessage('👋 مرحباً بك في دعم ℕ𝔼𝕏! كيف يمكننا مساعدتك؟', 'system');
    }, 500);
});

// ====== منع النقر على الأزرار المعطلة ======
document.querySelectorAll('.bot-btn.disabled').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('⏳ هذا البوت غير متاح حالياً، تابعنا للتعرف على التحديثات!');
    });
});

// ====== إظهار رسالة ترحيب عند زيارة الموقع ======
console.log('🚀 مرحباً بك في ℕ𝔼𝕏 Empire!');
console.log('💻 المطور: 𝑵𝑬𝑿_𝑫𝑬𝑽_𝑽𝟏');
console.log('🌟 تابعنا على تليغرام وواتساب!');
