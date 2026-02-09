/// ==================== ПОЛНАЯ ФУНКЦИОНАЛЬНОСТЬ ФИЛЬТРАЦИИ ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ Страница загружена");
    
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
    
    // ========== КНОПКА "ПОДРОБНЕЕ" - ОТКРЫТИЕ МОДАЛЬНОГО ОКНА ==========
    document.querySelectorAll('.btn-detail').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('href');
            const modal = document.querySelector(modalId);
            
            if (modal) {
                console.log(`📱 Открываем модальное окно: ${modalId}`);
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                
                // Инициализация галереи внутри модального окна
                const gallery = modal.querySelector('.gallery');
                if (gallery) {
                    initGallery(gallery);
                }
                
                // Инициализация карты (если есть)
                const mapContainer = modal.querySelector('.yandex-map');
                if (mapContainer) {
                    // Проверяем, есть ли список кинотеатров в этом модальном окне
                    const cinemaList = modal.querySelector('.cinemas-list');
                    if (cinemaList) {
                        console.log("🎬 Найден список кинотеатров, инициализируем...");
                        // Даем небольшую задержку для гарантии отрисовки DOM
                        setTimeout(() => {
                            initCinemaList(cinemaList);
                        }, 100);
                    } else {
                        // Проверяем, есть ли список мест активного отдыха
                        const placesList = modal.querySelector('.places-list');
                        if (placesList) {
                            console.log("📍 Найден список мест активного отдыха, инициализируем...");
                            setTimeout(() => {
                                initPlacesList(placesList);
                            }, 100);
                        } else {
                            // Обычная карта
                            initYandexMap(mapContainer);
                        }
                    }
                }
            }
        });
    });

    // ========== ФУНКЦИИ ПРОКРУТКИ ЛЕНТ ==========
    function initScrollButtons() {
        console.log("🔄 Инициализация кнопок прокрутки...");
        
        document.querySelectorAll('.scroll-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const target = this.getAttribute('data-target');
                const direction = this.textContent.includes('›') || this.textContent.includes('>') ? 'right' : 'left';
                
                console.log(`📜 Прокрутка ${target} в направлении: ${direction}`);
                
                scrollTimeline(target, direction);
            });
        });
        
        console.log("✅ Кнопки прокрутки инициализированы");
    }

    function scrollTimeline(target, direction) {
        // Находим список элементов для прокрутки
        const list = document.querySelector(`.${target}-list`);
        if (!list) {
            console.error(`❌ Не найден список: .${target}-list`);
            return;
        }
        
        const container = list.parentElement;
        if (!container) {
            console.error(`❌ Не найден контейнер для: .${target}-list`);
            return;
        }
        
        // Вычисляем ширину одного контейнера (карточки) + отступ
        const firstCard = list.querySelector('.container');
        if (!firstCard) {
            console.error(`❌ Не найдены карточки в списке: .${target}-list`);
            return;
        }
        
        const cardWidth = firstCard.offsetWidth;
        const gap = 30; // такой же gap как в CSS
        const scrollAmount = cardWidth + gap;
        
        // Текущая позиция прокрутки
        const currentScroll = list.scrollLeft || 0;
        
        // Новая позиция
        let newScroll;
        if (direction === 'right') {
            newScroll = currentScroll + scrollAmount;
            // Проверяем, не достигли ли конца
            const maxScroll = list.scrollWidth - container.clientWidth;
            if (newScroll > maxScroll) {
                newScroll = 0; // Возвращаемся к началу
            }
        } else {
            newScroll = currentScroll - scrollAmount;
            // Проверяем, не достигли ли начала
            if (newScroll < 0) {
                newScroll = list.scrollWidth - container.clientWidth; // Переходим в конец
            }
        }
        
        // Плавная прокрутка
        list.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });
        
        console.log(`✅ Прокрутка ${target}: ${currentScroll}px → ${newScroll}px`);
    }

    // Автоматическая прокрутка (опционально)
    function startAutoScroll() {
        setInterval(() => {
            // Не прокручиваем, если открыты модальные окна или пользователь взаимодействует со страницей
            const hasOpenModal = document.querySelector('.modal-details:not(.hidden)');
            const hasOpenResults = document.querySelector('.filter-results-modal.show');
            
            if (!hasOpenModal && !hasOpenResults) {
                document.querySelectorAll('.events-list, .restaurants-list, .active-list').forEach(list => {
                    if (list) {
                        const currentScroll = list.scrollLeft || 0;
                        const maxScroll = list.scrollWidth - list.parentElement.clientWidth;
                        
                        if (currentScroll >= maxScroll - 10) { // -10 для погрешности
                            // Плавно возвращаемся к началу
                            list.scrollTo({
                                left: 0,
                                behavior: 'smooth'
                            });
                        } else {
                            // Плавно прокручиваем вперед
                            list.scrollTo({
                                left: currentScroll + 2,
                                behavior: 'smooth'
                            });
                        }
                    }
                });
            }
        }, 50);
    }

    // Изменяем CSS для прокрутки
    function setupScrollStyles() {
        const scrollStyle = document.createElement('style');
        scrollStyle.textContent = `
            /* Убираем CSS анимацию и делаем обычную прокрутку */
            .events-list,
            .restaurants-list,
            .active-list {
                animation: none !important;
                display: flex !important;
                overflow-x: auto !important;
                overflow-y: hidden !important;
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
                padding: 10px 0 !important;
            }
            
            /* Скрываем стандартный скроллбар */
            .events-list::-webkit-scrollbar,
            .restaurants-list::-webkit-scrollbar,
            .active-list::-webkit-scrollbar {
                display: none;
            }
            
            .events-list,
            .restaurants-list,
            .active-list {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            
            /* Контейнеры для горизонтальной прокрутки */
            .events-container,
            .restaurants-container,
            .active-container {
                position: relative;
                overflow: hidden;
                width: 100%;
            }
            
            /* Кнопки прокрутки */
            .scroll-controls {
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                transform: translateY(-50%);
                display: flex;
                justify-content: space-between;
                padding: 0 10px;
                z-index: 10;
                pointer-events: none;
            }
            
            .scroll-btn {
                pointer-events: auto;
                background: rgba(45, 27, 71, 0.9);
                color: white;
                border: 2px solid #9370db;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                z-index: 11;
            }
            
            .scroll-btn:hover {
                background: #7b68ee;
                transform: scale(1.1);
                box-shadow: 0 6px 15px rgba(123, 104, 238, 0.5);
            }
            
            /* Градиенты по краям для индикации прокрутки */
            .events-container::before,
            .events-container::after,
            .restaurants-container::before,
            .restaurants-container::after,
            .active-container::before,
            .active-container::after {
                content: '';
                position: absolute;
                top: 0;
                width: 60px;
                height: 100%;
                z-index: 2;
                pointer-events: none;
            }
            
            .events-container::before,
            .restaurants-container::before,
            .active-container::before {
                left: 0;
                background: linear-gradient(to right, rgba(30, 0, 60, 0.9), transparent);
            }
            
            .events-container::after,
            .restaurants-container::after,
            .active-container::after {
                right: 0;
                background: linear-gradient(to left, rgba(30, 0, 60, 0.9), transparent);
            }
            
            /* Адаптивность */
            @media (max-width: 768px) {
                .scroll-btn {
                    width: 35px;
                    height: 35px;
                    font-size: 18px;
                }
                
                .events-container::before,
                .events-container::after,
                .restaurants-container::before,
                .restaurants-container::after,
                .active-container::before,
                .active-container::after {
                    width: 40px;
                }
            }
            
            @media (max-width: 576px) {
                .scroll-btn {
                    width: 30px;
                    height: 30px;
                    font-size: 16px;
                }
                
                .events-container::before,
                .events-container::after,
                .restaurants-container::before,
                .restaurants-container::after,
                .active-container::before,
                .active-container::after {
                    width: 30px;
                }
            }
        `;
        
        document.head.appendChild(scrollStyle);
        console.log("✅ Стили прокрутки добавлены");
    }
    
    // 2. ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal-details');
            if (modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Закрытие модального окна при клике вне его
    document.querySelectorAll('.modal-details').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // 3. КНОПКА ФИЛЬТРОВАНИЯ - ВОССТАНАВЛИВАЕМ ПОЛНУЮ ФУНКЦИОНАЛЬНОСТЬ
    const applyFiltersBtn = document.querySelector('.apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            console.log('🔘 Кнопка "Применить фильтры" нажата');
            applyFiltersFunction();
        });
    }
    
    // 4. ОТКРЫТИЕ/ЗАКРЫТИЕ ФИЛЬТРОВ
    const filterToggle = document.querySelector('.filter-toggle');
    const filterDropdown = document.querySelector('.filter-dropdown');
    
    if (filterToggle && filterDropdown) {
        filterToggle.addEventListener('click', function() {
            filterDropdown.classList.toggle('show');
            console.log('📋 Фильтры ' + (filterDropdown.classList.contains('show') ? 'открыты' : 'закрыты'));
        });
        
        // Закрытие фильтров при клике вне области
        document.addEventListener('click', function(e) {
            if (filterDropdown && !filterDropdown.contains(e.target) && 
                !filterToggle.contains(e.target) && 
                filterDropdown.classList.contains('show')) {
                filterDropdown.classList.remove('show');
            }
        });
    }
    
    // 5. ОБНОВЛЕНИЕ ЗНАЧЕНИЯ СЛАЙДЕРА СТОИМОСТИ
    const costSlider = document.querySelector('#event-cost');
    const costValue = document.querySelector('#cost-value');
    
    if (costSlider && costValue) {
        costSlider.addEventListener('input', function() {
            costValue.textContent = this.value + ' ₽';
        });
        
        // Устанавливаем начальное значение
        costValue.textContent = costSlider.value + ' ₽';
    }
    
    // 6. КНОПКА СБРОСА ФИЛЬТРОВ
    const resetFiltersBtn = document.querySelector('.reset-filters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            console.log('🔄 Сброс фильтров');
            
            // Сброс значений фильтров
            document.querySelector('#event-time').value = '';
            document.querySelector('#event-cost').value = 0;
            document.querySelector('#event-concept').value = '';
            document.querySelector('#event-rating').value = 0;
            document.querySelector('#restaurant-cuisine').value = '';
            document.querySelector('#active-category').value = 'all'; // Добавлено
            
            // Обновление отображения стоимости
            if (costValue) {
                costValue.textContent = '0 ₽';
            }
            
            // Показываем сообщение
            showSimpleMessage('Фильтры сброшены');
            
            // Закрываем дропдаун фильтров
            if (filterDropdown) {
                filterDropdown.classList.remove('show');
            }
        });
    }
    
    // 7. АВТОМАТИЧЕСКАЯ ПРОКРУТКА ИЗОБРАЖЕНИЙ В КАРТОЧКАХ
    initImageSliders();
    
    console.log("✅ Все обработчики событий установлены");
    
    // 8. ИНИЦИАЛИЗАЦИЯ СПИСКА КИНОТЕАТРОВ
    function initCinemaList(cinemaList) {
        console.log("🎬 Инициализация списка кинотеатров");
        const listItems = cinemaList.querySelectorAll('li');
        const mapElement = cinemaList.closest('.modal-content').querySelector('.yandex-map');
        
        if (!mapElement) {
            console.error("❌ Не найден элемент карты для списка кинотеатров");
            return;
        }
        
        console.log(`🎬 Найдено ${listItems.length} кинотеатров`);
        
        // Удаляем старые обработчики событий
        listItems.forEach(item => {
            item.onclick = null;
        });
        
        // Добавляем новые обработчики событий
        listItems.forEach(item => {
            item.addEventListener('click', function() {
                console.log("📍 Выбран кинотеатр:", this.textContent);
                
                // Удаляем активный класс у всех элементов
                listItems.forEach(li => li.classList.remove('active'));
                
                // Добавляем активный класс к текущему элементу
                this.classList.add('active');
                
                // Получаем координаты кинотеатра
                const lat = this.getAttribute('data-lat');
                const lon = this.getAttribute('data-lon');
                const title = this.getAttribute('data-title') || this.textContent.trim();
                const address = this.getAttribute('data-address') || this.getAttribute('title') || 'Адрес не указан';
                
                console.log(`📍 Координаты: ${lat}, ${lon}, Название: ${title}`);
                
                if (lat && lon) {
                    // Инициализируем карту с координатами кинотеатра
                    initCinemaMap(mapElement, lat, lon, title, address);
                } else {
                    console.warn("❌ У кинотеатра нет координат:", title);
                    mapElement.innerHTML = `
                        <div style="
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: rgba(45, 27, 71, 0.8);
                            color: #e6e0ff;
                            font-style: italic;
                            border-radius: 10px;
                            padding: 20px;
                            text-align: center;
                        ">
                            <p>Координаты кинотеатра "${title}" не указаны</p>
                        </div>
                    `;
                }
            });
        });
        
        // Активируем первый элемент, если есть элементы
        if (listItems.length > 0) {
            console.log("🎬 Активируем первый кинотеатр в списке");
            // Даем небольшую задержку для гарантии отрисовки DOM
            setTimeout(() => {
                listItems[0].click();
            }, 150);
        }
    }
    
    // 9. ИНИЦИАЛИЗАЦИЯ КАРТЫ КИНОТЕАТРА
    function initCinemaMap(mapElement, lat, lon, title, address) {
        console.log("🗺️ Инициализация карты для кинотеатра:", title);
        
        if (!lat || !lon) {
            console.warn("❌ Нет координат для карты кинотеатра");
            mapElement.innerHTML = `
                <div style="
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(45, 27, 71, 0.8);
                    color: #e6e0ff;
                    font-style: italic;
                    border-radius: 10px;
                    padding: 20px;
                    text-align: center;
                ">
                    <p>Координаты кинотеатра "${title}" не указаны</p>
                </div>
            `;
            return;
        }
        
        // Очищаем контейнер
        mapElement.innerHTML = '';
        
        // Создаем уникальный ID для карты, если его нет
        if (!mapElement.id || mapElement.id === '') {
            mapElement.id = 'cinema-map-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            console.log("🆔 Создан новый ID для карты:", mapElement.id);
        }
        
        // Проверяем, загружена ли библиотека Яндекс Карт
        if (typeof ymaps === 'undefined') {
            console.error('Yandex Maps API не загружена');
            mapElement.innerHTML = `
                <div style="
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(45, 27, 71, 0.8);
                    color: #e6e0ff;
                    font-style: italic;
                    border-radius: 10px;
                    padding: 20px;
                    text-align: center;
                ">
                    <p>Карта временно недоступна. Обновите страницу.</p>
                </div>
            `;
            return;
        }
        
        console.log("🗺️ Загружаем Яндекс Карту...");
        
        ymaps.ready(function() {
            try {
                console.log("🗺️ Создаем карту для кинотеатра:", title);
                
                var myMap = new ymaps.Map(mapElement.id, {
                    center: [parseFloat(lat), parseFloat(lon)],
                    zoom: 16,
                    controls: ['zoomControl', 'fullscreenControl']
                });
                
                // Добавляем метку
                var myPlacemark = new ymaps.Placemark([parseFloat(lat), parseFloat(lon)], {
                    hintContent: title,
                    balloonContent: `
                        <div class="map-balloon-content">
                            <h3 style="color: #000000; margin-bottom: 10px; font-size: 16px;">${title}</h3>
                            <p style="margin: 5px 0; color: #333; font-size: 14px;">${address}</p>
                        </div>
                    `
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: 'https://cdn1.iconfinder.com/data/icons/user-interface-solid-5/32/UI_solid-09-1024.png',
                    iconImageSize: [40, 40],
                    iconImageOffset: [-20, -40]
                });
                
                myMap.geoObjects.add(myPlacemark);
                
                // Открываем балун при создании
                myPlacemark.balloon.open();
                
                console.log("✅ Карта кинотеатра успешно создана:", title);
            } catch (error) {
                console.error("❌ Ошибка создания карты кинотеатра:", error);
                mapElement.innerHTML = `
                    <div style="
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(45, 27, 71, 0.8);
                        color: #e6e0ff;
                        font-style: italic;
                        border-radius: 10px;
                        padding: 20px;
                        text-align: center;
                    ">
                        <p>Ошибка загрузки карты: ${error.message}</p>
                    </div>
                `;
            }
        });
    }
    
    // Также инициализируем карты кинотеатров при загрузке страницы
    setTimeout(() => {
        document.querySelectorAll('.cinemas-list').forEach(cinemaList => {
            console.log("🎬 Инициализируем список кинотеатров при загрузке");
            initCinemaList(cinemaList);
        });
    }, 1000);

    // 10. ИНИЦИАЛИЗАЦИЯ АКТИВНОГО ОТДЫХА
    function initActiveSports() {
        console.log("🎯 Инициализация активного отдыха...");
        
        // Обработчики для кнопок "Подробнее" в секции активного отдыха
        document.querySelectorAll('.active-list .btn-detail').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const modalId = this.getAttribute('href');
                const modal = document.querySelector(modalId);
                
                if (modal) {
                    console.log(`🏃 Открываем модальное окно активного отдыха: ${modalId}`);
                    modal.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                    
                    // Инициализация галереи
                    const gallery = modal.querySelector('.gallery');
                    if (gallery) {
                        initGallery(gallery);
                    }
                    
                    // Инициализация списка мест
                    const placesList = modal.querySelector('.places-list');
                    if (placesList) {
                        console.log("📍 Инициализируем список мест...");
                        setTimeout(() => {
                            initPlacesList(placesList);
                        }, 100);
                    }
                }
            });
        });
    }

    // 11. ИНИЦИАЛИЗАЦИЯ СПИСКА МЕСТ АКТИВНОГО ОТДЫХА
    function initPlacesList(placesList) {
        console.log("📍 Инициализация списка мест активного отдыха");
        const listItems = placesList.querySelectorAll('li');
        const mapElement = placesList.closest('.modal-content').querySelector('.yandex-map');
        const gallery = placesList.closest('.modal-content').querySelector('.gallery');
        
        if (!mapElement) {
            console.error("❌ Не найден элемент карты для списка мест");
            return;
        }
        
        console.log(`📍 Найдено ${listItems.length} мест`);
        
        // Удаляем старые обработчики
        listItems.forEach(item => {
            item.onclick = null;
        });
        
        // Добавляем новые обработчики
        listItems.forEach(item => {
            item.addEventListener('click', function() {
                console.log("📍 Выбрано место:", this.textContent);
                
                // Удаляем активный класс у всех
                listItems.forEach(li => li.classList.remove('active'));
                
                // Добавляем активный класс к текущему
                this.classList.add('active');
                
                // Получаем данные
                const lat = this.getAttribute('data-lat');
                const lon = this.getAttribute('data-lon');
                const title = this.getAttribute('data-title') || this.textContent.trim();
                const address = this.getAttribute('data-address') || 'Адрес не указан';
                const price = this.getAttribute('data-price') || 'Цена не указана';
                const rating = this.getAttribute('data-rating') || 'Рейтинг не указан';
                const time = this.getAttribute('data-time') || 'Время не указано';
                const description = this.getAttribute('data-description') || 'Описание отсутствует';
                const images = this.getAttribute('data-images');
                
                console.log(`📍 Данные: ${title}, ${address}`);
                
                // Обновляем описание
                const descElement = document.getElementById('current-place-description');
                if (descElement) descElement.textContent = description;
                
                // Обновляем информацию
                updatePlaceInfo(title, address, time, price, rating);
                
                // Обновляем галерею
                if (gallery && images) {
                    try {
                        const imageUrls = JSON.parse(images);
                        updateGallery(gallery, imageUrls);
                    } catch (e) {
                        console.error("Ошибка парсинга изображений:", e);
                    }
                }
                
                // Обновляем карту
                if (lat && lon) {
                    initPlaceMap(mapElement, lat, lon, title, address);
                } else {
                    console.warn("❌ У места нет координат:", title);
                    mapElement.innerHTML = `
                        <div style="
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: rgba(45, 27, 71, 0.8);
                            color: #e6e0ff;
                            font-style: italic;
                            border-radius: 10px;
                            padding: 20px;
                            text-align: center;
                        ">
                            <p>Координаты "${title}" не указаны</p>
                        </div>
                    `;
                }
            });
        });
        
        // Активируем первый элемент, если есть
        if (listItems.length > 0) {
            console.log("📍 Активируем первое место в списке");
            setTimeout(() => {
                listItems[0].click();
            }, 150);
        }
    }

    // 12. ОБНОВЛЕНИЕ ИНФОРМАЦИИ О МЕСТЕ
    function updatePlaceInfo(title, address, time, price, rating) {
        const titleElement = document.getElementById('current-place-title');
        const addressElement = document.getElementById('current-place-address');
        const timeElement = document.getElementById('current-place-time');
        const priceElement = document.getElementById('current-place-price');
        const ratingElement = document.getElementById('current-place-rating');
        
        if (titleElement) titleElement.textContent = title;
        if (addressElement) addressElement.textContent = address;
        if (timeElement) timeElement.textContent = time;
        if (priceElement) priceElement.textContent = price;
        if (ratingElement) ratingElement.textContent = rating;
    }

    // 13. ОБНОВЛЕНИЕ ГАЛЕРЕИ
    function updateGallery(gallery, imageUrls) {
        // Очищаем галерею, кроме кнопок
        const prevBtn = gallery.querySelector('.prev-button');
        const nextBtn = gallery.querySelector('.next-button');
        gallery.innerHTML = '';
        
        if (prevBtn) gallery.appendChild(prevBtn);
        
        // Добавляем изображения
        imageUrls.forEach((url, index) => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Место активного отдыха';
            if (index === 0) img.classList.add('active');
            gallery.appendChild(img);
        });
        
        if (nextBtn) gallery.appendChild(nextBtn);
        
        // Реинициализируем галерею
        setTimeout(() => {
            initGallery(gallery);
        }, 100);
    }

    // 14. ИНИЦИАЛИЗАЦИЯ КАРТЫ МЕСТА
    function initPlaceMap(mapElement, lat, lon, title, address) {
        console.log("🗺️ Инициализация карты для:", title);
        
        if (!lat || !lon) {
            mapElement.innerHTML = `
                <div style="
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(45, 27, 71, 0.8);
                    color: #e6e0ff;
                    font-style: italic;
                    border-radius: 10px;
                    padding: 20px;
                    text-align: center;
                ">
                    <p>Координаты "${title}" не указаны</p>
                </div>
            `;
            return;
        }
        
        // Очищаем контейнер
        mapElement.innerHTML = '';
        
        // Создаем уникальный ID
        if (!mapElement.id || mapElement.id === '') {
            mapElement.id = 'place-map-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }
        
        // Проверяем Яндекс Карты
        if (typeof ymaps === 'undefined') {
            console.error('Yandex Maps API не загружена');
            mapElement.innerHTML = `
                <div style="
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(45, 27, 71, 0.8);
                    color: #e6e0ff;
                    font-style: italic;
                    border-radius: 10px;
                    padding: 20px;
                    text-align: center;
                ">
                    <p>Карта временно недоступна</p>
                </div>
            `;
            return;
        }
        
        ymaps.ready(function() {
            try {
                var myMap = new ymaps.Map(mapElement.id, {
                    center: [parseFloat(lat), parseFloat(lon)],
                    zoom: 16,
                    controls: ['zoomControl', 'fullscreenControl']
                });
                
                var myPlacemark = new ymaps.Placemark([parseFloat(lat), parseFloat(lon)], {
                    hintContent: title,
                    balloonContent: `
                        <div class="map-balloon-content">
                            <h3 style="color: #000000; margin-bottom: 10px; font-size: 16px;">${title}</h3>
                            <p style="margin: 5px 0; color: #333; font-size: 14px;">${address}</p>
                        </div>
                    `
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: 'https://cdn1.iconfinder.com/data/icons/user-interface-solid-5/32/UI_solid-09-1024.png',
                    iconImageSize: [40, 40],
                    iconImageOffset: [-20, -40]
                });
                
                myMap.geoObjects.add(myPlacemark);
                myPlacemark.balloon.open();
                
                console.log("✅ Карта места успешно создана:", title);
            } catch (error) {
                console.error("❌ Ошибка создания карты:", error);
                mapElement.innerHTML = `
                    <div style="
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(45, 27, 71, 0.8);
                        color: #e6e0ff;
                        font-style: italic;
                        border-radius: 10px;
                        padding: 20px;
                        text-align: center;
                    ">
                        <p>Ошибка загрузки карты</p>
                    </div>
                `;
            }
        });
    }

    // Инициализация активного отдыха
    setTimeout(() => {
        initActiveSports();
    }, 500);
});

