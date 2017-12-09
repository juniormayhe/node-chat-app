const path = require('path');
const express= require('express');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app     = express();
app.use(express.static(publicPath));
var server  = app.listen(port, ()=>{
    console.log(`server is app at ${port}`);
});

var io = require('socket.io').listen(server);
io.on('connection', (socket)=> {
    console.log('.. new user connected');

    //socket emit to the user who joined
    socket.emit('newMessage', 
        generateMessage('Admin','Welcome to the chat app')
    );
    //tells everybody a new user joined chat app, but the current user 
    socket.broadcast.emit('newMessage', 
        generateMessage('Admin', 'A new user joined chat room')
    );

    //event listener
    socket.on('join', (params, callback)=>{
        if (!isRealString(params.name) ||! isRealString(params.room))
        {
            callback('Name and room name are required.');
        }
        callback();
    });

    socket.on('createMessage', (message, callback)=> {
        console.log('client created message ', message);
        

        //emit event to every single connection
        io.emit('newMessage', 
            generateMessage(message.from,message.text)
        );
        //call method from client
        callback({ackMessage:'this is an ack from server'});

        //broadcast message to everyone but myself
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
    });
    
    //listen for send position from index/client
    socket.on('createLocationMessage', (coords)=> {
        //console.log(coords);
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });
    
    socket.on('disconnect', ()=>{
        console.log('.. user was disconnected');
    });


});
console.log('Express + Socket IO server ----------------');



// const path = require('path');
// const http = require('http');
// const express = require('express');
// const socketIO = require('socket.io');

// const publicPath = path.join(__dirname, '../public');
// const port = process.env.PORT || 3000;
// var app = express();
// var server = http.createServer(app);
// var io = socketIO(server);

// app.use(express.static(publicPath));

// io.on('connection', (socket) => {
//   console.log('New user connected');

//   socket.on('disconnect', () => {
//     console.log('User was disconnected');
//   });
// });

// server.listen(port, () => {
//   console.log(`Server is up on ${port}`);
// });
