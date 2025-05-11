import { SparklesCore } from "@/components/uiV2/sparkles";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/uiV2/lamp";
import { Switch } from "@/components/ui/switch";
import { Label } from "./components/ui/label";
import { toast } from "sonner";
import React from "react";
import { processXmlData, downloadFile, parseXml } from "@/utils/functions";
import DataTableDemo from "@/components/ui/tenStackTable";
import { BackgroundBeams } from "@/components/uiV2/bgBeams";
import { Tabs } from "@/components/uiV2/tabs";

type HomeProps = {
  changeVersion: () => void;
};

const SecondVersion: React.FC<HomeProps> = ({ changeVersion }) => {
  const [file, setFile] = React.useState<any>(null);
  const [tableData, setTableData] = React.useState<any[]>([]);
  const [firstObj, setFirstObj] = React.useState<any>(null);
  const [secondObj, setSecondObj] = React.useState<any>(null);
  const [numCorrerction, setNumCorrection] = React.useState<string>("null");
  const [uvedCSV, setUvedCSV] = React.useState<any>(null);
  const [filterOptions, setFilterOptions] = React.useState<any>(null);
  const [obj, setObj] = React.useState<any>(null);

  const tabs = [
    {
      title: "Налог",
      value: "tax",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900 flex justify-between flex-col">
          <p className=" pb-4">Работа с налогом</p>
          <p className=" font-light text-lg">
            В этой вкладке вы можете обработать налог в справках 2-НДФЛ внутри
            отчета. <br /> Краткое описание функций:
            <br />
            1. Выровнять налог - ставит налог 13% от налоговой базы в справках
            2-НДФЛ внутри отчета. <br />
            2. Выровнять удержанный - приравнивает удержанный к исчисленному в
            каждой справке. <br />
          </p>
          <div>
            <button
              className="px-6 py-3 rounded-md border border-black bg-white text-neutral-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 mr-4"
              onClick={() => {
                fetch("/api/correct-isch", {
                  method: "POST",
                  body: JSON.stringify({
                    xml: obj,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                  .then((res) => {
                    // Проверяем статус ответа
                    if (!res.ok) {
                      // Если статус не 2xx, выбрасываем ошибку
                      return res.text().then((errorMessage) => {
                        throw new Error(
                          `Ошибка ${res.status}: ${errorMessage}`
                        );
                      });
                    }
                    // Если статус успешный, парсим данные
                    return res.json();
                  })
                  .then((data) => {
                    // Обновляем состояние и показываем уведомление
                    setObj(data);
                    toast.success("Файл успешно обработан");
                  })
                  .catch((error) => {
                    // Обработка всех ошибок (сетевых или от сервера)
                    console.error("Ошибка при обработке файла:", error);
                    toast.error("Произошла ошибка при обработке файла");
                  });
              }}
            >
              Выровнять налог
            </button>
            <button
              className="px-6 py-3 rounded-md border border-black bg-white text-neutral-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              onClick={() => {
                fetch("/api/correct-uderzh", {
                  method: "POST",
                  body: JSON.stringify({
                    xml: obj,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                  .then((res) => {
                    // Проверяем статус ответа
                    if (!res.ok) {
                      // Если статус не 2xx, выбрасываем ошибку
                      return res.text().then((errorMessage) => {
                        throw new Error(
                          `Ошибка ${res.status}: ${errorMessage}`
                        );
                      });
                    }
                    // Если статус успешный, парсим данные
                    return res.json();
                  })
                  .then((data) => {
                    // Обновляем состояние и показываем уведомление
                    setObj(data);
                    toast.success("Файл успешно обработан");
                  })
                  .catch((error) => {
                    // Обработка всех ошибок (сетевых или от сервера)
                    console.error("Ошибка при обработке файла:", error);
                    toast.error("Произошла ошибка при обработке файла");
                  });
              }}
            >
              Выровнять удержанный
            </button>
          </div>
        </div>
      ),
    },
    {
      title: "Доход",
      value: "income",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900 flex justify-between flex-col">
          <p className=" pb-4">Работа с доходом</p>
          <p className=" font-light text-lg">
            В этой вкладке вы можете обработать доход в справках 2-НДФЛ внутри
            отчета. <br /> Краткое описание функций:
            <br />
            1. Выровнять доход - удаляет отрицательные и нулевые значения
            дохода, если отсутсвует доход в январе, то 30% от дохода от февраля
            ставится на январь. <br />
          </p>
          <div>
            <button
              className="px-6 py-3 rounded-md border border-black bg-white text-neutral-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 mr-4"
              onClick={() => {
                fetch("/api/correct-income", {
                  method: "POST",
                  body: JSON.stringify({
                    xml: obj,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                  .then((res) => {
                    // Проверяем статус ответа
                    if (!res.ok) {
                      // Если статус не 2xx, выбрасываем ошибку
                      return res.text().then((errorMessage) => {
                        throw new Error(
                          `Ошибка ${res.status}: ${errorMessage}`
                        );
                      });
                    }
                    // Если статус успешный, парсим данные
                    return res.json();
                  })
                  .then((data) => {
                    // Обновляем состояние и показываем уведомление
                    setObj(data);
                    toast.success("Файл успешно обработан");
                  })
                  .catch((error) => {
                    // Обработка всех ошибок (сетевых или от сервера)
                    console.error("Ошибка при обработке файла:", error);
                    toast.error("Произошла ошибка при обработке файла");
                  });
              }}
            >
              Выровнять доход
            </button>
          </div>
        </div>
      ),
    },
    {
      title: "Корректировка",
      value: "correction",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900 flex justify-between flex-col">
          <p className=" pb-4">Корректировка</p>
          <p className=" font-light text-lg">
            В этой вкладке вы можете обработать корректировку в справках 2-НДФЛ
            внутри отчета. <br /> Краткое описание функций:
            <br />
            1. Установить корректировку - устанавливает корректировку в
            справках. <br />
            2. Аннулирующий - зануляет все доходы в справках. <br />
          </p>
          <div className="flex-row flex">
            <input
              type="number"
              className="px-6 py-3 rounded-md border border-black bg-white text-neutral-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 mr-4"
              placeholder="Введите номер корр"
              onChange={(e) => {
                const value = e.target.value;
                if (
                  value === "" ||
                  (Number(value) >= 0 && Number(value) <= 99)
                ) {
                  setNumCorrection(value);
                } else {
                  toast.error("Введите корректировку от 0 до 99");
                }
              }}
            />
            <button
              className="px-6 py-3 rounded-md border border-black bg-white text-neutral-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 mr-4"
              onClick={() => {
                fetch("/api/corr", {
                  method: "POST",
                  body: JSON.stringify({
                    xml: obj,
                    num: numCorrerction,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                  .then((res) => {
                    // Проверяем статус ответа
                    if (!res.ok) {
                      // Если статус не 2xx, выбрасываем ошибку
                      return res.text().then((errorMessage) => {
                        throw new Error(
                          `Ошибка ${res.status}: ${errorMessage}`
                        );
                      });
                    }
                    // Если статус успешный, парсим данные
                    return res.json();
                  })
                  .then((data) => {
                    // Обновляем состояние и показываем уведомление
                    setObj(data);
                    toast.success("Файл успешно обработан");
                  })
                  .catch((error) => {
                    // Обработка всех ошибок (сетевых или от сервера)
                    console.error("Ошибка при обработке файла:", error);
                    toast.error("Произошла ошибка при обработке файла");
                  });
              }}
              disabled={numCorrerction === "null"}
            >
              Корректировка
            </button>
            <button
              className="px-6 py-3 rounded-md border border-black bg-white text-neutral-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 mr-4"
              onClick={() => {
                fetch("/api/null-corr", {
                  method: "POST",
                  body: JSON.stringify({
                    xml: obj,
                    num: numCorrerction,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                  .then((res) => {
                    // Проверяем статус ответа
                    if (!res.ok) {
                      // Если статус не 2xx, выбрасываем ошибку
                      return res.text().then((errorMessage) => {
                        throw new Error(
                          `Ошибка ${res.status}: ${errorMessage}`
                        );
                      });
                    }
                    // Если статус успешный, парсим данные
                    return res.json();
                  })
                  .then((data) => {
                    // Обновляем состояние и показываем уведомление
                    setObj(data);
                    toast.success("Файл успешно обработан");
                  })
                  .catch((error) => {
                    // Обработка всех ошибок (сетевых или от сервера)
                    console.error("Ошибка при обработке файла:", error);
                    toast.error("Произошла ошибка при обработке файла");
                  });
              }}
            >
              Аннулирующий
            </button>
          </div>
        </div>
      ),
    },
    {
      title: "Объединение",
      value: "merge",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900 flex justify-between flex-col">
          <p className=" pb-4">Объеденение</p>
          <p className=" font-light text-lg">
            В этой вкладке вы можете объединить два отчета в один. <br />{" "}
            Краткое описание функций:
            <br />
            1. Объединить - объединяет два отчета в один.
            <br />
            Вам необходимо загрузить{" "}
            <label className="cursor-pointer font-bold" htmlFor="second">
              вторичный{" "}
            </label>{" "}
            и{" "}
            <label className="cursor-pointer font-bold" htmlFor="first">
              первичный
            </label>{" "}
            отчеты , из первичного отчета берется шапка, объединение справок
            происходит, если ИНН, ФИО совпадают. Если одинаковых карточек нет,
            то они добавляются сохраняя нумерацию справок. <br />
          </p>
          <div className="flex-row flex">
            <input
              id="first"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.item(0);
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const xml = event.target?.result as string;
                    setFile(xml);
                    toast.success("Файл загружен");
                    parseXml(xml).then((data) => {
                      setFirstObj(data);
                    });
                  };
                  reader.readAsText(file, "windows-1251");
                }
              }}
              style={{ display: "none" }}
            />
            <input
              id="second"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.item(0);
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const xml = event.target?.result as string;
                    setFile(xml);
                    toast.success("Файл загружен");
                    parseXml(xml).then((data) => {
                      setSecondObj(data);
                    });
                  };
                  reader.readAsText(file, "windows-1251");
                }
              }}
              style={{ display: "none" }}
            />
            <button
              className="px-6 py-3 rounded-md border border-black bg-white text-neutral-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 mr-4"
              onClick={() => {
                if (!firstObj || !secondObj) {
                  toast.error("Загрузите оба файла");
                  return;
                }
                // mergeXmlFiles(firstObj, secondObj)
                //   .then((newXml) => {
                //     console.log(newXml);
                //     setFile(newXml);
                //     toast.success("Файл успешно обработан");
                //   })
                //   .catch((e) => {
                //     toast.error("Ошибка при обработке файла");
                //     console.log(e);
                //   });
                fetch("/api/merge-xml", {
                  method: "POST",
                  body: JSON.stringify({
                    xml1: firstObj,
                    xml2: secondObj,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                  .then((res) => {
                    // Проверяем статус ответа
                    if (!res.ok) {
                      // Если статус не 2xx, выбрасываем ошибку
                      return res.text().then((errorMessage) => {
                        throw new Error(
                          `Ошибка ${res.status}: ${errorMessage}`
                        );
                      });
                    }
                    // Если статус успешный, парсим данные
                    return res.json();
                  })
                  .then((data) => {
                    // Обновляем состояние и показываем уведомление
                    setObj(data);
                    toast.success("Файл успешно обработан");
                  })
                  .catch((error) => {
                    // Обработка всех ошибок (сетевых или от сервера)
                    console.error("Ошибка при обработке файла:", error);
                    toast.error("Произошла ошибка при обработке файла");
                  });
              }}
              disabled={!firstObj || !secondObj}
            >
              Объединить
            </button>
            <button
              className="px-6 py-3 rounded-md border border-black bg-white text-neutral-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              onClick={() => {
                setFirstObj(null);
                setSecondObj(null);
              }}
            >
              Очистить
            </button>
          </div>
        </div>
      ),
    },
    {
      title: "Загрузка",
      value: "load",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900 flex flex-col justify-between">
          <p>Загрузка отчетов</p>
          <p className=" font-light text-lg">
            В этой вкладке вы можете скачать отчеты для загрузки в 1с.
            <br /> Краткое описание функций:
            <br />
            1. Загрузить файл - загружает файл для обработки. (не работает
            загрузка в 1с из-за непонятной кодировки файла) <br />
            2. Скопировать файл - сохраняет файл отчета в буфер обмена. <br />
            После копирования файла, необходимо открыть исходный файл отчета в
            формате .xml и вставить содержимое буфера обмена в него. После этого
            файл отчета можно загружать в 1с. <br />
          </p>
          <div className="flex-row flex">
            <button
              className="px-6 py-3 rounded-md border border-black bg-white text-neutral-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 mr-4"
              onClick={() => {
                setFile(null);
                setObj(null);
              }}
            >
              Очистить отчет
            </button>
            <button
              className="px-6 py-3 rounded-md border border-black bg-white text-neutral-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 mr-4"
              onClick={() => {
                navigator.clipboard
                  .writeText(file)
                  .then(() => {
                    toast.success("Текст отчета скопирован в буфер обмена");
                  })
                  .catch((err) => {
                    toast.error("Ошибка при копировании текста отчета");
                    console.error("Failed to copy text: ", err);
                  });
              }}
            >
              Скопировать отчет
            </button>
            <button
              className="px-6 py-3 rounded-md border border-black bg-white text-neutral-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 mr-4"
              onClick={() => {
                downloadFile(obj);
              }}
            >
              Скачать отчет
            </button>
          </div>
        </div>
      ),
    },
    {
      title: "Прочее",
      value: "Other",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900 flex flex-col justify-between">
          <p>Прочее</p>
          <p className=" font-light text-lg">
            В этой вкладке вы можете использовать другие функции.
            <br /> <br /> Краткое описание функций:
            <br /> 1. Исправить нумерацию справок - нумерация справок по
            возрастанию. <br />
            2. Исправить порядок справок - порядок справок по алфавиту. <br />
            <br />
            <br />
          </p>
          <div className="flex-row flex">
            <button
              className="px-6 py-3 rounded-md border border-black bg-white text-neutral-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 mr-4"
              onClick={() => {
                fetch("/api/correct-numorder", {
                  method: "POST",
                  body: JSON.stringify({
                    xml: obj,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                  .then((res) => {
                    // Проверяем статус ответа
                    if (!res.ok) {
                      // Если статус не 2xx, выбрасываем ошибку
                      return res.text().then((errorMessage) => {
                        throw new Error(
                          `Ошибка ${res.status}: ${errorMessage}`
                        );
                      });
                    }
                    // Если статус успешный, парсим данные
                    return res.json();
                  })
                  .then((data) => {
                    // Обновляем состояние и показываем уведомление
                    setObj(data);
                    toast.success("Файл успешно обработан");
                  })
                  .catch((error) => {
                    // Обработка всех ошибок (сетевых или от сервера)
                    console.error("Ошибка при обработке файла:", error);
                    toast.error("Произошла ошибка при обработке файла");
                  });
              }}
            >
              Исправить нумерацию справок
            </button>
            <button
              className="px-6 py-3 rounded-md border border-black bg-white text-neutral-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 mr-4"
              onClick={() => {
                fetch("/api/correct-abcorder", {
                  method: "POST",
                  body: JSON.stringify({
                    xml: obj,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                  .then((res) => {
                    // Проверяем статус ответа
                    if (!res.ok) {
                      // Если статус не 2xx, выбрасываем ошибку
                      return res.text().then((errorMessage) => {
                        throw new Error(
                          `Ошибка ${res.status}: ${errorMessage}`
                        );
                      });
                    }
                    // Если статус успешный, парсим данные
                    return res.json();
                  })
                  .then((data) => {
                    // Обновляем состояние и показываем уведомление
                    setObj(data);
                    toast.success("Файл успешно обработан");
                  })
                  .catch((error) => {
                    // Обработка всех ошибок (сетевых или от сервера)
                    console.error("Ошибка при обработке файла:", error);
                    toast.error("Произошла ошибка при обработке файла");
                  });
              }}
            >
              Исправить порядок справок
            </button>
          </div>
        </div>
      ),
    },
  ];

  React.useMemo(() => {
    const kppSet = new Set(tableData.map((item) => item.KPP));
    const oktmoSet = new Set(tableData.map((item) => item.OKTMO));
    const periodSet = new Set(tableData.map((item) => item["KOD PERIODA"]));
    const innSet = new Set(tableData.map((item) => item.INN));
    const kbkSet = new Set(
      tableData.map((item) => item.KBK).filter((item) => item !== undefined)
    );

    // Преобразование Set обратно в массив и сортировка
    const kppOptions = Array.from(kppSet).sort((a, b) => a - b);
    const oktmoOptions = Array.from(oktmoSet).sort((a, b) => a - b);
    const innOptions = Array.from(innSet).sort((a, b) => a - b);
    const periodOptions = Array.from(periodSet);
    const kbkOptions = Array.from(kbkSet).sort((a, b) => a - b);

    setFilterOptions({
      INN: innOptions,
      KPP: kppOptions,
      OKTMO: oktmoOptions,
      "KOD PERIODA": periodOptions,
      KBK: kbkOptions,
    });
  }, [tableData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const xml = event.target?.result as string;
        setFile(xml);
        toast.success("Файл загружен");
        parseXml(xml).then((data) => {
          setObj(data);
        });
      };
      reader.readAsText(file, "windows-1251");
    }
  };

  return (
    <div
      style={{
        scrollSnapType: "y mandatory",
      }}
    >
      <div
        style={{
          scrollSnapAlign: "center",
        }}
        className=" h-screen w-full bg-black flex flex-col items-center justify-center relative"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 2,
          }}
          className="absolute top-8 right-10 z-20 flex items-center justify-center"
        >
          <Label htmlFor="version" className="mr-2 text-red-600 font-bold">
            V1
          </Label>
          <Switch
            id="version"
            onCheckedChange={() => {
              setTimeout(() => {
                changeVersion();
              }, 500);
            }}
            defaultChecked={true}
          />
        </motion.div>

        <h1 className="md:text-5xl text-xl lg:text-7xl font-bold text-center text-white relative z-20 align-text-bottom">
          6-ndfl
        </h1>
        <div className="w-[40rem] h-40 relative">
          {/* Gradients */}
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

          {/* Core component */}
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />

          {/* Radial Gradient to prevent sharp edges */}
          <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{
          duration: 1,
        }}
        style={{
          scrollSnapAlign: "center",
        }}
        className="w-full h-screen relative"
      >
        <LampContainer>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              delay: 2,
              duration: 2,
              ease: "easeInOut",
            }}
            style={{
              y: -200,
            }}
          >
            <input
              id="file"
              accept=".xml"
              style={{
                display: "none",
              }}
              type="file"
              onChange={handleFileChange}
            />
            <input
              id="files"
              style={{
                display: "none",
              }}
              type="file"
              multiple
              accept=".xml"
              onChange={(e) => {
                if (e.target.files) {
                  const files = Array.from(e.target.files);
                  Promise.all(
                    files.map((file) => {
                      return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const xml = event.target?.result as string;
                          resolve(xml);
                        };
                        reader.onerror = reject;
                        reader.readAsText(file, "windows-1251"); // указываем кодировку "windows-1251"
                      });
                    })
                  )
                    .then((xmls: any[]) => {
                      processXmlData(xmls).then((tableData) => {
                        setTableData(tableData);
                        console.log(tableData);
                        const csvData = [
                          "INN;KPP;OKTMO;CYMMA;KOD PERIODA;KBK",
                          ...Object.values(tableData).map(
                            (item) =>
                              `${item.INN};${item.KPP};${item.OKTMO};${item.CYMMA};${item["KOD PERIODA"]};${item.KBK}`
                          ),
                        ].join("\n");
                        setUvedCSV(csvData);
                      });
                    })
                    .catch(() => toast.error("Ошибка при чтении файлов"))
                    .finally(() => {
                      toast.success("Файлы загружены");
                    });
                }
              }}
            />
          </motion.div>
          <motion.label
            htmlFor="file"
            initial={{ opacity: 0.5, y: "10vh" }}
            whileInView={{ opacity: 1, y: "-15vh" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className=" mt-48 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl cursor-pointer"
          >
            Загрузите файл
          </motion.label>
          <motion.label
            htmlFor="files"
            initial={{ opacity: 0, y: "0vh" }}
            whileInView={{ opacity: 1, y: "-14vh" }}
            transition={{
              delay: 1.1,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className=" bg-gradient-to-br from-slate-100 to-slate-100 bg-clip-text text-center text-slate-400 text-2xl font-light tracking-tight text-transparen cursor-pointer"
          >
            или уведомления
          </motion.label>
        </LampContainer>
        {file && (
          <motion.div
            className="absolute bottom-0 right-2/4 flex justify-center items-center flex-col"
            animate={{ bottom: ["5px", "20px", "5px"] }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              loop: Infinity,
              repeatDelay: 1,
              repeat: Infinity,
            }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{
                duration: 1,
              }}
              className="text-white text-center z-50"
            >
              Вниз
            </motion.p>
            <svg
              opacity={0.3}
              fill="#ffffff"
              height="50px"
              width="50px"
              version="1.1"
              viewBox="0 0 330 330"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393    c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393    s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z" />
            </svg>
          </motion.div>
        )}
      </motion.div>

      {(obj || file) && (
        <motion.div
          style={{
            scrollSnapAlign: "center",
          }}
          className="w-full h-screen dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center"
        >
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start">
            <Tabs tabs={tabs} />
          </div>
          {tableData.length > 0 && (
            <motion.div
              className="absolute bottom-0 flex justify-center items-center flex-col"
              animate={{ bottom: ["5px", "20px", "5px"] }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                times: [0, 0.5, 1],
                loop: Infinity,
                repeatDelay: 1,
                repeat: Infinity,
              }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{
                  duration: 1,
                }}
                className="text-slate-900 text-center z-50"
              >
                Уведомления
              </motion.p>
              <svg
                opacity={0.3}
                fill="#000000"
                height="50px"
                width="50px"
                version="1.1"
                viewBox="0 0 330 330"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393    c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393    s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z" />
              </svg>
            </motion.div>
          )}
          {/* <motion.div
            initial={{ opacity: 1 }}
            whileInView={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900"
            transition={{
              duration: 3,
            }}
          ></motion.div> */}
        </motion.div>
      )}
      {tableData.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
          }}
          style={{
            scrollSnapAlign: "center",
          }}
          className="w-full h-screen flex justify-center items-center bg-neutral-950 relative"
        >
          <div className="z-10 bg-neutral-100 w-3/4 p-4 rounded-xl">
            <DataTableDemo data={tableData} options={filterOptions} />
            <button
              onClick={() => {
                const blob = new Blob([uvedCSV], {
                  type: "text/csv",
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "uved.csv";
                a.click();
                window.URL.revokeObjectURL(url);
              }}
              className="px-6 py-3 rounded-md border border-black bg-white text-neutral-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
            >
              Скачать CSV
            </button>
          </div>
          <BackgroundBeams />
        </motion.div>
      )}
    </div>
  );
};

export default SecondVersion;
