"use client";
import React from "react";
import Blobs from "@/app/components/circle";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/components/ui/drawer";
import { Label } from "./components/ui/label";
import { motion, MotionProps } from "framer-motion";
import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  mergeXmlFiles,
  updateXml,
  correctNegativeIncome,
  correctTax,
  setNumCorr,
  nullCorr,
  kvartal,
  processXmlData,
  downloadFile,
} from "@/utils/functions";
import { ColumnDef } from "@tanstack/react-table";
import DataTableDemo from "@/components/ui/tenStackTable";

type HomeProps = {
  changeVersion: () => void;
};

const Home: React.FC<HomeProps> = ({ changeVersion }) => {
  const [file, setFile] = React.useState<any>(null);
  const [files, setFiles] = React.useState<any>([null]);
  const [obj, setObj] = React.useState<any>(null);
  const [tableData, setTableData] = React.useState<any[]>([]);
  const [firstObj, setFirstObj] = React.useState<any>(null);
  const [secondObj, setSecondObj] = React.useState<any>(null);
  const [numCorrerction, setNumCorrection] = React.useState<string>("0");
  const constRef = React.useRef(null);
  const [uvedCSV, setUvedCSV] = React.useState<any>(null);
  const [filterOptions, setFilterOptions] = React.useState<any>(null);

  React.useMemo(() => {
    const kppSet = new Set(tableData.map((item) => item.KPP));
    const oktmoSet = new Set(tableData.map((item) => item.OKTMO));
    const periodSet = new Set(tableData.map((item) => item["KOD PERIODA"]));

    // Преобразование Set обратно в массив
    const kppOptions = Array.from(kppSet);
    const oktmoOptions = Array.from(oktmoSet);
    const periodOptions = Array.from(periodSet);

    setFilterOptions({
      KPP: kppOptions,
      OKTMO: oktmoOptions,
      "KOD PERIODA": periodOptions,
    });
  }, [tableData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const xml = event.target?.result as string;
        setFile(xml);
        console.log(xml);
        toast.success("Файл загружен");
      };
      reader.readAsText(file, "windows-1251"); // указываем кодировку "windows-1251"
    }
  };

  const colors2 = [
    "#000000",
    "#ff0000",
    "#800000",
    "#ff0000",
    "#800000",
    "#000000",
    "#ff0000",
  ];

  const colors3 = ["#000000", "#800000", "#ff0000", "#800000", "#000000"];

  const colors4 = [
    "#800000",
    "#ff0000",
    "#800000",
    "#000000",
    "#ff0000",
    "#800000",
    "#ff0000",
    "#000000",
    "#800000",
  ];

  const colors5 = [
    "#ff0000",
    "#800000",
    "#000000",
    "#ff0000",
    "#800000",
    "#ff0000",
    "#000000",
    "#ff0000",
  ];

  const colors6 = [
    "#ff0000",
    "#000000",
    "#800000",
    "#000000",
    "#ff0000",
    "#800000",
    "#ff0000",
  ];

  const colorPatterns = [colors2, colors3, colors4, colors5, colors6];
  const text = "ЗАГРУЗИТЕФАЙЛ";
  return (
    <>
      <div
        style={{
          visibility: "hidden",
          position: "absolute",
          left: "-100%",
        }}
      >
        <svg>
          <filter id="glass">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01"
              numOctaves="1"
              result="warp"
            />
            <feDisplacementMap
              id="displacement"
              xChannelSelector="R"
              yChannelSelector="G"
              scale="50"
              in="SourceGraphic"
              in2="warp"
            />
            <feGaussianBlur stdDeviation="1" />
          </filter>
        </svg>
      </div>
      <motion.div
        ref={constRef}
        className="flex justify-center items-center h-screen overflow-hidden w-screen glass-effect flex-col"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Blobs key={i} />
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 2,
          }}
          className={
            "absolute top-8 right-10 z-20 flex items-center justify-center" as string
          }
        >
          <Switch
            id="version"
            onCheckedChange={() => {
              setTimeout(() => {
                changeVersion();
              }, 500);
            }}
          />
          <Label htmlFor="version" className="ml-2 text-white">
            V2
          </Label>
        </motion.div>
        {/* <h1 className="">6-НДФЛ</h1> */}
        {file ? (
          <div className="grid grid-cols-3 ">
            <motion.div
              drag
              dragConstraints={constRef}
              className=" justify-center flex"
            >
              <Button
                className="z-10 m-4"
                disabled={!file}
                onClick={() => {
                  try {
                    updateXml(file).then((newXml) => {
                      console.log(newXml);
                      setFile(newXml);
                    });
                  } catch (e) {
                    toast.error("Ошибка при обработке файла");
                    console.log(e);
                  } finally {
                    toast.success("Файл обработан");
                  }
                }}
              >
                <span className="text-white">Выровнять удержанный</span>
              </Button>
            </motion.div>
            <motion.div
              drag
              dragConstraints={constRef}
              className=" justify-center flex"
            >
              <Button
                className="z-10 m-4"
                disabled={!file}
                onClick={() => {
                  try {
                    correctNegativeIncome(file).then((newXml) => {
                      console.log(newXml);
                      setFile(newXml);
                    });
                  } catch (e) {
                    toast.error("Ошибка при обработке файла");
                    console.log(e);
                  } finally {
                    toast.success("Файл обработан");
                  }
                }}
              >
                <span className="text-white">Выровнять доходы</span>
              </Button>
            </motion.div>
            <motion.div
              drag
              dragConstraints={constRef}
              className=" justify-center flex"
            >
              <Button
                className="z-10 m-4"
                disabled={!file}
                onClick={() => {
                  try {
                    correctTax(file).then((newXml) => {
                      console.log(newXml);
                      setFile(newXml);
                    });
                  } catch (e) {
                    toast.error("Ошибка при обработке файла");
                    console.log(e);
                  } finally {
                    toast.success("Файл обработан");
                  }
                }}
              >
                <span className="text-white">Выровнять налог</span>
              </Button>
            </motion.div>
            <motion.div
              drag
              dragConstraints={constRef}
              className=" justify-center flex"
            >
              <Button
                className="z-10 m-4"
                onClick={() => {
                  downloadFile(file);
                  // const blob = new Blob([file], { type: "text/plain" });
                  // const link = document.createElement("a");
                  // link.href = window.URL.createObjectURL(blob);
                  // link.download = file.
                  // link.click();
                }}
              >
                <span className="text-white">Скачать</span>
              </Button>
            </motion.div>
            <motion.div
              drag
              dragConstraints={constRef}
              className=" justify-center flex"
            >
              <Button
                className="z-10 m-4"
                disabled={!file}
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
                <span className="text-white">Скопировать отчет</span>
              </Button>
            </motion.div>
            <motion.div
              drag
              dragConstraints={constRef}
              className=" justify-center flex"
            >
              <Button
                className="z-10 m-4"
                onClick={() => {
                  setFile(null);
                }}
              >
                <span className="text-white">Очистить</span>
              </Button>
            </motion.div>
            <motion.div
              drag
              dragConstraints={constRef}
              className=" justify-center flex"
            >
              <Button
                className="z-10 m-4"
                onClick={() => {
                  nullCorr(file).then((newXml) => {
                    console.log(newXml);
                    setFile(newXml);
                  });
                }}
              >
                Аннулирующий
              </Button>
            </motion.div>
            <Drawer>
              <DrawerTrigger>
                <motion.div
                  drag
                  dragConstraints={constRef}
                  className=" justify-center flex"
                >
                  <Button className="z-10 m-4" asChild>
                    <span className="text-white">Проставить корректировку</span>
                  </Button>
                </motion.div>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerClose>
                  <span className="text-white">Закрыть</span>
                </DrawerClose>
                <DrawerHeader>
                  <DrawerTitle>Корректировка</DrawerTitle>
                  <DrawerDescription>
                    В данном разделе вы можете проставить корректировку
                  </DrawerDescription>
                </DrawerHeader>
                <Input
                  placeholder="Введите номер корректировки"
                  className="w-1/2"
                  onChange={(e) => {
                    setNumCorrection(e.target.value);
                  }}
                  type="text"
                />
                <Button
                  className="z-10 m-4"
                  disabled={!file}
                  onClick={() => {
                    try {
                      setNumCorr(file, numCorrerction).then((newXml) => {
                        console.log(newXml);
                        setFile(newXml);
                      });
                    } catch (e) {
                      toast.error("Ошибка при обработке файла");
                      console.log(e);
                    } finally {
                      toast.success("Файл обработан");
                    }
                  }}
                >
                  <span className="text-white">Проставить</span>
                </Button>
              </DrawerContent>
            </Drawer>
            <motion.div drag dragConstraints={constRef}>
              <Button
                className="z-10 m-4"
                onClick={() => {
                  try {
                    kvartal(file).then((newXml) => {
                      console.log(newXml);
                      setFile(newXml);
                    });
                  } catch (e) {
                    toast.error("Ошибка при обработке файла");
                    console.log(e);
                  } finally {
                    toast.success("Файл обработан");
                  }
                }}
              >
                <span className="text-white">Квартальный</span>
              </Button>
            </motion.div>
          </div>
        ) : (
          <div className="flex justify-center items-top absolute top-40">
            {[...text].map((char, i) => (
              <motion.h1
                style={{
                  fontFamily: "Comic Sans MS",
                }}
                className=" text-9xl font-extrabold "
                key={i}
                animate={{
                  color: colorPatterns[i % colorPatterns.length],
                }}
                drag
                dragConstraints={constRef}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                {char}
              </motion.h1>
            ))}
          </div>
        )}
        <Drawer>
          <DrawerTrigger>
            <motion.div drag dragConstraints={constRef}>
              <Button className="z-10 m-4" asChild>
                <span className="text-white">Объединить отчеты</span>
              </Button>
            </motion.div>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerClose>
              <span className="text-white">Закрыть</span>
            </DrawerClose>
            <DrawerHeader>
              <DrawerTitle>Объеденение</DrawerTitle>
              <DrawerDescription>
                В данном разделе вы можете объединить два 6-ндфл в один файл
                файл
              </DrawerDescription>
              <Label htmlFor="file">Главный</Label>
              <Input
                placeholder="Загрузите главный отчет"
                className="w-1/2"
                onChange={(e) => {
                  const file = e.target.files?.item(0);
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const xml = event.target?.result as string;
                      setFirstObj(xml);
                      console.log(xml);
                      toast.success("Файл загружен");
                    };
                    reader.readAsText(file, "windows-1251"); // указываем кодировку "windows-1251"
                  }
                }}
                type="file"
              />
              <Label htmlFor="file">Вторичный</Label>
              <Input
                placeholder="Загрузите вторичный отчет"
                className="w-1/2"
                onChange={(e) => {
                  const file = e.target.files?.item(0);
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const xml = event.target?.result as string;
                      setSecondObj(xml);
                      console.log(xml);
                      toast.success("Файл загружен");
                    };
                    reader.readAsText(file, "windows-1251"); // указываем кодировку "windows-1251"
                  }
                }}
                type="file"
              />
              <Button
                className="z-10 m-4"
                disabled={!firstObj || !secondObj}
                onClick={() => {
                  try {
                    mergeXmlFiles(firstObj, secondObj).then((newXml) => {
                      console.log(newXml);
                      setFile(newXml);
                    });
                  } catch (e) {
                    toast.error("Ошибка при обработке файла");
                    console.log(e);
                  } finally {
                    toast.success("Файл обработан");
                  }
                }}
              >
                <span className="text-white">Объединить файлы</span>
              </Button>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
        <Drawer>
          <DrawerTrigger>
            <motion.div drag dragConstraints={constRef}>
              <Button className="z-10 m-4" asChild>
                <span className="text-white">Уведомления</span>
              </Button>
            </motion.div>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerClose>
              <span className="text-white">Закрыть</span>
            </DrawerClose>
            <DrawerHeader>
              <DrawerTitle>Уведомления</DrawerTitle>
              <DrawerDescription>
                В данном разделе вы можете увидеть уведомления
              </DrawerDescription>
            </DrawerHeader>
            <Input
              placeholder="Загрузите уведомления"
              className="w-1/2"
              type="file"
              multiple
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
                      setFiles(xmls);
                      toast.success("Файлы загружены");
                      console.log(xmls);
                    })
                    .catch(() => toast.error("Ошибка при чтении файлов"));
                }
              }}
            />
            <Drawer>
              <DrawerTrigger>
                <motion.div drag dragConstraints={constRef}>
                  <Button
                    className="z-10 m-4"
                    asChild
                    onClick={() => {
                      try {
                        processXmlData(files).then((tableData) => {
                          setTableData(tableData);
                          console.log(tableData);
                          const csvData = [
                            "KPP;OKTMO;CYMMA;KOD PERIODA",
                            ...Object.values(tableData).map(
                              (item) =>
                                `${item.KPP};${item.OKTMO};${item.CYMMA};${item["KOD PERIODA"]}`
                            ),
                          ].join("\n");
                          setUvedCSV(csvData);
                        });
                      } catch (e) {
                        toast.error("Ошибка при обработке файла");
                        console.log(e);
                      } finally {
                        toast.success("Файл обработан");
                      }
                    }}
                  >
                    <span className="text-white">Вывести таблицу</span>
                  </Button>
                </motion.div>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerClose>
                  <span className="text-white">Закрыть</span>
                </DrawerClose>
                <DrawerHeader>
                  <DrawerTitle>Таблица</DrawerTitle>
                  <DrawerDescription>
                    В данном разделе вы можете увидеть таблицу
                  </DrawerDescription>
                </DrawerHeader>
                <div className="w-full p-4">
                  <DataTableDemo data={tableData} options={filterOptions} />
                </div>
              </DrawerContent>
            </Drawer>
          </DrawerContent>
        </Drawer>
        <motion.div drag dragConstraints={constRef}>
          <Input className="z-10" type="file" onChange={handleFileChange} />
        </motion.div>
        <button onClick={changeVersion}>Change Version</button>
      </motion.div>
    </>
  );
};

export default Home;
