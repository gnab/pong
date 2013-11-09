var game = new Game().start();

function Game () {
  var keyboard = new Keyboard(),
      board = new Board(keyboard, 640, 480),
      ball = new Ball(board),
      leftPad = new Pad(board, 30),
      rightPad = new Pad(board, board.width - 20 - 30),
      player = new Player(keyboard, leftPad),
      computer = new ComputerPlayer(ball, rightPad),
      stopped = true;

  this.start = function () {
    var self = this;

    stopped = false;

    !function loop () {
      if (stopped) {
        return;
      }
      self.render();
      onIdle(loop);
    }();

    return this;
  };

  this.stop = function () {
    stopped = true;
  };

  this.render = function () {
    var sx = Math.cos(ball.direction),
        sy = Math.sin(ball.direction),
        x = ball.x,
        y = ball.y;

    ball.move();
    player.move();
    computer.move();

    ball.render();
    leftPad.render();
    rightPad.render();

    if (leftPad.hit(ball) || rightPad.hit(ball)) {
      ball.flipX();
    }

    if (board.hitX(ball)) {
      this.stop();
    }
    else if (board.hitY(ball)) {
      ball.flipY();
    }
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

  this.hitX = function (ball) {
    var sx = Math.cos(ball.direction);

    if (ball.x < 0 && sx < 0) {
      return true;
    }
    else if (ball.x + ball.d > this.width && sx > 0) {
      return true;
    }

    return false;
  };

  this.hitY = function (ball) {
    var sy = Math.sin(ball.direction);

    if (ball.y < 0 && sy > 0) {
      return true;
    }
    else if (ball.y + ball.d > this.height && sy < 0) {
      return true;
    }

    return false;
  };

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
  };

  this.render = function () {
    var ratio = circle[0][0].getBoundingClientRect().width / this.d;
    svg[0][0].style['-webkit-transform'] = 'translate3d(' + this.x * ratio + 'px, ' + this.y * ratio + 'px, 0)';
  };

  this.flipX = function () {
    var sx = Math.cos(this.direction),
        sy = Math.sin(this.direction);

    this.direction = Math.atan2(sy, -sx);
  };

  this.flipY = function () {
    var sx = Math.cos(this.direction),
        sy = Math.sin(this.direction);

    this.direction = Math.atan2(-sy, sx);
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

  this.render = function () {
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

  this.hit = function (ball) {
    return false;

    //var pad = leftPad;
    //if (sx < 0 && (x <= pad.x + pad.width) && (y + 30 >= pad.y) && (y + 10 <= pad.y + pad.height)) {
      //direction = Math.atan2(sy, -sx);
    //}
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

function Player (keyboard, pad) {
  this.move = function () {
    if (keyboard.keyDown) {
      pad.y += 4;
    }
    else if (keyboard.keyUp) {
      pad.y += -4;
    }
  };
}

function ComputerPlayer (ball, pad) {
  this.move = function () {
    var padCenter = pad.y + pad.height / 2,
        ballCenter = ball.y + ball.r;

    pad.y = ballCenter - pad.height / 2;
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
