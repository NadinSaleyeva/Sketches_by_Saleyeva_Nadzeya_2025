let particles = [];
let nameText = "SALEYEVA NADZEYA DESIGNER";

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 700; i++) {
    particles.push(new Particle());
  }
  textFont('Unbounded');
}

function draw() {
  background(10, 20, 30);
  
  // Частицы-символы
  for (let p of particles) {
    p.update();
    p.display();
  }
  
  // Имя с эффектом волны
  textSize(28);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < nameText.length; i++) {
    let x = width / 2 - (nameText.length * 14) / 2 + i * 14;
    let y = height / 2 + sin(frameCount * 0.05 + i) * 10;
    fill(200, 100 + sin(frameCount * 0.1 + i) * 1000, 500);
    text(nameText[i], x, y);
  }
}

class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.speed = random(0.5, 2);
    this.size = random(80,1000);
    this.chars = "ATGC";
  }
  
  update() {
    this.y -= this.speed;
    if (this.y < -20) this.y = height + 20;
    this.x += sin(frameCount * 0.01 + this.y) * 0.5;
  }
  
  display() {
    fill(100, 200 + sin(frameCount * 0.05 + this.x) * 55, 255, 150);
    textSize(this.size);
    let charIndex = floor(frameCount * 0.1 + this.x) % this.chars.length;
    text(this.chars[charIndex], this.x, this.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}