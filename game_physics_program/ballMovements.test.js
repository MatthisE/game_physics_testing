const {moveBallInAir, moveBallOnGround, moveBallOnSlope} = require('./ballMovements');

beforeEach(() => {
  vx = 6; //horizontal ball speed
  vy = 6; //vertical ball speed
  vw = 0; //speed of the air
  
  r = 0.0004; //rolling friction coefficient
  cR = 0.05; //coefficient of friction
  g = 9.81; //gravitational force

  sign = 1; //does ball move forwards (1) or backwards (-1)
  M = 115; //scale needed for some operations

  pgWidth = 10;
  slopeWidth = 4;
  slopeDeg = 30;
  
  dt = 0.5/25; //delta time
  t = 0; //current time
  
  ballX = 0.8; //x-position of ball
  ballY = 0.6; //y-position of ball
  ballD = 0.2; //diameter of ball

  ballS = 2; //x-pos of ball on slope
  ballVs = 4; //speed of ball on slope

  jest.clearAllMocks();
});


//tests for ball movements in air
test('ball moves in air according to the right formula', () => {
  moveBallInAir();

  expect(ballX).toBe(0.9199942400000001);
  expect(ballY).toBe(0.71607024);
});

test('ball does not move into wall', () => {
  ballX = pgWidth-ballD/2; //about to hit the wall
  moveBallInAir();

  expect(ballX).toBeLessThanOrEqual(pgWidth-ballD/2); //should not be in wall
});

//tests for ball movements on ground
test('y-position is always ballD/2', () => {
  moveBallOnGround();

  expect(ballY).toBe(ballD/2);
});

test('ball slows down', () => {
  vxTemp = vx;
  moveBallOnGround();

  expect(vx).toBeLessThan(vxTemp);
});

test('after speed reaches 0, ball does not move anymore', () => {
  vx = 0.01;
  ballXTemp1 = ballX;
  moveBallOnGround();
  ballXTemp2 = ballX;
  moveBallOnGround();

  expect(ballX).toBeGreaterThan(ballXTemp1);
  expect(ballX).toBe(ballXTemp2);
});

const radians = jest.fn(degrees => degrees * (Math.PI / 180));
const translate = jest.fn();
const rotate = jest.fn();
const fill = jest.fn();
const ellipse = jest.fn();

//tests for ball movements on slope
test('speed continuously goes down', () => {
  ballVsTemp = ballVs;
  moveBallOnSlope(radians, translate, rotate, fill, ellipse);

  expect(ballVs).toBeLessThanOrEqual(ballVsTemp);
});

test('y-position is always -ballD/2*M', () => {
  moveBallOnSlope(radians, translate, rotate, fill, ellipse);

  expect(ballY).toBe(-ballD/2*M);
});

test('coord. system has been translated to the start of the slope', () => {
  moveBallOnSlope(radians, translate, rotate, fill, ellipse);

  expect(translate).toHaveBeenCalledWith((pgWidth - slopeWidth)*M, 0);
});

test('coord. system has been rotated by slopeDeg', () => {
  moveBallOnSlope(radians, translate, rotate, fill, ellipse);

  expect(rotate).toHaveBeenCalledWith(-radians(slopeDeg));
});

