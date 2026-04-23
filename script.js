// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');

const urlParams = new URLSearchParams(window.location.search);
const isMenuOnlyView =
    urlParams.get('view') === 'menu' ||
    urlParams.get('menu') === '1' ||
    urlParams.get('menu') === 'true';
if (isMenuOnlyView) {
    document.body.classList.add('menu-only');

    // In menu-only mode, make nav links open the full site view.
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href') || '';
        if (!href.startsWith('#')) return;
        link.setAttribute('href', `index.html${href}`);
    });

    // Auto-jump to menu (account for fixed header)
    const menuSection = document.getElementById('menu');
    if (menuSection) {
        setTimeout(() => {
            const headerOffset = 70;
            const top = menuSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top, behavior: 'auto' });
        }, 0);
    }
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;

    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    const isDark = theme === 'dark';

    if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

function getInitialTheme() {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

applyTheme(getInitialTheme());

themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
});

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const expanded = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        hamburger.setAttribute('aria-label', expanded ? 'Close menu' : 'Open menu');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active') 
            ? 'rotate(45deg) translate(5px, 5px)' 
            : 'none';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active') 
            ? 'rotate(-45deg) translate(7px, -6px)' 
            : 'none';
    });
}

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (!hamburger || !navMenu) return;
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = document.getElementById('header')?.offsetHeight || 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

const reducedMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
function prefersReducedMotion() {
    return !!(reducedMotionQuery && reducedMotionQuery.matches);
}

// Sticky Header on Scroll
const header = document.getElementById('header');

function updateHeaderState() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 100);
}

window.addEventListener('scroll', updateHeaderState);
updateHeaderState();

// Active navigation link highlighting
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const pageSections = Array.from(document.querySelectorAll('section[id]'));
let navRafPending = false;

function updateActiveNavLink() {
    if (!navLinks.length || !pageSections.length) return;

    const headerOffset = document.getElementById('header')?.offsetHeight || 70;
    const fromTop = window.scrollY + headerOffset + 12;

    let activeSectionId = pageSections[0].id;
    pageSections.forEach(section => {
        if (section.offsetTop <= fromTop) activeSectionId = section.id;
    });

    navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const isActive = href === `#${activeSectionId}`;
        link.classList.toggle('active', isActive);
    });
}

window.addEventListener('scroll', () => {
    if (navRafPending) return;
    navRafPending = true;
    requestAnimationFrame(() => {
        updateActiveNavLink();
        navRafPending = false;
    });
});
updateActiveNavLink();

// Build visual menu cards from full structured list
const categoryKeyMap = {
    'Soups': 'soups',
    'Chinese (Fried Rice)': 'fried-rice',
    'Noodles': 'noodles',
    'Seafood': 'seafood',
    'Biryanis': 'biryani',
    'Rotis': 'rotis',
    'Bagara Rice': 'bagara',
    'Combo Packs': 'combos',
    'Snacks & Fast Food': 'snacks',
    'Drinks': 'drinks'
};

const categoryImageMap = {
    'soups': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=900',
    'fried-rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=900',
    'noodles': 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=900',
    'seafood': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=900',
    'rotis': 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=900',
    'bagara': 'https://images.unsplash.com/photo-1596797038530-2c107aa3c1b3?w=900',
    'combos': 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=900',
    'snacks': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=900',
    'drinks': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=900'
};

