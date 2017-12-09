var expect = require('expect');
//destructure
var {isRealString} = require('./validation');

describe('isRealString', ()=> {
    it('should reject non-string values',()=>{
        var res = isRealString(98);
        
        //assert to be invalid input 
        expect(res).toBe(false);

    });

    it('should reject string with only spaces',()=>{
        var res = isRealString('   ');
        
        //assert to be invalid input 
        expect(res).toBe(false);
    });

    it('should allow string with non-space characters',()=>{
        var res = isRealString('Junior');
        
        //assert to be valid input 
        expect(res).toBe(true);
    });
});