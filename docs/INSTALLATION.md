# Детальное руководство по установке 6-НДФЛ

## Содержание

- [Системные требования](#системные-требования)
- [Предварительная подготовка](#предварительная-подготовка)
- [Установка](#установка)
- [Настройка](#настройка)
- [Запуск](#запуск)
- [Проверка работоспособности](#проверка-работоспособности)
- [Решение проблем](#решение-проблем)
- [Docker установка](#docker-установка)

## Системные требования

### Минимальные требования

- **Операционная система**: Windows 10/11, macOS 10.15+, Linux (Ubuntu 18.04+)
- **Node.js**: версия 18.0.0 или выше
- **npm**: версия 8.0.0 или выше (устанавливается вместе с Node.js)
- **Память**: минимум 4 GB RAM
- **Свободное место**: минимум 1 GB

### Рекомендуемые требования

- **Операционная система**: Windows 11, macOS 12+, Linux (Ubuntu 20.04+)
- **Node.js**: версия 20.0.0 или выше
- **npm**: версия 10.0.0 или выше
- **Память**: 8 GB RAM или больше
- **Свободное место**: 2 GB или больше

## Предварительная подготовка

### 1. Установка Node.js

#### Windows
1. Скачайте установщик Node.js с [официального сайта](https://nodejs.org/)
2. Запустите установщик и следуйте инструкциям
3. Откройте командную строку (cmd) и проверьте установку:
```bash
node --version
npm --version
```

#### macOS
```bash
# Через Homebrew (рекомендуется)
brew install node

# Или скачайте установщик с nodejs.org
```

#### Linux (Ubuntu/Debian)
```bash
# Обновите список пакетов
sudo apt update

# Установите Node.js
sudo apt install nodejs npm

# Проверьте версии
node --version
npm --version
```

### 2. Установка Git

#### Windows
1. Скачайте Git с [официального сайта](https://git-scm.com/)
2. Запустите установщик и следуйте инструкциям

#### macOS
```bash
# Через Homebrew
brew install git

# Или через Xcode Command Line Tools
xcode-select --install
```

#### Linux
```bash
sudo apt install git
```

## Установка

### 1. Клонирование репозитория

```bash
# Создайте директорию для проекта
mkdir ~/projects
cd ~/projects

# Клонируйте репозиторий
git clone https://github.com/oglenyaboss/6-ndfl.git

# Перейдите в директорию проекта
cd 6-ndfl
```

### 2. Установка зависимостей

```bash
# Установите все зависимости
npm install

# Или используйте yarn (если предпочитаете)
yarn install
```

### 3. Проверка целостности

```bash
# Проверьте, что все зависимости установлены корректно
npm audit

# Если есть уязвимости, исправьте их
npm audit fix
```

## Настройка

### 1. Переменные окружения

Создайте файл `.env.local` в корне проекта:

```bash
# Скопируйте пример конфигурации
cp .env.example .env.local

# Или создайте файл вручную
touch .env.local
```

Добавьте в файл `.env.local`:

```env
# Google Analytics (опционально)
NEXT_PUBLIC_GOOGLE_ANALYTICS=your-ga-id

# Настройки разработки
NODE_ENV=development

# Порт для локального сервера (по умолчанию 3000)
PORT=3000
```

### 2. Настройка TypeScript

```bash
# Проверьте конфигурацию TypeScript
npm run type-check
```

### 3. Настройка линтера

```bash
# Проверьте настройки ESLint
npm run lint
```

## Запуск

### Режим разработки

```bash
# Запустите приложение в режиме разработки
npm run dev

# Или с Yarn
yarn dev
```

Приложение будет доступно по адресу: `http://localhost:3000`

### Сборка для production

```bash
# Соберите приложение для production
npm run build

# Запустите собранное приложение
npm start
```

## Проверка работоспособности

### 1. Базовая проверка

1. Откройте браузер и перейдите на `http://localhost:3000`
2. Вы должны увидеть главную страницу приложения 6-НДФЛ
3. Проверьте переключение между версиями интерфейса

### 2. Функциональное тестирование

1. Попробуйте загрузить тестовый XML-файл
2. Проверьте работу различных вкладок
3. Убедитесь, что все кнопки функционируют корректно

### 3. Проверка логов

```bash
# Откройте консоль разработчика в браузере (F12)
# Убедитесь, что нет критических ошибок
```

## Решение проблем

### Частые проблемы и их решения

#### Проблема: `node: command not found`
```bash
# Убедитесь, что Node.js установлен
node --version

# Если не установлен, повторите установку Node.js
```

#### Проблема: `npm install` завершается с ошибкой
```bash
# Очистите кэш npm
npm cache clean --force

# Удалите node_modules и package-lock.json
rm -rf node_modules package-lock.json

# Повторите установку
npm install
```

#### Проблема: Порт 3000 занят
```bash
# Найдите процесс, использующий порт 3000
lsof -i :3000

# Завершите процесс
kill -9 PID

# Или используйте другой порт
PORT=3001 npm run dev
```

#### Проблема: Ошибки TypeScript
```bash
# Проверьте конфигурацию TypeScript
npm run type-check

# Переустановите типы
npm install --save-dev @types/node @types/react @types/react-dom
```

#### Проблема: Проблемы с кодировкой XML
```bash
# Убедитесь, что установлен iconv-lite
npm install iconv-lite

# Проверьте, что файлы XML в кодировке windows-1251
```

### Логи и диагностика

```bash
# Включите подробные логи
DEBUG=* npm run dev

# Проверьте логи Next.js
npm run dev -- --verbose
```

## Docker установка

### Dockerfile

Создайте файл `Dockerfile` в корне проекта:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose

Создайте файл `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Сборка и запуск

```bash
# Соберите образ
docker build -t 6-ndfl .

# Запустите контейнер
docker run -p 3000:3000 6-ndfl

# Или используйте docker-compose
docker-compose up -d
```

## Дополнительные настройки

### Настройка для разработки

```bash
# Установите дополнительные инструменты разработки
npm install --save-dev @types/node @types/react @types/react-dom

# Настройте pre-commit hooks
npm install --save-dev husky lint-staged
```

### Оптимизация производительности

```bash
# Проанализируйте размер bundle
npm run build -- --analyze

# Оптимизируйте изображения
npm install --save-dev next-optimized-images
```

## Полезные ссылки

- [Официальная документация Next.js](https://nextjs.org/docs)
- [Документация Node.js](https://nodejs.org/docs)
- [Руководство по TypeScript](https://www.typescriptlang.org/docs)
- [Документация React](https://react.dev)

## Поддержка

Если у вас возникли проблемы с установкой:

1. Проверьте [Issues на GitHub](https://github.com/oglenyaboss/6-ndfl/issues)
2. Создайте новый Issue с подробным описанием проблемы
3. Обратитесь к разработчику: [oglenyaboss@icloud.com](mailto:oglenyaboss@icloud.com)