// Анимации для страницы "О нас"
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ Страница 'О нас' загружена");
    
    // ========== ГАМБУРГЕР-МЕНЮ ==========
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        // Открытие/закрытие меню
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Блокируем прокрутку при открытом меню
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                console.log("🍔 Меню открыто");
            } else {
                document.body.style.overflow = '';
                console.log("🍔 Меню закрыто");
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
        
        // Закрыть меню при нажатии Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                console.log("⎋ Меню закрыто по клавише Escape");
            }
        });
        
        console.log("✅ Гамбургер-меню инициализировано");
    } else {
        console.warn("⚠️ Элементы гамбургер-меню не найдены");
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
                console.log(`🎯 Секция "${entry.target.className}" появилась в поле зрения`);
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

    // ========== ИНТЕРАКТИВНОСТЬ ==========
    // Анимация для кнопки
    const contactButton = document.querySelector('.contact-button');
    if (contactButton) {
        contactButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        contactButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    // Анимация для карточек при наведении
    const interactiveCards = document.querySelectorAll('.team-member, .feature, .principle-item');
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease, opacity 0.5s ease';
        });
    });

    // ========== АКТИВНЫЕ ССЫЛКИ НАВИГАЦИИ ==========
    function setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.navbar nav ul li a');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage || (currentPage === 'index.html' && linkPage === '')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        console.log(`📍 Активная страница: ${currentPage}`);
    }

    // Вызываем функцию при загрузке
    setActiveNavItem();

    // ========== АДАПТИВНОСТЬ ==========
    // Проверяем ширину экрана при загрузке
    function checkMobileView() {
        if (window.innerWidth <= 992) {
            console.log("📱 Мобильный вид активирован");
            // Здесь можно добавить дополнительные действия для мобильного вида
        } else {
            console.log("💻 Десктопный вид активирован");
            // Убедимся, что меню закрыто на десктопе
            if (navMenu) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }
    
    // Проверяем при загрузке и изменении размера
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    // ========== ОБРАБОТЧИК ЗАГРУЗКИ ==========
    // Показываем контент после загрузки всех стилей
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    }, 100);

    // Логирование для отладки
    console.log(`🔄 Анимировано элементов:
    - Секции: ${sections.length}
    - Члены команды: ${teamCards.length}
    - Фичи: ${features.length}
    - Принципы: ${principles.length}
    - Интерактивные карточки: ${interactiveCards.length}
    `);
    
    console.log("🎉 Все анимации инициализированы успешно!");
});

// ========== ГЛОБАЛЬНЫЕ ОБРАБОТЧИКИ ==========
// Обработчик ошибок
window.addEventListener('error', function(e) {
    console.error('❌ Ошибка на странице "О нас":', e.message, e.filename, e.lineno);
});

// Обработчик завершения загрузки страницы
window.addEventListener('load', function() {
    console.log("🚀 Страница полностью загружена");
    
    // Плавное появление всего контента
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Обработчик ухода со страницы
window.addEventListener('beforeunload', function() {
    // Сохраняем состояние меню (опционально)
    const navMenu = document.getElementById('nav-menu');
    if (navMenu && navMenu.classList.contains('active')) {
        console.log("👋 Меню было открыто при уходе со страницы");
    }
});
// Обработчик ошибок
window.addEventListener('error', function(e) {
    console.error('❌ Ошибка на странице "О нас":', e.message);

});
