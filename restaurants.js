document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Страница мероприятий загружена");

    // ========== ГАМБУРГЕР-МЕНЮ ==========
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    // Проверяем, что элементы существуют
    console.log("🍔 Гамбургер элемент:", hamburger);
    console.log("📋 Меню элемент:", navMenu);
    
    if (hamburger && navMenu) {
        console.log("✅ Гамбургер и меню найдены");
        
        // Функция для открытия/закрытия меню
        function toggleMenu() {
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
        }
        
        // Открытие/закрытие меню по клику на гамбургер
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
        
        // Закрыть меню при клике на ссылку
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                console.log("🔗 Меню закрыто по клику на ссылку");
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                // НЕ используем stopPropagation() чтобы ссылки работали нормально
            });
        });
        
        // Закрыть меню при клике вне его
        document.addEventListener('click', function(event) {
            // Проверяем, что меню открыто
            if (navMenu.classList.contains('active')) {
                // Проверяем, был ли клик внутри меню или на гамбургере
                const isClickInsideMenu = navMenu.contains(event.target);
                const isClickOnHamburger = hamburger.contains(event.target);
                
                // Если клик был вне меню и не на гамбургере
                if (!isClickInsideMenu && !isClickOnHamburger) {
                    console.log("👆 Меню закрыто по клику вне его");
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
        
        // Закрыть меню при нажатии клавиши ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                console.log("⎋ Меню закрыто по клавише ESC");
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        console.log("✅ Гамбургер-меню инициализировано");
        
    } else {
        console.error("❌ Элементы гамбургер-меню не найдены!");
        // Попробуем найти элементы по классу
        const hamburgerByClass = document.querySelector('.hamburger');
        const navMenuByClass = document.querySelector('.nav-menu');
        console.log("Поиск по классам:", hamburgerByClass, navMenuByClass);
    }
    
    // 1. ИНИЦИАЛИЗАЦИЯ СЛАЙДЕРОВ ФИЛЬТРОВ
    function initFilterSliders() {
        // Слайдер стоимости
        const costSlider = document.getElementById('cost');
        const costValue = document.getElementById('cost-value');
        
        if (costSlider && costValue) {
            // Форматируем цену
            const formatPrice = (value) => {
                return value === '10000' ? '10000+ руб' : value + ' руб';
            };
            
            costValue.textContent = formatPrice(costSlider.value);
            costSlider.addEventListener('input', function() {
                costValue.textContent = formatPrice(this.value);
            });
        }
        
        // Слайдер рейтинга
        const ratingSlider = document.getElementById('rating');
        const ratingValue = document.getElementById('rating-value');
        
        if (ratingSlider && ratingValue) {
            ratingValue.textContent = ratingSlider.value === '0' ? 'Любой' : ratingSlider.value + '+';
            ratingSlider.addEventListener('input', function() {
                ratingValue.textContent = this.value === '0' ? 'Любой' : this.value + '+';
            });
        }
    }
    
    // 2. ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ВРЕМЕНИ ПРОВЕДЕНИЯ МЕРОПРИЯТИЯ
    function getEventTime(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return null;
        
        const modalInfo = modal.querySelector('.modal-info');
        if (!modalInfo) return null;
        
        // Ищем строку с временем
        const timeElements = modalInfo.querySelectorAll('p');
        for (const p of timeElements) {
            const text = p.textContent;
            if (text.includes('Время:') || text.includes('🕒')) {
                // Извлекаем время в формате HH:MM
                const timeMatch = text.match(/(\d{1,2}:\d{2})/);
                if (timeMatch) {
                    return timeMatch[1];
                }
            }
        }
        
        return null;
    }
    
    // 3. ФУНКЦИЯ ДЛЯ ОПРЕДЕЛЕНИЯ ВРЕМЕННОГО ИНТЕРВАЛА
    function getTimeCategory(timeString) {
        if (!timeString) return null;
        
        const timeParts = timeString.split(':');
        if (timeParts.length !== 2) return null;
        
        const hour = parseInt(timeParts[0]);
        const minute = parseInt(timeParts[1]);
        const totalMinutes = hour * 60 + minute;
        
        // Определяем временной интервал
        if (totalMinutes >= 6 * 60 && totalMinutes < 12 * 60) {
            return 'morning'; // Утро: 6:00 - 11:59
        } else if (totalMinutes >= 12 * 60 && totalMinutes < 18 * 60) {
            return 'day'; // День: 12:00 - 17:59
        } else if (totalMinutes >= 18 * 60 && totalMinutes < 23 * 60) {
            return 'evening'; // Вечер: 18:00 - 22:59
        } else if (totalMinutes >= 23 * 60 || totalMinutes < 6 * 60) {
            return 'night'; // Ночь: 23:00 - 5:59
        }
        
        return null;
    }
    
    // 4. ОБРАБОТКА ОТКРЫТИЯ МОДАЛЬНОГО ОКНА МЕРОПРИЯТИЙ
    document.querySelectorAll('.btn-detail').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('href');
            if (!modalId || modalId === '#') return;
            
            const fullModalId = modalId.startsWith('#') ? modalId.substring(1) : modalId;
            const modalDetails = document.getElementById(fullModalId);
            
            if (modalDetails) {
                console.log(`📱 Открываем модальное окно мероприятия: ${fullModalId}`);
                modalDetails.classList.remove('hidden');
                modalDetails.classList.add('visible');
                document.body.style.overflow = 'hidden';
                
                // Инициализация галереи
                const gallery = modalDetails.querySelector('.gallery');
                if (gallery) {
                    initGallery(gallery);
                }
                
                // Инициализация Яндекс Карт
                setTimeout(() => {
                    const mapElement = modalDetails.querySelector('.yandex-map');
                    if (mapElement && !mapElement.dataset.initialized) {
                        initYandexMap(mapElement);
                    }
                }, 100);
                
                // Обработка кинотеатров
                const cinemaList = modalDetails.querySelector('.cinema-list');
                if (cinemaList) {
                    initCinemaList(cinemaList);
                }
            } else {
                console.error('❌ Нет соответствующего модального окна:', fullModalId);
            }
        });
    });
    
    // 5. ИНИЦИАЛИЗАЦИЯ СПИСКА КИНОТЕАТРОВ
    function initCinemaList(cinemaList) {
        const listItems = cinemaList.querySelectorAll('li');
        const mapElement = cinemaList.closest('.modal-content').querySelector('.yandex-map');
        
        if (!mapElement) return;
        
        listItems.forEach(item => {
            item.addEventListener('click', function() {
                // Удаляем активный класс у всех элементов
                listItems.forEach(li => li.classList.remove('active'));
                
                // Добавляем активный класс к текущему элементу
                this.classList.add('active');
                
                // Получаем координаты кинотеатра
                const lat = this.getAttribute('data-lat');
                const lon = this.getAttribute('data-lon');
                const title = this.getAttribute('data-title');
                const address = this.getAttribute('data-address');
                
                if (lat && lon) {
                    // Инициализируем карту с координатами кинотеатра
                    initCinemaMap(mapElement, lat, lon, title, address);
                }
            });
        });
        
        // Активируем первый элемент
        if (listItems.length > 0) {
            listItems[0].click();
        }
    }
    
    // 6. ИНИЦИАЛИЗАЦИЯ КАРТЫ КИНОТЕАТРА
    function initCinemaMap(mapElement, lat, lon, title, address) {
        console.log("🗺️ Инициализация карты для кинотеатра:", title);
        
        if (!lat || !lon) {
            console.warn("❌ Нет координат для карты кинотеатра");
            return;
        }
        
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
                
                myMap.geoObjects.add(myPlacemark);
                
                console.log("✅ Карта кинотеатра создана:", title);
            } catch (error) {
                console.error("Ошибка создания карты кинотеатра:", error);
            }
        });
    }
    
    // 7. ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal-details');
            closeModal(modal);
        });
    });
    
    // 8. ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА ПРИ КЛИКЕ ВНЕ ОКНА
    document.querySelectorAll('.modal-details').forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === this && (this.classList.contains('visible') || !this.classList.contains('hidden'))) {
                closeModal(this);
            }
        });
    });
    
    // Функция закрытия модального окна
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('visible');
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            console.log("📱 Модальное окно закрыто");
        }
    }
    
    // 9. ОБРАБОТКА КЛАВИШИ ESC ДЛЯ ЗАКРЫТИЯ МОДАЛЬНЫХ ОКОН
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal-details.visible');
            if (openModal) {
                closeModal(openModal);
            }
            
            // Также закрываем окно результатов фильтрации
            const resultsModal = document.querySelector('.filter-results-modal.show');
            if (resultsModal) {
                resultsModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        }
    });
    
    // 10. ФИЛЬТРАЦИЯ МЕРОПРИЯТИЙ
    const filterToggle = document.querySelector('.filter-toggle');
    const filterDropdown = document.querySelector('.filter-dropdown');
    
    if (filterToggle && filterDropdown) {
        // Переключение видимости фильтров
        filterToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            filterDropdown.classList.toggle('show');
            console.log('📋 Фильтры мероприятий ' + (filterDropdown.classList.contains('show') ? 'открыты' : 'закрыты'));
        });
        
        // Закрытие фильтров при клике вне
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
                console.log('🔘 Применение фильтров мероприятий');
                applyEventFilters();
                filterDropdown.classList.remove('show');
            });
        }
        
        // Кнопка сброса фильтров
        const resetFilters = document.querySelector('.reset-filters');
        if (resetFilters) {
            resetFilters.addEventListener('click', function() {
                console.log('🔄 Сброс фильтров мероприятий');
                
                // Сброс значений фильтров
                document.querySelectorAll('.filter-dropdown select').forEach(select => {
                    select.selectedIndex = 0;
                });
                
                // Сброс слайдеров
                const costSlider = document.getElementById('cost');
                const costValue = document.getElementById('cost-value');
                if (costSlider && costValue) {
                    costSlider.value = 5000;
                    costValue.textContent = '5000 руб';
                }
                
                const ratingSlider = document.getElementById('rating');
                const ratingValue = document.getElementById('rating-value');
                if (ratingSlider && ratingValue) {
                    ratingSlider.value = 0;
                    ratingValue.textContent = 'Любой';
                }
                
                // Скрыть модальное окно результатов
                const resultsModal = document.querySelector('.filter-results-modal');
                if (resultsModal) {
                    resultsModal.classList.remove('show');
                    document.body.style.overflow = 'auto';
                }
                
                filterDropdown.classList.remove('show');
                showSimpleMessage('Фильтры мероприятий сброшены');
            });
        }
    }
    
    // 11. ФУНКЦИЯ ФИЛЬТРАЦИИ МЕРОПРИЯТИЙ
    function applyEventFilters() {
        console.log("🔄 Применяем фильтры ...");
        
        // Получаем значения фильтров
        const eventType = document.querySelector("#category")?.value || 'all';
        const eventTime = document.querySelector("#time")?.value || 'all';
        const eventCost = parseInt(document.querySelector("#cost")?.value || 5000);
        const eventRating = parseFloat(document.querySelector("#rating")?.value || 0);
        
        console.log("Фильтры мероприятий:");
        console.log("- Тип:", eventType);
        console.log("- Время:", eventTime);
        console.log("- Стоимость:", eventCost);
        console.log("- Рейтинг:", eventRating);
        
        let filteredResults = [];
        
        // Собираем отфильтрованные мероприятия
        document.querySelectorAll('.container').forEach(container => {
            const eventData = extractEventData(container);
            if (eventData && eventPassesFilters(eventData, eventType, eventTime, eventCost, eventRating)) {
                filteredResults.push(eventData);
            }
        });
        
        // Показываем результаты в модальном окне
        showFilterResults(filteredResults, getFilterTitle(eventType, eventTime, eventCost, eventRating), "events");
        
        console.log(`✅ Найдено мероприятий: ${filteredResults.length}`);
    }
    
    // 12. ФУНКЦИЯ ПРОВЕРКИ МЕРОПРИЯТИЯ ПО ФИЛЬТРАМ
    function eventPassesFilters(eventData, typeFilter, timeFilter, costFilter, ratingFilter) {
        // Проверяем тип мероприятия
        if (typeFilter !== 'all' && !isEventOfType(eventData, typeFilter)) {
            return false;
        }
        
        // Проверяем время проведения
        if (timeFilter !== 'all' && !isEventAtTime(eventData, timeFilter)) {
            return false;
        }
        
        // Проверяем стоимость
        if (costFilter < 10000 && !isEventWithinBudget(eventData, costFilter)) {
            return false;
        }
        
        // Проверяем рейтинг
        if (ratingFilter > 0 && !hasMinimumRating(eventData, ratingFilter)) {
            return false;
        }
        
        return true;
    }
    
    // 13. ФУНКЦИЯ ПРОВЕРКИ ТИПА МЕРОПРИЯТИЯ
    function isEventOfType(eventData, type) {
        return eventData.type === type;
    }
    
    // 14. ФУНКЦИЯ ПРОВЕРКИ ВРЕМЕНИ ПРОВЕДЕНИЯ
    function isEventAtTime(eventData, timeFilter) {
        // Получаем время проведения мероприятия
        const eventTime = getEventTime(eventData.modalId);
        if (!eventTime) {
            // Если время не указано, пропускаем фильтр
            return true;
        }
        
        // Определяем категорию времени мероприятия
        const eventTimeCategory = getTimeCategory(eventTime);
        if (!eventTimeCategory) {
            // Если не удалось определить категорию, пропускаем фильтр
            return true;
        }
        
        // Сравниваем с выбранным фильтром
        return eventTimeCategory === timeFilter;
    }
    
    // 15. ФУНКЦИЯ ПРОВЕРКИ СТОИМОСТИ
    function isEventWithinBudget(eventData, maxCost) {
        const priceText = eventData.price;
        if (!priceText || priceText.includes('не указана')) {
            return true;
        }
        
        // Извлекаем минимальную цену
        const priceMatch = priceText.match(/(\d+)[^\d]*руб/);
        if (!priceMatch) {
            return true;
        }
        
        const minPrice = parseInt(priceMatch[1]);
        return minPrice <= maxCost;
    }
    
    // 16. ФУНКЦИЯ ПРОВЕРКИ РЕЙТИНГА
    function hasMinimumRating(eventData, minRating) {
        const ratingText = eventData.rating;
        if (!ratingText || ratingText.includes('не указан') || ratingText === 'Любой') {
            return true;
        }
        
        // Извлекаем числовое значение рейтинга
        const ratingMatch = ratingText.match(/\d+(\.\d+)?/);
        if (!ratingMatch) {
            return true;
        }
        
        const rating = parseFloat(ratingMatch[0]);
        return rating >= minRating;
    }
    
    // 17. ФУНКЦИЯ ПОКАЗА РЕЗУЛЬТАТОВ ФИЛЬТРАЦИИ В МОДАЛЬНОМ ОКНЕ
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
                    <p style="color: #e6e0ff; margin-bottom: 20px;">По вашему запросу мероприятий не найдено.</p>
                    <p style="color: #e6e0ff; margin-bottom: 25px;">Попробуйте изменить параметры фильтрации.</p>
                    <div style="background: rgba(147, 112, 219, 0.1); padding: 15px; border-radius: 10px; border-left: 4px solid #9370db;">
                        <p style="color: #b19cd9; font-size: 0.9em; margin: 0;">
                            <strong>💡 Совет:</strong> Попробуйте выбрать другой тип мероприятия, время или уменьшите максимальную стоимость
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
    
    // 18. ФУНКЦИЯ СОЗДАНИЯ ЗАГОЛОВКА ДЛЯ ФИЛЬТРАЦИИ
    function getFilterTitle(type, time, cost, rating) {
        let title = "Результаты фильтрации мероприятий";
        
        const typeName = getTypeName(type);
        const timeName = getTimeName(time);
        const costText = cost < 10000 ? `до ${cost} руб` : '';
        const ratingText = rating > 0 ? `${rating}+` : '';
        
        if (typeName || timeName || costText || ratingText) {
            title = "Мероприятия";
            if (typeName !== 'Все типы') title += `: ${typeName}`;
            if (timeName !== 'Любое время') title += `, ${timeName}`;
            if (costText) title += `, ${costText}`;
            if (ratingText) title += `, рейтинг ${ratingText}`;
        }
        
        return title;
    }
    
    // 19. ФУНКЦИЯ СОЗДАНИЯ ЭЛЕМЕНТА РЕЗУЛЬТАТА
    function createResultItem(result) {
        const item = document.createElement('div');
        item.className = 'filter-result-item';
        
        const imageDiv = document.createElement('div');
        imageDiv.className = 'filter-result-image';
        
        const img = document.createElement('img');
        img.src = result.image;
        img.alt = result.title;
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/400x300/2d1b47/9370db?text=Мероприятие';
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
        typeBadge.textContent = getTypeEmoji(result.type) + ' ' + getTypeName(result.type);
        
        const price = document.createElement('div');
        price.className = 'filter-result-price';
        price.textContent = result.price;
        
        const rating = document.createElement('div');
        rating.className = 'filter-result-rating';
        rating.textContent = result.rating;
        
        // Добавляем время проведения
        const eventTime = getEventTime(result.modalId);
        if (eventTime) {
            const timeDiv = document.createElement('div');
            timeDiv.className = 'filter-result-time';
            timeDiv.textContent = `🕒 ${eventTime}`;
            timeDiv.style.color = '#b19cd9';
            timeDiv.style.fontSize = '0.9em';
            metaDiv.appendChild(timeDiv);
        }
        
        metaDiv.appendChild(typeBadge);
        metaDiv.appendChild(price);
        metaDiv.appendChild(rating);
        
        infoDiv.appendChild(title);
        infoDiv.appendChild(description);
        infoDiv.appendChild(metaDiv);
        
        item.appendChild(imageDiv);
        item.appendChild(infoDiv);
        
        // При клике на результат открываем модальное окно мероприятия
        item.addEventListener('click', () => {
            if (result.modalId) {
                const modal = document.getElementById(result.modalId);
                if (modal) {
                    const resultsModal = document.querySelector('.filter-results-modal');
                    if (resultsModal) {
                        resultsModal.classList.remove('show');
                    }
                    
                    modal.classList.remove('hidden');
                    modal.classList.add('visible');
                    document.body.style.overflow = 'hidden';
                    
                    const gallery = modal.querySelector('.gallery');
                    if (gallery) {
                        initGallery(gallery);
                    }
                    
                    const mapContainer = modal.querySelector('.yandex-map');
                    if (mapContainer) {
                        initYandexMap(mapContainer);
                    }
                }
            }
        });
        
        return item;
    }
    
    // 20. ФУНКЦИЯ ИЗВЛЕЧЕНИЯ ДАННЫХ МЕРОПРИЯТИЯ
    function extractEventData(item) {
        try {
            const title = item.querySelector('h3')?.textContent || "Название не указано";
            const description = item.querySelector('p')?.textContent || "Описание отсутствует";
            const image = item.querySelector('.image-slider img')?.src || 
                         item.querySelector('img')?.src || 
                         "https://via.placeholder.com/400x300/2d1b47/9370db?text=Мероприятие";
            const link = item.querySelector('.btn-detail')?.getAttribute('href') || "#";
            
            const modalId = link.startsWith('#') ? link.substring(1) : link;
            const modal = document.getElementById(modalId);
            let price = "Цена не указана";
            let rating = "Рейтинг не указан";
            let eventType = "concert"; // По умолчанию
            
            // Определяем тип мероприятия по классу родителя
            const parentContainer = item.closest('.concert, .spektakl, .cinema, .master_class, .vstrecha');
            if (parentContainer) {
                eventType = parentContainer.className.split(' ')[0];
            }
            
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
                    });
                }
            }
            
            return {
                type: eventType,
                title,
                description,
                image,
                link,
                price,
                rating,
                modalId
            };
        } catch (e) {
            console.error("Ошибка извлечения данных мероприятия:", e);
            return null;
        }
    }
    
    // 21. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    function getTypeName(type) {
        const names = {
            'all': 'Все типы',
            'concert': 'Концерты',
            'spektakl': 'Спектакли',
            'cinema': 'Кино',
            'master_class': 'Мастер-классы',
            'vstrecha': 'Встречи'
        };
        return names[type] || type;
    }
    
    function getTimeName(time) {
        const names = {
            'all': 'Любое время',
            'morning': 'Утро (6:00 - 12:00)',
            'day': 'День (12:00 - 18:00)',
            'evening': 'Вечер (18:00 - 23:00)',
            'night': 'Ночь (23:00 - 6:00)'
        };
        return names[time] || time;
    }
    
    function getTypeEmoji(type) {
        const emojis = {
            'concert': '🎵',
            'spektakl': '🎭',
            'cinema': '🎬',
            'master_class': '🎨',
            'vstrecha': '👥'
        };
        return emojis[type] || '🎉';
    }
    
    // 22. ФУНКЦИЯ ПОКАЗА ПРОСТОГО СООБЩЕНИЯ
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
    
    // 23. ИНИЦИАЛИЗАЦИЯ ГАЛЕРЕИ В МОДАЛЬНЫХ ОКНАХ
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
            
            // Функция показа изображения
            function showImage(index) {
                images.forEach(img => img.classList.remove('active'));
                images[index].classList.add('active');
                currentIndex = index;
            }
            
            // Кнопка "назад"
            prevButton.addEventListener('click', function() {
                let newIndex = currentIndex - 1;
                if (newIndex < 0) newIndex = images.length - 1;
                showImage(newIndex);
            });
            
            // Кнопка "вперед"
            nextButton.addEventListener('click', function() {
                let newIndex = currentIndex + 1;
                if (newIndex >= images.length) newIndex = 0;
                showImage(newIndex);
            });
            
            // Автоматическая смена изображений
            const interval = setInterval(() => {
                if (document.querySelector('.modal-details.visible')) {
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
                    closeBtn.addEventListener('click', function() {
                        clearInterval(interval);
                    });
                }
            }
        }
    }
    
    // 24. ИНИЦИАЛИЗАЦИЯ ЯНДЕКС КАРТ
    function initYandexMap(mapElement) {
        console.log("🗺️ Инициализация Яндекс Карты для:", mapElement.id);
        
        const lat = mapElement.getAttribute('data-lat');
        const lon = mapElement.getAttribute('data-lon');
        const title = mapElement.getAttribute('data-title') || 'Мероприятие';
        const address = mapElement.getAttribute('data-address') || '';
        
        if (!lat || !lon) {
            console.warn("❌ Нет координат для карты:", mapElement.id);
            return;
        }
        
        // Помечаем карту как инициализированную
        mapElement.dataset.initialized = 'true';
        
        // Проверяем, загружена ли библиотека Яндекс Карт
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
                
                // Добавляем метку
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
                
                console.log("✅ Карта создана:", mapElement.id);
            } catch (error) {
                console.error("Ошибка создания карты:", error);
            }
        });
    }
    
    // 25. ИНИЦИАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ
    function initAll() {
        console.log("🔄 Инициализация всех функций...");
        
        // Инициализация слайдеров фильтров
        initFilterSliders();
        
        // Добавляем обработчики для всех элементов с классом .cinema-list
        document.querySelectorAll('.cinema-list').forEach(cinemaList => {
            initCinemaList(cinemaList);
        });
        
        console.log("✅ Все функции инициализированы");
    }
    
    // Запускаем инициализацию
    initAll();
    
    console.log("✅ Все обработчики мероприятий установлены");
});

// Добавляем CSS стили
const eventStyle = document.createElement('style');
eventStyle.textContent = `
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
    
    .modal-details.visible {
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    /* Стили для изображений галереи */
    .gallery {
        position: relative;
    }
    
    .gallery img {
        display: none;
        width: 100%;
        height: auto;
        border-radius: 10px;
    }
    
    .gallery img.active {
        display: block;
    }
    
    /* Плавное появление изображений */
    .image-slider img,
    .gallery img {
        transition: opacity 0.5s ease;
    }
    
    .image-slider img:not(.active),
    .gallery img:not(.active) {
        opacity: 0;
    }
    
    .image-slider img.active,
    .gallery img.active {
        opacity: 1;
    }
    
    /* Анимация загрузки карточек */
    @keyframes fadeIn {
        from { 
            opacity: 0; 
            transform: translateY(20px);
        }
        to { 
            opacity: 1; 
            transform: translateY(0);
        }
    }
    
    .event-list .container {
        animation: fadeIn 0.5s ease;
    }
    
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
        font-size: 0.9em;
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
`;

document.head.appendChild(eventStyle);

console.log("✅ Функциональность мероприятий загружена");
