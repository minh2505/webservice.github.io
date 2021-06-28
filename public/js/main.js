const chatForm=document.getElementById("chat-form");
const chatMessages=document.querySelector(".chat-messages");

//get username
const { username , room }=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

var token = localStorage.getItem("token");
    console.log("Bearer_"+token)
    var user=JSON.parse(localStorage.getItem("user"))
    console.log(user)
const socket=io();
  //Message from server

  socket.on('message',message=>{
   console.log(message)
    if(message.socket===socket.id){
       
        outputMessageMe(message)
       
    }else{
        
        outputMessage(message)
    }
    
    
    //scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;
});
//server send file
socket.on("message-upload",message=>{
    console.log(message)
    if(message.socket===socket.id){
       if(message.content.includes('.png')||message.content.includes('.jpg')||message.content.includes('.jpeg')){
        outputUploadFileMeImage(message)
       }else if(message.content.includes('.mp4')||message.content.includes('.avi')){
           outputUploadFileMeVideo(message)
       }
       
       
    }else{
        if(message.content.includes('.png')||message.content.includes('.jpg')||message.content.includes('.jpeg')){
            outputUploadFileImage(message);
        }else if(message.content.includes('.mp4')||message.content.includes('.avi')){
            outputUploadFileVideo(message)
        }

    }
    
    
    //scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;
})
//Message sublit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    //get message text
    var idRoom=$(".babble .chat").attr("data-id-room");
    var now = new Date(Date.now());
    var formatted = now.getFullYear()+"-0"+now.getMonth()+"-0"+now.getDay()+" "+ now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    console.log(idRoom)
    const msg = e.target.elements.msg.value;
   
    const id=socket.id;
    const data={content:msg,port:id};
    //emit message to server
    socket.emit('chatMessage',data);
    console.log(formatted)
    console.log(idRoom)
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: "https://api-chat-web.herokuapp.com/api/messages",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Authorization': "Bearer_"+token,
        },
        data:JSON.stringify( {"channel_id":Number(idRoom),"user":user,"type":"text","content":msg,"status":1,"datetime":formatted,"reply":0}),
        contentType: 'application/json',
        
    }).always(function(data) {
       console.log(data)
    });
    //clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
    //stop typping
    $('.message.typping').remove();
    
});

socket.on('I-typping',typping=>{
    if($(".message.typping").length===0){
        $(`${typping}`).appendTo(".chat-messages");
    }
    

})

socket.on('I-stop-typping',typping=>{
    console.log($('.message').length)
    
    setTimeout(function(){ 
        $('.message.typping').remove();
}, 2000);
   

})

$(function () {
    $("#msg").keyup(function (e) { 
        socket.emit("stop-typping");
    });
    $("#msg").keydown(function (e) { 
        let typeRoom=$(".babble .chat").attr("data-id-room");
        let image=user.photo;
        let data={type:typeRoom,img:image}
        socket.emit("typping",data);
    });
});