// Exact image lock for priority items so visuals remain stable.
const exactItemImageMap = {
'veg sweet corn soup': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=900&fit=crop',
'veg hot & sour soup': 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=900&fit=crop',
'lemon coriander soup': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=900&fit=crop',
'veg clear soup': 'https://images.unsplash.com/photo-1576577445504-6af96477db52?w=900&fit=crop',
'veg manchow soup': 'https://images.unsplash.com/photo-1617622141573-0a5d0c4aed33?w=900&fit=crop',
'veg mushroom soup': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=900&fit=crop',
'cream of tomato soup': 'https://images.unsplash.com/photo-1621510456681-2330135e5871?w=900&fit=crop',
'chicken hot & sour soup': 'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=900&fit=crop',
'chicken manchow soup': 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=900&fit=crop',
'chicken clear soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=900&fit=crop',
'chicken corn soup': 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=900&fit=crop',

    'veg fried rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900',
    'jeera rice': 'https://images.unsplash.com/photo-1596797038530-2c107aa3c1b3?w=900',
    'veg schezwan fried rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=900',
    'veg manchurian fried rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=900',
    'kaaju fried rice': 'https://images.unsplash.com/photo-1596797038530-2c107aa3c1b3?w=900',
    'paneer fried rice': 'https://images.unsplash.com/photo-1596797038530-2c107aa3c1b3?w=900',
    'mushroom fried rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=900',
    'babycorn fried rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=900',
    'mixed veg fried rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=900',
    'egg fried rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=900',
    'chicken fried rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=900',
    'schezwan chicken fried rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=900',
    'mixed non-veg fried rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=900',

    'veg noodles': 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=900',
    'veg manchurian noodles': 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=900',
    'veg schezwan noodles': 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=900',
    'mushroom noodles': 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=900',
    'paneer noodles': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=900',
    'egg noodles': 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=900',
    'egg schezwan noodles': 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=900',
    'chicken noodles': 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=900',
    'chicken schezwan noodles': 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=900',

    'apollo fish': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=900',
    'schezwan fish': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=900',
    'ginger fish': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=900',
    'thai fish': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=900',
    'fish finger': 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=900',
    'chilli prawns': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=900',
    'loose prawns': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=900',
    'prawns salt & pepper': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=900',

    'veg biryani': 'https://images.unsplash.com/photo-1701579231378-3722117092b0?w=900',
    'paneer biryani': 'https://images.unsplash.com/photo-1701579231378-3722117092b0?w=900',
    'kaju biryani': 'https://images.unsplash.com/photo-1701579231378-3722117092b0?w=900',
    'mushroom biryani': 'https://images.unsplash.com/photo-1701579231378-3722117092b0?w=900',
    'mixed veg biryani': 'https://images.unsplash.com/photo-1701579231378-3722117092b0?w=900',
    'egg biryani': 'https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?w=900',
    'chicken dum biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900',
    'special chicken biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900',
    'chicken fry piece biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900',
    'chicken 65 biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900',
    'gongura chicken biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900',
    'chicken lollipop biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900',
    'mughlai chicken biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900',
    'mutton dum biryani': 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=900',
    'special mutton biryani': 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=900',
    'mutton fry piece biryani': 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=900',
    'gongura mutton biryani': 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=900',
    'mutton keema biryani': 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=900',
    'prawns biryani': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=900',
    'fish biryani': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=900',
    'hyderabadi special mixed non-veg biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900',

    'chapathi': 'https://images.unsplash.com/photo-1601050690117-94f5f6fa45d7?w=900',
    'rumali roti': 'https://images.unsplash.com/photo-1601050690117-94f5f6fa45d7?w=900',
    'butter roti': 'https://images.unsplash.com/photo-1601050690117-94f5f6fa45d7?w=900',
    'butter naan': 'https://images.unsplash.com/photo-1541518763669-27fef9f4cafa?w=900',
    'garlic naan': 'https://images.unsplash.com/photo-1541518763669-27fef9f4cafa?w=900',
    'cheese naan': 'https://images.unsplash.com/photo-1541518763669-27fef9f4cafa?w=900',

    'bagara rice + chicken curry + dalcha': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900',
    'bagara rice + mutton curry + dalcha': 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=900',
    'chicken fry piece bagara': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900',
    'special chicken bagara': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900',

    'plain': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900',
    'salt': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900',
    'masala (peri peri)': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900',
    'veg maggi': 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=900',
    'chicken maggi': 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=900',
    'veg burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900',
    'chicken burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900',
    'veg momos': 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5f?w=900',
    'paneer momos': 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5f?w=900',
    'chicken momos': 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5f?w=900',
    'chicken peri peri momos': 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5f?w=900',
    'paneer cheese momos': 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5f?w=900',
    'veg plain sandwich': 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=900',
    'veg grilled sandwich': 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=900',
    'veg cheese sandwich': 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=900',
    'omelet sandwich': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=900',
    'veg nuggets': 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?w=900',
    'onion rings': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900',
    'potato wedges': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900',
    'aloo tikki': 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=900',
    'bread omelet': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=900',
    'fluffer omelet': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=900',
    'potato tornado': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900',
    'veg spring roll (6 pcs)': 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=900',
    'chicken nuggets': 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?w=900',
    'chicken crispy popcorn (10 pcs)': 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?w=900',
    'crispy chicken fries': 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?w=900',
    'chicken chilli garlic': 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?w=900',
    'fried chicken': 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?w=900',
    'chicken wings (3 pcs)': 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?w=900',
    'chicken breast strip (3 pcs)': 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?w=900',
    'chicken spring roll': 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=900',

    'veg biryani': 'https://images.unsplash.com/photo-1701579231378-3722117092b0?w=900',
    'chicken biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900',
    'mutton biryani': 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=900',

    'blue mojito': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=900',
    'rose': 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=900',
    'mint lemon': 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=900',
    'orange': 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=900',
    'strawberry': 'https://images.unsplash.com/photo-1464306076886-da185f6a9d05?w=900',
    'pineapple mojito': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=900',
    'green apple mojito': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=900',
    'oreo': 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=900',
    'chocolate': 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=900',
    'vanilla': 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=900',
    'luche': 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=900',
    'green apple': 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=900',
    'kiwi': 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=900',
    'banana': 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=900',
    'black current': 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=900',
    'cold coffee': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=900',
    'kitkat': 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=900',
    'custard apple': 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=900',
    'plain lassi': 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=900',
    'mango lassi': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=900',
    'sweet lassi': 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=900',
    'pineapple lassi': 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=900',
    'banana lassi': 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=900',
    'masala lassi': 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=900',
    'kaju lassi': 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=900'
};

