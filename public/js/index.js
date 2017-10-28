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
    var li=jQuery('<li></li>');
    li.text(`${message.from} ${message.text}`);
    jQuery('#messages').append(li);
});

//event emitter and callback for acknowledgment
// socket.emit('createMessage', {
//     from: 'Frank',
//     text: 'Hi'
// }, function(data){
//     console.log('client got ack from server:', data.ackMessage);
// });

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();//avoid page refresh
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('input[name=message]').val()
    }, function(data){
        console.log('client got ack from server:', data.ackMessage);
    });
});