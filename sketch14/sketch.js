// https://p5js.org/tutorials/conditionals-and-interactivity/

// переменные для позиции солнца и анимации
let sunHeight = 600; // точка ниже горизонта
let sunAngle = 0; // для мягкого покачивания солнца

// переменные для изменения цвета
let redVal = 0;
let greenVal = 0;
let blueVal = 0;

// переменные для облаков
let clouds = [];
let numClouds = 5;

// переменные для птиц
let birds = [];
let numBirds = 3;

// переменные для звезд
let stars = [];
let numStars = 20;

// переменные для тумана
let fogOpacity = 255;

// переменная времени для анимаций
let time = 0;

function setup() {
  createCanvas(450, 400);
  
  // создаем облака в случайных позициях
  for (let i = 0; i < numClouds; i++) {
    clouds.push({
      x: random(-50, 500),
      y: random(50, 150),
      size: random(40, 80),
      speed: random(0.2, 0.8)
    });
  }
  
  // создаем птиц
  for (let i = 0; i < numBirds; i++) {
    birds.push({
      x: random(-100, 550),
      y: random(100, 200),
      wingPhase: random(TWO_PI),
      speed: random(0.5, 1.5)
    });
  }
  
  // создаем звезды
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: random(0, 450),
      y: random(0, 200),
      brightness: random(100, 255),
      twinkleSpeed: random(0.02, 0.05)
    });
  }
}

function draw() {
  time += 0.02;
  
  // динамический фон с градиентом
  drawGradientSky();
  
  // рисуем звезды (исчезают с восходом)
  drawStars();
  
  // рисуем облака
  drawClouds();
  
  // солнце с эффектами
  drawSun();
  
  // горы с туманом
  drawMountains();
  
  // летающие птицы
  drawBirds();
  
  // туман у подножия гор
  drawFog();
  
  // анимация восхода
  animateSunrise();
}

function drawGradientSky() {
  // создаем вертикальный градиент
  for (let i = 0; i <= height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(
      color(redVal, greenVal, blueVal), 
      color(redVal * 0.3, greenVal * 0.3, blueVal * 0.3), 
      inter
    );
    stroke(c);
    line(0, i, width, i);
  }
}

function drawStars() {
  // звезды исчезают с восходом солнца
  let starAlpha = map(sunHeight, 600, 300, 255, 0);
  starAlpha = constrain(starAlpha, 0, 255);
  
  for (let star of stars) {
    let brightness = star.brightness + sin(time * star.twinkleSpeed) * 50;
    brightness = constrain(brightness, 50, 255);
    
    fill(255, 255, 200, starAlpha);
    noStroke();
    circle(star.x, star.y, map(brightness, 50, 255, 1, 3));
    
    // крестообразное сияние
    stroke(255, 255, 200, starAlpha * 0.5);
    strokeWeight(1);
    line(star.x - 4, star.y, star.x + 4, star.y);
    line(star.x, star.y - 4, star.x, star.y + 4);
  }
}

function drawClouds() {
  noStroke();
  for (let cloud of clouds) {
    // цвет облаков меняется с рассветом
    let cloudColor = lerpColor(
      color(100, 100, 120, 150),
      color(255, 200, 150, 180),
      map(sunHeight, 600, 130, 0, 1)
    );
    
    fill(cloudColor);
    
    // рисуем облако из нескольких кругов
    circle(cloud.x, cloud.y, cloud.size);
    circle(cloud.x + cloud.size * 0.3, cloud.y, cloud.size * 0.8);
    circle(cloud.x - cloud.size * 0.3, cloud.y, cloud.size * 0.6);
    circle(cloud.x, cloud.y - cloud.size * 0.2, cloud.size * 0.7);
    
    // движение облаков
    cloud.x += cloud.speed;
    if (cloud.x > width + cloud.size) {
      cloud.x = -cloud.size;
    }
  }
}

function drawSun() {
  push();
  translate(300, sunHeight);
  
  // мягкое покачивание солнца
  sunAngle += 0.01;
  rotate(sin(sunAngle) * 0.05);
  
  // лучи солнца
  drawSunRays();
  
  // основное тело солнца с градиентом
  for (let r = 180; r > 0; r -= 10) {
    let alpha = map(r, 0, 180, 255, 0);
    let sunColor = lerpColor(
      color(255, 100, 0, alpha * 0.3),
      color(255, 255, 100, alpha * 0.6),
      map(r, 180, 0, 0, 1)
    );
    fill(sunColor);
    circle(0, 0, r);
  }
  
  pop();
}

