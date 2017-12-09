var socket = io();

function scrollToBottom(){
    //selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    //heights
    var clientHeight = messages.prop('clientHeight');//client visible area
    var scrollTop = messages.prop('scrollTop');//non visible area above client visible area
    var scrollHeight = messages.prop('scrollHeight');//total height of the container
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight+scrollTop + newMessageHeight + lastMessageHeight>= scrollHeight){
        console.log('Should scroll');
        messages.scrollTop(scrollHeight);
    }
}
socket.on('connect', function(){
    console.log('Client is connected to server');
    var params = jQuery.deparam(window.location.search);
    //join a room
    socket.emit('join', params, function(err){
        if (err){
            alert(err);
            window.location.href = '/';
        }
        else{
            console.log('no error');
        }
    });

});

socket.on('disconnect', function(){
    console.log('Client is disconnected from server');
});

//listen newMessage event from server
socket.on('newMessage', function(message){
    //mustache template
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template= jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
    // var formattedTime = moment(message.createdAt).format('h:mm a');
    // console.log('new message has arrived ', message);
    // var li=jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    // jQuery('#messages').append(li);
});

//listen newLocationMessage from server
socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template= jQuery('#location-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
    // var li=jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My current location</a>');
    
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
    // jQuery('#messages').append(li);
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