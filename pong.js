var game = new Game().start();

function Game () {
  var keyboard = new Keyboard();
  var board = new Board(keyboard, 640, 480);
  var ball = new Ball(board);
  var leftPad = new Pad(board, 30);
  var rightPad = new Pad(board, board.width - 20 - 30);
  var computerPlayer = new FollowBall(rightPad, ball);

  this.start = function () {
    var self = this;

    !function loop () {
      self.render();
      onIdle(loop);
    }();

    return this;
  };

  this.render = function () {
    var sx = Math.cos(ball.direction),
        sy = Math.sin(ball.direction),
        x = ball.x,
        y = ball.y;

    var pad = leftPad;
    if (sx < 0 && (x <= pad.x + pad.width) && (y + 30 >= pad.y) && (y + 10 <= pad.y + pad.height)) {
      direction = Math.atan2(sy, -sx);
    }

    leftPad.move(keyboard.keyDown, keyboard.keyUp);
    computerPlayer.move();
    ball.move();
  };

  var onIdle = window.requestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.mozRequestAnimationFrame
      || function (callback) {
          window.setTimeout(callback, 1000 / 60);
        };
}

function Board (keyboard, width, height) {
  var svg, rect;

  this.width = width;
  this.height = height;

  // Layer
  svg = d3.select('body')
          .append('svg')
            .attr('height', '100%')
            .attr('width', '100%')
            .attr('viewBox', '0 0 ' + width + ' ' + height);

  // Contents
  rect = svg
          .append('rect')
            .attr('opacity', 0)
            .attr('height', '100%')
            .attr('width', '100%')
            .attr('fill', 'green')
            .transition()
              .duration(1000)
              .attr('opacity', 1);
}

function Ball (board) {
  var svg,
      circle;

  this.speed = 4;
  this.direction = Math.PI / 8;
  this.x = 100;
  this.y = 100;
  this.r = 20;
  this.d = this.r * 2;

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
    else if (this.x + this.d > board.width && sx > 0) {
      this.direction = Math.atan2(sy, -sx);
    }

    if (this.y < 0 && sy > 0) {
      this.direction = Math.atan2(-sy, sx);
    }
    else if (this.y + this.d > board.height && sy < 0) {
      this.direction = Math.atan2(-sy, sx);
    }

    var ratio = circle[0][0].getBoundingClientRect().width / this.d;
    svg[0][0].style['-webkit-transform'] = 'translate3d(' + this.x * ratio + 'px, ' + this.y * ratio + 'px, 0)';
  };

  // Layer
  svg = d3.select('body')
          .append('svg')
            .attr('height', '100%')
            .attr('width', '100%')
            .attr('viewBox', '0 0 ' + board.width + ' ' + board.height)
            .attr('style', 'position: absolute; top: 0; left: 0;');

  // Contents
  circle = svg
    .append('circle')
      .attr('cy', this.r)
      .attr('cx', this.r)
      .attr('r', this.r)
      .attr('fill', 'white');
}

function Pad (board, x) {
  var svg, rect;

  this.x = x;
  this.y = 0;
  this.height = 150;
  this.width = 20;

  this.move = function (down, up) {
    if (down) {
      this.y += 4;
    }
    else if (up) {
      this.y += -4;
    }

    if (this.y < 0) {
      this.y = 0;
    }
    else if (this.y > board.height - this.height) {
      this.y = board.height - this.height;
    }

    var ratio = rect[0][0].getBoundingClientRect().width / this.width;
    svg[0][0].style['-webkit-transform'] = 'translate3d(' + this.x * ratio + 'px, ' + this.y * ratio + 'px, 0)';
  };

  this.center = function () {
    this.y = board.height / 2 - this.height / 2;
  };

  // Initial positioning
  this.center();

  // Layer
  svg = d3.select('body')
              .append('svg')
                .attr('height', '100%')
                .attr('width', '100%')
                .attr('viewBox', '0 0 ' + board.width + ' ' + board.height)
                .attr('style', 'position: absolute; top: 0; left: 0;');

  // Contents
  rect = svg
    .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', this.height)
      .attr('width', this.width)
      .attr('fill', 'white');
}

function FollowBall (pad, ball) {
  this.move = function () {
    var padCenter = pad.y + pad.height / 2,
        ballCenter = ball.y + ball.r;

    pad.y = ballCenter - pad.height / 2;
    pad.move(false, false);
  };
}

function Keyboard () {
  var self = this;

  this.keyDown = false;
  this.keyUp = false;

  d3.select(document.body)
    .on('keydown', function () {
        if (d3.event.keyCode === 40) {
          self.keyDown = true;
        }
        else if (d3.event.keyCode === 38) {
          self.keyUp = true;
        }
    })
    .on('keyup', function () {
        if (d3.event.keyCode === 40) {
          self.keyDown = false;
        }
        else if (d3.event.keyCode === 38) {
          self.keyUp = false;
        }
    });
}
