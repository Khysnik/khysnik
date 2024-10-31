
describe('undo', function(){

  it('create an undoManager', function() {
    var uM = $undo();
    uM.get();    // => []
    uM.add(1);   // => 1
    uM.get();    // => [1]
    uM.add(2);   // => 2
    uM.get();    // => [1,2]
    uM.each(function(arg) {
      console.log(arg); // => 1, 2
    });
    uM.undo();   // => 2
    uM.undo();   // => 1
    uM.undo();   // => undefined
    uM.undo();   // => undefined
    uM.get();    // => []
    uM.history();// => [1,2]
    uM.redo();   // => 1
    uM.get();    // => [1]
    uM.redo();   // => 2
    uM.get();    // => [1,2]
    uM.redo();   // => undefined
    uM.redo();   // => undefined
    uM.get();    // => [1,2]
    uM.history();// => [1,2]
    uM.each(function(arg) {
      console.log(arg); // => 1, 2
    });
    uM.undo();   // => 2
    uM.get();    // => [1]

    uM.clear();
    uM.history();// => []
    uM.add(3);   // => 3
    uM.undo();   // => 3
    uM.get();    // => []
    uM.redo();   // => 3
    uM.get();    // => [3]
  })

  it('overwrite previous redo', function() {
    var uM = $undo(['h','e','l','l','o']);
    uM.undo();
    uM.undo();
    uM.undo();
    uM.get(); // => ["h","e"]
    uM.add('y');
    uM.get(); // => ["h","e","y"]
    uM.history(); // => ["h","e","y"]
  })

  it('accept previously recorded undo history', function() {
    var uM = $undo(['h','e','l','l','o']);
    uM.get(); // => ['h','e','l','l','o']
    uM.undo();
    uM.get(); // => ['h','e','l','l']
  })

  it('have an "each" method', function() {
    var uM = $undo();
    uM.add('h');
    uM.add('e');
    uM.add('l');
    uM.add('l');
    uM.add('o');
    uM.undo();
    uM.each(function(arg) {
      console.log(arg); // => "h", "e", "l", "l"
    });
    uM.undo();
    uM.each(function(arg) {
      console.log(arg); // => "h", "e", "l"
    });
    uM.redo();
    uM.each(function(arg) {
      console.log(arg); // => "h", "e", "l", "l"
    });
    uM.redo();
    uM.each(function(arg) {
      console.log(arg); // => "h", "e", "l", "l", "o"
    });
    uM.redo();
    uM.each(function(arg) {
      console.log(arg); // => "h", "e", "l", "l", "o"
    });
  })

  it('allow "undo" and "redo" to have callbacks', function() {
    var uM = $undo(['h','e','l','l','o']);
    uM.get(); // => ['h','e','l','l','o']
    uM.undo(function(arg) {
      console.log(arg); // => 'o'
    });
    uM.get(); // => ['h','e','l','l']
    uM.redo(function(arg) {
      console.log(arg); // => 'o'
    });
    uM.get(); // => ['h','e','l','l','o']
  })

  it('add accept object with undo and redo methods', function() {
    var uM = $undo();
    uM.add({
      undo: function() {
        return 'undo action'
      },
      redo: function() {
        return 'redo action'
      }
    });
    uM.undo(function(arg) {
      console.log(arg); // => "undo action"
    });
    uM.redo(function(arg) {
      console.log(arg); // => "redo action"
    });
  })

  it('should work like ArthurClemens/Javascript-Undo-Manager', function() {

    // https://github.com/ArthurClemens/Javascript-Undo-Manager

    var uM = $undo(),
        people = {};

    function addPerson(id, name) {
      people[id] = name;
    };

    function removePerson(id) {
      delete people[id];
    };

    function createPerson(id, name) {

      // initial storage
      addPerson(id, name);

      // make undo-able
      uM.add({
        undo: function() {
          removePerson(id)
        },
        redo: function() {
          addPerson(id, name);
        }
      });
    }

    createPerson(101, "John");
    createPerson(102, "Mary");

    console.log(people);
    // => {101: "John", 102: "Mary"}

    uM.undo();
    console.log(people);
    // => {101: "John"}

    uM.undo();
    console.log(people);
    // => {}

    uM.redo();
    console.log(people);
    // => {101: "John"}

    uM.redo();
    console.log(people);
    // => {101: "John", 102: "Mary"}
  })
})