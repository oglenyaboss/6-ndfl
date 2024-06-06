"use client";
import React from "react";
import { HeroParallax } from "@/components/uiV2/parallax";
import { motion } from "framer-motion";

export default function HeroParallaxDemo() {
  React.useEffect(() => {
    // Сохраняем текущий стиль overflow
    const currentOverflow = document.body.style.overflow;

    // Устанавливаем overflow в 'auto'
    document.body.style.overflow = "auto";

    // Возвращаем overflow обратно при размонтировании
    return () => {
      document.body.style.overflow = currentOverflow;
    };
  }, []);
  return (
    <motion.div className="w-full h-screen">
      <HeroParallax products={products} />
    </motion.div>
  );
}
export const products = [
  {
    title: "Первый раздел",
    link: "/edit/first",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/moonbeam.png",
  },
  {
    title: "Второй раздел",
    link: "https://cursor.so",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/cursor.png",
  },
  {
    title: "Справки",
    link: "https://userogue.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/rogue.png",
  },
];
