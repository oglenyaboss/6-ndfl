import { toast } from "sonner";
import { nanoid } from "nanoid";
const xml2js = require("xml2js");

const builder = new xml2js.Builder({
  xmldec: { version: "1.0", encoding: "windows-1251" },
});

const parser = new xml2js.Parser();

async function mergeXmlFiles(xml1: any, xml2: any) {
  const result1 = await parser.parseStringPromise(xml1);
  const result2 = await parser.parseStringPromise(xml2);

  const spravDox1 = result1["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];
  const spravDox2 = result2["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];

  const lastNomSpr = parseInt(spravDox1[spravDox1.length - 1]["$"]["НомСпр"]);

  spravDox2.forEach((spravDox: any, index: any) => {
    spravDox["$"]["НомСпр"] = (lastNomSpr + index + 1).toString();
  });

  let combinedSpravDox = spravDox1.concat(spravDox2);

  combinedSpravDox = combinedSpravDox.reduce((acc: any[], curr: any) => {
    const existingEntry = acc.find(
      (entry: any) =>
        entry["ПолучДох"][0]["$"]["ИННФЛ"] ===
          curr["ПолучДох"][0]["$"]["ИННФЛ"] &&
        entry["ПолучДох"][0]["ФИО"][0]["$"]["Имя"] ===
          curr["ПолучДох"][0]["ФИО"][0]["$"]["Имя"] &&
        entry["ПолучДох"][0]["ФИО"][0]["$"]["Фамилия"] ===
          curr["ПолучДох"][0]["ФИО"][0]["$"]["Фамилия"] &&
        entry["ПолучДох"][0]["ФИО"][0]["$"]["Отчество"] ===
          curr["ПолучДох"][0]["ФИО"][0]["$"]["Отчество"]
    );

    if (existingEntry) {
      curr["СведДох"][0]["ДохВыч"][0]["СвСумДох"].forEach(
        (currSvSumDoh: any) => {
          const existingSvSumDoh = existingEntry["СведДох"][0]["ДохВыч"][0][
            "СвСумДох"
          ].find(
            (svSumDoh: any) =>
              svSumDoh["$"]["Месяц"] === currSvSumDoh["$"]["Месяц"] &&
              svSumDoh["$"]["КодДоход"] === currSvSumDoh["$"]["КодДоход"]
          );

          if (existingSvSumDoh) {
            existingSvSumDoh["$"]["СумДоход"] = parseFloat(
              (
                parseFloat(existingSvSumDoh["$"]["СумДоход"]) +
                parseFloat(currSvSumDoh["$"]["СумДоход"])
              ).toFixed(2)
            );
          } else {
            existingEntry["СведДох"][0]["ДохВыч"][0]["СвСумДох"].push(
              currSvSumDoh
            );
          }
        }
      );

      curr["СведДох"][0]["НалВычССИ"]?.forEach((currNalVyachSSI: any) => {
        existingEntry["СведДох"][0]["НалВычССИ"]?.forEach(
          (existingNalVyachSSI: any) => {
            currNalVyachSSI["ПредВычССИ"].forEach((currPredVyachSSI: any) => {
              const existingPredVyachSSI = existingNalVyachSSI[
                "ПредВычССИ"
              ].find(
                (existingPredVyachSSI: any) =>
                  existingPredVyachSSI["$"]["КодВычет"] ===
                  currPredVyachSSI["$"]["КодВычет"]
              );
              if (existingPredVyachSSI) {
                existingPredVyachSSI["$"]["СумВычет"] = parseFloat(
                  (
                    parseFloat(existingPredVyachSSI["$"]["СумВычет"]) +
                    parseFloat(currPredVyachSSI["$"]["СумВычет"])
                  ).toFixed(0)
                );
              } else {
                console.log(existingEntry);
                if (!existingEntry["СведДох"][0]["НалВычССИ"]) {
                  existingEntry["СведДох"][0]["НалВычССИ"] = [];
                }

                if (!existingEntry["СведДох"][0]["НалВычССИ"][0]) {
                  existingEntry["СведДох"][0]["НалВычССИ"][0] = {};
                }

                if (
                  !existingEntry["СведДох"][0]["НалВычССИ"][0]["ПредВычССИ"]
                ) {
                  existingEntry["СведДох"][0]["НалВычССИ"][0]["ПредВычССИ"] =
                    [];
                }
                existingEntry["СведДох"][0]["НалВычССИ"][0]["ПредВычССИ"].push(
                  currNalVyachSSI["ПредВычССИ"]
                );
              }
            });
          }
        );
      });

      existingEntry["СведДох"][0]["СумИтНалПер"][0]["$"]["НалИсчисл"] =
        parseFloat(
          (
            parseFloat(
              existingEntry["СведДох"][0]["СумИтНалПер"][0]["$"]["НалИсчисл"]
            ) +
            parseFloat(curr["СведДох"][0]["СумИтНалПер"][0]["$"]["НалИсчисл"])
          ).toFixed(2)
        );

      existingEntry["СведДох"][0]["СумИтНалПер"][0]["$"]["НалУдерж"] =
        parseFloat(
          (
            parseFloat(
              existingEntry["СведДох"][0]["СумИтНалПер"][0]["$"]["НалУдерж"]
            ) +
            parseFloat(curr["СведДох"][0]["СумИтНалПер"][0]["$"]["НалУдерж"])
          ).toFixed(2)
        );
    } else {
      acc.push(curr);
    }

    return acc;
  }, []);

  combinedSpravDox = combinedSpravDox.reduce((acc: any[], curr: any) => {
    const existingEntryIndex = acc.findIndex(
      (entry: any) =>
        entry["ПолучДох"][0]["$"]["ИННФЛ"] ===
          curr["ПолучДох"][0]["$"]["ИННФЛ"] &&
        entry["ПолучДох"][0]["ФИО"][0]["$"]["Имя"] ===
          curr["ПолучДох"][0]["ФИО"][0]["$"]["Имя"] &&
        entry["ПолучДох"][0]["ФИО"][0]["$"]["Фамилия"] ===
          curr["ПолучДох"][0]["ФИО"][0]["$"]["Фамилия"] &&
        entry["ПолучДох"][0]["ФИО"][0]["$"]["Отчество"] ===
          curr["ПолучДох"][0]["ФИО"][0]["$"]["Отчество"]
    );

    if (existingEntryIndex === -1) {
      acc.push(curr);
    }

    return acc;
  }, []);

  result1["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"] = combinedSpravDox;

  const sumNalIsch1 =
    result1?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0]["$"][
      "СумНалИсч"
    ];
  const sumNalIsch2 =
    result2?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0]["$"][
      "СумНалИсч"
    ];

  const sumNalUder1 =
    result1?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0]["$"][
      "СумНалУдерж"
    ];
  const sumNalUder2 =
    result2?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0]["$"][
      "СумНалУдерж"
    ];

  const sumNalVoz1 =
    result1?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0]["$"][
      "СумНалВозвр"
    ];
  const sumNalVoz2 =
    result2?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0]["$"][
      "СумНалВозвр"
    ];

  result1["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0]["$"][
    "СумНалИсч"
  ] = +sumNalIsch1 + +sumNalIsch2;
  result1["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0]["$"][
    "СумНалУдерж"
  ] = +sumNalUder1 + +sumNalUder2;
  const xml = builder.buildObject(result1);
  return xml;
}