// ==================== ПОЛНАЯ ФУНКЦИЯ ФИЛЬТРАЦИИ С АКТИВНЫМ ОТДЫХОМ ====================
function applyFiltersFunction() {
    console.log("🔄 Применяем фильтры...");
    
    // Получаем значения всех фильтров
    const eventTime = document.querySelector("#event-time").value;
    const eventCost = parseInt(document.querySelector("#event-cost").value);
    const eventConcept = document.querySelector("#event-concept").value;
    const eventRating = parseInt(document.querySelector("#event-rating").value);
    const restaurantCuisine = document.querySelector("#restaurant-cuisine").value;
    const activeCategory = document.querySelector("#active-category").value;
    
    console.log("Фильтры:");
    console.log("- Время:", eventTime);
    console.log("- Стоимость:", eventCost);
    console.log("- Концепт:", eventConcept);
    console.log("- Рейтинг:", eventRating);
    console.log("- Кухня:", restaurantCuisine);
    console.log("- Категория активного отдыха:", activeCategory);
    
    let filteredResults = [];
    let resultsTitle = "Результаты фильтрации";
    let type = "all";
    
    // ФЛАГИ ДЛЯ ОПРЕДЕЛЕНИЯ, КАКИЕ ФИЛЬТРЫ ПРИМЕНЯТЬ
    const hasEventFilters = eventConcept || eventTime || eventCost > 0 || eventRating > 0;
    const hasRestaurantFilter = restaurantCuisine;
    const hasActiveFilter = activeCategory && activeCategory !== 'all';
    
    // СЛУЧАЙ 1: Есть фильтры мероприятий
    if (hasEventFilters) {
        console.log("🔍 Фильтруем мероприятия...");
        document.querySelectorAll('.events-list .container').forEach(item => {
            const eventData = extractEventData(item);
            if (eventData && eventPassesFilters(eventData, eventTime, eventCost, eventConcept, eventRating)) {
                filteredResults.push(eventData);
            }
        });
        type = "events";
        
        // Формируем заголовок
        const conceptName = getConceptName(eventConcept);
        const timeName = getTimeName(eventTime);
        const ratingText = eventRating > 0 ? `${eventRating}+` : '';
        
        resultsTitle = "Мероприятия";
        if (conceptName) resultsTitle += `: ${conceptName}`;
        if (timeName) resultsTitle += `, ${timeName}`;
        if (eventCost > 0) resultsTitle += `, до ${eventCost}₽`;
        if (ratingText) resultsTitle += `, рейтинг ${ratingText}`;
        
        // Если есть фильтр ресторанов - показываем и их
        if (hasRestaurantFilter) {
            console.log("🔍 Фильтруем рестораны...");
            document.querySelectorAll('.restaurants-list .container').forEach(item => {
                const restaurantData = extractRestaurantData(item);
                if (restaurantData && restaurantPassesFilters(restaurantData, restaurantCuisine)) {
                    filteredResults.push(restaurantData);
                }
            });
            type = "all";
            resultsTitle += ` и ${getCuisineName(restaurantCuisine)}`;
        }
        
        // Если есть фильтр активного отдыха - показываем и его
        if (hasActiveFilter) {
            console.log("🔍 Фильтруем активный отдых...");
            document.querySelectorAll('.active-list .container').forEach(item => {
                const activeData = extractActiveData(item);
                if (activeData && activePassesFilters(activeData, activeCategory)) {
                    filteredResults.push(activeData);
                }
            });
            type = "all";
            resultsTitle += ` и ${getActiveCategoryName(activeCategory)}`;
        }
    }
    // СЛУЧАЙ 2: Только фильтр ресторанов
    else if (hasRestaurantFilter) {
        console.log("🔍 Фильтруем только рестораны...");
        document.querySelectorAll('.restaurants-list .container').forEach(item => {
            const restaurantData = extractRestaurantData(item);
            if (restaurantData && restaurantPassesFilters(restaurantData, restaurantCuisine)) {
                filteredResults.push(restaurantData);
            }
        });
        type = "restaurants";
        resultsTitle = `Рестораны: ${getCuisineName(restaurantCuisine)}`;
        
        // Если есть фильтр активного отдыха
        if (hasActiveFilter) {
            console.log("🔍 Фильтруем активный отдых...");
            document.querySelectorAll('.active-list .container').forEach(item => {
                const activeData = extractActiveData(item);
                if (activeData && activePassesFilters(activeData, activeCategory)) {
                    filteredResults.push(activeData);
                }
            });
            type = "all";
            resultsTitle += ` и ${getActiveCategoryName(activeCategory)}`;
        }
    }
    // СЛУЧАЙ 3: Только фильтр активного отдыха
    else if (hasActiveFilter) {
        console.log("🔍 Фильтруем только активный отдых...");
        document.querySelectorAll('.active-list .container').forEach(item => {
            const activeData = extractActiveData(item);
            if (activeData && activePassesFilters(activeData, activeCategory)) {
                filteredResults.push(activeData);
            }
        });
        type = "active";
        resultsTitle = `Активный отдых: ${getActiveCategoryName(activeCategory)}`;
    }
    // СЛУЧАЙ 4: Нет фильтров - показываем всё
    else {
        console.log("🔍 Показываем всё (фильтры не заданы)...");
        document.querySelectorAll('.events-list .container').forEach(item => {
            const eventData = extractEventData(item);
            if (eventData) filteredResults.push(eventData);
        });
        
        document.querySelectorAll('.restaurants-list .container').forEach(item => {
            const restaurantData = extractRestaurantData(item);
            if (restaurantData) filteredResults.push(restaurantData);
        });
        
        document.querySelectorAll('.active-list .container').forEach(item => {
            const activeData = extractActiveData(item);
            if (activeData) filteredResults.push(activeData);
        });
        
        resultsTitle = "Все мероприятия, рестораны и активный отдых";
        type = "all";
    }
    
    console.log(`✅ Найдено результатов: ${filteredResults.length}`);
    showFilterResults(filteredResults, resultsTitle, type);
    
    const filterDropdown = document.querySelector('.filter-dropdown');
    if (filterDropdown) {
        filterDropdown.classList.remove("show");
    }
}

