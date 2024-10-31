/*
var progress = $alert.progress('Wait...');

var counter = 0; var factor = 1; var damping;
var timer = setInterval(function () { // timer function for progress bar
    counter = counter + factor;
    progress.update(counter)
    if (counter >= 10 && counter <= 59) {
        damping = Math.floor(Math.random() * (300 - 25)) + 6;
        factor = Math.max((100 - counter) / damping, '0.5');
    } else if (counter >= 60 && counter < 100) {
        damping = Math.floor(Math.random() * (50 - 25)) + 3;
        factor = Math.max((100 - counter) / damping, '0.5');
    } else if (counter > 100) {
        clearInterval(timer);
    };
}, 30);
*/


/*

console.log($exe.parseGeometry('600x800+10+20'));
console.log($exe.parseGeometry('80x40+auto+100'));
console.log($exe.parseGeometry('80x25-20-auto'));
console.log($exe.parseGeometry('70x70+5+5'));
console.log($exe.parseGeometry('-20+10'));
console.log($exe.parseGeometry('-20-30'));
console.log($exe.parseGeometry('autox400'));
console.log($exe.parseGeometry('80x40+10+100'));
console.log($exe.parseGeometry('80x25-20-30'));
console.log($exe.parseGeometry('500xauto-0-0'));

*/



/*
var obj = {foo:{bar:'ok'}};
console.log($io.obj.path(obj, 'foo.bar', 5));
console.log(obj.foo);
var obj = {foo:{bar:'ok'}};
console.log($io.obj.path(obj, 'foo.baz', 5));
console.log(obj.foo);

console.log($io.obj.path({foo:{bar:'ok'}}, 'foo.bar'));
console.log($io.obj.path({foo:{bar:{ok:'ok'}}}, 'foo.bar.ok'));
console.log($io.obj.path({foo:{bar:5}}, 'foo.bar.oops'));
console.log($io.obj.path({foo:{bar:5}}, 'foo.tootsie', 'yep'));
console.log($io.obj.path({foo:{bar:5}}, 'foo.bar', 'ok'));
console.log($io.obj.path.call('/', {dir:{'file.txt':'bla'}}, 'dir/file.txt'));
console.log($io.obj.path.call('/', {dir:{'file.txt':'bla'}}, '/dir/file.txt'));
console.log($io.obj.path.call('/', {dir:{'file.txt':'bla'}}, '/dir'));
console.log($io.obj.path.call('/', {dir:{'file.txt':'bla'}}, '/dir/'));
*/

/*
console.log(JSON.stringify($exe.parse('iframe --width=600 --height=330 --title="What If?" --icon=apps/matrix.png /c/programs/matrix/index.php'), null, 2));
console.log(JSON.stringify($exe.parse('iframe -bgv --g --width 600 --height=330 /c/programs/matrix/index.php'), null, 2));
console.log(JSON.stringify($exe.parse('iframe --foo.bar.baz=42 --foo.quux=5').options, null, 2));
console.log(JSON.stringify($exe.parse('iframe'), null, 2));
console.log(JSON.stringify($exe.parse('/c/programs/dangerous/index.html'), null, 2));





//$exe.stringify({width:300,heigth:200,bodyClass:"no 'scroll'",test:'et \'hop\'',hello:"world \"yo\"",url: "/c/files/images/png/lenna.png"});
//$exe.parse('cmd');
//$exe.parse('cmd hello -o=param');
//$exe.parse('cmd hello --option=param');
//$exe.parse('cmd --option=param hello');
//$exe.parse('cmd "hello world" --option=param');
//$exe.parse('cmd "--hello world" --option=param');
//$exe.parse('cmd --option="par am" "hello \"world\"');
//$exe.parse('cmd --option="param" "hello world"');
//$exe.parse('dora');
//$exe.parse('dora -h');
//$exe.parse('dora --help');
//$exe.parse('dora "a/toto caca.txt" --view="list" --nav');
//$exe.parse('dora "a/toto caca.txt" --list --nav');
//$exe.parse('dora "a/toto caca.txt" -l -n');
//$exe.parse('dora "a/toto caca.txt" -ln');
//$exe.parse('fx acid');
//$exe.parse('edit c/credits.html');
//$exe.parse('edit "a/toto caca.txt"');
//$exe.parse('3d yo #c3ff00');
//$exe.parse('3d "hello world!" #c3ff00');
*/



