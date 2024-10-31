describe('$extend', function() { // tests written by https://github.com/jgallen23/aug

  it('should override', function() {
    var o1 = { a: 1 };
    var o2 = { a: 2 };
    var o = $extend(o1, o2);
    console.log(o.a); // => 2
  })

  it('should extend', function() {
    var o1 = { a: 1 };
    var o2 = { b: 2 };
    var o = $extend(o1, o2);
    console.log(o.a); // => 1
    console.log(o.b); // => 2
  })

  it('should change first param', function() {
    var o1 = { a: 1 };
    var o2 = { b: 2 };
    var o = $extend(o1, o2);
    console.log(o1.a); // => 1
    console.log(o1.b); // => 2
    console.log(o1); // => o
  })

  it('should take N number of objects', function() {
    var o1 = { a: 1, d: 7 };
    var o2 = { a: 2, b: 4 };
    var o3 = { a: 3, b: 5, c: 1 };

    $extend(o1, o2, o3);

    console.log(o1.a); // => 3
    console.log(o1.b); // => 5
    console.log(o1.c); // => 1
    console.log(o1.d); // => 7

  })

  it('should extend prototypes', function() {
    var Class1 = function() {};
    Class1.prototype.test = function() {
      return true;
    };

    $extend(Class1.prototype, {
      test: function() {
        return false;
      },
      test2: function() {
        return true;
      }
    });
    var c = new Class1();
    console.log(c.test()); // => false
    console.log(c.test2()); // => true
    Class1.prototype.test3 = function() {
      return true;
    };
    console.log(c.test3()); // => true
  })

  it('should extend a function', function() {
    var f = function() {};
    $extend(f, {
      prop: 42
    });
    console.log(f.prop); // => 42
  })

  it('should extend prototypes', function() {
    Array.prototype.lulz = 42;
    var o = {};
    $extend(o, []);
    console.log(o.lulz); // => 42
  })

  describe('deep', function() {
    it('should take in option for deep extend', function() {
      var o1 = { a: { b: 1, c: 3 }, d: 1 };
      var o2 = { a: { b: 2 } };
      $extend(true, o1, o2);
      console.log(o1.a.b); // => 2
      console.log(o1.a.c); // => 3
      console.log(o1.d); // => 1
    });

    it('should handle deep extends if root doesn\'t exist', function() {
      var o1 = { };
      var o2 = { a: { b: 2 } };
      $extend(true, o1, o2);
      console.log(o1.a.b); // => 2
    });

    it('should handled multiple levels', function() {
      var o1 = { a: { b: { c: 0, d: 1 } } };
      var o2 = { a: { b: { c: 1 } } };
      $extend(true, o1, o2);
      console.log(o1.a.b.c); // => 1
      console.log(o1.a.b.d); // => 1
    });

    it('should take deep as a string', function() {
      var o1 = { a: { b: 1, c: 3 }, d: 1 };
      var o2 = { a: { b: 2 } };
      $extend('deep', o1, o2);
      console.log(o1.a.b); // => 2
      console.log(o1.a.c); // => 3
      console.log(o1.d); // => 1
    });
    it('deep alias', function() {
      var o1 = { a: { b: 1, c: 3 }, d: 1 };
      var o2 = { a: { b: 2 } };
      $extend.deep(o1, o2);
      console.log(o1.a.b); // => 2
      console.log(o1.a.c); // => 3
      console.log(o1.d); // => 1
    });
  })

  describe('strict', function() {
    it('should only copy if the property exists', function() {
      var o1 = { a: 1 };
      var o2 = { b: 2, a: 2 };
      $extend('strict', o1, o2);
      console.log(o1.a); // => 2
      console.log(o1.b); // => undefined
    });
    it('strict alias', function() {
      var o1 = { a: 1 };
      var o2 = { b: 2, a: 2 };
      $extend.strict(o1, o2);
      console.log(o1.a); // => 2
      console.log(o1.b); // => undefined
    });
  })

  describe('defaults', function() {

    it('should overwrite only whats existing in defaults', function() {
      var __dirname = __dirname || 'dir';
      var defaults = { debug: false, path: __dirname, enable: true };
      var opt = { debug: true, path: '/tmp/woot', fakeThing: 123 };
      var options = $extend('strict', $extend({}, defaults), opt);
      //console.log(options);
      console.log(options.debug); // => true
      console.log(options.enable); // => true
      console.log(defaults.debug); // => false
      console.log(defaults.path); // => __dirname
      console.log(options.path); // => '/tmp/woot'
      console.log(options.fakeThing); // => undefined
    });

    it('should work with multiple objects', function() {
      var __dirname = __dirname || 'dir';
      var defaults = { debug: false, path: __dirname, enable: true };
      var o1 = { debug: true, path: '/tmp/woot', fakeThing: 123 };
      var o2 = { debug: false, path: '/tmp/woot2', fakeThing: 123 };
      var options = $extend('strict', $extend({}, defaults), o1, o2);
      console.log(options.debug); // => false
      console.log(options.enable); // => true
      console.log(options.path); // => '/tmp/woot2'
      console.log(options.fakeThing); // => undefined
    });
  })

  describe('clone', function() {
    it('deep should clone objects', function() {
      var o1 = {foo:'foo'};
      var o2 = {foo:{bar:{baz:'baz'}}};
      var ex1 = $extend('deep', {}, o1, o2);
      var ex2 = $extend(o1, o2);
      console.log(ex1.foo.bar.baz); // => 'baz'
      console.log(ex2.foo.bar.baz); // => 'baz'
      o2.foo.bar.baz = 'nope';
      console.log(ex1.foo.bar.baz); // => 'baz'
      console.log(ex2.foo.bar.baz); // => 'nope'
    })
    it('clone alias', function() {
      var o1 = {foo:'foo'};
      var o2 = {foo:{bar:{baz:'baz'}}};
      var ex1 = $extend.clone(o1, o2);
      var ex2 = $extend(o1, o2);
      console.log(ex1.foo.bar.baz); // => 'baz'
      console.log(ex2.foo.bar.baz); // => 'baz'
      o2.foo.bar.baz = 'nope';
      console.log(ex1.foo.bar.baz); // => 'baz'
      console.log(ex2.foo.bar.baz); // => 'nope'
    })
  })

  describe('active', function() {
    it('set getter if option is a function and default is not', function() {
      var o1 = {foo:'foo', fun: function() {return 'fun'}};
      var o2 = {foo:function() {return 'foo as a getter'}, fun: function() {return 'fn2'}};
      console.log(o1.foo); // => 'foo'
      console.log(o1.fun()); // => 'fun'
      $extend('active', o1, o2);
      console.log(o1.fun()); // => 'fn2'
      console.log(o1.foo); // => 'foo as a getter'
    })
    it('getter function has obj as fisrt argument', function() {
      var o1 = {foo:'foo', bar:'baz'};
      var o2 = {foo:function(arg) {
        console.log(arg === o1); // => true
        return 'foo as a getter'
      }};
      $extend('active', o1, o2);
      o1.foo; // => 'foo as a getter'
    })
    it('active alias', function() {
      var o1 = {foo:'foo', bar:'baz'};
      var o2 = {foo:function(arg) {
        console.log(arg === o1); // => true
        return 'foo as a getter'
      }};
      $extend.active(o1, o2);
      o1.foo; // => 'foo as a getter'
    })
  })
})
