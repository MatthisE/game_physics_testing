function drawGround(beginShape, drawVertex, endShape){
    beginShape(); 
    drawVertex(0, 0,'blue', M); //ground
    drawVertex(PG.holePos-PG.holeWidth/2, 0,'blue', M); //hole
    drawVertex(PG.holePos-PG.holeWidth/2, -PG.holeDepth,'blue', M); //hole
    drawVertex(PG.holePos+PG.holeWidth/2, -PG.holeDepth,'blue', M); //hole
    drawVertex(PG.holePos+PG.holeWidth/2, 0,'blue', M); //hole
    drawVertex(PG.width, 0,'blue', M); //ground
    drawVertex(PG.width, -PG.height,'blue', M); //ground
    drawVertex(0, -PG.height,'blue', M); //ground
    endShape();
    //vertexes get connected to create a graphic
}


function drawSlope(beginShape, drawVertex, endShape, radians){
    beginShape(); 
    drawVertex(PG.width-PG.slopeWidth, 0,'blue', M); //slope (triangle)
    drawVertex(PG.width, Math.tan(radians(PG.slopeDeg))*PG.slopeWidth,'blue', M); //slope (triangle)
    drawVertex(PG.width, 0,'blue', M); //slope (triangle)
    endShape();
}


function drawWall(drawRect){
    drawRect(PG.width, PG.wallHeight-PG.height, PG.wallWidth, -PG.wallHeight,'gray', M);//wall
}


function drawFlag(drawRect, stroke, drawTriangle, noStroke){
    drawRect(PG.polePosX, PG.poleHeight, PG.poleWidth, -PG.poleHeight, 'black', M);//pole

    stroke('blue');//flag
    if(vw<0){
        //wind comes from the left
        drawTriangle(PG.polePosX+PG.poleWidth, PG.poleHeight, PG.polePosX+PG.poleWidth, PG.poleHeight-PG.flagHeight, PG.polePosX+PG.poleWidth+PG.flagWidth, PG.poleHeight-PG.flagHeight/2,'yellow', M);
    }else{
        //wind comes from the right
        drawTriangle(PG.polePosX, PG.poleHeight, PG.polePosX, PG.poleHeight-PG.flagHeight, PG.polePosX-PG.flagWidth, PG.poleHeight-PG.flagHeight/2,'yellow', M);
    }
    noStroke();
}


function drawCatapult(translate, rotate, radians, fill, rect, ellipse) {

    drawCircle(0, 0, ball.diameter/2,'black', M);//starting point

    //matrix calculations to make ramp rotatable
	translate(xi0*M, yi0*M); 
	rotate(-radians(PG.rampDeg));

	fill('gray');
	rect(0, -PG.rampHeight*M, PG.rampWidth*M, PG.rampHeight*2*M);//ramp ground
	rect(0, -30, 5, 30);//ramp wall

    if(adjustThrow==true){//feather and boll should just be drawn on catapult if the throw is being adjusted (and ball is not shot yet)

      pull = dragX/Math.cos(radians(PG.rampDeg));//how much ball moves back against feather

      //ball has to stay on catapult
      if(pull>1){
        pull =1;
      }
      if(pull<0.15){
        pull =0.15;
      }

      fill('blue');
      rect(0, -15, pull*M, 2);//feather

      fill('green');
	  ellipse(pull*M, -15, ball.diameter*M);//ball
    }

    //reset matrix calculations
	rotate(radians(PG.rampDeg));
	translate(-xi0*M,-yi0*M);
}

module.exports = {drawGround, drawSlope, drawWall, drawFlag, drawCatapult};