// ==================== ФУНКЦИИ ФИЛЬТРАЦИИ ====================

// Функция проверки мероприятия по фильтрам
function eventPassesFilters(eventData, timeFilter, costFilter, conceptFilter, ratingFilter) {
    // Проверяем концепт
    if (conceptFilter && !isEventOfConcept(eventData, conceptFilter)) {
        return false;
    }
    
    // Проверяем стоимость
    if (costFilter > 0 && !isEventWithinBudget(eventData, costFilter)) {
        return false;
    }
    
    // Проверяем время
    if (timeFilter && !isEventAtTime(eventData, timeFilter)) {
        return false;
    }
    
    // Проверяем рейтинг
    if (ratingFilter > 0 && !hasMinimumRating(eventData, ratingFilter)) {
        return false;
    }
    
    return true;
}

// Функция проверки ресторана по фильтрам
function restaurantPassesFilters(restaurantData, cuisineFilter) {
    if (cuisineFilter && !isRestaurantOfCuisine(restaurantData, cuisineFilter)) {
        return false;
    }
    
    return true;
}

// Функция проверки активного отдыха по фильтрам
function activePassesFilters(activeData, categoryFilter) {
    if (categoryFilter && categoryFilter !== 'all' && !isActiveOfCategory(activeData, categoryFilter)) {
        return false;
    }
    
    return true;
}

