/* ===== Quiz State ===== */
let currentStep = 1;
const totalSteps = 4;

const quizData = {
    name: '',
    contactMethod: 'email',
    contact: '',
    description: '',
    systemType: '',
    userCount: '',
    features: [],
    selectedSlot: null
};

/* ===== Quiz Navigation ===== */

function openQuiz() {
    document.getElementById('quiz-overlay').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    resetQuiz();
}

function closeQuiz() {
    document.getElementById('quiz-overlay').style.display = 'none';
    document.body.style.overflow = '';
}

function resetQuiz() {
    currentStep = 1;
    showStep(1);
    updateProgress(1);
}

function showStep(step) {
    for (let i = 1; i <= 6; i++) {
        const el = document.getElementById('quiz-step-' + i);
        if (el) el.style.display = 'none';
    }
    const target = document.getElementById('quiz-step-' + step);
    if (target) target.style.display = 'block';
}

function updateProgress(step) {
    const progressSteps = Math.min(step, totalSteps);
    const pct = (progressSteps / totalSteps) * 100;
    document.getElementById('quiz-progress-bar').style.width = pct + '%';

    if (step <= totalSteps) {
        document.getElementById('quiz-step-label').textContent = 'Шаг ' + step + ' из ' + totalSteps;
    } else {
        document.getElementById('quiz-step-label').textContent = '';
    }
}

function nextStep(fromStep) {
    if (fromStep === 1) {
        // Collect contact data
        quizData.name = document.getElementById('client-name').value.trim();
        const method = document.querySelector('input[name="contact-method"]:checked');
        quizData.contactMethod = method ? method.value : 'email';
        quizData.contact = document.getElementById('client-contact').value.trim();

        if (!quizData.name) {
            highlightField('client-name');
            return;
        }
        if (!quizData.contact) {
            highlightField('client-contact');
            return;
        }

        currentStep = 2;
        showStep(2);
        updateProgress(2);
    } else if (fromStep === 2) {
        // Collect task data
        quizData.description = document.getElementById('task-description').value.trim();
        const sysType = document.querySelector('input[name="system-type"]:checked');
        quizData.systemType = sysType ? sysType.value : '';
        const userCount = document.querySelector('input[name="user-count"]:checked');
        quizData.userCount = userCount ? userCount.value : '';

        quizData.features = [];
        document.querySelectorAll('input[name="features"]:checked').forEach(function(cb) {
            quizData.features.push(cb.value);
        });

        currentStep = 3;
        showStep(3);
        updateProgress(3);
        runAnalysis();
    }
}

function prevStep(fromStep) {
    if (fromStep === 2) {
        currentStep = 1;
        showStep(1);
        updateProgress(1);
    }
}

function highlightField(id) {
    const el = document.getElementById(id);
    el.style.borderColor = '#ef4444';
    el.focus();
    el.addEventListener('input', function handler() {
        el.style.borderColor = '';
        el.removeEventListener('input', handler);
    });
}

/* ===== AI Analysis (simulated with local logic per spec) ===== */

function runAnalysis() {
    const messages = [
        'Анализирую ваши требования...',
        'Определяю ключевые модули (Аутентификация, Таблицы, Отчеты)...',
        'Подбираю похожие кейсы из нашей базы...',
        'Рассчитываю предварительную оценку...'
    ];

    let idx = 0;
    const textEl = document.getElementById('analysis-text');
    textEl.textContent = messages[0];

    const interval = setInterval(function() {
        idx++;
        if (idx < messages.length) {
            textEl.style.opacity = '0';
            setTimeout(function() {
                textEl.textContent = messages[idx];
                textEl.style.opacity = '1';
            }, 200);
        } else {
            clearInterval(interval);
            showResults();
        }
    }, 1200);
}

