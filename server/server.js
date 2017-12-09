const path = require('path');
const express= require('express');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var users = new Users();
var app     = express();
app.use(express.static(publicPath));

/*
sends a message to everybody 
io.emit 

sends a message to everybody in a room
io.to('room name').emit

send a message to everybody except current user
socket.broadcast.emit

send a message to everybody in a room except current user
socket.broadcast.to('room name').emit

send a message to a specific user
socket.emit
*/

var server  = app.listen(port, ()=>{
    console.log(`server is app at ${port}`);
});

var io = require('socket.io').listen(server);
io.on('connection', (socket)=> {
    console.log('.. new user connected');

    

    //event listener
    socket.on('join', (params, callback)=>{
    if (!isRealString(params.name) || !isRealString(params.room)) {
        
            return callback('Name and room name are required.');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        //send message to one user only 
        socket.emit('newMessage', 
        generateMessage('Admin',`${params.name}, welcome to the chat app`)
        );
        //send messate to everybody a new user joined chat app, 
        //EXCEPT the current user 
        socket.broadcast.to(params.room).emit('newMessage', 
            generateMessage('Admin', `${params.name} has joined the room ${params.room}`)
        );


        callback();
    });

    socket.on('createMessage', (message, callback)=> {
        console.log('client created message ', message);
        

        //emit event to every (ALL USERS) single connection
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
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });
    
    socket.on('disconnect', ()=>{
        var user = users.removeUser(socket.id);
        if (user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
             io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
        console.log('.. user was disconnected');
    });

      
});
console.log('Express + Socket IO server ----------------');
