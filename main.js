
// 1. تحديد تاريخ عيد ميلادها (29 سبتمبر 2026)
// شهر سبتمبر يمثله الرقم 8 لأن العد يبدأ من 0
const BIRTHDAY_DATE = new Date(2026, 8, 29, 0, 0, 0);

const noBtn = document.getElementById('no-btn');
const bgMusic = document.getElementById('bg-music');
let totalItems = 0;
let clearedItems = 0;
const itemsArray = [];
let countdownInterval;

// 2. منطق دالة هروب زر "لا"
function moveNoButton() {
    const padding = 40;
    const screenWidth = window.innerWidth - noBtn.offsetWidth - padding;
    const screenHeight = window.innerHeight - noBtn.offsetHeight - padding;
    const randomX = Math.floor(Math.random() * screenWidth) + (padding / 2);
    const randomY = Math.floor(Math.random() * screenHeight) + (padding / 2);
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
}
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoButton(); });
noBtn.addEventListener('mouseover', moveNoButton);

// 3. دالة بدء عاصفة الورود وتشغيل الموسيقى عند الضغط على "نعم"
function startFlowerStorm() {
    bgMusic.play().catch(error => {
        console.log("المتصفح حظر التشغيل التلقائي:", error);
    });

    document.getElementById('question-area').style.display = 'none';
    document.getElementById('clean-instruction').style.display = 'block';

    const elementsToSpawn = ['❤️', '🌹', '🌸', '💐', '💖', '🌷'];
    const rows = 12;
    const cols = 8;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const item = document.createElement('div');
            item.classList.add('flower-particle');
            item.innerText = elementsToSpawn[Math.floor(Math.random() * elementsToSpawn.length)];

            const x = (c / cols) * window.innerWidth + (Math.random() * 30);
            const y = (r / rows) * window.innerHeight + (Math.random() * 30);

            item.style.left = x + 'px';
            item.style.top = y + 'px';

            document.body.appendChild(item);
            itemsArray.push(item);
            totalItems++;
        }
    }

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('mousemove', handleMouseMove);
}

// 4. معالجة أحداث المسح وحساب التصادم
function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches;
    checkCollision(touch.clientX, touch.clientY);
}

function handleMouseMove(e) {
    if (totalItems > 0) {
        checkCollision(e.clientX, e.clientY);
    }
}

function checkCollision(x, y) {
    itemsArray.forEach((item) => {
        if (item.style.opacity !== '0') {
            const rect = item.getBoundingClientRect();
            if (x >= rect.left - 25 && x <= rect.right + 25 && y >= rect.top - 25 && y <= rect.bottom + 25) {
                item.style.opacity = '0';
                item.style.transform = 'translate(-50%, -50%) scale(0)';
                clearedItems++;
                checkProgress();
            }
        }
    });
}

// 5. الانتقال للواجهة النهائية
function checkProgress() {
    if (clearedItems / totalItems >= 0.85) {
        itemsArray.forEach(item => item.style.display = 'none');
        document.getElementById('clean-instruction').style.display = 'none';
        document.getElementById('success-area').style.display = 'block';

        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('mousemove', handleMouseMove);
        totalItems = 0;

        // تشغيل العداد التنازلي
        startCountdown();
    }
}

// 6. دالة تشغيل العداد التنازلي (تم إصلاحها بدون علامة $)
function startCountdown() {
    const countdownEl = document.getElementById('birthday-counter');

    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = BIRTHDAY_DATE.getTime() - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownEl.innerHTML = "كل عام وأنتِ بخير يا جميلة! 🎂🎉";
            countdownEl.style.color = "#4caf50";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // تم استبدال الـ `${}` بطريقة الدمج التقليدية لمنع الخطأ تماماً
        countdownEl.innerHTML = days + " يوم و " + hours + " ساعة و " + minutes + " دقيقة و " + seconds + " ثانية";
    }, 1000);
}