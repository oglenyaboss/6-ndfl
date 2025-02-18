import { useEffect, useState } from "react";
import { init, initData } from "@telegram-apps/sdk";

export default function MiniAppPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Инициализация SDKs
  init();

  useEffect(() => {
    console.log("id", initData);
  }, []);

  if (error) return <div>Ошибка: {error}</div>;
  if (!data) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Данные из Telegram:</h1>
      <pre>{initData.startParam()}</pre>
      <pre>{initData.raw()}</pre>
    </div>
  );
}
