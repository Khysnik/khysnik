const ent = require('ent');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 8090;

//browser only?
io.set('origins', 'www.windows93.net:8090');

app.get('/', function(req, res) {
  res.end('nope');
});

var COLORS = [
  '#e21400', '#f78b00', '#f8a700', '#f78b00',
  '#58dc00', '#c3ff00', '#a8f07a', '#4ae8c4',
  '#3b88eb', '#ff00ff', '#a700ff', '#d300e7'
];

//urls
function validURL(str) {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!regex .test(str)) {
    return false;
  } else {
    return true;
  }
}

function islink(stri){
  test1 = stri.match(/\//);
  test2 = stri.match(/\./);
  if ((test1!=null)&&(test2!=null)){
      return true;
  }else{
      return false;
  }
}

var nickTimerList = [];
var user;
function nickAdd(name){
  user = new nickTimer(name);
  return user.life;
}
function nickTimer(name){
  var that = this;
  this.name = name;
  this.life = false;
  time = 1000;
  var test=true;
  for (var i = 0; i < nickTimerList.length; i++) {
    if (name==nickTimerList[i].name){
      test=false;
         for (var i = 0; i < nickTimerList.length; i++) {
          if(that.name==nickTimerList[i].name){ 
          clearTimeout(nickTimerList[i].floodTimer);
            nickTimerList[i].floodTimer = setTimeout(function(){ 
                 for (var j = 0; j < nickTimerList.length; j++) {
                  if(that.name==nickTimerList[j].name){
                    nickTimerList.splice( j, 1 );
                  }
                 };
            }, time);
          }
         };
    }
  };
  if (test) {
    this.floodTimer = setTimeout(function(){ 
         for (var i = 0; i < nickTimerList.length; i++) {
          if(that.name==nickTimerList[i].name){
            nickTimerList.splice( i, 1 );
          }
         };
     }, time);
    nickTimerList.push(this);
  }
  this.life = test;
}

function getUsernameColor (nick) {
  var hash = 7;
  for (var i = 0; i < nick.length; i++) {
     hash = nick.charCodeAt(i) + (hash << 5) - hash;
  }
  var index = Math.abs(hash % COLORS.length);
  return COLORS[index];
}

const users = {}
var magnets = [];
var pengs = [];
var userPengs = [];
var userOofs = [];
var userPengGiven = [];

function History (lines) {
  this.lines = lines || [];
  this.add = function (line) {
    this.lines.push(line)
    if (this.lines.length > 5) this.lines.shift()
  }
}

const history = new History()

io.on('connection', function (socket) {
  var oldnick;
  var oldcolor;
  var connected;
  var address = socket.handshake.address;
  var sHeaders = socket.handshake.headers;



  if (userPengGiven[address]==undefined) {
    userPengGiven[address]={pengs:[],Oofs:[]};
  }else{
    data={
      pengs:userPengGiven[address].pengs,
      Oofs:userPengGiven[address].Oofs
    }
    socket.emit('peng given',data);
  }

  magnets=[];
  io.emit('magnet index');

  socket.on('message', function (msg) {

    return;
    if (typeof msg !== 'string') return;
    if (socket.lastmsg === msg) return;
    if (nickAdd(socket.nick)==false) return;
    socket.lastmsg = msg;

    if (msg.match(/< *script(.*?)>/i)) {
      msg = "nope";
    };
    if (msg.match(/ो/i)) {
      msg = "nope";
    };    
 
    words = msg.split(" ");    
    msg = ent.encode(msg);
  
    var out = {
      date: Date.now(),
      nick: socket.nick,
      color: socket.color,
      style: socket.style,
      msg: msg
    };
    history.add(out);
    io.emit('message', out);
  });

  socket.on('user joined', function (nick, color, style, pass) { 
    
    nick = ent.encode(String(nick).trim()) || 'anonymous';
    if (nick==undefined) {nick='anonymous';};
    if (nick==null) {nick='anonymous';};
    if (nick=='undefined') {nick='anonymous';};
    if (nick=='null') {nick='anonymous';};

    if (nick==undefined) {return};
    if (nick==null) {return};
    if (nick.match(/&#127;/i)) {return}; 
    if (typeof nick != "string") {return};

    color = ent.encode(String(color).trim()) || getUsernameColor(nick);
    style = '';

    users[socket.id] = {}
    users[socket.id].nick = socket.nick = nick;
    users[socket.id].color = socket.color = color;
    users[socket.id].style = socket.style = style;

    if (!connected) {
      io.emit('user joined', users[socket.id]);
      connected = true;
    } else {
      
      io.emit('user change nick', {
        nick: oldnick,
        color: oldcolor,
        style: oldstyle
      }, users[socket.id]);
      
    }
    io.emit('update users', users);
    oldcolor = color;
    oldstyle = style;
    oldnick = nick;
  });

  socket.on('disconnect', function () {
    io.emit('user left', Object.assign({}, users[socket.id]));
    delete users[socket.id];
    io.emit('update users', users);
  });

    socket.on('magnet', function(data) {
        if (typeof data == "undefined"){return;};
        if (data.name.match(/< *script(.*?)>/i)) {return};
        if (data.nick.match(/< *script(.*?)>/i)) {return};
        data.name = ent.encode(data.name);
        data.nick = ent.encode(data.nick);
        data.nick =  data.nick.substring(0, 255);
        //data.pengs = ent.encode(data.pengs);        
        if (data.magnetURI.startsWith('magnet:?xt=')) {    
          //magnets.push(data);

          /*
          if(pengs[data.magnetURI]==undefined){
            pengs[data.magnetURI]={score:1, users:[]};
            pengs[data.magnetURI].users.push(address);
          }
          */

          io.emit('magnet', data);
          return; 
        }        
    });

    socket.on('magnet index', function(data) {

      
      for (var i = 0; i < data.length; i++) {
        magnets.push(data[i]);
      };
      var uniqueMagnet = [];
      var uniqueData = [];
      for (var i = 0; i < magnets.length; i++) {
          if (test=uniqueMagnet.includes(magnets[i].magnetURI)) {
          }else{
            uniqueMagnet.push(magnets[i].magnetURI);
            uniqueData.push(magnets[i]);
          }
      }; 
      magnets = uniqueData;
      for (var i = 0; i < magnets.length; i++) {
        id=magnets[i].infoHash;

        pPengs=0;
        pOofs=0;

        if (userPengs[id]!=undefined) {pPengs=userPengs[id].users.length};
        if (userOofs[id]!=undefined) {pOofs=userOofs[id].users.length};

        if ((userPengs[id]!=undefined)||(userOofs[id]!=undefined)) {
          magnets[i].pengs = pPengs-pOofs;
        }else{
          magnets[i].pengs = 0;
        }


        magnets[i].nick = ent.encode(magnets[i].nick);
      };
      io.emit('bonjour', magnets);
    }); 

    ///////////////////////////////////////////////////////////////////////////////////////////////

    socket.on('peng', function(id) {
      
      if (userPengs[id]==undefined) {userPengs[id]={users:[]};};
      if (userOofs[id]==undefined) {userOofs[id]={users:[]};};
      var index = userPengs[id].users.indexOf(address);
      if (index > -1) {
        //exist
        userPengs[id].users.splice(index, 1); //remove

        // userPengGiven
        var subIndex = userPengGiven[address].pengs.indexOf(id);
        if (subIndex > -1) {
          userPengGiven[address].pengs.splice(subIndex, 1); //remove
        }

      }else{
        //nope
        userPengs[id].users.push(address) // add
        userPengGiven[address].pengs.push(id)
      }
      score = userPengs[id].users.length-userOofs[id].users.length;
      data = {
        id: id,
        pengs: score
      };        
      io.emit('peng update', data);
  
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////

    socket.on('Oof', function(id) {

      if (userPengs[id]==undefined) {userPengs[id]={users:[]};};
      if (userOofs[id]==undefined) {userOofs[id]={users:[]};};
      var index = userOofs[id].users.indexOf(address);
      if (index > -1) {
        //exist
        userOofs[id].users.splice(index, 1); //remove

        var subIndex = userPengGiven[address].Oofs.indexOf(id);
        if (subIndex > -1) {
          userPengGiven[address].Oofs.splice(subIndex, 1); //remove
        }

      }else{
        //nope
        userOofs[id].users.push(address) // add
        userPengGiven[address].Oofs.push(id)
      }
      score = userPengs[id].users.length-userOofs[id].users.length;
      data = {
        id: id,
        pengs: score
      };        
      io.emit('peng update', data);

    });

    ///////////////////////////////////////////////////////////////////////////////////////////////

});

http.listen(port, function () {
  console.log('listening on http://localhost:' + port);
});