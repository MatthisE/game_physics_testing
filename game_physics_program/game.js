/* template GTAT2 Game Technology & Interactive Systems */
/* Autor:  Matthis Ehrhardt*/
/* Datum: 20.01.2023*/

/* declarations */ 
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var M; //scale

//time values for speed of ball
var t = 0;
var framerate = 25;
var dt = 0.5/framerate;

//beginning values for ball
var sign = 1;
var x0 = 0;
var y0 = 0;
var v0 = 12;

var v0x;
var v0y;

var vx;
var vy;

var v = v0;
var g = 9.81;

var cR = 0.05;												// Rollreibungskoeff.
var n = 50;

// values for friction in the air
var cW = 0.45;
var roh = 1.3;
var r;
var vw;

//state machine
var moveAir=false;
var moveGround=false;
var moveSlope=false;
var adjustThrow=true;

var tries = 0;
var successes = 0;

//ball-values
var ball = {
  diameter: 0.2,
  mass: 100,
  surface: 0.2*0.2*Math.PI,

  greenPosX: 5,
  greenPosY: 0.5,

  greenS: 0.0,
  greenVs: 0.0,

  redPosX: 5.8,
  redPosY: 0.5

};

//playground-values
var PG = {
  width: 10,
  height: 0.5,
  holePos: 5,
  holeWidth: 1.1*ball.diameter,
  holeDepth: 1.5*ball.diameter,
  slopeDeg: 30,
  slopeWidth: 4,

  wallWidth: 0.5,
  wallHeight: 4,

  polePosX: 5.5,
  poleWidth: 0.03,
  poleHeight: 1.3,

  flagHeight: 0.2,
  flagWidth: 0.6,

  rampHeight: 0.03,
  rampWidth: 1,
  rampDeg: 30
};

let slopePath;

/* for the dragable endpoint of the catapult */ 
let dragX;
let dragY;
var pull;
let dragRadius = 0.1;
let overDrag = false; //if mouse is over drag-point
let locked = false; //if mouse is pressed on drag-point
let xOffset = 0.0; //distance between middle of drag-point and mouse-click on drag-point
let yOffset = 0.0;

/* prepare program */
function setup() {		
  createCanvas(canvasWidth, canvasHeight);

  credits = createElement('h2', 'Matthis Ehrhardt, 582239, 20.01.2023');
  credits.position(50, 50);

  info = createElement('h2', 'Versuche: ' +tries+ ' davon ' +successes+ ' erfolgreich');
  info.position(50, 90);

  
  //looker was used for testing purposes
  
  
  lookerX = createElement('vx', 'vx: ');
  lookerX.position(100, 200);

  lookerY = createElement('h2', 'Y: ');
  lookerY.position(100, 300);
/*
  lookerZ = createElement('h2', 'Z: ');
  lookerZ.position(100, 400);
  */

  //put drag-point at end of catapult
  dragX=Math.cos(radians(PG.rampDeg));
  dragY=Math.sin(radians(PG.rampDeg));

  //set starting speeds
  v0x=v0*Math.cos(radians(PG.rampDeg));
  v0y=v0*Math.sin(radians(PG.rampDeg));

  vx = v0y;
  vy = v0y;

  //Reibzahl
  r = 0.5*cW*roh*ball.surface/ball.mass;

  //make random wind speed
  vw= Math.random()*100;

  if(Math.random() < 0.5){
    vw=-vw;
  }

  slopePath = PG.slopeWidth/Math.cos(radians(PG.slopeDeg));
}

//deletes tries and successes and puts ball on catapult
function do_new() {
  moveAir=false;
  moveGround=false;
  moveSlope=false;
  adjustThrow=true;

  ball.greenPosX=Math.cos(radians(PG.rampDeg));
  ball.greenPosY=Math.sin(radians(PG.rampDeg));

  tries=0;
  successes=0;
  info.html('Versuche: ' +tries+ ' davon ' +successes+ ' erfolgreich');
}

