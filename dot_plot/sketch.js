let table;

function preload() {
    table = loadTable('/data/reviews_1250-end.csv', 'header');
}

// Dot Plot
let dotPlot = function(p) {
    let brandData = [];
    let minRating = 0;
    let maxRating = 0;

    p.setup = function() {
    let c = p.createCanvas(900, 600);
    c.parent('dot-plot-container');

    // Calculate average rating per brand
    let brandRatings = {};
    
    for (let i = 0; i < table.getRowCount(); i++) {
        let brand = table.getString(i, 'brand_name');
        let rating = table.getNum(i, 'rating');

        // Skip if brand or rating is missing/invalid
        if (brand && brand !== "nan" && brand !== "" && !isNaN(rating)) {
            if (!brandRatings[brand]) {
                brandRatings[brand] = { total: 0, count: 0 };
            }
            brandRatings[brand].total += rating;
            brandRatings[brand].count += 1;
        }
    }

    // Calculate averages and format data
    for (let brand in brandRatings) {
        let avg = brandRatings[brand].total / brandRatings[brand].count;
        brandData.push({ 
            name: brand, 
            avgRating: avg,
            reviewCount: brandRatings[brand].count 
        });
    }

    // Sort by review count and get top 10
    brandData.sort((a, b) => b.reviewCount - a.reviewCount);
    brandData = brandData.slice(0, 10);

    brandData.sort((a, b) => b.avgRating - a.avgRating);

    minRating = Math.min(...brandData.map(d => d.avgRating));
    maxRating = Math.max(...brandData.map(d => d.avgRating));
    };

    p.draw = function() {
    p.background(255);
    
    let leftMargin = 180;   
    let rightMargin = 100;
    let topMargin = 100;
    let bottomMargin = 80;
    
    let w = p.width - leftMargin - rightMargin;
    let h = p.height - topMargin - bottomMargin;
    
    let dotSpacing = h / (brandData.length + 1);
    
    // Draw Title
    p.fill(0);
    p.noStroke();
    p.textSize(24);
    p.textAlign(p.CENTER);
    p.text("Dot Plot - Average Rating by Top 10 Brands", p.width / 2, 50);
    
    // Draw X-Axis
    p.stroke(0);
    p.strokeWeight(2);
    p.line(leftMargin, p.height - bottomMargin, p.width - rightMargin, p.height - bottomMargin);
    
    // Draw X-Axis Label
    p.fill(0);
    p.noStroke();
    p.textSize(14);
    p.textAlign(p.CENTER);
    p.text("Avg. Rating", p.width / 2, p.height - bottomMargin + 40);
    
    // Draw Y-Axis Label
    p.push();
    p.translate(40, p.height / 2);
    p.rotate(-p.PI / 2);
    p.textAlign(p.CENTER);
    p.text("Brand Name", 0, 0);
    p.pop();
    
    // Draw X-Axis Tick Marks and Labels
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    let xAxisMin = Math.floor(minRating * 10) / 10; 
    let xAxisMax = Math.ceil(maxRating * 10) / 10; 
    
    for (let rating = xAxisMin; rating <= xAxisMax; rating += 0.05) {
        let x = p.map(rating, xAxisMin, xAxisMax, leftMargin, p.width - rightMargin);

        p.stroke(0);
        p.line(x, p.height - bottomMargin, x, p.height - bottomMargin + 5);

        p.noStroke();
        p.fill(0);
        if (Math.abs(rating - Math.round(rating * 10) / 10) < 0.001) {
            p.text(rating.toFixed(2), x, p.height - bottomMargin + 10);
        }
    }
    
    let hoveredIndex = -1;
    
    // Draw Dots and Brand Labels
    for (let i = 0; i < brandData.length; i++) {
        let y = topMargin + (i + 1) * dotSpacing;
        let x = p.map(brandData[i].avgRating, xAxisMin, xAxisMax, leftMargin, p.width - rightMargin);

        p.fill(0);
        p.noStroke();
        p.textSize(13);
        p.textAlign(p.RIGHT, p.CENTER);
        p.text(brandData[i].name, leftMargin - 10, y);

        let d = p.dist(p.mouseX, p.mouseY, x, y);
        if (d < 15) {
            hoveredIndex = i;
        }

        // Draw the dot
        if (d < 15) {
            p.fill(255, 69, 132);
        } else {
            p.fill(229, 115, 155);
        }
        p.noStroke();
        p.circle(x, y, 20);
    }
    
    // Average Line
    let totalRating = 0;
    for (let i = 0; i < brandData.length; i++) {
        totalRating += brandData[i].avgRating;
    }
    let avgRating = totalRating / brandData.length;
    
    let avgX = p.map(avgRating, xAxisMin, xAxisMax, leftMargin, p.width - rightMargin);
    p.stroke(100, 100, 100, 150);
    p.strokeWeight(2);
    p.line(avgX, topMargin, avgX, p.height - bottomMargin);
    
    p.noStroke();
    p.fill(100);
    p.textSize(12);
    p.textAlign(p.CENTER);
    p.text("Avg: " + avgRating.toFixed(2), avgX, topMargin - 10);
    
    // Tooltip
    if (hoveredIndex !== -1) {
        let tooltipX = p.mouseX + 15;
        let tooltipY = p.mouseY - 50;

        if (tooltipX + 160 > p.width) tooltipX = p.mouseX - 175;
        if (tooltipY < 0) tooltipY = p.mouseY + 20;

        p.fill(50, 50, 50, 240);
        p.noStroke();
        p.rect(tooltipX, tooltipY, 160, 50, 5);

        p.fill(255);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(12);
        p.text("Brand: " + brandData[hoveredIndex].name, tooltipX + 10, tooltipY + 8);
        p.text("Avg Rating: " + brandData[hoveredIndex].avgRating.toFixed(2) + "", tooltipX + 10, tooltipY + 24);
    }
    };
};

function setup() {
    new p5(dotPlot);
}