
describe('undo', function(){

  it('create an undoManager', function() {
    var h = $history()
    h.list     // => []
    h.add('a') // => 'a'
    h.list     // => ['a']
    h.add('b') // => 'b'
    h.list     // => ['a', 'b']
    h.undo()   // => 'a'
    h.undo()   // => undefined
    h.undo()   // => undefined
    h.current  // => 'a'
    h.redo()   // => 'b'
    h.current  // => 'b'
    h.redo()   // => undefined
    h.current  // => 'b'
  })


  it('create an undoManager', function() {
    var h = $history()
    h.list     // => []
    h.add(1)   // => 1
    h.list     // => [1]
    h.add(2)   // => 2
    h.list     // => [1,2]
    h.each(function(arg) {
      console.log(arg) // => 1, 2
    })
    h.undo()   // => 1
    h.undo()   // => undefined
    h.undo()   // => undefined
    h.list     // => [1]
    h.history  // => [1,2]
    h.redo()   // => 2
    h.list     // => [1,2]
    h.redo()   // => undefined
    h.list     // => [1,2]
    h.redo()   // => undefined
    h.redo()   // => undefined
    h.list     // => [1,2]
    h.history  // => [1,2]
    h.each(function(arg) {
      console.log(arg) // => 1, 2
    })
    h.undo()   // => 1
    h.list     // => [1]

    h.clear()
    h.list     // => []
    h.history  // => []
    h.add(3)   // => 3
    h.undo()   // => undefined
    h.add(4)   // => 4
    h.undo()   // => 3
    h.list     // => [3]
    h.redo()   // => 4
    h.list     // => [3, 4]
  })

  it('overwrite previous redo', function() {
    var h = $history(['h','e','l','l','o'])
    h.current   // => 'o'
    h.undo()
    h.undo()
    h.undo()
    h.list      // => ["h","e"]
    h.add('y')
    h.current   // => 'y'
    h.list      // => ["h","e","y"]
    h.history   // => ["h","e","y"]
  })

})