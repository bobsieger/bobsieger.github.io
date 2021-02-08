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

// Tree rendering variables
let fillAlpha = 20; strokeAlpha = 40;       // Determines leaf transparency
let maxBranchAngle = 30;                    // Used with a random function
let minTrunkWidth = 9; maxTrunkWidth = 25;  // Min/max trunk size
let maxLeafWidth = 15, maxLeafHeight = 100; // Used with a random function
let leftReduce = 0.75, rightReduce = 0.75;  // Segment size reduction
let minSegment = 110,  maxSegment = 220;    // Min/max trunk lengths

// General variables
let continents, country;
let isSlider = false;
let dependencyTable, populationTable;
let afrTable, asiTable, eurTable, namTable, oceTable, samTable;
let yearSlider;
let yearStart = 1960,   yearEnd = 2017;

function preload() {
  populationTable = loadTable('../assets/population-by-continent.csv', 'csv', 'header');
  afrTable = loadTable('../assets/dependency-by-african-country.csv', 'csv', 'header');
  asiTable = loadTable('../assets/dependency-by-asian-country.csv', 'csv', 'header');
  eurTable = loadTable('../assets/dependency-by-european-country.csv', 'csv', 'header');
  namTable = loadTable('../assets/dependency-by-namerican-country.csv', 'csv', 'header');
  oceTable = loadTable('../assets/dependency-by-oceanic-country.csv', 'csv', 'header');
  samTable = loadTable('../assets/dependency-by-samerican-country.csv', 'csv', 'header');
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  // Calculate  number of trees (one per continent)
  continents = populationTable.getColumnCount() - 1;

  // Generate Slider(s)
  sliders();

  // Turn off continuous redraw and let the mouse initiate the redraw
  // (ie: from a slider value change)
  noLoop();

  // Cap lines with a long square end (ROUND/SQUARE/PROJECT) and
  // Join lines using a round (MITER/BEVEL/ROUND) style
  // strokeCap(PROJECT); strokeJoin(BEVEL);
  strokeCap(PROJECT);
  strokeJoin(ROUND);
}


function draw() {
  background('#f9f7f7');

  // Draw slider labels
  sliders();

  // Set the random seed based on the year
  // randomSeed(yearSlider.value());
  randomSeed(99);

  // Draw a tree for each continent and use -90° so that each tree points up
  for (let i = 1; i < continents + 1; i++) {

    // Set the continent data to use for this tree
    setDependencyTable(i);

    // Invoke a recursive tree function, mapping the population of each
    // continent for a given year to a minimum and maximum tree segment
    tree(i * width / (continents + 1), 0.88 * height,
      map(populationTable.getString(yearSlider.value() - 1960, i), 300000000,
        4500000000, minSegment, maxSegment), -90, maxBranchAngle);
  }
}


// Recursive tree function, given:
// xi          - Initial x value
// yi          - Initial y value
// length      - The length of the tree segment
// angle       - The angle of the tree segment
// branchAngle - The maximum angle of the next set of branches
function tree(xi, yi, length, angle, branchAngle) {
  if (length > minTrunkWidth) {
    // The length of each segment ranges from a maximum of maxSegment to a minimum
    // of 3, which will correspond to a thickness of 15 and 0 respectively
    let weight = map(length, maxSegment, minTrunkWidth, maxTrunkWidth, 0);

    // Calculate the final x,y values
    let xf = xi + cos(radians(angle)) * length;
    let yf = yi + sin(radians(angle)) * length;

    // Draw a line between initial and final x, y values
    stroke(50);
    strokeWeight(weight);
    line(xi, yi, xf, yf);

    // Randomly determine new branch angles:
    let newAngleR1 = angle - random(7, branchAngle);
    let newAngleR2 = angle + random(7, branchAngle);

    // Reduce branch length by a percentage
    let newLengthR1 = leftReduce * length;
    let newLengthR2 = rightReduce * length;

    // Recursively call the tree function for the left and right branches
    tree(xf, yf, newLengthR1, newAngleR1, branchAngle);
    tree(xf, yf, newLengthR2, newAngleR2, branchAngle);

    // Randomly add a third branch
    if (random([true, false])) {
      tree(xf, yf, newLengthR2, angle, branchAngle);
    }

  } else {
    // Draw a leaf at the end point as a fuzzy elipse
    colourLeaf(fillAlpha, strokeAlpha);
    ellipse(xi, yi + (maxLeafHeight / 6), random(5, maxLeafWidth), random(20, maxLeafHeight));
  }
}


