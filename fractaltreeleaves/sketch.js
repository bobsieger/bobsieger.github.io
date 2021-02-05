/*
  Adapted from O CÓDIGO TRANSCENDENTE
	Cap6.3.2 ArvoreAleatoria
	by Mateus Paresqui Berruezo
*/

//jshint esversion:6

let maxTrees = 9;
let segmentArray = [];
let segmentMax = 170;
let isSliders = false;
let treeSlider;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Generate Sliders
  sliders();

  // Generate random initial tree segment lengths
  for (let i = 0; i < maxTrees; i++) {
    segmentArray.push(1.3 * random(90, segmentMax));
  }

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

  // Draw a series of trees and use -90° so that each tree grows straight up
  let trees = treeSlider.value();
  for (let i = 0; i < trees; i++) {
    tree((i + 1) * width / (trees + 1), 0.9 * height, segmentArray[i], -90, 35);
  }
}

// Recursively call the tree function, providing:
// xi     - Initial x value
// yi     - Initial y value
// length - The length of the tree segment
// angle  - The angle of the tree segment
// angleBranch - The maximum angle of the next set of branches
function tree(xi, yi, length, angle, angleBranch) {
  if (length > 5) {
    // The length of each segment ranges from a maximum of segmentMax to a minimum
    // of 3, which will correspond to a thickness of 15 and 0 respectively
    stroke(50);
    strokeWeight(map(length, segmentMax, 5, 15, 0));

    // Calculate the final x,y values
    let xf = xi + cos(radians(angle)) * length;
    let yf = yi + sin(radians(angle)) * length;
    line(xi, yi, xf, yf);

    // Randomly determine new branch angles:
    let newAngleR1 = angle + random(5, angleBranch);
    let newAngleR2 = angle - random(5, angleBranch);

    // Reduce branch length by 20%, using the growth slider to optionally
    // force asymmetric growth:
    let newLengthR1 = 0.8 * length;
    let newLengthR2 = 0.6 * length;

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
    fill(random(100, 120), random(165, 185), random(130, 150), 5);
    stroke(random(100, 120), random(165, 185), random(130, 150), 20);
    strokeWeight(0);

    let radius = random(5, 25);

    ellipse(xi, yi, radius, radius);
  }
}

// Separate slider logic from recursive fractal tree logic
function sliders() {
  if (isSliders) {
    fill(0);
    text('Trees: ' + treeSlider.value(), 150, windowHeight - 55);
  }
  else {
    treeSlider = createSlider(1, maxTrees, 2, 1);
    treeSlider.position(150, windowHeight - 50);

    isSliders = true;
  }
}

function mouseReleased() {
  // The redraw() function makes draw() execute once
  redraw();
}
