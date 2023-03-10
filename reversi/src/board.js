// DON'T TOUCH THIS CODE
if (typeof window === "undefined") {
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid() {
  let grid = [];
  while (grid.length < 8) {
    grid.push(new Array(8));
  }
  grid[3][4] = new Piece("black");
  grid[4][3] = new Piece("black");
  grid[3][3] = new Piece("white");
  grid[4][4] = new Piece("white");

  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board() {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  let x = pos[0];
  let y = pos[1];
  if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
    return true;
  } else {
    return false;
  }
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (this.isValidPos(pos)) {
    let x = pos[0];
    let y = pos[1];
    return this.grid[x][y];
  } else {
    throw new Error("Not valid pos!");
  }
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let piece = this.getPiece(pos);
  if (piece) {
    return piece.color === color;
  } else {
    return false;
  }
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  let piece = this.getPiece(pos);
  return !!piece;
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function (pos, color, dir, piecesToFlip) {
  if (!piecesToFlip) {
    piecesToFlip = [];
  }
  if (
    !this.isValidPos(pos) ||
    (!this.isOccupied(pos) && piecesToFlip.length !== 0) ||
    (this.isMine(pos, color) && piecesToFlip.length === 0)
  ) {
    return [];
  } else if (this.isMine(pos, color) && piecesToFlip.length !== 0) {
    piecesToFlip.shift();
    return piecesToFlip;
  } else {
    piecesToFlip.push(pos);
    let new_pos = [];
    new_pos[0] = pos[0] + dir[0];
    new_pos[1] = pos[1] + dir[1];
    return this._positionsToFlip(new_pos, color, dir, piecesToFlip);
  }
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  let positionsToFlip = [];
  for (let i = 0; i < Board.DIRS.length; i++) {
    positionsToFlip = positionsToFlip.concat(
      this._positionsToFlip(pos, color, Board.DIRS[i])
    );
  }
  if (!this.isOccupied(pos) && positionsToFlip.length > 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (!this.validMove(pos, color)) {
    throw new Error("Invalid move!");
  } else if (this.validMove(pos, color)) {
    // let x = pos[0];
    // let y = pos[1];
    // this.grid[x][y] = new Piece(color);
    let positionsToFlip = [];
    for (let i = 0; i < Board.DIRS.length; i++) {
      debugger;
      positionsToFlip = positionsToFlip.concat(
        this._positionsToFlip(pos, color, Board.DIRS[i])
      );
    }
    let x = pos[0];
    let y = pos[1];
    this.grid[x][y] = new Piece(color);
    for (let i = 0; i < positionsToFlip.length; i++) {
      let current_pos = positionsToFlip[i];
      x = current_pos[0];
      y = current_pos[1];
      this.grid[x][y].flip();
    }
  }
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let possibleMoves = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (this.grid[i][j] === undefined && this.validMove([i, j], color)) {
        possibleMoves.push([i, j]);
      }
    }
  }
  return possibleMoves;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length > 0;
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  if (this.hasMove("black") || this.hasMove("white")) {
    return false;
  } else {
    return true;
  }
};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  for (let i = 0; i < 8; i++) {
    let line = ""
    for (let j = 0; j < 8; j++) {
      if (!this.grid[i][j]) {
        line += "-";
      }else{
        line += this.grid[i][j].toString();
      }
    }console.log(line);
  }
};

// DON'T TOUCH THIS CODE
if (typeof window === "undefined") {
  module.exports = Board;
}
// DON'T TOUCH THIS CODE