// Проверка концепта мероприятия
function isEventOfConcept(eventData, concept) {
    const originalItem = document.querySelector(`.container a[href="#${eventData.modalId}"]`);
    if (originalItem) {
        const parentDiv = originalItem.closest('div.concert, div.spektakl, div.cinema, div.master_class, div.vstrecha, div.kvart');
        if (parentDiv) {
            const parentClass = parentDiv.className.split(' ')[0];
            return parentClass === concept;
        }
    }
    
    // Если не нашли, ищем в модальном окне
    const modal = document.getElementById(eventData.modalId);
    if (!modal) return false;
    
    const parentContainer = modal.closest('.modal-details');
    if (!parentContainer) return false;
    
    // Проверяем все возможные классы концептов
    const conceptClasses = ['concert', 'spektakl', 'cinema', 'master_class', 'vstrecha', 'kvart'];
    for (const cls of conceptClasses) {
        if (parentContainer.querySelector(`.${cls}`)) {
            return cls === concept;
        }
    }
    
    return false;
}

// Проверка стоимости мероприятия
function isEventWithinBudget(eventData, maxCost) {
    const priceText = eventData.price;
    if (!priceText || priceText.includes('не указана')) {
        return true;
    }
    
    const priceMatches = priceText.match(/\d+/g);
    if (!priceMatches) return true;
    
    const prices = priceMatches.map(num => parseInt(num));
    const minPrice = Math.min(...prices);
    
    return minPrice <= maxCost;
}

