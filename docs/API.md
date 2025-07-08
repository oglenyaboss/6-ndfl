# API Документация 6-НДФЛ

## Содержание

- [Общая информация](#общая-информация)
- [Аутентификация](#аутентификация)
- [Форматы данных](#форматы-данных)
- [Обработка ошибок](#обработка-ошибок)
- [Эндпоинты](#эндпоинты)
- [Примеры использования](#примеры-использования)
- [SDK и библиотеки](#sdk-и-библиотеки)

## Общая информация

API 6-НДФЛ предоставляет набор эндпоинтов для обработки XML-файлов налоговой отчетности. Все эндпоинты работают с документами в формате XML версии 6.2.

### Базовый URL
```
http://localhost:3000/api
```

### Версия API
```
v1.0.0
```

### Поддерживаемые методы
- POST (все операции обработки)
- GET (получение информации)

## Аутентификация

В текущей версии аутентификация не требуется. Все эндпоинты доступны публично.

## Форматы данных

### Запрос
```javascript
Content-Type: application/json

{
  "xml": "<?xml version=\"1.0\" encoding=\"windows-1251\"?>...",
  "options": {
    // дополнительные параметры
  }
}
```

### Ответ
```javascript
Content-Type: application/json

{
  "success": true,
  "data": {
    "xml": "обработанный XML",
    "message": "Операция выполнена успешно"
  }
}
```

### Ошибка
```javascript
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Описание ошибки",
    "details": "Подробности ошибки"
  }
}
```

## Обработка ошибок

### Коды ошибок

| Код | Описание | HTTP Status |
|-----|----------|-------------|
| `INVALID_XML` | Неверный формат XML | 400 |
| `MISSING_REQUIRED_FIELD` | Отсутствует обязательное поле | 400 |
| `ENCODING_ERROR` | Ошибка кодировки | 400 |
| `PROCESSING_ERROR` | Ошибка обработки | 500 |
| `INTERNAL_ERROR` | Внутренняя ошибка сервера | 500 |

### Примеры ошибок

```javascript
// Неверный XML
{
  "success": false,
  "error": {
    "code": "INVALID_XML",
    "message": "Неверный формат XML документа",
    "details": "Expected '<' but found 'undefined'"
  }
}

// Отсутствует обязательное поле
{
  "success": false,
  "error": {
    "code": "MISSING_REQUIRED_FIELD",
    "message": "Отсутствует обязательное поле xml",
    "details": "Поле xml является обязательным для всех операций"
  }
}
```

## Эндпоинты

### 1. Исправление отрицательных доходов

**POST** `/api/correct-income`

Исправляет отрицательные и нулевые доходы в XML-документе.

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `xml` | string | Да | XML-документ в виде строки |

#### Логика обработки

1. Удаляет записи с отрицательными доходами
2. Удаляет записи с нулевыми доходами
3. Если отсутствует доход в январе, переносит 30% дохода с февраля

#### Пример запроса

```javascript
const response = await fetch('/api/correct-income', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    xml: `<?xml version="1.0" encoding="windows-1251"?>
    <Файл>
      <Документ>
        <НДФЛ6.2>
          <СправДох НомСпр="1">
            <ДохМес Месяц="01" Доход="-1000"/>
            <ДохМес Месяц="02" Доход="5000"/>
          </СправДох>
        </НДФЛ6.2>
      </Документ>
    </Файл>`
  })
});

const result = await response.json();
```

#### Пример ответа

```javascript
{
  "success": true,
  "data": {
    "xml": "<?xml version=\"1.0\" encoding=\"windows-1251\"?>...",
    "message": "Отрицательные доходы исправлены",
    "changes": {
      "removed": 1,
      "modified": 1
    }
  }
}
```

### 2. Корректировка исчисленного налога

**POST** `/api/correct-isch`

Устанавливает налог 13% от налоговой базы и выравнивает удержанный налог.

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `xml` | string | Да | XML-документ в виде строки |
| `rate` | number | Нет | Налоговая ставка (по умолчанию 13) |

#### Пример запроса

```javascript
const response = await fetch('/api/correct-isch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    xml: xmlString,
    rate: 13
  })
});
```

#### Пример ответа

```javascript
{
  "success": true,
  "data": {
    "xml": "исправленный XML",
    "message": "Исчисленный налог скорректирован",
    "changes": {
      "corrected": 15,
      "totalAmount": 125000
    }
  }
}
```

### 3. Сортировка по алфавиту

**POST** `/api/correct-abcorder`

Сортирует справки по алфавиту (Фамилия, Имя, Отчество).

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `xml` | string | Да | XML-документ в виде строки |

#### Пример запроса

```javascript
const response = await fetch('/api/correct-abcorder', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    xml: xmlString
  })
});
```

### 4. Исправление нумерации

**POST** `/api/correct-numorder`

Исправляет нумерацию справок (1, 2, 3, ...).

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `xml` | string | Да | XML-документ в виде строки |

#### Пример запроса

```javascript
const response = await fetch('/api/correct-numorder', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    xml: xmlString
  })
});
```

### 5. Объединение документов

**POST** `/api/merge-xml`

Объединяет два XML-документа в один.

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `xml1` | string | Да | Первый XML-документ |
| `xml2` | string | Да | Второй XML-документ |

#### Логика объединения

1. Шапка берется из первого документа
2. Справки объединяются по ИНН и ФИО
3. Дублирующиеся записи игнорируются
4. Нумерация справок исправляется

#### Пример запроса

```javascript
const response = await fetch('/api/merge-xml', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    xml1: primaryXml,
    xml2: secondaryXml
  })
});
```

#### Пример ответа

```javascript
{
  "success": true,
  "data": {
    "xml": "объединенный XML",
    "message": "Документы объединены",
    "stats": {
      "total": 50,
      "fromFirst": 30,
      "fromSecond": 20,
      "duplicates": 5
    }
  }
}
```

### 6. Установка номера корректировки

**POST** `/api/corr`

Устанавливает номер корректировки для всех справок.

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `xml` | string | Да | XML-документ в виде строки |
| `numCorr` | number | Да | Номер корректировки (0-99) |

#### Пример запроса

```javascript
const response = await fetch('/api/corr', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    xml: xmlString,
    numCorr: 1
  })
});
```

### 7. Обнуление корректировки

**POST** `/api/null-corr`

Создает аннулирующую корректировку (обнуляет все доходы).

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `xml` | string | Да | XML-документ в виде строки |

#### Пример запроса

```javascript
const response = await fetch('/api/null-corr', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    xml: xmlString
  })
});
```

### 8. Корректировка удержанного налога

**POST** `/api/correct-uderzh`

Выравнивает удержанный налог с исчисленным.

#### Параметры запроса

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `xml` | string | Да | XML-документ в виде строки |

#### Пример запроса

```javascript
const response = await fetch('/api/correct-uderzh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    xml: xmlString
  })
});
```

## Примеры использования

### Полный пример обработки документа

```javascript
class NDFLProcessor {
  constructor(baseUrl = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
  }

  async processDocument(xml) {
    try {
      // 1. Исправляем отрицательные доходы
      const step1 = await this.correctIncome(xml);
      
      // 2. Корректируем исчисленный налог
      const step2 = await this.correctTax(step1.data.xml);
      
      // 3. Сортируем по алфавиту
      const step3 = await this.sortAlphabetically(step2.data.xml);
      
      // 4. Исправляем нумерацию
      const step4 = await this.correctNumbering(step3.data.xml);
      
      return step4.data.xml;
    } catch (error) {
      console.error('Ошибка обработки:', error);
      throw error;
    }
  }

  async correctIncome(xml) {
    const response = await fetch(`${this.baseUrl}/correct-income`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xml })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async correctTax(xml) {
    const response = await fetch(`${this.baseUrl}/correct-isch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xml })
    });
    
    return await response.json();
  }

  async sortAlphabetically(xml) {
    const response = await fetch(`${this.baseUrl}/correct-abcorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xml })
    });
    
    return await response.json();
  }

  async correctNumbering(xml) {
    const response = await fetch(`${this.baseUrl}/correct-numorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xml })
    });
    
    return await response.json();
  }

  async mergeDocuments(xml1, xml2) {
    const response = await fetch(`${this.baseUrl}/merge-xml`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xml1, xml2 })
    });
    
    return await response.json();
  }
}

