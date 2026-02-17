let table;
let feedbackData = [];

function preload() {
    table = loadTable('/A3/data/reviews_750-1250.csv', 'header');
}

let stripPlot = function(p) {
    let marginL = 100;
    let marginOthers = 80;
    let yMax = 400;

    p.setup = function() {
        let c = p.createCanvas(500, 700);
        c.parent('strip-plot-container');

        let rows = table.getRows();
        for (let i = 0; i < rows.length; i++) {
            feedbackData.push(rows[i].getNum('total_feedback_count'));
        }
        feedbackData.sort((a, b) => a - b);
    };

    p.draw = function() {
        p.background(255);

        // TITLE
        p.noStroke();
        p.fill(80);
        p.textSize(20);
        p.textAlign(p.CENTER, p.TOP);
        p.text("Distribution of Review Feedback", p.width / 2, 20);

        // Y-AXIS LABEL
        p.push();
        p.translate(35, p.height / 2);
        p.rotate(-p.HALF_PI);
        p.fill(50);
        p.textSize(16);
        p.textAlign(p.CENTER);
        p.text("Total Feedback Count", 0, 0);
        p.pop();

        // GRID & Y-AXIS TICKS 
        p.stroke(240);
        p.strokeWeight(1);
        p.textSize(12);
        for (let v = 0; v <= yMax; v += 100) {
            let y = p.map(v, 0, yMax, p.height - marginOthers, marginOthers);
            p.line(marginL, y, p.width - marginOthers, y); 
            
            p.noStroke();
            p.fill(120);
            p.textAlign(p.RIGHT, p.CENTER);
            p.text(v, marginL - 10, y);
            p.stroke(240);
        }

        // DRAW JITTERED POINTS
        p.noStroke();
        p.fill(255, 105, 180, 60);
        p.randomSeed(42); 

        for (let i = 0; i < feedbackData.length; i += 20) { 
            let val = feedbackData[i];
            if (val <= yMax) {
                let yPos = p.map(val, 0, yMax, p.height - marginOthers, marginOthers);
                let centerX = marginL + (p.width - marginL - marginOthers) / 2;
                let xJitter = centerX + p.random(-50, 50);
                
                p.ellipse(xJitter, yPos, 4, 4);

                // Tooltip logic for points
                if (p.dist(p.mouseX, p.mouseY, xJitter, yPos) < 5) {
                    p.fill(0);
                    p.textAlign(p.LEFT);
                    p.text(`Count: ${val}`, p.mouseX + 10, p.mouseY);
                    p.fill(255, 105, 180, 60);
                }
            }
        }

        // ECDF LINE OVERLAY
        p.noFill();
        p.stroke(0, 100, 255, 150);
        p.strokeWeight(2);
        p.beginShape();
        for (let i = 0; i < feedbackData.length; i += 100) {
            let val = feedbackData[i];
            if (val <= yMax) {
                let yPos = p.map(val, 0, yMax, p.height - marginOthers, marginOthers);
                let xPos = p.map(i / feedbackData.length, 0, 1, marginL, p.width - marginOthers);
                p.vertex(xPos, yPos);
            }
        }
        p.endShape();

        // Label for the ECDF line
        p.noStroke();
        p.fill(0, 100, 255);
        p.textSize(12);
        p.textAlign(p.CENTER);
        p.text("EDCF", p.width/2, p.height - 40);
    };
};

function setup() {
    new p5(stripPlot);
}