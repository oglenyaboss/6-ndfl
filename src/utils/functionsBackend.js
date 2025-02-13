import { nanoid } from "nanoid";
import iconv from "iconv-lite";
import xml2js from "xml2js";

const builder = new xml2js.Builder({
  xmldec: { version: "1.0", encoding: "windows-1251" },
});

const parser = new xml2js.Parser();

export async function mergeXmlFiles(obj1, obj2) {
  try {
    const spravDox1 = obj1["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];
    const spravDox2 = obj2["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];

    const lastNomSpr = parseInt(spravDox1[spravDox1.length - 1]["$"]["НомСпр"]);

    spravDox2.forEach((spravDox, index) => {
      spravDox["$"]["НомСпр"] = (lastNomSpr + index + 1).toString();
    });

    let combinedSpravDox = spravDox1.concat(spravDox2);

    combinedSpravDox = combinedSpravDox.reduce((acc, curr) => {
      const existingEntry = acc.find(
        (entry) =>
          // entry["ПолучДох"][0]["$"]["ИННФЛ"] ===
          //   curr["ПолучДох"][0]["$"]["ИННФЛ"] &&
          entry["ПолучДох"][0]["ФИО"][0]["$"]["Имя"]?.toLowerCase() ===
            curr["ПолучДох"][0]["ФИО"][0]["$"]["Имя"]?.toLowerCase() &&
          entry["ПолучДох"][0]["ФИО"][0]["$"]["Фамилия"]?.toLowerCase() ===
            curr["ПолучДох"][0]["ФИО"][0]["$"]["Фамилия"]?.toLowerCase() &&
          entry["ПолучДох"][0]["ФИО"][0]["$"]["Отчество"]?.toLowerCase() ===
            curr["ПолучДох"][0]["ФИО"][0]["$"]["Отчество"]?.toLowerCase() &&
          entry["ПолучДох"][0]["$"]["ДатаРожд"] ===
            curr["ПолучДох"][0]["$"]["ДатаРожд"]
      );
      if (existingEntry) {
        curr["СведДох"][0]["ДохВыч"][0]["СвСумДох"].forEach((currSvSumDoh) => {
          const existingSvSumDoh = existingEntry["СведДох"]?.[0]["ДохВыч"][0][
            "СвСумДох"
          ].find(
            (svSumDoh) =>
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
            existingEntry["СведДох"]?.[0]["ДохВыч"][0]["СвСумДох"].push(
              currSvSumDoh
            );
          }
        });

        curr["СведДох"][0]["НалВычССИ"]?.forEach((currNalVyachSSI) => {
          existingEntry["СведДох"][0]["НалВычССИ"]?.forEach(
            (existingNalVyachSSI) => {
              currNalVyachSSI["ПредВычССИ"].forEach((currPredVyachSSI) => {
                const existingPredVyachSSI = existingNalVyachSSI[
                  "ПредВычССИ"
                ].find(
                  (existingPredVyachSSI) =>
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
                  existingEntry["СведДох"][0]["НалВычССИ"][0][
                    "ПредВычССИ"
                  ].push(currNalVyachSSI["ПредВычССИ"]);
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

    combinedSpravDox = combinedSpravDox.reduce((acc, curr) => {
      const existingEntryIndex = acc.findIndex(
        (entry) =>
          // entry["ПолучДох"][0]["$"]["ИННФЛ"] ===
          //   curr["ПолучДох"][0]["$"]["ИННФЛ"] &&
          entry["ПолучДох"][0]["ФИО"][0]["$"]["Имя"]?.toLowerCase() ===
            curr["ПолучДох"][0]["ФИО"][0]["$"]["Имя"]?.toLowerCase() &&
          entry["ПолучДох"][0]["ФИО"][0]["$"]["Фамилия"]?.toLowerCase() ===
            curr["ПолучДох"][0]["ФИО"][0]["$"]["Фамилия"]?.toLowerCase() &&
          entry["ПолучДох"][0]["ФИО"][0]["$"]["Отчество"]?.toLowerCase() ===
            curr["ПолучДох"][0]["ФИО"][0]["$"]["Отчество"]?.toLowerCase() &&
          entry["ПолучДох"][0]["$"]["ДатаРожд"] ===
            curr["ПолучДох"][0]["$"]["ДатаРожд"]
      );

      if (existingEntryIndex === -1) {
        acc.push(curr);
      }

      return acc;
    }, []);

    obj1["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"] = combinedSpravDox;

    const sumNalIsch1 =
      obj1?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0]["$"][
        "СумНалИсч"
      ];
    const sumNalIsch2 =
      obj1?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0]["$"][
        "СумНалИсч"
      ];

    const sumNalUder1 =
      obj1?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0]["$"][
        "СумНалУдерж"
      ];
    const sumNalUder2 =
      obj2?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0]["$"][
        "СумНалУдерж"
      ];

    const sumNalVoz1 =
      obj1?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0]["$"][
        "СумНалВозвр"
      ];
    const sumNalVoz2 =
      obj2?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0]["$"][
        "СумНалВозвр"
      ];

    obj1["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0]["$"][
      "СумНалИсч"
    ] = +sumNalIsch1 + +sumNalIsch2;
    obj1["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0]["$"][
      "СумНалУдерж"
    ] = +sumNalUder1 + +sumNalUder2;

    return obj1;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при обработке XML");
  }
}

export async function correctUderzhTax(xml) {
  try {
    const header = xml?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0];

    const sumNalIsch = header["$"]["СумНалИсч"];
    const sumNalVoz = header["$"]["СумНалВозвр"];

    if (sumNalVoz === "0") {
      header["$"]["СумНалУдерж"] = sumNalIsch;
      header["$"]["СумНалНеУдерж"] = 0;
      header["$"]["СумНалИзлУдерж"] = 0;
    } else {
      header["$"]["СумНалУдерж"] = +sumNalIsch + +sumNalVoz;
      header["$"]["СумНалНеУдерж"] = 0;
      header["$"]["СумНалИзлУдерж"] = 0;
    }

    const spravDohs = xml["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];

    console.log(spravDohs);

    spravDohs.forEach((spravDoh) => {
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
        svedDoh[0]["СумИтНалПер"][0]["$"]["НалУдерж"] = +nalIsch + +nalVoz;
        svedDoh[0]["СумИтНалПер"][0]["$"]["НалУдержЛиш"] = 0;
      }
    });

    return xml;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при обработке XML");
  }
}

export async function correctNegativeIncome(xml) {
  try {
    const spravDohs = xml?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];
    let sumDoh = 0;

    console.log(spravDohs);

    spravDohs.forEach((spravDoh) => {
      let dohVych = spravDoh["СведДох"][0]["ДохВыч"][0]["СвСумДох"];
      const fio = spravDoh["ПолучДох"][0]["ФИО"][0]["$"]; // Получаем ФИО

      let groupedDohVych = [];
      dohVych.forEach((svSumDoh) => {
        sumDoh += parseFloat(svSumDoh["$"]["СумДоход"]);
        const month = svSumDoh["$"]["Месяц"];
        const kodDohod = svSumDoh["$"]["КодДоход"];
        const sumDohod = parseFloat(svSumDoh["$"]["СумДоход"]);

        const existingEntry = groupedDohVych.find(
          (entry) =>
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

      groupedDohVych.sort((a, b) => {
        const monthA = parseInt(a["$"]["Месяц"], 10);
        const monthB = parseInt(b["$"]["Месяц"], 10);

        return monthA - monthB;
      });

      // Заменяем исходный массив новым
      spravDoh["СведДох"][0]["ДохВыч"][0]["СвСумДох"] = groupedDohVych;

      // Проверяем, есть ли запись с месяцем '01'
      const hasJanuary = groupedDohVych.some(
        (entry) => entry["$"]["Месяц"] === "01" && entry["$"]["СумДоход"] > 0
      );

      if (!hasJanuary) {
        // Находим запись с месяцем '02'
        const februaryEntry = groupedDohVych.find(
          (entry) => entry["$"]["Месяц"] === "02"
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
            januaryEntry["$"]["СумДоход"] = (januarySum + difference).toFixed(
              2
            );
          }

          // Сортируем массив снова, чтобы учесть новую запись
          groupedDohVych.sort((a, b) => {
            const monthA = parseInt(a["$"]["Месяц"], 10);
            const monthB = parseInt(b["$"]["Месяц"], 10);

            return monthA - monthB;
          });
        }
      }

      let hasNegative;
      do {
        hasNegative = false;
        groupedDohVych.forEach((svSumDoh) => {
          // Используем groupedDohVych вместо dohVych
          const sumDohod = parseFloat(svSumDoh["$"]["СумДоход"]);
          const kodDohod = svSumDoh["$"]["КодДоход"];

          if (sumDohod < 0) {
            const positiveIncomeIndex = groupedDohVych.findIndex(
              // Используем groupedDohVych вместо dohVych
              (doh) =>
                doh["$"]["КодДоход"] === kodDohod &&
                parseFloat(doh["$"]["СумДоход"]) > 0
            );

            if (positiveIncomeIndex !== -1) {
              const newSumDohod =
                parseFloat(
                  groupedDohVych[positiveIncomeIndex]["$"]["СумДоход"]
                ) + // Используем groupedDohVych вместо dohVych
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
            }
          }
        });
      } while (hasNegative);

      // Удалить нулевые строки
      spravDoh["СведДох"][0]["ДохВыч"][0]["СвСумДох"] = groupedDohVych.filter(
        // Используем groupedDohVych вместо dohVych
        (svSumDoh) => parseFloat(svSumDoh["$"]["СумДоход"]) !== 0
      );
    });

    return xml;
  } catch (error) {
    throw new Error("Ошибка при обработке XML");
  }
}
export async function correctTax(xml) {
  try {
    const spravDohs = xml?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];

    let sumNalIschSec13 = 0;
    let sumNalIschSec15 = 0;
    let sumNalIschSec30 = 0;

    spravDohs.forEach((spravDoh) => {
      const fio = spravDoh["ПолучДох"][0]["ФИО"][0]["$"];
      spravDoh["СведДох"].forEach((spravDoh) => {
        const stavka = spravDoh["$"]["Ставка"];
        const nalBase = spravDoh["СумИтНалПер"][0]["$"]["НалБаза"];
        console.log(spravDoh);
        if (nalBase < 10) {
          console.log(
            `Налоговая база меньше 10 для ${fio["Фамилия"]}, ${fio["Имя"]}, ${fio["Отчество"]}`
          );
          // spravDoh = null;
        }
        if (nalBase === 0 || nalBase === undefined) {
          const fio = spravDoh["ПолучДох"][0]["ФИО"][0]["$"];
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

    const header = xml?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"];

    header.forEach((header) => {
      if (header["$"]["Ставка"] === "13") {
        header["$"]["СумНалИсч"] = sumNalIschSec13;
      } else if (header["$"]["Ставка"] === "15") {
        header["$"]["СумНалИсч"] = sumNalIschSec15;
      } else if (header["$"]["Ставка"] === "30") {
        header["$"]["СумНалИсч"] = sumNalIschSec30;
      }
    });

    return xml;
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при обработке XML");
  }
}

export async function setNumCorr(obj, num) {
  try {
    if (parseInt(num) < 10) {
      obj.Файл.Документ[0].$.НомКорр = `0${num}`;
    } else {
      obj.Файл.Документ[0].$.НомКорр = `${num}`;
    }

    if (obj.Файл.Документ[0].$.Период === "34") {
      const spravDohs = obj?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];

      spravDohs.forEach((spravDoh) => {
        if (parseInt(num) < 10) {
          spravDoh["$"]["НомКорр"] = `0${num}`;
        } else {
          spravDoh["$"]["НомКорр"] = `${num}`;
        }
      });
    }
    return obj;
  } catch (error) {
    throw new Error("Ошибка при обработке XML");
  }
}

export async function nullCorr(obj) {
  try {
    obj["Файл"]["Документ"][0]["НДФЛ6.2"][0]["ОбязНА"][0]["$"]["СумНалВоз"] = 0;
    obj["Файл"]["Документ"][0]["НДФЛ6.2"][0]["ОбязНА"][0]["$"]["СумНалУд"] = 0;
    console.log(obj["Файл"]["Документ"][0]["НДФЛ6.2"]);
    if (obj.Файл.Документ[0]["НДФЛ6.2"][0].ОбязНА[0].$.СумНалУд !== 0) {
      Object.keys(
        obj.Файл.Документ[0]["НДФЛ6.2"][0].ОбязНА[0].СведСумНалУд[0].$
      ).forEach((key) => {
        if (key !== "КБК" && key !== "Ставка") {
          delete obj["Файл"]["Документ"][0]["НДФЛ6.2"][0]["ОбязНА"][0][
            "СведСумНалУд"
          ][0]["$"][key];
        }
      });
    }

    let objData =
      obj["Файл"]["Документ"][0]["НДФЛ6.2"][0]["РасчСумНал"][0]["$"];

    Object.keys(objData).forEach((key) => {
      if (key !== "Ставка" && key !== "КБК") {
        objData[key] = "0";
      }
    });
    if (obj.Файл.Документ[0].$.Период === "34") {
      const spravDohs = obj?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];
      spravDohs.forEach((spravDoh) => {
        spravDoh["СведДох"][0]["СумИтНалПер"][0]["$"]["НалБаза"] = 0;
        spravDoh["СведДох"][0]["СумИтНалПер"][0]["$"]["СумДохОбщ"] = 0;
        spravDoh["СведДох"][0]["СумИтНалПер"][0]["$"]["НалИсчисл"] = 0;
        spravDoh["СведДох"][0]["СумИтНалПер"][0]["$"]["НалУдерж"] = 0;
        spravDoh["$"]["НомКорр"] = `99`;
        if (spravDoh["СведДох"][0]["СумИтНалПер"][0]["$"]["НалПеречисл"]) {
          spravDoh["СведДох"][0]["СумИтНалПер"][0]["$"]["НалПеречисл"] = 0;
        }
        delete spravDoh["СведДох"][0]["НалВычССИ"];
        spravDoh["СведДох"][0]["ДохВыч"][0]["СвСумДох"].forEach((doh) => {
          doh.$.СумДоход = 0;
          delete doh.СвСумВыч;
        });
      });
    }

    return obj;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при обработке XML");
  }
}

export async function kvartal(obj) {
  try {
    const sumNalIsch =
      obj?.Файл.Документ[0]["НДФЛ6.2"][0].РасчСумНал[0].$.СумНалИсч;
    const sumNalUder =
      obj?.Файл.Документ[0]["НДФЛ6.2"][0].РасчСумНал[0].$.СумНалУдерж;
    const sumVich = obj?.Файл.Документ[0]["НДФЛ6.2"][0].РасчСумНал[0].$.СумВыч;
    const nalBaza = obj?.Файл.Документ[0]["НДФЛ6.2"][0].РасчСумНал[0].$.НалБаза;

    obj.Файл.Документ[0]["НДФЛ6.2"][0].РасчСумНал[0].$.СумНалИсч =
      nalBaza * 0.13;
    obj.Файл.Документ[0]["НДФЛ6.2"][0].РасчСумНал[0].$.СумНалУдерж =
      obj.Файл.Документ[0]["НДФЛ6.2"][0].РасчСумНал[0].$.СумНалИсч;
    return obj;
  } catch (error) {
    throw new Error("Ошибка при обработке XML");
  }
}

export async function processXmlData(files) {
  const dataMapc = {};

  try {
    files.forEach((xmlString) => {
      xml2js.parseString(xmlString, (err, result) => {
        if (err) {
          console.error(`Ошибка при обработке XML: ${err}`);
          return;
        }
        if (!result.Файл["$"].ИдФайл.includes("UV")) {
          return;
        }
        const document = result.Файл.Документ[0];
        const dateParts = document["$"].ДатаДок.split(".");
        const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        const documentDate = new Date(isoDate);
        console.log(document);
        const taxInfos = document.УвИсчСумНалог;

        const inn = document.СвНП[0].НПЮЛ[0]["$"].ИННЮЛ;

        taxInfos.forEach((taxInfo) => {
          if (
            taxInfo["$"].КБК !== "18210102010011000110" &&
            taxInfo["$"].КБК !== "18210102010013000110" &&
            taxInfo["$"].КБК !== "18210102080011000110"
            // taxInfo["$"].КБК !== "18210102010013000110"
          ) {
            return;
          }

          const key = `${taxInfo["$"].КППДекл}_${taxInfo["$"].ОКТМО}_${taxInfo["$"].Период}_${taxInfo["$"].НомерМесКварт}_${inn}`;
          const existingData = dataMap[key];
          if (!existingData || documentDate === existingData.date) {
            dataMap[key] = {
              inn: inn,
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
              inn: inn,
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
      INN: item.inn,
      KPP: item.kpp,
      OKTMO: item.oktmo,
      CYMMA: item.sum,
      "KOD PERIODA": item.period,
    }));

    sortedData.sort((a, b) => {
      const order = [
        "21 01",
        "21 11",
        "21 02",
        "21 12",
        "21 03",
        "21 13",
        "31 01",
        "31 11",
        "31 02",
        "31 12",
        "31 03",
        "31 13",
      ];
      return order.indexOf(a["KOD PERIODA"]) - order.indexOf(b["KOD PERIODA"]);
    });

    return sortedData;
  } catch (error) {
    throw new Error("Ошибка при обработке XML");
  }
}

export async function parseXml(xml) {
  try {
    const obj = await parser.parseStringPromise(xml);
    if (obj.Файл["$"].ИдФайл.includes("UT")) {
      return;
    }
    return obj;
  } catch (error) {
    throw new Error("Ошибка при обработке XML");
  }
}

export async function compareXmls(xml1, xml2) {
  const spravDohs1 = xml1?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];
  const spravDohs2 = xml2?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];

  // Функция сравнения для проверки идентичности двух справок
  const areEqual = (sprav1, sprav2) => {
    return JSON.stringify(sprav1) === JSON.stringify(sprav2);
  };

  // Удаление из spravDohs1 справок, которые также присутствуют в spravDohs2
  const uniqueSpravDohs1 = spravDohs1.filter((sprav1) => {
    const hasMatch = spravDohs2.some((sprav2) => {
      const equal = areEqual(sprav1, sprav2);
      return equal;
    });
    return !hasMatch;
  });

  uniqueSpravDohs1.forEach((sprav, index) => {
    sprav["$"]["НомСпр"] = index + 1;
  });

  // Замена spravDohs1 на uniqueSpravDohs1 в obj1
  xml1["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"] = uniqueSpravDohs1;

  const newXml = builder.buildObject(xml1);

  // Возвращение обновленного obj1
  return newXml;
}

export async function downloadFile(obj) {
  try {
    const xml = builder.buildObject(obj);
    const name = `${obj.Файл["$"].ИдФайл}.xml`;

    const content = iconv.encode(xml, "win1251");

    const blob = new Blob([content.buffer], {
      type: "application/octet-stream",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = name;

    // Начало скачивания файла
    link.click();

    // Освобождение URL после скачивания файла
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Ошибка при обработке XML", error);
  }
}

export async function check(obj) {
  const errors = [];

  const sumDoh =
    obj.Файл.Документ[0]["НДФЛ6.2"][0].РасчСумНал[0].$.СумНачислНач; //???????
  const sumVich = obj.Файл.Документ[0]["НДФЛ6.2"][0].РасчСумНал[0].$.СумВыч;
  const kolFZ = obj.Файл.Документ[0]["НДФЛ6.2"][0].РасчСумНал[0].$.КолФЛ;
  const sumNalIsch =
    obj.Файл.Документ[0]["НДФЛ6.2"][0].РасчСумНал[0].$.СумНалИсч;
  const allowedRound = kolFZ * 0.5;
  const sumNalUder =
    obj.Файл.Документ[0]["НДФЛ6.2"][0].РасчСумНал[0].$.СумНалУдерж;
  const sumNalVozv =
    obj.Файл.Документ[0]["НДФЛ6.2"][0].РасчСумНал[0].$.СумНалВозвр;
  const sumNalIzlUder =
    obj.Файл.Документ[0]["НДФЛ6.2"][0].РасчСумНал[0].$.СумНалИзлУдерж;

  if (Math.abs((sumDoh - sumVich) * 0.13 - sumNalIsch) > allowedRound) {
    errors.push({
      message: `Сумма налога исчисленного не равна 13% от разницы между суммой дохода и вычетом.`,
      additionalInfo:
        `
      Налоговая база: ${sumDoh - sumVich} * Ставка: 0.13 = ${Math.round(
          (sumDoh - sumVich) * 0.13
        )} ± погрешность: ${allowedRound} ≠ 140 строка: ${sumNalIsch} ` +
        ` Разница: ${Math.floor((sumDoh - sumVich) * 0.13 - sumNalIsch)}`,
      location: `obj.Файл.Документ[0]["НДФЛ6.2"][0].РасчСумНал[0].$.СумНалИсч`,
      function: kvartal,
    });
  }

  if (sumNalIsch !== sumNalUder - sumNalVozv - sumNalIzlUder) {
    errors.push({
      message: `Сумма налога удержанного не равна сумме налога исчисленного.`,
      additionalInfo: `Сумма налога исчисленного: ${sumNalIsch} ≠ Сумма налога удержанного: ${sumNalUder} - Сумма налога возвращенного: ${sumNalVozv} - Сумма налога излишне удержанного: ${sumNalIzlUder}`,
      location: `obj.Файл.Документ[0]["НДФЛ6.2"][0].РасчСумНал[0].$.СумНалИсч`,
      function: kvartal,
    });
  }
  /////////////////////////////////////////

  return errors;
}

// export {
//   parseXml,
//   mergeXmlFiles,
//   updateXml,
//   correctNegativeIncome,
//   correctUderzhTax,
//   setNumCorr,
//   nullCorr,
//   kvartal,
//   processXmlData,
//   downloadFile,
//   compareXmls,
//   check,
// };
