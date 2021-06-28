const moment=require('moment');
function formatMessage(username,content,imgFriend,socket){
    return{
        username,
        content,
        time:moment().format('h:mm a'),
        imgFriend,
        socket
    }
}

module.exports=formatMessage;