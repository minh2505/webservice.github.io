const path = require('path');
const http=require('http'); 
const express=require('express');
const socketio=require('socket.io');
const formatMessage=require('./utils/messages');
const app=express();
const server=http.createServer(app);
const io = socketio(server);
var cors = require('cors')

app.use(cors())
//Set stactic folder
app.use(express.static(path.join(__dirname,'public')));
const botName='Swipe bot';
// chay khi client connect
io.on('connection',socket=>{
    console.log("New Ws Connection...."+socket.id);

   

    

    // disconect
  
    socket.on('join-room',room=>{
        console.log(room.roomId)
        socket.join(room.roomId);
        socket.Room=room.roomId;
        socket.UserFriend=room.nameFriendRoom;
        socket.ImagesFriend=room.imgFriendRoom;
        
    
   
    })
           //listen for chatMessage
           socket.on('chatMessage',msg=>{
            console.log(socket.Room)
            io.sockets.in(socket.Room).emit('message',formatMessage(socket.UserFriend,msg.content,socket.ImagesFriend,msg.port));
            
        });
        socket.on("upload-file",file=>{
            
            io.sockets.in(socket.Room).emit('message-upload',formatMessage(socket.UserFriend,file.link,socket.ImagesFriend,file.port));
           })
    socket.on('typping',data=>{
        
        var textTypping=`<div class="message typping">
        <img class="avatar-md" src="${data.img}" data-toggle="tooltip" data-placement="top" title="" alt="avatar" data-original-title="Keith">
        <div class="text-main">
            <div class="text-group">
                <div class="text typing">
                    <div class="wave">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>`
       socket.broadcast.to("room"+data.type).emit("I-typping",textTypping);
    })
    socket.on('stop-typping',stopTypping=>{
       io.emit('I-stop-typping');
    })
   
});

const PORT=3000||process.env.PORT;

server.listen(PORT,()=>console.log(`Server running on port ${PORT}`));