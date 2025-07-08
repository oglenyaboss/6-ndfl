// Примеры использования API 6-НДФЛ

// Базовый класс для работы с API
class NDFLApi {
  constructor(baseUrl = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
  }

  async makeRequest(endpoint, data) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'API request failed');
      }

      return result.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Исправление отрицательных доходов
  async correctIncome(xml) {
    return this.makeRequest('/correct-income', { xml });
  }

  // Корректировка исчисленного налога
  async correctTax(xml) {
    return this.makeRequest('/correct-isch', { xml });
  }

  // Сортировка по алфавиту
  async sortAlphabetically(xml) {
    return this.makeRequest('/correct-abcorder', { xml });
  }

  // Исправление нумерации
  async correctNumbering(xml) {
    return this.makeRequest('/correct-numorder', { xml });
  }

  // Объединение документов
  async mergeDocuments(xml1, xml2) {
    return this.makeRequest('/merge-xml', { xml1, xml2 });
  }

  // Установка номера корректировки
  async setCorrection(xml, numCorr) {
    return this.makeRequest('/corr', { xml, numCorr });
  }

  // Аннулирующая корректировка
  async nullCorrection(xml) {
    return this.makeRequest('/null-corr', { xml });
  }

  // Корректировка удержанного налога
  async correctWithheld(xml) {
    return this.makeRequest('/correct-uderzh', { xml });
  }
}

// Пример 1: Базовая обработка отчета
async function basicProcessing() {
  const api = new NDFLApi();
  const xmlContent = `<?xml version="1.0" encoding="windows-1251"?>
  <Файл>
    <Документ>
      <НДФЛ6.2>
        <СправДох НомСпр="1">
          <ПолучДох>
            <ФИО Фамилия="Иванов" Имя="Иван" Отчество="Иванович"/>
            <ИНН>123456789012</ИНН>
          </ПолучДох>
          <ДохМес Месяц="01" Доход="-5000"/>
          <ДохМес Месяц="02" Доход="50000"/>
          <ИсчисленНалог СуммаНалог="6000"/>
        </СправДох>
      </НДФЛ6.2>
    </Документ>
  </Файл>`;

  try {
    console.log('Начало обработки...');
    
    // 1. Исправляем отрицательные доходы
    const step1 = await api.correctIncome(xmlContent);
    console.log('✅ Исправлены отрицательные доходы');
    
    // 2. Корректируем исчисленный налог
    const step2 = await api.correctTax(step1.xml);
    console.log('✅ Скорректирован исчисленный налог');
    
    // 3. Сортируем по алфавиту
    const step3 = await api.sortAlphabetically(step2.xml);
    console.log('✅ Отсортировано по алфавиту');
    
    // 4. Исправляем нумерацию
    const final = await api.correctNumbering(step3.xml);
    console.log('✅ Исправлена нумерация');
    
    console.log('Обработка завершена успешно!');
    return final.xml;
    
  } catch (error) {
    console.error('Ошибка при обработке:', error.message);
    throw error;
  }
}

// Пример 2: Объединение двух отчетов
async function mergeReports() {
  const api = new NDFLApi();
  
  const report1 = `<?xml version="1.0" encoding="windows-1251"?>
  <Файл>
    <Документ>
      <НДФЛ6.2>
        <СправДох НомСпр="1">
          <ПолучДох>
            <ФИО Фамилия="Иванов" Имя="Иван" Отчество="Иванович"/>
            <ИНН>123456789012</ИНН>
          </ПолучДох>
          <ДохМес Месяц="01" Доход="50000"/>
        </СправДох>
      </НДФЛ6.2>
    </Документ>
  </Файл>`;

  const report2 = `<?xml version="1.0" encoding="windows-1251"?>
  <Файл>
    <Документ>
      <НДФЛ6.2>
        <СправДох НомСпр="1">
          <ПолучДох>
            <ФИО Фамилия="Петров" Имя="Петр" Отчество="Петрович"/>
            <ИНН>987654321098</ИНН>
          </ПолучДох>
          <ДохМес Месяц="01" Доход="60000"/>
        </СправДох>
      </НДФЛ6.2>
    </Документ>
  </Файл>`;

  try {
    const merged = await api.mergeDocuments(report1, report2);
    console.log('✅ Отчеты объединены успешно');
    console.log('Статистика:', merged.stats);
    
    return merged.xml;
  } catch (error) {
    console.error('Ошибка при объединении:', error.message);
    throw error;
  }
}

// Пример 3: Создание корректировки
async function createCorrection() {
  const api = new NDFLApi();
  const originalXml = `<?xml version="1.0" encoding="windows-1251"?>
  <Файл>
    <Документ>
      <НДФЛ6.2>
        <СправДох НомСпр="1">
          <ПолучДох>
            <ФИО Фамилия="Сидоров" Имя="Сидор" Отчество="Сидорович"/>
            <ИНН>456789123456</ИНН>
          </ПолучДох>
          <ДохМес Месяц="01" Доход="45000"/>
          <ИсчисленНалог СуммаНалог="5850"/>
        </СправДох>
      </НДФЛ6.2>
    </Документ>
  </Файл>`;

  try {
    // Установка корректировки №1
    const corrected = await api.setCorrection(originalXml, 1);
    console.log('✅ Установлена корректировка №1');
    
    return corrected.xml;
  } catch (error) {
    console.error('Ошибка при создании корректировки:', error.message);
    throw error;
  }
}

