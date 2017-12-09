var expect = require('expect');
//destructure
var {Users} = require('./users');

describe('Users', ()=> {
    var users;
    
    beforeEach(()=>{
        users = new Users();
        users.users = [
            {id:'1',
            name:'Junior',
            room: 'Room 1' },
            {id:'2',
            name:'Julia',
            room: 'Room 1' },
            {id:'3',
            name:'Johanna',
            room: 'Room 2' }
        ];
    });

    it('should add new user',()=>{
        users = new Users();
        var user = {
            id:'1',
            name:'Teste',
            room: 'Teste 1'
        };
        var response= users.addUser(user.id, user.name,user.room);
        
        //assert to be invalid input 
        expect(users.users).toEqual([user]);

    });
    it('should return names for Room 1', ()=>{
        var userList = users.getUserList('Room 1');
        expect(userList).toEqual(['Junior','Julia']);
    });
    it('should return names for Room 2', ()=>{
        var userList = users.getUserList('Room 2');
        expect(userList).toEqual(['Johanna']);
    });

    it('should find a user', ()=>{
        var userId = '2';
        var user  = users.getUser(userId);

        expect(user.id).toBe(userId);
    });
    it('should not find a user', ()=>{
        var userId = '999';
        var user  = users.getUser(userId);

        expect(user).toBe(undefined);
    });

    it('should remove a user', ()=>{
        var userId = '1';
        var user  = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });
    it('should not remove a user', ()=>{
        var userId = '999';
        var user  = users.removeUser(userId);

        expect(user).toBe(undefined);
    });
});