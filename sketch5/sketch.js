let elements = [];
let mutationRate = 0.05;
let colorPalette = {
  'A': [100, 255, 100, 150], // Аденин - зелёный
  'T': [255, 100, 100, 150], // Тимин - красный
  'G': [100, 100, 255, 150], // Гуанин - синий
  'C': [255, 255, 100, 150]  // Цитозин - жёлтый
};
let connections = [];
let showConnections = false;
let connectionStrength = 200;
let infoFontSize = 16;
let hoveredElement = null;
let hoverScale = 1;

function setup() {
  createCanvas(450, 400);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textFont('Helvetica');
  
  if (textFont() !== 'Helvetica') {
    console.warn("Шрифт Helvetica не найден, будет использован стандартный шрифт");
  }
  
  initElements(20);
}

function initElements(count) {
  elements = [];
  for (let i = 0; i < count; i++) {
    elements.push(createRandomElement());
  }
}

function createRandomElement() {
  let nucleotide = random(['A', 'T', 'G', 'C']);
  return {
    x: random(width),
    y: random(height),
    size: random(60, 200),
    speedX: random(-1, 1),
    speedY: random(-1, 1),
    nucleotide: nucleotide,
    color: colorPalette[nucleotide],
    rotation: 0,
    rotationSpeed: random(-0.02, 0.02),
    energy: 700,
    age: 0,
    originalSize: 0 // Будет установлено при первом рендере
  };
}

function draw() {
  background(20, 20, 30, 25);
  
  updateConnections();
  if (showConnections) drawConnections();
  
  // Проверка наведения мыши
  hoveredElement = null;
  for (let e of elements) {
    if (!e.originalSize) e.originalSize = e.size; // Сохраняем исходный размер
    
    let d = dist(mouseX, mouseY, e.x, e.y);
    if (d < e.size/2) {
      hoveredElement = e;
      break;
    }
  }
  
  // Анимация увеличения/уменьшения
  if (hoveredElement) {
    hoverScale = lerp(hoverScale, 1.5, 0.1);
    hoveredElement.size = hoveredElement.originalSize * hoverScale;
  } else {
    hoverScale = lerp(hoverScale, 1, 0.1);
  }
  
  for (let i = elements.length - 1; i >= 0; i--) {
    let e = elements[i];
    
    if (random() < mutationRate) {
      mutateElement(e);
    }
    
    e.x += e.speedX;
    e.y += e.speedY;
    e.rotation += e.rotationSpeed;
    e.age += 0.01;
    
    if (e.x < 0 || e.x > width) e.speedX *= -1;
    if (e.y < 0 || e.y > height) e.speedY *= -1;
    
    e.energy -= 0.1 + e.age * 0.001;
    if (e.energy <= 0) {
      elements.splice(i, 1);
      continue;
    }
    
    // Плавное возвращение к исходному размеру, если не наведено
    if (e !== hoveredElement) {
      e.size = lerp(e.size, e.originalSize, 0.1);
    }
    
    push();
    translate(e.x, e.y);
    rotate(e.rotation);
    let alpha = map(e.energy, 0, 100, 0, e.color[3]);
    fill(e.color[0], e.color[1], e.color[2], alpha);
    textSize(e.size);
    text(e.nucleotide, 0, 0);
    pop();
  }
  
  if (random() < 0.01 && elements.length < 50) {
    elements.push(createRandomElement());
  }
  
  drawInfo();
}

function mutateElement(e) {
  let mutations = [
    () => {
      let newNucleotide = random(['A', 'T', 'G', 'C']);
      e.nucleotide = newNucleotide;
      e.color = colorPalette[newNucleotide];
    },
    () => {
      e.originalSize = constrain(e.originalSize + random(-20, 20), 40, 300);
    },
    () => {
      e.speedX = random(-2, 2);
      e.speedY = random(-2, 2);
    },
    () => {
      e.rotationSpeed = random(-0.03, 0.03);
    }
  ];
  
  random(mutations)();
}

function mousePressed() {
  let nucleotide = random(['A', 'T', 'G', 'C']);
  elements.push({
    x: mouseX,
    y: mouseY,
    size: random(60, 200),
    speedX: random(-2, 2),
    speedY: random(-2, 2),
    nucleotide: nucleotide,
    color: colorPalette[nucleotide],
    rotation: 0,
    rotationSpeed: random(-0.05, 0.05),
    energy: 100,
    age: 0,
    originalSize: 0
  });
  
  mutationRate = random(0.01, 0.1);
}

function keyPressed() {
  if (key === 'c' || key === 'C') {
    showConnections = !showConnections;
  } else if (key === '+' || key === '=') {
    connectionStrength = min(connectionStrength + 10, 300);
  } else if (key === '-' || key === '_') {
    connectionStrength = max(connectionStrength - 10, 50);
  } else if (key === ' ') {
    initElements(20);
  } else if (key === 'f') {
    infoFontSize = constrain(infoFontSize + 2, 12, 24);
  } else if (key === 'd') {
    infoFontSize = constrain(infoFontSize - 2, 12, 24);
  }
}

function updateConnections() {
  connections = [];
  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      let d = dist(elements[i].x, elements[i].y, elements[j].x, elements[j].y);
      if (d < connectionStrength) {
        connections.push([elements[i], elements[j], d]);
      }
    }
  }
}

function drawConnections() {
  for (let conn of connections) {
    let d = conn[2];
    let alpha = map(d, 0, connectionStrength, 100, 10);
    stroke(255, alpha);
    strokeWeight(map(d, 0, connectionStrength, 1.5, 0.3));
    line(conn[0].x, conn[0].y, conn[1].x, conn[1].y);
  }
}

function drawInfo() {
  fill(255);
  noStroke();
  textSize(infoFontSize);
  textAlign(LEFT, TOP);
  // text(`Элементов: ${elements.length}`, 10, 10);
  // text(`Скорость мутации: ${nf(mutationRate, 1, 3)}`, 10, 10 + infoFontSize * 1.2);
  // text(`Связи: ${showConnections ? 'вкл' : 'выкл'} (C)`, 10, 10 + infoFontSize * 2.4);
  // text(`Дистанция: ${connectionStrength}px (+/-)`, 10, 10 + infoFontSize * 3.6);
  // text(`Пробел: перезапуск`, 10, 10 + infoFontSize * 4.8);
  // text(`F/D: размер шрифта`, 10, 10 + infoFontSize * 6.0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for (let e of elements) {
    e.x = map(e.x, 0, width, 0, windowWidth);
    e.y = map(e.y, 0, height, 0, windowHeight);
  }
}