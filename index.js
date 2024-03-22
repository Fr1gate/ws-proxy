const ws = require("ws");

const ADDRESS = "ws://192.168.1.1:3000";

let clients = [];
let wsClient;

function connectToServer() {
  wsClient = new ws.WebSocket(ADDRESS);
  wsClient.on("open", () => {
    console.log("connected to server: ", ADDRESS);
  });
  wsClient.on("error", (err) => {
    console.log("error", err);
  });
  wsClient.on("message", handleWsClientMessage);
  wsClient.on("close", () => {
    setTimeout(connectToServer, 5000);
  });
}
connectToServer();

function handleWsClientMessage(rawData) {
  clients.forEach((client) => {
    client.send(rawData);
  });
}

const wsServer = new ws.WebSocketServer({
  port: 9000,
});

wsServer.on("connection", (connection) => {
  console.log("New client: ", connection.url);
  connection.on("message", (rawData) => {
    wsClient.send(rawData);
  });
  connection.on("close", () => {
    clients = clients.filter((c) => c !== connection);
  });
  clients.push(connection);
});