/*
$notif({delay:false, title:'uhyergfeurserguihseriughserghsiuerhgisuerhgusirhgergbgqerge-srgregesrgserughseurhgiuserghserguuiusergheiruhg', description:'uhyergfeurserguihseriughserghsiuerhgisuerhgusirhgergbgqergesrgregesrgserughseurhgiuserghserguuiusergheiruhg'});
$notif({title:'Totally not done!', description:'While checking the network registry hug index processing, windows93 spotted an error leading to blog posts annoncing a finally complete version! It\'s fortunatly not true, many updates are still coming ;)'});

for (var i = 0; i < 5; i++) {
  $notif('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum, deleniti?' + i);
}

$notif('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum, deleniti?');

setTimeout(function() {
  $notif({title:'KEEP CALM AND PREPARE FOR VERSION 2.0', description:'<iframe width="300" height="169" src="https://www.youtube.com/embed/Q6-2K-8KbqM?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe><br>JUNE 17 2015 : FREE UPGRADE TO WINDOWS93 2.0'}, document.getElementById('s42_feed'));
}, 600)

setTimeout(function() {
  $notif('Deuzzzzzzzz, bitches ???../////!!!!');
}, 1200)

setTimeout(function() {
  $notif('HOHOHOH', document.getElementById('s42_feed'));
}, 1500)
*/



/*!function() { 'use strict';

  // the array to be sorted
  var list = ['Delta', 'alpha', 'CHARLIE', 'bravo'];

  // temporary array holds objects with position and sort-value
  var mapped = list.map(function(el, i) {
    return { index: i, value: el.toLowerCase() };
  })

  // sorting the mapped array containing the reduced values
  mapped.sort(function (a, b) {
    return a.value.toLowerCase().localeCompare(b.value.toLowerCase())
  });

  // container for the resulting order
  var result = mapped.map(function(el){
    return list[el.index];
  });

  console.log(result);

}();*/

//$exe.call({silent:true}, 'img c/files/images/gif/headbang/band.gif');
//$exe('lisa');
//$exe('manifesto');
//$exe.call({silent:true}, 'solitude');
/*$exe.call({silent:true}, 'iframe /c/programs/demos/matrix/index.php');
//$exe.call({silent:true}, 'manifesto');
setTimeout(function () {
  $exe.call({silent:true}, 'glitch "#ui_window_0"');
}, 900)*/

//$exe.call({silent:true}, 'manifesto');
//$exe.call({silent:true}, 'lisa');
/*$exe.call({silent:true}, 'layer c/files/images/gif/welcomer23.gif');
setTimeout(function () {
  //$exe.call({silent:true}, 'ie6 "#ui_window_0"');
  //$exe.call({silent:true}, 'glitch "#ui_window_0"');
}, 900)*/

//$exe.call({silent:true}, 'layer c/files/images/gif/headbang/band.gif');

//$exe.call({silent:true}, 'layer c/files/images/gif/welcomer23.gif');
//$exe.call({silent:true}, 'hexak "c/files/roms/sms/games/Sonic Chaos.sms"');
//$exe.call({silent:true}, 'hexed "c/files/roms/sms/games/Sonic Chaos.sms"');
//$exe.call({silent:true}, 'hexak', 'a/calc.ico');
//$exe.call({silent:true}, 'img a/calc.ico');
//$exe.call({silent:true}, 'hexak a/poo.txt');

//$window({url:'c/files/movies/rr.html', height:300, width:400});

//$notif('four words per minute')
//$notif('Words per minute is a common metric for assessing reading speed and is often used in the context of remedial skills evaluation, as well as in the context of speed reading, where it is a controversial measure of reading performance. A word in this context is the same as in the context of speech. The average adult reads prose text at 250 to 300 words per minute. While proofreading materials, people are able to read at 200 wpm on paper, and 180 wpm on a monitor.[12] [Those numbers from Ziefle, 1998, are for studies that used monitors prior to 1992. See Noyes & Garland 2008 for a modern tech. view of equivalence]')


/*$tree("div b a section");
$tree("#ui section");
$tree(".ui.hot > section");
$tree(".test>section");
$tree(".ui>div>section");
$tree(".ui div>section");
$tree(".ui div section");*/