async function updateXml(xml: any) {
  console.log("started");
  const obj = await parser.parseStringPromise(xml);

  const header = obj?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0];

  const sumNalIsch = header["$"]["СумНалИсч"];
  const sumNalVoz = header["$"]["СумНалВозвр"];

  if (sumNalVoz === "0") {
    header["$"]["СумНалУдерж"] = sumNalIsch;
    header["$"]["СумНалНеУдерж"] = 0;
    header["$"]["СумНалИзлУдерж"] = 0;
  } else {
    toast.warning(
      "Сумма налога к возврату не равна нулю, проверьте удержанный налог!"
    );
    header["$"]["СумНалУдерж"] = +sumNalIsch + +sumNalVoz;
    header["$"]["СумНалНеУдерж"] = 0;
    header["$"]["СумНалИзлУдерж"] = 0;
  }

  const spravDohs = obj["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];

  console.log(spravDohs);

  spravDohs.forEach((spravDoh: any) => {
    const svedDoh = spravDoh["СведДох"];
    const nalIsch = svedDoh[0]["СумИтНалПер"][0]["$"]["НалИсчисл"];
    const nalVoz = svedDoh[0]["СумИтНалПер"][0]["$"]["НалВозвр"];
    svedDoh[0]["СумИтНалПер"][0]["$"]["НалПеречисл"] !== undefined
      ? (svedDoh[0]["СумИтНалПер"][0]["$"]["НалПеречисл"] = 0)
      : null;
    console.log(nalIsch);
    if (nalVoz === undefined) {
      svedDoh[0]["СумИтНалПер"][0]["$"]["НалУдерж"] = nalIsch;
      svedDoh[0]["СумИтНалПер"][0]["$"]["НалУдержЛиш"] = 0;
      console.log(nalVoz);
    } else {
      toast.warning(
        "Сумма налога к возврату не равна нулю, проверьте удержанный налог в 2-ндфл!"
      );
      svedDoh[0]["СумИтНалПер"][0]["$"]["НалУдерж"] = +nalIsch + +nalVoz;
      svedDoh[0]["СумИтНалПер"][0]["$"]["НалУдержЛиш"] = 0;
    }
  });

  const newXml = builder.buildObject(obj);
  return newXml;
}

