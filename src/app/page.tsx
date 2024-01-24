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

  const combinedSpravDox = spravDox1.concat(spravDox2);

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
    console.log(nalIsch);
    if (nalVoz === 0 || nalVoz === undefined) {
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

async function correctNegativeIncome(xml: any) {
  const obj = await parser.parseStringPromise(xml);
  const spravDohs = obj?.["Файл"]["Документ"][0]["НДФЛ6.2"][0]["СправДох"];
  console.log(spravDohs);

  spravDohs.forEach((spravDoh: any) => {
    const dohVych = spravDoh["СведДох"][0]["ДохВыч"][0]["СвСумДох"];
    const fio = spravDoh["ПолучДох"][0]["ФИО"][0]["$"]; // Получаем ФИО

    let hasNegative;
    do {
      hasNegative = false;
      dohVych.forEach((svSumDoh: any) => {
        const sumDohod = parseFloat(svSumDoh["$"]["СумДоход"]);
        const kodDohod = svSumDoh["$"]["КодДоход"];

        if (sumDohod < 0) {
          const positiveIncomeIndex = dohVych.findIndex(
            (doh: any) =>
              doh["$"]["КодДоход"] === kodDohod &&
              parseFloat(doh["$"]["СумДоход"]) > 0
          );

          if (positiveIncomeIndex !== -1) {
            const newSumDohod =
              parseFloat(dohVych[positiveIncomeIndex]["$"]["СумДоход"]) +
              sumDohod;
            dohVych[positiveIncomeIndex]["$"]["СумДоход"] =
              newSumDohod.toFixed(2);

            if (newSumDohod === 0) {
              dohVych.splice(positiveIncomeIndex, 1);
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
    spravDoh["СведДох"][0]["ДохВыч"][0]["СвСумДох"] = dohVych.filter(
      (svSumDoh: any) => parseFloat(svSumDoh["$"]["СумДоход"]) !== 0
    );
  });

  const newXml = builder.buildObject(obj);
  return newXml;
}

const Home = () => {
  const [file, setFile] = React.useState<any>(null);
  const [firstObj, setFirstObj] = React.useState<any>(null);
  const [secondObj, setSecondObj] = React.useState<any>(null);

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

  const xmlFileExample = `<?xml version="1.0" encoding="windows-1251"?>
<Файл xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ИдФайл="NO_NDFL6.2_5403_5403_5403350198540301001_20240117_5e7d2d7c-2951-4221-8779-c5ae4f974982" ВерсПрог="1С:ЗГУ КОРП 3.1.27.148" ВерсФорм="5.03">
	<Документ КНД="1151100" ДатаДок="17.01.2024" Период="34" ОтчетГод="2023" КодНО="5403" НомКорр="0" ПоМесту="214">
		<СвНП ОКТМО="50701000" Тлф="(383) 352-31-10">
			<НПЮЛ НаимОрг="МБДОУ д/с № 54" ИННЮЛ="5403350198" КПП="540301001"/>
		</СвНП>
		<Подписант ПрПодп="1">
			<ФИО Фамилия="Пануровская" Имя="Анна" Отчество="Анатольевна"/>
		</Подписант>
		<НДФЛ6.2>
			<ОбязНА КБК="18210102010011000110" СумНалУд="2585091" СумНалВоз="0">
				<СведСумНалУд СумНал1Срок="630359" СумНал2Срок="662970" СумНал3Срок="633105" СумНал4Срок="658657"/>
			</ОбязНА>
			<РасчСумНал Ставка="13" КБК="18210102010011000110" СумНачислНач="51883463.74" СумНачислДив="0" СумНачислДог="51883463.74" СумНачислРаб="0" СумНачислКвал="0" КолФЛ="132" КолКвал="0" СумВыч="1749809.92" СумНалИсч="6517373" СумНалИсчДив="0" СумНалИсчКвал="0" СумФикс="0" СумНалПриб="0" СумНалУдерж="651737" СумНалНеУдерж="0" СумНалИзлУдерж="0" СумНалВозвр="1"/>
			<СправДох НомСпр="1" НомКорр="00">
				<ПолучДох ИННФЛ="540309840220" Статус="1" ДатаРожд="17.08.1955" Гражд="643">
					<ФИО Фамилия="Акзамова" Имя="Галина" Отчество="Александровна"/>
					<УдЛичнФЛ КодУдЛичн="21" СерНомДок="50 01 868797"/>
				</ПолучДох>
				<СведДох Ставка="13" КБК="18210102010011000110">
					<СумИтНалПер СумДохОбщ="364710.95" НалБаза="364710.95" НалИсчисл="47412" НалУдерж="30000" АвансПлатФикс="0" СумНалПрибЗач="0" НалУдержЛиш="0"/>
					<ДохВыч>
						<СвСумДох Месяц="08" КодДоход="2010" СумДоход="-88207.83"/>
						<СвСумДох Месяц="09" КодДоход="2000" СумДоход="115115.60"/>
						<СвСумДох Месяц="10" КодДоход="2000" СумДоход="97860.46"/>
						<СвСумДох Месяц="11" КодДоход="2000" СумДоход="39279.90"/>
						<СвСумДох Месяц="11" КодДоход="2013" СумДоход="24247.16"/>
					</ДохВыч>
				</СведДох>
			</СправДох>
      <СправДох НомСпр="119" НомКорр="00">
				<ПолучДох ИННФЛ="540311710901" Статус="1" ДатаРожд="02.03.1961" Гражд="643">
					<ФИО Фамилия="Хомич" Имя="Василий" Отчество="Петрович"/>
					<УдЛичнФЛ КодУдЛичн="21" СерНомДок="09 14 456681"/>
				</ПолучДох>
				<СведДох Ставка="13" КБК="18210102010011000110">
					<СумИтНалПер СумДохОбщ="422629.09" НалБаза="422629.09" НалИсчисл="54942" НалУдерж="512312" АвансПлатФикс="0" СумНалПрибЗач="0" НалУдержЛиш="0"/>
					<ДохВыч>
						<СвСумДох Месяц="01" КодДоход="2000" СумДоход="33735.78"/>
						<СвСумДох Месяц="02" КодДоход="2000" СумДоход="-130010.04"/>
						<СвСумДох Месяц="03" КодДоход="2000" СумДоход="32634.79"/>
						<СвСумДох Месяц="04" КодДоход="2000" СумДоход="31988.48"/>
						<СвСумДох Месяц="05" КодДоход="2000" СумДоход="33257.88"/>
						<СвСумДох Месяц="06" КодДоход="2000" СумДоход="33384.79"/>
						<СвСумДох Месяц="07" КодДоход="2000" СумДоход="31988.48"/>
						<СвСумДох Месяц="07" КодДоход="2012" СумДоход="30800.84"/>
						<СвСумДох Месяц="08" КодДоход="2000" СумДоход="18655.20"/>
						<СвСумДох Месяц="09" КодДоход="2000" СумДоход="30513.08"/>
						<СвСумДох Месяц="10" КодДоход="2000" СумДоход="39102.89"/>
						<СвСумДох Месяц="11" КодДоход="2000" СумДоход="39171.90"/>
						<СвСумДох Месяц="12" КодДоход="2000" СумДоход="37384.94"/>
					</ДохВыч>
				</СведДох>
			</СправДох>
      </НДФЛ6.2>
      </Документ>
      </Файл>
      `;

  const xmlFileExample2 = `<?xml version="1.0" encoding="windows-1251"?>
<Файл xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ИдФайл="NO_NDFL6.2_5403_5403_5403350198540301001_20240117_5e7d2d7c-2951-4221-8779-c5ae4f974982" ВерсПрог="1С:ЗГУ КОРП 3.1.27.148" ВерсФорм="5.03">
	<Документ КНД="1151100" ДатаДок="17.01.2024" Период="34" ОтчетГод="2023" КодНО="5403" НомКорр="0" ПоМесту="214">
		<СвНП ОКТМО="50701000" Тлф="(383) 352-31-10">
			<НПЮЛ НаимОрг="МБДОУ д/с № 54" ИННЮЛ="5403350198" КПП="540301001"/>
		</СвНП>
		<Подписант ПрПодп="1">
			<ФИО Фамилия="Пануровская" Имя="Анна" Отчество="Анатольевна"/>
		</Подписант>
		<НДФЛ6.2>
			<ОбязНА КБК="18210102010011000110" СумНалУд="2585091" СумНалВоз="0">
				<СведСумНалУд СумНал1Срок="630359" СумНал2Срок="662970" СумНал3Срок="633105" СумНал4Срок="658657"/>
			</ОбязНА>
			<РасчСумНал Ставка="13" КБК="18210102010011000110" СумНачислНач="51883463.74" СумНачислДив="0" СумНачислДог="51883463.74" СумНачислРаб="0" СумНачислКвал="0" КолФЛ="132" КолКвал="0" СумВыч="1749809.92" СумНалИсч="6517373" СумНалИсчДив="0" СумНалИсчКвал="0" СумФикс="0" СумНалПриб="0" СумНалУдерж="651737" СумНалНеУдерж="0" СумНалИзлУдерж="0" СумНалВозвр="1"/>
			<СправДох НомСпр="1" НомКорр="00">
				<ПолучДох ИННФЛ="540309840220" Статус="1" ДатаРожд="17.08.1955" Гражд="643">
					<ФИО Фамилия="Акзамова" Имя="Галина" Отчество="Александровна"/>
					<УдЛичнФЛ КодУдЛичн="21" СерНомДок="50 01 868797"/>
				</ПолучДох>
				<СведДох Ставка="13" КБК="18210102010011000110">
					<СумИтНалПер СумДохОбщ="364710.95" НалБаза="364710.95" НалИсчисл="47412" НалУдерж="30000" АвансПлатФикс="0" СумНалПрибЗач="0" НалУдержЛиш="0"/>
					<ДохВыч>
						<СвСумДох Месяц="08" КодДоход="2010" СумДоход="-88207.83"/>
						<СвСумДох Месяц="09" КодДоход="2000" СумДоход="115115.60"/>
						<СвСумДох Месяц="10" КодДоход="2000" СумДоход="97860.46"/>
						<СвСумДох Месяц="11" КодДоход="2000" СумДоход="39279.90"/>
						<СвСумДох Месяц="11" КодДоход="2013" СумДоход="24247.16"/>
					</ДохВыч>
				</СведДох>
			</СправДох>
      <СправДох НомСпр="119" НомКорр="00">
				<ПолучДох ИННФЛ="540311710901" Статус="1" ДатаРожд="02.03.1961" Гражд="643">
					<ФИО Фамилия="Хомич" Имя="Василий" Отчество="Петрович"/>
					<УдЛичнФЛ КодУдЛичн="21" СерНомДок="09 14 456681"/>
				</ПолучДох>
				<СведДох Ставка="13" КБК="18210102010011000110">
					<СумИтНалПер СумДохОбщ="422629.09" НалБаза="422629.09" НалИсчисл="54942" НалУдерж="512312" АвансПлатФикс="0" СумНалПрибЗач="0" НалУдержЛиш="0"/>
					<ДохВыч>
						<СвСумДох Месяц="01" КодДоход="2000" СумДоход="33735.78"/>
						<СвСумДох Месяц="02" КодДоход="2000" СумДоход="-130010.04"/>
						<СвСумДох Месяц="03" КодДоход="2000" СумДоход="32634.79"/>
						<СвСумДох Месяц="04" КодДоход="2000" СумДоход="31988.48"/>
						<СвСумДох Месяц="05" КодДоход="2000" СумДоход="33257.88"/>
						<СвСумДох Месяц="06" КодДоход="2000" СумДоход="33384.79"/>
						<СвСумДох Месяц="07" КодДоход="2000" СумДоход="31988.48"/>
						<СвСумДох Месяц="07" КодДоход="2012" СумДоход="30800.84"/>
						<СвСумДох Месяц="08" КодДоход="2000" СумДоход="18655.20"/>
						<СвСумДох Месяц="09" КодДоход="2000" СумДоход="30513.08"/>
						<СвСумДох Месяц="10" КодДоход="2000" СумДоход="39102.89"/>
						<СвСумДох Месяц="11" КодДоход="2000" СумДоход="39171.90"/>
						<СвСумДох Месяц="12" КодДоход="2000" СумДоход="37384.94"/>
					</ДохВыч>
				</СведДох>
			</СправДох>
      </НДФЛ6.2>
      </Документ>
      </Файл>
      `;
  return (
    <>
      <svg
        style={{
          visibility: "hidden",
          position: "absolute",
        }}
      >
        <filter id="glass">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01"
            numOctaves="1"
            result="warp"
          />
          <feDisplacementMap
            xChannelSelector="R"
            yChannelSelector="G"
            scale="50"
            in="SourceGraphic"
            in2="warp"
          />
          <feGaussianBlur stdDeviation="1" />
        </filter>
      </svg>

      <div className="flex justify-center items-center h-screen overflow-hidden w-screen glass-effect flex-col">
        <Drawer>
          <DrawerTrigger>
            <Button className="z-10 m-4" asChild>
              <span className="text-white">Объединить отчеты</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerClose>
              <span className="text-white">Закрыть</span>
            </DrawerClose>
            <DrawerHeader>
              <DrawerTitle>Объеденение</DrawerTitle>
              <DrawerDescription>
                В данном разделе вы можете объединить 2-ндфл и 6-ндфл в один
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
        <Blobs key={1} />
        <Blobs key={2} />
        <Blobs key={3} />
        <Blobs key={4} />
        <Blobs key={5} />
        {/* <h1 className="">6-НДФЛ</h1> */}

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
        {file && (
          <Button
            className="z-10 m-4"
            onClick={() => {
              const blob = new Blob([file], { type: "text/plain" });
              const link = document.createElement("a");
              link.href = window.URL.createObjectURL(blob);
              link.download = "ndfl.xml";
              link.click();
            }}
          >
            <span className="text-white">Скачать</span>
          </Button>
        )}
        <Input className="z-10 w-1/4" type="file" onChange={handleFileChange} />
      </div>
    </>
  );
};

export default Home;
