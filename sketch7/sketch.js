let gridSize = 40; // Размер одного "пикселя"
let cols, rows;
let currentPixel = 0; // Текущий пиксель для отрисовки
let totalPixels; // Общее количество пикселей
let pixelData = []; // Массив для хранения данных о каждом пикселе

function setup() {
    createCanvas(450, 400);
    cols = ceil(width / gridSize);
    rows = ceil(height / gridSize);
    totalPixels = cols * rows;
    noStroke();
    
    // Предварительно генерируем данные для всех пикселей
    generatePixelData();
    
    // Устанавливаем скорость появления пикселей (в миллисекундах)
    frameRate(30); // 30 FPS для плавной анимации
}

function generatePixelData() {
    pixelData = [];
    for (let i = 0; i < totalPixels; i++) {
        let col = i % cols;
        let row = floor(i / cols);
        let x = col * gridSize;
        let y = row * gridSize;
        
        let shape = floor(random(4));
        let c = color(random(255), random(255), random(255));
        
        pixelData.push({
            x: x,
            y: y,
            shape: shape,
            color: c
        });
    }
}

function draw() {
    background(220);
    
    // Отрисовываем все пиксели до текущего
    for (let i = 0; i <= currentPixel && i < totalPixels; i++) {
        let pixel = pixelData[i];
        fill(pixel.color);
        
        switch(pixel.shape) {
            case 0: // Квадрат
                rect(pixel.x, pixel.y, gridSize, gridSize);
                break;
            case 1: // Круг
                ellipse(pixel.x + gridSize/2, pixel.y + gridSize/2, gridSize, gridSize);
                break;
            case 2: // Треугольник
                triangle(pixel.x, pixel.y + gridSize, 
                        pixel.x + gridSize/2, pixel.y, 
                        pixel.x + gridSize, pixel.y + gridSize);
                break;
            case 3: // Ромб
                quad(pixel.x + gridSize/2, pixel.y, 
                     pixel.x + gridSize, pixel.y + gridSize/2, 
                     pixel.x + gridSize/2, pixel.y + gridSize, 
                     pixel.x, pixel.y + gridSize/2);
                break;
        }
    }
    
    // Переходим к следующему пикселю каждые несколько кадров
    if (frameCount % 2 === 0 && currentPixel < totalPixels - 1) { // Каждые 2 кадра
        currentPixel++;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    cols = ceil(width / gridSize);
    rows = ceil(height / gridSize);
    totalPixels = cols * rows;
    currentPixel = 0;
    generatePixelData();
}

// Функция для перезапуска анимации
function mousePressed() {
    currentPixel = 0;
    generatePixelData();
}
