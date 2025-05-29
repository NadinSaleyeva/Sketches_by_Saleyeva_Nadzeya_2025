let gridSize = 20; // Размер одного "пикселя"
        let cols, rows;
        let colors;

        function setup() {
            createCanvas(450, 400);
            cols = ceil(width / gridSize);
            rows = ceil(height / gridSize);
            noStroke();
            
            // Определяем палитру цветов
            colors = [
                color(255, 87, 51),  // Красный
                color(255, 189, 51), // Оранжевый
                color(254, 246, 137), // Желтый
                color(42, 187, 155),  // Бирюзовый
                color(44, 62, 80)     // Темно-синий
            ];
        }

        function draw() {
            background(240);
            
            // Рисуем фоновые формы
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (random() < 0.1) { // 10% шанс нарисовать форму
                        let x = i * gridSize;
                        let y = j * gridSize;
                        fill(random(colors));
                        let shape = floor(random(3));
                        switch(shape) {
                            case 0: // Квадрат
                                rect(x, y, gridSize, gridSize);
                                break;
                            case 1: // Круг
                                ellipse(x + gridSize/2, y + gridSize/2, gridSize, gridSize);
                                break;
                            case 2: // Треугольник
                                triangle(x, y + gridSize, x + gridSize/2, y, x + gridSize, y + gridSize);
                                break;
                        }
                    }
                }
            }
            
            // Рисуем текст "SALEYEVA NADZEYA"
            let fontSize = min(width, height) / 9;
            let word = "SALEYEVA NADZEYA";
            textSize(fontSize);
            textAlign(CENTER, CENTER);
            textStyle(BOLD);
            
            // Создаем эффект пикселизации для текста
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    let x = i * gridSize;
                    let y = j * gridSize;
                    let c = get(x + gridSize/2, y + gridSize/2);
                    if (brightness(c) < 240) { // Если пиксель не белый (фон)
                        fill(random(colors));
                        rect(x, y, gridSize, gridSize);
                    }
                }
            }
            
            // Рисуем текст поверх для создания маски
            fill(240);
            text(word, width/2, height/2);
        }

        function windowResized() {
            resizeCanvas(windowWidth, windowHeight);
            cols = ceil(width / gridSize);
            rows = ceil(height / gridSize);
            redraw();
        }