// async function updateXMLWithCSV(csvDataString: string, xmlDataString: string) {
//   // Parse CSV string and convert it to array of objects
//   const csvData: any = [];
//   csvParser({ separator: ";" })
//     .on("data", (row: any) => csvData.push(row))
//     .write(csvDataString);
//   console.log(csvData);
//   // Parse XML string and convert it to JavaScript obƒject
//   const xmlDoc = await parser.parseStringPromise(xmlDataString);

//   // Update XML object with data from CSV
//   for (const row of csvData) {
//     for (const spravDoh of xmlDoc?.["Файл"]["Документ"][0]["НДФЛ6.2"][0][
//       "СправДох"
//     ]) {
//       if (
//         spravDoh["ПолучДох"][0]["ФИО"][0]["$"]["Фамилия"] === row["Фамилия"] &&
//         spravDoh["ПолучДох"][0]["ФИО"][0]["$"]["Имя"] === row["Имя"] &&
//         spravDoh["ПолучДох"][0]["ФИО"][0]["$"]["Отчество"] === row["Отчество"]
//       ) {
//         for (const svSumDoh of spravDoh["СведДох"][0]["ДохВыч"][0][
//           "СвСумДох"
//         ]) {
//           if (
//             svSumDoh["$"]["Месяц"] === "01" &&
//             svSumDoh["$"]["КодДоход"] === "2000"
//           ) {
//             if (row["Доход"]) {
//               svSumDoh["$"]["СумДоход"] = parseFloat(
//                 (
//                   parseFloat(svSumDoh["$"]["СумДоход"]) +
//                   parseFloat(row["Доход"].replace(",", ".")) / 0.87
//                 ).toFixed(2)
//               );
//               spravDoh["СведДох"][0]["СумИтНалПер"][0]["$"]["СумДохОбщ"] =
//                 parseFloat(
//                   (
//                     parseFloat(
//                       spravDoh["СведДох"][0]["СумИтНалПер"][0]["$"]["СумДохОбщ"]
//                     ) + parseFloat(row["Доход"].replace(",", "."))
//                   ).toFixed(2)
//                 );
//               spravDoh["СведДох"][0]["СумИтНалПер"][0]["$"]["НалБаза"] =
//                 parseFloat(
//                   parseFloat(
//                     spravDoh["СведДох"][0]["СумИтНалПер"][0]["$"]["СумДохОбщ"] +
//                       parseFloat(row["Доход"].replace(",", "."))
//                   ).toFixed(2)
//                 );
//             }
//             break;
//           }
//         }
//       }
//     }
//   }

//   // Convert updated XML object back to XML string
//   const newXmlData = builder.buildObject(xmlDoc);

//   return newXmlData;
// }

// async function deleteParmams(xml: any) {
//   const obj = await parser.parseStringPromise(xml);
//   console.log(obj);

//   obj["Файл"]["Документ"][0]["РасчетСВ"][0]["ПерсСвСтрахЛиц"].forEach(
//     (person: any) => {
//       // Проход по каждому СвВыплМК и зануление СумВыпл и НачислСВ
//       person["СвВыплСВОПС"][0]["СвВыпл"][0]["СвВыплМК"].forEach(
//         (payment: any) => {
//           payment["$"]["СумВыпл"] = "0";
//           if (payment["$"]["НачислСВ"]) {
//             payment["$"]["НачислСВ"] = "0";
//           }
//           if (payment["$"]["ВыплОПС"]) {
//             payment["$"]["ВыплОПС"] = "0";
//           }
//         }
//       );
//     }
//   );
//   const newXml = builder.buildObject(obj);

