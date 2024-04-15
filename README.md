# Creating a Testing-Pipeline for my Game (by Matthis Ehrhardt)

### Abstractt

The idea of my project was to create a CI/CD pipeline for my JavaScript-Game that focuses
on testing changes to the code. The Game was and is still in development and part of my
course "Game Physics". In it, you can launch a ball into the air until it lands on a playground
where it will behave following real world physics. There was no DevOps implemented yet
and I have worked on the game alone.

I wanted to improve my Game-Physics project and make further development easier for me
by implementing automated tests into my pipeline. Specifically I wanted to test if the
playground gets properly loaded (all the elements are there and in the right place) and if the
physics behave according to the right rules (ball moves and interacts with the playground
correctly). The goal was both to create something useful, as well as to learn something new
because I had not worked with automated tests before.

The pipeline was supposed to mainly focus on running the tests on pushing and doing
pull-requests on the main branch. Furthermore I wanted to expand the project by also
dockerizing it. Though that was not really needed for my game, I thought it would help me
gain more experience with Docker additionally to CI/CD.

I expected the pipeline to run and test my changes properly and make further development
on the game easier. I figured if that works and I learn new things about testing frameworks
and how to apply them to a pipeline, then the project would be a success.

### Setup

I started the project by researching testing frameworks for javascript. I found out that the two
types of testing that would be useful to conduct for my project would be unit testing and
end-to-end (e2e) testing. Unit testing tests the smallest units of your code, for example
individual functions, and end-to-end testing tests the way a user can interact with your
program, for example if button clicks do the correct thing. Though my game has very little
e2e use cases I thought it would be useful for me to also look into e2e testing because it is
very widely used and I wanted to try it out.

For unit testing I decided on using Jest because it is one of the most commonly used testing
frameworks and I thought it would give me a good introduction into the world of testing. For
my end-to-end tests I used Cypress for similar reasons to Jest and also because it has an
easy setup and convenient UI component. Since Cypress is only usable in a node.js
environment and Jest is typically used in node.js, I installed node for my project and then the
Jest and Cypress dependencies over npm install.

I also had to create a github repo for my game so that I could create a new workflow that
does my Jest and Cypress tests on push and pull requests.

### Jest

To test my code using Jest I had to create testing suites. A testing suite has the same name
as the file that has the units I want to test in it, plus a .”test”. I then discovered that the code
for my game was managed in a format that was very inconvenient for testing it with Jest. The
whole code was written in one file and a lot of the functions did multiple tasks at once which
would make trying to test the smallest units of code difficult. That meant I had to adjust the
code a little to make testing it more manageable. I created two new files, one that has the
functions for the ball movements in it and one for the functions that create the playground
(previously all my code was written in game.js, addOns.js and index.html). This way my ball
movements-testing suite could focus on testing the physics of the ball and the
playground-testing suit could test if the elements are loaded correctly which were the two
things I wanted to test for my project.

I also rewrote the functions a little bit and split some of them into multiple functions to make it
easier for unit testing. I also tried to explain the idea behind the functions with comments so
any outsider could more easily understand the code without having to go over the entire
code of my game. For the ball movements I also changed some variable names to make
them easier to understand in this isolated environment and because some of them were
parts of other objects. However for the playground file I kept the variables as they were in
the original code to see if testing these functions would work just as well as the ones with
simplified variables. Turns out, it was just as easy and some of them being part of other
objects did not complicate the testing at all.

At the end of the files with the functions I exported set functions, so my test suites could
import and test them. Before each of the tests I had to set the variables I needed in the
tested function and give them values that I wanted them to have in the function. The tests
each have a description that explains what is being tested and an arrow function that
executes the function I want to test and then checks if the results are as expected. There are
a lot of methods in Jest to describe the expected results like “.toBe”, “.toBeGreaterThan” or
“.equal”. The difference between “.toBe” and “.toEqual” is that “.toBe” examines the place in
the memory while “.toEqual” examines the structure of a given value, so you should use
“.toEqual” to check Objects and Arrays.

If you want to check whether a function has called a certain other function you can use
methods like “.toHaveBeenCalled”. “.toHaveBeenCalledWith” furthermore checks the
parameters the function got called with, “.toHaveBeenCalledTimes” checks how often a
function got called and “.toHaveBeenNthCalledWith” checks the parameters the Nth function
call received.

One important thing to mention here is that if you want to test if and how a function has
called another function you need to define that inner function in your test suite as a mock
function before you write your test. A mock function can be completely empty since in most
cases you do not care what that function should do for your test of the outer function, you
just want to see if and how that inner function is called. The mock functions then need to be
given to the tested function as parameters. You can write a mock function using the syntax:
“const mockFunctionName = jest.fn();”. If the output of the inner function is important for your
test you can simply hardcode the desired result in the brackets. Since you test the outer
function and not the inner function you can assume that the inner function works correctly for
your test.

Remember to “jest.clearAllMocks();” before every test, otherwise the mock functions will
remember how often they got called in the previous test and start the counter from there
instead of 0 for the next test.

### Cypress

