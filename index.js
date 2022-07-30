const express = require('express')
const app = express()

var http = require('http').createServer(app)
var WS = require('ws')

http.listen(8080);

var websocket = new WS.Server({ server: http, path: '/ws/' })

websocket.on('connection', function connection(socket) {
  socket.on('message', function message(data) {
    socket.send("ack " + data);
  });
  socket.send('something');
});

console.log("app running")

const client = require('prom-client');
const Registry = client.Registry;
const register = new Registry();

const gauge = new client.Gauge({
  name: 'app_active_sockets',
  help: 'metric_help',
  collect() {
    // Invoked when the registry collects its metrics' values.
    // This can be synchronous or it can return a promise/be an async function.
    this.set(websocket.clients.size);
  },
});


register.registerMetric(gauge);

app.get('/metrics', async (req, res) => {
        try {
                res.set('Content-Type', register.contentType);
                res.end(await register.metrics());
        } catch (ex) {
                res.status(500).end(ex);
        }
});