function analyzeProject() {
    /*
     * Local analysis engine following the spec's LLM prompt logic:
     * Step 1: Count entities and forms from description + features
     * Step 2: Categorize (1-4 or custom)
     * Step 3: Determine cost range
     * Step 4: Return JSON
     */
    let entityCount = 0;
    let formCount = 0;
    const estimatedFeatures = [];

    // Base entities from system type
    const sysType = quizData.systemType;
    if (sysType.includes('CRM')) {
        entityCount += 4; // Клиент, Контакт, Сделка, Задача
        formCount += 2;
        estimatedFeatures.push('База данных клиентов и контактов');
        estimatedFeatures.push('Воронка продаж со стадиями сделок');
    } else if (sysType.includes('Склад') || sysType.includes('ERP')) {
        entityCount += 5; // Товар, Заказ, Поставщик, Склад, Документ
        formCount += 3;
        estimatedFeatures.push('Учет товаров и остатков на складе');
        estimatedFeatures.push('Управление заказами и поставками');
    } else if (sysType.includes('проект')) {
        entityCount += 4; // Проект, Задача, Сотрудник, Комментарий
        formCount += 2;
        estimatedFeatures.push('Управление проектами и задачами');
        estimatedFeatures.push('Отслеживание прогресса и дедлайнов');
    } else if (sysType.includes('портал')) {
        entityCount += 4; // Сотрудник, Документ, Новость, Заявка
        formCount += 2;
        estimatedFeatures.push('Внутренний портал для сотрудников');
        estimatedFeatures.push('Управление документами и заявками');
    } else {
        entityCount += 3;
        formCount += 1;
        estimatedFeatures.push('Кастомная система под ваши задачи');
    }

    // Additional entities/forms from selected features
    const features = quizData.features;
    if (features.some(function(f) { return f.includes('кабинет'); })) {
        entityCount += 1;
        formCount += 1;
        estimatedFeatures.push('Система аутентификации с личными кабинетами');
    }
    if (features.some(function(f) { return f.includes('Таблицы'); })) {
        entityCount += 1;
        estimatedFeatures.push('Таблицы с поиском, сортировкой и фильтрами');
    }
    if (features.some(function(f) { return f.includes('загружать'); })) {
        entityCount += 1;
        formCount += 1;
        estimatedFeatures.push('Загрузка и хранение файлов');
    }
    if (features.some(function(f) { return f.includes('Дашборд'); })) {
        entityCount += 1;
        formCount += 1;
        estimatedFeatures.push('Дашборд с графиками и отчетами');
    }
    if (features.some(function(f) { return f.includes('Интеграция'); })) {
        entityCount += 2;
        estimatedFeatures.push('Интеграция с внешними сервисами');
    }
    if (features.some(function(f) { return f.includes('уведомления'); })) {
        entityCount += 1;
        estimatedFeatures.push('Автоматические уведомления');
    }

    // Adjust for user count complexity
    const uc = quizData.userCount;
    if (uc.includes('50+')) {
        entityCount += 2;
        formCount += 1;
    } else if (uc.includes('11-50')) {
        entityCount += 1;
    }

    // Analyze description for extra entities
    const desc = (quizData.description || '').toLowerCase();
    const keywords = ['отчет', 'аналитик', 'интеграц', 'api', 'импорт', 'экспорт', 'уведомлен', 'рассылк'];
    keywords.forEach(function(kw) {
        if (desc.includes(kw)) {
            entityCount += 1;
        }
    });

    // Categorize
    let categoryId, categoryName, costRange, timeline;

    if (entityCount <= 5 && formCount <= 2) {
        categoryId = '1';
        categoryName = 'Базовый';
        costRange = '75 000 руб.';
        timeline = '2-3 недели';
    } else if (entityCount <= 10 && formCount <= 3) {
        categoryId = '2';
        categoryName = 'Стандарт';
        costRange = '120 000 – 200 000 руб.';
        timeline = '4-6 недель';
    } else if (entityCount <= 20 && formCount <= 6) {
        categoryId = '3';
        categoryName = 'Расширенный';
        costRange = '300 000 – 400 000 руб.';
        timeline = '6-10 недель';
    } else if (entityCount <= 50 && formCount <= 10) {
        categoryId = '4';
        categoryName = 'Комплексный';
        costRange = '450 000 – 600 000 руб.';
        timeline = '10-16 недель';
    } else {
        categoryId = 'custom';
        categoryName = 'Индивидуальный';
        costRange = 'Требуется детальное обсуждение';
        timeline = 'По результатам консультации';
    }

    // Limit features to 3-5
    const limited = estimatedFeatures.slice(0, 5);

    return {
        category_id: categoryId,
        category_name: categoryName,
        cost_range: costRange,
        estimated_features: limited,
        timeline: timeline
    };
}

