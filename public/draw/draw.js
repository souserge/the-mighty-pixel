const socket = io.connect()

let grid = new Map(),
    colorPicker = null,
    palette = null,
    cnv = null

const sclValues = [4, 5, 6, 7, 8, 9, 10]
let sclIdx = 2
let scl = sclValues[sclIdx]
let isMouseOnCanvas = false

let scrollValueX = 0, scrollValueY = 0
let scrollStep = 10

function setup() {
  initUI()
  background(palette[globals.INIT_COLOR])
  textSize(32)
  fill(255)
  text("Loading canvas...", 18, 40)
  socket.on('grid', function(data) {
    bufferToGrid(data)
    handleCanvas()
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
  cnv = createCanvas(scl*globals.COLS, scl*globals.ROWS)
  cnv.parent('draw-place')
  cnv.id('cnv')

  $('#cnv').attr('oncontextmenu','return false')
  cnv.mouseOut(() => {isMouseOnCanvas = false})
  cnv.mouseOver(() => {isMouseOnCanvas = true})
  colorPicker = new EightBitColorPicker({ el: 'pick-color' })
  palette = EightBitColorPicker.getDefaultPalette()
}

function mousePressed() {
  handleMouse()
}

function mouseWheel(event) {
  if (!isMouseOnCanvas) return true;

  if (event.delta < 0) {
    scaleUp()
  }
  else {
    scaleDown()
  }
  handleCanvas()
  return false;
}

function handleCanvas() {
  resizeCanvas(scl*globals.COLS, scl*globals.ROWS)
  background(palette[globals.INIT_COLOR])
  drawGrid()
}

function mouseDragged() {
  handleMouse()
}

function handleMouse() {
  if (!focused || !isMouseOnCanvas) return

  const x = Math.floor((mouseX-28)/scl),
        y = Math.floor((mouseY-28)/scl) // Realy bad way of handling this
  if (x < 0 || x >= globals.COLS || y < 0 || y >= globals.ROWS) return

  const color = (mouseButton == LEFT) ? colorPicker.get8BitColor() : globals.INIT_COLOR
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

function scaleUp() {
  sclIdx = (sclIdx < sclValues.length - 1) ? sclIdx + 1 : sclIdx
  scl = sclValues[sclIdx]
}

function scaleDown() {
  sclIdx = (sclIdx > 0) ? sclIdx - 1 : sclIdx
  scl = sclValues[sclIdx]
}

function draw() {
    handleScroll()
}

function handleScroll() {
  if (keyIsDown(LEFT_ARROW)) {
    scrollValueX = (scrollValueX > scrollStep) ? scrollValueX - scrollStep : 0
    $("#draw-place").scrollLeft(scrollValueX)
  } else if (keyIsDown(RIGHT_ARROW)) {
    scrollValueX = (scrollValueX < width - scrollStep) ? scrollValueX + scrollStep : width - 1
    $("#draw-place").scrollLeft(scrollValueX)
  }
  if (keyIsDown(UP_ARROW)) {
    scrollValueY = (scrollValueY > scrollStep) ? scrollValueY - scrollStep : 0
    $("#draw-place").scrollTop(scrollValueY)
  } else if (keyIsDown(DOWN_ARROW)) {
    scrollValueY = (scrollValueY < height - scrollStep) ? scrollValueY + scrollStep : height - 1
    $("#draw-place").scrollTop(scrollValueY)
  }
}