// Проверка времени мероприятия
function isEventAtTime(eventData, timeFilter) {
    const timeText = eventData.time;
    if (!timeText || timeText.includes('не указано')) {
        return true;
    }
    
    const timeMatch = timeText.match(/\d{1,2}:\d{2}/);
    if (!timeMatch) {
        return true;
    }
    
    const eventTime = timeMatch[0];
    const hour = parseInt(eventTime.split(':')[0]);
    
    // Определяем временной диапазон
    switch(timeFilter) {
        case 'morning':
            return hour >= 6 && hour < 12;
        case 'afternoon':
            return hour >= 12 && hour < 18;
        case 'evening':
            return hour >= 18 || hour < 6;
        default:
            return true;
    }
}

// Проверка минимального рейтинга
function hasMinimumRating(eventData, minRating) {
    const ratingText = eventData.rating;
    if (!ratingText || ratingText.includes('не указан')) {
        return true;
    }
    
    const ratingMatch = ratingText.match(/\d+(\.\d+)?/);
    if (!ratingMatch) {
        return true;
    }
    
    const rating = parseFloat(ratingMatch[0]);
    return rating >= minRating;
}

// Проверка типа кухни ресторана
function isRestaurantOfCuisine(restaurantData, cuisine) {
    const originalItem = document.querySelector(`.container a[href="#${restaurantData.modalId}"]`);
    if (originalItem) {
        const parentDiv = originalItem.closest(`div.${cuisine}`);
        if (parentDiv) {
            return true;
        }
    }
    
    // Если не нашли, ищем в модальном окне
    const modal = document.getElementById(restaurantData.modalId);
    if (!modal) return false;
    
    const parentContainer = modal.closest('.modal-details');
    if (!parentContainer) return false;
    
    // Проверяем все возможные классы кухонь
    const cuisineClasses = ['russian', 'vostochnaya', 'gruz', 'italian', 'frank', 
                          'sred', 'izrail', 'smesh', 'caucasian', 'asian'];
    for (const cls of cuisineClasses) {
        if (parentContainer.querySelector(`.${cls}`)) {
            return cls === cuisine;
        }
    }
    
    return false;
}

