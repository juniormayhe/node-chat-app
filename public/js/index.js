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

//listen newLocationMessage from server
socket.on('newLocationMessage', function(message){
    
    var li=jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');
    
    li.text(`${message.from}:`);
    a.attr('href', message.url);
    li.append(a);
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
    var messageTextbox=jQuery('input[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function(data){
        //callback to clear after submit
        messageTextbox.val('');
        messageTextbox.focus();
        console.log('client got ack from server:', data.ackMessage);
    });
});

//deal with geolocation
var locationButton = jQuery('#send-location');
locationButton.on('click', ()=>{
    if (!navigator.geolocation){
        alert('Geolocation not supported by your browser');
        return;
    }
    locationButton.attr('disabled', 'disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(
        (position)=>{ 
            locationButton.removeAttr('disabled').text('Send location');
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            })
        },
         ()=>{ alert('Unable to get your location.');
         locationButton.removeAttr('disabled').text('Send location');
        });
});