// Использование
const processor = new NDFLProcessor();
const processedXml = await processor.processDocument(originalXml);
```

### Обработка ошибок

```javascript
async function safeApiCall(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(`API Error: ${result.error.message}`);
    }

    return result.data;
  } catch (error) {
    console.error('Ошибка API:', error);
    
    if (error.name === 'TypeError') {
      throw new Error('Нет соединения с сервером');
    }
    
    throw error;
  }
}
```

## SDK и библиотеки

### JavaScript/TypeScript SDK

```typescript
interface NDFLApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

interface ProcessedXmlData {
  xml: string;
  message: string;
  changes?: any;
}

class NDFLApi {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
  }

  async correctIncome(xml: string): Promise<NDFLApiResponse<ProcessedXmlData>> {
    return this.makeRequest('/correct-income', { xml });
  }

  async correctTax(xml: string): Promise<NDFLApiResponse<ProcessedXmlData>> {
    return this.makeRequest('/correct-isch', { xml });
  }

  async sortAlphabetically(xml: string): Promise<NDFLApiResponse<ProcessedXmlData>> {
    return this.makeRequest('/correct-abcorder', { xml });
  }

  async correctNumbering(xml: string): Promise<NDFLApiResponse<ProcessedXmlData>> {
    return this.makeRequest('/correct-numorder', { xml });
  }

  async mergeDocuments(xml1: string, xml2: string): Promise<NDFLApiResponse<ProcessedXmlData>> {
    return this.makeRequest('/merge-xml', { xml1, xml2 });
  }

  async setCorrection(xml: string, numCorr: number): Promise<NDFLApiResponse<ProcessedXmlData>> {
    return this.makeRequest('/corr', { xml, numCorr });
  }

  async nullCorrection(xml: string): Promise<NDFLApiResponse<ProcessedXmlData>> {
    return this.makeRequest('/null-corr', { xml });
  }

  private async makeRequest(endpoint: string, data: any): Promise<NDFLApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    return await response.json();
  }
}
```

### Установка и использование

```bash
# Установка (если SDK опубликован как пакет)
npm install 6-ndfl-api

# Использование
import { NDFLApi } from '6-ndfl-api';

const api = new NDFLApi();
const result = await api.correctIncome(xmlString);
```

## Ограничения и рекомендации

### Ограничения

1. **Размер файла**: максимум 10MB
2. **Timeout**: 30 секунд на запрос
3. **Rate limiting**: 100 запросов в минуту
4. **Формат**: только XML версии 6.2

### Рекомендации

1. **Валидация**: всегда проверяйте XML перед отправкой
2. **Обработка ошибок**: используйте try-catch для всех запросов
3. **Кодировка**: убедитесь, что XML в windows-1251
4. **Тестирование**: тестируйте на копиях документов

## Поддержка

Если у вас есть вопросы по API:

1. Ознакомьтесь с [примерами](../examples/)
2. Проверьте [FAQ](./FAQ.md)
3. Создайте Issue на GitHub
4. Напишите разработчику: [oglenyaboss@icloud.com](mailto:oglenyaboss@icloud.com)