// Determine the leaf colour based on the age dependency ratio, given:
// fAlpha - Fill alpha (transparency)
// sAlpha - Stroke alpha (transparency)
function colourLeaf(fAlpha, sAlpha) {
  // fill(random(100, 120), random(165, 185), random(130, 150), 20);
  // stroke(random(100, 120), random(165, 185), random(130, 150), 40);
  strokeWeight(0);

  // Ensure that the country column number is within bounds
  country = country < dependencyTable.getColumnCount() ? country : 1;

  // Get the corresponding dependency ratio and divide by 10
  p = parseInt(dependencyTable.getString(yearSlider.value() - 1960, country) / 5);

  switch(p) {
  case 0:  // 0%
  case 1:
  case 2:
  case 3:
  case 4:
  case 5:
  case 6:
  case 7:  // 35%
    fill(41, 106, 13, 20);
    stroke(41, 106, 13, 40);
    break;
  case 8:  // 40%
  case 9:  // 45%
    fill(60, 142, 23, fAlpha);
    stroke(60, 142, 23, sAlpha);
    break;
  case 10:  // 50%
    fill(119, 171, 12, fAlpha);
    stroke(119, 171, 12, sAlpha);
    break;
  case 11:  // 55%
    fill(186, 198, 0, fAlpha);
    stroke(186, 198, 0, sAlpha);
    break;
  case 12:  // 60%
    fill(223, 221, 25, fAlpha);
    stroke(223, 221, 25, sAlpha);
    break;
  case 13:  // 65%
    fill(250, 214, 51, fAlpha);
    stroke(250, 214, 51, sAlpha);
    break;
  case 14:  // 70%
    fill(250, 183, 51, fAlpha);
    stroke(250, 183, 51, sAlpha);
    break;
  case 15:  // 75%
    fill(255, 161, 44, fAlpha);
    stroke(255, 161, 44, sAlpha);
    break;
  case 16:  // 80%
    fill(255, 135, 44, fAlpha);
    stroke(255, 135, 44, sAlpha);
    break;
  case 17:  // 85%
    fill(254, 97, 44, fAlpha);
    stroke(254, 97, 44, sAlpha);
    break;
  default:
    fill(253, 58, 45, fAlpha);
    stroke(253, 58, 45, sAlpha);
    break;
  }

  // Increment the country column number
  country++;
}


// Set the continent dependency table to use for leaf colours and
// initialize the country code
function setDependencyTable(i) {
  switch(i) {
  case 1:
    dependencyTable = afrTable;
    break;
  case 2:
    dependencyTable = asiTable;
    break;
  case 3:
    dependencyTable = eurTable;
    break;
  case 4:
    dependencyTable = namTable;
    break;
  case 5:
    dependencyTable = oceTable;
    break;
  case 6:
    dependencyTable = samTable;
    break;
  default:
    console.log("Invalid dependency table id: " + i);
    break;
  }

  country = 1;
}


// Separate slider logic from recursive fractal tree logic
function sliders() {
  if (isSlider) {
    fill(0);

    // Label each tree with a continent name
    textAlign(CENTER);
    for (let i = 1; i < continents + 1; i++) {
      text(populationTable.columns[i], i * width / (continents + 1), 0.91 * height);
    }

    // Add slider title
    textAlign(LEFT);
    text('Age Dependency Ratio for ' + yearSlider.value(), windowWidth / 20,
      windowHeight * 0.935);

    // All slider markings
    for (let i = 1; i < (yearEnd - yearStart); i++) {
      text('+', i * windowWidth / 20, windowHeight * 0.95);
    }
  } else {
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
