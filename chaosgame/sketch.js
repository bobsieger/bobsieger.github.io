// The Chaos Game
// https://en.wikipedia.org/wiki/Chaos_game

// Daniel Shiffman
// Part 1: https://youtu.be/7gNzMtYo9n4
// https://thecodingtrain.com/CodingChallenges/123.1-chaos-game
// Part 2: https://youtu.be/A0NHGTggoOQ
// https://thecodingtrain.com/CodingChallenges/123.2-chaos-game

//jshint esversion:6

const N = 20;               // Number of vertex control points in the points array

let colours = [];          // Array of vertex colours
let current, next;         // Current and next
// let percent = 0.618033989; // lerp percentage
let percent = 0.5; // lerp percentage
let points = [];           // Array of fixed vertex control points

let minSegment = 35,  maxSegment = 145;     // Min/max trunk lengths

// General variables
let afrTable, asiTable, eurTable, namTable, oceTable, samTable;
let c1, c2;
let continents, country;
let currentTable, dependencyTable, populationTable;
let isSlider = false;
let legend;
let xOffset = [];
let yearSlider;
let yearStart = 1960, yearEnd = 2017;

function preload() {
  asclepius = loadImage('../assets/asclepius1.png');
  legend = loadImage('../assets/legend.png');
  dependencyTable = loadTable('../assets/dependency-by-continent.csv', 'csv', 'header');
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

  // Set background colours
  c1 = color(36, 63, 255);
  c2 = color (255, 144, 34);

  // Calculate number of trees (one per continent)
  continents = populationTable.getColumnCount() - 2;

  // Generate Slider(s)
  labels();

  // Specify tree x offset positions (currently equal spacing)
  xOffset[0] = 4 * width / (continents + 1);  // Asia
  xOffset[1] = 6 * width / (continents + 1);  // Africa
  xOffset[2] = 3 * width / (continents + 1);  // Europe
  xOffset[3] = 1 * width / (continents + 1);  // North America
  xOffset[4] = 5 * width / (continents + 1);  // Oceana
  xOffset[5] = 2 * width / (continents + 1);  // South America

  // Create N equidistant vertex control points in a circle
  for (let i = 0; i < N; i++) {
    let angle = (i * TWO_PI) / N + HALF_PI;

    // Set the size of the fractal
    let v = p5.Vector.fromAngle(angle, width / 16);

    // Set the position of the fractal midpoint
    v.add(4 * width / (continents + 1), height / 2);

    // Add to points array
    points.push(v);
  }
  /*
  let v = p5.Vector.fromAngle(radians(-120), width / 12);
  v.add(4 * width / (continents + 1), height / 2); points.push(v);
  v = p5.Vector.fromAngle(radians(-60), width / 12);
  v.add(4 * width / (continents + 1), height / 2); points.push(v);
  v = p5.Vector.fromAngle(radians(90), width / 6);
  v.add(4 * width / (continents + 1), height / 2); points.push(v);
  */

  // Select a current point
  current = createVector(width / 2, height / 2);

  // Draw labels, sliders, and background
  labels();

  // Set the random seed based on the year
  // randomSeed(yearSlider.value());
  randomSeed(99);
}

function draw() {

  // Draw a tree for each continent and use -90° so that each tree points up
  for (let i = 0; i < continents; i++) {

    // Set the continent data to use for this tree
    setCurrentTable(i);

    // Add Rods of Asclepius
    drawRod(i);
  }

  for (let i = 0; i < 1000; i++) {
    next = floor(random(N));
    current = p5.Vector.lerp(current, points[next], percent);
    setColour();
    point(current.x, current.y);
  }
}


