# Интеграм — Лендинг

Промо-сайт компании «Интеграм» с квиз-воронкой для расчёта стоимости проекта.

Сайт представляет собой статическую HTML-страницу без внешних зависимостей (чистый HTML, CSS, JavaScript). Для работы не требуется сборка, установка пакетов или серверная часть.

## Структура проекта

```
├── index.html   # Главная страница (лендинг + квиз-воронка)
├── styles.css   # Стили
├── app.js       # Логика квиз-калькулятора
└── docs/        # Документация и скриншоты
```

## Установка и запуск локально

### Способ 1: Открытие файла в браузере (самый простой)

1. Скачайте или клонируйте репозиторий:

   ```bash
   git clone https://github.com/ideav/promo.git
   cd promo
   ```

2. Откройте файл `index.html` в браузере:

   - **Windows**: дважды кликните на `index.html` или перетащите файл в окно браузера
   - **macOS**: `open index.html`
   - **Linux**: `xdg-open index.html`

### Способ 2: Локальный HTTP-сервер (рекомендуется)

Локальный сервер полезен для более точной эмуляции поведения на хостинге.

**С помощью Python (встроен в macOS/Linux):**

```bash
git clone https://github.com/ideav/promo.git
cd promo
python3 -m http.server 8080
```

Сайт будет доступен по адресу: [http://localhost:8080](http://localhost:8080)

**С помощью Node.js:**

```bash
git clone https://github.com/ideav/promo.git
cd promo
npx serve .
```

Сайт будет доступен по адресу, указанному в выводе команды (обычно [http://localhost:3000](http://localhost:3000)).

## Размещение на хостинге

### GitHub Pages (бесплатно)

1. Создайте форк репозитория или загрузите файлы в свой репозиторий на GitHub.

2. Перейдите в **Settings** → **Pages**.

3. В разделе **Source** выберите ветку `main` и папку `/ (root)`.

4. Нажмите **Save**.

5. Через несколько минут сайт будет доступен по адресу:
   `https://<ваш-логин>.github.io/<имя-репозитория>/`

### Netlify (бесплатно)

1. Зайдите на [netlify.com](https://www.netlify.com/) и авторизуйтесь.

2. Нажмите **Add new site** → **Import an existing project**.

3. Подключите репозиторий GitHub.

4. Оставьте поля **Build command** и **Publish directory** пустыми (или укажите `.` в Publish directory).

5. Нажмите **Deploy site**.

6. Сайт будет доступен по автоматически сгенерированному адресу `https://<имя>.netlify.app`.

### Обычный веб-хостинг (shared hosting)

1. Скачайте файлы проекта:

   ```
   index.html
   styles.css
   app.js
   ```

2. Загрузите эти три файла в корневую директорию сайта на хостинге (обычно `public_html/` или `www/`) через файловый менеджер хостинга или FTP-клиент (например, FileZilla).

3. Сайт будет доступен по вашему домену.

### VPS / выделенный сервер (Nginx)

1. Установите Nginx:

   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. Клонируйте репозиторий в директорию для сайта:

   ```bash
   sudo git clone https://github.com/ideav/promo.git /var/www/promo
   ```

3. Создайте конфигурацию Nginx:

   ```bash
   sudo nano /etc/nginx/sites-available/promo
   ```

   Содержимое файла:

   ```nginx
   server {
       listen 80;
       server_name ваш-домен.ru;

       root /var/www/promo;
       index index.html;

       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```

4. Включите конфигурацию и перезапустите Nginx:

   ```bash
   sudo ln -s /etc/nginx/sites-available/promo /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. Сайт будет доступен по указанному домену.

   Для HTTPS установите сертификат с помощью [Let's Encrypt](https://letsencrypt.org/):

   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d ваш-домен.ru
   ```
