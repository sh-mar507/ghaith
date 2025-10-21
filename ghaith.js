// بيانات غيث (٨ سنوات)
const ghaith = {
    name: 'غيث',
    avatarUrl: 'images/ghaith-avatar.jpeg', // ضع صورة غيث في مجلد الصور
    items: [
        { key: 'color', label: 'لوني المفضل: أخضر', theme: 'theme-green', span: 'span-3x4', icon: 'fa-palette', image: 'images/green-color.jpg' },
        { key: 'fruit', label: 'فاكھتي المفضلة: بطيخ', theme: 'theme-watermelon', span: 'span-4x3', icon: 'fa-seedling', image: 'images/watermelon.jpg' },
        { key: 'hobby', label: 'ھوايتي: التلوين', theme: 'theme-hobby', span: 'span-5x3', icon: 'fa-paint-brush', image: 'images/coloring.jpg' },
        { key: 'team', label: 'فريقي المفضل: نادي الھلال السعودي', theme: 'theme-team', span: 'span-3x3', icon: 'fa-trophy', image: 'images/al-hilal.jpg' },
        { key: 'game', label: 'لعبيتي: ماينكرافت', theme: 'theme-game', span: 'span-8x5', icon: 'fa-gamepad', image: 'images/minecraft.jpg' },
        { key: 'animal', label: 'حيواني المفضل: الباندا', theme: 'theme-animal', span: 'span-3x4', icon: 'fa-paw', image: 'images/panda.jpg' },
        { key: 'drink', label: 'مشروبي: حليب بالفانيلا', theme: 'theme-drink', span: 'span-6x4', icon: 'fa-mug-hot', image: 'images/vanilla-milk.jpg' },
        { key: 'subject', label: 'مادتي المفضلة: الرياضيات', theme: 'theme-subject', span: 'span-4x3', icon: 'fa-square-root-variable', image: 'images/math.jpg' },
        { key: 'character', label: 'شخصيتي: سبايدرمان', theme: 'theme-character', span: 'span-3x3', icon: 'fa-star', image: 'images/spiderman.jpg' },
    ]
};

// Wish Star functionality
let wishes = JSON.parse(localStorage.getItem('ghaithWishes') || '[]');
let wishStars = [];

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    setupAvatar();
    renderCards();
    setupScrollMotion();
    setupWishStar();
    renderWishStars();
});

function setupAvatar() {
    const img = document.getElementById('ghaithAvatar');
    const fallback = document.querySelector('.avatar-fallback');
    if (ghaith.avatarUrl) {
        img.src = ghaith.avatarUrl;
        img.onload = () => { fallback.style.display = 'none'; };
        img.onerror = () => { fallback.style.display = 'grid'; };
    } else {
        // لا توجد صورة، نظهر الحرف الأول
        fallback.style.display = 'grid';
    }
}

function renderCards() {
    const wrap = document.getElementById('cards');
    wrap.innerHTML = '';
    ghaith.items.forEach((it, idx) => {
        const card = document.createElement('figure');
        card.className = `card ${it.span} ${it.theme}`;
        card.style.animationDelay = `${(idx % 6) * 0.15}s`;

        const img = document.createElement('img');
        img.className = 'img';
        img.src = it.image;
        img.alt = it.label;

        const fig = document.createElement('figcaption');
        fig.className = 'label';
        fig.innerHTML = `<i class="fa-solid ${it.icon}"></i>${it.label}`;

        card.appendChild(img);
        card.appendChild(fig);
        wrap.appendChild(card);
    });
}

// حركة التمرير اللطيفة (بارالاكس خفيف)
function setupScrollMotion() {
    const cards = Array.from(document.querySelectorAll('.card'));
    const center = document.getElementById('centerCard');
    const strength = 0.12;

    const onScroll = () => {
        const y = window.scrollY || window.pageYOffset;
        cards.forEach((card, i) => {
            const dir = i % 2 === 0 ? 1 : -1;
            card.style.transform = `translateY(${(y * strength * dir).toFixed(1)}px)`;
        });
        center.style.transform = `translateY(${(y * 0.06).toFixed(1)}px)`;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

// Wish Star functionality
function setupWishStar() {
    const wishStar = document.getElementById('wishStar');
    const wishModal = document.getElementById('wishModal');
    const wishClose = document.getElementById('wishClose');
    const wishSave = document.getElementById('wishSave');
    const wishText = document.getElementById('wishText');

    wishStar.addEventListener('click', () => {
        wishModal.classList.add('show');
        wishText.focus();
    });

    wishClose.addEventListener('click', () => {
        wishModal.classList.remove('show');
        wishText.value = '';
    });

    wishSave.addEventListener('click', () => {
        const wish = wishText.value.trim();
        if (wish) {
            addWish(wish);
            wishModal.classList.remove('show');
            wishText.value = '';
        }
    });

    // Close modal when clicking outside
    wishModal.addEventListener('click', (e) => {
        if (e.target === wishModal) {
            wishModal.classList.remove('show');
            wishText.value = '';
        }
    });
}

function addWish(wishText) {
    const wish = {
        id: Date.now(),
        text: wishText,
        date: new Date().toLocaleDateString('ar-SA')
    };
    
    wishes.push(wish);
    localStorage.setItem('ghaithWishes', JSON.stringify(wishes));
    renderWishStars();
}

function renderWishStars() {
    // Remove existing small stars
    wishStars.forEach(star => star.remove());
    wishStars = [];

    // Create small stars for each wish that fly around the main star
    wishes.forEach((wish, index) => {
        const star = document.createElement('div');
        star.className = 'wish-star-small';
        star.dataset.wishId = wish.id;
        
        // Position stars at the center of the main star (they will fly around it)
        const mainStar = document.getElementById('wishStar');
        const mainStarRect = mainStar.getBoundingClientRect();
        const centerX = mainStarRect.left + mainStarRect.width / 2;
        const centerY = mainStarRect.top + mainStarRect.height / 2;
        
        // Position at the center - animation will make them fly around
        star.style.left = `${centerX}px`;
        star.style.top = `${centerY}px`;
        star.style.transform = `translate(-50%, -50%)`;
        
        // Add different animation delays for variety - slower
        star.style.animationDelay = `${index * 2}s`;
        
        // Add hover effect to show wish
        star.addEventListener('mouseenter', (e) => {
            showWishTooltip(e, wish.text);
        });
        
        star.addEventListener('mouseleave', () => {
            hideWishTooltip();
        });
        
        document.body.appendChild(star);
        wishStars.push(star);
    });
}

function showWishTooltip(event, wishText) {
    const tooltip = document.getElementById('wishTooltip');
    tooltip.textContent = wishText;
    tooltip.style.left = event.pageX + 10 + 'px';
    tooltip.style.top = event.pageY - 30 + 'px';
    tooltip.classList.add('show');
}

function hideWishTooltip() {
    const tooltip = document.getElementById('wishTooltip');
    tooltip.classList.remove('show');
}


