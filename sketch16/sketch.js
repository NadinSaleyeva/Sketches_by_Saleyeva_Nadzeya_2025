let cols, rows;
let cellSize = 40; // Размер ячейки для букв
let time = 0;
let waveAmplitude;

// Создаем массив букв из строки "SALEYEVA NADZEYA"
const letters = "SALEYEVA NADZEYA".split("");

function setup() {
  createCanvas(450, 400);
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
  colorMode(HSB, 360, 100, 100, 1);
  waveAmplitude = height / 6;
  textAlign(CENTER, CENTER);
  textSize(cellSize * 0.8);
  textStyle(BOLD);
}

function draw() {
  background(0, 0, 10);
  
  let mouseXNormalized = map(mouseX, 0, width, 0, 1);
  let mouseYNormalized = map(mouseY, 0, height, 0, 1);
  
  time += 0.05;

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let xPos = x * cellSize;
      let yPos = y * cellSize;
      
      // Используем modulo для создания различных волновых паттернов
      let waveType = (x + y) % 4;
      
      let waveOffset = 0;
      switch (waveType) {
        case 0:
          waveOffset = sin(time + x * 0.2 + y * 0.3) * waveAmplitude * mouseYNormalized;
          break;
        case 1:
          waveOffset = cos(time + x * 0.3 + y * 0.2) * waveAmplitude * mouseYNormalized;
          break;
        case 2:
          waveOffset = sin(time + x * 0.1 + y * 0.4) * waveAmplitude * mouseYNormalized;
          break;
        case 3:
          waveOffset = sin(time + x * 0.4 + y * 0.1) * cos(time + y * 0.3) * waveAmplitude * mouseYNormalized;
          break;
      }
      
      let size = map(sin(time + x * 0.1 + y * 0.1), -1, 1, cellSize * 0.6, cellSize * 1.2);
      
      // Используем modulo для создания цветовых вариаций
      let hue = (x * 10 + y * 10 + time * 50) % 360;
      let saturation = 80 + (x % 2) * 20;
      let brightness = 60 + (y % 2) * 40;
      
      fill(hue, saturation, brightness);
      noStroke();
      
      push();
      translate(xPos + cellSize / 2, yPos + cellSize / 2 + waveOffset);
      
      // Поворачиваем буквы в зависимости от положения мыши
      rotate((x + y) * 0.1 * mouseXNormalized + time * 0.2);
      
      // Выбираем букву из массива в зависимости от положения
      let letterIndex = (x + y) % letters.length;
      textSize(size * 0.7);
      text(letters[letterIndex], 0, 0);
      
      pop();
    }
  }
}

function windowResized() {
  resizeCanvas(450, 400);
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
  waveAmplitude = height / 6;
}