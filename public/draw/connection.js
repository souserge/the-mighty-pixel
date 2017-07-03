class Connection {
  constructor(onGrid, onPixel) {
    this.socket = null
    this.onGrid = onGrid
    this.onPixel = onPixel
  }

  connect() {
    this.socket = io.connect()
    this._listenGrid()
  }

  _listenGrid() {
    this.socket.on('grid', (data) => {
      const keys = new Uint32Array(data.keys)
      const values = new Uint8Array(data.values)
      keys.forEach((k, i) => {
        grid.set(k, values[i])
      })

      this.onGrid(grid)
      this._listenPixel()
    })
  }

  _listenPixel() {
    this.socket.on('pixel', (data) => {
      const idx = data.idx[0],
            color = data.color[0]
      this.onPixel(idx, color)
    })
  }

  sendPixel(idx, color) {
    this.socket.emit('pixel', {
      idx: new Uint32Array([idx]),
      color: new Uint8Array([color])
    })
  }
}
