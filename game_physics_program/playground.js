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

function drawRect2(a,b,c,d,e,f){
    return;
}


function drawWall(drawRect){
    drawRect(PG.width, PG.wallHeight-PG.height, PG.wallWidth, -PG.wallHeight,'gray', M);//wall
}


function drawFlag(drawRect, stroke, drawTriangle, noStroke){
    drawRect(PG.polePosX, PG.poleHeight, PG.poleWidth, -PG.poleHeight, 'black', M);//pole
    drawRect2(PG.width, PG.wallHeight-PG.height, PG.wallWidth, -PG.wallHeight,'gray', M);

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

module.exports = {drawGround, drawSlope, drawWall, drawFlag};