let table;

function preload() {
    table = loadTable('/A2/data/reviews_1250-end.csv', 'header');
}

// Heatmap
let heatMap = function(p) {
    let heatmapData = [];
    let skinTones = [];
    let eyeColors = [];
    let maxCount = 0;

    p.setup = function() {
        let c = p.createCanvas(1000, 600);
        c.parent('heatmap-container');

        // Count combinations of skin_tone and eye_color
        let combinations = {};
    
        for (let i = 0; i < table.getRowCount(); i++) {
        let skinTone = table.getString(i, 'skin_tone');
        let eyeColor = table.getString(i, 'eye_color');
        
        // Skip if data is missing, null, or "NotSure"
        if (skinTone && skinTone !== "nan" && skinTone !== "" && skinTone !== "notSureST" &&
            eyeColor && eyeColor !== "nan" && eyeColor !== "" && eyeColor !== "notSureST") {
            
            let key = skinTone + "|" + eyeColor;
            combinations[key] = (combinations[key] || 0) + 1;
        }
        }

        // Get unique skin tones and eye colors
        let skinToneSet = new Set();
        let eyeColorSet = new Set();
        
        for (let key in combinations) {
        let parts = key.split("|");
        skinToneSet.add(parts[0]);
        eyeColorSet.add(parts[1]);
        }
        
        skinTones = Array.from(skinToneSet).sort();
        eyeColors = Array.from(eyeColorSet).sort();
        
        // Create 2D array for heatmap
        for (let i = 0; i < skinTones.length; i++) {
        heatmapData[i] = [];
        for (let j = 0; j < eyeColors.length; j++) {
            let key = skinTones[i] + "|" + eyeColors[j];
            let count = combinations[key] || 0;
            heatmapData[i][j] = count;
            
            if (count > maxCount) {
            maxCount = count;
            }
        }
        }
    };

    p.draw = function() {
        p.background(255);
        
        let leftMargin = 120;
        let rightMargin = 200;
        let topMargin = 120;
        let bottomMargin = 50;
        
        let gridWidth = p.width - leftMargin - rightMargin;
        let gridHeight = p.height - topMargin - bottomMargin;
        
        let cellWidth = gridWidth / eyeColors.length;
        let cellHeight = gridHeight / skinTones.length;
        
        // Draw Title
        p.fill(0);
        p.noStroke();
        p.textSize(24);
        p.textAlign(p.CENTER);
        p.text("Heatmap - Skin Tone and Eye Color", p.width / 2, 40);
        
        // Draw Eye Color labels (top)
        p.textSize(13);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.fill(0);
        for (let j = 0; j < eyeColors.length; j++) {
        let x = leftMargin + j * cellWidth + cellWidth / 2;
        p.text(eyeColors[j], x, topMargin - 10);
        }
        
        // Draw "Eye Color" label
        p.textSize(14);
        p.textAlign(p.CENTER);
        p.text("Eye Color", p.width / 2 - rightMargin / 2, topMargin - 40);
        
        // Draw Skin Tone labels (left)
        p.textSize(13);
        p.textAlign(p.RIGHT, p.CENTER);
        for (let i = 0; i < skinTones.length; i++) {
        let y = topMargin + i * cellHeight + cellHeight / 2;
        p.text(skinTones[i], leftMargin - 10, y);
        }
        
        // Draw "Skin Tone" label
        p.push();
        p.translate(30, p.height / 2 - bottomMargin / 2);
        p.rotate(-p.PI / 2);
        p.textSize(14);
        p.textAlign(p.CENTER);
        p.text("Skin Tone", 0, 0);
        p.pop();
        
        let hoveredRow = -1;
        let hoveredCol = -1;
        
        // Draw heatmap cells
        for (let i = 0; i < skinTones.length; i++) {
        for (let j = 0; j < eyeColors.length; j++) {
            let x = leftMargin + j * cellWidth;
            let y = topMargin + i * cellHeight;
            
            if (p.mouseX > x && p.mouseX < x + cellWidth &&
                p.mouseY > y && p.mouseY < y + cellHeight) {
            hoveredRow = i;
            hoveredCol = j;
            }
            
            let count = heatmapData[i][j];
            if (count === 0) {
            p.fill(255);
            } else {
            let intensity = p.map(count, 0, maxCount, 255, 80);
            p.fill(intensity, 120, 155);
            }
            
            p.stroke(200);
            p.strokeWeight(1);
            p.rect(x, y, cellWidth, cellHeight);
        }
        }
        
        // Draw Legend
        let legendX = p.width - rightMargin + 20;
        let legendY = topMargin;
        let legendWidth = 30;
        let legendHeight = 200;
        
        p.textSize(13);
        p.textAlign(p.LEFT, p.CENTER);
        p.fill(0);
        p.text("CNT(reviews_1250-en...", legendX, legendY - 30);
        
        // Draw gradient legend
        for (let i = 0; i <= legendHeight; i++) {
        let value = p.map(i, 0, legendHeight, maxCount, 0);
        let intensity = p.map(value, 0, maxCount, 255, 80);
        p.stroke(intensity, 120, 155);
        p.line(legendX, legendY + i, legendX + legendWidth, legendY + i);
        }
        
        p.noFill();
        p.stroke(0);
        p.strokeWeight(1);
        p.rect(legendX, legendY, legendWidth, legendHeight);
        
        p.noStroke();
        p.fill(0);
        p.textAlign(p.LEFT, p.CENTER);
        p.text(p.nfc(Math.round(maxCount)), legendX + legendWidth + 5, legendY);
        p.text("1", legendX + legendWidth + 5, legendY + legendHeight);
        
        // Draw Tooltip
        if (hoveredRow !== -1 && hoveredCol !== -1) {
        let count = heatmapData[hoveredRow][hoveredCol];
        let tooltipX = p.mouseX + 15;
        let tooltipY = p.mouseY - 60;
        
        if (tooltipX + 200 > p.width) tooltipX = p.mouseX - 215;
        if (tooltipY < 0) tooltipY = p.mouseY + 20;
        
        p.fill(50, 50, 50, 240);
        p.noStroke();
        p.rect(tooltipX, tooltipY, 200, 60, 5);
        
        p.fill(255);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(12);
        p.text("Skin Tone: " + skinTones[hoveredRow], tooltipX + 10, tooltipY + 8);
        p.text("Eye Color: " + eyeColors[hoveredCol], tooltipX + 10, tooltipY + 24);
        p.text("Count: " + p.nfc(count), tooltipX + 10, tooltipY + 40);
        }
    };
};


function setup() {
    new p5(heatMap);
}