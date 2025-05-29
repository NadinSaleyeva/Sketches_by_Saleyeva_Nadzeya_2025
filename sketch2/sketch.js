let distances = [];
let maxDistance;
let spacer;
let isInteractive = true;
let particles = [];
let waveTime = 0;
let mouseInfluence = { x: 0, y: 0 };
let targetMouseInfluence = { x: 0, y: 0 };

function setup() {
  createCanvas(450, 400);
  colorMode(HSB, 360, 100, 100, 1);
  
  maxDistance = dist(width/2, height/2, width, height);
  
  // Initialize distances and create particles
  for (let y = 0; y < height; y++) {
    distances[y] = [];
    for (let x = 0; x < width; x++) {
      let distance = dist(width/2, height/2, x, y);
      distances[y][x] = distance/maxDistance;
    }
  }
  
  // Create floating particles
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      life: random(100, 255)
    });
  }
  
  spacer = 15;
  strokeWeight(4);
  
  if (!isInteractive) {
    noLoop();
  }
}

function draw() {
  background(0, 0, 10, 0.1); // Trailing effect
  
  waveTime += 0.02;
  
  // Smooth mouse influence interpolation
  if (isInteractive) {
    targetMouseInfluence.x = map(mouseX, 0, width, -1, 1);
    targetMouseInfluence.y = map(mouseY, 0, height, -1, 1);
  } else {
    targetMouseInfluence.x = 0;
    targetMouseInfluence.y = 0;
  }
  
  mouseInfluence.x = lerp(mouseInfluence.x, targetMouseInfluence.x, 0.05);
  mouseInfluence.y = lerp(mouseInfluence.y, targetMouseInfluence.y, 0.05);
  
  // Draw main grid with wave distortion and mouse influence
  for (let y = 0; y < height; y += spacer) {
    for (let x = 0; x < width; x += spacer) {
      let mouseDist = isInteractive ? dist(x, y, mouseX, mouseY) : 0;
      let mouseEffect = isInteractive ? map(mouseDist, 0, 200, 1, 0, true) : 0;
      
      // Enhanced wave distortion with mouse influence
      let mouseWaveX = mouseInfluence.x * 30 * sin(waveTime + y * 0.008);
      let mouseWaveY = mouseInfluence.y * 25 * cos(waveTime + x * 0.006);
      
      let wave = sin(waveTime + x * 0.01 + y * 0.01 + mouseInfluence.x * 2) * (20 + abs(mouseInfluence.y) * 15);
      let waveY = sin(waveTime * 1.5 + x * 0.005 + mouseInfluence.y * 2) * (15 + abs(mouseInfluence.x) * 10);
      
      // Mouse creates ripple effect
      let rippleEffect = 0;
      if (isInteractive) {
        let distanceFromMouse = dist(x, y, mouseX, mouseY);
        rippleEffect = sin(distanceFromMouse * 0.02 - frameCount * 0.1) * 
                      map(distanceFromMouse, 0, 300, 20, 0, true);
      }
      
      let hueValue = map(distances[y][x], 0, 1, 180, 320) + 
                     mouseEffect * 80 + wave + 
                     mouseInfluence.x * 40 + mouseInfluence.y * 30;
      
      let brightnessValue = map(distances[y][x], 0, 1, 20, 90) + 
                           mouseEffect * 40 + 
                           abs(mouseInfluence.x + mouseInfluence.y) * 20;
      
      stroke(
        (hueValue + frameCount * 0.5) % 360,
        70 + mouseEffect * 30 + abs(mouseInfluence.x) * 20,
        brightnessValue,
        0.9
      );
      
      let pointSize = map(distances[y][x], 0, 1, 1, 8) * 
                     (1 + mouseEffect * 2 + abs(mouseInfluence.y) * 0.5);
      
      let xPos = x + spacer/2 + wave * 0.5 + mouseWaveX + rippleEffect * cos(atan2(y - mouseY, x - mouseX));
      let yPos = y + spacer/2 + waveY * 0.3 + mouseWaveY + rippleEffect * sin(atan2(y - mouseY, x - mouseX));
      
      strokeWeight(pointSize);
      point(xPos, yPos);
    }
  }
  
  // Update and draw particles with mouse influence
  updateParticles();
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Add mouse influence to particle movement
    let mouseForceX = isInteractive ? (mouseX - p.x) * 0.0003 : 0;
    let mouseForceY = isInteractive ? (mouseY - p.y) * 0.0003 : 0;
    
    // Apply mouse influence and wave motion
    p.vx += mouseForceX + mouseInfluence.x * 0.02;
    p.vy += mouseForceY + mouseInfluence.y * 0.02;
    
    // Damping to prevent particles from going too fast
    p.vx *= 0.98;
    p.vy *= 0.98;
    
    // Limit velocity
    p.vx = constrain(p.vx, -3, 3);
    p.vy = constrain(p.vy, -3, 3);
    
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 2;
    
    // Wrap around edges
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    // Draw particle with mouse-influenced color
    let alpha = map(p.life, 0, 255, 0, 1);
    let particleHue = 250 + mouseInfluence.x * 50 + mouseInfluence.y * 30;
    let particleBrightness = 90 + abs(mouseInfluence.x + mouseInfluence.y) * 10;
    
    stroke(particleHue % 360, 80, particleBrightness, alpha);
    strokeWeight(2 + abs(mouseInfluence.x) * 2);
    point(p.x, p.y);
    
    // Remove dead particles and create new ones
    if (p.life <= 0) {
      particles.splice(i, 1);
      particles.push({
        x: random(width),
        y: random(height),
        vx: random(-1, 1),
        vy: random(-1, 1),
        life: random(100, 255)
      });
    }
  }
}

function mouseMoved() {
  if (isInteractive) {
    redraw();
  }
}

function keyPressed() {
  if (key === ' ') {
    isInteractive = !isInteractive;
    if (isInteractive) {
      loop();
    } else {
      noLoop();
      redraw();
    }
  }
  
  if (keyCode === UP_ARROW && spacer < 30) {
    spacer += 1;
  } else if (keyCode === DOWN_ARROW && spacer > 5) {
    spacer -= 1;
  }
  
  // Add reset function
  if (key === 'r' || key === 'R') {
    mouseInfluence = { x: 0, y: 0 };
    targetMouseInfluence = { x: 0, y: 0 };
    waveTime = 0;
  }
}
