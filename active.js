document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Страница активного отдыха загружена");

    // ========== ГАМБУРГЕР-МЕНЮ ==========
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // 1. ИНИЦИАЛИЗАЦИЯ СЛАЙДЕРОВ ФИЛЬТРОВ
    function initFilterSliders() {
        const costSlider = document.getElementById('cost');
        const costValue = document.getElementById('cost-value');
        
        if (costSlider && costValue) {
            const formatPrice = (value) => {
                return value === '10000' ? '10000+ руб' : value + ' руб';
            };
            
            costValue.textContent = formatPrice(costSlider.value);
            costSlider.addEventListener('input', function() {
                costValue.textContent = formatPrice(this.value);
            });
        }
    }
    
    // 2. ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ВРЕМЕНИ РАБОТЫ МЕСТА
    function getPlaceTime(placeElement) {
        return placeElement.getAttribute('data-time') || 'Время не указано';
    }
    
    // 3. ФУНКЦИЯ ДЛЯ ОПРЕДЕЛЕНИЯ ВРЕМЕННОГО ИНТЕРВАЛА ИЗ ВРЕМЕНИ РАБОТЫ
    function getTimeCategoryFromWorkHours(timeString) {
        if (!timeString || timeString === 'Время не указано') return null;
        
        // Парсим время работы вида "10:00-22:00"
        const match = timeString.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);
        if (!match) return null;
        
        const openHour = parseInt(match[1]);
        
        // Определяем временной интервал на основе времени открытия
        if (openHour >= 6 && openHour < 12) {
            return 'morning'; // Утро: 6:00 - 11:59
        } else if (openHour >= 12 && openHour < 18) {
            return 'day'; // День: 12:00 - 17:59
        } else if (openHour >= 18 && openHour < 23) {
            return 'evening'; // Вечер: 18:00 - 22:59
        } else if (openHour >= 23 || openHour < 6) {
            return 'night'; // Ночь: 23:00 - 5:59
        }
        
        return null;
    }
    
    // 4. ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ВРЕМЕНИ ИЗ МОДАЛЬНОГО ОКНА
    function getPlaceTimeFromModal(modal) {
        // Пробуем найти время в списке мест
        const activePlace = modal.querySelector('.place-item.active');
        if (activePlace) {
            const timeText = activePlace.getAttribute('data-time');
            if (timeText) return timeText;
        }
        
        // Ищем время в информации модального окна
        const timeElem = modal.querySelector('#current-place-time');
        if (timeElem) {
            return timeElem.textContent;
        }
        
        return null;
    }
    
    // 5. ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ЦЕНЫ ИЗ МОДАЛЬНОГО ОКНА (ИСПРАВЛЕННАЯ)
    function getPlacePrice(modal) {
        // Пробуем найти цену в списке мест
        const activePlace = modal.querySelector('.place-item.active');
        if (activePlace) {
            const priceText = activePlace.getAttribute('data-price');
            if (priceText) {
                // Ищем все числа в тексте цены (например, "1500-3000 руб")
                const matches = priceText.match(/\d+/g);
                if (matches && matches.length > 0) {
                    // Берем минимальную цену из диапазона
                    const prices = matches.map(match => parseInt(match));
                    return Math.min(...prices);
                }
            }
        }
        
        // Ищем цену в информации модального окна
        const priceElem = modal.querySelector('#current-place-price');
        if (priceElem) {
            const priceText = priceElem.textContent;
            const matches = priceText.match(/\d+/g);
            if (matches && matches.length > 0) {
                const prices = matches.map(match => parseInt(match));
                return Math.min(...prices);
            }
        }
        
        return null;
    }
    
    // 6. ОБРАБОТКА ОТКРЫТИЯ МОДАЛЬНОГО ОКНА АКТИВНОГО ОТДЫХА
    document.querySelectorAll('.btn-detail').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('href');
            if (!modalId || modalId === '#') return;
            
            const fullModalId = modalId.startsWith('#') ? modalId.substring(1) : modalId;
            const modalDetails = document.getElementById(fullModalId);
            
            if (modalDetails) {
                console.log(`📱 Открываем модальное окно активного отдыха: ${fullModalId}`);
                modalDetails.classList.remove('hidden');
                modalDetails.classList.add('visible');
                document.body.style.overflow = 'hidden';
                
                // Инициализация галереи для активного отдыха
                const gallery = modalDetails.querySelector('.gallery');
                if (gallery) {
                    initGallery(gallery);
                }
                
                // Инициализация списка мест
                const placesList = modalDetails.querySelector('.places-list');
                if (placesList) {
                    initPlacesList(placesList);
                } else {
                    // Если это обычная карта (без списка мест)
                    const mapElement = modalDetails.querySelector('.yandex-map');
                    if (mapElement && !mapElement.dataset.initialized) {
                        initYandexMap(mapElement);
                    }
                }
            } else {
                console.error('❌ Нет соответствующего модального окна:', fullModalId);
            }
        });
    });
    
    // 7. ИНИЦИАЛИЗАЦИЯ СПИСКА МЕСТ ДЛЯ АКТИВНОГО ОТДЫХА
    function initPlacesList(placesList) {
        const listItems = placesList.querySelectorAll('.place-item');
        const mapElement = placesList.closest('.modal-content').querySelector('.yandex-map');
        
        if (!mapElement) return;
        
        // Обработчики для выбора мест
        listItems.forEach(item => {
            item.addEventListener('click', function() {
                // Убираем активный класс у всех
                listItems.forEach(i => i.classList.remove('active'));
                
                // Добавляем активный класс текущему
                this.classList.add('active');
                
                // Получаем данные
                const placeId = this.getAttribute('data-place-id');
                const lat = parseFloat(this.getAttribute('data-lat'));
                const lon = parseFloat(this.getAttribute('data-lon'));
                const title = this.getAttribute('data-title');
                const address = this.getAttribute('data-address');
                const price = this.getAttribute('data-price');
                const rating = this.getAttribute('data-rating');
                const description = this.getAttribute('data-description');
                const time = this.getAttribute('data-time');
                const images = JSON.parse(this.getAttribute('data-images') || '[]');
                
                // Обновляем информацию в модальном окне
                updateModalInfo(this.closest('.modal-content'), {
                    title: title,
                    address: address,
                    price: price,
                    rating: rating,
                    description: description,
                    time: time
                });
                
                // Обновляем галерею
                updateGallery(images, placeId, this.closest('.modal-content').querySelector('.gallery'));
                
                // Обновляем карту
                updateMap(mapElement, lat, lon, title, address);
                
                // Сохраняем в localStorage для обновления карточки на главной
                const modalId = this.closest('.modal-details').id;
                const category = getCategoryFromModalId(modalId);
                
                if (category) {
                    localStorage.setItem('selectedSportPlace', JSON.stringify({
                        category: category,
                        placeId: placeId,
                        image: images[0],
                        title: getActivityTitle(modalId) + ' - ' + title
                    }));
                }
            });
        });
        
        // Активируем первый элемент
        if (listItems.length > 0) {
            listItems[0].click();
        }
    }
    
    // 8. ФУНКЦИЯ ОБНОВЛЕНИЯ ИНФОРМАЦИИ В МОДАЛЬНОМ ОКНЕ
    function updateModalInfo(modalContent, data) {
        // Обновляем основные поля
        const titleElem = modalContent.querySelector('#current-place-title');
        const addressElem = modalContent.querySelector('#current-place-address');
        const priceElem = modalContent.querySelector('#current-place-price');
        const ratingElem = modalContent.querySelector('#current-place-rating');
        const descElem = modalContent.querySelector('#current-place-description');
        const timeElem = modalContent.querySelector('#current-place-time');
        
        if (titleElem) titleElem.textContent = data.title;
        if (addressElem) addressElem.textContent = data.address;
        if (priceElem) priceElem.textContent = data.price;
        if (ratingElem) ratingElem.textContent = data.rating;
        if (descElem) descElem.textContent = data.description;
        if (timeElem) timeElem.textContent = data.time;
    }
    
    // 9. ОБНОВЛЕНИЕ ГАЛЕРЕИ
    function updateGallery(images, placeId, galleryElement) {
        if (!galleryElement) return;
        
        galleryElement.innerHTML = '';
        
        images.forEach((imgSrc, index) => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = 'Фото ' + placeId;
            img.setAttribute('data-sport-place', placeId);
            if (index === 0) img.classList.add('active');
            galleryElement.appendChild(img);
        });
        
        // Инициализируем галерею заново
        initGallery(galleryElement);
    }
    
    // 10. ОБНОВЛЕНИЕ КАРТЫ
    function updateMap(mapElement, lat, lon, title, address) {
        if (!mapElement || !lat || !lon) return;
        
        // Очищаем контейнер
        mapElement.innerHTML = '';
        
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
                ">
                    <p>Карта временно недоступна</p>
                </div>
            `;
            return;
        }
        
        ymaps.ready(function() {
            try {
                const map = new ymaps.Map(mapElement.id, {
                    center: [lat, lon],
                    zoom: 15,
                    controls: ['zoomControl', 'fullscreenControl']
                });
                
                // Добавляем метку
                const placemark = new ymaps.Placemark([lat, lon], {
                    hintContent: title,
                    balloonContent: `
                        <div class="map-balloon-content">
                            <h3 style="color: #0e0e0eff; margin-bottom: 10px;">${title}</h3>
                            <p style="margin: 5px 0; color: #333;">${address}</p>
                        </div>
                    `
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: 'https://cdn1.iconfinder.com/data/icons/user-interface-solid-5/32/UI_solid-09-1024.png',
                    iconImageSize: [40, 40],
                    iconImageOffset: [-20, -40]
                });
                
                map.geoObjects.add(placemark);
                placemark.balloon.open();
                
                console.log("✅ Карта обновлена для:", title);
            } catch (error) {
                console.error("Ошибка обновления карты:", error);
            }
        });
    }
    
    // 11. ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ КАТЕГОРИИ ИЗ ID МОДАЛЬНОГО ОКНА
    function getCategoryFromModalId(modalId) {
        const mapping = {
            'skiing-details': 'skiing-snowboarding',
            'skating-details': 'skating',
            'trampoline-details': 'trampoline',
            'sports-complex-details': 'sports-complex',
            'swimming-pools-details': 'swimming-pools',
            'fitness-center-details': 'fitness-center',
            'amusement-parks-details': 'amusement-parks',
            'tourist-complexes-details': 'tourist-complexes',
            'quests-details': 'quests',
            'shooting-details': 'shooting',
            'karting-details': 'karting',
            'other-activities-details': 'other-activities'
        };
        
        return mapping[modalId] || null;
    }
    
    // 12. ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ НАЗВАНИЯ АКТИВНОСТИ
    function getActivityTitle(modalId) {
        const mapping = {
            'skiing-details': 'Катание на лыжах и сноуборде',
            'skating-details': 'Катание на коньках',
            'trampoline-details': 'Батутные центры',
            'sports-complex-details': 'Спортивные комплексы',
            'swimming-pools-details': 'Бассейн',
            'fitness-center-details': 'Фитнес-залы',
            'amusement-parks-details': 'Парки аттракционов',
            'tourist-complexes-details': 'Туристические комплексы',
            'quests-details': 'Квесты',
            'shooting-details': 'Стрельба и метание',
            'karting-details': 'Картинг и вождение',
            'other-activities-details': 'Другие активности'
        };
        
        return mapping[modalId] || 'Активный отдых';
    }
    
    // 13. ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal-details');
            closeModal(modal);
        });
    });
    
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('visible');
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            console.log("📱 Модальное окно закрыто");
        }
    }
    
    // 14. ОБРАБОТКА КЛАВИШИ ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal-details.visible');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
    
    // 15. ФИЛЬТРАЦИЯ МЕРОПРИЯТИЙ ДЛЯ АКТИВНОГО ОТДЫХА
    const filterToggle = document.querySelector('.filter-toggle');
    const filterDropdown = document.querySelector('.filter-dropdown');
    
    if (filterToggle && filterDropdown) {
        filterToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            filterDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', function(e) {
            if (filterDropdown && !filterDropdown.contains(e.target) && 
                !filterToggle.contains(e.target) && 
                filterDropdown.classList.contains('show')) {
                filterDropdown.classList.remove('show');
            }
        });
        
        // Кнопка применения фильтров
        const applyFilters = document.querySelector('.apply-filters');
        if (applyFilters) {
            applyFilters.addEventListener('click', function() {
                console.log('🔘 Применение фильтров активного отдыха');
                applyActiveFilters();
                filterDropdown.classList.remove('show');
            });
        }
        
        // Кнопка сброса фильтров
        const resetFilters = document.querySelector('.reset-filters');
        if (resetFilters) {
            resetFilters.addEventListener('click', function() {
                console.log('🔄 Сброс фильтров активного отдыха');
                
                // Сброс значений фильтров
                document.querySelectorAll('.filter-dropdown select').forEach(select => {
                    select.selectedIndex = 0;
                });
                
                // Сброс слайдера стоимости
                const costSlider = document.getElementById('cost');
                const costValue = document.getElementById('cost-value');
                if (costSlider && costValue) {
                    costSlider.value = 5000;
                    costValue.textContent = '5000 руб';
                }
                
                // Показать все карточки
                document.querySelectorAll('.event-grid > div').forEach(card => {
                    card.style.display = 'block';
                });
                
                showSimpleMessage('Фильтры активного отдыха сброшены');
            });
        }
    }
    
    // 16. ФУНКЦИЯ ФИЛЬТРАЦИИ АКТИВНОГО ОТДЫХА (ИСПРАВЛЕННАЯ ДЛЯ ВРЕМЕНИ И ЦЕНЫ)
    function applyActiveFilters() {
        console.log("🔄 Применяем фильтры активного отдыха...");
        
        // Получаем значения фильтров
        const categoryFilter = document.querySelector("#category")?.value || 'all';
        const timeFilter = document.querySelector("#time")?.value || 'all';
        const ageFilter = document.querySelector("#age")?.value || 'all';
        const costFilter = parseInt(document.querySelector("#cost")?.value || 10000); // Максимальная цена
        
        console.log("Фильтры активного отдыха:");
        console.log("- Категория:", categoryFilter);
        console.log("- Время:", timeFilter);
        console.log("- Возраст:", ageFilter);
        console.log("- Максимальная цена:", costFilter);
        
        let visibleCards = 0;
        
        // Применяем фильтры к карточкам
        document.querySelectorAll('.event-grid > div').forEach(card => {
            const category = card.className.split(' ')[0];
            let shouldShow = true;
            
            // Фильтр по категории
            if (categoryFilter !== 'all' && category !== categoryFilter) {
                shouldShow = false;
            }
            
            // Фильтр по времени
            if (shouldShow && timeFilter !== 'all') {
                const modalLink = card.querySelector('.btn-detail');
                if (modalLink) {
                    const modalId = modalLink.getAttribute('href').substring(1);
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        const timeData = getPlaceTimeFromModal(modal);
                        const timeCategory = getTimeCategoryFromWorkHours(timeData);
                        
                        console.log(`Карточка: ${category}, Время: ${timeData}, Категория времени: ${timeCategory}`);
                        
                        if (timeCategory !== timeFilter) {
                            shouldShow = false;
                        }
                    }
                }
            }
            
            // Фильтр по цене (ИСПРАВЛЕННЫЙ)
            if (shouldShow && costFilter < 10000) {
                const modalLink = card.querySelector('.btn-detail');
                if (modalLink) {
                    const modalId = modalLink.getAttribute('href').substring(1);
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        const price = getPlacePrice(modal);
                        console.log(`Карточка: ${category}, Цена: ${price}, Лимит: ${costFilter}`);
                        
                        // Если цена найдена и превышает фильтр
                        if (price !== null && price > costFilter) {
                            shouldShow = false;
                        }
                    }
                }
            }
            
            card.style.display = shouldShow ? 'block' : 'none';
            if (shouldShow) visibleCards++;
        });
        
        console.log(`✅ Показано карточек: ${visibleCards}`);
        
        if (visibleCards === 0) {
            showSimpleMessage('По вашему запросу ничего не найдено. Попробуйте изменить параметры фильтрации.');
        } else {
            showSimpleMessage(`Найдено ${visibleCards} мероприятий`);
        }
    }
    
    // 17. ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ГАЛЕРЕИ
    function initGallery(gallery) {
        const images = gallery.querySelectorAll('img');
        if (images.length <= 1) return;
        
        let currentIndex = 0;
        
        // Показываем первое изображение
        images[0].classList.add('active');
        
        // Создаем кнопки навигации если их нет
        if (!gallery.querySelector('.prev-button') || !gallery.querySelector('.next-button')) {
            const prevButton = document.createElement('button');
            prevButton.className = 'prev-button';
            prevButton.innerHTML = '‹';
            prevButton.style.cssText = `
                position: absolute;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(45, 27, 71, 0.8);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 24px;
                z-index: 10;
            `;
            
            const nextButton = document.createElement('button');
            nextButton.className = 'next-button';
            nextButton.innerHTML = '›';
            nextButton.style.cssText = `
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(45, 27, 71, 0.8);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 24px;
                z-index: 10;
            `;
            
            gallery.appendChild(prevButton);
            gallery.appendChild(nextButton);
            
            function showImage(index) {
                images.forEach(img => img.classList.remove('active'));
                images[index].classList.add('active');
                currentIndex = index;
            }
            
            prevButton.addEventListener('click', function() {
                let newIndex = currentIndex - 1;
                if (newIndex < 0) newIndex = images.length - 1;
                showImage(newIndex);
            });
            
            nextButton.addEventListener('click', function() {
                let newIndex = currentIndex + 1;
                if (newIndex >= images.length) newIndex = 0;
                showImage(newIndex);
            });
        }
    }
    
    // 18. ИНИЦИАЛИЗАЦИЯ ЯНДЕКС КАРТ ДЛЯ ОБЫЧНЫХ МОДАЛЬНЫХ ОКОН
    function initYandexMap(mapElement) {
        const lat = mapElement.getAttribute('data-lat');
        const lon = mapElement.getAttribute('data-lon');
        const title = mapElement.getAttribute('data-title') || 'Место';
        const address = mapElement.getAttribute('data-address') || '';
        
        if (!lat || !lon) return;
        
        mapElement.dataset.initialized = 'true';
        
        if (typeof ymaps === 'undefined') {
            console.error('Yandex Maps API не загружена');
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
                            <h3 style="color: #050505ff; margin-bottom: 10px;">${title}</h3>
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
            } catch (error) {
                console.error("Ошибка создания карты:", error);
            }
        });
    }
    
    // 19. ФУНКЦИЯ ПОКАЗА ПРОСТОГО СООБЩЕНИЯ
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
    
    // 20. ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ПРОВЕРЯЕМ СОХРАНЕННЫЙ ВЫБОР МЕСТА
    window.addEventListener('load', function() {
        const savedPlace = localStorage.getItem('selectedSportPlace');
        if (savedPlace) {
            const placeData = JSON.parse(savedPlace);
            
            // Находим карточку и обновляем ее
            const card = document.querySelector(`.${placeData.category} .event-item`);
            if (card) {
                // Обновляем изображение
                const img = card.querySelector('img');
                if (img && placeData.image) {
                    img.src = placeData.image;
                    img.alt = placeData.title;
                }
                
                // Обновляем заголовок
                const title = card.querySelector('h3');
                if (title && placeData.title) {
                    title.textContent = placeData.title;
                }
            }
            
            // Очищаем сохраненные данные
            localStorage.removeItem('selectedSportPlace');
        }
    });
    
    // 21. ИНИЦИАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ
    function initAll() {
        console.log("🔄 Инициализация функций активного отдыха...");
        
        // Инициализация слайдеров фильтров
        initFilterSliders();
        
        // Инициализация всех списков мест
        document.querySelectorAll('.places-list').forEach(placesList => {
            initPlacesList(placesList);
        });
        
        // Инициализация обычных карт
        document.querySelectorAll('.yandex-map:not([data-initialized])').forEach(mapElement => {
            initYandexMap(mapElement);
        });
        
        console.log("✅ Все функции активного отдыха инициализированы");
        
        // Применяем мобильный макет если нужно
        applyMobileLayout();
    }
    
    // 22. ФУНКЦИЯ ПРИМЕНЕНИЯ МОБИЛЬНОГО МАКЕТА
    function applyMobileLayout() {
        if (window.innerWidth <= 768) {
            console.log("📱 Применяем мобильный макет активного отдыха...");
            
            const eventGrid = document.querySelector('.event-grid');
            if (eventGrid) {
                eventGrid.style.cssText = `
                    display: grid !important;
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 15px !important;
                    width: 100% !important;
                    margin: 0 auto !important;
                    padding: 10px !important;
                `;
            }
            
            document.querySelectorAll('.event-grid .container').forEach(container => {
                container.style.cssText = `
                    width: 100% !important;
                    margin: 0 !important;
                    margin-bottom: 0 !important;
                    break-inside: avoid !important;
                    page-break-inside: avoid !important;
                    -webkit-column-break-inside: avoid !important;
                    height: auto !important;
                    min-height: 320px !important;
                    display: flex !important;
                    flex-direction: column !important;
                `;
                
                const imageSlider = container.querySelector('.image-slider');
                if (imageSlider) {
                    imageSlider.style.cssText = `
                        height: 140px !important;
                        min-height: 140px !important;
                        max-height: 140px !important;
                        overflow: hidden !important;
                    `;
                    
                    const images = imageSlider.querySelectorAll('img');
                    images.forEach(img => {
                        img.style.cssText = `
                            height: 140px !important;
                            object-fit: cover !important;
                        `;
                    });
                }
                
                const title = container.querySelector('h3');
                if (title) {
                    title.style.cssText = `
                        font-size: 14px !important;
                        line-height: 1.3 !important;
                        margin: 8px 10px 5px 10px !important;
                        min-height: 36px !important;
                        height: 36px !important;
                        display: -webkit-box !important;
                        -webkit-line-clamp: 2 !important;
                        -webkit-box-orient: vertical !important;
                        overflow: hidden !important;
                        text-overflow: ellipsis !important;
                    `;
                }
                
                const button = container.querySelector('.btn-detail');
                if (button) {
                    button.style.cssText = `
                        margin: 0 10px 10px 10px !important;
                        padding: 8px 12px !important;
                        font-size: 12px !important;
                        min-height: 36px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                    `;
                }
            });
        }
    }
    
    // Запускаем инициализацию
    initAll();
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        setTimeout(applyMobileLayout, 100);
    });
    
    console.log("✅ Все обработчики активного отдыха установлены");
});

// Добавляем CSS анимацию
const activeStyle = document.createElement('style');
activeStyle.textContent = `
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
    
    .modal-details.hidden {
        display: none;
    }
    
    .modal-details.visible {
        display: flex;
    }
    
    .place-item {
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 12px 15px;
        margin: 8px 0;
        background: #5021a0;
        border: 2px solid #814cd6;
        border-radius: 6px;
    }

    .place-item:hover {
        background: #814cd6;
        border-color: #814cd6;
        transform: translateX(5px);
    }

    .place-item.active {
        background: #9883b8 !important;
        border-color: #814cd6 !important;
        box-shadow: 0 0 0 2px rgba(152, 18, 241, 0.1),
                    0 4px 12px rgba(152, 18, 241, 0.1) !important;
        color: #ffffff !important;
    }

    .place-item.active strong {
        color: #ffffff !important;
    }

    .place-item.active * {
        color: #fcfcfc !important;
    }
`;

document.head.appendChild(activeStyle);
console.log("✅ Функциональность активного отдыха загружена");
