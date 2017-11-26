var expect = require('expect');
//destructure
var {generateMessage,generateLocationMessage} = require('./message');

describe('generateMessage', ()=> {
    it('should generate correct message object',()=>{
        //store res in variable
        
        var from = 'Junior';
        var text = 'Hello world';
        var message = generateMessage(from, text);
        
        //assert from and  text
        expect(message).toMatchObject({from, text});

        //assert createdAt
        expect(typeof(message.createdAt)).toBe('number');
    });
});

describe('generateLocationMessage', ()=> {
    it('should generate correct location object',()=>{
        //store res in variable
        
        var from = 'Junior';
        var latitude= 1;
        var longitude= 2;
        var message = generateLocationMessage(from, latitude, longitude);
        
        //assert url
        expect(message.url).toBe(`https://www.google.com/maps?q=${latitude},${longitude}`);
        
        //assert createdAt
        expect(typeof(message.createdAt)).toBe('number');
    });
});