//   return newXml;
// }

async function correctNegativeIncome(xml: any) {
  const obj = await parser.parseStringPromise(xml);
  const spravDohs = obj?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];

  console.log(spravDohs);

  spravDohs.forEach((spravDoh: any) => {
    let dohVych = spravDoh["СведДох"][0]["ДохВыч"][0]["СвСумДох"];
    const fio = spravDoh["ПолучДох"][0]["ФИО"][0]["$"]; // Получаем ФИО

    let groupedDohVych: any[] = [];
    dohVych.forEach((svSumDoh: any) => {
      const month = svSumDoh["$"]["Месяц"];
      const kodDohod = svSumDoh["$"]["КодДоход"];
      const sumDohod = parseFloat(svSumDoh["$"]["СумДоход"]);

      const existingEntry = groupedDohVych.find(
        (entry: any) =>
          entry["$"]["Месяц"] === month && entry["$"]["КодДоход"] === kodDohod
      );

      if (existingEntry) {
        existingEntry["$"]["СумДоход"] = (
          parseFloat(existingEntry["$"]["СумДоход"]) + sumDohod
        ).toFixed(2);
      } else {
        groupedDohVych.push(svSumDoh);
      }
    });

    groupedDohVych.sort((a: any, b: any) => {
      const monthA = parseInt(a["$"]["Месяц"], 10);
      const monthB = parseInt(b["$"]["Месяц"], 10);

      return monthA - monthB;
    });

    // Заменяем исходный массив новым
    spravDoh["СведДох"][0]["ДохВыч"][0]["СвСумДох"] = groupedDohVych;

    // Проверяем, есть ли запись с месяцем '01'
    const hasJanuary = groupedDohVych.some(
      (entry: any) => entry["$"]["Месяц"] === "01" && entry["$"]["СумДоход"] > 0
    );

    if (!hasJanuary) {
      // Находим запись с месяцем '02'
      const februaryEntry = groupedDohVych.find(
        (entry: any) => entry["$"]["Месяц"] === "02"
      );

      if (februaryEntry) {
        // Сохраняем исходную сумму дохода
        const originalSum = parseFloat(februaryEntry["$"]["СумДоход"]);

        // Отнимаем 30% от суммы дохода
        const deductedSum = originalSum * 0.7;
        februaryEntry["$"]["СумДоход"] = deductedSum.toFixed(2);

        // Создаем новую запись с месяцем '01' и 30% от исходной суммы
        const januarySum = originalSum * 0.3;
        const januaryEntry = {
          ...februaryEntry,
          $: {
            ...februaryEntry["$"],
            Месяц: "01",
            СумДоход: januarySum.toFixed(2),
          },
        };
        groupedDohVych.push(januaryEntry);

        // Проверяем, есть ли разница из-за округления
        const totalAfter =
          parseFloat(februaryEntry["$"]["СумДоход"]) +
          parseFloat(januaryEntry["$"]["СумДоход"]);
        const difference = originalSum - totalAfter;

        if (difference !== 0) {
          // Добавляем разницу к записи для января
          januaryEntry["$"]["СумДоход"] = (januarySum + difference).toFixed(2);
        }

        // Сортируем массив снова, чтобы учесть новую запись
        groupedDohVych.sort((a: any, b: any) => {
          const monthA = parseInt(a["$"]["Месяц"], 10);
          const monthB = parseInt(b["$"]["Месяц"], 10);

          return monthA - monthB;
        });
      }
    }

    let hasNegative;
    do {
      hasNegative = false;
      groupedDohVych.forEach((svSumDoh: any) => {
        // Используем groupedDohVych вместо dohVych
        const sumDohod = parseFloat(svSumDoh["$"]["СумДоход"]);
        const kodDohod = svSumDoh["$"]["КодДоход"];

        if (sumDohod < 0) {
          const positiveIncomeIndex = groupedDohVych.findIndex(
            // Используем groupedDohVych вместо dohVych
            (doh: any) =>
              doh["$"]["КодДоход"] === kodDohod &&
              parseFloat(doh["$"]["СумДоход"]) > 0
          );

          if (positiveIncomeIndex !== -1) {
            const newSumDohod =
              parseFloat(groupedDohVych[positiveIncomeIndex]["$"]["СумДоход"]) + // Используем groupedDohVych вместо dohVych
              sumDohod;
            groupedDohVych[positiveIncomeIndex]["$"]["СумДоход"] = // Используем groupedDohVych вместо dohVych
              newSumDohod.toFixed(2);

            if (newSumDohod === 0) {
              groupedDohVych.splice(positiveIncomeIndex, 1); // Используем groupedDohVych вместо dohVych
            }

            svSumDoh["$"]["СумДоход"] = "0";
            hasNegative = true;
          } else {
            // Если не найдено соответствующего кода дохода, выводим ФИО в консоль
            console.log(
              `Не найден код дохода для ${fio["Фамил"]}, ${fio["Имя"]}, ${fio["Отчество"]}`
            );
            toast.warning(
              `Не найден код дохода для ${fio["Фамилия"]}, ${fio["Имя"]}, ${fio["Отчество"]}`
            );
          }
        }
      });
    } while (hasNegative);

    // Удалить нулевые строки
    spravDoh["СведДох"][0]["ДохВыч"][0]["СвСумДох"] = groupedDohVych.filter(
      // Используем groupedDohVych вместо dohVych
      (svSumDoh: any) => parseFloat(svSumDoh["$"]["СумДоход"]) !== 0
    );
  });

  const newXml = builder.buildObject(obj);
  return newXml;
}
async function correctTax(xml: any) {
  const obj = await parser.parseStringPromise(xml);
  const spravDohs = obj?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];

  let sumNalIschSec13 = 0;
  let sumNalIschSec15 = 0;
  let sumNalIschSec30 = 0;

  console.log(spravDohs);

  spravDohs.forEach((spravDoh: any) => {
    spravDoh["СведДох"].forEach((spravDoh: any) => {
      const stavka = spravDoh["$"]["Ставка"];
      const nalBase = spravDoh["СумИтНалПер"][0]["$"]["НалБаза"];
      if (nalBase < 10) {
        const fio = spravDoh["ПолучДох"][0]["ФИО"][0]["$"];
        toast.warning(
          `Налоговая база меньше 10 для ${fio["Фамилия"]}, ${fio["Имя"]}, ${fio["Отчество"]}`
        );
        console.log(
          `Налоговая база меньше 10 для ${fio["Фамилия"]}, ${fio["Имя"]}, ${fio["Отчество"]}`
        );
        // spravDoh = null;
      }
      if (nalBase === 0 || nalBase === undefined) {
        const fio = spravDoh["ПолучДох"][0]["ФИО"][0]["$"];
        toast.warning(
          `Не найдена налоговая база для ${fio["Фамилия"]}, ${fio["Имя"]}, ${fio["Отчество"]}`
        );
        console.log(
          `Не найдена налоговая база для ${fio["Фамилия"]}, ${fio["Имя"]}, ${fio["Отчество"]}`
        );
        // spravDoh = null;
      }
      spravDoh["СумИтНалПер"][0]["$"]["НалИсчисл"] = Math.round(
        nalBase * stavka * 0.01
      );
      if (stavka === "13") {
        sumNalIschSec13 += spravDoh["СумИтНалПер"][0]["$"]["НалИсчисл"];
      } else if (stavka === "15") {
        sumNalIschSec15 += spravDoh["СумИтНалПер"][0]["$"]["НалИсчисл"];
      } else if (stavka === "30") {
        sumNalIschSec30 += spravDoh["СумИтНалПер"][0]["$"]["НалИсчисл"];
      }
    });
  });
  console.log(sumNalIschSec15 + "////////");

  const header = obj?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"];

  header.forEach((header: any) => {
    if (header["$"]["Ставка"] === "13") {
      header["$"]["СумНалИсч"] = sumNalIschSec13;
    } else if (header["$"]["Ставка"] === "15") {
      header["$"]["СумНалИсч"] = sumNalIschSec15;
    } else if (header["$"]["Ставка"] === "30") {
      header["$"]["СумНалИсч"] = sumNalIschSec30;
    }
  });

  const newXml = builder.buildObject(obj);
  return newXml;
}