// User-provided source image URLs (highest priority).
const sourceImageOverrides = {
'veg sweet corn soup': 'https://tse1.mm.bing.net/th/id/OIP.kYC6Vtm2GZLikTOnwwV7yAHaE7?rs=1&pid=ImgDetMain&o=7&rm=3',
'veg hot & sour soup': 'https://www.cookwithmanali.com/wp-content/uploads/2024/01/Hot-and-Sour-Soup-Vegetarian.jpg',
    'lemon coriander soup': 'https://www.indianveggiedelight.com/wp-content/uploads/2021/01/lemon-coriander-soup.jpg',
    'veg clear soup': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/08/veg-clear-soup.jpg',
    'veg manchow soup': 'https://www.vegrecipesofindia.com/wp-content/uploads/2020/11/manchow-soup.jpg',
    'veg mushroom soup': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/09/mushroom-soup.jpg',
    'cream of tomato soup': 'https://www.simplystacie.net/wp-content/uploads/2023/02/Cream-of-Tomato-Soup-1.jpg',
    'chicken hot & sour soup': 'https://www.recipesrsimple.com/wp-content/uploads/2014/04/Chicken-Hot-Sour-Soup.jpg',
    'chicken manchow soup': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/10/chicken-manchow-soup.jpg',
    'chicken clear soup': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/08/chicken-clear-soup.jpg',
    'chicken corn soup': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/chicken-corn-soup.jpg',

    'veg fried rice': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/veg-fried-rice.jpg',
    'jeera rice': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2020/09/jeera-rice-recipe.jpg',
    'veg schezwan fried rice': 'https://www.cookingcarnival.com/wp-content/uploads/2020/03/Schezwan-Fried-Rice.jpg',
    'paneer fried rice': 'https://www.cookingfromheart.com/wp-content/uploads/2019/03/Paneer-Fried-Rice-3.jpg',
    'mushroom fried rice': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/09/mushroom-fried-rice.jpg',
    'mixed veg fried rice': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/veg-fried-rice.jpg',
    'egg fried rice': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/egg-fried-rice.jpg',
    'chicken fried rice': 'https://www.recipesrsimple.com/wp-content/uploads/2014/09/Indo-Chinese-Chicken-Fried-Rice.jpg',
    'schezwan chicken fried rice': 'https://www.indianambrosia.com/wp-content/uploads/2019/05/Schezwan-Chicken-Fried-Rice.jpg',

    'veg noodles': 'https://www.easyindiancookbook.com/wp-content/uploads/2021/06/veg-hakka-noodles.jpg',
    'veg schezwan noodles': 'https://www.cookingcarnival.com/wp-content/uploads/2020/04/Schezwan-Noodles.jpg',
    'mushroom noodles': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/09/mushroom-noodles.jpg',
    'paneer noodles': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/09/paneer-noodles.jpg',
    'egg noodles': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/egg-noodles.jpg',
    'chicken noodles': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/chicken-noodles.jpg',
    'chicken schezwan noodles': 'https://www.theindianclaypot.com/wp-content/uploads/2021/08/Chicken-Schezwan-Noodles.jpg',

    'apollo fish': 'https://www.archanaskitchen.com/images/archanaskitchen/1-Author/Subashini/Apollo_Fish_Recipe_1.jpg',
    'schezwan fish': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/10/schezwan-fish.jpg',
    'fish finger': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/09/fish-fingers.jpg',
    'chilli prawns': 'https://www.swesthi.com/wp-content/uploads/2021/08/Chilli-Prawns.jpg',
    'prawns salt & pepper': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/09/salt-pepper-prawns.jpg',

    'veg biryani': 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/05/veg-biryani.jpg',
    'paneer biryani': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/paneer-biryani.jpg',
    'mushroom biryani': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/08/mushroom-biryani.jpg',
    'chicken dum biryani': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/08/chicken-dum-biryani.jpg',
    'chicken 65 biryani': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/09/chicken-65-biryani.jpg',
    'mutton dum biryani': 'https://www.tajsfoodfiesta.com/wp-content/uploads/2021/01/mutton-dum-biryani.jpg',
    'prawns biryani': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/09/prawns-biryani.jpg',
    'fish biryani': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/09/fish-biryani.jpg',

    'chapathi': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2020/09/chapati-recipe.jpg',
    'rumali roti': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/05/rumali-roti.jpg',
    'butter naan': 'https://www.cafedelites.com/wp-content/uploads/2019/01/Garlic-Naan-Bread-IMAGE-18.jpg',
    'garlic naan': 'https://www.cafedelites.com/wp-content/uploads/2019/01/Garlic-Naan-Bread-IMAGE-20.jpg',
    'cheese naan': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/06/cheese-naan.jpg',

    'bagara rice': 'https://www.whiskaffair.com/wp-content/uploads/2021/03/bagara-rice.jpg',
    'bagara rice + chicken curry + dalcha': 'https://www.yummyindiankitchen.com/wp-content/uploads/2019/10/bagara-rice.jpg',

    'masala (peri peri)': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/09/masala-fries.jpg',
    'veg burger': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/veg-burger.jpg',
    'chicken burger': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/09/chicken-burger.jpg',
    'veg momos': 'https://www.archanaskitchen.com/images/archanaskitchen/1-Author/Nithya_Anantham/Veg_momos.jpg',
    'chicken momos': 'https://www.archanaskitchen.com/images/archanaskitchen/1-Author/Subashini/Chicken_Momos_1.jpg',
    'veg spring roll (6 pcs)': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/08/veg-spring-roll.jpg',
    'chicken wings (3 pcs)': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/10/chicken-wings.jpg',
    'onion rings': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/08/onion-rings.jpg',
    'aloo tikki': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/05/aloo-tikki.jpg',
    'potato wedges': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/08/potato-wedges.jpg',
    'veg maggi': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/05/maggi-recipe.jpg',

    'blue mojito': 'https://i.pinimg.com/originals/3b/1a/0c/3b1a0c3e5e2a9f1b7e6d4c2f8a0b5e1d.jpg',
    'strawberry': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/strawberry-milkshake.jpg',
    'oreo': 'https://tastesbetterfromscratch.com/wp-content/uploads/2020/07/Oreo-Milkshake-2.jpg',
    'chocolate': 'https://www.themom100.com/wp-content/uploads/2020/07/thick-chocolate-oreo-milkshake.jpg',
    'mango lassi': 'https://www.swasthi.com/wp-content/uploads/2021/05/mango-lassi-recipe.jpg',
    'plain lassi': 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/lassi-recipe.jpg'
};