//output message to DOM
function outputMessageMe(message){
    const div =document.createElement('div');
    div.classList.add('message');
    div.classList.add('me');
    div.innerHTML=`
  
    <div class="text-main">
        <div class="text-group me">
        <div class="text me">
        <p>${message.content}</p>
        </div>
        </div>
        <span>${message.time}</span>
    </div>
    `;
    document.querySelector(".chat-messages").appendChild(div);
}
function outputMessage(message){
    const div =document.createElement('div');
    div.classList.add('message');
    
    div.innerHTML=`
    <img class="avatar-md" src="${message.imgFriend}" data-toggle="tooltip" data-placement="top" title="" alt="avatar" data-original-title="Keith">
    <div class="text-main">
        <div class="text-group">
        <div class="text">
        <p>${message.content}</p>
        </div>
        </div>
        <span>${message.time}</span>
    </div>
    `;
    document.querySelector(".chat-messages").appendChild(div);
}
function outputMessageGet(message){
    const div =document.createElement('div');
    const time=message.datetime;

    div.classList.add('message');
    
    div.innerHTML=`
    <img class="avatar-md" src="${message.user.photo}" data-toggle="tooltip" data-placement="top" title="" alt="avatar" data-original-title="Keith">
    <div class="text-main">
        <div class="text-group">
        <div class="text">
        <p>${message.content}</p>
        </div>
        </div>
        
    </div>
    `;
    document.querySelector(".chat-messages").appendChild(div);
}
function outputUploadFileMeImage(message){
    const div =document.createElement('div');
    div.classList.add('message');
    div.classList.add('me');
    div.innerHTML=`
  
    <div class="text-main">
        <div class="text-group">
        <div class="img-upload">
        <img src="${message.content}" alt="" style="max-width:200px">
        </div>
        </div>
       
    </div>
    `;
    document.querySelector(".chat-messages").appendChild(div);
}
function outputUploadFileImageGet(message){
    const div =document.createElement('div');
    div.classList.add('message');
    
    div.innerHTML=`
    <img class="avatar-md" src="${message.user.photo}" data-toggle="tooltip" data-placement="top" title="" alt="avatar" data-original-title="Keith">
    <div class="text-main">
        <div class="text-group">
        <div class="img-upload">
        <img src="${message.content}" alt="" style="max-width:200px">
        </div>
        </div>
       
    </div>
    `;
    document.querySelector(".chat-messages").appendChild(div);
}
function outputUploadFileImage(message){
    const div =document.createElement('div');
    div.classList.add('message');
    
    div.innerHTML=`
    <img class="avatar-md" src="${message.imgFriend}" data-toggle="tooltip" data-placement="top" title="" alt="avatar" data-original-title="Keith">
    <div class="text-main">
        <div class="text-group">
        <div class="img-upload">
        <img src="${message.content}" alt="" style="max-width:200px">
        </div>
        </div>
       
    </div>
    `;
    document.querySelector(".chat-messages").appendChild(div);
}
function outputUploadFileMeVideo(message){
    const div =document.createElement('div');
    div.classList.add('message');
    div.classList.add('me');
    div.innerHTML=`
  
    <div class="text-main">
        <div class="text-group">
        <div class="file-video">
			<video width="230" height="200" controls>
			    <source src="${message.content}" type="video/mp4">	
			 </video>
		</div>
        </div>
       
    </div>
    `;
    document.querySelector(".chat-messages").appendChild(div);
}
function outputUploadFileVideo(message){
    const div =document.createElement('div');
    div.classList.add('message');
    
    div.innerHTML=`
    <img class="avatar-md" src="${message.imgFriend}" data-toggle="tooltip" data-placement="top" title="" alt="avatar" data-original-title="Keith">
    <div class="text-main">
        <div class="text-group">
        <div class="file-video">
        <video width="230" height="200" controls>
            <source src="${message.content}" type="video/mp4">	
         </video>
        </div>
        </div>
       
    </div>
    `;
    document.querySelector(".chat-messages").appendChild(div);
}
function outputUploadFileVideoGet(message){
    const div =document.createElement('div');
    div.classList.add('message');
    
    div.innerHTML=`
    <img class="avatar-md" src="${message.user.photo}" data-toggle="tooltip" data-placement="top" title="" alt="avatar" data-original-title="Keith">
    <div class="text-main">
        <div class="text-group">
        <div class="file-video">
        <video width="230" height="200" controls>
            <source src="${message.content}" type="video/mp4">	
         </video>
        </div>
        </div>
       
    </div>
    `;
    document.querySelector(".chat-messages").appendChild(div);
}
//get user
$(function () {
    
    $.ajax({
        type: "GET",
        dataType: 'json',
        
        url: "https://api-chat-web.herokuapp.com/api/user",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Authorization': "Bearer_"+token,
        },
        
        contentType: 'application/json',
       
    }).done(function(data) {
        localStorage.setItem("user",JSON.stringify(data))
        $(`<button class="btn"><img class="avatar-xl" src="${data.photo}" alt="avatar"></button>`).prependTo(".inside .nav")
    });
    // Display list friend
    $.ajax({
        type: "GET",
        dataType: 'json',
        
        url: "https://api-chat-web.herokuapp.com/api/friend",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Authorization': "Bearer_"+token,
        },
        
        contentType: 'application/json',
       
    }).always(function(data) {

        for(let i=0;i<data.length;i++){
          
            $(`<a href="#" class="filterMembers all online contact" data-toggle="list" data-id-friend="${data[i].friend.id}" data-name="${data[i].friend.name}" data-img="${data[i].friend.photo}">
        <img class="avatar-md" src="${data[i].friend.photo}" data-toggle="tooltip" data-placement="top" title="" alt="avatar" data-original-title="Janette">
        <div class="status">
            <i class="material-icons online">fiber_manual_record</i>
        </div>
        <div class="data">
            <h5>${data[i].friend.name}</h5>
           
        </div>
        <div class="person-add">
            <i class="material-icons">person</i>
        </div>
    </a>`).appendTo("#contacts")
   
        }
       
    });
    //Display list chanel
    $.ajax({
        type: "GET",
        dataType: 'json',
        
        url: "https://api-chat-web.herokuapp.com/api/channel/user",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Authorization': "Bearer_"+token,
        },
        
        contentType: 'application/json',
       
    }).always(function(data) {
    

    });
    //Click friend to create chanel chat
    $(document).on('click', '#contacts a', function() {
        let idFriend=$(this).attr("data-id-friend").split(".com").join("");
        
        let nameFriend=$(this).attr("data-name");
        let imgFriend=$(this).attr("data-img");
        let imgMe=$(".inside .nav .btn img").attr("src");
        $.ajax({
            type: "GET",
            dataType: 'json',
            
            url: "https://api-chat-web.herokuapp.com/api/channel/find/"+idFriend,
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
                'Authorization': "Bearer_"+token,
            },
            
            contentType: 'application/json',
           
        }).always(function(data) {
            if($("#nav-tabContent .babble").attr("data-id-friend")===""){
                $("#nav-tabContent .babble").attr("data-id-friend",idFriend);
            $("#nav-tabContent .babble .chat").attr("data-id-room",data.id);
                $("#nav-tabContent .babble .chat .inside a img").attr("src",imgFriend)

                $("#nav-tabContent .babble .chat .inside .data h5 a").text(nameFriend);
                $("#nav-tabContent .babble").addClass("active show")
                let dataJoin={roomId:"room"+data.id,imgFriendRoom:imgMe,nameFriendRoom:nameFriend}
                socket.emit("join-room",dataJoin);
                $.ajax({
                    type: "GET",
                    dataType: 'json',
                    
                    url: "https://api-chat-web.herokuapp.com/api/messages/"+data.id,
                    headers: {
                        "Content-Type": "application/json",
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': "Bearer_"+token,
                    },
                    
                    contentType: 'application/json',
                   
                }).always(function(data) {
                    data.map((val)=>{
                        
                        if(val.user.id===user.id){
                            if(val.type==="text"){
                                outputMessageMe(val) 
                            }
                            
                            if(val.type==="image"){
                                outputUploadFileMeImage(val)
                            }
                            if(val.type==="video"){
                                outputUploadFileMeVideo(val)
                            }
                        }else{
                            if(val.type==="image"){
                               
                                outputUploadFileImageGet(val)
                            }
                            if(val.type==="text"){
                                outputMessageGet(val);
                            }
                            if(val.type==="video"){
                                outputUploadFileVideoGet(val)
                            }
                        }
                    })
                    console.log(data)
                //    for(let i=0;i<data.length;i++){
                //     if(data[i].user.id===user.id){
                //         console.log(typeof data[5].content)
                //         if(data[i].content.includes('.png')||data[i].content.includes('.jpg')){
                //             outputUploadFileMeImage(data[i])
                //         }
                //         outputMessageMe(data[i])
                        
                //     }else{
                //         if(data[i].content.includes('.png')||data[i].content.includes('.jpg')){
                //             outputUploadFileImage(data[i])
                //         }
                //         console.log(data[i].content)
                //         outputMessageGet(data[i]);
                //     }
                //    }
                });
            }else if($("#nav-tabContent .babble").attr("data-id-friend")!==""&&$("#nav-tabContent .babble").attr("data-id-friend")!==idFriend){
                $("#nav-tabContent .babble").attr("data-id-friend",idFriend);
                $("#nav-tabContent .babble .chat").attr("data-id-room",data.id);
                    $("#nav-tabContent .babble .chat .inside a img").attr("src",imgFriend)
    
                    $("#nav-tabContent .babble .chat .inside .data h5 a").text(nameFriend);
                    $("#nav-tabContent .babble").addClass("active show")
                    //message null to get new user
                    $("#nav-tabContent .babble .chat .content .chat-messages").empty();
                    let dataJoin={roomId:"room"+data.id,imgFriendRoom:imgMe,nameFriendRoom:nameFriend}
                    socket.emit("join-room",dataJoin);
                    $.ajax({
                        type: "GET",
                        dataType: 'json',
                        
                        url: "https://api-chat-web.herokuapp.com/api/messages/"+data.id,
                        headers: {
                            "Content-Type": "application/json",
                            'Access-Control-Allow-Origin': '*',
                            'Authorization': "Bearer_"+token,
                        },
                        
                        contentType: 'application/json',
                       
                    }).always(function(data) {
                        console.log(data)
                       for(let i=0;i<data.length;i++){
                        if(data[i].user.id===user.id){
                            outputMessageMe(data[i])
                        }else{
                            outputMessageGet(data[i]);
                        }
                       }
                    });
            }
            


               
        }).fail(function (data){
            console.log(data)
            $.ajax({
                type: "POST",
                dataType: 'json',
                url: "https://api-chat-web.herokuapp.com/api/channel/create/"+idFriend,
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': "Bearer_"+token,
                },
                contentType: 'application/json',
                
            }).always(function(data) {
                console.log(data)
               
                $("#nav-tabContent .babble .chat").attr("data-id-room",data.id);
                $("#nav-tabContent .babble .chat .inside a img").attr("src",imgFriend)
                $("#nav-tabContent .babble .chat .inside .data h5 a").text(nameFriend);
                $("#nav-tabContent .babble").addClass("active show")
                let dataJoin={roomId:"room"+data.id,imgFriendRoom:imgMe,nameFriendRoom:nameFriend}
                socket.emit("join-room",dataJoin);
            });
        });
  
    });
 

