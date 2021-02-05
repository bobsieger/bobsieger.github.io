/*
  Adapted from O CÓDIGO TRANSCENDENTE
	Cap6.3.2 ArvoreAleatoria
	by Mateus Paresqui Berruezo
*/

//jshint esversion:6

function setup() {
  createCanvas(windowWidth, windowHeight);
  tree(width / 2, 0.7 * height, 100, -90, 35);
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
