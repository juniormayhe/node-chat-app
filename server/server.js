const path = require('path');
const express= require('express');

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
    
    //a new message has arrived and emit it to client
    socket.emit('newMessage', {
        from: 'julia@example.com',
        text: 'hello',
        createdAt: 123
    });

    socket.on('createMessage', (newMessage)=> {
        console.log('client created message ', newMessage);
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