//adds a try and puts ball on catapult
function do_reset() {

  ball.greenS=0;
  ball.greenVs=0;
  moveAir=false;
  moveGround=false;
  moveSlope=false;
  adjustThrow=true;

  dragX=Math.cos(radians(PG.rampDeg));

  ball.greenPosX=Math.cos(radians(PG.rampDeg));
  ball.greenPosY=Math.sin(radians(PG.rampDeg));
  tries++;
  info.html('Versuche: ' +tries+ ' davon ' +successes+ ' erfolgreich');

  //make random wind speed
  vw= Math.random()*25;

  if(Math.random() < 0.5){
    vw=-vw;
  }
}

//starts throw of ball
function do_start() {
  sign = 1;
  v0x=v0*Math.cos(radians(PG.rampDeg));
  v0y=v0*Math.sin(radians(PG.rampDeg));

  //vx = v0x;
  //vy = v0y;

  //vx = v0x - (r/ball.mass*v0x + n/ball.mass*(1-pull));
  //vy = v0y + (g - r/ball.mass*v0y + n/ball.mass*(1-pull));

  vx = v0x *(1-pull);
  vy = v0y *(1-pull);

  moveAir=true;
  adjustThrow=false;

  x0=Math.cos(radians(PG.rampDeg));
  y0=Math.sin(radians(PG.rampDeg));
  t=0;

  moveBallInAir();
}

function drawRotatedRect(x, y, w, h, deg, M, bd)
	{
		y=-y;
		h=-h;

		translate(xi0*M, yi0*M);
		rotate(-radians(deg));

		fill('gray');
		rect(x*M, y*M, w*M, h*M);
		rect(0, -30, 5, 30);

    if(adjustThrow==true){

      pull = dragX/Math.cos(radians(PG.rampDeg));

      if(pull>1){
        pull =1;
      }
      if(pull<0.15){
        pull =0.15;
      }

      fill('blue');
      rect(0, -15, pull*M, 2);

      fill('green');
	    ellipse(pull*M, -15, bd*M);
    }

		rotate(radians(deg));
		translate(-xi0*M,-yi0*M);
	}

//moves ball in an arch in the air
function moveBallInAir() {

  vx = vx - r*(vx+vw)*Math.sqrt((vx*vw)*(vx*vw)+vy*vy) *dt;

  //vy = vy + (-g)*dt;
  vy = vy - (g + r*vy*Math.sqrt((vx*vw)*(vx*vw)+vy*vy) )*dt;

  //ball.greenPosX = v0*Math.cos(radians(PG.rampDeg))*t+x0; old version
  ball.greenPosX += sign*vx*dt;

  if(ball.greenPosX+ball.diameter/2>=PG.width){ //checks if ball hit wall at end of PG and adjusts position if it moved into wall
    ball.greenPosX=PG.width-ball.diameter/2;
    sign = -1;
  }

  //ball.greenPosY = -9*(t*t/2)+v0*Math.sin(radians(PG.rampDeg))*t+y0; old version
  ball.greenPosY += vy*dt;
  t+= dt;
}

//moves ball on ground in a linear motion
function moveBallOnGround() {
  vx += - g * cR *dt; //speed slows down because of friction (cR)

  if(vx < 0){ //ball stops
    vx=0;
  }

  ball.greenPosX += sign*vx*dt;
  ball.greenPosY = ball.diameter/2;
  t+= dt;
}

//moves ball on slope by decelerating upwards and then accelerating downwards
function moveBallOnSlope() {
  ball.greenVs += - g*(Math.sin(radians(PG.slopeDeg)) + cR*(Math.cos(radians(PG.slopeDeg))))*dt; //speed continuously slows down
  ball.greenS += ball.greenVs*dt; //x-Value of ball on slope (if slope were x-axis)

  ball.greenPosX = ball.greenS*M;
  ball.greenPosY = -0.5*ball.diameter*M;

  //turn slope into x-axis
  translate((0.5 + PG.width - PG.slopeWidth)*M, 4*M);
	rotate(-radians(PG.slopeDeg));

    fill('green');
	  ellipse(ball.greenPosX, ball.greenPosY, ball.diameter*M);//green ball
  
  //turn back
  rotate(radians(PG.slopeDeg));
  translate((-(0.5 +PG.width - PG.slopeWidth))*M, -4*M);

  t+= dt;
}

