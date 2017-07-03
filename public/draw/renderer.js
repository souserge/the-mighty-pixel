class Renderer {
  constructor(width, height, renderOffset, palette) {
    this.frameWidth  = width
    this.frameHeight = height
    this.renderOffset= renderOffset || 5
    this.palette = palette || EightBitColorPicker.getDefaultPalette()

    this.sclValues = [4, 5, 6, 7, 8, 9, 10]
    this.sclIdx = 2
    this.scl = this.sclValues[this.sclIdx]
  }

  renderGrid(grid) {
    grid.forEach((x, y, color) => {
      this.renderPixel(x, y, color)
    })
  }

  renderPixel(x, y, color) {
    noStroke()
    fill(this.palette[color])
    rect(x*this.scl, y*this.scl, this.scl, this.scl)
  }

  renderFrame() {
    //TODO: Optimize rendering
  }

  scaleUp() {
    this.sclIdx = (this.sclIdx < sclValues.length - 1) ? this.sclIdx + 1 : this.sclIdx
    this.scl = this.sclValues[this.sclIdx]
  }

  scaleDown() {
    this.sclIdx = (this.sclIdx > 0) ? this.sclIdx - 1 : this.sclIdx
    this.scl = this.sclValues[this.sclIdx]
  }
}
