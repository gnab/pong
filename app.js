var svg = d3.select('body')
      .append('svg')
      .attr('height', '100%')
      .attr('width', '100%')
      .attr('viewBox', '0 0 640 480');

var board = svg
      .append('rect')
        .attr('opacity', 0)
        .attr('height', '100%')
        .attr('width', '100%')
        .attr('fill', 'green')
        .transition()
        .duration(1000)
        .attr('opacity', 1);

var ball = new Ball();
var leftPad = new Pad(30);

window.requestAnimFrame = (function(){
  return window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function animloop(){
  render();
  requestAnimFrame(animloop);
})();

function render () {
  var sx = Math.cos(ball.direction),
      sy = Math.sin(ball.direction),
      x = ball.x,
      y = ball.y;


  var padY = leftPad.y;
  if (sx < 0 && (x <= 30 + 20) && (y + 30 >= padY) && (y + 10 <= padY + 150)) {
    direction = Math.atan2(sy, -sx);
  }

  leftPad.move();
  ball.move();
}

var keyDown = false,
    keyUp = false;

d3.select(document.body)
  .on('keydown', function () {
      if (d3.event.keyCode === 40) {
        keyDown = true;
      }
      else if (d3.event.keyCode === 38) {
        keyUp = true;
      }
  })
  .on('keyup', function () {
      if (d3.event.keyCode === 40) {
        keyDown = false;
      }
      else if (d3.event.keyCode === 38) {
        keyUp = false;
      }
  });

function Ball () {
  var svg,
      circle;

  this.speed = 4;
  this.direction = Math.PI / 8;
  this.x = 100;
  this.y = 100;

  this.move = function () {
    var sx = Math.cos(this.direction),
        sy = Math.sin(this.direction),
        dx = this.speed * sx,
        dy = -this.speed * sy;

    this.x += dx;
    this.y += dy;

    if (this.x < 0 && sx < 0) {
      this.direction = Math.atan2(sy, -sx);
    }
    else if (this.x + 40 > 640 && sx > 0) {
      this.direction = Math.atan2(sy, -sx);
    }

    if (this.y < 0 && sy > 0) {
      this.direction = Math.atan2(-sy, sx);
    }
    else if (this.y + 40 > 480 && sy < 0) {
      this.direction = Math.atan2(-sy, sx);
    }

    var ratio = circle[0][0].getBoundingClientRect().width / 40;
    svg[0][0].style['-webkit-transform'] = 'translate3d(' + this.x * ratio + 'px, ' + this.y * ratio + 'px, 0)';
  };

  // Layer
  svg = d3.select('body')
          .append('svg')
            .attr('height', '100%')
            .attr('width', '100%')
            .attr('viewBox', '0 0 640 480')
            .attr('style', 'position: absolute; top: 0; left: 0;');

  // Contents
  circle = svg
    .append('circle')
      .attr('cy', 20)
      .attr('cx', 20)
      .attr('r', 20)
      .attr('fill', 'white');
}

function Pad (x) {
  var svg, rect;

  this.x = x;
  this.y = 0;

  this.move = function () {
    if (keyDown) {
      this.y += 4;
    }
    else if (keyUp) {
      this.y += -4;
    }

    // TODO: Take back in bounds checking
    //var height = 150
        //currentY = parseInt(pad.attr('y'), 10),
        //newY = currentY + offset;

    //if (newY < 0) {
      //pad.attr('y', 0);
    //}
    //else if (newY > 480 - 150) {
      //pad.attr('y', 480 - 150);
    //}
    //else {
      //pad.attr('y', newY);
    //}

    var ratio = rect[0][0].getBoundingClientRect().width / 20;
    svg[0][0].style['-webkit-transform'] = 'translate3d(' + this.x * ratio + 'px, ' + this.y * ratio + 'px, 0)';
  };

  // Layer
  svg = d3.select('body')
              .append('svg')
                .attr('height', '100%')
                .attr('width', '100%')
                .attr('viewBox', '0 0 640 480')
                .attr('style', 'position: absolute; top: 0; left: 0;');

  // Contents
  rect = svg
    .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', 150)
      .attr('width', 20)
      .attr('fill', 'white');
}
