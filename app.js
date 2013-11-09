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
  var sx = Math.cos(direction),
      sy = Math.sin(direction),
      dx = speed * sx,
      dy = -speed * sy;

  x += dx;
  y += dy;

  if (x < 0 && sx < 0) {
    direction = Math.atan2(sy, -sx);
  }
  else if (x + 40 > 640 && sx > 0) {
    direction = Math.atan2(sy, -sx);
  }

  if (y < 0 && sy > 0) {
    direction = Math.atan2(-sy, sx);
  }
  else if (y + 40 > 480 && sy < 0) {
    direction = Math.atan2(-sy, sx);
  }

  var padY = parseInt(leftPad.attr('y'), 10);
  if (sx < 0 && (x <= 30 + 20) && (y - 20 >= padY) && (y - 20 <= padY + 150)) {
    direction = Math.atan2(sy, -sx);
  }

  var ratio = board[0][0].getBoundingClientRect().width / 640;

  ball
    .attr('style', ballStyle + '-webkit-transform: translate3d(' + x * ratio + 'px, ' + y * ratio + 'px, 0)')
}

d3.select(document.body)
  .on('keydown', function () {
      if (d3.event.keyCode === 40) {
        movePad(leftPad, 10);
      }
      else if (d3.event.keyCode === 38) {
        movePad(leftPad, -10);
      }
  });

function movePad(pad, offset) {
  var height = parseInt(pad.attr('height'), 10),
      currentY = parseInt(pad.attr('y'), 10),
      newY = currentY + offset;

  if (newY < 0) {
    pad.attr('y', 0);
  }
  else if (newY > 480 - height) {
    pad.attr('y', 480 - height);
  }
  else {
    pad.attr('y', newY);
  }
}
