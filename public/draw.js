const socket = io.connect()

let grid = null,
    colorPicker = null,
    palette = null,
    canvas = null

let scl = 8
let isMouseOnCanvas = false

function setup() {
  initUI()

  socket.on('grid', function(data) {
    console.log("received grid")
    grid = bufferToGrid(data.gridBuff)
    drawGrid()

    socket.on('mouse', function(data) {
      const color = data.color[0],
            idx = data.idx[0]
      grid[idx] = color
      const x = idx % globals.COLS,
            y = Math.floor(idx / globals.COLS)
      placePixel(x, y, color)
    })
  })
}

function initUI() {
  canvas = createCanvas(scl*globals.COLS, scl*globals.ROWS)
  canvas.parent('draw-place')
  canvas.mouseOut(() => {isMouseOnCanvas = false})
  canvas.mouseOver(() => {isMouseOnCanvas = true})

  background(0)
  grid = new Array(globals.ROWS*globals.COLS).fill(15) // Delete in production
  colorPicker = new EightBitColorPicker({ el: 'pick-color' })
  palette = EightBitColorPicker.getDefaultPalette()
}

function mousePressed() {
  handleMouse()
}

function mouseDragged() {
  handleMouse()
}

function handleMouse() {
  if (!focused || !isMouseOnCanvas) return

  const x = Math.floor(mouseX/scl),
        y = Math.floor(mouseY/scl)
  if (x < 0 || x >= globals.COLS || y < 0 || y >= globals.ROWS) return

  const color = colorPicker.get8BitColor()
  if (color < 0 || color >= 256) return

  const idx = y*globals.COLS + x
  grid[idx] = color
  placePixel(x, y, color)
  socket.emit('mouse', {
    idx: new Uint32Array([idx]),
    color: new Uint8Array([color])
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
