const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)

const cors = require('cors')

// Middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Run the server
const port = 3200
server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

// Run game logic
const { Main } = require('./src/main')
const main = new Main(server)

// Update the world at 60 FPS, broadcast game state at 15 fps
let lastUpdate = Date.now()
setInterval(() => {
  let now = Date.now()
  let dt = now - lastUpdate
  lastUpdate = now

  main.update(dt)
}, 1000.0 / 60.0)
setInterval(() => main.broadcast(), 1000.0 / 15.0)
