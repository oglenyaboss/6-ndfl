"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React from "react";

const Blob = (props: any) => {
  const blobs = [
    "M47.4,-34.9C61.2,-20.5,71.9,-0.8,67.2,13.5C62.5,27.8,42.3,36.8,21.3,48.5C0.4,60.2,-21.3,74.7,-38.7,70.2C-56,65.7,-69.1,42.2,-73,18.5C-77,-5.2,-71.7,-29.1,-58,-43.5C-44.3,-57.9,-22.1,-62.8,-2.7,-60.6C16.8,-58.5,33.6,-49.3,47.4,-34.9Z",
    "M45.5,-40.3C56.7,-22.2,62.1,-3.4,59.1,15C56.1,33.5,44.8,51.6,27.5,61.7C10.2,71.8,-13.1,73.8,-34.8,65.8C-56.5,57.8,-76.5,39.9,-79.5,20.1C-82.5,0.3,-68.4,-21.5,-52.3,-40.7C-36.2,-59.9,-18.1,-76.4,-0.5,-76.1C17.1,-75.7,34.3,-58.3,45.5,-40.3Z",
    "M50.8,-38.4C64.3,-23.6,72.6,-2.5,70.5,19.7C68.3,42,55.6,65.6,38.2,70.7C20.7,75.8,-1.5,62.5,-23.7,51.1C-45.9,39.6,-68.1,30.1,-76.6,12C-85.1,-6.1,-80,-32.9,-64.9,-48C-49.9,-63.2,-24.9,-66.8,-3.1,-64.3C18.6,-61.8,37.3,-53.2,50.8,-38.4Z",
    "M58.7,-47.5C67.1,-36.2,58.9,-12.3,53.1,11.5C47.2,35.4,43.5,59.1,28,72C12.4,84.8,-15.1,86.7,-35,75.9C-54.8,65.1,-67,41.6,-71.2,17.8C-75.5,-6.1,-71.8,-30.2,-58.6,-42.6C-45.4,-55.1,-22.7,-55.8,1.2,-56.8C25.1,-57.7,50.2,-58.9,58.7,-47.5Z",
    "M54.1,-45.3C63.3,-31.6,59.3,-9.5,52.6,8.9C45.9,27.2,36.5,41.8,23.1,48.4C9.7,55,-7.7,53.7,-24.2,47C-40.7,40.3,-56.1,28.3,-63.3,10.6C-70.4,-7.2,-69.2,-30.7,-57.2,-45.1C-45.3,-59.4,-22.7,-64.6,-0.1,-64.6C22.4,-64.5,44.9,-59.1,54.1,-45.3Z",
  ];

  const [randomBlob] = React.useState(
    blobs[Math.floor(Math.random() * blobs.length)]
  );

  const x = useMotionValue(
    Math.random() * (typeof window !== "undefined" ? window.innerWidth : 0)
  ); // начальная позиция x
  const y = useMotionValue(
    Math.random() * (typeof window !== "undefined" ? window.innerHeight : 0)
  ); // начальная позиция y
  const vx = useMotionValue((Math.random() - 0.5) * 10); // скорость и направление по оси x
  const vy = useMotionValue((Math.random() - 0.5) * 10); // скорость и направление по оси y
  const rotation = useMotionValue(Math.random() * 360); // начальное положение вращения
  const rotationSpeed = useMotionValue((Math.random() - 0.5) * 1); // скорость вращения

  React.useEffect(() => {
    const unsubscribeX = x.onChange((currentX) => {
      // Если достигнута граница экрана, меняем направление движения
      if (currentX < -window.innerWidth / 2 || currentX > window.innerWidth) {
        vx.set(-vx.get());
      }
    });

    const unsubscribeY = y.onChange((currentY) => {
      // Если достигнута граница экрана, меняем направление движения
      if (
        currentY < -window.innerHeight / 2 ||
        currentY > window.innerHeight / 2
      ) {
        vy.set(-vy.get());
      }
    });

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      x.set(x.get() + vx.get());
      y.set(y.get() + vy.get());
      rotation.set((rotation.get() + rotationSpeed.get()) % 360);
    }, 1000 / 60); // обновляем координаты и вращение 60 раз в секунду

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.svg
      drag
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={"absolute"}
      dragConstraints={props.ref}
      style={{ x, y, rotate: rotation, scale: 0.5, zIndex: 999 }} // уменьшаем масштаб и добавляем вращение
    >
      <motion.path
        d={randomBlob}
        fill="#FA4D56"
        transform="translate(100 100)"
        scale={0.5}
      />
    </motion.svg>
  );
};

export default Blob;
