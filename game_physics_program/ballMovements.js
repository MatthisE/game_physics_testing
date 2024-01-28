function moveBallInAir() {

  vx = vx - r*(vx+vw)*Math.sqrt((vx*vw)*(vx*vw)+vy*vy) *dt;
  vy = vy - (g + r*vy*Math.sqrt((vx*vw)*(vx*vw)+vy*vy) ) *dt;

  ballX += sign*vx*dt;

  if(ballX+ballD/2>=pgWidth){ //checks if ball hit wall at end of PG and adjusts position if it moved into wall
    ballX=pgWidth-ballD/2;
    sign = -1;
  }

  ballY += vy*dt;
  t+= dt;
}


function moveBallOnGround() {

  vx += - g * cR *dt; //speed slows down because of friction (cR)

  if(vx < 0){ //ball stops
    vx=0;
  }

  ballX += sign*vx*dt;
  ballY = ballD/2;
  t+= dt;
}


//moves ball on slope by decelerating upwards and then accelerating downwards
function moveBallOnSlope(radians, translate, rotate, fill, ellipse) {

  ballVs += - g*(Math.sin(radians(slopeDeg)) + cR*(Math.cos(radians(slopeDeg))))*dt; //speed continuously slows down (if neg: ball rolls down)
  ballS += ballVs*dt; //x-Value of ball on slope (if slope were x-axis)

  ballX = ballS*M;
  ballY = -0.5*ballD*M;

  //turn slope into x-axis
  translate((pgWidth - slopeWidth)*M, 0);
	rotate(-radians(slopeDeg));

    fill('green');
	  ellipse(ballX, ballY, ballD*M);//ball
  
  //turn back
  rotate(radians(slopeDeg));
  translate((-(pgWidth - slopeWidth))*M, 0);

  t+= dt;
}
  
  module.exports = {moveBallInAir, moveBallOnGround, moveBallOnSlope};