function normalizeItemKey(itemName) {
    return itemName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\band\b/g, '&');
}

function getExactItemImage(itemName) {
    const key = normalizeItemKey(itemName);
    return sourceImageOverrides[key] || exactItemImageMap[key];
}

function hashToSig(input) {
    // Deterministic small hash -> [1..1000] for stable Unsplash "sig".
    let hash = 2166136261;
    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return (Math.abs(hash) % 1000) + 1;
}

function getItemQueryImage(itemName, categoryKey, meta = '') {
    const seed = `${normalizeItemKey(itemName)}|${categoryKey}|${normalizeItemKey(meta)}`;
    const sig = hashToSig(seed);
    const query = encodeURIComponent(`${itemName} ${meta} ${categoryKey} food dish`);
    // Note: source.unsplash.com is a redirect endpoint; "sig" helps keep results stable per item.
    return `https://source.unsplash.com/900x600/?${query}&sig=${sig}`;
}

function matchKeywordImage(itemName, rules, fallback) {
    const name = itemName.toLowerCase();
    for (const rule of rules) {
        if (rule.keys.some(key => name.includes(key))) {
            return rule.url;
        }
    }
    return fallback;
}

function getBiryaniImage(itemName) {
    return matchKeywordImage(
        itemName,
        [
            { keys: ['mutton'], url: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=900' },
            { keys: ['egg'], url: 'https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?w=900' },
            { keys: ['prawns'], url: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=900' },
            { keys: ['fish'], url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=900' },
            { keys: ['veg', 'paneer', 'kaju', 'mushroom'], url: 'https://images.unsplash.com/photo-1701579231378-3722117092b0?w=900' }
        ],
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900'
    );
}

function getSoupImage(itemName) {
    return matchKeywordImage(
        itemName,
        [
            { keys: ['tomato'], url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=900' },
            { keys: ['corn'], url: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=900' },
            { keys: ['hot', 'sour', 'manchow'], url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=900' },
            { keys: ['mushroom'], url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=900' },
            { keys: ['clear', 'coriander'], url: 'https://images.unsplash.com/photo-1608500218803-ef0f4f6f1c2e?w=900' }
        ],
        categoryImageMap.soups
    );
}

function getFriedRiceImage(itemName) {
    return matchKeywordImage(
        itemName,
        [
            { keys: ['jeera'], url: 'https://images.unsplash.com/photo-1596797038530-2c107aa3c1b3?w=900' },
            { keys: ['paneer'], url: 'https://images.unsplash.com/photo-1596797038530-2c107aa3c1b3?w=900' },
            { keys: ['mushroom'], url: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=900' },
            { keys: ['egg'], url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=900' },
            { keys: ['chicken'], url: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=900' }
        ],
        categoryImageMap['fried-rice']
    );
}

function getNoodlesImage(itemName) {
    return matchKeywordImage(
        itemName,
        [
            { keys: ['egg'], url: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=900' },
            { keys: ['chicken'], url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=900' },
            { keys: ['paneer'], url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=900' },
            { keys: ['schezwan', 'manchurian'], url: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=900' }
        ],
        categoryImageMap.noodles
    );
}

function getSeafoodImage(itemName) {
    return matchKeywordImage(
        itemName,
        [
            { keys: ['prawns'], url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=900' },
            { keys: ['fish finger'], url: 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=900' },
            { keys: ['fish'], url: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=900' }
        ],
        categoryImageMap.seafood
    );
}

function getSnacksImage(itemName) {
    return matchKeywordImage(
        itemName,
        [
            { keys: ['burger'], url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900' },
            { keys: ['momos'], url: 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5f?w=900' },
            { keys: ['sandwich'], url: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=900' },
            { keys: ['fries', 'wedges', 'rings', 'tornado'], url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900' },
            { keys: ['maggi', 'noodles'], url: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=900' },
            { keys: ['omelet'], url: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=900' },
            { keys: ['nuggets', 'chicken', 'wings', 'strip', 'popcorn'], url: 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?w=900' },
            { keys: ['spring roll'], url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=900' }
        ],
        categoryImageMap.snacks
    );
}

function getDrinksImage(itemName) {
    return matchKeywordImage(
        itemName,
        [
            { keys: ['lassi'], url: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=900' },
            { keys: ['cold coffee', 'coffee'], url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=900' },
            { keys: ['mocktail', 'mojito'], url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=900' },
            { keys: ['milkshake', 'shake', 'oreo', 'kitkat'], url: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=900' },
            { keys: ['orange', 'pineapple', 'strawberry', 'banana', 'kiwi', 'apple', 'rose'], url: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=900' }
        ],
        categoryImageMap.drinks
    );
}

function getRotiImage(itemName) {
    return matchKeywordImage(
        itemName,
        [
            { keys: ['rumali'], url: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa45d7?w=900' },
            { keys: ['naan', 'garlic', 'cheese'], url: 'https://images.unsplash.com/photo-1541518763669-27fef9f4cafa?w=900' }
        ],
        categoryImageMap.rotis
    );
}

function getBagaraImage(itemName) {
    return matchKeywordImage(
        itemName,
        [
            { keys: ['mutton'], url: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=900' },
            { keys: ['chicken'], url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900' }
        ],
        categoryImageMap.bagara
    );
}

function getComboImage(itemName) {
    return matchKeywordImage(
        itemName,
        [
            { keys: ['mutton'], url: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=900' },
            { keys: ['chicken'], url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900' },
            { keys: ['veg'], url: 'https://images.unsplash.com/photo-1701579231378-3722117092b0?w=900' }
        ],
        categoryImageMap.combos
    );
}

function getCardImage(categoryKey, itemName, meta, usedImageUrls) {
    const exactMatch = getExactItemImage(itemName);
    let chosen = exactMatch || '';

    if (!chosen) {
        if (categoryKey === 'biryani') chosen = getBiryaniImage(itemName);
        else if (categoryKey === 'soups') chosen = getSoupImage(itemName);
        else if (categoryKey === 'fried-rice') chosen = getFriedRiceImage(itemName);
        else if (categoryKey === 'noodles') chosen = getNoodlesImage(itemName);
        else if (categoryKey === 'seafood') chosen = getSeafoodImage(itemName);
        else if (categoryKey === 'snacks') chosen = getSnacksImage(itemName);
        else if (categoryKey === 'drinks') chosen = getDrinksImage(itemName);
        else if (categoryKey === 'rotis') chosen = getRotiImage(itemName);
        else if (categoryKey === 'bagara') chosen = getBagaraImage(itemName);
        else if (categoryKey === 'combos') chosen = getComboImage(itemName);
        else chosen = categoryImageMap[categoryKey] || 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=900';
    }

    // Enforce distinct image URL per item card.
    if (usedImageUrls && usedImageUrls.has(chosen)) {
        chosen = getItemQueryImage(itemName, categoryKey, meta);
    }
    if (usedImageUrls) {
        usedImageUrls.add(chosen);
    }

    return chosen;
}

function createMenuCard({ name, price, category, meta }, usedImageUrls) {
    const card = document.createElement('div');
    card.className = 'menu-item';
    card.dataset.category = category;

    const imageUrl = getCardImage(category, name, meta, usedImageUrls);
    card.innerHTML = `
        <div class="menu-item-image">
            <img src="${imageUrl}" alt="${name}" loading="lazy" decoding="async">
        </div>
        <div class="menu-item-content">
            <h3>${name}</h3>
            <p>${meta}</p>
            <div class="menu-item-footer">
                <span class="price">${price}</span>
            </div>
        </div>
    `;
    return card;
}

function renderMenuCardsFromStructuredList() {
    const fullMenuList = document.getElementById('fullMenuList');
    const menuGrid = document.getElementById('menuGrid');
    if (!fullMenuList || !menuGrid) return;

    const cardItems = [];
    const groups = fullMenuList.querySelectorAll('.menu-group');

    groups.forEach(group => {
        const groupName = group.querySelector('summary')?.textContent.trim() || 'Menu';
        const categoryKey = categoryKeyMap[groupName] || 'all';

        group.querySelectorAll('li').forEach(li => {
            const spans = li.querySelectorAll('span');
            if (spans.length < 2) return;

            const itemName = spans[0].textContent.trim();
            const itemPrice = spans[1].textContent.trim();
            const subgroup = li.closest('.menu-subgroup')?.querySelector('h4')?.textContent.trim() || groupName;

            cardItems.push({
                name: itemName,
                price: itemPrice,
                category: categoryKey,
                meta: subgroup
            });
        });

        group.querySelectorAll('tbody tr').forEach(row => {
            const cols = row.querySelectorAll('td');
            if (cols.length < 3) return;

            cardItems.push({
                name: cols[0].textContent.trim(),
                price: `Family ${cols[1].textContent.trim()} | Jumbo ${cols[2].textContent.trim()}`,
                category: categoryKey,
                meta: groupName
            });
        });
    });

    const fragment = document.createDocumentFragment();
    const usedImageUrls = new Set();
    cardItems.forEach(item => {
        fragment.appendChild(createMenuCard(item, usedImageUrls));
    });

    menuGrid.innerHTML = '';
    menuGrid.appendChild(fragment);

    // Fallback safety: if parsing fails, show a visible hint instead of blank space.
    if (!menuGrid.children.length) {
        menuGrid.innerHTML = '<div class="menu-load-fallback">Menu items are loading. Please refresh once.</div>';
    }
}

const hideTimeoutByCard = new WeakMap();
const showRafByCard = new WeakMap();

function setCardVisibility(card, visible, animate) {
    const shouldAnimate = animate && !prefersReducedMotion();

    const hideTimeout = hideTimeoutByCard.get(card);
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeoutByCard.delete(card);

    const showRaf = showRafByCard.get(card);
    if (showRaf) cancelAnimationFrame(showRaf);
    showRafByCard.delete(card);

    if (visible) {
        card.style.display = 'block';
        if (!shouldAnimate) {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            return;
        }

        // Ensure a consistent "show" state even after search-only filtering.
        card.style.opacity = '0';
        card.style.transform = 'scale(0.98)';
        const raf = requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        });
        showRafByCard.set(card, raf);
        return;
    }

    if (!shouldAnimate) {
        card.style.display = 'none';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.98)';
        return;
    }

    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    hideTimeoutByCard.set(card, setTimeout(() => {
        card.style.display = 'none';
    }, 260));
}

function getActiveFilterKey() {
    return document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
}

function updateMenuCards({ animate = true } = {}) {
    const query = (menuSearchInput?.value || '').trim().toLowerCase();
    const filter = getActiveFilterKey();
    const shouldAnimate = animate && query === '';
    let visibleCount = 0;

    document.querySelectorAll('#menuGrid .menu-item').forEach(card => {
        const haystack = card.dataset.searchText || (card.dataset.searchText = card.textContent.toLowerCase());
        const matchesText = query === '' || haystack.includes(query);
        const matchesFilter = filter === 'all' || card.dataset.category === filter;
        const shouldShow = matchesText && matchesFilter;
        if (shouldShow) visibleCount += 1;
        setCardVisibility(card, shouldShow, shouldAnimate);
    });

    return { visibleCount, query, filter };
}

renderMenuCardsFromStructuredList();

// Full price list toggle
const fullMenuList = document.getElementById('fullMenuList');
const fullListToggleBtn = document.getElementById('fullListToggleBtn');
const menuSearchInput = document.getElementById('menuSearch');
const menuSearchEmpty = document.getElementById('menuSearchEmpty');
const menuSearchDock = document.getElementById('menuSearchDock');
const menuSearchToggle = menuSearchDock?.querySelector('.menu-search-toggle');
const menuSearchClear = menuSearchDock?.querySelector('.menu-search-clear');
const menuSearchCount = document.getElementById('menuSearchCount');
const menuQueryParam = (new URLSearchParams(window.location.search)).get('q') || '';

function debounce(fn, delay = 70) {
    let timeoutId = null;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

function setSearchDockOpen(open) {
    if (!menuSearchDock) return;
    const shouldOpen = !!open;
    const wasOpen = menuSearchDock.classList.contains('is-open');
    menuSearchDock.classList.toggle('is-open', shouldOpen);

    if (shouldOpen && !wasOpen) {
        menuSearchDock.classList.add('just-opened');
        setTimeout(() => menuSearchDock.classList.remove('just-opened'), 360);
    }
}

function syncSearchDockValueState() {
    if (!menuSearchDock || !menuSearchInput) return;
    const hasValue = menuSearchInput.value.trim() !== '';
    menuSearchDock.classList.toggle('has-value', hasValue);
    if (hasValue) setSearchDockOpen(true);
}

function setSearchCount(count, query) {
    if (!menuSearchCount) return;
    if (!query) {
        menuSearchCount.textContent = '';
        return;
    }
    menuSearchCount.textContent = String(count);
}

function setFullListExpanded(expanded) {
    if (!fullMenuList || !fullListToggleBtn) return;
    fullMenuList.hidden = !expanded;
    fullMenuList.classList.toggle('is-collapsed', !expanded);
    fullListToggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    fullListToggleBtn.textContent = expanded ? 'Hide Full Price List' : 'View Full Price List';
}

if (fullMenuList && fullListToggleBtn) {
    setFullListExpanded(true);
    fullListToggleBtn.addEventListener('click', () => {
        const currentlyExpanded = fullListToggleBtn.getAttribute('aria-expanded') === 'true';
        setFullListExpanded(!currentlyExpanded);
    });
}

if (menuSearchInput) {
    syncSearchDockValueState();

    if (menuQueryParam) {
        menuSearchInput.value = menuQueryParam;
        syncSearchDockValueState();
        setSearchDockOpen(true);
        setTimeout(() => menuSearchInput.dispatchEvent(new Event('input')), 0);
    }

    // In QR menu-only mode, focus search for fast lookup.
    if (document.body.classList.contains('menu-only')) {
        setSearchDockOpen(true);
        setTimeout(() => menuSearchInput.focus(), 50);
    }

    menuSearchToggle?.addEventListener('click', () => {
        setSearchDockOpen(true);
        menuSearchInput.focus();
    });

    // Make the whole pill feel like one control (cleaner "shape flow").
    menuSearchDock?.addEventListener('click', (e) => {
        if (!menuSearchDock || !menuSearchInput) return;
        const target = e.target;
        if (target instanceof Element) {
            if (target.closest('.menu-search-clear')) return;
            if (target.closest('input')) return;
        }
        setSearchDockOpen(true);
        menuSearchInput.focus();
    });

    menuSearchClear?.addEventListener('click', () => {
        menuSearchInput.value = '';
        syncSearchDockValueState();
        menuSearchInput.dispatchEvent(new Event('input'));
        menuSearchInput.focus();
    });

    menuSearchInput.addEventListener('focus', () => setSearchDockOpen(true));
    menuSearchInput.addEventListener('blur', () => {
        // Delay so clicking clear/toggle doesn't instantly close the dock.
        setTimeout(() => {
            if (!menuSearchDock || !menuSearchInput) return;
            if (menuSearchDock.contains(document.activeElement)) return;
            if (menuSearchInput.value.trim() !== '') return;
            setSearchDockOpen(false);
        }, 120);
    });

    document.addEventListener('keydown', (e) => {
        if (!menuSearchInput) return;
        if (e.key !== '/') return;
        const tag = document.activeElement?.tagName?.toLowerCase() || '';
        if (tag === 'input' || tag === 'textarea') return;
        e.preventDefault();
        setSearchDockOpen(true);
        menuSearchInput.focus();
    });
}

// Menu Filter
const menuFilterBar = document.querySelector('.menu-filter');
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));

function setActiveFilterButton(button, { scrollIntoView = true } = {}) {
    filterButtons.forEach(btn => {
        const isActive = btn === button;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.tabIndex = isActive ? 0 : -1;
    });

    if (scrollIntoView) {
        button.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
    }
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        setActiveFilterButton(button);

        if (menuSearchInput && menuSearchInput.value.trim() !== '') {
            menuSearchInput.dispatchEvent(new Event('input'));
            return;
        }

        updateMenuCards({ animate: true });
    });
});

const initialActiveFilterBtn = filterButtons.find(btn => btn.classList.contains('active')) || filterButtons[0];
if (initialActiveFilterBtn) setActiveFilterButton(initialActiveFilterBtn, { scrollIntoView: false });

menuFilterBar?.addEventListener('keydown', (e) => {
    const current = e.target.closest('.filter-btn');
    if (!current) return;

    const currentIndex = filterButtons.indexOf(current);
    if (currentIndex < 0) return;

    let nextIndex = -1;
    if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % filterButtons.length;
    if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + filterButtons.length) % filterButtons.length;
    if (e.key === 'Home') nextIndex = 0;
    if (e.key === 'End') nextIndex = filterButtons.length - 1;

    if (nextIndex !== -1) {
        e.preventDefault();
        filterButtons[nextIndex].focus();
        return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        current.click();
    }
});

updateMenuCards({ animate: false });

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Scroll Animations
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Keep menu section visible by default to avoid "menu not appearing" issues.
    document.querySelectorAll('section').forEach(section => {
        if (section.id === 'menu') return;
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

// Counter Animation for Reviews
const animateCounter = (element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
};

// Observe rating score
if ('IntersectionObserver' in window) {
    const ratingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const scoreElement = entry.target.querySelector('h3');
                animateCounter(scoreElement, 4.0);
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.5 });

    const ratingScore = document.querySelector('.rating-score');
    if (ratingScore) {
        ratingObserver.observe(ratingScore);
    }
}

// Full menu live search
if (menuSearchInput) {
    const fullMenuList = document.getElementById('fullMenuList');
    const menuGroups = fullMenuList ? fullMenuList.querySelectorAll('.menu-group') : [];

    const applyMenuSearch = () => {
        const query = menuSearchInput.value.trim().toLowerCase();
        syncSearchDockValueState();

        if (query !== '') {
            setFullListExpanded(true);
        }

        menuGroups.forEach(group => {
            let groupHasMatch = false;

            const listItems = group.querySelectorAll('li');
            listItems.forEach(item => {
                const isMatch = query === '' || item.textContent.toLowerCase().includes(query);
                item.style.display = isMatch ? '' : 'none';
                if (isMatch) groupHasMatch = true;
            });

            const tableRows = group.querySelectorAll('tbody tr');
            tableRows.forEach(row => {
                const isMatch = query === '' || row.textContent.toLowerCase().includes(query);
                row.style.display = isMatch ? '' : 'none';
                if (isMatch) groupHasMatch = true;
            });

            const subgroups = group.querySelectorAll('.menu-subgroup');
            subgroups.forEach(subgroup => {
                const subgroupItems = Array.from(subgroup.querySelectorAll('li'));
                const subgroupRows = Array.from(subgroup.querySelectorAll('tbody tr'));
                const hasVisibleItem = subgroupItems.some(item => item.style.display !== 'none');
                const hasVisibleRow = subgroupRows.some(row => row.style.display !== 'none');
                subgroup.style.display = (query === '' || hasVisibleItem || hasVisibleRow) ? '' : 'none';
            });

            group.style.display = (query === '' || groupHasMatch) ? '' : 'none';
            if (query !== '' && groupHasMatch) {
                group.open = true;
            }

            // No additional handling needed here; the full list items are already shown/hidden above.
        });

        const result = updateMenuCards({ animate: false });
        setSearchCount(result?.visibleCount ?? 0, query);

        // Show "no results" based on the visible cards (includes active category filter).
        if (menuSearchEmpty) {
            const shouldShowEmpty = query !== '' && (result?.visibleCount ?? 0) === 0;
            menuSearchEmpty.style.display = shouldShowEmpty ? 'block' : 'none';
        }

    };

    const debouncedApplyMenuSearch = debounce(applyMenuSearch, 60);

    menuSearchInput.addEventListener('input', debouncedApplyMenuSearch);
    applyMenuSearch();
}

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
    if (prefersReducedMotion()) return;
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// Loading Animation
window.addEventListener('load', () => {
    if (prefersReducedMotion()) return;
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Social placeholders (so there are no dead links)
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        alert('Social links coming soon.');
    });
});

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
