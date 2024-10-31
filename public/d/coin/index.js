//console.log('yo');

// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8087;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static('www'));

// Chatroom

var numUsers = 0;
var TAIL=[];
var users = []



  //
  global.btoa = function (str) {return new Buffer(str).toString('base64');};
  //
  function int2ip (ipInt) {
      return ( (ipInt>>>24) +'.' + (ipInt>>16 & 255) +'.' + (ipInt>>8 & 255) +'.' + (ipInt & 255) );
  }
  //
  function ip2int(ip) {
      ip = ip.replace(/[\[\].]+/g, '');
      ip = ip.replace(/[\[\]:]+/g, '');
      str =  ''+parseInt(ip, 16);
      str = str.slice(0, -4);
      if (str.length>7) {
        str = str.substr(''+str.length-7);
      }; 
      if(str[0]=="0"){str="1"+str.slice(1)}
    return str;
  }
  //
  function toHex(input) {
    var hash = "",
      alphabet = "0123456789abcdef",
      alphabetLength = alphabet.length;

    do {
      hash = alphabet[input % alphabetLength] + hash;
      input = parseInt(input / alphabetLength, 10);
    } while (input);
    return hash;
  }
  //
  function uniq(a) {
      var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

      return a.filter(function(item) {
          var type = typeof item;
          if(type in prims)
              return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
          else
              return objs.indexOf(item) >= 0 ? false : objs.push(item);
      });
  }
  //
  function getHome(address){
      home = btoa(toHex(ip2int(address)));
      home = ""+home;
      home = home.replace(home.substring(home.length-1), "");
      return home; 
  }
  //



 function parseBlockchain(id){
      var token = 0
      for (var i = 1; i < necronomiCoin.blockchain.length; i++) {
        for (var j = 0; j < necronomiCoin.blockchain[i].data.length; j++) {
          if (necronomiCoin.blockchain[i].data[j].recipient==id) {
            token=token+necronomiCoin.blockchain[i].data[j].quantity;
          };
          if (necronomiCoin.blockchain[i].data[j].sender==id) {
            token=token-necronomiCoin.blockchain[i].data[j].quantity;
          };
        };
      };


      /*

      for (var i = 0; i < necronomiCoin.blockchain.length; i++) {
         if (necronomiCoin.blockchain[i].data.miner==id){
            token=token+1
         }

         if (necronomiCoin.blockchain[i].data.sender==id){
            token=token-necronomiCoin.blockchain[i].data.quantity;
         }

         if (necronomiCoin.blockchain[i].data.recipient==id){
            token=token+necronomiCoin.blockchain[i].data.quantity;
         }
      }

      */

      return token;

}

function userExist(id){
  for (var i = 1; i < necronomiCoin.blockchain.length; i++) {
        for (var j = 0; j < necronomiCoin.blockchain[i].data.length; j++) {
          if (necronomiCoin.blockchain[i].data[j].recipient==id) {
            return true;
          };
        };
    };
    for (var i = 0; i < users.length; i++) {
      if(users[i]==id){
        return true;
      }
    };
    return false;
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};