/////////////////////////////////////////////////////////////////////////////
//$exe('c/files/images/emoticons/');
//$exe('dora "a/.config/" --list --nav');
//$exe('dora "c/libs/" -l -n');
//$exe('dora c/sys/fonts/ -ln');
/*$explorer('a/emo.gif', {
  //types: [ /image\/.+/ ], //['image/jpeg', 'image/gif', 'image/png'],
  accept: 'image/*,.piskel,.pisk',
  save: true
});*/
/*$explorer('a/',  {
  browse:true,
  types: [ /text\/.+/ ]
});*/
/*$file.rename('a/folder/', 'toto', function(arg) {
  console.log(1, arg)
})*/
/*$explorer('a/',  {
  //browse:true,
  save:true,
  accept: 'text/*'
});*/
/////////////////////////////////////////////////////////////////////////////
/*$key('ctrl+s', function() {
  $alert('Save')
});*/
/*$key('ctrl+s', function() {
  $alert('Save')
});*/

/*$key(document.getElementById('w93_taskbar'), function(key) {
  console.log('taskbar', key);
});
$key(document.getElementById('w93_start'), 'up,up,down,down,a,b,enter', function(key) {
  console.log('konami', key);
});
*/

/*$key(function(key, code, e, pressed) {
  console.log('global', key, pressed);
  return false;
});*/

/*$key('.ui_icon', function(key, code, e, pressed) {
  console.log('ui_icon', this, key, pressed);
});*/

/*var keyInst = $key('#testArea', {
  '*': function(key) {
    //console.log('any key on textarea', key);
  },
  '/num_/': function(key) {
    console.info('numpad on textarea', key);
  },
  '/^[a-z]$/': function() {
    console.info('letter on textarea');
  },
  'up,up,down,down': function() {
    console.info('KONAMI CODE on textarea', this);
    this.value = 'KONAMI CODE';
  },
  'ctrl+alt': function() {
    console.info('ctrl+alt combo on textarea');
    this.value = 'CTRL+ALT';
  },
  'ctrl+alt,ctrl+space': function() {
    console.info('ctrl+alt,ctrl+space combo on textarea');
    this.value = 'CTRL+ALT,CTRL+SPACE';
  },
  'ctrl+alt,space': function() {
    console.info('ctrl+alt,space combo on textarea');
    this.value = 'CTRL+ALT,SPACE';
  },
  'ctrl+f': function() {
    console.info('search on textarea');
    this.value = 'SEARCH';
    return false;
  },
  'ctrl+s': function() {
    console.info('save on textarea');
    this.value = 'SAVE';
    return false;
  },
  'ctrl+n': function() {
    console.info('save on textarea');
    this.value = 'NEW';
    return false;
  },
  'ctrl+shift+c,ctrl+shift+l': function() {
    console.info('yeah on textarea');
    this.value = 'YEAH';
    return false;
  }
}, {preventDefault:!true, repeat:false});

$key('#s42_dock', function(key, code, e, pressed) {
  console.log('s42_dock', this, key, pressed);
});*/

//keyInst.destroy();


/*var keyInst = $key({
  '*': function(key) {
    console.log('any key on textarea', key);
  },
  '/num_/': function(key) {
    console.info('numpad on textarea', key);
  },
  '/^[a-z]$/': function() {
    console.info('letter on textarea');
  },
  'up,up,down,down': function() {
    console.info('KONAMI CODE on textarea', this);
    this.value = 'KONAMI CODE';
  },
  'ctrl+alt': function() {
    console.info('ctrl+alt combo on textarea');
    this.value = 'CTRL+ALT';
  },
  'ctrl+alt,ctrl+space': function() {
    console.info('ctrl+alt combo on textarea');
    this.value = 'CTRL+ALT,CTRL+SPACE';
  },
  'ctrl+alt,space': function() {
    console.info('ctrl+alt combo on textarea');
    this.value = 'CTRL+ALT,SPACE';
  },
  'ctrl+f': function() {
    console.info('search on textarea');
    this.value = 'SEARCH';
    return false;
  },
  'ctrl+s': function() {
    console.info('save on textarea');
    this.value = 'SAVE';
    return false;
  },
  'ctrl+n': function() {
    console.info('save on textarea');
    this.value = 'NEW';
    return false;
  },
  'ctrl+shift+c': function() {
    return false;
  },
  'ctrl+shift+c,ctrl+shift+l': function() {
    console.info('yeah on textarea');
    this.value = 'YEAH';
    return false;
  }
}, {thisArg:document.getElementById('testArea') ,preventDefault:!true, repeat:false});*/


