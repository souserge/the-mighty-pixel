const ROWS = 512
const COLS = 512

let scl = 8

const ipAddress = 'http://localhost:3000'
const socket = io.connect(ipAddress)

let grid = null
let colorPicker = null
let palette = null
let canvas = null

function setup() {
  canvas = createCanvas(scl*COLS, scl*ROWS)
  canvas.parent('draw-place')
  background(0)
  grid = new Array(ROWS*COLS).fill(15)
  colorPicker = new EightBitColorPicker({ el: 'pick-color' })
  palette = EightBitColorPicker.getDefaultPalette()

  socket.on('grid', function(data) {
    console.log("received grid")
    grid = data.grid
    drawGrid()
  })

  socket.on('mouse', function(data) {
    grid[data.idx] = data.color
    const x = data.idx % COLS,
          y = Math.floor(data.idx / COLS)
    placePixel(x, y, data.color)
  })
}

function mousePressed() {
  const x = Math.floor(mouseX/scl),
        y = Math.floor(mouseY/scl),
        color = colorPicker.get8BitColor(),
        idx = y*COLS + x

  grid[idx] = color
  placePixel(x, y, color)
  socket.emit('mouse', {
    idx,
    color
  })
}

function drawGrid() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      let idx = y*COLS + x //can be optimized
      placePixel(x, y, grid[idx])
    }
  }
}

function placePixel(x, y, color) {
  noStroke()
  fill(palette[color])
  rect(x*scl, y*scl, scl, scl)
}
