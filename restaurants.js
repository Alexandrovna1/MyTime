document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Страница ресторанов загружена");
    
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

    // ==================== 1. ОСНОВНЫЕ ФУНКЦИИ ====================
    // 1.1 ИНИЦИАЛИЗАЦИЯ СЛАЙДЕРОВ КАРТОЧЕК
    function initCardSliders() {
        document.querySelectorAll('.image-slider').forEach(slider => {
            const images = slider.querySelectorAll('img');
            if (images.length <= 1) return;
            
            let currentIndex = 0;
            
            // Показываем первое изображение
            images.forEach((img, index) => {
                img.classList.toggle('active', index === 0);
            });
            
            // Автопрокрутка
            let slideInterval = setInterval(() => {
                images[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].classList.add('active');
            }, 3000);
            
            // Остановка при наведении
            slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
            slider.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => {
                    images[currentIndex].classList.remove('active');
                    currentIndex = (currentIndex + 1) % images.length;
                    images[currentIndex].classList.add('active');
                }, 3000);
            });
        });
    }
    
    // 1.2 ИНИЦИАЛИЗАЦИЯ ГАЛЕРЕИ МОДАЛЬНЫХ ОКОН
    function initModalGallery(gallery) {
        const images = gallery.querySelectorAll('img');
        const prevBtn = gallery.querySelector('.prev-button');
        const nextBtn = gallery.querySelector('.next-button');
        
        if (images.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            return;
        }
        
        let currentIndex = 0;
        
        function showImage(index) {
            images.forEach(img => {
                img.classList.remove('active');
                img.style.opacity = '0';
            });
            images[index].classList.add('active');
            images[index].style.opacity = '1';
            currentIndex = index;
        }
        
        showImage(0);
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                let newIndex = currentIndex - 1;
                if (newIndex < 0) newIndex = images.length - 1;
                showImage(newIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                let newIndex = currentIndex + 1;
                if (newIndex >= images.length) newIndex = 0;
                showImage(newIndex);
            });
        }
        
        let interval = setInterval(() => {
            let newIndex = currentIndex + 1;
            if (newIndex >= images.length) newIndex = 0;
            showImage(newIndex);
        }, 4000);
        
        gallery.addEventListener('mouseenter', () => clearInterval(interval));
        gallery.addEventListener('mouseleave', () => {
            interval = setInterval(() => {
                let newIndex = currentIndex + 1;
                if (newIndex >= images.length) newIndex = 0;
                showImage(newIndex);
            }, 4000);
        });
    }
    
    // 1.3 ОТКРЫТИЕ МОДАЛЬНОГО ОКНА
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error('❌ Модальное окно не найдено:', modalId);
            return;
        }
        
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('visible');
        }, 10);
        document.body.style.overflow = 'hidden';
        
        const gallery = modal.querySelector('.gallery');
        if (gallery) initModalGallery(gallery);
        
        const mapElement = modal.querySelector('.yandex-map');
        if (mapElement && !mapElement.dataset.initialized) {
            initYandexMap(mapElement);
        }
    }
    
    // 1.4 ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА
    function closeModal(modal) {
        modal.classList.remove('visible');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 400);
        document.body.style.overflow = 'auto';
    }
    
    // 1.5 ИНИЦИАЛИЗАЦИЯ ЯНДЕКС КАРТ
    function initYandexMap(mapElement) {
        const lat = mapElement.getAttribute('data-lat');
        const lon = mapElement.getAttribute('data-lon');
        const title = mapElement.getAttribute('data-title') || 'Ресторан';
        const address = mapElement.getAttribute('data-address') || '';
        
        if (!lat || !lon) {
            console.warn('❌ Нет координат для карты:', mapElement.id);
            return;
        }
        
        if (typeof ymaps === 'undefined') {
            console.error('Yandex Maps API не загружена');
            setTimeout(() => initYandexMap(mapElement), 1000);
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
                mapElement.dataset.initialized = 'true';
                console.log("✅ Карта создана:", mapElement.id);
            } catch (error) {
                console.error("Ошибка создания карты:", error);
            }
        });
    }
    
    // ==================== 2. ФИЛЬТРАЦИЯ (ПОЛНОСТЬЮ ПЕРЕРАБОТАННАЯ) ====================
    
    // 2.0 ДАННЫЕ О РЕСТОРАНАХ (добавляем недостающую информацию)
    const restaurantsData = {
        'tsarskoe-details': {
            cuisine: 'russian',
            price: 2000, // среднее значение
            rating: 5,
            workingHours: '12:00 - 23:00',
            workingHoursType: 'afternoon,evening'
        },
        'mivan-details': {
            cuisine: 'vostochnaya',
            price: 1950,
            rating: 4.9,
            workingHours: '12:00 - 23:00',
            workingHoursType: 'afternoon,evening'
        },
        'mamatoma-details': {
            cuisine: 'gruz',
            price: 1250,
            rating: 4.9,
            workingHours: '12:00 - 23:00',
            workingHoursType: 'afternoon,evening'
        },
        'mamaroma-details': {
            cuisine: 'italian',
            price: 1850,
            rating: 4.9,
            workingHours: '11:00 - 23:00',
            workingHoursType: 'morning,afternoon,evening'
        },
        'vasnetsov-details': {
            cuisine: 'russian',
            price: 2750,
            rating: 5,
            workingHours: '11:00 - 23:00',
            workingHoursType: 'morning,afternoon,evening'
        },
        'bliss-details': {
            cuisine: 'frank',
            price: 1350,
            rating: 5,
            workingHours: '8:00 - 12:00',
            workingHoursType: 'morning,afternoon'
        },
        'four-details': {
            cuisine: 'smesh',
            price: 4500,
            rating: 5,
            workingHours: 'Круглосуточно',
            workingHoursType: 'morning,afternoon,evening,late,24_7'
        },
        'kyrkyma-details': {
            cuisine: 'vostochnaya',
            price: 1200,
            rating: 5,
            workingHours: '12:00 - 23:00',
            workingHoursType: 'afternoon,evening'
        },
        'oikymena-details': {
            cuisine: 'smesh',
            price: 1250,
            rating: 5,
            workingHours: '9:00 - 23:00',
            workingHoursType: 'morning,afternoon,evening'
        },
        'sirnii-details': {
            cuisine: 'smesh',
            price: 1250,
            rating: 5,
            workingHours: '12:00 - 23:00',
            workingHoursType: 'afternoon,evening'
        },
        'agata-details': {
            cuisine: 'smesh',
            price: 1125,
            rating: 5,
            workingHours: '10:00 - 23:00',
            workingHoursType: 'morning,afternoon,evening'
        },
        'iaico-details': {
            cuisine: 'smesh',
            price: 1100,
            rating: 4.9,
            workingHours: '08:00 - 20:00',
            workingHoursType: 'morning,afternoon'
        },
        'shedrin-details': {
            cuisine: 'sred',
            price: 900,
            rating: 4.7,
            workingHours: '9:00 - 21:00',
            workingHoursType: 'morning,afternoon,evening'
        },
        'adjikyeli-details': {
            cuisine: 'smesh',
            price: 1800,
            rating: 4.7,
            workingHours: '12:00 - 23:00',
            workingHoursType: 'afternoon,evening'
        },
        'oblako-details': {
            cuisine: 'smesh',
            price: 1600,
            rating: 5,
            workingHours: '13:00 - 01:00',
            workingHoursType: 'afternoon,evening,late'
        },
        'shalom-details': {
            cuisine: 'izrail',
            price: 1700,
            rating: 4.9,
            workingHours: '12:00 - 21:00',
            workingHoursType: 'afternoon,evening'
        },
        'si-details': {
            cuisine: 'sred',
            price: 2250,
            rating: 5,
            workingHours: '12:00 - 23:00',
            workingHoursType: 'afternoon,evening'
        },
        'aromaroomsbar-details': {
            cuisine: 'russian',
            price: 1700,
            rating: 4.8,
            workingHours: '12:00 - 01:00',
            workingHoursType: 'afternoon,evening,late'
        },
        'vasia-details': {
            cuisine: 'russian',
            price: 1000,
            rating: 5,
            workingHours: '12:00 - 00:00',
            workingHoursType: 'afternoon,evening,late'
        }
    };
    
    function setupFilters() {
        console.log("🔄 Настройка фильтров для ресторанов...");
        
        // Находим элементы
        const filterToggle = document.querySelector('.filter-toggle');
        const filterDropdown = document.querySelector('.filter-dropdown');
        const resetBtn = document.querySelector('.reset-filters');
        const applyBtn = document.querySelector('.apply-filters');
        
        console.log("Найдены элементы:", {
            filterToggle: !!filterToggle,
            filterDropdown: !!filterDropdown,
            resetBtn: !!resetBtn,
            applyBtn: !!applyBtn
        });
        
        if (!filterToggle || !filterDropdown) {
            console.error('❌ Основные элементы фильтров не найдены');
            return;
        }
        
        // 2.1 ПРОСТОЙ И РАБОЧИЙ ОТКРЫТИЕ/ЗАКРЫТИЕ ФИЛЬТРОВ
        filterToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('🎯 Кнопка фильтрации нажата');
            
            // Переключаем класс .show
            if (filterDropdown.classList.contains('show')) {
                filterDropdown.classList.remove('show');
                console.log('📋 Меню фильтров закрыто');
            } else {
                filterDropdown.classList.add('show');
                console.log('📋 Меню фильтров открыто');
                
                // Убедимся что меню видимо
                filterDropdown.style.cssText = `
                    display: block !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    position: absolute !important;
                    top: 100% !important;
                    left: 50% !important;
                    transform: translateX(-50%) translateY(0) !important;
                    background: rgba(45, 27, 71, 0.98) !important;
                    backdrop-filter: blur(10px) !important;
                    padding: 25px !important;
                    border-radius: 15px !important;
                    box-shadow: 0 20px 40px rgba(75, 0, 130, 0.4) !important;
                    width: 350px !important;
                    z-index: 1002 !important;
                    margin-top: 10px !important;
                    border: 2px solid #9370db !important;
                `;
            }
        });
        
        // Закрытие при клике вне меню
        document.addEventListener('click', function(e) {
            if (filterDropdown.classList.contains('show') &&
                !filterDropdown.contains(e.target) && 
                !filterToggle.contains(e.target)) {
                filterDropdown.classList.remove('show');
                console.log('📋 Меню фильтров закрыто (клик вне)');
            }
        });
        
        // Закрытие по Esc
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && filterDropdown.classList.contains('show')) {
                filterDropdown.classList.remove('show');
                console.log('📋 Меню фильтров закрыто (Esc)');
            }
        });
        
        // 2.2 НАСТРОЙКА ЭЛЕМЕНТОВ ФИЛЬТРОВ
        
        // Слайдер цены
        const costSlider = document.getElementById('cost');
        const costValue = document.getElementById('cost-value');
        if (costSlider && costValue) {
            costSlider.addEventListener('input', function() {
                const value = parseInt(this.value);
                costValue.textContent = value + ' ₽';
                console.log(`💰 Установлен средний чек: ${value} ₽`);
            });
        }
        
        // Селекты
        const workingHoursSelect = document.getElementById('working-hours');
        const ratingSelect = document.getElementById('rating');
        const cuisineSelect = document.getElementById('restaurant-cuisine');
        
        // 2.3 ПРИМЕНЕНИЕ ФИЛЬТРОВ
        if (applyBtn) {
            applyBtn.addEventListener('click', function() {
                console.log('🔍 Применяем фильтры...');
                
                // Закрываем меню фильтров - УСИЛЕННАЯ ВЕРСИЯ
                filterDropdown.classList.remove('show');
                filterDropdown.style.display = 'none';
                filterDropdown.style.opacity = '0';
                filterDropdown.style.visibility = 'hidden';
                
                // Получаем значения
                const workingHours = workingHoursSelect ? workingHoursSelect.value : '';
                const maxPrice = costSlider ? parseInt(costSlider.value) : 5000;
                const minRating = ratingSelect ? parseFloat(ratingSelect.value) : 0;
                const cuisine = cuisineSelect ? cuisineSelect.value : '';
                
                console.log(`Параметры фильтрации:
                    🕒 Время работы: ${workingHours || 'Любое'}
                    💰 Макс. чек: ${maxPrice} ₽
                    ⭐ Мин. рейтинг: ${minRating > 0 ? minRating + '+' : 'Любой'}
                    🍽️ Кухня: ${cuisine || 'Любая'}
                `);
                
                // Фильтруем рестораны и показываем результаты в модальном окне
                showFilterResults({
                    workingHours,
                    maxPrice,
                    minRating,
                    cuisine
                });
            });
        }
        
        // 2.4 СБРОС ФИЛЬТРОВ
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                console.log('🔄 Сбрасываем фильтры');
                
                // Сброс селектов
                if (workingHoursSelect) workingHoursSelect.selectedIndex = 0;
                if (ratingSelect) ratingSelect.selectedIndex = 0;
                if (cuisineSelect) cuisineSelect.selectedIndex = 0;
                
                // Сброс слайдера
                if (costSlider && costValue) {
                    costSlider.value = 5000;
                    costValue.textContent = '5000 ₽';
                }
                
                // Закрываем меню фильтров - УСИЛЕННАЯ ВЕРСИЯ
                filterDropdown.classList.remove('show');
                filterDropdown.style.display = 'none';
                filterDropdown.style.opacity = '0';
                filterDropdown.style.visibility = 'hidden';
                
                // Показываем все рестораны
                document.querySelectorAll('.event-list > div').forEach(item => {
                    item.style.display = 'block';
                });
                
                // Показываем уведомление в правом верхнем углу (как у мероприятий)
                showSimpleMessage('Фильтры ресторанов сброшены');
                
                // Закрываем окно результатов если открыто
                const resultsModal = document.querySelector('.filter-results-modal.show');
                if (resultsModal) {
                    resultsModal.classList.remove('show');
                    document.body.style.overflow = 'auto';
                }
                
                console.log('✅ Все фильтры сброшены');
            });
        }
        
        // 2.5 ФУНКЦИЯ ПОКАЗА РЕЗУЛЬТАТОВ ФИЛЬТРАЦИИ
        function showFilterResults(filters) {
            console.log('🔍 Фильтруем рестораны...');
            
            const restaurantItems = document.querySelectorAll('.event-list > div');
            const filteredResults = [];
            
            restaurantItems.forEach(item => {
                // Находим ID модального окна для этого ресторана
                const detailBtn = item.querySelector('.btn-detail');
                if (!detailBtn) return;
                
                const href = detailBtn.getAttribute('href');
                if (!href || !href.startsWith('#')) return;
                
                const modalId = href.substring(1);
                const restaurantDataItem = restaurantsData[modalId];
                
                if (!restaurantDataItem) {
                    console.warn(`❌ Нет данных для ресторана: ${modalId}`);
                    return;
                }
                
                let passesFilters = true;
                
                // 1. Фильтр по кухне
                if (filters.cuisine && filters.cuisine !== '') {
                    if (restaurantDataItem.cuisine !== filters.cuisine) {
                        passesFilters = false;
                    }
                }
                
                // 2. Фильтр по цене
                if (passesFilters && restaurantDataItem.price > filters.maxPrice) {
                    passesFilters = false;
                }
                
                // 3. Фильтр по рейтингу
                if (passesFilters && filters.minRating > 0) {
                    if (restaurantDataItem.rating < filters.minRating) {
                        passesFilters = false;
                    }
                }
                
                // 4. Фильтр по времени работы
                if (passesFilters && filters.workingHours && filters.workingHours !== '') {
                    if (filters.workingHours === '24_7') {
                        // Круглосуточно
                        if (!restaurantDataItem.workingHoursType.includes('24_7') && 
                            restaurantDataItem.workingHours !== 'Круглосуточно') {
                            passesFilters = false;
                        }
                    } else if (filters.workingHours === 'morning') {
                        // Утро (до 12:00)
                        if (!restaurantDataItem.workingHoursType.includes('morning')) {
                            passesFilters = false;
                        }
                    } else if (filters.workingHours === 'afternoon') {
                        // День (12:00-18:00)
                        if (!restaurantDataItem.workingHoursType.includes('afternoon')) {
                            passesFilters = false;
                        }
                    } else if (filters.workingHours === 'evening') {
                        // Вечер (после 18:00)
                        if (!restaurantDataItem.workingHoursType.includes('evening')) {
                            passesFilters = false;
                        }
                    } else if (filters.workingHours === 'late') {
                        // Поздно (после 22:00)
                        if (!restaurantDataItem.workingHoursType.includes('late')) {
                            passesFilters = false;
                        }
                    }
                }
                
                // Если ресторан проходит фильтры, добавляем в результаты
                if (passesFilters) {
                    const resultData = extractRestaurantData(item, restaurantDataItem, modalId);
                    if (resultData) {
                        filteredResults.push(resultData);
                    }
                }
            });
            
            console.log(`✅ Отфильтровано: ${filteredResults.length} из ${restaurantItems.length} ресторанов`);
            
            // Показываем результаты в модальном окне
            showFilterResultsModal(filteredResults, getFilterTitle(filters));
        }
        
        // 2.6 ФУНКЦИЯ СОЗДАНИЯ ЗАГОЛОВКА ФИЛЬТРАЦИИ
        function getFilterTitle(filters) {
            let title = "Результаты фильтрации ресторанов";
            
            const cuisineName = getCuisineName(filters.cuisine);
            const timeName = getWorkingHoursName(filters.workingHours);
            const priceText = filters.maxPrice < 5000 ? `до ${filters.maxPrice} ₽` : '';
            const ratingText = filters.minRating > 0 ? `${filters.minRating}+` : '';
            
            if (cuisineName || timeName || priceText || ratingText) {
                title = "Рестораны";
                if (cuisineName !== 'Любая кухня') title += `: ${cuisineName}`;
                if (timeName !== 'Любое время') title += `, ${timeName}`;
                if (priceText) title += `, ${priceText}`;
                if (ratingText) title += `, рейтинг ${ratingText}`;
            }
            
            return title;
        }
        
        // 2.7 ФУНКЦИЯ ИЗВЛЕЧЕНИЯ ДАННЫХ РЕСТОРАНА
        function extractRestaurantData(item, restaurantData, modalId) {
            try {
                const title = item.querySelector('h3')?.textContent || "Название не указано";
                const description = item.querySelector('p')?.textContent || "Описание отсутствует";
                const image = item.querySelector('.image-slider img')?.src || 
                             item.querySelector('img')?.src || 
                             "https://via.placeholder.com/400x300/2d1b47/9370db?text=Ресторан";
                
                return {
                    type: 'restaurant',
                    title,
                    description,
                    image,
                    modalId,
                    price: restaurantData.price + " ₽ (средний чек)",
                    rating: restaurantData.rating + " ★",
                    workingHours: restaurantData.workingHours,
                    cuisine: getCuisineName(restaurantData.cuisine)
                };
            } catch (e) {
                console.error("Ошибка извлечения данных ресторана:", e);
                return null;
            }
        }
        
        // 2.8 ФУНКЦИЯ ПОКАЗА МОДАЛЬНОГО ОКНА С РЕЗУЛЬТАТАМИ
        function showFilterResultsModal(results, title) {
            let resultsModal = document.querySelector('.filter-results-modal');
            
            if (!resultsModal) {
                resultsModal = document.createElement('div');
                resultsModal.className = 'filter-results-modal';
                
                const resultsContent = document.createElement('div');
                resultsContent.className = 'filter-results-content';
                
                const header = document.createElement('div');
                header.className = 'filter-results-header';
                
                const titleElem = document.createElement('h2');
                
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
                
                // Добавляем стили
                addFilterResultsStyles();
            }
            
            const countText = results.length === 0 ? 'ничего не найдено' : `найдено ${results.length}`;
            resultsModal.querySelector('h2').textContent = `${title} (${countText})`;
            
            const grid = resultsModal.querySelector('#filter-results-grid');
            grid.innerHTML = '';
            
            if (results.length === 0) {
                const noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <p style="font-size: 1.2em; color: #b19cd9; margin-bottom: 15px;">😕 Ничего не найдено</p>
                        <p style="color: #e6e0ff; margin-bottom: 20px;">По вашему запросу ресторанов не найдено.</p>
                        <p style="color: #e6e0ff; margin-bottom: 25px;">Попробуйте изменить параметры фильтрации.</p>
                        <div style="background: rgba(147, 112, 219, 0.1); padding: 15px; border-radius: 10px; border-left: 4px solid #9370db;">
                            <p style="color: #b19cd9; font-size: 0.9em; margin: 0;">
                                <strong>💡 Совет:</strong> Попробуйте выбрать другую кухню, время работы или увеличьте максимальную стоимость
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
        
        // 2.9 ФУНКЦИЯ СОЗДАНИЯ ЭЛЕМЕНТА РЕЗУЛЬТАТА
        function createResultItem(result) {
            const item = document.createElement('div');
            item.className = 'filter-result-item';
            
            const imageDiv = document.createElement('div');
            imageDiv.className = 'filter-result-image';
            
            const img = document.createElement('img');
            img.src = result.image;
            img.alt = result.title;
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/400x300/2d1b47/9370db?text=Ресторан';
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
            
            const cuisineBadge = document.createElement('div');
            cuisineBadge.className = 'filter-result-type';
            cuisineBadge.textContent = '🍽️ ' + result.cuisine;
            
            const price = document.createElement('div');
            price.className = 'filter-result-price';
            price.textContent = result.price;
            
            const rating = document.createElement('div');
            rating.className = 'filter-result-rating';
            rating.textContent = result.rating;
            
            // Добавляем время работы
            if (result.workingHours) {
                const timeDiv = document.createElement('div');
                timeDiv.className = 'filter-result-time';
                timeDiv.textContent = `🕒 ${result.workingHours}`;
                timeDiv.style.color = '#b19cd9';
                timeDiv.style.fontSize = '0.9em';
                metaDiv.appendChild(timeDiv);
            }
            
            metaDiv.appendChild(cuisineBadge);
            metaDiv.appendChild(price);
            metaDiv.appendChild(rating);
            
            infoDiv.appendChild(title);
            infoDiv.appendChild(description);
            infoDiv.appendChild(metaDiv);
            
            item.appendChild(imageDiv);
            item.appendChild(infoDiv);
            
            // При клике на результат открываем модальное окно ресторана
            item.addEventListener('click', () => {
                if (result.modalId) {
                    const resultsModal = document.querySelector('.filter-results-modal');
                    if (resultsModal) {
                        resultsModal.classList.remove('show');
                        document.body.style.overflow = 'auto';
                    }
                    
                    openModal(result.modalId);
                }
            });
            
            return item;
        }
        
        // 2.10 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
        function getCuisineName(cuisine) {
            const names = {
                '': 'Любая кухня',
                'russian': 'Русская',
                'vostochnaya': 'Восточная',
                'gruz': 'Грузинская',
                'italian': 'Итальянская',
                'frank': 'Французская',
                'smesh': 'Смешанная',
                'sred': 'Средиземноморская',
                'izrail': 'Израильская'
            };
            return names[cuisine] || cuisine;
        }
        
        function getWorkingHoursName(time) {
            const names = {
                '': 'Любое время',
                '24_7': 'Круглосуточно',
                'morning': 'Утро (до 12:00)',
                'afternoon': 'День (12:00-18:00)',
                'evening': 'Вечер (после 18:00)',
                'late': 'Поздно (после 22:00)'
            };
            return names[time] || time;
        }
        
        function getCuisineClass(element) {
            const cuisines = ['russian', 'vostochnaya', 'gruz', 'italian', 'frank', 'smesh', 'sred', 'izrail'];
            for (const cuisine of cuisines) {
                if (element.classList.contains(cuisine)) {
                    return cuisine;
                }
            }
            return '';
        }
        
        // 2.11 ФУНКЦИЯ ПОКАЗА ПРОСТОГО СООБЩЕНИЯ (в правом верхнем углу)
        function showSimpleMessage(text) {
            // Удаляем старое уведомление если есть
            const oldNotification = document.querySelector('.restaurant-info-message');
            if (oldNotification) {
                oldNotification.remove();
            }
            
            const message = document.createElement('div');
            message.className = 'restaurant-info-message';
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
                    animation: slideInRight 0.3s ease-out;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    font-size: 16px;
                    backdrop-filter: blur(10px);
                ">
                    ${text}
                </div>
            `;
            
            // Добавляем CSS анимацию
            if (!document.querySelector('#restaurant-notification-styles')) {
                const style = document.createElement('style');
                style.id = 'restaurant-notification-styles';
                style.textContent = `
                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    @keyframes slideOutRight {
                        from {
                            transform: translateX(0);
                            opacity: 1;
                        }
                        to {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(message);
            
            // Автоматическое скрытие через 3 секунды
            setTimeout(() => {
                if (message.parentNode) {
                    const innerDiv = message.querySelector('div');
                    if (innerDiv) {
                        innerDiv.style.animation = 'slideOutRight 0.3s ease-out';
                    }
                    setTimeout(() => {
                        if (message.parentNode) {
                            document.body.removeChild(message);
                        }
                    }, 300);
                }
            }, 3000);
        }
        
        // 2.12 ФУНКЦИЯ ДОБАВЛЕНИЯ СТИЛЕЙ ДЛЯ РЕЗУЛЬТАТОВ ФИЛЬТРАЦИИ
        function addFilterResultsStyles() {
            if (document.querySelector('#filter-results-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'filter-results-styles';
            style.textContent = `
                /* Стили для модального окна результатов фильтрации */
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
                    font-size: 2em;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                    margin: 0;
                }
                
                .filter-results-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 25px;
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
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid rgba(147, 112, 219, 0.2);
                    gap: 10px;
                }
                
                .filter-result-type {
                    background: rgba(147, 112, 219, 0.2);
                    color: #b19cd9;
                    padding: 5px 10px;
                    border-radius: 20px;
                    font-size: 0.9em;
                    border: 1px solid rgba(147, 112, 219, 0.5);
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
                
                .filter-result-time {
                    color: #b19cd9;
                    font-size = '0.9em';
                    margin-left: auto;
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
                
                .no-results {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 40px;
                }
            `;
            
            document.head.appendChild(style);
        }
    }
    
    // ==================== 3. ОБРАБОТЧИКИ СОБЫТИЙ ====================
    
    function setupEventHandlers() {
        // Кнопки "Подробнее" в карточках
        document.querySelectorAll('.btn-detail').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const modalId = href.substring(1);
                    openModal(modalId);
                }
            });
        });
        
        // Клик по карточке ресторана
        document.querySelectorAll('.restaurant-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (!e.target.closest('.btn-detail') && !e.target.closest('img')) {
                    const detailBtn = this.querySelector('.btn-detail');
                    if (detailBtn) {
                        const href = detailBtn.getAttribute('href');
                        if (href && href.startsWith('#')) {
                            const modalId = href.substring(1);
                            openModal(modalId);
                        }
                    }
                }
            });
        });
        
        // Кнопки закрытия модальных окон
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal-details');
                if (modal) {
                    closeModal(modal);
                }
            });
        });
        
        // Закрытие модальных окон по клику на фон
        document.querySelectorAll('.modal-details').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal(this);
                }
            });
        });
        
        // Закрытие по Esc
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Закрываем модальные окна
                document.querySelectorAll('.modal-details.visible').forEach(modal => {
                    closeModal(modal);
                });
                
                // Закрываем меню фильтров
                const filterDropdown = document.querySelector('.filter-dropdown');
                if (filterDropdown && filterDropdown.classList.contains('show')) {
                    filterDropdown.classList.remove('show');
                }
                
                // Закрываем окно результатов фильтрации
                const resultsModal = document.querySelector('.filter-results-modal.show');
                if (resultsModal) {
                    resultsModal.classList.remove('show');
                    document.body.style.overflow = 'auto';
                }
            }
        });
    }
    
    // ==================== 4. ИНИЦИАЛИЗАЦИЯ ====================
    
    function init() {
        console.log('🔄 Инициализация страницы ресторанов...');
        
        // Инициализируем слайдеры карточек
        initCardSliders();
        
        // Настраиваем обработчики событий
        setupEventHandlers();
        
        // Настраиваем фильтры
        setupFilters();
        
        // Инициализируем начальное состояние
        setTimeout(() => {
            document.querySelectorAll('.modal-details, .filter-dropdown').forEach(el => {
                if (el) el.style.display = 'none';
            });
        }, 100);
        
        console.log("✅ Все функции ресторанов инициализированы");
        
        // Тестовая информация
        console.log('=== ТЕСТОВАЯ ИНФОРМАЦИЯ ===');
        console.log('Кнопка фильтра:', document.querySelector('.filter-toggle') ? '✅ Найдена' : '❌ Не найдена');
        console.log('Меню фильтров:', document.querySelector('.filter-dropdown') ? '✅ Найдено' : '❌ Не найдено');
        console.log('Количество ресторанов:', document.querySelectorAll('.event-list > div').length);
    }
    
    // Запуск инициализации
    init();
});

// Обработчик ошибок
window.addEventListener('error', function(e) {
    console.error('❌ Ошибка JavaScript:', e.message);
});
