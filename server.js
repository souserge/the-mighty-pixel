const express = require('express'),
      socket = require('socket.io'),
      globals = require('./public/globals')

const app = express(),
      port = process.env.port || process.env.PORT || 1337,
      server = app.listen(port),
      io = socket(server),
      grid = new Array(globals.ROWS*globals.COLS).fill(globals.INIT_COLOR)


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
