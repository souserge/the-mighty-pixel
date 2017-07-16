const express = require('express'),
      socket = require('socket.io')

const config = require('./config'),
      GridStorageManager = require('./GridStorageManager'),
      gridTemplates = require('./gridTemplates')

const app = express(),
      server = app.listen(config.server.port),
      io = socket(server)

const storageManager = new GridStorageManager((error) => {
  console.log('Azure Blob error: ')
  console.log(error)
}, setupServer)

function setupServer() {
  if (!storageManager.isNew) {
    console.log('Downloading grid...')
    storageManager.download().then((gc) => {
      console.log('Download complete!')
      grid = gc[0]
      config.grid = gc[1]
      startServer(...gc)
    })
  } else {
    startServer(new Map(gridTemplates.charmander), config.grid)
  }
}

function startServer(grid, metadata) {
  process.on('SIGINT', () => {
    handleShutdown(grid, metadata)
  })
  process.on('SIGTERM', () => {
    handleShutdown(grid, metadata)
  })

  app.use(express.static('public'))
  console.log('server is running on PORT: ' + config.server.port)
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
      color === metadata.initColor ? grid.delete(idx) : grid.set(idx, color)
      socket.broadcast.emit('pixel', data) // broadcast to all EXCEPT the current socket
    })
  })
}

function handleShutdown(grid, metadata) {
  console.log('Uploading grid...')
  storageManager.upload(grid, metadata).then(() => {
    console.log('Upload complete!')
    console.log('Shutting down...')
    process.exit()
  })
}
