// The Chaos Game
// https://en.wikipedia.org/wiki/Chaos_game

// Daniel Shiffman
// Part 1: https://youtu.be/7gNzMtYo9n4
// https://thecodingtrain.com/CodingChallenges/123.1-chaos-game
// Part 2: https://youtu.be/A0NHGTggoOQ
// https://thecodingtrain.com/CodingChallenges/123.2-chaos-game

//jshint esversion:6

const N = 15;                         // Number of vertex control points in the points array

let current = [], next, prev = 0;     // Current, next, and previous random point
let percent = 0.5;                    // lerp percentage
let points = [];                      // Array of fixed vertex control points

let minHeight = 35,  maxHeight = 180; // Min/max fractal height

// General variables
let afrTable, asiTable, eurTable, namTable, oceTable, samTable;
let c1, c2;
let continents, country;
let currentTable, dependencyTable, populationTable;
let icons = [];
let isSlider = false;
let legend;
let midPoint, scale;
let xOffset = [];
let yearSlider;
let yearStart = 1960, yearEnd = 2017;

// Load dependency data tables
function preload() {
  icons[0] = loadImage('../assets/icon0.png');  // Asia
  icons[1] = loadImage('../assets/icon5.png');  // Africa
  icons[2] = loadImage('../assets/icon2.png');  // Europe
  icons[3] = loadImage('../assets/icon3.png');  // North America
  icons[4] = loadImage('../assets/icon4.png');  // Oceana
  icons[5] = loadImage('../assets/icon5.png');  // South America
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

  // Original work was on a 969 high pixel display
  scale = height / 969.0;

  // Set background colours
  c1 = color(0, 60, 129);
  c2 = color (113, 207, 250);

  // Calculate number of icons (one per continent)
  continents = populationTable.getColumnCount() - 2;

  // Generate Slider(s)
  labels();

  // Specify icon x offset and fractal y midPoint positions
  let spacing = width * 0.81 / (continents - 1);
  xOffset[0] = width * 0.1 + 3 * spacing;  // Asia
  xOffset[1] = width * 0.1 + 5 * spacing;  // Africa
  xOffset[2] = width * 0.1 + 2 * spacing;  // Europe
  xOffset[3] = width * 0.11111;            // North America
  xOffset[4] = width * 0.1 + 4 * spacing;  // Oceana
  xOffset[5] = width * 0.1 + 1 * spacing;  // South America

  midPoint = height / 4;

  // Create N equidistant vertex control points in a circle for each continent
  setPoints();

  // Draw labels, sliders, and background
  labels();
}


function draw() {

  // Draw a icon for each continent
  for (let i = 0; i < continents; i++) {

    // Set the continent data to use for this icon
    setCurrentTable(i);

    // Add a representative icon
    drawIcon(i);

    for (let j = 0; j < 1000; j++) {
      next = floor(random(N));
      while (next == prev) {
        next = floor(random(N));
      }
      current[i] = p5.Vector.lerp(current[i], points[i][next], percent);
      setColour();
      point(current[i].x, current[i].y);

      prev = next;
    }
  }
}


// Determine the colour based on the age dependency ratio
function setColour() {

  // Ensure that the country column number is within bounds
  country = country < currentTable.getColumnCount() ? country : 1;

  // Get the corresponding dependency ratio (percentage) as an integer
  let p = parseInt(currentTable.getString(yearSlider.value() - 1960, country));

  // The lower the dependency, the greener the icon
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


// Create N vertex control points in a circle for each continent
function setPoints() {

  for (let i = 0; i < continents; i++) {

    points[i] = [];

    for (let j = 0; j < N; j++) {
      let angle = (j * TWO_PI) / N - HALF_PI;

      // Set the size of the fractal
      let v = p5.Vector.fromAngle(angle,
        map(populationTable.getString(yearSlider.value() - 1960, i + 1),
        16000000, 4500000000, width / 16, width / 8));

      // Set the position of the fractal midpoint
      v.add(xOffset[i], height / 4);

      // Add to points array
      points[i][j] = v;
    }

    // Select a current point
    current[i] = createVector(xOffset[i], midPoint);
  }
}


// Draw icon
function drawIcon(i) {

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

  // Draw the icons and scale them to fit the display size
  image(icons[i], xOffset[i] - scale * icons[i].width / 2, height * 0.88 - scale * icons[i].height,
    scale * icons[i].width, scale * icons[i].height);
  stroke(0);

  // Draw a line from the fractal to the image at the 48.7% pixal mark
  line(xOffset[i], midPoint, xOffset[i], height * 0.88 - scale * icons[i].height * 0.487047);
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


// Separate slider & text logic from recursive fractal icon logic
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
    fill(0); stroke(0);
    image(legend, 0.005 * width, 0.03 * height, scale * legend.width, scale * legend.height);

    // Label each icon with a continent name
    textAlign(CENTER); textSize(16); textStyle(NORMAL);
    for (let i = 0; i < continents; i++) {
      text(populationTable.columns[i + 1], xOffset[i], 0.91 * height);
    }

    // Add title
    fill(255); textAlign(LEFT); textSize(22);
    text('Age Dependency Ratio for ' + yearSlider.value(), width / 20,
      height * 0.05);
    textSize(12);
    text('(Size of Fractal is Proportional to the Population)', width / 20, height * 0.07);

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
  setPoints();
}
