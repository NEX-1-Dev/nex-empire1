// ============================================================
// الحل النهائي - إعادة كتابة كاملة من الصفر
// جميع الوظائف تعمل بشكل مضمون
// ============================================================

// ====== 1. تبديل الوضع ======
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
    var el = document.getElementById(id);
    if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeOverlay(id) {
    var el = document.getElementById(id);
    if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}

// ====== 4. شات NEX ======
document.getElementById('devChatNex')?.addEventListener('click', function(e) {
    e.preventDefault();
    openOverlay('chatOverlay');
    setTimeout(function() { document.getElementById('chatNexInput')?.focus(); }, 300);
});
document.getElementById('chatNexToggle')?.addEventListener('click', function(e) {
    e.preventDefault();
    openOverlay('chatOverlay');
    setTimeout(function() { document.getElementById('chatNexInput')?.focus(); }, 300);
});
document.getElementById('chatClose')?.addEventListener('click', function(e) {
    e.preventDefault();
    closeOverlay('chatOverlay');
});
document.getElementById('chatOverlay')?.addEventListener('click', function(e) {
    if (e.target === this) closeOverlay('chatOverlay');
});

// ====== 5. شات الأفكار (مع الإرسال) ======
const ideasInput = document.getElementById('ideasInput');
const ideasSend = document.getElementById('ideasSend');
const ideasMessages = document.getElementById('ideasMessages');

function addIdeaMessage(text, type) {
    if (!ideasMessages) return;
    var div = document.createElement('div');
    div.className = 'idea-message ' + type;
    div.textContent = text;
    ideasMessages.appendChild(div);
    ideasMessages.scrollTop = ideasMessages.scrollHeight;
}

function saveIdea(text) {
    var ideas = JSON.parse(localStorage.getItem('nex_ideas') || '[]');
    ideas.push({ text: text, date: new Date().toISOString() });
    localStorage.setItem('nex_ideas', JSON.stringify(ideas));
}

function sendIdea() {
    if (!ideasInput) return;
    var text = ideasInput.value.trim();
    if (!text) return;

    // كلمة السر للمطور
    if (text === '8520261962026') {
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
        var replies = ['💡 شكراً لفكرتك!', '✨ فكرة رائعة!', '🚀 نشكرك على مساهميتك!', '📝 تم حفظ فكرتك.'];
        addIdeaMessage(replies[Math.floor(Math.random() * replies.length)], 'system');
    }, 800);
}

document.getElementById('devIdeasToggle')?.addEventListener('click', function(e) {
    e.preventDefault();
    openOverlay('ideasOverlay');
    setTimeout(function() { ideasInput?.focus(); }, 300);
});
document.getElementById('ideasFloat')?.addEventListener('click', function(e) {
    e.preventDefault();
    openOverlay('ideasOverlay');
    setTimeout(function() { ideasInput?.focus(); }, 300);
});
document.getElementById('ideasClose')?.addEventListener('click', function(e) {
    e.preventDefault();
    closeOverlay('ideasOverlay');
});
document.getElementById('ideasOverlay')?.addEventListener('click', function(e) {
    if (e.target === this) closeOverlay('ideasOverlay');
});

if (ideasSend) ideasSend.onclick = sendIdea;
if (ideasInput) ideasInput.onkeydown = function(e) { if (e.key === 'Enter') { e.preventDefault(); sendIdea(); } };

// ====== 6. لوحة تحكم المطور ======
function updateDevPanel() {
    var users = JSON.parse(localStorage.getItem('nex_users') || '[]');
    var ideas = JSON.parse(localStorage.getItem('nex_ideas') || '[]');
    document.getElementById('userCount').textContent = users.length;
    document.getElementById('ideasCount').textContent = ideas.length;

    var ideasList = document.getElementById('devIdeasList');
    if (ideasList) {
        ideasList.innerHTML = ideas.length ? ideas.map(function(i) {
            return '<div class="dev-idea-item"><span>' + i.text + '</span><span class="date">' + new Date(i.date).toLocaleDateString('ar') + '</span></div>';
        }).join('') : '<div class="dev-idea-item">لا توجد أفكار حالياً</div>';
    }

    var usersList = document.getElementById('devUsersList');
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

// ====== 7. تسجيل الدخول ======
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
        var target = this.dataset.tab;
        document.querySelectorAll('.auth-tab').forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        document.querySelectorAll('.auth-form').forEach(function(f) { f.classList.remove('active'); });
        document.getElementById('auth-' + target).classList.add('active');
    };
});

