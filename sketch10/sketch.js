let numLayers = 14;
let numElements = 7;
let maxRadius;
let time = 0;
let dnaSequence = "ATCG";

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  maxRadius = min(width, height) * 0.45;
  textAlign(CENTER, CENTER);
}

function draw() {
  background(0, 0, 10);
  translate(width / 2, height / 2);

  time += 0.01;
  
  for (let layer = 0; layer < numLayers; layer++) {
    let layerRadius = map(layer, 0, numLayers - 1, maxRadius * 0.8, maxRadius);
    
    for (let i = 0; i < numElements; i++) {
      let angle = map(i, 0, numElements, 0, TWO_PI);
      let patternType = (layer + i) % 6;
      let mouseEffect = map(mouseX, 0, width, -1, 1);
      let distortionFactor = map(mouseY, 0, height, 0.3, 2);
      
      push();
      rotate(angle + time * (1 + layer * 0.1) * mouseEffect);
      
      let hue = (layer * 30 + i * 5) % 360;
      stroke(hue, 80, 90, 0.7);
      noFill();
      
      switch (patternType) {
        case 0: drawSpiral(layerRadius, distortionFactor); break;
        case 1: drawFlower(layerRadius, distortionFactor); break;
        case 2: drawStar(layerRadius, distortionFactor); break;
        case 3: drawCircle(layerRadius, distortionFactor); break;
        case 4: drawDNAHelix(layerRadius, distortionFactor, hue); break;
        case 5: drawChromosome(layerRadius, distortionFactor); break;
      }
      
      pop();
    }
  }
}

function drawSpiral(radius, distortion) {
  beginShape();
  for (let t = 0; t < TWO_PI; t += 0.1) {
    let r = radius * (0.5 + 0.5 * sin(t * 5 * distortion));
    let x = r * cos(t);
    let y = r * sin(t);
    vertex(x, y);
  }
  endShape();
}

function drawFlower(radius, distortion) {
  beginShape();
  for (let t = 0; t < TWO_PI; t += 0.1) {
    let r = radius * (0.5 + 0.5 * sin(t * 3 * distortion));
    let x = r * cos(t);
    let y = r * sin(t);
    vertex(x, y);
  }
  endShape(CLOSE);
}

function drawStar(radius, distortion) {
  beginShape();
  for (let i = 0; i < 5; i++) {
    let angle = map(i, 0, 5, 0, TWO_PI);
    let x = radius * cos(angle) * distortion;
    let y = radius * sin(angle) * distortion;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function drawCircle(radius, distortion) {
  ellipse(0, 0, radius * 2 * distortion, radius * 2 / distortion);
}

function drawDNAHelix(radius, distortion, hue) {
  let steps = 20;
  let twists = 2;
  
  for (let strand = 0; strand < 2; strand++) {
    beginShape();
    for (let i = 0; i <= steps; i++) {
      let t = i / steps;
      let angle = t * TWO_PI * twists + (strand * PI);
      let x = radius * cos(angle) * distortion;
      let y = map(t, 0, 1, -radius, radius);
      vertex(x, y);
      
      if (i % 5 == 0 && strand == 0) {
        let nucleotide = dnaSequence[i % dnaSequence.length];
        fill(0, 0, 100);
        noStroke();
        textSize(radius * 0.1);
        text(nucleotide, x * 1.2, y);
        noFill();
        stroke(hue, 80, 90, 0.7);
      }
    }
    endShape();
  }
}

function drawChromosome(radius, distortion) {
  // X-образная форма
  line(-radius * distortion, -radius, -radius * distortion * 0.3, 0);
  line(-radius * distortion * 0.3, 0, -radius * distortion, radius);
  line(radius * distortion, -radius, radius * distortion * 0.3, 0);
  line(radius * distortion * 0.3, 0, radius * distortion, radius);
  
  // Полосы
  let numBands = 5;
  strokeWeight(radius * 0.1);
  for (let i = 0; i < numBands; i++) {
    let y = map(i, 0, numBands - 1, -radius * 0.8, radius * 0.8);
    line(-radius * distortion * 0.5, y, radius * distortion * 0.5, y);
  }
  strokeWeight(1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  maxRadius = min(width, height) * 0.45;
}