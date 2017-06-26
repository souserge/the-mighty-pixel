const socket = io.connect()

let grid = new Map(),
    colorPicker = null,
    palette = null,
    canvas = null

let scl = 8
let isMouseOnCanvas = false

function setup() {
  initUI()
  background(palette[globals.INIT_COLOR])
  socket.on('grid', function(data) {
    console.log('received grid')
    bufferToGrid(data)
    drawGrid()

    socket.on('mouse', function(data) {
      const color = data.color[0],
            idx = data.idx[0]
      if (color == globals.INIT_COLOR) {
        grid.delete(idx)
      } else {
        grid.set(idx, color)
      }
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
  colorPicker = new EightBitColorPicker({ el: 'pick-color' })
  palette = EightBitColorPicker.getDefaultPalette()

  textSize(32);
  text("Loading canvas...", 10, 30);
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
  grid.set(idx, color)
  placePixel(x, y, color)
  socket.emit('mouse', {
    idx: new Uint32Array([idx]),
    color: new Uint8Array([color])
  })
}

function drawGrid() {
  grid.forEach((value, key) => {
    const x = key % globals.COLS,
          y = Math.floor(key / globals.COLS)
    placePixel(x, y, value)
  })
}

function placePixel(x, y, color) {
  noStroke()
  fill(palette[color])
  rect(x*scl, y*scl, scl, scl)
}

function bufferToGrid(data) {
  const keys = new Uint32Array(data.keys)
  const values = new Uint8Array(data.values)
  keys.forEach((k, i) => {
    grid.set(k, values[i])
  })
}
