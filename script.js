// ============================================================
// ملف script.js الجديد - تم تبسيطه لضمان العمل
// ============================================================

// عند تحميل الصفحة، تأكد من أن كل شيء جاهز
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 تم تحميل ملف script.js بنجاح!');

    // ====== 1. زر شات NEX (من الشريط العلوي) ======
    const devChatNex = document.getElementById('devChatNex');
    const chatOverlay = document.getElementById('chatOverlay');

    if (devChatNex && chatOverlay) {
        devChatNex.addEventListener('click', function(e) {
            e.preventDefault();
            chatOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            console.log('✅ تم فتح شات NEX');
        });
    } else {
        console.warn('⚠️ زر devChatNex أو chatOverlay غير موجود.');
    }

    // ====== 2. زر شات NEX (من القائمة الجانبية) ======
    const chatNexToggle = document.getElementById('chatNexToggle');
    if (chatNexToggle && chatOverlay) {
        chatNexToggle.addEventListener('click', function(e) {
            e.preventDefault();
            chatOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            console.log('✅ تم فتح شات NEX (من القائمة)');
        });
    } else {
        console.warn('⚠️ زر chatNexToggle غير موجود.');
    }

    // ====== 3. زر إغلاق شات NEX ======
    const chatClose = document.getElementById('chatClose');
    if (chatClose && chatOverlay) {
        chatClose.addEventListener('click', function(e) {
            e.preventDefault();
            chatOverlay.classList.remove('open');
            document.body.style.overflow = '';
            console.log('✅ تم إغلاق شات NEX');
        });
    }

    // ====== 4. زر شات الأفكار (من الشريط العلوي) ======
    const devIdeasToggle = document.getElementById('devIdeasToggle');
    const ideasOverlay = document.getElementById('ideasOverlay');

    if (devIdeasToggle && ideasOverlay) {
        devIdeasToggle.addEventListener('click', function(e) {
            e.preventDefault();
            ideasOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            console.log('✅ تم فتح شات الأفكار');
        });
    } else {
        console.warn('⚠️ زر devIdeasToggle أو ideasOverlay غير موجود.');
    }

    // ====== 5. زر شات الأفكار (العائم) ======
    const ideasFloat = document.getElementById('ideasFloat');
    if (ideasFloat && ideasOverlay) {
        ideasFloat.addEventListener('click', function(e) {
            e.preventDefault();
            ideasOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            console.log('✅ تم فتح شات الأفكار (من الزر العائم)');
        });
    }

    // ====== 6. زر إغلاق شات الأفكار ======
    const ideasClose = document.getElementById('ideasClose');
    if (ideasClose && ideasOverlay) {
        ideasClose.addEventListener('click', function(e) {
            e.preventDefault();
            ideasOverlay.classList.remove('open');
            document.body.style.overflow = '';
            console.log('✅ تم إغلاق شات الأفكار');
        });
    }

    // ====== 7. زر تسجيل الدخول (من القائمة الجانبية) ======
    const authToggle = document.getElementById('authToggle');
    const authOverlay = document.getElementById('authOverlay');

    if (authToggle && authOverlay) {
        authToggle.addEventListener('click', function(e) {
            e.preventDefault();
            authOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            console.log('✅ تم فتح نافذة تسجيل الدخول');
        });
    } else {
        console.warn('⚠️ زر authToggle أو authOverlay غير موجود.');
    }

    // ====== 8. زر إغلاق تسجيل الدخول ======
    const authClose = document.getElementById('authClose');
    if (authClose && authOverlay) {
        authClose.addEventListener('click', function(e) {
            e.preventDefault();
            authOverlay.classList.remove('open');
            document.body.style.overflow = '';
            console.log('✅ تم إغلاق نافذة تسجيل الدخول');
        });
    }

    // ====== 9. إغلاق النوافذ بالضغط على الخلفية ======
    // إغلاق شات NEX
    if (chatOverlay) {
        chatOverlay.addEventListener('click', function(e) {
            if (e.target === chatOverlay) {
                chatOverlay.classList.remove('open');
                document.body.style.overflow = '';
                console.log('✅ تم إغلاق شات NEX (بالضغط على الخلفية)');
            }
        });
    }

    // إغلاق شات الأفكار
    if (ideasOverlay) {
        ideasOverlay.addEventListener('click', function(e) {
            if (e.target === ideasOverlay) {
                ideasOverlay.classList.remove('open');
                document.body.style.overflow = '';
                console.log('✅ تم إغلاق شات الأفكار (بالضغط على الخلفية)');
            }
        });
    }

    // إغلاق تسجيل الدخول
    if (authOverlay) {
        authOverlay.addEventListener('click', function(e) {
            if (e.target === authOverlay) {
                authOverlay.classList.remove('open');
                document.body.style.overflow = '';
                console.log('✅ تم إغلاق تسجيل الدخول (بالضغط على الخلفية)');
            }
        });
    }

    console.log('✅ تم إعداد جميع الأزرار بنجاح!');
});
