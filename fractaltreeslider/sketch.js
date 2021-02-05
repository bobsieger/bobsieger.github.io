
/*
  Adapted from O CÓDIGO TRANSCENDENTE
	Cap6.3.2 ArvoreAleatoria
	by Mateus Paresqui Berruezo
*/

//jshint esversion:6

let maxTrees = 9;
let segment = [];
let isSliders = false;
let heightSlider, symmetrySlider, treeSlider;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Generate Sliders
  sliders();

  // Generate random tree segment lengths
  for (let i = 0; i < maxTrees; i++) {
    segment.push(random(90, 170));
  }

  // Turn off continuous redraw
  noLoop();
}

function draw() {
  background('#f9f7f7');

  // Draw slider labels
  sliders();

  // Use -90° so that the tree grows straight up
  let trees = treeSlider.value();
  for (let i = 0; i < trees; i++) {
    tree((i + 1) * width / (trees + 1), 0.9 * height, segment[i] * heightSlider.value(), -90, 35);
  }
}

function tree(xi, yi, length, angle, angleBranch) {
  if (length > 2) {

    let xf = xi + cos(radians(angle)) * length;
    let yf = yi + sin(radians(angle)) * length;
    line(xi, yi, xf, yf);

    // Randomly determine new branch angles:
    let newAngleR1 = angle + random(angleBranch);
    let newAngleR2 = angle - random(angleBranch);

    // Reduce branch length by 20%, using the growth slider to optionally
    // force asymmetric growth:
    let newLengthR1 = 0.8 * length;
    let newLengthR2 = (0.8 + symmetrySlider.value()) * length;

    // Recursively call the tree function for the left and right branches
    tree(xf, yf, newLengthR1, newAngleR1, angleBranch);
    tree(xf, yf, newLengthR2, newAngleR2, angleBranch);
  }
}

// Separate slider logic from recursive fractal tree logic
function sliders() {
  if (isSliders) {
    fill(0);
    text('Trees: ' + treeSlider.value(), 150, windowHeight - 55);
    text('Symmetry: ' + symmetrySlider.value(), 330, windowHeight - 55);
    text('Height: x' + heightSlider.value(), 510, windowHeight - 55);
  }
  else {
    treeSlider = createSlider(1, maxTrees, 2, 1);
    treeSlider.position(150, windowHeight - 50);

    symmetrySlider = createSlider(-0.4, -0.1, -0.2, 0.1);
    symmetrySlider.position(330, windowHeight - 50);

    heightSlider = createSlider(0.5, 1.5, 1.2, 0.1);
    heightSlider.position(510, windowHeight - 50);

    isSliders = true;
  }
}

function mouseReleased() {
  // The redraw() function makes draw() execute once
  redraw();
}
