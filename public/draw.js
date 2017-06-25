const socket = io.connect()

let grid = null,
    colorPicker = null,
    palette = null,
    canvas = null

let scl = 8

function setup() {
  initUI()

  socket.on('grid', function(data) {
    console.log("received grid")
    grid = bufferToGrid(data.gridBuff)
    drawGrid()

    socket.on('mouse', function(data) {
      grid[data.idx] = data.color
      const x = data.idx % globals.COLS,
            y = Math.floor(data.idx / globals.COLS)
      placePixel(x, y, data.color)
    })
  })
}

function initUI() {
  canvas = createCanvas(scl*globals.COLS, scl*globals.ROWS)
  canvas.parent('draw-place')
  background(0)
  grid = new Array(globals.ROWS*globals.COLS).fill(15)
  colorPicker = new EightBitColorPicker({ el: 'pick-color' })
  palette = EightBitColorPicker.getDefaultPalette()
}

function mousePressed() {
  const x = Math.floor(mouseX/scl),
        y = Math.floor(mouseY/scl),
        color = colorPicker.get8BitColor(),
        idx = y*globals.COLS + x

  grid[idx] = color
  placePixel(x, y, color)
  socket.emit('mouse', {
    idx,
    color
  })
}

function drawGrid() {
  let idx = 0
  for (let y = 0; y < globals.ROWS; y++) {
    for (let x = 0; x < globals.COLS; x++) {
      placePixel(x, y, grid[idx++])
    }
  }
}

function placePixel(x, y, color) {
  noStroke()
  fill(palette[color])
  rect(x*scl, y*scl, scl, scl)
}

function bufferToGrid(buff) {
  return new Uint8Array(buff)
}
