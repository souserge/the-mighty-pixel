const ROWS = 512,
      COLS = 512

const express = require('express'),
      socket = require('socket.io')
      app = express(),
      port = process.env.port || process.env.PORT || 443
      server = app.listen(port),
      io = socket(server),
      grid = new Array(ROWS*COLS).fill(15)


app.use(express.static('public'))
console.log("server is running on PORT: " + port)
io.sockets.on('connection', function(socket) {
  console.log('new connection: ' + socket.id)
  socket.emit('grid', {grid})

  socket.on('mouse', function(data) {
    grid[data.idx] = data.color
    socket.broadcast.emit('mouse', data) // broadcast to all EXCEPT the current socket
  });
});
