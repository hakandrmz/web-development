const express = require("express");
const bodyParser = require("body-parser");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var mongoose = require("mongoose");

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var dbUrl =
  "mongodb+srv://admin:hakan1905@chatapp.mpsiv.mongodb.net/ChatAppMessages?retryWrites=true&w=majority";

var Message = mongoose.model("Message", {
  name: String,
  message: String,
});

app.post("/messages", (req, res) => {
  var message = new Message(req.body);
  message.save((err) => {
    if (err) sendStatus(500);
    io.emit("message", req.body);
    res.sendStatus(200);
  });
});

io.on("connection", (socket) => {
  console.log("user connected");
});

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/messages", (req, res) => {
  Message.find({},(err,messages)=>{
    res.send(messages)
    
  })

});

var server = http.listen(3010, () => {
  console.log("Server has started. 3010");
});
