# Руководство по развертыванию 6-НДФЛ

## Содержание

- [Обзор вариантов развертывания](#обзор-вариантов-развертывания)
- [Подготовка к развертыванию](#подготовка-к-развертыванию)
- [Развертывание на Vercel](#развертывание-на-vercel)
- [Развертывание на Netlify](#развертывание-на-netlify)
- [Развертывание с Docker](#развертывание-с-docker)
- [Развертывание на VPS](#развертывание-на-vps)
- [Настройка домена и SSL](#настройка-домена-и-ssl)
- [Мониторинг и логирование](#мониторинг-и-логирование)
- [Оптимизация производительности](#оптимизация-производительности)
- [Резервное копирование](#резервное-копирование)

## Обзор вариантов развертывания

### Рекомендуемые платформы

| Платформа | Сложность | Стоимость | Производительность | Масштабируемость |
|-----------|-----------|-----------|-------------------|------------------|
| **Vercel** | Низкая | Бесплатно/Платно | Высокая | Автоматическая |
| **Netlify** | Низкая | Бесплатно/Платно | Высокая | Автоматическая |
| **Docker** | Средняя | Зависит от хостинга | Высокая | Ручная |
| **VPS** | Высокая | Средняя | Настраиваемая | Ручная |

### Выбор платформы

**Выберите Vercel если:**
- Нужно быстрое развертывание
- Планируете использовать другие продукты Vercel
- Требуется автоматическое масштабирование
- Бюджет позволяет платные планы для production

**Выберите Netlify если:**
- Нужна простота настройки
- Требуется интеграция с Git
- Планируете использовать JAMstack подход
- Достаточно бесплатного плана

**Выберите Docker если:**
- Нужен полный контроль над окружением
- Планируете развертывание на собственной инфраструктуре
- Требуется стандартизация окружения
- Есть опыт работы с контейнерами

**Выберите VPS если:**
- Нужен максимальный контроль
- Есть специфические требования к безопасности
- Планируете интеграцию с существующей инфраструктурой
- Есть команда для поддержки

## Подготовка к развертыванию

### Проверка готовности проекта

```bash
# Проверка зависимостей
npm audit

# Проверка TypeScript
npm run type-check

# Проверка линтинга
npm run lint

# Тестирование
npm run test

# Тестовая сборка
npm run build
```

### Настройка переменных окружения

Создайте файл `.env.production`:

```env
# Продакшн конфигурация
NODE_ENV=production

# Google Analytics (обязательно для production)
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-YOUR-ANALYTICS-ID

# URL приложения
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Настройки безопасности
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true

# API конфигурация
API_BASE_URL=https://your-domain.com/api
MAX_FILE_SIZE=10485760

# Настройки производительности
NEXT_PUBLIC_ENABLE_SW=true
NEXT_PUBLIC_CACHE_STRATEGY=stale-while-revalidate
```

### Оптимизация конфигурации Next.js

```javascript
// next.config.js для production
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Включение экспериментальных функций
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['xml2js', 'iconv-lite'],
  },

  // Оптимизация сборки
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Настройки изображений
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // Заголовки безопасности
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Content-Security-Policy',
          value: `
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
            style-src 'self' 'unsafe-inline';
            img-src 'self' data: https:;
            font-src 'self';
            connect-src 'self' https://www.google-analytics.com;
          `.replace(/\s+/g, ' ').trim(),
        },
      ],
    },
  ],

  // Переписывание путей
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: '/api/:path*',
    },
  ],

  // Webpack конфигурация
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      };
    }

    return config;
  },

  // Настройки output
  output: 'standalone',
  
  // Сжатие
  compress: true,

  // Трейсинг
  experimental: {
    ...nextConfig.experimental,
    instrumentationHook: true,
  },
};

module.exports = nextConfig;
```

## Развертывание на Vercel

### Автоматическое развертывание

1. **Подключение репозитория:**
```bash
# Установка Vercel CLI
npm install -g vercel

# Авторизация
vercel login

# Инициализация проекта
vercel
```

2. **Настройка через интерфейс:**
- Перейдите на https://vercel.com
- Нажмите "Import Project"
- Выберите GitHub репозиторий
- Настройте переменные окружения
- Нажмите "Deploy"

### Конфигурация vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ],
  "env": {
    "NEXT_PUBLIC_GOOGLE_ANALYTICS": "@google-analytics-id"
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  },
  "functions": {
    "app/api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

### Настройка переменных окружения в Vercel

```bash
# Через CLI
vercel env add NEXT_PUBLIC_GOOGLE_ANALYTICS production
vercel env add API_BASE_URL production

# Или через веб-интерфейс:
# 1. Перейдите в настройки проекта
# 2. Выберите "Environment Variables"
# 3. Добавьте необходимые переменные
```

### Настройка домена

```bash
# Добавление пользовательского домена
vercel domains add your-domain.com

# Настройка DNS
# Добавьте CNAME запись: www -> cname.vercel-dns.com
# Добавьте A запись: @ -> 76.76.19.61
```

## Развертывание на Netlify

### Автоматическое развертывание

1. **Подключение через интерфейс:**
- Зайдите на https://netlify.com
- Нажмите "New site from Git"
- Выберите GitHub репозиторий
- Настройте команды сборки

2. **Настройка сборки:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_ENV = "production"
  NEXT_PUBLIC_GOOGLE_ANALYTICS = "G-YOUR-ID"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  external_node_modules = ["xml2js", "iconv-lite"]
```

### Настройка переменных окружения

```bash
# Через Netlify CLI
npm install -g netlify-cli
netlify login
netlify env:set NEXT_PUBLIC_GOOGLE_ANALYTICS "G-YOUR-ID"

# Или через веб-интерфейс:
# Site settings -> Environment variables
```

### Настройка форм и функций

```javascript
// netlify/functions/api.js
export async function handler(event, context) {
  const { httpMethod, path, body } = event;
  
  if (httpMethod === 'POST' && path === '/api/correct-income') {
    try {
      const { xml } = JSON.parse(body);
      // Ваша логика обработки
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ success: true, data: result }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
  
  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Not found' }),
  };
}
```

## Развертывание с Docker

### Создание Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Установка зависимостей только при необходимости
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Установка зависимостей
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Сборка приложения
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Переменные окружения для сборки
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npm run build

# Production образ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Автоматическое использование output traces для уменьшения размера образа
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose для development

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_GOOGLE_ANALYTICS=${NEXT_PUBLIC_GOOGLE_ANALYTICS}
    command: npm run dev

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
```

### Docker Compose для production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_GOOGLE_ANALYTICS=${NEXT_PUBLIC_GOOGLE_ANALYTICS}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.prod.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

### Сборка и запуск

```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose -f docker-compose.prod.yml up -d

# Только сборка образа
docker build -t 6-ndfl:latest .

# Запуск контейнера
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_GOOGLE_ANALYTICS=G-YOUR-ID \
  6-ndfl:latest
```

## Развертывание на VPS

### Подготовка сервера

```bash
# Обновление системы (Ubuntu/Debian)
sudo apt update && sudo apt upgrade -y

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка PM2
sudo npm install -g pm2

# Установка Nginx
sudo apt install nginx -y

# Установка SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx -y
```

### Клонирование и настройка проекта

```bash
# Создание пользователя для приложения
sudo adduser ndfl-app
sudo usermod -aG sudo ndfl-app
su - ndfl-app

# Клонирование проекта
git clone https://github.com/oglenyaboss/6-ndfl.git
cd 6-ndfl

# Установка зависимостей
npm install

# Создание production переменных
cp .env.example .env.production
nano .env.production

# Сборка приложения
npm run build
```

### Настройка PM2

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: '6-ndfl',
      script: 'npm',
      args: 'start',
      cwd: '/home/ndfl-app/6-ndfl',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_GOOGLE_ANALYTICS: 'G-YOUR-ID',
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: '/var/log/pm2/6-ndfl-error.log',
      out_file: '/var/log/pm2/6-ndfl-out.log',
      log_file: '/var/log/pm2/6-ndfl-combined.log',
      time: true,
    },
  ],
};
```

```bash
# Запуск приложения
pm2 start ecosystem.config.js --env production

# Автозапуск при перезагрузке
pm2 save
pm2 startup

# Мониторинг
pm2 status
pm2 logs 6-ndfl
pm2 monit
```

### Настройка Nginx

```nginx
# /etc/nginx/sites-available/6-ndfl
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL конфигурация
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Заголовки безопасности
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Основной проксирующий блок
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Кэширование статических файлов
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, immutable, max-age=31536000";
    }

    # Кэширование изображений
    location ~* \.(jpg|jpeg|png|gif|ico|svg)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000";
    }

    # Лимиты загрузки
    client_max_body_size 10M;
}
```

```bash
# Активация конфигурации
sudo ln -s /etc/nginx/sites-available/6-ndfl /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Получение SSL сертификата
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Настройка логирования

```bash
# Создание директории для логов
sudo mkdir -p /var/log/6-ndfl
sudo chown ndfl-app:ndfl-app /var/log/6-ndfl

# Настройка logrotate
sudo tee /etc/logrotate.d/6-ndfl > /dev/null <<EOF
/var/log/6-ndfl/*.log {
    daily
    missingok
    rotate 52
    compress
    notifempty
    create 644 ndfl-app ndfl-app
    postrotate
        pm2 reload 6-ndfl
    endscript
}
EOF
```

### Настройка мониторинга

```bash
# Установка htop для мониторинга ресурсов
sudo apt install htop

# Установка netdata для веб-мониторинга
bash <(curl -Ss https://my-netdata.io/kickstart.sh)

# Настройка алертов через email
sudo apt install mailutils
```

## Настройка домена и SSL

### Покупка и настройка домена

1. **Выбор доменного имени:**
   - Простое и запоминающееся
   - Связанное с функциональностью (например, ndfl-tools.com)
   - Проверьте доступность на регистраторах

2. **Настройка DNS записей:**
```
# A записи
@     A     your-server-ip
www   A     your-server-ip

# Или CNAME для CDN
www   CNAME your-cdn.domain.com

# MX записи для email (опционально)
@     MX    10 mail.your-domain.com
```

### Настройка SSL сертификата

```bash
# Автоматическое получение через Let's Encrypt
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Настройка автоматического обновления
sudo crontab -e
# Добавить: 0 3 * * * /usr/bin/certbot renew --quiet

# Проверка конфигурации SSL
sudo certbot certificates
```

### Проверка безопасности

```bash
# Тест SSL конфигурации
curl -I https://your-domain.com

# Проверка заголовков безопасности
curl -I https://your-domain.com | grep -E "(X-Frame-Options|X-Content-Type-Options|X-XSS-Protection)"

# Онлайн проверка SSL
# https://www.ssllabs.com/ssltest/
```

## Мониторинг и логирование

### Настройка системы мониторинга

```javascript
// Healthcheck эндпоинт
// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0',
  };

  return NextResponse.json(health);
}
```

### Централизованное логирование

```javascript
// lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: '6-ndfl' },
  transports: [
    new winston.transports.File({ filename: '/var/log/6-ndfl/error.log', level: 'error' }),
    new winston.transports.File({ filename: '/var/log/6-ndfl/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

### Мониторинг производительности

```bash
# Установка и настройка Prometheus + Grafana
docker run -d \
  --name prometheus \
  -p 9090:9090 \
  -v /etc/prometheus:/etc/prometheus \
  prom/prometheus

docker run -d \
  --name grafana \
  -p 3001:3000 \
  -e "GF_SECURITY_ADMIN_PASSWORD=your-password" \
  grafana/grafana
```

### Алерты и уведомления

```bash
# Настройка Telegram бота для алертов
# 1. Создайте бота через @BotFather
# 2. Получите токен и chat_id
# 3. Настройте webhook для алертов

# Скрипт для проверки доступности
#!/bin/bash
# /usr/local/bin/check-app.sh

URL="https://your-domain.com/api/health"
TELEGRAM_TOKEN="your-bot-token"
CHAT_ID="your-chat-id"

if ! curl -f -s $URL > /dev/null; then
    MESSAGE="🚨 Приложение 6-НДФЛ недоступно!"
    curl -s "https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage" \
         -d "chat_id=$CHAT_ID" \
         -d "text=$MESSAGE"
fi
```

## Оптимизация производительности

### Настройка кэширования

```nginx
# Nginx кэширование
http {
    # Кэш для статических файлов
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=static:10m max_size=1g inactive=60m;
    
    server {
        # Кэширование API ответов
        location /api/ {
            proxy_cache static;
            proxy_cache_valid 200 5m;
            proxy_cache_key "$scheme$request_method$host$request_uri";
            
            proxy_pass http://localhost:3000;
        }
    }
}
```

### Настройка CDN

```javascript
// next.config.js
const nextConfig = {
  images: {
    domains: ['cdn.your-domain.com'],
    loader: 'custom',
    loaderFile: './lib/imageLoader.js',
  },
  
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.your-domain.com' 
    : undefined,
};
```

### Оптимизация базы данных

```javascript
// Если используете базу данных
// lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;
```

## Резервное копирование

### Автоматическое резервное копирование

```bash
#!/bin/bash
# /usr/local/bin/backup-app.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/6-ndfl"
APP_DIR="/home/ndfl-app/6-ndfl"

# Создание директории
mkdir -p $BACKUP_DIR

# Резервное копирование кода
tar -czf "$BACKUP_DIR/app_$DATE.tar.gz" -C "$APP_DIR" .

# Резервное копирование конфигурации
cp /etc/nginx/sites-available/6-ndfl "$BACKUP_DIR/nginx_$DATE.conf"
cp "$APP_DIR/.env.production" "$BACKUP_DIR/env_$DATE"

# Удаление старых бэкапов (старше 30 дней)
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

### Настройка cron для автоматических бэкапов

```bash
# Редактирование crontab
sudo crontab -e

# Добавление задач
# Ежедневный бэкап в 2:00
0 2 * * * /usr/local/bin/backup-app.sh >> /var/log/backup.log 2>&1

# Еженедельная проверка SSL сертификатов
0 4 * * 1 /usr/bin/certbot renew --quiet

# Ежемесячное обновление системы
0 5 1 * * apt update && apt upgrade -y
```

### Восстановление из резервной копии

```bash
#!/bin/bash
# /usr/local/bin/restore-app.sh

BACKUP_FILE=$1
APP_DIR="/home/ndfl-app/6-ndfl"

if [ -z "$BACKUP_FILE" ]; then
    echo "Использование: $0 backup_file.tar.gz"
    exit 1
fi

# Остановка приложения
pm2 stop 6-ndfl

# Создание резервной копии текущего состояния
mv $APP_DIR "$APP_DIR.backup.$(date +%Y%m%d_%H%M%S)"

# Восстановление из бэкапа
mkdir -p $APP_DIR
tar -xzf $BACKUP_FILE -C $APP_DIR

# Установка зависимостей и сборка
cd $APP_DIR
npm install
npm run build

# Запуск приложения
pm2 start 6-ndfl

echo "Restore completed"
```

## Проверочный список развертывания

### Перед развертыванием

- [ ] Код протестирован и проверен
- [ ] Все переменные окружения настроены
- [ ] SSL сертификат получен и настроен
- [ ] DNS записи настроены правильно
- [ ] Мониторинг и логирование настроены
- [ ] Резервное копирование настроено

### После развертывания

- [ ] Приложение доступно по HTTPS
- [ ] Все функции работают корректно
- [ ] Производительность соответствует ожиданиям
- [ ] Логи записываются правильно
- [ ] Алерты настроены и работают
- [ ] Резервные копии создаются автоматически

### Регулярное обслуживание

- [ ] Еженедельная проверка логов
- [ ] Ежемесячное обновление зависимостей
- [ ] Квартальная проверка безопасности
- [ ] Полугодовая проверка производительности

---

*Для получения дополнительной помощи по развертыванию обращайтесь к разработчику или создавайте Issues на GitHub.*