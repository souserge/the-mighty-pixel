const express = require('express'),
      socket = require('socket.io'),
      globals = require('./public/globals')

const app = express(),
      port = process.env.port || process.env.PORT || 1337,
      server = app.listen(port),
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

  socket.on('mouse', function(data) {
    const idx = data.idx[0],
          color = data.color[0]
    if (color == globals.INIT_COLOR) {
      grid.delete(idx)
    } else {
      grid.set(idx, color)
    }
    socket.broadcast.emit('mouse', data) // broadcast to all EXCEPT the current socket
  })
})
