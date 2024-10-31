
// https://github.com/hunterloftis/cryo/tree/master/test

describe('RegExp', function() {

  it('should hydrate a RegExp', function() {
    var original = /foo/i;
    var stringified = $io.stringify(original);
    var hydrated = $io.parse(stringified);
    hydrated; // =>
    hydrated; // is a RegExp
    hydrated; // is equal to original
  });

});

describe('Function', function() {

  it('should hydrate a function', function() {
    var original = function(from, to) {
      return 'hello world from ' + from + ' to ' + to;
    };
    var stringified = $io.stringify(original);
    var hydrated = $io.parse(stringified);

    var result1 = original('Hunter', 'you');
    var result2 = hydrated('Hunter', 'you');
    assert.deepEqual(result1, result2);
  });

  /*it('should hydrate a function that has properties', function() {
    var original = function(from, to) {
      return 'hello world from ' + from + ' to ' + to;
    };
    original.attached = 'some property';
    var stringified = $io.stringify(original);
    var hydrated = $io.parse(stringified);

    var result1 = original('Hunter', 'you');
    var result2 = hydrated('Hunter', 'you');
    assert.deepEqual(result1, result2);
    assert.strictEqual(hydrated.attached, original.attached);
  });*/

});

describe('Boolean', function() {

  it('should hydrate a boolean true', function() {
    var original = true;
    var stringified = $io.stringify(original);
    var hydrated = $io.parse(stringified);

    assert.deepEqual(hydrated, original);
  });

  it('should hydrate a boolean false', function() {
    var original = false;
    var stringified = $io.stringify(original);
    var hydrated = $io.parse(stringified);

    assert.deepEqual(hydrated, original);
  });
});

describe('Array', function() {

  it('should hydrate a one-dimensional array', function() {
    var original = [1, 2, 3, 'a', 'b', 'c'];
    var stringified = $io.stringify(original);
    var hydrated = $io.parse(stringified);

    hydrated; // => is Array
    assert.deepEqual(hydrated, original);
  });

  it('should hydrate a multi-dimensional array', function() {
    var original = [
      [ 0, 1, 2 ],
      [ 3, 4, 5 ],
      [ 'a', 'b', 'c' ]
    ];
    var stringified = $io.stringify(original);
    var hydrated = $io.parse(stringified);

    hydrated; // => is Array
    hydrated; // is equal to original
    assert.deepEqual(hydrated, original);
  });

  /*it('should hydrate an array that has properties', function() {
    var original = [1, 2, 3];
    original.attached = 'some property';
    var stringified = $io.stringify(original);
    var hydrated = $io.parse(stringified);

    assert.isArray(hydrated);
    assert.strictEqual(hydrated.length, original.length);
    assert.strictEqual(hydrated[0], original[0]);
    assert.strictEqual(hydrated[2], original[2]);
    assert.strictEqual(hydrated.attached, original.attached);
  });*/

});

describe('Date', function() {

  it('should hydrate a date', function() {
    var original = new Date();
    var stringified = $io.stringify(original);
    var hydrated = $io.parse(stringified);
    hydrated; // => is a Date
    hydrated.getTime(); // => original.getTime()
    hydrated.getTime(); // is equal to original.getTime()
  })

  /*it('should hydrate a date that has properties', function() {
    var original = new Date();
    original.attached = 'some property';
    var stringified = $io.stringify(original);
    var hydrated = $io.parse(stringified);
    hydrated; // => is a Date
    hydrated.getTime(); // => original.getTime()
    hydrated.attached; // => original.attached
  })*/

});