// Проверка категории активного отдыха
function isActiveOfCategory(activeData, category) {
    const originalItem = document.querySelector(`.container a[href="#${activeData.modalId}"]`);
    if (originalItem) {
        // Ищем родительский div с классом категории
        const parentDiv = originalItem.closest(`div.${category}`);
        if (parentDiv) {
            return true;
        }
    }
    
    // Если не нашли, ищем в модальном окне
    const modal = document.getElementById(activeData.modalId);
    if (!modal) return false;
    
    // Проверяем классы категорий активного отдыха
    const activeCategories = [
        'skiing-snowboarding', 'skating', 'trampoline', 'swimming-pools',
        'fitness-center', 'amusement-parks', 'tourist-complexes', 'sports-complex',
        'quests', 'shooting', 'karting'
    ];
    
    // Проверяем, есть ли такая категория в модальном окне
    for (const cat of activeCategories) {
        if (modal.querySelector(`.${cat}`)) {
            return cat === category;
        }
    }
    
    return false;
}

// Функция извлечения данных мероприятия
function extractEventData(item) {
    try {
        const title = item.querySelector('h3')?.textContent || "Название не указано";
        const description = item.querySelector('p')?.textContent || "Описание отсутствует";
        const image = item.querySelector('.image-slider img')?.src || "";
        const link = item.querySelector('.btn-detail')?.getAttribute('href') || "#";
        
        const modalId = link.substring(1);
        const modal = document.getElementById(modalId);
        let price = "Цена не указана";
        let rating = "Рейтинг не указан";
        let time = "Время не указано";
        
        if (modal) {
            const modalInfo = modal.querySelector('.modal-info');
            if (modalInfo) {
                const priceElements = modalInfo.querySelectorAll('p');
                priceElements.forEach(p => {
                    const text = p.textContent;
                    if (text.includes('Цена:') || text.includes('💵')) {
                        price = text.replace('💵', '').replace('Цена:', '').trim();
                    }
                    if (text.includes('Рейтинг:') || text.includes('⭐')) {
                        rating = text.replace('⭐', '').replace('Рейтинг:', '').trim();
                    }
                    if (text.includes('Время:') || text.includes('🕒')) {
                        time = text.replace('🕒', '').replace('Время:', '').trim();
                    }
                });
            }
        }
        
        return {
            type: 'event',
            title,
            description,
            image,
            link,
            price,
            rating,
            time,
            modalId
        };
    } catch (e) {
        console.error("Ошибка извлечения данных мероприятия:", e);
        return null;
    }
}

// Функция извлечения данных ресторана
function extractRestaurantData(item) {
    try {
        const title = item.querySelector('h3')?.textContent || "Название не указано";
        const description = item.querySelector('p')?.textContent || "Описание отсутствует";
        const image = item.querySelector('.image-slider img')?.src || "";
        const link = item.querySelector('.btn-detail')?.getAttribute('href') || "#";
        
        const modalId = link.substring(1);
        const modal = document.getElementById(modalId);
        let price = "Средний чек не указан";
        let rating = "Рейтинг не указан";
        
        if (modal) {
            const modalInfo = modal.querySelector('.modal-info');
            if (modalInfo) {
                const infoElements = modalInfo.querySelectorAll('p');
                infoElements.forEach(p => {
                    const text = p.textContent;
                    if (text.includes('Средний чек:') || text.includes('💵')) {
                        price = text.replace('💵', '').replace('Средний чек:', '').trim();
                    }
                    if (text.includes('Рейтинг:') || text.includes('⭐')) {
                        rating = text.replace('⭐', '').replace('Рейтинг:', '').trim();
                    }
                });
            }
        }
        
        return {
            type: 'restaurant',
            title,
            description,
            image,
            link,
            price,
            rating,
            modalId
        };
    } catch (e) {
        console.error("Ошибка извлечения данных ресторана:", e);
        return null;
    }
}

// Функция извлечения данных активного отдыха
function extractActiveData(item) {
    try {
        const title = item.querySelector('h3')?.textContent || "Название не указано";
        const description = item.querySelector('p')?.textContent || "Описание отсутствует";
        const image = item.querySelector('.image-slider img')?.src || "";
        const link = item.querySelector('.btn-detail')?.getAttribute('href') || "#";
        
        const modalId = link.substring(1);
        const modal = document.getElementById(modalId);
        let price = "Цена не указана";
        let rating = "Рейтинг не указан";
        
        if (modal) {
            const modalInfo = modal.querySelector('.modal-info');
            if (modalInfo) {
                const infoElements = modalInfo.querySelectorAll('p');
                infoElements.forEach(p => {
                    const text = p.textContent;
                    if (text.includes('Цена:') || text.includes('💵')) {
                        price = text.replace('💵', '').replace('Цена:', '').trim();
                    }
                    if (text.includes('Рейтинг:') || text.includes('⭐')) {
                        rating = text.replace('⭐', '').replace('Рейтинг:', '').trim();
                    }
                });
            }
        }
        
        return {
            type: 'active',
            title,
            description,
            image,
            link,
            price,
            rating,
            modalId
        };
    } catch (e) {
        console.error("Ошибка извлечения данных активного отдыха:", e);
        return null;
    }
}

