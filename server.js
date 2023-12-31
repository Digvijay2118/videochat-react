const express = require("express");
const http = require("http");
const cors = require("cors");


const app = express();

const server = http.createServer(app);
const io = require("socket.io")(server,{
    cors:{
        origin:"http://localhost:3000",
        methods :["GET","POST"]
    }
})

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req,res) => {
    res.send('Server is running.');
})

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
});

server.listen(5000, () => console.log("server is running on the port 5000"));