After you have installed Cypress you can use the command “npx cypress open” to open
Cypress’s UI. There you can choose what kind of testing you want Cypress to conduct (in
my case E2E Testing) and on what browser you want to test the user interaction with your
app. Afterwards you need to click on “Create new spec” which will load new files into your
project’s directory that you can use to write your Cypress tests. In the cypress/e2e folder I
wrote a test that checks if the text on my game’s screen changes correctly when a user
presses the “reset” or the “new” button.

Structurally writing tests with Cypress works similarly to writing tests with Jest but the syntax
is completely different. Individual tests are written in it-functions which need to be part of a
describe block that describes the purpose of your whole test file. An it-function visits the root
url of your program (in my case index.html) and then performs various actions to mimic user
interaction. In my test the function first clicks on the “reset” button two times and checks if
the number of tries in my text went up by two and then it clicks the “new” button to see if tries
went down to 0 again. It accesses these elements via the ids I gave them in my game.js file
(which index.html opens).

The testing file you just wrote should now be shown in the Cypress UI. By clicking on it you
can run the test and see the results. One weird problem I encountered was that at first the
test always failed and I got an error message saying the buttons are blocked by other
elements and therefore could not be clicked. However that is clearly not the case in my
program and the elements the UI told were blocking the “reset” and “new” button were the
“reset” and “new” button, so the buttons were apparently covering themselves which makes
zero sense. I did not find any site online that talks about this issue so I had to work around it
by adding “force: true” to my click functions which makes sure the test can click the buttons
even if they are being covered by something.

### Pipeline

To make my tests executable in my pipeline I added two scripts in my package.json file, one
for my unit tests which opens up “jest” and one for my e2e tests which opens up “cypress
run”. “Cypress run” can execute Cypress tests in so called “headless mode”, which means
they get executed inside the terminal like the jest tests, instead of in the Cypress UI. I
defined the pipeline in my testing.yml file in my github\workflows directory. It activates on
push and pull requests to the main branch and runs on ubuntu-latest. First it takes my code,
sets up node.js and installs the needed dependencies defined in my package.json and then
it runs the testing scripts for Jest and Cypress. Since my package.json is in my
game_physics_program directory I had to set that as my working-directory.

Now whenever I push my code to Github it will run my tests there and show me the results.
The pipeline was therefore complete and working correctly.

### Docker

Additionally to my CI/CD pipeline I also decided to dockerize my program to make the game
and the test executable over containers so that people do not need to manually download
the needed dependencies themself. I created a simple server.js which runs my program and
put that functionality in my start script in package.json. Then I created a Dockerfile that
copies the code, installs the dependencies and runs that script. Now you can simply create
an image out of that with “docker build -t game_image .” and run the server over a docker
container with “docker run -p 3000:3000 game_image”. If you want to run the jest tests via
docker you simply need to change the last line in the Dockerfile to “CMD [“npm”, “run”,
“test:unit”]” (so that it does not start your server but your jest tests) and create and execute
an image from that.

### Conclusion

I consider my project a success because I was able to use a lot of what I have learned in this
course (about servers, Docker, Github, CI/CD pipelines) and apply that to a new DevOps
element, that is testing. I managed to achieve all of my goals and learned a lot about how to
test code, from the different types of testing to the different frameworks to the writing and
usage of such. I also know now that the structure of the code you want to test is important
for effective testing and I will definitely keep that in mind the next time I tackle testing.

Some aspects of this projects I could have delved a bit deeper into like writing more tests for
more units of my code but since the tests are all written rather similarly I thought I would not
learn much more from doing that and I would rather spend my time looking into other things
like e2e testing and dockerization. I ended up spending the most time on researching all of
these different things and the coding process was rather straightforward with a few
hindrances along the way like needing to restructure my files. But all in all I am happy with
the results both in the code as well as in my learning.

### Sources

● "How to setup a CI/CD pipeline using Github Actions by running automated jest unit
tests" by "Web Dev Cody"(2022) (https://www.youtube.com/watch?v=JUKZVlIDrtY)
● "Introduction To Testing In JavaScript With Jest" by "Web Dev Simplified"(2019)
(https://www.youtube.com/watch?v=FgnxcUQ5vho)
● "Jest Crash Course - Unit Testing in JavaScript" by "Traversy Media"(2018)
(https://www.youtube.com/watch?v=7r4xVDI2vho)
● "#5 Mock Functions & Why - React Testing For Beginners" by "Syntax"(2018)
(https://www.bing.com/videos/riverview/relatedvideo?&q=how+do+i+mock+p5+in+jest
&&mid=AF4DA7697E21B219AD24AF4DA7697E21B219AD24&&FORM=VRDGAR)
● "Unit Testing and Test Driven Development" by "p5js.org"
(https://p5js.org/learn/tdd.html)
● "#LETSMEETUP - JavaScript testing: Jest mocks" by "Codete"(2021)
(https://www.youtube.com/watch?v=OS5mVVM5vAg&t=202s)
● “Testing JavaScript with Cypress – Full Course” by “freeCodeCamp.org”(2023)
(https://www.youtube.com/watch?v=u8vMu7viCm8&t=1083s)

### Link to my project's Github Repo

https://github.com/MatthisE/game_physics_testing
