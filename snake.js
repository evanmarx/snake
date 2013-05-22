function Snake(length, coords) {
  this.direction = [0, 1];
  this.positions = [];

  for (var i = 0; i < length; i++) {
    this.positions.push([coords[0], coords[1] - i]);
  }

  this.length = function() {
    return this.positions.length;
  };

  this.move = function() {
    for (var i = this.length() - 1; i > 0; --i) {
      this.positions[i][0] = this.positions[i - 1][0];
      this.positions[i][1] = this.positions[i - 1][1];
    }
    this.positions[0][0] += this.direction[0];
    this.positions[0][1] += this.direction[1];
  };

  this.turn = function(direction) {
    switch (direction) {
      case "east":
        this.direction = [0, 1];
        break;
      case "south":
        this.direction = [1, 0];
        break;
      case "west":
        this.direction = [0, -1];
        break;
      case "north":
        this.direction = [-1, 0];
        break;
    }
  };

  this.grow = function() {
    var last = this.positions[this.length()-1];
    var nextLast = this.positions[this.length()-2];
    var delta = [last[0]-nextLast[0], last[1]-nextLast[1]];
    var tail = [last[0] + delta[0], last[1] + delta[1]];
    this.positions.push(tail);
  };

}

function Board(size) {
  this.size = size;
  this.walls = [];

  this.grid = [];
  for(var i = 0; i < size; i++) {
    var temp = [];
    for (var j = 0; j < size; j++) {
      if(i == 0 || j == 0 || i == size - 1 || j == size -1) {
        temp.push("W");
        this.walls.push([i,j]);
      } else {
        temp.push('0');
      }
    }
    this.grid.push(temp);
  }

  this.set = function(coords, value) {
    this.grid[coords[0]][coords[1]] = value;
  };
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Game(size, length) {
  this.board = new Board(size);
  var mid = Math.floor(size/2);
  this.snake = new Snake(length, [mid,mid]);

  this.clearBoard = function() {
    for (var i = 0; i < size; ++i) {
      for (var j = 0; j < size; ++j) {
        var content = this.board.grid[i][j];
        if (content != "W" && content !="F") {
          this.board.set([i,j], '0');
        }
      }
    }
  };

  this.randomFood = function(amt) {
    for (var i = 0; i < amt; i++) {
      var randCoord = [null, null];
      randCoord[0] = getRandomInt(1, size-2);
      randCoord[1] = getRandomInt(1, size-2);
      this.board.set(randCoord, "F");
    }
  };

  this.updateBoard = function() {
    if(typeof keepTail == "undefined") {
      keepTail = false;
    }
    for (var i = 0, len = this.snake.length(); i < len; ++i) {
      var symbol = (i == 0) ? "H" : "B";
      this.board.set(this.snake.positions[i], symbol);
    }
  };

  this.snakeDead = function() {
    var headCoords = this.snake.positions[0];
    var deadPositions = this.snake.positions.slice(1).concat(this.board.walls);

    for (var i = 0, len = deadPositions.length; i < len; ++i) {
      if (deadPositions[i][0] == headCoords[0]
      && deadPositions[i][1] == headCoords[1]) {
        return true;
      }
    }

    return false;
  };

  this.snakeEating = function() {
    var headCoords = this.snake.positions[0];
    var foodPositions = [];

    var row = headCoords[0], col = headCoords[1];
    return this.board.grid[row][col] == "F";
  };

  this.step = function() {
    this.snake.move();
    this.clearBoard();
    if (this.snakeEating()) {
      this.snake.grow();
    }
    this.updateBoard();
  };
}
