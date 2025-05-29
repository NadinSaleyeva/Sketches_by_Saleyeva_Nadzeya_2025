let dnaRotation = 0;

        function setup() {
            createCanvas(450, 400);
            noStroke();
        }

        function draw() {
            background(0, 0, 0, 20); // Полупрозрачный для эффекта шлейфа
            
            // Центр экрана
            const centerX = width / 2;
            const centerY = height / 2;
            
            // Параметры ДНК (адаптивные к размеру экрана)
            const dnaLength = min(width, height) * 0.8;
            const segments = 40;
            const spiralRadius = min(width, height) * 0.2;
            
            // Неоновые цвета
            const blue = color(30, 150, 255);
            const pink = color(255, 50, 150);
            const white = color(255);
            
            // Эффект свечения
            drawingContext.shadowBlur = 20;
            
            // Медленное вращение
            dnaRotation += 0.002;
            
            // Рисуем ДНК
            push();
            translate(centerX, centerY);
            rotate(dnaRotation);
            
            // Спирали ДНК
            for (let i = 0; i < segments; i++) {
                const y = map(i, 0, segments-1, -dnaLength/2, dnaLength/2);
                const angle = map(i, 0, segments-1, 0, TWO_PI * 3);
                
                // Левая спираль
                const x1 = -spiralRadius * cos(angle);
                drawingContext.shadowColor = blue;
                fill(blue);
                ellipse(x1, y, 15, 15);
                
                // Правая спираль
                const x2 = spiralRadius * cos(angle);
                drawingContext.shadowColor = pink;
                fill(pink);
                ellipse(x2, y, 15, 15);
                
                // Соединения между спиралями
                if (i % 2 === 0) {
                    drawingContext.shadowColor = white;
                    stroke(white);
                    strokeWeight(1.5);
                    line(x1, y, x2, y);
                    noStroke();
                }
            }
            pop();
            
            // Центральная ось
            drawingContext.shadowColor = white;
            stroke(white);
            strokeWeight(1);
            line(centerX, centerY - dnaLength/2 - 30, centerX, centerY + dnaLength/2 + 30);
        }

        function windowResized() {
            resizeCanvas(windowWidth, windowHeight);
        }