//send file

$("#nav-tabContent .babble .chat .container label input").click(function (e) { 
    console.log("a")
    var formData = new FormData();
    var attach=$(this)[0].files[0];
    formData.append('file', attach); 
   
   console.log(attach)
   console.log(formData)
   
    $.ajax({
        type: "POST",
        
        url: "https://api-chat-web.herokuapp.com/api/messages/uploadFile",
        headers: {
            
            'Access-Control-Allow-Origin': '*',         
            'Authorization': "Bearer_"+token,
        },
        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        processData: false, // NEEDED, DON'T OMIT THIS
        enctype: 'multipart/form-data',
        data:formData,
       timeout:5000
       
        
    }).done(function(data){
        console.log(data)
        var idRoom=$(".babble .chat").attr("data-id-room");
        var now = new Date(Date.now());
        var formatted = now.getFullYear()+"-0"+now.getMonth()+"-0"+now.getDay()+" "+ now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        let id=socket.id;
        let linkfile=data.linkfile
        let file={port:id,link:linkfile}
        socket.emit("upload-file",file);
        console.log(linkfile.includes('png'))
        if(linkfile.includes('png')||linkfile.includes('jpeg')||linkfile.includes('jpg')){
            $.ajax({
                type: "POST",
                dataType: 'json',
                url: "https://api-chat-web.herokuapp.com/api/messages",
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': "Bearer_"+token,
                },
                data:JSON.stringify( {"channel_id":Number(idRoom),"user":user,"type":"image","content":linkfile,"status":1,"datetime":formatted,"reply":0}),
                contentType: 'application/json',
                
            }).always(function(data) {
               console.log(data)
            });
        }else if(linkfile.includes('.mp4')||linkfile.includes('.avi')){
            $.ajax({
                type: "POST",
                dataType: 'json',
                url: "https://api-chat-web.herokuapp.com/api/messages",
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': "Bearer_"+token,
                },
                data:JSON.stringify( {"channel_id":Number(idRoom),"user":user,"type":"video","content":linkfile,"status":1,"datetime":formatted,"reply":0}),
                contentType: 'application/json',
                
            }).always(function(data) {
               console.log(data)
            });
        }
        
    })

    
});

});


