/*
  Adapted from O CÓDIGO TRANSCENDENTE
	Cap6.3.2 ArvoreAleatoria
	by Mateus Paresqui Berruezo

  Data References:
  https://ourworldindata.org/grapher/age-dependency-ratio-of-working-age-population
  https://ourworldindata.org/grapher/population
  https://ourworldindata.org/world-region-map-definitions
*/

//jshint esversion:6

let continents;
let isSlider = false;
let populationTable;
let segmentMin = 110, segmentMax = 220;
let yearSlider;
let yearStart = 1960, yearEnd = 2017;

function preload() {
  populationTable = loadTable('../assets/population-by-continent.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize
  continents = populationTable.getColumnCount() - 1;

  // Generate Slider(s)
  sliders();

  // Turn off continuous redraw
  noLoop();

  // Cap lines with a round end (ROUND/SQUARE/PROJECT) and
  // Join lines using a round (MITER/BEVEL/ROUND) style
  // strokeCap(PROJECT); strokeJoin(BEVEL);
  strokeCap(ROUND); strokeJoin(ROUND);
}

function draw() {
  background('#f9f7f7');

  // Draw slider labels
  sliders();

  // Set the random seed based on the year
  randomSeed(yearSlider.value());

  // Draw a tree for each continent and use -90° so that each tree points up
  for (let i = 1; i < continents + 1; i++) {
    tree(i * width / (continents + 1), 0.88 * height,
      map(populationTable.getString(yearSlider.value()-1960, i), 300000000,
      4500000000, segmentMin, segmentMax), -90, 35);
  }
}

// Recursively call the tree function, providing:
// xi     - Initial x value
// yi     - Initial y value
// length - The length of the tree segment
// angle  - The angle of the tree segment
// angleBranch - The maximum angle of the next set of branches
function tree(xi, yi, length, angle, angleBranch) {
  if (length > 10) {
    // The length of each segment ranges from a maximum of segmentMax to a minimum
    // of 3, which will correspond to a thickness of 15 and 0 respectively
    stroke(50);
    strokeWeight(map(length, segmentMax, 5, 25, 0));

    // Calculate the final x,y values
    let xf = xi + cos(radians(angle)) * length;
    let yf = yi + sin(radians(angle)) * length;
    line(xi, yi, xf, yf);

    // Randomly determine new branch angles:
    let newAngleR1 = angle + random(5, angleBranch);
    let newAngleR2 = angle - random(5, angleBranch);

    // Reduce branch length by 20%
    let newLengthR1 = 0.75 * length;
    let newLengthR2 = 0.75 * length;

    // Recursively call the tree function for the left and right branches
    tree(xf, yf, newLengthR1, newAngleR1, angleBranch);
    tree(xf, yf, newLengthR2, newAngleR2, angleBranch);

    // Randomly add a third branch
    if (random([true, false])) {
      tree(xf, yf, newLengthR2, angle, angleBranch);
    }
  }
  else {
    // Draw leaves as greenish circles
    fill(random(100, 120), random(165, 185), random(130, 150), 20);
    stroke(random(100, 120), random(165, 185), random(130, 150), 40);
    strokeWeight(0);

    let radius = random(5, 25);

    ellipse(xi, yi, radius, radius);
  }
}

// Separate slider logic from recursive fractal tree logic
function sliders() {
  if (isSlider) {
    fill(0);

    // Label each tree with a continent name
    textAlign(CENTER);
    for (let i = 1; i < continents + 1; i++) {
      text(populationTable.columns[i], i * width / (continents + 1), 0.9 * height);
    }

    // Add slider title
    textAlign(LEFT);
    text('Age Dependency Ratio for ' + yearSlider.value(), windowWidth / 20,
      windowHeight * 0.935);

    // All slider markings
    for (let i = 1; i < (yearEnd - yearStart); i++) {
      text('+', i * windowWidth / 20, windowHeight * 0.95);
    }
  }
  else {
    yearSlider = createSlider(yearStart, yearEnd, yearStart, 1);
    yearSlider.position(windowWidth / 20, windowHeight * 0.95);
    yearSlider.style('width', (windowWidth * 0.9) + 'px');

    isSlider = true;
  }
}

function mouseReleased() {
  // The redraw() function makes draw() execute once
  redraw();
}
