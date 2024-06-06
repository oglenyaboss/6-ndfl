// function calculateCylinderVolume(radius, height) {
//   return Math.PI * radius * radius * height;
// }

// console.log(calculateCylinderVolume(2, 5)); // 62.83185307179586

// test("Значения объема цилиндра радиусом 2 и высотой 5", () => {
//   expect(calculateCylinderVolume(2, 5)).toBeCloseTo(62.83185307179586);
// });

// test("Значения объема цилиндра радиусом 0 и высотой 5", () => {
//   expect(calculateCylinderVolume(0, 5)).toBe(0);
// });

// test("Значение объема цилиндра с радиусом 3 и высотой 0", () => {
//   expect(calculateCylinderVolume(3, 0)).toBe(0);
// });

//вариант 11

function F(x, a, b, c) {
  if (c !== 0 && x < 1) {
    return a * x ** 2 + b / c;
  } else if (c === 0 && x > 1.5) {
    return (x - a) / (x - c) ** 2;
  } else {
    return x ** 2 / c ** 2;
  }
}

test("F(0.5, 2, 3, 4) должна возвращать 1.25", () => {
  expect(F(0.5, 2, 3, 4)).toBeCloseTo(1.25);
});

test("F(2, 1, 2, 0) должна возвращать 0.25", () => {
  expect(F(2, 1, 2, 0)).toBe(0.25);
});

test("F(2, 1, 2, 3) должна возвращать 0.4444444444444444", () => {
  expect(F(2, 1, 2, 3)).toBeCloseTo(0.4444444444444444);
});