function drawSunRays() {
  stroke(255, 255, 150, 100);
  strokeWeight(2);
  
  for (let i = 0; i < 12; i++) {
    let angle = (TWO_PI / 12) * i + time;
    let rayLength = 100 + sin(time * 2 + i) * 20;
    
    let x1 = cos(angle) * 90;
    let y1 = sin(angle) * 90;
    let x2 = cos(angle) * rayLength;
    let y2 = sin(angle) * rayLength;
    
    line(x1, y1, x2, y2);
  }
}

function drawMountains() {
  // добавляем туман к горам
  let fogAmount = map(sunHeight, 600, 130, 100, 20);
  
  // дальние горы
  fill(110 + fogAmount, 50 + fogAmount, 18 + fogAmount);
  triangle(200, 400, 520, 253, 800, 400);
  fill(110 + fogAmount * 0.8, 95 + fogAmount * 0.8, 20 + fogAmount * 0.8);
  triangle(200, 400, 520, 253, 350, 400);
  
  // средние горы
  fill(150 + fogAmount * 0.6, 75 + fogAmount * 0.6, fogAmount * 0.6);
  triangle(-100, 400, 150, 200, 400, 400);
  fill(100 + fogAmount * 0.7, 50 + fogAmount * 0.7, 12 + fogAmount * 0.7);
  triangle(-100, 400, 150, 200, 0, 400);
  
  // ближние горы
  fill(150 + fogAmount * 0.4, 100 + fogAmount * 0.4, fogAmount * 0.4);
  triangle(200, 400, 450, 250, 800, 400);
  fill(120 + fogAmount * 0.5, 80 + fogAmount * 0.5, 50 + fogAmount * 0.5);
  triangle(200, 400, 450, 250, 300, 400);
}

function drawBirds() {
  stroke(0, 0, 0, 150);
  strokeWeight(2);
  noFill();
  
  for (let bird of birds) {
    push();
    translate(bird.x, bird.y + sin(time * 2 + bird.wingPhase) * 3);
    
    // анимация крыльев
    let wingFlap = sin(time * 8 + bird.wingPhase) * 0.3;
    
    // левое крыло
    arc(-5, 0, 10, 6, PI + wingFlap, TWO_PI - wingFlap);
    // правое крыло
    arc(5, 0, 10, 6, wingFlap, PI - wingFlap);
    
    pop();
    
    // движение птиц
    bird.x += bird.speed;
    if (bird.x > width + 20) {
      bird.x = -20;
      bird.y = random(100, 200);
    }
  }
}

function drawFog() {
  // туман у подножия гор
  for (let i = 0; i < 5; i++) {
    let fogY = 350 + i * 10;
    let fogAlpha = map(sunHeight, 600, 130, fogOpacity, 50) - i * 30;
    fogAlpha = constrain(fogAlpha, 0, 100);
    
    fill(255, 255, 255, fogAlpha);
    noStroke();
    
    for (let x = 0; x < width + 100; x += 50) {
      let fogHeight = 30 + sin(time + x * 0.01 + i) * 10;
      ellipse(x + sin(time * 0.5 + i) * 20, fogY, 80, fogHeight);
    }
  }
}

function animateSunrise() {
  // анимация восхода солнца
  if (sunHeight > 130) {
    sunHeight -= 1.5;
  }
  
  // изменение цветов в зависимости от времени
  if (sunHeight < 480) {
    redVal += 3;
    greenVal += 2;
    blueVal += 1;
  }
  
  // ограничиваем значения цветов
  redVal = constrain(redVal, 0, 255);
  greenVal = constrain(greenVal, 0, 180);
  blueVal = constrain(blueVal, 0, 100);
  
  // уменьшаем туман с восходом
  if (sunHeight < 400) {
    fogOpacity *= 0.999;
  }
}

// интерактивность - клик мыши перезапускает анимацию
function mousePressed() {
  sunHeight = 600;
  redVal = 0;
  greenVal = 0;
  blueVal = 0;
  fogOpacity = 255;
  time = 0;
  
  // пересоздаем облака и птиц
  for (let i = 0; i < numClouds; i++) {
    clouds[i].x = random(-50, 500);
  }
  
  for (let i = 0; i < numBirds; i++) {
    birds[i].x = random(-100, 550);
  }
}
