describe('$kernel', function() { // tests written by https://github.com/jgallen23/aug

  it('events and stuff', function() {

    var system42 = $kernel({});
    system42.on('modules:ready', function(le) {
      console.log('modules:ready');
    });
    system42.on('boot:ready', function(le) {
      console.log('boot:ready');
    });

    system42(['modules', 'boot'], function(le) {
      console.log('YEEEEEEAAAAAh');
    });
    system42(['modules', 'boot'], function(le) {
      console.log('GNIAAAAAARRRGGG');
    });
    system42(['boot', 'modules'], function(le) {
      console.log('YEEEEESSSS');
    });

    system42(function(le, done) {
      console.log('splash', le, done);
      setTimeout(function() {
        done();
      }, 500);
    });

    system42(function(le) {
      console.log('splash', le);
    });

    system42('boot', function(le, done) {
      setTimeout(function() {
        done();
      }, 1000);
    });

    system42('modules');
    system42('boot');

  })

})