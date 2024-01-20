/* template GTAT2 Game Technology & Interactive Systems - addOns */
/* Autor:  Matthis Ehrhardt*/
/* Übung Nr. 2*/
/* Datum: 18.10.2023*/

var xi0=0.5;
var yi0=4;

function cartesianToInternalX(xk)
	{
		return xi0 + xk;
	}

function cartesianToInternalY(yk)
	{
		return yi0 - yk;
	}

function internalToCartesianX(xi, M)
	{
		return (xi - xi0)/M - xi0;
	}

function internalToCartesianY(yi, M)
	{
		return (yi0 - yi)/M + yi0;
	}


//functions to draw shapes in the cartesian coordinate system	
function drawRect(x, y, w, h, c, M)
	{
		x=cartesianToInternalX(x);
		y=cartesianToInternalY(y);
		h=-h;
		
		fill(c);
		rect(x*M, y*M, w*M, h*M);
	}
/*
function drawRotatedRect(x, y, w, h, deg, M, bx, by, bd)
	{
		y=-y;
		h=-h;

		translate(xi0*M, yi0*M);
		rotate(-radians(deg));

		fill('gray');
		rect(x*M, y*M, w*M, h*M);
		rect(0, -30, 5, 30);

		fill('green');
	  	ellipse(w*M, -15, bd*M);

		rotate(radians(deg));
		translate(-xi0*M,-yi0*M);
	}
*/
/*
function drawQuad(x1, y1, x2, y2, x3, y3, x4, y4, c, M)
	{
		M = M*100;
		fill(c);
		quad(x1*M, y1*M, x2*M, y2*M, x3*M, y3*M, x4*M, y4*M);
	}
*/
function drawTriangle(x1, y1, x2, y2, x3, y3, c, M)
	{
		x1=cartesianToInternalX(x1);
		y1=cartesianToInternalY(y1);
		x2=cartesianToInternalX(x2);
		y2=cartesianToInternalY(y2);
		x3=cartesianToInternalX(x3);
		y3=cartesianToInternalY(y3);
		fill(c);
		triangle(x1*M, y1*M, x2*M, y2*M, x3*M, y3*M);
	}
function drawCircle(x, y, d, c, M)
	{
		x=cartesianToInternalX(x);
		y=cartesianToInternalY(y);
		fill(c);
		circle(x*M, y*M, d*M);
	}
function drawCircle2(x, y, d, c, M)
	{
		x=cartesianToInternalX(x);
		y=cartesianToInternalY(y);
		noFill();
		circle(x*M, y*M, d*M);
	}
function drawVertex(x, y, c, M)
	{
		x=cartesianToInternalX(x);
		y=cartesianToInternalY(y);
		fill(c);
		vertex(x*M, y*M);
	}