let table;
let prices = [];

function preload() {
    table = loadTable('/A3/data/reviews_750-1250.csv', 'header');
}

let histogram = function(p) {
    let numBins = 20;
    let bins = new Array(numBins).fill(0);
    let xMax = 400;   
    let yMax = 0;
    let margin = 70;

    p.setup = function() {
        let c = p.createCanvas(900, 600);
        c.parent('histogram-container');
        
        let rows = table.getRows();
        for (let i = 0; i < rows.length; i++) {
            let pr = rows[i].getNum('price_usd');
            prices.push(pr);
            if (pr >= 0 && pr < xMax) {
                let binIdx = p.floor(p.map(pr, 0, xMax, 0, numBins - 1));
                bins[binIdx]++;
            }
        }

        yMax = p.max(bins) > 30000 ? p.max(bins) : 30000;
    };

    p.draw = function() {
        p.background(255);
        
        // --- ADD TITLE ---
        p.noStroke();
        p.fill(50);
        p.textSize(20);
        p.textAlign(p.CENTER, p.TOP);
        p.text("Distribution of Product Prices", p.width / 2, 20);

        // --- AXIS LABELS AND GRID ---
        p.fill(100);
        p.textSize(12);
        
        // Y-Axis Ticks and Grid
        p.textAlign(p.RIGHT, p.CENTER);
        for (let yVal = 0; yVal <= yMax; yVal += 5000) {
            let yPos = p.map(yVal, 0, yMax, p.height - margin, margin);
            p.stroke(245); 
            p.line(margin, yPos, p.width - margin, yPos);
            p.noStroke();
            p.text(p.nfc(yVal), margin - 15, yPos);
        }

        // X-Axis Ticks
        p.textAlign(p.CENTER, p.TOP);
        for (let xVal = 0; xVal <= xMax; xVal += 50) {
            let xPos = p.map(xVal, 0, xMax, margin, p.width - margin);
            p.text(xVal, xPos, p.height - margin + 10);
        }

        // --- ADD X AND Y AXIS TITLES ---
        p.fill(50);
        p.textSize(14);
        
        // X-Axis Label
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text("Price (USD)", p.width / 2, p.height - 10);

        // Y-Axis Label (Rotated)
        p.push();
        p.translate(20, p.height / 2);
        p.rotate(-p.HALF_PI);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("Frequency", 0, 0);
        p.pop();

        // --- BARS ---
        let binWidth = (p.width - 2 * margin) / numBins;
        
        for (let i = 0; i < bins.length; i++) {
            let h = p.map(bins[i], 0, yMax, 0, p.height - 2 * margin);
            let x = margin + i * binWidth;
            let y = p.height - margin - h;

            p.noStroke();
            p.fill(255, 192, 203); 
            p.rect(x, y, binWidth - 1, h);

            // TOOLTIP
            if (p.mouseX > x && p.mouseX < x + binWidth && p.mouseY > y && p.mouseY < p.height - margin) {
                p.fill(0);
                p.textAlign(p.CENTER);
                p.text(`Count: ${bins[i]}`, x + binWidth/2, y - 10);
                p.fill(255, 105, 180, 100); 
                p.rect(x, y, binWidth - 1, h);
            }
        }

        // --- TREND LINE ---
        p.noFill();
        p.stroke(255, 20, 147); 
        p.strokeWeight(3);
        p.beginShape();
        for (let i = 0; i < bins.length; i++) {
            let h = p.map(bins[i], 0, yMax, 0, p.height - 2 * margin);
            let px = margin + i * binWidth + binWidth/2;
            let py = p.height - margin - h;
            if (i === 0) p.curveVertex(px, py);
            p.curveVertex(px, py);
            if (i === bins.length - 1) p.curveVertex(px, py);
        }
        p.endShape();
    };
};

function setup() {
    new p5(histogram);
    new p5(ecdfChart);
}