// Пример 4: Аннулирующая корректировка
async function createNullCorrection() {
  const api = new NDFLApi();
  const xmlToCancel = `<?xml version="1.0" encoding="windows-1251"?>
  <Файл>
    <Документ>
      <НДФЛ6.2>
        <СправДох НомСпр="1">
          <ПолучДох>
            <ФИО Фамилия="Козлов" Имя="Козла" Отчество="Козлович"/>
            <ИНН>789123456789</ИНН>
          </ПолучДох>
          <ДохМес Месяц="01" Доход="55000"/>
          <ИсчисленНалог СуммаНалог="7150"/>
        </СправДох>
      </НДФЛ6.2>
    </Документ>
  </Файл>`;

  try {
    const nulled = await api.nullCorrection(xmlToCancel);
    console.log('✅ Создана аннулирующая корректировка');
    
    return nulled.xml;
  } catch (error) {
    console.error('Ошибка при создании аннулирующей корректировки:', error.message);
    throw error;
  }
}

// Пример 5: Обработка с обработкой ошибок
async function robustProcessing(xmlContent) {
  const api = new NDFLApi();
  const operations = [
    { name: 'Исправление доходов', fn: () => api.correctIncome(xmlContent) },
    { name: 'Корректировка налога', fn: (xml) => api.correctTax(xml) },
    { name: 'Сортировка', fn: (xml) => api.sortAlphabetically(xml) },
    { name: 'Нумерация', fn: (xml) => api.correctNumbering(xml) }
  ];

  let currentXml = xmlContent;
  const results = [];

  for (const operation of operations) {
    try {
      console.log(`Выполнение: ${operation.name}...`);
      const result = await operation.fn(currentXml);
      currentXml = result.xml;
      results.push({
        operation: operation.name,
        success: true,
        changes: result.changes || 0
      });
      console.log(`✅ ${operation.name} выполнена`);
    } catch (error) {
      console.error(`❌ Ошибка в ${operation.name}:`, error.message);
      results.push({
        operation: operation.name,
        success: false,
        error: error.message
      });
      // Продолжаем с предыдущей версией XML
    }
  }

  return {
    finalXml: currentXml,
    operationResults: results
  };
}

// Пример 6: Batch обработка файлов
async function batchProcessing(xmlFiles) {
  const api = new NDFLApi();
  const results = [];

  for (let i = 0; i < xmlFiles.length; i++) {
    const file = xmlFiles[i];
    console.log(`Обработка файла ${i + 1} из ${xmlFiles.length}...`);
    
    try {
      const processed = await basicProcessing(file.content);
      results.push({
        filename: file.name,
        success: true,
        processedXml: processed
      });
    } catch (error) {
      results.push({
        filename: file.name,
        success: false,
        error: error.message
      });
    }
  }

  const successful = results.filter(r => r.success).length;
  console.log(`Обработано успешно: ${successful} из ${xmlFiles.length} файлов`);
  
  return results;
}

// Пример 7: Валидация XML перед обработкой
function validateXML(xmlString) {
  try {
    // Базовая проверка XML
    if (!xmlString || typeof xmlString !== 'string') {
      throw new Error('XML должен быть строкой');
    }

    // Проверка на наличие основных элементов
    const requiredElements = [
      '<Файл',
      '<Документ',
      '<НДФЛ6.2',
      '<СправДох'
    ];

    for (const element of requiredElements) {
      if (!xmlString.includes(element)) {
        throw new Error(`Отсутствует обязательный элемент: ${element}`);
      }
    }

    // Проверка на опасные конструкции
    const dangerousPatterns = [
      /<!DOCTYPE/i,
      /<!ENTITY/i,
      /<script/i
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(xmlString)) {
        throw new Error('Обнаружены потенциально опасные конструкции в XML');
      }
    }

    return true;
  } catch (error) {
    console.error('Ошибка валидации XML:', error.message);
    return false;
  }
}

// Пример 8: Использование с async/await и Promise.all
async function parallelProcessing(xmlFiles) {
  const api = new NDFLApi();
  
  // Обработка файлов параллельно (будьте осторожны с rate limiting)
  const promises = xmlFiles.map(async (file, index) => {
    try {
      // Добавляем небольшую задержку для избежания перегрузки
      await new Promise(resolve => setTimeout(resolve, index * 100));
      
      const result = await api.correctIncome(file.content);
      return {
        filename: file.name,
        success: true,
        result: result
      };
    } catch (error) {
      return {
        filename: file.name,
        success: false,
        error: error.message
      };
    }
  });

  const results = await Promise.all(promises);
  return results;
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    NDFLApi,
    basicProcessing,
    mergeReports,
    createCorrection,
    createNullCorrection,
    robustProcessing,
    batchProcessing,
    validateXML,
    parallelProcessing
  };
}

// Пример использования в браузере
if (typeof window !== 'undefined') {
  window.NDFLExamples = {
    NDFLApi,
    basicProcessing,
    mergeReports,
    createCorrection,
    createNullCorrection,
    robustProcessing,
    validateXML
  };
}