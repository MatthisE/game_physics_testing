const {drawGround, drawSlope, drawWall, drawFlag, drawCatapult} = require('./playground');

beforeEach(() => {
    /* declarations */ 
    M = 115; //scale
    
    //time values for speed of ball
    t = 0;
    framerate = 25;
    dt = 0.5/framerate;
    
    //beginning values for ball
    sign = 1;
    x0 = 0;
    y0 = 0;
    v0 = 12;
    
    v0x = 0;
    v0y = 0;
    
    vx = 0;
    vy = 0;
    
    xi0=0.5;
    yi0=4;
    
    v = v0;
    g = 9.81;
    
    cR = 0.05;												// Rollreibungskoeff.
    n = 50;
    
    // values for friction in the air
    cW = 0.45;
    roh = 1.3;
    r = 0;
    vw= Math.random()*25;

    if(Math.random() < 0.5){
        vw=-vw;
    }
    
    //state machine
    moveAir=false;
    moveGround=false;
    moveSlope=false;
    adjustThrow=true;
    
    tries = 0;
    successes = 0;
    
    //ball-values
    ball = {
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
    PG = {
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
    
    slopePath = 0;
    
    /* for the dragable endpoint of the catapult */ 
    dragX = 0;
    dragY = 0;
    pull = 0;
    dragRadius = 0.1;
    overDrag = false; //if mouse is over drag-point
    locked = false; //if mouse is pressed on drag-point
    xOffset = 0.0; //distance between middle of drag-point and mouse-click on drag-point
    yOffset = 0.0;
    
    jest.clearAllMocks();
});

const radians = jest.fn(degrees => degrees * (Math.PI / 180));

const beginShape = jest.fn(); 
const drawVertex = jest.fn();
const endShape = jest.fn();

const stroke = jest.fn();
const noStroke = jest.fn();

const drawTriangle = jest.fn();
const drawRect = jest.fn();
const drawRotatedRect = jest.fn();
const drawCircle = jest.fn();

const translate = jest.fn();
const rotate = jest.fn();

const fill = jest.fn();
const rect = jest.fn();
const ellipse = jest.fn();


//tests for drawing the ground
test('8 vertexes are drawn in total (4 for ground, 4 for hole)', () => {
    drawGround(beginShape, drawVertex, endShape);
  
    expect(beginShape).toBeCalledTimes(1);
    expect(drawVertex).toBeCalledTimes(8);
    expect(endShape).toBeCalledTimes(1);
});

test('hole is being drawn as a rectangle in the ground based on PG values', () => {
    drawGround(beginShape, drawVertex, endShape);

    const color='blue';

    expect(drawVertex).toHaveBeenNthCalledWith(2, PG.holePos-PG.holeWidth/2, 0, color, M);
    expect(drawVertex).toHaveBeenNthCalledWith(3, PG.holePos-PG.holeWidth/2, -PG.holeDepth, color, M);
    expect(drawVertex).toHaveBeenNthCalledWith(4, PG.holePos+PG.holeWidth/2, -PG.holeDepth, color, M);
    expect(drawVertex).toHaveBeenNthCalledWith(5, PG.holePos+PG.holeWidth/2, 0, color, M);
});

//tests for drawing the slope
test('3 vertexes are drawn in total (slope is a triangle)', () => {
    drawSlope(beginShape, drawVertex, endShape, radians);
  
    expect(beginShape).toBeCalledTimes(1);
    expect(drawVertex).toBeCalledTimes(3);
    expect(endShape).toBeCalledTimes(1);
});

test('slope is drawn on ground based on PG values', () => {
    drawSlope(beginShape, drawVertex, endShape, radians);

    const color='blue';

    expect(drawVertex).toHaveBeenNthCalledWith(1, PG.width-PG.slopeWidth, 0,'blue', M);
    expect(drawVertex).toHaveBeenNthCalledWith(2, PG.width, Math.tan(radians(PG.slopeDeg))*PG.slopeWidth, color, M);
    expect(drawVertex).toHaveBeenNthCalledWith(3, PG.width, 0, color, M);
});

//tests for drawing the wall
test('wall is drawn as a rect based on PG values', () => {
    drawWall(drawRect);

    const color='gray';
  
    expect(drawRect).toBeCalledWith(PG.width, PG.wallHeight-PG.height, PG.wallWidth, -PG.wallHeight, color, M);
});

//tests for drawing the flag
test('flag pole is drawn as a rect based on PG values', () => {
    drawFlag(drawRect, stroke, drawTriangle, noStroke);

    const color='black';
  
    expect(drawRect).toBeCalledWith(PG.polePosX, PG.poleHeight, PG.poleWidth, -PG.poleHeight, color, M);
});

test('flag should float according to the direction of the wind', () => {

    const color='yellow';

    vw = 5;
    drawFlag(drawRect, stroke, drawTriangle, noStroke);
    expect(drawTriangle).toBeCalledWith(PG.polePosX, PG.poleHeight, PG.polePosX, PG.poleHeight-PG.flagHeight, PG.polePosX-PG.flagWidth, PG.poleHeight-PG.flagHeight/2, color, M);
    

    vw = -5;
    drawFlag(drawRect, stroke, drawTriangle, noStroke);
    expect(drawTriangle).toBeCalledWith(PG.polePosX+PG.poleWidth, PG.poleHeight, PG.polePosX+PG.poleWidth, PG.poleHeight-PG.flagHeight, PG.polePosX+PG.poleWidth+PG.flagWidth, PG.poleHeight-PG.flagHeight/2, color, M);
   
});