async function setNumCorr(xml: any, num: string) {
  const obj = await parser.parseStringPromise(xml);
  const spravDohs = obj?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];

  spravDohs.forEach((spravDoh: any) => {
    spravDoh["$"]["НомКорр"] = `0${num}`;
  });

  const newXml = builder.buildObject(obj);
  return newXml;
}

async function nullCorr(xml: any) {
  const obj = await parser.parseStringPromise(xml);
  const spravDohs = obj?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];

  console.log(spravDohs);

  spravDohs.forEach((spravDoh: any) => {
    spravDoh["СведДох"][0]["СумИтНалПер"][0]["$"]["НалИсчисл"] = 0;
    spravDoh["СведДох"][0]["СумИтНалПер"][0]["$"]["НалУдерж"] = 0;
    spravDoh["СведДох"][0]["НалВычССИ"] = null;
    let dohVych = spravDoh["СведДох"][0]["ДохВыч"][0]["СвСумДох"];

    dohVych.forEach((svSumDoh: any) => {
      svSumDoh["$"]["СумДоход"] = 0;
    });
  });
  const newXml = builder.buildObject(obj);
  return newXml;
}

async function kvartal(xml: any) {
  const obj = await parser.parseStringPromise(xml);

  const header = obj?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"];
  header["$"]["СумНалИсч"] = header["$"]["СумНалУдерж"];
  header["$"]["НалБаза"] = Math.round(
    header["$"]["СумНалУдерж"] / 0.13
  ).toFixed(2);
  header["$"]["НачислНач"] = header["$"]["НалБаза"] + header["$"]["СумВыч"];

  const newXml = builder.buildObject(obj);
  return newXml;
}

