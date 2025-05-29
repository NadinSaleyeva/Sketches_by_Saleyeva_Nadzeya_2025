let message = "SALEYEVA NADZEYA DESIGNER";
let colors = []; // Для хранения цветов букв

function setup() {
  createCanvas(450, 400);
  textSize(30);
  
  // Генерация цветов для каждой буквы
  for (let i = 0; i < message.length; i++) {
    colors.push(color(random(100, 255), random(100, 255), random(100, 255)));
  }
}

function draw() {
  background(0);
  translate(0, height*0.1); // Сдвигаем на 10% высоты холста
  // Первая группа букв (левая часть)
  translate(width*0.2, 0);
  hellix(0);
  hellix(1);
  
  // Вторая группа букв (правая часть)
  translate(width*0.5, 0);
  hellix(0.5);
  hellix(1.5);
}

function hellix(offset) {
  let yspace = height/(message.length+5);
  
  for (let i = 0; i < message.length; i++) {
    // Пропускаем пробелы
    if(message[i] === ' ') continue;
    
    let wave = sin(radians(i*12 + frameCount*2 + PI*offset));
    let waveColor = sin(radians(i*8 + frameCount*1.5 + PI*offset));
    
    // Динамические параметры
    fill(
      red(colors[i]) + waveColor*100,
      green(colors[i]) + waveColor*200,
      blue(colors[i]) + waveColor*200
    );
    textSize(35 + wave*15);
    
    // Позиция с учетом мыши
    let xPos = wave * mouseX*0.2;
    text(message[i], xPos, i*yspace + sin(radians(frameCount))*20);
  }
}

function mouseMoved() {
  // Обновляем цвета при движении мыши
  for (let i = 0; i < colors.length; i++) {
    colors[i] = color(random(100, 255), random(100, 255), random(100, 255));
  }
}