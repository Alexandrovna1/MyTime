// Анимации для страницы "О нас"
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ Страница 'О нас' загружена");
    
    // ========== ГАМБУРГЕР-МЕНЮ ==========
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        console.log("🍔 Гамбургер найден:", hamburger);
        console.log("📋 Меню найдено:", navMenu);
        
        // Открытие/закрытие меню
        hamburger.addEventListener('click', function() {
            console.log("👉 Гамбургер нажат!");
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Блокируем прокрутку при открытом меню
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                console.log("📱 Меню ОТКРЫТО");
            } else {
                document.body.style.overflow = '';
                console.log("📱 Меню ЗАКРЫТО");
            }
        });
        
        // Закрыть меню при клике на ссылку
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                console.log("🔗 Меню закрыто по клику на ссылку");
            });
        });
        
        // Закрыть меню при клике вне его
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                console.log("👆 Меню закрыто по клику вне его");
            }
        });
        
        console.log("✅ Гамбургер-меню инициализировано");
    } else {
        console.error("❌ Элементы гамбургер-меню не найдены!");
        console.error("hamburger:", hamburger);
        console.error("navMenu:", navMenu);
    }
    
    // ========== АНИМАЦИИ ПРИ СКРОЛЛЕ ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми секциями
    const sections = document.querySelectorAll('.mission-section, .team-section, .principles-section, .contact-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Анимация для карточек команды
    const teamCards = document.querySelectorAll('.team-member');
    teamCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + index * 200);
    });

    // Анимация для фич платформы
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'scale(0.9)';
        feature.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            feature.style.opacity = '1';
            feature.style.transform = 'scale(1)';
        }, 500 + index * 100);
    });

    // Анимация для принципов
    const principles = document.querySelectorAll('.principle-item');
    principles.forEach((principle, index) => {
        principle.style.opacity = '0';
        principle.style.transform = 'translateY(20px)';
        principle.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            principle.style.opacity = '1';
            principle.style.transform = 'translateY(0)';
        }, 700 + index * 100);
    });

    // Интерактивность для кнопки
    const contactButton = document.querySelector('.contact-button');
    if (contactButton) {
        contactButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        contactButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }

    // Добавляем класс активной странице в навигации
    function setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.navbar nav ul li a');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Вызываем функцию при загрузке
    setActiveNavItem();

    // Логирование для отладки
    console.log(`🔄 Анимировано элементов:
    - Секции: ${sections.length}
    - Члены команды: ${teamCards.length}
    - Фичи: ${features.length}
    - Принципы: ${principles.length}
    `);
});

// Обработчик ошибок
window.addEventListener('error', function(e) {
    console.error('❌ Ошибка на странице "О нас":', e.message);
});