/*$key({
  '*': function(key) {
    //console.log('* :', key);
  },
  'y,o': function() {
    console.info('YO!!!!');
  },
  'alt,alt': function() {
    console.info('double ALT');
  },
  'ctrl+f': function() {
    console.info('search');
  },
  'ctrl+space': function() {
    console.info('ctrl+space');
  },
  'ctrl+f,space': function() {
    console.info('search then reload');
  },
  'ctrl+f,ctrl+space': function() {
    console.info('search then open in new window');
  },
  'ctrl+shift+c,ctrl+shift+l': function() {
    alert('combo for console.log');
  }
}, {repeat:false});

$key('.ui_icon', function(key, code, e, pressed) {
  console.log('ui_icon', this, key, pressed);
});

$key('#testArea', {
  '*': function(key) {
    //console.log('any key on textarea', key);
  },
  '/num_/': function(key) {
    console.log('numpad on textarea', key);
  },
  '/^[a-z]$/': function() {
    console.log('letter on textarea');
  },
  'up,up,down,down': function() {
    console.log('KONAMI CODE on textarea');
    this.value = 'KONAMI CODE';
  },
  'ctrl+enter': function() {
    console.log('ctrl+enter combo on textarea');
  },
  'ctrl+f': function() {
    console.log('search on textarea');
  }
});

$key(document.getElementById('w93_start'), function(key, code, e, pressed) {
  console.log('start', key, pressed);
}, {preventDefault: true});

$key(document.getElementById('w93_taskbar'), {
  //'up,up,down,down,left,right,left,right,b,a,enter': function(key, code, e, pressed) {
  'up,up,down,down': function(key, code, e, pressed) {
    console.log('KONAMI CODE');
  }
});*/


/*$key('up,up,down,down,a,b,enter', function() {
  $alert('KONAMI \\m/')
});
$key('ctrl+k,ctrl+l', function() {
  $alert('K-L')
});*/



/*$exe('fx acid');
$exe('layer c/files/images/gif/headbang/band.gif');
setTimeout(function () {
  $exe('fx sepia #ui_window_0');
}, 600)*/

/*var mmm = $menu.extend(
  [
    {name: 'Maximize', action: function() {} },
    {name: 'Mini', action: function() {} },
    {name: 'Move', action: function() {} },
    {name: 'Big', action: function() {} },
    {name: '---'},
    {name: 'Open With...', items: [
      {name: 'Edit'},
      {name: 'HexEd'},
      {name: 'Textarea 1'},
      {name: '---'},
      {name: 'Other...', items: [
        {name: 'Ho pauv'},
        {name: 'Hello'}]},]},
    {name: '---'},
    {name: 'Close', action: function() {} }
  ],
  [
     {'7': [{name: 'Resize'}, {name: 'Workspace'}, {name: '---'}]}
    ,{'delete:5.4.0': ''}
    ,{'5.1': [{name: 'Yipaaaa'}]}
    ,{'replace:1': [{name: 'Minimize'}]}
    ,{'after:Textarea 1': [{name: 'Textarea 2'}]}
    ,{'after:Hello': [{name: 'World'}]}
    ,{'before:Close': [{name: 'FX'}, {name: '---'}]}
    ,{'delete:HexEd': ''}
    ,{'replace:Big': [{name: 'Fullscreen'}]}
  ]
);
$menu(le._icons, mmm, {
  position: {within: le._icons}
})*/

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


/*$db.set('test/subfoler/file.txt', 'blabla');
$db.set('test/subfoler/another/yo.txt', 'blabla');
$db.set('test/test1.txt', 'héhé');
$db.set('test/test.txt', 'héhé');
$db.set('test/test.json', '{"val": "héhé"}');
$db.set('test.json', '{"val": "héhé"}');
$db.set('bla.txt', '????');
$db.set('1', null);
$db.set('folder/', null);
$db.set('2/test/', null);
$db.set('bla.txt', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia provident saepe facilis reiciendis ipsam ex quo dolor nemo ratione similique illum repellat, velit assumenda sit, optio culpa numquam magnam modi.');
window.localStorage.setItem('ls.txt', 'hééééé oui');*/

