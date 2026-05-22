# Деплой Telegram-бота Sitngo на сервер

Mini App (онбординг) хостится на GitHub Pages:

https://greenappsme.github.io/sitngo-tg-onboarding/

Бот — отдельный Python-процесс на сервере. Он должен работать постоянно.

## Путь на сервере

```
/webapps/tg-onboarding-bot/sitngo-tg-onboarding/bot
```

## 1. Подготовка сервера (один раз)

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip git
```

Если `apt install python3-venv` возвращает 404 — сначала выполните `sudo apt update` или смените зеркало Ubuntu.

## 2. Код и зависимости

```bash
cd /webapps/tg-onboarding-bot/sitngo-tg-onboarding/bot

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 3. Переменные окружения

Создайте файл `.env` в папке `bot/`:

```env
BOT_TOKEN=your_token_from_botfather
ONBOARDING_URL=https://greenappsme.github.io/sitngo-tg-onboarding
```

Для systemd **не используйте кавычки** вокруг значений:

```env
BOT_TOKEN=7123456789:AAHxxxxxxxx
ONBOARDING_URL=https://greenappsme.github.io/sitngo-tg-onboarding
```

## 4. Проверка запуска

```bash
cd /webapps/tg-onboarding-bot/sitngo-tg-onboarding/bot
source venv/bin/activate
python3 bot.py
```

В терминале должно появиться:

```
Booking API listening on http://127.0.0.1:8787/api/booking
Starting the bot...
```

Остановка тестового запуска: `Ctrl+C`.

## 4.1. Menu Button и HTTP API

Telegram **не передаёт** данные формы через `sendData`, если Mini App открыт через **Menu Button** (кнопка меню слева от поля ввода). Это ограничение Telegram.

Для Menu Button бот поднимает HTTP API `/api/booking`. Mini App отправляет заявку на этот endpoint.

Добавьте в `.env`:

```env
BOOKING_API_HOST=127.0.0.1
BOOKING_API_PORT=8787
BOOKING_API_ALLOWED_ORIGINS=https://greenappsme.github.io
```

### Nginx (прокси на API)

Mini App на GitHub Pages должен обращаться к публичному URL вашего сервера, например:

`https://your-domain.com/api/booking`

Пример конфигурации nginx:

```nginx
location /api/booking {
    proxy_pass http://127.0.0.1:8787/api/booking;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### GitHub Pages — URL API при сборке

В настройках репозитория GitHub → **Settings → Secrets and variables → Actions → Variables** добавьте:

| Variable | Value |
|----------|-------|
| `VITE_BOOKING_API_URL` | `https://your-domain.com/api/booking` |

После push в `main` онбординг пересоберётся с этим URL.

Локально для теста создайте `app/.env.production`:

```env
VITE_BOOKING_API_URL=https://your-domain.com/api/booking
```

## 5. Systemd — автозапуск

Unit-файл уже лежит в репозитории: `bot/sitngo-bot.service`.

```bash
sudo cp /webapps/tg-onboarding-bot/sitngo-tg-onboarding/bot/sitngo-bot.service /etc/systemd/system/sitngo-bot.service
sudo systemctl daemon-reload
sudo systemctl enable sitngo-bot
sudo systemctl start sitngo-bot
sudo systemctl status sitngo-bot
```

### Полезные команды

```bash
# статус
sudo systemctl status sitngo-bot

# логи в реальном времени
journalctl -u sitngo-bot -f

# перезапуск после обновления кода
sudo systemctl restart sitngo-bot

# остановка
sudo systemctl stop sitngo-bot
```

## 6. Обновление бота после git pull

```bash
cd /webapps/tg-onboarding-bot/sitngo-tg-onboarding
git pull

cd bot
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart sitngo-bot
```

## 7. Проверка в Telegram

1. Откройте бота в Telegram
2. Отправьте `/start`
3. Откройте онбординг через **🚗 Аренда авто** или **Menu Button**
4. Пройдите онбординг и нажмите **Отправить заявку**
5. В чате должно появиться сообщение с заявкой

## Важно

- **KeyboardButton** (`/start` → 🚗 Аренда авто) — работает через `sendData` даже без HTTP API
- **Menu Button** — работает только если настроены HTTP API + `VITE_BOOKING_API_URL` + nginx
- Файл `.env` не коммитьте в git
- GitHub Pages деплоится автоматически при push в `main`; бота после изменений нужно перезапускать (`systemctl restart`)
