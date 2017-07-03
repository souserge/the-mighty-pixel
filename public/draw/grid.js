class Grid {
  constructor(pixelMap, rows, cols, initColor) {
    this.pixels = pixelMap || new Map()
    this.rows = rows
    this.cols = cols
    this.initColor = initColor || 15
  }

  forEach(callback) {
    this.pixels.forEach((valColor, keyIdx) => {
      const [x, y] = this.idxToCoord(keyIdx)
      callback(x, y, valColor)
    })
  }

  idxToCoord(idx) {
    const x = idx % this.cols,
          y = Math.floor(idx / this.cols)
    return [x, y]
  }

  coordToIdx(x, y) {
    return y*this.cols + x
  }

  setPixel(idx, color) {
      this.pixels.set(idx, color)
  }

  deletePixel(idx) {
    this.pixels.delete(idx)
  }
}