// Determine the colour based on the age dependency ratio
function setColour() {

  // Ensure that the country column number is within bounds
  country = country < currentTable.getColumnCount() ? country : 1;

  // Get the corresponding dependency ratio (percentage) as an integer
  let p = parseInt(currentTable.getString(yearSlider.value() - 1960, country));

  // The lower the dependency, the greener the tree
  switch(true) {
    case p < 35:
      stroke(41, 106, 13);
      break;
    case p < 45:
      stroke(60, 142, 23);
      break;
    case p < 50:
      stroke(119, 171, 12);
      break;
    case p < 55:
      stroke(186, 198, 0);
      break;
    case p < 60:
      stroke(223, 221, 25);
      break;
    case p < 65:
      stroke(250, 214, 51);
      break;
    case p < 70:
      stroke(250, 183, 51);
      break;
    case p < 75:
      stroke(255, 161, 44);
      break;
    case p < 80:
      stroke(255, 135, 44);
      break;
    case p < 85:
      stroke(254, 97, 44);
      break;
    default:
      stroke(253, 58, 45);
      break;
  }

  // Increment the country column number
  country++;
}


// Draw Rod of Asclepius
function drawRod(i) {

  // Base height and width on the population of the continent
  let rodHeight = map(populationTable.getString(yearSlider.value() - 1960, i + 1), 16000000,
    4500000000, 5 * minSegment, 5 * maxSegment);
  let rodWidth = asclepius.width * rodHeight / asclepius.height;

  // Get the dependency percentage and transparency base
  let p = dependencyTable.getString(yearSlider.value() - 1960, i + 1);
  let t = 40;

  // Base the tint and transparency on the population dependency
  switch(true) {
    case p < 52:
      tint(41, 106, 13, t * 1);
      break;
    case p < 70:
      tint(119, 171, 12, t * 2);
      break;
    case p < 70:
      tint(223, 221, 25, t * 3);
      break;
    case p < 80:
      tint(250, 183, 51, t * 4);
      break;
    case p < 90:
      tint(255, 135, 44, t * 5);
      break;
    default:
      tint(253, 58, 45);
      break;
  }

  image(asclepius, xOffset[i] - rodWidth / 2, height * 0.88 - rodHeight, rodWidth, rodHeight);
  tint(255, 255);
}


// Set the continent dependency table to use for leaf colours and
// initialize the country code
function setCurrentTable(i) {
  switch(i) {
    case 0:
      currentTable = asiTable;
      break;
    case 1:
      currentTable = afrTable;
      break;
    case 2:
      currentTable = eurTable;
      break;
    case 3:
      currentTable = namTable;
      break;
    case 4:
      currentTable = oceTable;
      break;
    case 5:
      currentTable = samTable;
      break;
    default:
      console.log("Invalid dependency table id: " + i);
      break;
  }

  country = 1;
}


// Separate slider & text logic from recursive fractal tree logic
function labels() {

  // If sliders have already been defined
  if (isSlider) {
    // Add a top to bottom gradient background
    strokeWeight(1);
    for (let i = 0; i < height; i++) {
      stroke(lerpColor(c1, c2, i / float(height)));
      line(0, i, width, i);
    }

    // Add a legend
    fill(0);
    image(legend, 0, 0.05 * height);

    // Label each tree with a continent name
    textAlign(CENTER); textSize(16); textStyle(BOLD);
    for (let i = 0; i < continents; i++) {
      text(populationTable.columns[i + 1], xOffset[i], 0.91 * height);
    }

    // Add slider title
    textAlign(LEFT); textSize(12);
    text('Age Dependency Ratio for ' + yearSlider.value(), width / 20,
      height * 0.93);

    // All slider markings
    fill('#0274FF'); textAlign(CENTER); textSize(10); textStyle(ITALIC);
    for (let i = 1; i < 20; i++) {
      text(yearStart + 3 * (i - 1), i * width / 20, height * 0.95);
    }
  } else {

    // First call only defines sliders
    yearSlider = createSlider(yearStart, yearEnd, yearStart, 1);
    yearSlider.position(width / 20, height * 0.95);
    yearSlider.style('width', (width * 0.9) + 'px');

    isSlider = true;
  }
}


function mouseReleased() {
  // The redraw() function makes draw() execute once
  labels();
  redraw();
}