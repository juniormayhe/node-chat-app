var socket = io();
socket.on('connect', function(){
    console.log('Client is connected to server');


});

socket.on('disconnect', function(){
    console.log('Client is disconnected from server');
});

//listen newMessage event from server
socket.on('newMessage', function(message){
    console.log('new message has arrived ', message);
});