function showResults() {
    const result = analyzeProject();

    document.getElementById('result-category').textContent = result.category_name;
    document.getElementById('result-cost').textContent = result.cost_range;
    document.getElementById('result-timeline').textContent = result.timeline;

    const featuresList = document.getElementById('result-features-list');
    featuresList.innerHTML = '';
    result.estimated_features.forEach(function(f) {
        const li = document.createElement('li');
        li.textContent = f;
        featuresList.appendChild(li);
    });

    currentStep = 4;
    showStep(4);
    updateProgress(4);
}

/* ===== Booking ===== */

function showBooking() {
    generateBookingSlots();
    showStep(5);
    document.getElementById('quiz-step-label').textContent = '';
}

function generateBookingSlots() {
    const container = document.getElementById('booking-slots-container');
    container.innerHTML = '';

    const now = new Date();
    const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const slots = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

    for (let d = 1; d <= 5; d++) {
        const date = new Date(now);
        date.setDate(date.getDate() + d);

        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        const dayGroup = document.createElement('div');
        dayGroup.className = 'booking-day-group';

        const header = document.createElement('div');
        header.className = 'booking-day-header';
        header.textContent = dayNames[date.getDay()] + ', ' + date.getDate() + ' ' + monthNames[date.getMonth()];
        dayGroup.appendChild(header);

        const slotsDiv = document.createElement('div');
        slotsDiv.className = 'booking-day-slots';

        slots.forEach(function(time) {
            const btn = document.createElement('button');
            btn.className = 'booking-slot';
            btn.textContent = time;
            btn.dataset.date = date.toISOString().split('T')[0];
            btn.dataset.time = time;
            btn.addEventListener('click', function() {
                selectSlot(btn);
            });
            slotsDiv.appendChild(btn);
        });

        dayGroup.appendChild(slotsDiv);
        container.appendChild(dayGroup);
    }
}

function selectSlot(btn) {
    document.querySelectorAll('.booking-slot').forEach(function(s) {
        s.classList.remove('selected');
    });
    btn.classList.add('selected');
    quizData.selectedSlot = btn.dataset.date + ' ' + btn.dataset.time;
    document.getElementById('confirm-booking-btn').disabled = false;
}

function backToResults() {
    showStep(4);
    updateProgress(4);
}

function confirmBooking() {
    if (!quizData.selectedSlot) return;

    const contactLabel = quizData.contactMethod === 'email' ? 'email' :
                         quizData.contactMethod === 'telegram' ? 'Telegram' : 'телефон';

    document.getElementById('confirmation-text').textContent =
        'Ваша консультация назначена на ' + formatSlot(quizData.selectedSlot) +
        '. Мы отправили подтверждение на ваш ' + contactLabel +
        ' и с нетерпением ждем разговора.';

    showStep(6);
    document.getElementById('quiz-step-label').textContent = '';
    document.getElementById('quiz-progress-bar').style.width = '100%';
}

function formatSlot(slot) {
    const parts = slot.split(' ');
    const dateParts = parts[0].split('-');
    const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return parseInt(dateParts[2]) + ' ' + monthNames[parseInt(dateParts[1]) - 1] + ' в ' + parts[1];
}

/* ===== Close on Escape ===== */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeQuiz();
    }
});

/* ===== Close on overlay click ===== */
document.getElementById('quiz-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeQuiz();
    }
});