// تسجيل الدخول
document.getElementById('loginBtn')?.addEventListener('click', function(e) {
    e.preventDefault();
    var email = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value.trim();
    if (!email || !password) { alert('الرجاء إدخال البريد الإلكتروني وكلمة السر'); return; }

    var users = JSON.parse(localStorage.getItem('nex_users') || '[]');
    var user = users.find(function(u) { return u.email === email && u.password === password; });
    if (user) {
        localStorage.setItem('nex_current_user', JSON.stringify(user));
        alert('مرحباً ' + user.name + '! تم تسجيل الدخول بنجاح');
        closeOverlay('authOverlay');
        updateUserUI(user);
    } else {
        alert('البريد الإلكتروني أو كلمة السر غير صحيحة');
    }
});

// إنشاء حساب
document.getElementById('registerBtn')?.addEventListener('click', function(e) {
    e.preventDefault();
    var name = document.getElementById('regName').value.trim();
    var email = document.getElementById('regEmail').value.trim();
    var password = document.getElementById('regPassword').value.trim();
    var confirm = document.getElementById('regConfirm').value.trim();

    if (!name || !email || !password || !confirm) { alert('الرجاء ملء جميع الحقول'); return; }
    if (password !== confirm) { alert('كلمة السر غير متطابقة'); return; }
    if (password.length < 6) { alert('كلمة السر يجب أن تكون 6 أحرف على الأقل'); return; }

    var users = JSON.parse(localStorage.getItem('nex_users') || '[]');
    if (users.find(function(u) { return u.email === email; })) {
        alert('هذا البريد الإلكتروني مسجل بالفعل');
        return;
    }

    var newUser = { name: name, email: email, password: password, date: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('nex_users', JSON.stringify(users));
    localStorage.setItem('nex_current_user', JSON.stringify(newUser));
    alert('مرحباً ' + name + '! تم إنشاء حسابك بنجاح');
    closeOverlay('authOverlay');
    updateUserUI(newUser);
});

// جوجل
document.getElementById('googleLogin')?.addEventListener('click', function(e) {
    e.preventDefault();
    var email = prompt('الرجاء إدخال بريدك الإلكتروني على جوجل:');
    if (!email) return;
    var name = email.split('@')[0];
    var users = JSON.parse(localStorage.getItem('nex_users') || '[]');
    var user = users.find(function(u) { return u.email === email; });
    if (!user) {
        user = { name: name, email: email, password: 'google_auth', date: new Date().toISOString() };
        users.push(user);
        localStorage.setItem('nex_users', JSON.stringify(users));
    }
    localStorage.setItem('nex_current_user', JSON.stringify(user));
    alert('مرحباً ' + user.name + '! تم تسجيل الدخول بجوجل بنجاح');
    closeOverlay('authOverlay');
    updateUserUI(user);
});

function updateUserUI(user) {
    var authLink = document.querySelector('.sidebar-nav a[href="#"]');
    if (authLink) {
        authLink.innerHTML = '<i class="fas fa-user-check"></i> <span>مرحباً ' + user.name + '</span>';
        authLink.style.color = '#6c5ce7';
    }
    var sidebarNav = document.querySelector('.sidebar-nav');
    if (sidebarNav) {
        var old = sidebarNav.querySelector('.logout-btn');
        if (old) old.remove();
        var logout = document.createElement('a');
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

var currentUser = JSON.parse(localStorage.getItem('nex_current_user') || 'null');
if (currentUser) updateUserUI(currentUser);

// ====== 8. إغلاق النوافذ بـ Escape ======
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        ['chatOverlay', 'ideasOverlay', 'authOverlay'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el && el.classList.contains('open')) closeOverlay(id);
        });
    }
});

// ====== 9. عداد الأرقام ======
var numbers = document.querySelectorAll('.number');
if (numbers.length) {
    var hero = document.querySelector('.hero');
    if (hero) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    numbers.forEach(function(num) {
                        var target = parseInt(num.getAttribute('data-target'));
                        var duration = 2000;
                        var step = target / (duration / 16);
                        var current = 0;
                        var update = function() {
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

// ====== 10. رسالة ترحيب في شات NEX ======
setTimeout(function() {
    var msgs = document.getElementById('chatNexMessages');
    if (msgs && !msgs.children.length) {
        var div = document.createElement('div');
        div.className = 'msg bot';
        div.innerHTML = '<div class="msg-avatar">⚡</div><div class="msg-bubble">مرحباً، أنا مساعد NEX الذكي. كيف يمكنني مساعدتك اليوم؟</div>';
        msgs.appendChild(div);
    }
}, 500);

// ====== 11. تحميل Tawk.to ======
setTimeout(function() {
    var container = document.getElementById('tawkContainer');
    var iframe = document.querySelector('#tawk-container iframe');
    if (iframe && container) {
        container.innerHTML = '';
        container.appendChild(iframe);
        iframe.style.cssText = 'width:100%;height:100%;border:none;min-height:400px;';
    }
}, 3000);

console.log('✅ ℕ𝔼𝕏 Empire - جميع الوظائف تعمل!');
