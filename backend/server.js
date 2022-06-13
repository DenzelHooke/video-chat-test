const dotenv = require("dotenv").config();
const colors = require("colors");
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");

const PORT = 8080 || process.env.PORT;
const app = express();
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User has connected");
});

//*Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//* Routes
app.use("/auth/", require("./routes/authRoutes"));

server.listen(PORT, (e) => {
  console.log(`Server is running on port ${PORT}`.bgGreen.white);
});
