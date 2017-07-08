const express = require('express'),
      socket = require('socket.io'),
      config = require('./config')

const app = express(),
      port = config.server.port,
      server = app.listen(),
      io = socket(server),
      grid = new Map()

app.use(express.static('public'))
console.log("server is running on PORT: " + port)
io.sockets.on('connection', function(socket) {
  console.log('new connection: ' + socket.id)
  const keys = new Uint32Array(grid.keys())
  const values = new Uint8Array(grid.values())
  socket.emit('grid', {
    keys: Buffer.from(keys.buffer),

    values: Buffer.from(values.buffer)
  })

  socket.on('pixel', function(data) {
    const idx = data.idx[0],
          color = data.color[0]
    if (color === config.grid.initColor) {
      grid.delete(idx)
    } else {
      grid.set(idx, color)
    }
    socket.broadcast.emit('pixel', data) // broadcast to all EXCEPT the current socket
  })
})
