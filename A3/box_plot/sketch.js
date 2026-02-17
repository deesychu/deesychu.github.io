let table;
let ratings = [];
let prices = [];

function preload() {
    table = loadTable('/A3/data/reviews_750-1250.csv', 'header');
}

let boxPlot = function(p) {
    let stats = {};
    let outliers = [];
    let margin = 100;

    p.setup = function() {
        let c = p.createCanvas(900, 450);
        c.parent('box-plot-container');

        let rows = table.getRows();
        for (let i = 0; i < rows.length; i++) {
            ratings.push(rows[i].getNum('rating'));
        }
        ratings.sort((a, b) => a - b);

        // Five-Number Summary
        stats.min = p.min(ratings);
        stats.max = p.max(ratings);
        stats.median = getPercentile(ratings, 0.5);
        stats.q1 = getPercentile(ratings, 0.25);
        stats.q3 = getPercentile(ratings, 0.75);
        
        // Outlier Logic: IQR * 1.5
        let iqr = stats.q3 - stats.q1;
        let lowerFence = stats.q1 - 1.5 * iqr;
        
        stats.whiskerMin = ratings.find(r => r >= lowerFence);
        outliers = [...new Set(ratings.filter(r => r < lowerFence))];
    };

    p.draw = function() {
        p.background(255);

        // TITLE
        p.noStroke();
        p.fill(80);
        p.textSize(22);
        p.textAlign(p.CENTER, p.TOP);
        p.text("Distribution of Product Ratings", p.width / 2, 30);

        // GRID & X-AXIS (Starting from 0)
        p.stroke(240);
        p.strokeWeight(1);
        for (let v = 0.0; v <= 5.0; v += 0.5) {
            let x = p.map(v, 0, 5, margin, p.width - margin);
            p.line(x, 80, x, 350); 
            p.noStroke();
            p.fill(120);
            p.textSize(12);
            p.textAlign(p.CENTER);
            p.text(v.toFixed(1), x, 370);
            p.stroke(240);
        }

        // MAP STATS TO PIXELS
        let xWhiskerMin = p.map(stats.whiskerMin, 0, 5, margin, p.width - margin);
        let xQ1 = p.map(stats.q1, 0, 5, margin, p.width - margin);
        let xMed = p.map(stats.median, 0, 5, margin, p.width - margin);
        let xQ3 = p.map(stats.q3, 0, 5, margin, p.width - margin);
        let xMax = p.map(stats.max, 0, 5, margin, p.width - margin);
        let y = 215;
        let bH = 100;
        let capSize = 20;

        // DRAW WHISKERS & CAPS
        p.stroke(100);
        p.strokeWeight(1.5);
        p.line(xWhiskerMin, y, xQ1, y);
        p.line(xWhiskerMin, y - capSize/2, xWhiskerMin, y + capSize/2);
        p.line(xQ3, y, xMax, y);
        p.line(xMax, y - capSize/2, xMax, y + capSize/2);

        // DRAW BOX (Clean Pink)
        p.fill(255, 182, 193); 
        p.stroke(80);
        p.strokeWeight(1.5);
        p.rect(xQ1, y - bH/2, xQ3 - xQ1, bH);

        // DRAW MEDIAN LINE (Thick)
        p.stroke(60);
        p.strokeWeight(3);
        p.line(xMed, y - bH/2, xMed, y + bH/2);

        // DRAW OUTLIER DOTS (No Jitter)
        p.noStroke();
        p.fill(255, 20, 147, 180);
        for (let o of outliers) {
            let ox = p.map(o, 0, 5, margin, p.width - margin);
            p.ellipse(ox, y, 7, 7);
            
            // Outlier Tooltip
            if (p.dist(p.mouseX, p.mouseY, ox, y) < 8) {
                p.fill(0);
                p.textAlign(p.CENTER);
                p.text(`Outlier: ${o.toFixed(1)}`, ox, y - 20);
                p.fill(255, 20, 147, 180);
            }
        }

        // SUMMARY TOOLTIPS
        if (p.mouseY > y - bH/2 && p.mouseY < y + bH/2) {
            let tooltipX = p.constrain(p.mouseX, margin, p.width-margin);
            p.fill(0);
            p.noStroke();
            p.textSize(14);
            p.textAlign(p.CENTER);
            if (p.abs(p.mouseX - xWhiskerMin) < 15) p.text(`Minimum: ${stats.whiskerMin}`, tooltipX, y - 75);
            else if (p.abs(p.mouseX - xQ1) < 15) p.text(`Q1: ${stats.q1}`, tooltipX, y - 75);
            else if (p.abs(p.mouseX - xMed) < 15) p.text(`Median/Q3/Max: 5.0`, tooltipX, y - 75);
        }
        
        p.fill(80);
        p.textSize(16);
        p.textAlign(p.CENTER);
        p.text("Review Ratings (1-5 Scale)", p.width/2, 410);
    };

    function getPercentile(data, percentile) {
        let index = (data.length - 1) * percentile;
        let lower = Math.floor(index);
        let upper = Math.ceil(index);
        let weight = index - lower;
        return data[lower] * (1 - weight) + data[upper] * weight;
    }
};

// ECDF CHART
let ecdfChart = function(p) {
    p.setup = function() {
        let c = p.createCanvas(900, 300);
        c.parent('ecdf-container');
        let rows = table.getRows();
        for (let i = 0; i < rows.length; i++) prices.push(rows[i].getNum('price_usd'));
        prices.sort((a, b) => a - b);
    };

    p.draw = function() {
        p.background(255);
        p.stroke(255, 105, 180);
        p.noFill();
        p.beginShape();
        for (let i = 0; i < prices.length; i += 10) {
            let x = p.map(prices[i], 0, 400, 100, 800);
            let y = p.map(i / prices.length, 0, 1, 250, 50);
            p.vertex(x, y);
            if (p.dist(p.mouseX, p.mouseY, x, y) < 5) {
                p.fill(0); p.noStroke();
                p.text(`$${prices[i].toFixed(2)}: ${Math.round(i/prices.length*100)}%`, x, y - 10);
                p.noFill(); p.stroke(255, 105, 180);
            }
        }
        p.endShape();
        p.fill(0); p.noStroke();
        p.textAlign(p.CENTER);
        p.text("Cumulative Price Distribution (ECDF)", p.width/2, 30);
    };
};

function setup() {
    new p5(boxPlot);
    new p5(ecdfChart);
}