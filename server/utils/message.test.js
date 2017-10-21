var expect = require('expect');
//destructure
var {generateMessage} = require('./message');

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