function setup() {
  createCanvas(450, 400);
  rectMode(CENTER);
  background(`#F97316`);
}

function draw() {
  // Полупрозрачный фон для trail эффекта
  fill(249, 115, 22, 50);
  noStroke();
  rect(width/2, height/2, width, height);
  
  // Искаженные полосы
  push(); 
  fill(`#F97316`); 
  translate(width / 2, height / 2); 
  rotate(radians(frameCount)); 
  // Волновая деформация полосы
  for(let i = -350; i < 350; i += 20) {
    let wave = sin((frameCount + i) * 0.02) * 10;
    rect(wave, i, 50, 20); 
  }
  pop();

  fill(`#DC2626`); 
  push(); 
  translate(width / 2, height / 2); 
  rotate(radians(-frameCount * 0.7)); 
  rect(0, 0, 30, 700); 
  pop();

  // Текст с волновой деформацией
  let factor = map(sin(frameCount * 0.1), -1, 1, 1, 0); 
  let r = lerp(255, 220, factor); 
  let g = lerp(204, 38, factor); 
  let b = lerp(0, 38, factor);

  // Волновое искажение позиции букв
  let textStr1 = 'Saleyeva';
  let textStr2 = 'Nadzeya';
  
  push(); 
  translate(width / 2, height / 2 - 40); 
  rotate(radians(frameCount * 0.5)); 
  fill(r, g, b); 
  textSize(60); 
  textAlign(CENTER, CENTER); 
  
  // Рисуем каждую букву с волновым смещением
  for(let i = 0; i < textStr1.length; i++) {
    let x = (i - textStr1.length/2) * 35;
    let y = sin(frameCount * 0.1 + i * 0.5) * 15;
    text(textStr1[i], x, y);
  }
  pop(); 

  push(); 
  translate(width / 2, height / 2 + 40); 
  rotate(radians(frameCount * 0.5)); 
  fill(r, g, b); 
  textSize(60); 
  textAlign(CENTER, CENTER); 
  
  for(let i = 0; i < textStr2.length; i++) {
    let x = (i - textStr2.length/2) * 35;
    let y = cos(frameCount * 0.08 + i * 0.3) * 20;
    text(textStr2[i], x, y);
  }
  pop(); 
}
