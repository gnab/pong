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

var leftPad = svg
      .append('rect')
        .attr('x', 30)
        .attr('y', 0)
        .attr('height', 150)
        .attr('width', 20)
        .attr('fill', 'white')

var ballStyle = 'position: absolute; top: 0; left: 0;';
var ball = d3.select('body')
      .append('svg')
      .attr('height', '100%')
      .attr('width', '100%')
      .attr('viewBox', '0 0 640 480')
      .attr('style', ballStyle);

ball
  .append('circle')
    .attr('cy', 20)
    .attr('cx', 20)
    .attr('r', 20)
    .attr('fill', '#ccc');

window.requestAnimFrame = (function(){
  return window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var speed = 4, direction = -Math.PI/4;

(function animloop(){
  render();
  requestAnimFrame(animloop);
})();

var x = 100,
    y = 100;

function render () {
  var dx = speed * Math.cos(direction),
      dy = -speed * Math.sin(direction);

  x += dx;
  y += dy;

  function flip(xy) {
    var sx = Math.cos(direction);
    var sy = Math.sin(direction);

    sx = sx * xy.x;
    sy = sy * xy.y;

    direction = Math.atan2(sy, sx);
  }

  if (x < 0) {
    flip({x: -1, y: 1});
    x = 0;
  }
  else if (x + 40 > 640) {
    flip({x: -1, y: 1});
    x = 640 - 40;
  }

  if (y < 0) {
    flip({x: 1, y: -1});
    y = 0;
  }
  else if (y + 40 > 480) {
    flip({x: 1, y: -1});
    y = 480 - 40;
  }

  var padY = parseInt(leftPad.attr('y'), 10);
  if ((x <= 30 + 20) && (y - 20 >= padY) && (y - 20 <= padY + 150)) {
    flip({x: -1, y: 1});
  }

  var ratio = board[0][0].getBoundingClientRect().width / 640;

  ball
    .attr('style', ballStyle + '-webkit-transform: translate3d(' + x * ratio + 'px, ' + y * ratio + 'px, 0)')
}

d3.select(document.body)
  .on('keydown', function () {
      var direction;
      // Down
      if (d3.event.keyCode === 40) {
        direction = 1;
      }
      // Up
      else if (d3.event.keyCode === 38) {
        direction = -1;
      }
      else {
        return;
      }

      var height = parseInt(leftPad.attr('height'), 10),
          currentY = parseInt(leftPad.attr('y'), 10),
          newY = currentY + 10 * direction;

      if (newY < 0) {
        leftPad.attr('y', 0);
      }
      else if (newY > 480 - height) {
        leftPad.attr('y', 480 - height);
      }
      else {
        leftPad.attr('y', newY);
      }
  });