// ==================== ФУНКЦИЯ ПОКАЗА РЕЗУЛЬТАТОВ ФИЛЬТРАЦИИ ====================
function showFilterResults(results, title, filterType) {
    let resultsModal = document.querySelector('.filter-results-modal');
    
    if (!resultsModal) {
        resultsModal = document.createElement('div');
        resultsModal.className = 'filter-results-modal';
        
        const resultsContent = document.createElement('div');
        resultsContent.className = 'filter-results-content';
        
        const header = document.createElement('div');
        header.className = 'filter-results-header';
        
        const titleElem = document.createElement('h2');
        titleElem.textContent = title;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'filter-results-close';
        closeBtn.innerHTML = '✕ Закрыть';
        
        closeBtn.addEventListener('click', () => {
            resultsModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
        
        header.appendChild(titleElem);
        header.appendChild(closeBtn);
        
        const grid = document.createElement('div');
        grid.className = 'filter-results-grid';
        grid.id = 'filter-results-grid';
        
        resultsContent.appendChild(header);
        resultsContent.appendChild(grid);
        resultsModal.appendChild(resultsContent);
        
        resultsModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
        
        document.body.appendChild(resultsModal);
    }
    
    const countText = results.length === 0 ? 'ничего не найдено' : `${results.length} найдено`;
    resultsModal.querySelector('h2').textContent = `${title} (${countText})`;
    
    const grid = resultsModal.querySelector('#filter-results-grid');
    grid.innerHTML = '';
    
    if (results.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p style="font-size: 1.2em; color: #b19cd9; margin-bottom: 15px;">😕 Ничего не найдено</p>
                <p style="color: #e6e0ff; margin-bottom: 20px;">По вашему запросу ничего не найдено.</p>
                <p style="color: #e6e0ff; margin-bottom: 25px;">Попробуйте изменить параметры фильтрации.</p>
                <div style="background: rgba(147, 112, 219, 0.1); padding: 15px; border-radius: 10px; border-left: 4px solid #9370db;">
                    <p style="color: #b19cd9; font-size: 0.9em; margin: 0;">
                        <strong>💡 Совет:</strong> ${getFilterHint(filterType)}
                    </p>
                </div>
            </div>
        `;
        grid.appendChild(noResults);
    } else {
        results.forEach(result => {
            const item = createResultItem(result);
            grid.appendChild(item);
        });
    }
    
    resultsModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function getFilterHint(type) {
    const hints = {
        'events': 'Попробуйте выбрать другой тип мероприятия, время или уменьшите максимальную стоимость',
        'restaurants': 'Попробуйте выбрать другой тип кухни или оставьте фильтр пустым',
        'active': 'Попробуйте выбрать другую категорию активного отдыха или оставьте фильтр пустым',
        'all': 'Попробуйте настроить фильтры мероприятий, ресторанов или активного отдыха отдельно'
    };
    return hints[type] || 'Попробуйте изменить параметры фильтрации';
}

// Функция создания элемента результата
function createResultItem(result) {
    const item = document.createElement('div');
    item.className = 'filter-result-item';
    
    const imageDiv = document.createElement('div');
    imageDiv.className = 'filter-result-image';
    
    const img = document.createElement('img');
    img.src = result.image;
    img.alt = result.title;
    img.onerror = function() {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMyRDFCNDciLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTM3MERCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2Ugbm90IGZvdW5kPC90ZXh0Pjwvc3ZnPg==';
    };
    imageDiv.appendChild(img);
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'filter-result-info';
    
    const title = document.createElement('h3');
    title.textContent = result.title;
    
    const description = document.createElement('p');
    description.textContent = result.description;
    
    const metaDiv = document.createElement('div');
    metaDiv.className = 'filter-result-meta';
    
    const typeBadge = document.createElement('div');
    typeBadge.className = 'filter-result-type';
    typeBadge.textContent = result.type === 'event' ? '🎭 Мероприятие' : 
                            result.type === 'restaurant' ? '🍽️ Ресторан' : 
                            '⚽ Активный отдых';
    
    const price = document.createElement('div');
    price.className = 'filter-result-price';
    price.textContent = result.price;
    
    const rating = document.createElement('div');
    rating.className = 'filter-result-rating';
    rating.textContent = result.rating;
    
    if (result.type === 'event' && result.time && !result.time.includes('не указано')) {
        const time = document.createElement('div');
        time.className = 'filter-result-time';
        time.textContent = `🕒 ${result.time}`;
        metaDiv.appendChild(time);
    }
    
    metaDiv.appendChild(typeBadge);
    metaDiv.appendChild(price);
    metaDiv.appendChild(rating);
    
    infoDiv.appendChild(title);
    infoDiv.appendChild(description);
    infoDiv.appendChild(metaDiv);
    
    item.appendChild(imageDiv);
    item.appendChild(infoDiv);
    
    item.addEventListener('click', () => {
        if (result.modalId) {
            const modal = document.getElementById(result.modalId);
            if (modal) {
                const resultsModal = document.querySelector('.filter-results-modal');
                if (resultsModal) {
                    resultsModal.classList.remove('show');
                }
                
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                
                const gallery = modal.querySelector('.gallery');
                if (gallery) {
                    initGallery(gallery);
                }
                
                const mapContainer = modal.querySelector('.yandex-map');
                if (mapContainer) {
                    // Проверяем, есть ли список мест в этом модальном окне
                    const placesList = modal.querySelector('.places-list');
                    if (placesList) {
                        setTimeout(() => {
                            initPlacesList(placesList);
                        }, 100);
                    } else {
                        initYandexMap(mapContainer);
                    }
                }
            }
        }
    });
    
    return item;
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
function getConceptName(concept) {
    const names = {
        'concert': 'Концерты',
        'spektakl': 'Спектакли',
        'cinema': 'Кино',
        'master_class': 'Мастер-классы',
        'kvart': 'Квартирники',
        'vstrecha': 'Встречи'
    };
    return names[concept] || concept;
}

function getTimeName(time) {
    const names = {
        'morning': 'Утро',
        'afternoon': 'День',
        'evening': 'Вечер'
    };
    return names[time] || '';
}

function getCuisineName(cuisine) {
    const names = {
        'asian': 'Азиатская кухня',
        'caucasian': 'Кавказская кухня',
        'gruz': 'Грузинская кухня',
        'italian': 'Итальянская кухня',
        'frank': 'Французская кухня',
        'vostochnaya': 'Восточная кухня',
        'russian': 'Русская кухня',
        'sred': 'Средиземноморская кухня',
        'izrail': 'Израильская кухня',
        'smesh': 'Смешанная кухня'
    };
    return names[cuisine] || cuisine;
}

function getActiveCategoryName(category) {
    const names = {
        'skiing-snowboarding': '⛷️ Лыжи и 🏂 Сноуборд',
        'skating': '⛸️ Коньки',
        'trampoline': '🤸 Батуты',
        'swimming-pools': '🏊 Бассейны',
        'fitness-center': '💪 Фитнес-залы',
        'amusement-parks': '🎡 Парки аттракционов',
        'tourist-complexes': '🎡 Туристические комплексы',
        'sports-complex': '🎯 Спортивные комплексы',
        'quests': '🔍 Квесты',
        'shooting': '🔫 Стрельба',
        'karting': '🏎️ Картинг'
    };
    return names[category] || category;
}

// Функция для показа простого сообщения
function showSimpleMessage(text) {
    const message = document.createElement('div');
    message.className = 'info-message';
    message.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(45, 27, 71, 0.95);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            border-left: 4px solid #9370db;
            z-index: 3000;
            max-width: 300px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
        ">
            ${text}
        </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            document.body.removeChild(message);
        }
    }, 3000);
}

// Функция инициализации слайдеров изображений
function initImageSliders() {
    document.querySelectorAll('.image-slider').forEach(slider => {
        const images = slider.querySelectorAll('img');
        if (images.length > 1) {
            let currentIndex = 0;
            
            // Активируем первое изображение
            images[0].classList.add('active');
            
            // Автоматическая смена изображений каждые 5 секунд
            setInterval(() => {
                images[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].classList.add('active');
            }, 5000);
        }
    });
}

// Функция инициализации галереи в модальном окне
function initGallery(gallery) {
    const images = gallery.querySelectorAll('img');
    const prevBtn = gallery.querySelector('.prev-button');
    const nextBtn = gallery.querySelector('.next-button');
    
    if (images.length <= 1) return;
    
    let currentIndex = 0;
    
    // Показываем первое изображение
    images[0].classList.add('active');
    
    // Функция показа изображения
    function showImage(index) {
        images.forEach(img => img.classList.remove('active'));
        images[index].classList.add('active');
        currentIndex = index;
    }
    
    // Кнопка "назад"
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = images.length - 1;
            showImage(newIndex);
        });
    }
    
    // Кнопка "вперед"
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            let newIndex = currentIndex + 1;
            if (newIndex >= images.length) newIndex = 0;
            showImage(newIndex);
        });
    }
    
    // Автоматическая смена изображений
    const interval = setInterval(() => {
        if (document.querySelector('.modal-details:not(.hidden)')) {
            let newIndex = currentIndex + 1;
            if (newIndex >= images.length) newIndex = 0;
            showImage(newIndex);
        }
    }, 4000);
    
    // Очистка интервала при закрытии модального окна
    const modal = gallery.closest('.modal-details');
    if (modal) {
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            const originalClick = closeBtn.onclick;
            closeBtn.onclick = function() {
                clearInterval(interval);
                if (originalClick) originalClick.call(this);
            };
        }
    }
}

// ==================== ЯНДЕКС КАРТЫ ====================
function initYandexMap(container) {
    console.log("🗺️ Инициализация Яндекс Карты для:", container.id);
    
    // Проверяем, есть ли данные для карты
    const lat = container.getAttribute('data-lat');
    const lon = container.getAttribute('data-lon');
    const title = container.getAttribute('data-title');
    const address = container.getAttribute('data-address');
    
    if (!lat || !lon) {
        console.warn("Нет координат для карты:", container.id);
        return;
    }
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Создаем карту
    ymaps.ready(function() {
        try {
            var myMap = new ymaps.Map(container.id, {
                center: [parseFloat(lat), parseFloat(lon)],
                zoom: 16,
                controls: ['zoomControl', 'fullscreenControl']
            });
            
            // Добавляем метку
            var myPlacemark = new ymaps.Placemark([parseFloat(lat), parseFloat(lon)], {
                hintContent: title,
                balloonContent: `
                    <div class="map-balloon-content">
                        <h3 style="color: #000000ff; margin-bottom: 10px;">${title}</h3>
                        <p style="margin: 5px 0; color: #333;">${address}</p>
                    </div>
                `
            }, {
                iconLayout: 'default#image',
                iconImageHref: 'https://cdn1.iconfinder.com/data/icons/user-interface-solid-5/32/UI_solid-09-1024.png',
                iconImageSize: [40, 40],
                iconImageOffset: [-20, -40]
            });
            
            myMap.geoObjects.add(myPlacemark);
            
            console.log("✅ Карта создана:", container.id);
        } catch (error) {
            console.error("Ошибка создания карты:", error);
            container.innerHTML = `
                <div style="
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(45, 27, 71, 0.8);
                    color: #e6e0ff;
                    font-style: italic;
                    border-radius: 10px;
                ">
                    <p>Карта временно недоступна</p>
                </div>
            `;
        }
    });
}

// Добавляем анимацию для сообщений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .modal-details:not(.hidden) {
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    /* Стили для модального окна результатов */
    .filter-results-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(20, 0, 40, 0.97);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s ease;
        padding: 20px;
        backdrop-filter: blur(5px);
    }
    
    .filter-results-modal.show {
        opacity: 1;
        visibility: visible;
    }
    
    .filter-results-content {
        background: rgba(45, 27, 71, 0.98);
        padding: 40px;
        border-radius: 25px;
        box-shadow: 0 30px 60px rgba(75, 0, 130, 0.5);
        width: 95%;
        max-width: 1200px;
        max-height: 85vh;
        overflow-y: auto;
        position: relative;
        border: 2px solid #9370db;
    }
    
    .filter-results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #7b68ee;
    }
    
    .filter-results-header h2 {
        color: #b19cd9;
        font-size: 2.3em;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        margin: 0;
    }
    
    .filter-results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 30px;
        margin-top: 20px;
    }
    
    .filter-result-item {
        background: rgba(30, 0, 60, 0.8);
        border-radius: 15px;
        overflow: hidden;
        transition: all 0.3s ease;
        border: 1px solid rgba(147, 112, 219, 0.3);
        cursor: pointer;
    }
    
    .filter-result-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(147, 112, 219, 0.3);
        border-color: #9370db;
    }
    
    .filter-result-image {
        width: 100%;
        height: 200px;
        overflow: hidden;
    }
    
    .filter-result-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }
    
    .filter-result-item:hover .filter-result-image img {
        transform: scale(1.05);
    }
    
    .filter-result-info {
        padding: 20px;
    }
    
    .filter-result-info h3 {
        color: #b19cd9;
        margin-bottom: 10px;
        font-size: 1.4em;
    }
    
    .filter-result-info p {
        color: #e6e0ff;
        margin-bottom: 15px;
        font-size: 1em;
        line-height: 1.5;
    }
    
    .filter-result-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid rgba(147, 112, 219, 0.2);
    }
    
    .filter-result-price {
        color: #9370db;
        font-weight: bold;
        font-size: 1.1em;
    }
    
    .filter-result-rating {
        color: #ffd700;
        font-weight: bold;
    }
    
    .filter-results-close {
        background: #8b0000;
        color: white;
        border: none;
        padding: 12px 24px;
        cursor: pointer;
        border-radius: 8px;
        font-weight: bold;
        font-size: 1em;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    
    .filter-results-close:hover {
        background: #b22222;
        transform: scale(1.05);
    }
    
    /* Стили для списка кинотеатров */
    .cinemas-list {
        list-style: none;
        padding: 10px;
        margin: 15px 0;
        background: rgba(30, 0, 60, 0.5);
        border-radius: 10px;
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid rgba(147, 112, 219, 0.3);
    }
    
    .cinemas-list li {
        padding: 12px 15px;
        margin: 5px 0;
        background: rgba(45, 27, 71, 0.7);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #e6e0ff;
        border: 1px solid transparent;
    }
    
    .cinemas-list li:hover {
        background: rgba(147, 112, 219, 0.2);
        border-color: rgba(147, 112, 219, 0.5);
        transform: translateX(5px);
    }
    
    .cinemas-list li.active {
        background: rgba(147, 112, 219, 0.3);
        border-color: #9370db;
        color: #fff;
        font-weight: bold;
        box-shadow: 0 0 15px rgba(147, 112, 219, 0.3);
    }
    
    .cinemas-list li.active:before {
        content: '▶';
        margin-right: 8px;
        color: #9370db;
    }
    
    /* Стили для карты кинотеатра */
    .yandex-map.cinema-map {
        height: 350px;
        border-radius: 10px;
        overflow: hidden;
        border: 2px solid #9370db;
        margin-top: 10px;
    }
`;

document.head.appendChild(style);

console.log("✅ Полная функциональность фильтрации загружена");

// Управление z-index кнопок фильтрации
function manageFilterButtonsZIndex() {
    const filterButtons = document.querySelectorAll('.filter-toggle, .apply-filters, .reset-filters');
    const hasOpenModal = document.querySelector('.modal-details:not(.hidden)') || 
                         document.querySelector('.filter-results-modal.show');
    
    if (hasOpenModal) {
        // Уменьшаем z-index при открытых модальных окнах
        filterButtons.forEach(btn => {
            btn.style.zIndex = '100';
        });
    } else {
        // Восстанавливаем нормальный z-index
        filterButtons.forEach(btn => {
            btn.style.zIndex = '999';
        });
    }
}

// Вызываем функцию при открытии/закрытии модальных окон
document.querySelectorAll('.btn-detail, .close-modal, .filter-results-close').forEach(element => {
    element.addEventListener('click', function() {
        setTimeout(manageFilterButtonsZIndex, 100);
    });
});

// Также вызываем при изменении DOM
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'class')) {
            manageFilterButtonsZIndex();
        }
    });
});

// Наблюдаем за модальными окнами
document.querySelectorAll('.modal-details, .filter-results-modal').forEach(modal => {
    observer.observe(modal, { attributes: true });
});

// Вызываем при загрузке
document.addEventListener('DOMContentLoaded', manageFilterButtonsZIndex);