/* run program */
function draw() {		
  
  background(200);
  noStroke();

/* administration */
	fill(0);

  /*
  reset_button = createButton('START');
  reset_button.position(60, 550);

  if(adjustThrow==true){
    reset_button.mousePressed(do_start);
  }
  else{ //start button becomes reset button if ball got thrown
    reset_button.html('RESET');
    reset_button.mousePressed(do_reset);
  }
  */

  reset_button = createButton('RESET');
  reset_button.position(60, 550);
  reset_button.mousePressed(do_reset);

  new_button = createButton('NEW');
  new_button.position(500, 550);
  new_button.mousePressed(do_new);
	
/* calculation */
M = window.innerWidth/13;

//moves ball along end of catapult if it did not get thrown yet
if(adjustThrow==true){
  ball.greenPosX=Math.cos(radians(PG.rampDeg+7.5));
  ball.greenPosY=Math.sin(radians(PG.rampDeg+7.5));
}

if(moveGround==true){
  moveBallOnGround();
  //switch from ground to slope
  if(ball.greenPosX>=PG.width-PG.slopeWidth-PG.slopeDeg/90*ball.diameter/2 && sign==1){
    moveGround=false;
    moveSlope=true;
    ball.greenVs=vx; //slope has own v
    ball.greenS=0;
  }
  //check if ball is at the hole, if so: put in hole, get a success, stop movement
  else if(ball.greenPosX > PG.holePos-PG.holeWidth/2 && ball.greenPosX < PG.holePos+PG.holeWidth/2){
    ball.greenPosX = PG.holePos;
    ball.greenPosY = -PG.holeDepth+ball.diameter/2;
    successes++;
    moveGround=false;
  }
}

if(moveSlope==true){
  moveBallOnSlope();
  //if ball went down slope: move on ground (in negative direction)
  if(ball.greenPosX-ball.diameter<0+PG.slopeDeg/90*ball.diameter/2){
    moveSlope=false;
    moveGround=true;

    ball.greenPosX = PG.width-PG.slopeWidth-PG.slopeDeg/90*ball.diameter/2;
    sign = -1;
    vx=-ball.greenVs;
    moveBallOnGround();
  }
  //checks if ball hit wall at end of slope and switch to moveBallInAir
  else if(ball.greenPosX>=slopePath*M-PG.slopeDeg/90*ball.diameter/2){
    moveSlope=false;
    moveAir=true;

    sign = -1;

    //start position of ball between slope and wall
    ball.greenPosX = PG.width-ball.diameter/2;
    ball.greenPosY =PG.slopeWidth*Math.tan(radians(PG.slopeDeg))+ball.diameter/2;

    //new speeds based on speed on slope
    vx=ball.greenVs*Math.cos(radians(PG.slopeDeg));
    vy=ball.greenVs*Math.sin(radians(PG.slopeDeg));

    moveBallInAir();
  }
}

if(moveAir==true){
  moveBallInAir();
  //check if ball hit ground, adjust position if it moved into ground, switch from moveAir to moveGround
  if(ball.greenPosY <= ball.diameter/2){
    ball.greenPosY = ball.diameter/2;
    moveAir=false;
    moveGround=true;
  }
  //check if ball hit slope, adjust position if it moved into slope, switch from moveAir to moveSlope
  else{
    var linFunc = Math.tan(radians(PG.slopeDeg))*ball.greenPosX - Math.tan(radians(PG.slopeDeg))*(PG.width-PG.slopeWidth) //linear function of slope
    if(ball.greenPosY - ball.diameter/2 <= linFunc){
      ball.greenPosY = linFunc + ball.diameter/2;
      moveAir=false;
      moveSlope=true;
      ball.greenVs=sign * vx;
      ball.greenS=(ball.greenPosX-(PG.width-PG.slopeWidth))/Math.cos(radians(PG.slopeDeg));
    }
  } 
}

/* display */


lookerX.html('ball.greenPosX: ' + ball.greenPosX);
lookerY.html('ball.diameter: ' + ball.diameter);
/*lookerZ.html('vx: ' +vx);
*/

//draw the playground
beginShape(); //ground
drawVertex(0, 0,'blue', M); //ground
drawVertex(PG.holePos-PG.holeWidth/2, 0,'blue', M); //hole
drawVertex(PG.holePos-PG.holeWidth/2, -PG.holeDepth,'blue', M); //hole
drawVertex(PG.holePos+PG.holeWidth/2, -PG.holeDepth,'blue', M); //hole
drawVertex(PG.holePos+PG.holeWidth/2, 0,'blue', M); //hole
drawVertex(PG.width-PG.slopeWidth, 0,'blue', M); //ground, slope
drawVertex(PG.width, Math.tan(radians(PG.slopeDeg))*PG.slopeWidth,'blue', M); //slope
drawVertex(PG.width, -PG.height,'blue', M); //ground
drawVertex(0, -PG.height,'blue', M); //ground
endShape();

drawRect(PG.width, PG.wallHeight-PG.height, PG.wallWidth, -PG.wallHeight,'gray', M);//wall
drawRect(PG.polePosX, PG.poleHeight, PG.poleWidth, -PG.poleHeight, 'black', M);//pole

stroke('blue');//flag
if(vw<0){
  drawTriangle(PG.polePosX+PG.poleWidth, PG.poleHeight, PG.polePosX+PG.poleWidth, PG.poleHeight-PG.flagHeight, PG.polePosX+PG.poleWidth+PG.flagWidth, PG.poleHeight-PG.flagHeight/2,'yellow', M);
}else{
  drawTriangle(PG.polePosX, PG.poleHeight, PG.polePosX, PG.poleHeight-PG.flagHeight, PG.polePosX-PG.flagWidth, PG.poleHeight-PG.flagHeight/2,'yellow', M);
}
noStroke();

drawRotatedRect(0, PG.rampHeight, PG.rampWidth, -PG.rampHeight*2, PG.rampDeg, M, ball.diameter);//ramp

drawCircle(0, 0, ball.diameter/2,'black', M);//starting point
drawCircle(ball.redPosX, ball.redPosY, ball.diameter,'red', M);//red ball

if(moveSlope!=true && adjustThrow!=true){//moveSlope and adjustThrow draw ball itself
  drawCircle(ball.greenPosX, ball.greenPosY, ball.diameter,'green', M);//green ball
}

if(adjustThrow==true){
//turn mouse coordinates into cartesian ones and check if the cursor is over the dragable circle
if (
  internalToCartesianX(mouseX,M) > dragX - dragRadius &&
  internalToCartesianX(mouseX,M) < dragX + dragRadius &&
  internalToCartesianY(mouseY,M) > dragY - dragRadius &&
  internalToCartesianY(mouseY,M) < dragY + dragRadius
) 
{
  overDrag = true;

  if (!locked) {
    stroke(255); //change color of stroke to show mouse is over drag-point
  }
} 
else {
  stroke(156, 39, 176);
  overDrag = false;
}

//draw the drag-point
drawCircle2(dragX, dragY, dragRadius*2,'pink', M);
}

}



