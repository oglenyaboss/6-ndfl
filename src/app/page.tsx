"use client";
import React from "react";
import Home from "./firstVersion";
import SecondHome from "./secondVersion";
import { MultiStepLoader as Loader } from "@/components/uiV2/loading";
import { motion } from "framer-motion";

const loadingStates = [
  {
    text: "Берем задачу",
  },
  {
    text: "Звоним тете",
  },
  {
    text: "Подключаем анудик",
  },
  {
    text: "Открываем зарплату",
  },
  {
    text: "Устанавливаем расширение",
  },
  {
    text: "Перепроводим документы",
  },
  {
    text: "Сверяем свод с анализом",
  },
  {
    text: "Добро пожаловать в 6-НДФЛ",
  },
];

export default function Page() {
  const [version, setVersion] = React.useState(2);
  const [loading, setLoading] = React.useState(false);

  const changeLoading = () => {
    setLoading(!loading);
  };
  const changeVersion = () => {
    setVersion(version === 1 ? 2 : 1);
    setLoading(true);
  };

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  if (isMobile) {
    return (
      <div className=" bg-slate-800 flex flex-col justify-center items-center h-screen text-white">
        <p className="text-xl flex items-center justify-center text-center font-bold">
          Извините, но сайт не адаптирован под мобильные устройства 😭 <br></br>
        </p>
      </div>
    );
  }

  return (
    <div
      className="h-screen overflow-scroll"
      style={{
        overflowX: "hidden",
        scrollSnapType: "y mandatory",
      }}
    >
      <Loader
        loadingStates={loadingStates}
        loading={loading}
        duration={750}
        loop={false}
        setLoading={changeLoading}
      />
      {version === 1 ? (
        <motion.div
          key={"firstVersion"}
          initial={{ opacity: 0 }}
          animate={{ opacity: loading ? 0.5 : 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 2,
          }}
        >
          <Home changeVersion={changeVersion} />
        </motion.div>
      ) : (
        <motion.div
          key={"secondVersion"}
          initial={{ opacity: 0 }}
          animate={{ opacity: loading ? 0.5 : 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 2,
          }}
        >
          <SecondHome changeVersion={changeVersion} />
        </motion.div>
      )}
    </div>
  );
}