interface TaxInfo {
  $: {
    КБК: string;
    Год: string;
    КППДекл: string;
    ОКТМО: string;
    СумНалогАванс: string;
    Период: string;
    НомерМесКварт: string;
  };
}

interface TableRow {
  KPP: string;
  OKTMO: string;
  CYMMA: string;
  "KOD PERIODA": string;
}

async function processXmlData(files: string[]): Promise<TableRow[]> {
  const dataMap: Record<
    string,
    {
      date: Date;
      kpp: string;
      oktmo: string;
      sum: string;
      period: string;
      id: string;
    }
  > = {};

  files.forEach((xmlString) => {
    xml2js.parseString(xmlString, (err: any, result: any) => {
      if (err) {
        console.error(`Ошибка при обработке XML: ${err}`);
        return;
      }
      const document = result.Файл.Документ[0];
      const dateParts = document["$"].ДатаДок.split(".");
      const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      const documentDate = new Date(isoDate);
      console.log(documentDate);
      const taxInfos: TaxInfo[] = document.УвИсчСумНалог;

      taxInfos.forEach((taxInfo) => {
        if (taxInfo["$"].КБК !== "18210102010011000110") {
          return;
        }

        const key = `${taxInfo["$"].КППДекл}_${taxInfo["$"].ОКТМО}_${taxInfo["$"].Период}_${taxInfo["$"].НомерМесКварт}`;
        const existingData = dataMap[key];
        if (!existingData || documentDate === existingData.date) {
          dataMap[key] = {
            id: nanoid(),
            date: documentDate,
            kpp: taxInfo["$"].КППДекл,
            oktmo: taxInfo["$"].ОКТМО,
            sum: (
              parseFloat(taxInfo["$"].СумНалогАванс) +
              (existingData ? parseFloat(existingData.sum) : 0)
            ).toString(),
            period: `${taxInfo["$"].Период} ${taxInfo["$"].НомерМесКварт}`,
          };
        } else if (!existingData || documentDate > existingData.date) {
          dataMap[key] = {
            id: nanoid(),
            date: documentDate,
            kpp: taxInfo["$"].КППДекл,
            oktmo: taxInfo["$"].ОКТМО,
            sum: taxInfo["$"].СумНалогАванс,
            period: `${taxInfo["$"].Период} ${taxInfo["$"].НомерМесКварт}`,
          };
        }
      });
    });
  });

  const sortedData = Object.values(dataMap).map((item) => ({
    KPP: item.kpp,
    OKTMO: item.oktmo,
    CYMMA: item.sum,
    "KOD PERIODA": item.period,
  }));

  sortedData.sort((a, b) => {
    const order = ["21 01", "21 11", "21 02", "21 12", "21 03", "21 13"];
    return order.indexOf(a["KOD PERIODA"]) - order.indexOf(b["KOD PERIODA"]);
  });

  return sortedData;
}

export {
  mergeXmlFiles,
  updateXml,
  correctNegativeIncome,
  correctTax,
  setNumCorr,
  nullCorr,
  kvartal,
  processXmlData,
};