io.on('connection', function (socket) {
  var addedUser = false;
  var home = getHome(socket.handshake.address);


    socket.emit('home', home);
    socket.emit('blockchain', necronomiCoin);


  if (addedUser) return;



    users.push(home)

    // we store the username in the socket session for this client
    socket.username = home;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('update users', users);


  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });


  socket.on('addNewBlock', function (data) {

    if (mining==false) {return;};

    //console.log(data)

    if (testBlock(data,necronomiCoin.difficulty)) {
        
        /*
        if (parseInt(data.data.quantity)>parseBlockchain(data.data.sender)) {
          return
        }else{
          

        }
        */

        //data.data.miner=home;


        data.data = [
          {recipient:home,quantity:1}
        ]

        for (var i = 0; i < TAIL.length; i++) {
          //data.data.push(TAIL[i])
          data.data.push({sender:TAIL[i].sender,recipient:TAIL[i].recipient,quantity:TAIL[i].quantity})
        };


        necronomiCoin.blockchain.push(data);

        TAIL = [];


        /*
        io.emit('console', {
          username: "~",
          message: "hash found by "+data.data.miner
        });
        */

        io.emit('hash found', home);

        io.emit('blockchain', necronomiCoin);
        mining = false;

        /*
        TAIL.shift();
        if (TAIL.length>0) {
          io.emit('transaction', TAIL[0]);
        };
        */
        //console.log('block valid')

    }else{
       //console.log('block unvalid')
    }

  });


  socket.on('transaction', function (data) {

    if (data.sender==data.recipient) {return};
    if (data.sender=="") {return};
    if (data.recipient=="") {return};
    if (parseInt(data.quantity)<=0) {return};

    if (!userExist(data.recipient)) {return};
    if (!userExist(data.sender)) {return};

    myTokens = parseBlockchain(data.sender);

    if (parseInt(data.quantity)>myTokens) {return};

    for (var i = 0; i < TAIL.length; i++) {
      //TAIL[i]
      if (TAIL[i].sender==home) {
        myTokens=myTokens-TAIL[i].quantity
      };
    };
    if (parseInt(data.quantity)>myTokens) {return};


    TAIL.push(data);

    /*
    if (data.sender==data.recipient) {return};
    if (parseInt(data.quantity)<=0) {return};
    if (parseInt(data.quantity)>parseBlockchain(data.sender)) {return};
    */
    /*
    io.emit('console', {
      username: "~",
      message: data.sender+" send 💸"+data.quantity+" to "+data.recipient
    });
    */
    /*
    TAIL.push(data);

    if (TAIL.length>0) {
      io.emit('transaction', TAIL[0]);
    };

    */



  });

  

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });



  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;
      users.remove(socket.username);
      socket.broadcast.emit('update users', users);

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

const SHA256 = require("crypto-js/sha256");
class CryptoBlock {
  constructor(index, timestamp, data, precedingHash = " ") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.precedingHash = precedingHash;
    this.hash = this.computeHash();
    this.nonce = 0;
    this.miner = '';
  }

  computeHash() {
    return SHA256(
      this.index +
        this.precedingHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  proofOfWork(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.computeHash();
    }
  }
}

function testBlock(block,difficulty){

  //console.log('last block: '+necronomiCoin.obtainLatestBlock().index )

  if (necronomiCoin.obtainLatestBlock().index>=block.index) {return;};

  if (block.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
    return false;
  }else{
    return true;
  }
}

class CryptoBlockchain {
  constructor() {
    this.blockchain = [this.startGenesisBlock()];
    this.difficulty = 4;
  }
  startGenesisBlock() {
    return new CryptoBlock(0, Date.now(), "No One Escapes Cidhna Mine", "0");
  }

  obtainLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }
  addNewBlock(newBlock) {
    newBlock.precedingHash = this.obtainLatestBlock().hash;
    //newBlock.hash = newBlock.computeHash();
    newBlock.proofOfWork(this.difficulty);
    this.blockchain.push(newBlock);
  }

  checkChainValidity() {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const precedingBlock = this.blockchain[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }
      if (currentBlock.precedingHash !== precedingBlock.hash) return false;
    }
    return true;
  }
}

let necronomiCoin = new CryptoBlockchain();







//console.log("necronomiCoin mining in progress....");
/*
necronomiCoin.addNewBlock(
  new CryptoBlock(1, "01/06/2020", {
    sender: "Iris Ljesnjanin",
    recipient: "Cosima Mielke",
    quantity: 50
  })
);

necronomiCoin.addNewBlock(
  new CryptoBlock(2, "01/07/2020", {
    sender: "Vitaly Friedman",
    recipient: "Ricardo Gimenes",
    quantity: 100
  })
);
*/

//console.log(JSON.stringify(necronomiCoin, null, 4));

var mining=false;

function gTimer(){

  block = new CryptoBlock(necronomiCoin.blockchain.length, Date.now(), {
    sender: "necro",
    recipient: "",
    quantity: 1
  })

  io.emit('mine', block)
  mining=true;

}
//globalTimer = setInterval(gTimer, 60000);
globalTimer = setInterval(gTimer, 10000);

