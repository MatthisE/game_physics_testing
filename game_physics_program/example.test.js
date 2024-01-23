const moveBallInAir = require('./example');


beforeEach(() => {
  orig_vx = global.vx;
  orig_vy = global.vy;
  orig_vw = global.vw;

  orig_r = global.r;
  orig_g = global.g;
  orig_sign = global.sign;
  orig_pgWidth = global.pgWidth;

  orig_dt = global.dt;
  orig_t = global.t;

  orig_ballX = global.ballX;
  orig_ballY = global.ballY;
  orig_ballD = global.ballD;
});

afterEach(() => {
  global.vx = orig_vx;
  global.vy = orig_vy;
  global.vw = orig_vw;

  global.r = orig_r;
  global.g = orig_g;
  global.sign = orig_sign;
  global.pgWidth = orig_pgWidth;

  global.dt = orig_dt;
  global.t = orig_t;

  global.ballX = orig_ballX;
  global.ballY = orig_ballY;
  global.ballD = orig_ballD;
});


test('ball moves in air according to the right formula', () => {
  moveBallInAir();

  expect(global.ballX).toBe(0.9199942400000001);
  expect(global.ballY).toBe(0.71607024);
});

test('ball does not move into wall', () => {
  global.ballX = global.pgWidth-global.ballD/2; //about to hit the wall
  moveBallInAir();

  expect(global.ballX).toBeLessThanOrEqual(global.pgWidth-global.ballD/2); //should not be in wall
});