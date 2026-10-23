// при перезагрузке всегда начинаем сверху
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo({ top: 0, behavior: 'instant' });

const cat = document.getElementById('catAnim');
let timers = [];
let finished = false;

const clearTimers = () => {
    timers.forEach(clearTimeout);
    timers = [];
};

const observer = new IntersectionObserver(([entry]) => {
    if (finished) return;

    if (entry.isIntersecting) {
        timers.push(setTimeout(() => cat.classList.add('is-stand'), 2500));
        timers.push(setTimeout(() => cat.classList.add('is-run'), 5000));
        timers.push(setTimeout(() => {
            cat.classList.add('is-gone');
            finished = true;
            observer.disconnect();
        }, 6200));
    } else {
        // ушёл со страницы до конца анимации: сбрасываем
        clearTimers();
        cat.classList.remove('is-stand', 'is-run', 'is-gone');
    }
}, {
    threshold: 0.8,
    rootMargin: '0px 0px -15% 0px' // кошка должна зайти чуть выше низа экрана
});

observer.observe(cat);

const form = document.querySelector('.forms-block form');
const submitBtn = form.querySelector('button[type="submit"]');

const COLORS = ['#7D634B', '#382521', '#D5B08B', '#E6CBAE', '#614328', '#F0E1D7'];

function burst(x, y) {
    const count = 45;

    for (let i = 0; i < count; i++) {
        const p = document.createElement('span');
        const size = 8 + Math.random() * 10;

        p.className = 'firework-particle';
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
        document.body.appendChild(p);

        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const distance = 120 + Math.random() * 140;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        const anim = p.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1)`, opacity: 1, offset: 0.6 },
            { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 50}px)) scale(0.3)`, opacity: 0 }
        ], {
            duration: 1200 + Math.random() * 500,
            easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)'
        });

        anim.onfinish = () => p.remove();
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault(); // страница не перезагружается и не прыгает

    form.reset();

    // салют из центра кнопки
    const r = submitBtn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;

    burst(x, y);
    setTimeout(() => burst(x - 60, y - 30), 200);
    setTimeout(() => burst(x + 60, y - 30), 350);
});