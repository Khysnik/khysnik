
/*describe('assert()', function(){
  it('should pass', function() {
    assert(true, 'pass');
  })

  it('should fail', function() {
    assert(false, 'just for testing failures');
  })

  it('should pass async', function(done) {
    setTimeout(function() {
      assert(true, 'async pass');
      done();
    }, 10);
  })

  it('should fail async', function(done) {
    setTimeout(function() {
      assert(false, 'yep, it failed');
      done();
    }, 10);
  })

  describe('assert.equal()', function(done) {
    it('should pass', function() {
      assert.equal(1+1, 2);
    })
    it('should fail', function() {
      assert.equal(1, 2);
    })
  })
})*/

describe('depict syntax', function(){
  /*it('should pass', function() {
    true; // => true
  })

  it('should fail', function() {
    false; // => true
  })

  it('should pass async', function(done) {
    setTimeout(function() {
      !!1; // => true
      done();
    }, 10);
  })

  it('should fail async', function(done) {
    setTimeout(function() {
      !!0; // => true
      done();
    }, 10);
  })*/

  it('is and has', function() {
    var arr = [1,'a',true,,[0,'b']];
    var obj = {foo:'bar'};
    var deepObj = { tea: { green: 'matcha' }};
    var divs = document.querySelectorAll('div');
    console.log(1);       // => 1
    console.log(1);       // => is equal to 1
    console.log('test');  // => is a string
    console.log(1);       // => is a number
    console.log(1*'a');   // => is NaN
    console.log(1*'a');   // => is not a number
    console.log([1]);     // => is not a number
    console.log([1]);     // => is an array
    console.log(1);       // => is equal to arr[0]
    console.log(1);       // => is not equal to arr[1]
    console.log('alf');   // => is below 'alien'
    console.log(10);      // => is above 5
    console.log(10);      // => is below 15
    console.log(10);      // => is within 5 and 15
    console.log(2);       // => is not above 5
    console.log(20);      // => is not below 15
    console.log('b');     // => is within a and c
    console.log('z');     // => is not within a and c
    arr.length;           // => 5
    console.log(obj);     // => has foo
    console.log(obj);     // => has a foo key
    console.log(obj);     // => has a foo prop
    console.log(obj);     // => has a foo whatever you want and is an object
    console.log(obj);     // => has foo of 'bar'
    console.log(obj);     // => has foo equal to 'bar'
    console.log(deepObj); // => has tea.green
    console.log(deepObj); // => has not tea.red
    console.log(arr);     // => has a length equal to 5
    console.log(arr);     // => has a length of 5
    console.log(arr);     // => has length
    console.log([1]);     // => has a length
    console.log(1);       // => has not a length
    console.log(1);       // => is a number and has not a length
    console.log(arr);     // => has length not equal to 1
    console.log(divs);    // => is a nodelist
    console.log(divs);    // => has length
    console.log(document);// => is Document
    (function fun() {
      // => is called once
      arguments; // => is Arguments
    }());
    function fun() {
      // => is not called
    }
  })

  it('match', function() {
    console.log('foo'); // => match /foo/
    console.log('foobar'); // => match /oob/g
    console.log('foo/bar'); // => match /foo\/bar/i
    console.log('foo bar'); // => match /foo bar/ig
    console.log('foo bar'); // => match /foo bar/i and is a string
    console.log('foo bar'); // => is a string and match /foo bar/i
    console.log('foo'); // => do not match /bar/i
    console.log('foo'); // => don't match /bar/i
  })

  it('satisfy', function() {
    function isMoreThanZero(num) { return num > 0; }
    console.log(1); // => satisfy isMoreThanZero
    console.log([1]); // => satisfy Array.isArray
    console.log(1); // => satisfy (function(num) { return num > 0; })
    console.log(1); // => satisfy function(num) { return num > 0; } and is a number
    console.log(1); // => do not satisfy function(num) { return num > 1; }
    console.log(1); // => is a number and don't satisfy function(num) { return num > 1; }
    console.log(1); // => is a number and do not satisfy function(num) { return num > 1; }
  })

  it.skip('pseudo sentences', function() {
    var obj = {foo:'bar'};
    var deepObj = { tea: { green: 'matcha' }};
    console.log(1);         // =>
    console.log(1);         // => 1
    console.log(1);         // is a number and is equal to 1
    console.log(null);      // is null
    console.log('test');    // is a string
    console.log([1]);       // is not a number
    console.log(deepObj);   // has tea equal to {green:'matcha'}
    console.log(deepObj);   // has tea.green
    console.log(deepObj);   // has not tea.red
    console.log(1);         // satisfy (function(num) { return num > 0; }) and is a number
    console.log('foo/bar'); // match /foo\/bar/i
  })

  it('called', function(done) {
    (function() {
      //: is called
      // => is called
      // is called once
      arguments; // => is Arguments
    }());

    function notCalled() {
      // is not called
      // never called
      //console.log('nope'); // => 'nope'
    }

    for (var i = 0; i < 5; i++) {
      // is called 5 times
    }

    setTimeout(function() {
      // is called once
      done();
    }, 10);

    function twice() {
      // is called 2
      // is called 2 times
      // is called twice
      /// is called 3 times
      // is not called thrice
      // is not called once
      // is not called 1
      // is not called 4
    }
    twice();
    twice();
  })

  /*it('shim basic sinonjs utilities', function() {
    function once(fn) {
      var returnValue, called = false;
      return function () {
        if (!called) {
          called = true;
          returnValue = fn.apply(this, arguments);
        }
        return returnValue;
      };
    }

    var proxy = once(function() {
      // is called
      // called once
    });

    proxy();
    proxy();

    var proxy2 = once(function() {
      // is called once
      console.log(this); // => obj
      console.log(arguments[0]); // => 1
      console.log(arguments); // => [1,2,3]
    });

    var obj = {};
    proxy2.call(obj, 1, 2, 3);
  })*/

  /*it('should pass various stress', function (done) {

    var str = 'ho'; str += ', yeah'; // => 'ho, yeah'
    typeof str;   // => 'string'
    1<=2;         // => true
    'foo';        //=> 'foo'
    {foo:"bar"};  // => { foo: 'bar' }
    [1,2,3];      // => [ 1, 2 ,3 ]
    [1,2,3];      // =>

    [1,'a',true,,[0,'b']];
    // => [1, 'a', true, undefined, [0, 'b']]

    console.log(); // => undefined

    console.log(1+1); // => 2

    function fun() {};

    console.log(fun); // =>

    // async test
    setTimeout(function() {
      console.log('logging inside tests', done);
      'async'; //=> 'async'
      done();
    }, 10);

    typeof "<b></b>";
    // => 'string'
    typeof 'AND a & b, OR  a | b, XOR a ^ b, NOT ~ a, a << b, a >> b, a >>> b';
    // => 'string'
    var a,b,dummyBitwise;
    dummyBitwise = [a & b, a | b, a ^ b, ~ a, a << b, a >> b, a >>> b];
    // =>

    var arr = [1,2,3];
    var index = arr.push(4); // index return the array length

    index; // => arr.length
    arr.length; // => 4

    var foobar = '';
    /test/.constructor.name;

    // => 'RegExp'

    var n = 5, o = 1; n+o; // => 6

    (function fun() {
      arguments; // =>
    }());
  })*/
})


describe('assertions in loops', function(){

  it('console.log in for loop', function() {
    var arr = [1,'2',3,'Yeah',[1,2]];
    for (var i = 0, l = arr.length; i < l; i++) {
      // is called
      // is called 5
      // is not called once
      console.log(arr[i]); // => 1, "2", 3, "Yeah", [1,2]
    }
    var arr = ['a',3];
    for (var i = 0, l = arr.length; i < l; i++) {
      console.log(arr[i]); // => 'a', 3
      console.log(arr[i] - 1); // => NaN, 2
    }
    var arr = ['a',[1]];
    for (var i = 0, l = arr.length; i < l; i++) {
      console.log(arr[i]); // => 'a', [1]
    }
    arr[1][0] = 2;
    for (var i = 0, l = arr.length; i < l; i++) {
      console.log(arr[i]); // => 'a', [2]
    }
  })

})