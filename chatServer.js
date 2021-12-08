const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
let messages=[]
let users=[];


io.on("connection",(socket)=>{
    socket.on("user joined",(user)=>{
        console.log("user joined");
        
        users.push({userName:user.userName,id:user.id});
        socket.join(user.roomID)
    })
    socket.on("get all messages",()=>{
        io.emit("all messages", messages);               
    })
    socket.on("message",({userName,message})=>{
        console.log("userName",userName);
        messages.push({userName:userName,message:message})
        console.log("userName: " + userName,"message "+message);
        io.emit("all messages", messages);               
      })
      socket.on("disconnect",()=>{
          console.log("users",users);
      let temp =users.filter((user)=> user.id!==socket.id)
      console.log("temp" ,temp);
      if(temp.length===0){
          messages=[];
      }
      console.log("user disconnected");
      io.emit("all messages", messages);
      })
})


server.listen(process.env.PORT || 4001, () => {
    console.log(`listening of port ${process.env.PORT || 4001}`);
  });