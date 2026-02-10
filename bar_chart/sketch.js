let table;

function preload() {
    table = loadTable('/data/reviews_1250-end.csv', 'header');
}

let barChart = function(p) {
    let skinData = [];
    let avgValue = 0;

    p.setup = function() {
    let c = p.createCanvas(850, 500);
    c.parent('bar-chart-container');

    // Process Data & Exclude Nulls
    let counts = {};
    for (let i = 0; i < table.getRowCount(); i++) {
            let type = table.getString(i, 'skin_type');
            if (type && type !== "nan" && type !== "") {
            counts[type] = (counts[type] || 0) + 1;
        }
    }

    // Format data for sorting
    for (let type in counts) {
        skinData.push({ name: type, val: counts[type] });
    }

    // Sort Descending (Highest to Lowest)
    skinData.sort((a, b) => b.val - a.val);

    // Calculate Average
    let sum = 0;
    for (let item of skinData) {
        sum += item.val;
    }
    avgValue = sum / skinData.length;
    };

    p.draw = function() {
    p.background(255);
    
    let margin = 100;
    let topMargin = 100; 
    let w = p.width - margin * 2;
    let h = p.height - margin - topMargin;
    
    let yAxisMax = 25000; 

    // Draw Title
    p.fill(0);
    p.noStroke();
    p.textSize(22);
    p.textAlign(p.CENTER);
    p.text("Review Counts by Skin Type", p.width / 2, 50);
    
    // Draw Axes
    p.stroke(0);
    p.strokeWeight(1);
    p.line(margin, p.height - margin, p.width - margin, p.height - margin); // X Axis
    p.line(margin, topMargin, margin, p.height - margin); // Y Axis

    // Draw Y Labels
    p.textSize(12);
    p.textAlign(p.RIGHT, p.CENTER);
    for (let tickVal = 0; tickVal <= yAxisMax; tickVal += 5000) {
        let tickY = p.map(tickVal, 0, yAxisMax, p.height - margin, topMargin);

        p.stroke(0);
        p.line(margin - 5, tickY, margin, tickY);

        p.noStroke();
        p.fill(0);
        p.text(p.nfc(tickVal), margin - 10, tickY);
    }

    // Draw Bars
    let barW = w / skinData.length;
    let hoveredIndex = -1;

    for (let i = 0; i < skinData.length; i++) {
        let barH = p.map(skinData[i].val, 0, yAxisMax, 0, h);
        let x = margin + i * barW + 20;
        let y = p.height - margin - barH;
        let rectW = barW - 40;

        if (p.mouseX > x && p.mouseX < x + rectW && p.mouseY > y && p.mouseY < p.height - margin) {
            p.fill(255, 105, 180); 
            hoveredIndex = i;
        } else {
            p.fill(255, 192, 203); 
        }

    p.noStroke();
    p.rect(x, y, rectW, barH);

    // X-Axis Labels
    p.fill(0);
    p.textAlign(p.CENTER);
    p.text(skinData[i].name, x + rectW/2, p.height - margin + 20);

    // Annotation for Highest Bar
    if (i === 0) {
            p.stroke(0);
            p.line(x + rectW/2, y - 5, x + rectW/2, y - 25);
            p.noStroke();
            p.text("Most Common", x + rectW/2, y - 30);
        }
    }

    // Draw Average Line
    let avgY = p.map(avgValue, 0, yAxisMax, p.height - margin, topMargin);
    p.stroke(100);
    p.strokeWeight(2);
    p.line(margin, avgY, p.width - margin, avgY);
    
    p.noStroke();
    p.fill(100);
    p.textAlign(p.RIGHT);
    p.text("Avg: " + p.nfc(avgValue, 0), p.width - margin - 5, avgY - 10);

    // Draw Tooltip
    if (hoveredIndex !== -1) {
            p.fill(50, 50, 50, 230);
            p.rect(p.mouseX + 10, p.mouseY - 40, 110, 30, 5);
            p.fill(255);
            p.textAlign(p.LEFT);
            p.text("Count: " + p.nfc(skinData[hoveredIndex].val), p.mouseX + 20, p.mouseY - 20);
        }
    };
};

function setup() {
    new p5(barChart);
}