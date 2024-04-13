const fs = require("fs");
const xml2js = require("xml2js");
const iconv = require("iconv-lite");

// Введите пути к XML файлам вручную
const xmlFiles = [
  "1.xml",
  "2.xml",
  "3.xml",
  "4.xml",
  "5.xml",
  // "6.xml",
  // "7.xml",
  // "8.xml",
  // "9.xml",
  // "10.xml",
  // "11.xml",
  // "12.xml",
  // "13.xml",
  // "14.xml",
  // ... добавьте остальные пути к файлам
];

// Путь к выходному CSV файлу
const csvFile = "merged.csv";

// Объект для хранения данных с учетом даты
const dataMap = {};

// Функция для чтения и обработки XML файла
let data = [];

function processXmlFile(filepath) {
  const xmlData = fs.readFileSync(filepath); // Чтение файла без указания кодировки
  const xmlString = iconv.decode(xmlData, "win1251"); // Декодирование в UTF-8
  xml2js.parseString(xmlString, (err, result) => {
    if (err) {
      console.error(`Ошибка при обработке ${filepath}: ${err}`);
      return;
    }
    const document = result.Файл.Документ[0];
    console.log(document);
    const documentDate = new Date(document["$"].ДатаДок);

    document.УвИсчСумНалог.forEach((taxInfo) => {
      console.log(taxInfo);
      const key = `${taxInfo["$"].КППДекл}_${taxInfo["$"].ОКТМО}_${taxInfo["$"].Период}_${taxInfo["$"].НомерМесКварт}`;

      data.push({
        date: documentDate,
        kpp: taxInfo["$"].КППДекл,
        oktmo: taxInfo["$"].ОКТМО,
        sum: parseFloat(taxInfo["$"].СумНалогАванс),
        period: `${taxInfo["$"].Период} ${taxInfo["$"].НомерМесКварт}`,
      });
    });
  });
}
// Обработка каждого файла из списка
xmlFiles.forEach((filepath) => {
  processXmlFile(filepath);
});

// Преобразование данных в CSV
const csvData = [
  "KPP;OKTMO;CYMMA;KOD PERIODA",
  ...Object.values(data).map(
    (item) => `${item.kpp};${item.oktmo};${item.sum};${item.period}`
  ),
].join("\n");

// Запись CSV данных в файл
fs.writeFileSync(csvFile, csvData, "utf-8");
console.log(`CSV файл создан: ${csvFile}`);
