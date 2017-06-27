const socket = io.connect()

let grid = new Map(),
    colorPicker = null,
    palette = null,
    cnv = null

const sclValues = [3, 4, 5, 6, 7, 8, 9, 10]
let sclIdx = 0
let scl = sclValues[sclIdx]
let isMouseOnCanvas = false

let scrollValueX = 0, scrollValueY = 0
let scrollStep = 50

function setup() {
  initUI()
  background(palette[globals.INIT_COLOR])
  textSize(32)
  fill(255)
  text("Loading canvas...", 10, 30)
  socket.on('grid', function(data) {
    console.log('received grid')
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

  cnv.mouseOut(() => {isMouseOnCanvas = false})
  cnv.mouseOver(() => {isMouseOnCanvas = true})
  colorPicker = new EightBitColorPicker({ el: 'pick-color' })
  palette = EightBitColorPicker.getDefaultPalette()
  noLoop()
}

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  //cnv.position(x, y);
}

function windowResized() { //TODO: refactor to use mouseReleased()
  centerCanvas();
}

function mousePressed() {
  handleMouse()
}

function mouseWheel(event) {
  if (event.delta < 0) {
    scaleUp()
  }
  else {
    scaleDown()
  }
  handleCanvas()
}

function handleCanvas() {
  //scale(scl)
  resizeCanvas(scl*globals.COLS, scl*globals.ROWS);
  centerCanvas();
  background(palette[globals.INIT_COLOR])
  drawGrid()
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

function scaleUp() {
  sclIdx = (sclIdx < sclValues.length - 1) ? sclIdx + 1 : sclIdx
  scl = sclValues[sclIdx]
}

function scaleDown() {
  sclIdx = (sclIdx > 0) ? sclIdx - 1 : sclIdx
  scl = sclValues[sclIdx]
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    scrollValueX = (scrollValueX > 0) ? scrollValueX - scrollStep : scrollValueX
    console.log("left")
    $("#draw-place").scrollLeft(scrollValueX);
  } else if (keyCode === RIGHT_ARROW) {
    scrollValueX = (scrollValueX < width) ? scrollValueX + scrollStep : scrollValueX
    console.log("right")
    $("#draw-place").scrollLeft(scrollValueX);
  }
  if (keyCode === UP_ARROW) {
    scrollValueY = (scrollValueY > 0) ? scrollValueY - scrollStep : scrollValueY
    console.log("up")
    $("#draw-place").scrollTop(scrollValueY);
  } else if (keyCode === DOWN_ARROW) {
    scrollValueY = (scrollValueY < height) ? scrollValueY + scrollStep : scrollValueY
    console.log("down")
    $("#draw-place").scrollTop(scrollValueY);
  }
}
