let connection = null,
    renderer = null,
    grid = null

function setup() {
  colorPicker = new EightBitColorPicker({ el: 'pick-color' })

  connection = new Connection((grd) => {
    grid = new Grid(grd, globals.ROWS, globals.COLS, globals.INIT_COLOR)
    renderer = new Renderer(width, height)
    handleCanvas()
  }, (idx, color) => {
    (color == globals.INIT_COLOR)
      ? grid.deletePixel(idx)
      : grid.setPixel(idx, color)
    const [x, y] = grid.idxToCoord(idx)
    renderer.renderPixel(x, y, color)
  })
  connection.connect()
}

function handleCanvas() {
  cnv = createCanvas(renderer.scl*globals.COLS, renderer.scl*globals.ROWS)
  cnv.parent('draw-place')
  cnv.id('cnv')
  $('#cnv').attr('oncontextmenu','return false')
  cnv.mouseOut(() => {isMouseOnCanvas = false})
  cnv.mouseOver(() => {isMouseOnCanvas = true})

  background(renderer.palette[globals.INIT_COLOR])
  renderer.renderGrid(grid)
}

function mousePressed() {
  handleMouse()
}

function mouseDragged() {
  handleMouse()
}

function handleMouse() {
  if (!focused || !isMouseOnCanvas) return

  const x = Math.floor((mouseX-28)/renderer.scl),
        y = Math.floor((mouseY-28)/renderer.scl) // Realy bad way of handling this
  if (x < 0 || x >= globals.COLS || y < 0 || y >= globals.ROWS) return

  const color = (mouseButton === LEFT) ? colorPicker.get8BitColor() : globals.INIT_COLOR
  if (color < 0 || color >= 256) return

  const idx = y*globals.COLS + x
  connection.sendPixel(idx, color)
  grid.setPixel(idx, color)
  renderer.renderPixel(x, y, color)
}
