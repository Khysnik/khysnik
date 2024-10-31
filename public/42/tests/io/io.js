
describe('$io', function(){
  describe('.is()', function(){
    it('return usefull type for any value', function() {
      $io.is('string'); // => 'String'
      $io.is(''); // => 'String'
      $io.is({foo:'bar'}); // => 'Object'
      $io.is([1,2,3]); // => 'Array'
      $io.is(new Error()); // => 'Error'
      $io.is(/test/); // => 'RegExp'
      $io.is(Date); // => 'Function'
      $io.is(0); // => 'Number'
      $io.is(42); // => 'Number'
      $io.is(true); // => 'Boolean'
      $io.is(new Date); // => 'Date'
      $io.is(location); // => 'Location'
      $io.is(window); // => 'Window'
      $io.is(document); // => 'Document'
      $io.is(document.querySelector('div')); // => 'Element'
      $io.is(document.querySelectorAll('div')); // => 'NodeList'
    })

    it('work with "arguments"', function() {
      (function() {
        $io.is(arguments); // => 'Arguments'
      }());
    })

    it('detect falsy value', function() {
      $io.is(null); // => 'Null'
      $io.is(undefined); // => 'Undefined'
      $io.is(); // => 'Undefined'
      $io.is(""); // => 'String'
      $io.is(0); // => 'Number'
      $io.is(NaN); // => 'NaN'
      $io.is(false); // => 'Boolean'
    })

    it('detect "NaN" and "Infinity"', function() {
      $io.is(NaN); // => 'NaN'
      $io.is('a'*1); // => 'NaN'
      $io.is(Infinity); // => 'Infinity'
      $io.is(1.7976931348623157e+308*2); // => 'Infinity'
    })
  })

  describe('.is.*()', function() {
    it('test if string', function() {
      $io.is.String('string'); // => true
      $io.is.String(1); // => false
      $io.is.String([]); // => false
      // aliases
      $io.is.str('string'); // => true
      $io.isString('string'); // => true
    })
    it('test if number', function() {
      $io.is.Number(1); // => true
      $io.is.Number('string'); // => false
      $io.is.Number([]); // => false
      // aliases
      $io.is.num(1); // => true
      $io.isNumber(1); // => true
    })
  })

  describe('.arr', function() {
    describe('.str', function() {
      it('convert array to string', function() {
        $io.arr.str([1]); // => "[1]"
        $io.arr.str([1,'a',true,,[0,'b']]);
        // => '[1, "a", true, undefined, [0, "b"]]'
        JSON.stringify([1,'a',true,,[0,'b']]);
        // => '[1,"a",true,null,[0,"b"]]'

        // aliases
        $io.Array.String([1,'a',true,,[0,'b']]);
        // => '[1, "a", true, undefined, [0, "b"]]'
      })
    })
    describe('.up', function() {
      it('move item up', function() {
        var arr = ["sky", "background", "ground", "flowers", "house"]
        $io.arr.up(arr, 'flowers')
        console.log(arr) // ["sky", "background", "ground", "flowers", "house"]
        $io.arr.up(arr, 'flowers')
        console.log(arr) // ["sky", "background", "ground", "house", "flowers"]
        $io.arr.up(arr, 'flowers')
        console.log(arr) // ["sky", "background", "ground", "house", "flowers"]
      })
    })
  })
})


/*console.log(arr) // ["background", "ground", "flowers", "house", "sky"]
$io.arr.bottom(arr, 'sky')
console.log(arr) // ["sky", "background", "ground", "flowers", "house"]*/

/*console.log(arr) // ["background", "ground", "flowers", "house", "sky"]
$io.arr.top(arr, 'flowers')
console.log(arr) // ["sky", "background", "ground", "flowers", "house"]*/


/*console.log(arr) // ["background", "ground", "flowers", "house", "sky"]
$io.arr.down(arr, 'sky')
console.log(arr) // ["background", "ground", "flowers", "sky", "house"]
$io.arr.down(arr, 'sky')
console.log(arr) // ["background", "ground", "sky", "flowers", "house"]
$io.arr.down(arr, 'sky')
console.log(arr) // ["background", "sky", "ground", "flowers", "house"]
$io.arr.down(arr, 'sky')
console.log(arr) // ["sky", "background", "ground", "flowers", "house"]
$io.arr.down(arr, 'sky')
console.log(arr) // ["sky", "background", "ground", "flowers", "house"]

$io.arr.up(arr, 'flowers')
console.log(arr) // ["sky", "background", "ground", "house", "flowers"]
$io.arr.up(arr, 'flowers')
console.log(arr) // ["sky", "background", "ground", "house", "flowers"]*/

/*

var arr = ["sky", "background", "ground", "flowers", "house"]
$io.arr.move(arr, 'flowers', -99)
console.log(arr) // ["sky", "background", "ground", "flowers", "house"]

*/