//mouse functions
function mousePressed() { //lock drag-point to cursor if mouse gets pressed over drag-point (and ball did not get thrown yet)
  if(adjustThrow==true){
  if (overDrag) {
    locked = true;

    xOffset = internalToCartesianX(mouseX,M) - dragX;
    yOffset = internalToCartesianY(mouseY,M) - dragY;
  } else {
    locked = false;
  }
}
}

function mouseDragged() { //move drag-point along cursor if it got locked to it
  if(adjustThrow==true){
  if (locked) {
    dragX = internalToCartesianX(mouseX,M) - xOffset;
    dragY = internalToCartesianY(mouseY,M) - yOffset;

    PG.rampDeg=Math.atan(dragY/dragX)*50; //change angle of catapult to make it point to drag-point

    //angle has to be between 0° and 90°
    if(dragX<=0){
      PG.rampDeg=90;
    }
    if(PG.rampDeg<0){
      PG.rampDeg=0;
    }
    if(PG.rampDeg>90){
      PG.rampDeg=90;
    }
  }
  }
}

function mouseReleased() { //if drag-point got locked to dragged mouse: put drag-point back to (new) end of catapult after mouse got released
  if(adjustThrow==true){
  if(locked){
    dragX=Math.cos(radians(PG.rampDeg));
    dragY=Math.sin(radians(PG.rampDeg));

    do_start()
  }
  locked = false; //end lock
  overDrag = false;
  }
}

/* isr */
function windowResized() {						/* responsive design */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(windowWidth, windowHeight);
}

function add(a, b) {
  return a + b;
}

module.exports = add;