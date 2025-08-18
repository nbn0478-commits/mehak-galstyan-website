// ПРОСТАЯ КРАСИВАЯ НАВИГАЦИЯ
console.log('🚀 Загружаем простую навигацию...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM готов, инициализируем навигацию');
    
    // Элементы
    const navFull = document.querySelector('.nav-full');
    const navCompact = document.querySelector('.nav-compact');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.close-btn');
    
    console.log('🔍 Элементы:', {
        navFull: !!navFull,
        navCompact: !!navCompact,
        mobileMenu: !!mobileMenu,
        closeBtn: !!closeBtn
    });
    
    let isScrolledDown = false;
    
    // СКРОЛЛ - ПРАВИЛЬНАЯ логика для гамбургера
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const shouldShowCompact = scrollTop > 200;
        
        if (shouldShowCompact !== isScrolledDown) {
            isScrolledDown = shouldShowCompact;
            
            if (isScrolledDown) {
                // Скрыть полную навигацию и ПОКАЗАТЬ гамбургер
                navFull.classList.add('hidden');
                navCompact.classList.add('visible');
                console.log('🍔 ПОКАЗАЛИ гамбургер - теперь он ОСТАЕТСЯ на всех секциях!');
            } else {
                // Показать полную навигацию и скрыть гамбургер (только на главной)
                navFull.classList.remove('hidden');
                navCompact.classList.remove('visible');
                console.log('🖥️ Вернулись на главную - показали полную навигацию');
            }
        }
        
        // Логирование для отладки
        console.log(`📊 Скролл: ${scrollTop}px, Гамбургер видимый: ${isScrolledDown}`);
    });
    
    // ГАМБУРГЕР - открыть меню
    if (navCompact) {
        navCompact.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('📱 Открыли мобильное меню');
        });
    }
    
    // ЗАКРЫТЬ меню
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            console.log('❌ Закрыли мобильное меню');
        });
    }
    
    // ССЫЛКИ - скролл к секциям
    const allLinks = document.querySelectorAll('.nav-full a, .mobile-menu a');
    console.log(`🔗 Найдено ссылок: ${allLinks.length}`);
    
    allLinks.forEach(function(link, index) {
        const href = link.getAttribute('href');
        console.log(`Ссылка ${index + 1}: ${href}`);
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            console.log(`🎯 КЛИК: ${href}`);
            
            // Закрыть мобильное меню
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Найти секцию
            const target = document.querySelector(href);
            if (target) {
                console.log(`✅ Найдена секция: ${href}`);
                
                // Скролл
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Активная ссылка
                allLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                console.log(`✅ Скролл выполнен к: ${href}`);
            } else {
                console.error(`❌ Секция НЕ найдена: ${href}`);
            }
        });
    });
    
    // Проверить секции
    const sections = ['about', 'brands', 'philosophy', 'timeline', 'gallery', 'press', 'contact'];
    sections.forEach(function(id) {
        const section = document.getElementById(id);
        if (section) {
            console.log(`✅ Секция ${id} найдена`);
        } else {
            console.error(`❌ Секция ${id} НЕ найдена`);
        }
    });
    
    // КНОПКА НАВЕРХ
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Показать/скрыть кнопку при скролле
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            
            if (scrollTop > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        // Клик по кнопке - скролл наверх
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            console.log('🚀 Скролл наверх!');
        });
        
        console.log('✅ Кнопка "наверх" готова!');
    }
    
    console.log('✅ Навигация готова!');
    console.log('📋 Кнопка наверх появляется при скролле > 500px');
});