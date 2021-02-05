/*
  Adapted from O CÓDIGO TRANSCENDENTE
	Cap6.3.2 ArvoreAleatoria
	by Mateus Paresqui Berruezo
*/

//jshint esversion:6

function setup() {
  createCanvas(windowWidth, windowHeight);

  let segment = [90, 100, 110, 140, 170, 125, 115, 105, 95];

  for (let i = 1; i < 10; i++) {
		// Use -90° so that the tree grows straight up
    tree(i * width / 10, 0.8 * height, segment[i - 1], -90, 35);
  }
}

function tree(xi, yi, length, angle, angleBranch) {
  if (length > 2) {

    let xf = xi + cos(radians(angle)) * length;
    let yf = yi + sin(radians(angle)) * length;
    line(xi, yi, xf, yf);

    // Randomly determine a new branch angle:
    let newAngleR1 = angle + random(angleBranch);
    let newAngleR2 = angle - random(angleBranch);

    // Reduce branch length by 30%:
    let newLength = 0.7 * length;

    tree(xf, yf, newLength, newAngleR1, angleBranch);
    tree(xf, yf, newLength, newAngleR2, angleBranch);
  }

}