/*$store.set('ls.txt', 'hééééé oui');
$db.set('json.json', {"text": "Lorem ipsum dolor sit amet.", number: 10});
$db.set('text.json', "Lorem ipsum.");
$db.set('number.json', {"k":100.5});
$db.set('hexa.json', {"k":0xbada55});
$db.set('array.json', {"k":[1,2,3]});
$db.set('null.json', {"k":null});
$db.set('Infinity.json', {"k":Infinity});
$db.set('NaN.json', {"k":NaN});
$db.set('dom.json', {"k": le._icons});
$db.set('undefined.json', {"k":undefined});
$db.set('function.json', {"k":function(arg) { 'use strict';
  console.log(arg)
}});
$db.set('blob.html', {"k":new Blob(['<a id="a"><b id="b">hey!</b></a>'], {
  type: "text/html;charset=utf-8"
})});
$db.set('cryo.json', {
  name: 'Toto',
  created: new Date(),
  hello: function() {
    console.log(this.name + ' said hello in ' + this.created.getFullYear() + '!');
  }
});
$db.set('function.js', function(arg) { 'use strict';
  console.log(arg)
});*/

/*$db.set('.config/Notes/note1.txt', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia provident saepe facilis reiciendis ipsam ex quo dolor nemo ratione similique illum repellat, velit assumenda sit, optio culpa numquam magnam modi.');
$db.set('.config/Notes/note2.txt', 'yo www.zombect.ro hahahahahahaha');

$db.set('bla.txt', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia provident saepe facilis reiciendis ipsam ex quo dolor nemo ratione similique illum repellat, velit assumenda sit, optio culpa numquam magnam modi.');
//window.localStorage.setItem('ls.txt', 'hééééé oui');
$store.set('ls.txt', 'hééééé oui');
$store.set('folder/ls.json', {ha:'bon'});
$db.set('folder/db.json', {ha:'bon'});
$db.set('folder2/db.json', {ha:'bon'});
//$db.set('folder2/txt.txt', "habon");
$db.set('folderEmpty/');

$db.set('blob.html', new Blob(['<a id="a"><b id="b">hey!</b></a>'], {
  type: "text/html;charset=utf-8"
}));

$ajax.buffer('c/files/images/emoticons/emoticon-games-025.gif', function(image) {
  $db.set('emo.gif', image, function(err, val) {
    //console.log(err, val);
    $file.scan('a/', function() {
      if (typeof cb == 'function') cb();
    });
  });
});
$ajax.buffer('c/files/images/emoticons/smiley-angry021.gif', function(image) {
  $db.set('explo.gif', image, function(err, val) {
    //console.log(err, val);
    $file.scan('a/', function() {
      if (typeof cb == 'function') cb();
    });
  });
});
$ajax.buffer('d/files/test.piskel', function(image) {
  $db.set('test.piskel', image, function(err, val) {
    //console.log(err, val);
    $file.scan('a/', function() {
      if (typeof cb == 'function') cb();
    });
  });
});
$ajax.buffer('d/files/test.psd', function(image) {
  $db.set('test.psd', image, function(err, val) {
    //console.log(err, val);
    $file.scan('a/', function() {
      if (typeof cb == 'function') cb();
    });
  });
});
$ajax.buffer('d/files/spritesheet.png', function(image) {
  $db.set('spritesheet.png', image, function(err, val) {
    //console.log(err, val);
    $file.scan('a/', function() {
      if (typeof cb == 'function') cb();
    });
  });
});
$ajax.buffer('d/files/maquereau.jpg', function(image) {
  $db.set('maquereau.jpg', image, function(err, val) {
    //console.log(err, val);
    $file.scan('a/', function() {
      if (typeof cb == 'function') cb();
    });
  });
});*/

/*$loader(['c/files/images/emoticons/emoticon-games-025.gif'], function(gif) {
  $db.set('emo.gif', new Blob([gif], {type: 'image/gif'}), function(err, val) {
    //console.log(err, val);
    $file.scan('a/', function() {
      if (typeof cb == 'function') cb();
    });
  });
})*/

/*setTimeout(function() {
  $file.scan('a/', function() {
    if (typeof cb == 'function') cb();
  });
}, 1000);*/
