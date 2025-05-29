let particles = [];
const numParticles = 1000;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Создание частиц
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(0, 0, 10, 0.1);
  
  // Обновление и отображение частиц
  for (let particle of particles) {
    particle.update();
    particle.display();
  }
}

class Particle {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = random(width);
    this.y = random(-100, -10);
    this.speed = random(2, 5);
    this.value = floor(random(10)); // Случайное число от 0 до 9
    this.size = random(10, 20);
  }
  
  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.reset();
    }
    
    // Изменение значения частицы с использованием modulo
    if (frameCount % 30 === 0) { // Каждые 30 кадров
      this.value = (this.value + 1) % 10;
    }
  }
  
  display() {
    let distToMouse = dist(this.x, this.y, mouseX, mouseY);
    let maxDist = 100;
    
    if (distToMouse < maxDist) {
      // Частицы вблизи курсора меняют цвет
      let hue = map(distToMouse, 0, maxDist, 0, 360);
      fill(hue, 100, 100, 0.8);
    } else {
      fill(0, 0, 100, 0.8);
    }
    
    noStroke();
    textSize(this.size);
    textAlign(CENTER, CENTER);
    
    // Использование modulo для выбора отображаемого числа
    let displayValue = (this.value + floor((frameCount + this.x + this.y) / 10)) % 10;
    text(displayValue, this.x, this.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Обновление позиций частиц при изменении размера окна
  for (let particle of particles) {
    particle.x = random(width);
    particle.y = random(-100, height);
  }
}

function mousePressed() {
  // Изменение направления частиц при клике
  for (let particle of particles) {
    particle.speed *= -1;
  }
}
