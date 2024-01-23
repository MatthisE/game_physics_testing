  global.vx = 6;
  global.vy = 6;
  global.vw = 0;
  
  global.r = 0.0004;
  global.g = 9.81;
  global.sign = 1;
  global.pgWidth = 10;
  
  global.dt = 0.5/25;
  global.t = 0;
  
  global.ballX = 0.8;
  global.ballY = 0.6;
  global.ballD = 0.2;


function moveBallInAir() {

  vx = vx - r*(vx+vw)*Math.sqrt((vx*vw)*(vx*vw)+vy*vy) *dt;
  vy = vy - (g + r*vy*Math.sqrt((vx*vw)*(vx*vw)+vy*vy) )*dt;

  ballX += sign*vx*dt;

  if(ballX+ballD/2>=pgWidth){ //checks if ball hit wall at end of PG and adjusts position if it moved into wall
    ballX=pgWidth-ballD/2;
    sign = -1;
  }

  ballY += vy*dt;
  t+= dt;
}
  
  module.exports = moveBallInAir;