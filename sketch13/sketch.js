// sketch.js
new p5((p) => {
    const dnaSymbols = ['A', 'T', 'G', 'C'];
    let drops = [];
    let connectLines = [];
    
    p.setup = function() {
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.position(0, 0);
        p.colorMode(p.HSB, 360, 100, 100, 1);
        p.textAlign(p.CENTER, p.CENTER);
        
        // Create initial drops
        for (let i = 0; i < 100; i++) {
            createDrop();
        }
        
        // Create connection lines
        for (let i = 0; i < 30; i++) {
            connectLines.push({
                x1: p.random(p.width),
                y1: p.random(p.height),
                x2: p.random(p.width),
                y2: p.random(p.height),
                alpha: p.random(0.9, 0.9),
                weight: p.random(0.2, 0.2)
            });
        }
    };
    
    function createDrop() {
        drops.push({
            x: p.random(p.width),
            y: p.random(-100, -10),
            symbol: dnaSymbols[Math.floor(p.random(4))],
            speed: p.random(2, 80),
            size: p.random(12, 240),
            alpha: p.random(0.6, 1),
            hue: p.random([0, 120, 240, 60]),
            rotation: p.random(-0.1, 0.1)
        });
    }
    
    p.draw = function() {
        p.background(230, 15, 15, 0.1);
        
        // Draw connection lines
        p.push();
        for (let line of connectLines) {
            p.stroke(180, 70, 90, line.alpha);
            p.strokeWeight(line.weight);
            p.line(line.x1, line.y1, line.x2, line.y2);
            
            // Slowly move line points
            line.x1 += p.random(-0.5, 0.5);
            line.y1 += p.random(-0.5, 0.5);
            line.x2 += p.random(-0.5, 0.5);
            line.y2 += p.random(-0.5, 0.5);
            
            // Keep lines inside bounds
            line.x1 = p.constrain(line.x1, 0, p.width);
            line.y1 = p.constrain(line.y1, 0, p.height);
            line.x2 = p.constrain(line.x2, 0, p.width);
            line.y2 = p.constrain(line.y2, 0, p.height);
        }
        p.pop();
        
        // Draw and update DNA symbols
        for (let i = drops.length - 1; i >= 0; i--) {
            const drop = drops[i];
            
            // Draw symbol
            p.push();
            p.translate(drop.x, drop.y);
            p.rotate(drop.rotation);
            p.noStroke();
            p.fill(drop.hue, 80, 95, drop.alpha);
            p.textSize(drop.size);
            p.text(drop.symbol, 0, 0);
            p.pop();
            
            // Update position
            drop.y += drop.speed;
            drop.rotation += 0.01;
            
            // Remove if off-screen and add new one
            if (drop.y > p.height + 10) {
                drops.splice(i, 1);
                createDrop();
            }
        }
        
        // Occasionally create connections between nearby symbols
        if (p.frameCount % 5 === 0) {
            for (let i = 0; i < drops.length; i++) {
                for (let j = i + 1; j < drops.length; j++) {
                    const d1 = drops[i];
                    const d2 = drops[j];
                    const distance = p.dist(d1.x, d1.y, d2.x, d2.y);
                    
                    if (distance < 100 && p.random() < 0.05) {
                        p.stroke(60, 80, 90, 0.2);
                        p.line(d1.x, d1.y, d2.x, d2.y);
                    }
                }
            }
        }
    };
    
    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        
        // Update connection lines bounds
        for (let line of connectLines) {
            line.x1 = p.constrain(line.x1, 0, p.width);
            line.y1 = p.constrain(line.y1, 0, p.height);
            line.x2 = p.constrain(line.x2, 0, p.width);
            line.y2 = p.constrain(line.y2, 0, p.height);
        }
    };
    
    p.mousePressed = function() {
        // Add a new drop at mouse position
        drops.push({
            x: p.mouseX,
            y: p.mouseY,
            symbol: dnaSymbols[Math.floor(p.random(4))],
            speed: p.random(2, 6),
            size: p.random(18, 36),
            alpha: 1,
            hue: p.random([0, 120, 240, 60]),
            rotation: p.random(-0.1, 0.1)
        });
    };
});