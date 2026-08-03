// ============================================================
// ملف script.js - نسخة مبسطة ونظيفة
// تم إعادة كتابتها بالكامل لضمان عمل جميع الأزرار
// ============================================================

// ====== انتظار تحميل الصفحة بالكامل ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 تم تحميل الصفحة بالكامل');

    // ============================================================
    // ====== 1. تبديل الوضع (ليلي/نهاري) ======
    // ============================================================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    if (themeToggle) {
        // استعادة الوضع المحفوظ
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
    // ====== 2. القائمة الجانبية ======
    // ============================================================
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('open');
            console.log('✅ القائمة الجانبية: تم النقر');
        });

        // إغلاق القائمة عند النقر على رابط
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.addEventListener('click', function() {
                sidebar.classList.remove('open');
            });
        });
    }

    // ============================================================
    // ====== 3. دوال فتح وإغلاق النوافذ ======
    // ============================================================
    function openOverlay(overlayId) {
        const overlay = document.getElementById(overlayId);
        if (overlay) {
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            console.log(`✅ تم فتح: ${overlayId}`);
            return true;
        } else {
            console.error(`❌ العنصر غير موجود: ${overlayId}`);
            return false;
        }
    }

    function closeOverlay(overlayId) {
        const overlay = document.getElementById(overlayId);
        if (overlay) {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
            console.log(`✅ تم إغلاق: ${overlayId}`);
            return true;
        } else {
            console.error(`❌ العنصر غير موجود: ${overlayId}`);
            return false;
        }
    }

    // ============================================================
    // ====== 4. شات NEX ======
    // ============================================================
    const chatOverlay = document.getElementById('chatOverlay');
    const chatClose = document.getElementById('chatClose');
    const devChatNex = document.getElementById('devChatNex');
    const chatNexToggle = document.getElementById('chatNexToggle');

    // فتح شات NEX
    function openChatNex() {
        if (openOverlay('chatOverlay')) {
            setTimeout(() => {
                const input = document.getElementById('chatNexInput');
                if (input) input.focus();
            }, 300);
        }
    }

    // ربط أزرار فتح شات NEX
    if (devChatNex) {
        devChatNex.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('✅ زر شات NEX (الشريط العلوي)');
            openChatNex();
        });
    } else {
        console.warn('⚠️ زر devChatNex غير موجود في HTML');
    }

    if (chatNexToggle) {
        chatNexToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('✅ زر شات NEX (القائمة الجانبية)');
            openChatNex();
        });
    } else {
        console.warn('⚠️ زر chatNexToggle غير موجود في HTML');
    }

    // إغلاق شات NEX
    if (chatClose) {
        chatClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeOverlay('chatOverlay');
        });
    }

    if (chatOverlay) {
        chatOverlay.addEventListener('click', function(e) {
            if (e.target === chatOverlay) {
                closeOverlay('chatOverlay');
            }
        });
    }

    // ============================================================
    // ====== 5. شات الأفكار ======
    // ============================================================
    const ideasOverlay = document.getElementById('ideasOverlay');
    const ideasClose = document.getElementById('ideasClose');
    const devIdeasToggle = document.getElementById('devIdeasToggle');
    const ideasFloat = document.getElementById('ideasFloat');

    // فتح شات الأفكار
    function openIdeasChat() {
        if (openOverlay('ideasOverlay')) {
            setTimeout(() => {
                const input = document.getElementById('ideasInput');
                if (input) input.focus();
            }, 300);
        }
    }

    // ربط أزرار فتح شات الأفكار
    if (devIdeasToggle) {
        devIdeasToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('✅ زر شات الأفكار (الشريط العلوي)');
            openIdeasChat();
        });
    } else {
        console.warn('⚠️ زر devIdeasToggle غير موجود في HTML');
    }

    if (ideasFloat) {
        ideasFloat.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('✅ زر شات الأفكار (العائم)');
            openIdeasChat();
        });
    } else {
        console.warn('⚠️ زر ideasFloat غير موجود في HTML');
    }

    // إغلاق شات الأفكار
    if (ideasClose) {
        ideasClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeOverlay('ideasOverlay');
        });
    }

    if (ideasOverlay) {
        ideasOverlay.addEventListener('click', function(e) {
            if (e.target === ideasOverlay) {
                closeOverlay('ideasOverlay');
            }
        });
    }

    // ============================================================
    // ====== 6. تسجيل الدخول ======
    // ============================================================
    const authOverlay = document.getElementById('authOverlay');
    const authClose = document.getElementById('authClose');
    const authToggle = document.getElementById('authToggle');

    // فتح تسجيل الدخول
    function openAuth() {
        openOverlay('authOverlay');
    }

    // ربط زر تسجيل الدخول
    if (authToggle) {
        authToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('✅ زر تسجيل الدخول (القائمة الجانبية)');
            openAuth();
        });
    } else {
        console.warn('⚠️ زر authToggle غير موجود في HTML');
    }

    // إغلاق تسجيل الدخول
    if (authClose) {
        authClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeOverlay('authOverlay');
        });
    }

    if (authOverlay) {
        authOverlay.addEventListener('click', function(e) {
            if (e.target === authOverlay) {
                closeOverlay('authOverlay');
            }
        });
    }

    // ============================================================
    // ====== 7. إغلاق النوافذ بزر Escape ======
    // ============================================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (chatOverlay?.classList.contains('open')) closeOverlay('chatOverlay');
            if (ideasOverlay?.classList.contains('open')) closeOverlay('ideasOverlay');
            if (authOverlay?.classList.contains('open')) closeOverlay('authOverlay');
        }
    });

    // ============================================================
    // ====== 8. عداد الأرقام المتحرك ======
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
    // ====== 9. التحقق من جميع العناصر المهمة ======
    // ============================================================
    console.log('📊 تقرير العناصر:');
    console.log('  - chatOverlay:', document.getElementById('chatOverlay') ? '✅' : '❌');
    console.log('  - ideasOverlay:', document.getElementById('ideasOverlay') ? '✅' : '❌');
    console.log('  - authOverlay:', document.getElementById('authOverlay') ? '✅' : '❌');
    console.log('  - devChatNex:', document.getElementById('devChatNex') ? '✅' : '❌');
    console.log('  - devIdeasToggle:', document.getElementById('devIdeasToggle') ? '✅' : '❌');
    console.log('  - ideasFloat:', document.getElementById('ideasFloat') ? '✅' : '❌');
    console.log('  - authToggle:', document.getElementById('authToggle') ? '✅' : '❌');

    console.log('🎯 جميع الأزرار جاهزة!');
});

// ============================================================
// ====== كود إضافي: رسائل الترحيب ======
// ============================================================
console.log('⚡ ℕ𝔼𝕏 Empire | منصة الذكاء الرقمي');
console.log('💻 المطور: 𝑵𝑬𝑿_𝑫𝑬𝑽_𝑽𝟏');
