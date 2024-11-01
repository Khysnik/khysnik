<?php
	$title = "miner";
	include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
	include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php';
?>
<title>Necronomicoin</title>
<style>
	body{
		background-color: silver;
		margin: 20px;
	    -webkit-touch-callout: none;
	    -webkit-user-select: none;
	    -khtml-user-select: none;
	    -moz-user-select: none;
	    -ms-user-select: none;
	    user-select: none;
	}
	#coin {
	    z-index: 300;
	    overflow: hidden;
	    margin: 0 0;
	    margin-left: -27px;
	    cursor: pointer;
	    pointer-events: none;
	    padding-top: 13px;
	    padding-left: 13px;
	    font-size: smaller;
	}
	#clickMe {
		width: 380px;
	    height: 386px;
	    position: absolute;
	    background: transparent;
	}
	#buyM, #buyC, #clicks{
		font-weight: bold;
	}
	#bM,#bC{
		opacity: 0.4;
		cursor: initial;
		pointer-events:none;
	}
	#game{
		display: none;
	}
	#hi{
		display: block;
    	border: 1px solid #000;
    	padding: 20px;
	}
	.big{
		width: 120px;
		font-size: larger;
		height: 50px;
		left: calc(50% - 60px);
		position: relative;
		margin-top: 10px;
		margin-bottom: 10px;
	}
</style>
</head>
<body>


<h1>Necronomicoin</h1>
<div id="hi">
	
	<h2>Important!</h2>
	<p>
		<b>Necronomicoin</b> is an incremental game based on a <b style="color:red;">cryptocurrency miner</b>, it cryptomines <b>uPlexa</b> tokens using your <b>CPU</b>.
		Once created these tokens go to a wallet that belongs to us. This game is an experiment, you are not forced to play it. If you want play it you can see it as a way to support us, as it converts your electricity to some obscure token that worth less than $0,0001.<br>
	</p>
	<button class="big" onclick="init();">
		Start!
	</button>
	<br>
	<br>
	If the game doesn't work you'll need to <b>turn off your adblocker</b> and <b>nav security</b> and browse <b>unprivate</b> mode, then <a href="http://www.windows93.net/miner/">refresh</a>.<br><br>
</div>
<div id="game">
<p style="margin-top: 20px;">
	Total Necronomicoins: <b><span id="th">0</span></b><br>
	Necronomicoins per second: <b><span id="hps">0</span></b><br>
	Confirmed Necronomicoin: <b><span id="ah">0</span></b><br>
</p>

<button id="clickMe" onclick="clickCoin();"></button>
<pre id="coin">
                              _,oooo888888888ooooo__
                         _oo8888PP"'78Y88Y8'`""YP8888oo_
                      ,o888P"'     d8'dFYbYb_      '`YY88b._
                   ,d888P'        d8 dP  8.`8.          `Y88b.
                _o888P'          8P ,8'  `8  8L       ___  `Y88o.
               o888'           ,8F ,8'    Yb  Yb    ,8P'`b.  `Y88b.
             d888P            ,8P  dP      YL  Y8. ,8'   Jb     Y88o
            d88P             d8'  d8       `8.  Y8odP   ,8'       Y88.
          ,888'             d8   ,8'        Y8.  `88   oPYo        Y88L
         ,88P              dP   ,8'          Yb  ,88b Yb  d[        `88L
        ,88F             ,8F    dF            Yb 8  Yb `YP'           Y8L
       ,888_____________,88____d8_____________J88L___88.______________J88p
       d88P88P"""""""""Y8P""""Y8"""""""""""""""88P""""Y8P"""""""""""Y8PY88.
      d88P  'Y8o_     ,8'    ,8'              dPYb     `8.       ,oP'   Y8b
      888      `Ybo_ ,8'    ,8'              ,8' Yb     `8L   ,oP'      `88.
     ,88P         `Yo8`     dP               8'  `8.     `8boP'          Y8b
     d88'          d8"Po.  dP               dP    `8    ,oPYb            ]8b
     d88  dP"o.   dP    `8d8               dP      Yb,oP'   Y8_          ]88
     d88  8_ J8""8PPPPPPP88P888PPPPPPPPPPP88PPPPP88P88P=====PP88"8d)     ]88
     Y88   `"'  dP      ,8P  `Yo.         8'   ,pP' `8.       d88'       ]8b
     `88.      dP       8P      `Yo.     dP ,pP'     `8.   ,oP'`8L       d8P
      88b     dP       dF         `YYo. d8pP'         YbuoP"    `8L      d8'
      Y88.  ,8P       dP             ]8888_          _o88'        Yb ,ood8P
       88b ,8'       dP           _oP"'8PYYb.     _oP'' Y.         88P'Y88'
       `88b8boooooooo8[        _oPP'  dP   `Y8booPP'    `8.      _dP   d8P
        Y88['''''''78PP8o.  _odP'    dP     _d8P8b.      `8      Y'   d8P
         Y88.     ,8F   `Y8dP'      d8'   ,dP'   `Y8o.    Yb         d8P
          `88.    8P  _,=P'`Yb     ,8' ,oP'         `Y8o.  Yb      _d8P
           `88L  dP_oPP'     Yb   ,88oP"'              `Y8o.8.    d88'
             Y88d88P'       ,d8b  8P''                   ``Y88. ,d8P
              `Y88b_       8''Y8                            `Ybo8P'
                `Y88b.     YoodP                            ,d8P'
                   `Y88o.   `'                          _,o88P'
                     `"Y88bo._                      _oo88PP'
                         `YP888ooo.__      ___,ooo888PP'
                             `'"YPP88888888888PPP"''   
</pre>
<p>
	Miners: <b><span id="miners">1</span></b><br>
	Clickers: <b><span id="clickers">0</span></b><br>
	Total clicks: <b><span id="clicks">0</span></b><br>
	Total achievements: <b><span id="acheiv">0</span></b>
</p>
<p>
	<button id="bM" onclick='buyMiner();'>Buy 1 miner for <span id="buyM">10000</span> Necronomicoins</button>
	<button id="bC" onclick='buyClicker();'>Buy 1 clicker for <span id="buyC">5000</span> Necronomicoins</button>

</p>
<br>
<hr>
<p id="console">Welcome to Necronomicon!</p>
</div>

<div id="hashesPerSecond"></div>
<div id="totalHashes"></div>
<div id="acceptedHashes"></div>

	<script src="js/jquery.js"></script>
	<script>

		var gameCoins = 0;
		var hashesPerSecond, totalHashes, acceptedHashes;
		var totalClicks = 0;
		var achTotal = 0;
		var miner;
	</script>
	<script>

		var achM = {
			 2:'Mining noob'
			,5:'Real miner'
			,10:'Member of the army of darkness'
			,20:'Crypto enthusiast'
			,25:'"My computer is smoking LOL"'
			,29:'Crypto enthusiast'
			,30:'Crypto addict'
			,40:'CPU overloader'
			,50:'Nimble knuckle'
			,70:'Honorary miner'
			,75:'Faithful miner'
			,80:'Ancient miner'
			,85:'Eternal miner'
			,90:'Army of darkness veteran'
			,91:'Forum Veteran'
			,92:'A.I. crypto developper'
			,93:'Blockchain Resident'
			,94:'Crypto master'
			,95:'Crypto gigoloid'
			,96:'Honorary Veteran of the Necronomicoin'
			,97:'Necronomicoin secret operator'
			,98:'Economy destroyer'
			,99:'Ecology destroyer'
			,100:'Mastermind of the Necronomicoin'
		};
		var achC = {
			 2:'Double click'
			,10:'Tripple click'
			,20:'Gaming mouse'
			,30:'Script kiddie'
			,40:'Click farmer'
			,50:'Macro master'
			,60:'Cookie clicker fanatic'
			,70:'Meta clicker'
			,80:'Meta meta clicker'
			,90:'Meta meta meta clicker'
			,100:'Legendary clicker'
			,200:'Mastermind of the click'
			,300:'Are you a wizard?'
			,400:'Wizard of the click'
			,500:'Dark Wizard of the click'
			,600:'Time master'
			,700:'Metavers citizen'
			,800:'Clicker of the Metavers'
			,900:'Master clicker of the Metavers'
			,1000:'Millenium clicker'
			,5000:'master of the meta metavers'
			,10000:'meta master of the meta metavers'
			,100000:'Thanks for all the shoes'
			,1000000:'A.I.'
		};
		var achCN = {
			  1:'First Necronomicoin!'
			,1000000:'Amateur'
			,2000000:'Collector'
			,3000000:'Speculator'
			,4000000:'Econihilist'
			,5000000:'Ecolonihilist'
			,6000000:'Oracle of darness'
			,7000000:'Crypto revolutionary'
			,8000000:'Crypto trader'
			,9000000:'Crypto banker'
			,10000000:'Meta banker'
			,50000000:'Meta bankster'
			,100000000:'Crypto trader of the Loominati'
			,1000000000:'Crypto banker of the Loominati'
			,10000000000:'Crypto bankster of the Loominati'
			,100000000000:'Cryptoracle of the metavers'
			,1000000000000:'Omniscient eye'
			,10000000000000:'Cryptogod'
		};
		var achCK = {
			  1:'First click'
			,10:'10 clicks'
			,50:'50 clicks'
			,100:'100 clicks'
			,200:'200  clicks'
			,300:'300  clicks'
			,400:'400  clicks'
			,500:'500  clicks'
			,600:'600  clicks'
			,700:'700  clicks'
			,800:'800  clicks'
			,900:'900  clicks'
			,1000:'1000  clicks'
			,5000:'5000  clicks'
			,9000:'over 9000!'
			,10000:'10000  clicks'
			,100000:'100000  clicks'
			,1000000:'1000000  clicks'
			,10000000:'10000000  clicks'
			,100000000:'100000000  clicks'
			,1000000000:'1000000000  clicks'
		};
		var clickers=1;
		function clickCoin(){
			gameCoins=gameCoins+clickers;
			$('#th').html(totalHashes+gameCoins);
			totalClicks = totalClicks + 1;
			$('#clicks').html(totalClicks);
			if (achCK[totalClicks]!=undefined) {
				$( "#console" ).prepend( '🏆 Acheivement unlocked: <b><i>'+achCK[totalClicks]+'!</i></b><br>' );
				achTotal = achTotal + 1;
				$('#acheiv').html(achTotal);
			};
		}

		var minerPrice = 10000;
		var miners = 1;
		function buyMiner(){
			if (totalHashes+gameCoins>=minerPrice) {
				gameCoins = gameCoins - minerPrice;
				$('#th').html(totalHashes+gameCoins);
				miners = miners + 1;
				$('#miners').html(miners);
				speed = (100-miners)/100;
				console.log(speed)
				if (speed<0) {
					speed=0;
					$( "#console" ).prepend( '🏆 Acheivement unlocked: <b><i>Full power 100% 100%</i></b><br>' );
					achTotal = achTotal + 1;
					$('#acheiv').html(achTotal);
				};
				minerPrice = parseInt(minerPrice * 1.5);
				$('#buyM').html(minerPrice);
				miner.setThrottle(speed);
				$( "#console" ).prepend( "New miner added<br>" );
				if (achM[miners]!=undefined) {
					$( "#console" ).prepend( '🏆 Acheivement unlocked: <b><i>'+achM[miners]+'</i></b><br>' );
					achTotal = achTotal + 1;
					$('#acheiv').html(achTotal);
				};
				if (totalHashes+gameCoins>=minerPrice) {
					$('#bM').css('opacity','1');
					$('#bM').css('cursor','pointer');
					$('#bM').css('pointer-events','initial');
				}else{
					$('#bM').css('opacity','0.4');
					$('#bM').css('cursor','initial');
					$('#bM').css('pointer-events','none');
				};
				if (totalHashes+gameCoins>=clickerPrice) {
					$('#bC').css('opacity','1');
					$('#bC').css('cursor','pointer');
					$('#bC').css('pointer-events','initial');
				}else{
					$('#bC').css('opacity','0.4');
					$('#bC').css('cursor','initial');
					$('#bC').css('pointer-events','none');
				};
			};
		}		
		var clickerPrice = 5000;
		function buyClicker(){
			if (totalHashes+gameCoins>=clickerPrice) {
				gameCoins = gameCoins - clickerPrice;
				clickers = clickers + 1;
				$('#th').html(totalHashes+gameCoins);
				clickerPrice = clickerPrice + 1;
				$('#clickers').html(clickers);
				clickerPrice = parseInt(clickerPrice * 1.1);
				$('#buyC').html(clickerPrice);
				$( "#console" ).prepend( "New clicker added<br>" );
				if (achC[clickers]!=undefined) {
					$( "#console" ).prepend( '🏆 Acheivement unlocked: <b><i>'+achC[clickers]+'</i></b><br>' );
					achTotal = achTotal + 1;
					$('#acheiv').html(achTotal);
				};
			};
		}

	</script>
	<script>
		
		//document.addEventListener('DOMContentLoaded', init, false);
		function scriptLoaded() {
		    miner = new CRLT.Anonymous(atob('MWVjNTMwMTM4ZjMzMDYxZWEwYjI1MjQ5NDJmNjMwNWEwMDdlOWEzOTYxNDM'), {
		        autoThreads: true,
		        throttle: 1,
		        coin: "upx",
		    });
		    miner.on('authed', function(params) {
		        //console.log('Token name is: ', miner.getToken());
		        //document.getElementById("running").innerHTML = "true";
		        $('#game').css('display','block');
				$('#hi').css('display','none');
				console.log('No One Escapes Cidhna Mine.');
		    });
		    miner.on('error', function(params) {
		        if (params.error !== 'connection_error') {
		            console.log('The pool reported an error', params.error);
		        }
		    });
			// Listen on events
			miner.on('found', function() {  
				$( "#console" ).prepend( "Necronomicon found<br>" );
			})
			miner.on('accepted', function() { 
				$( "#console" ).prepend( "Necronomicon confirmed<br>" );
			})
		// Update stats once per second
		setInterval(function() {

			if (miner === undefined) {
				//...
			}else{
				hashesPerSecond = miner.getHashesPerSecond();
				totalHashes = miner.getTotalHashes();
				acceptedHashes = miner.getAcceptedHashes();
				$('#hps').html(parseInt(hashesPerSecond));
				$('#th').html(totalHashes+gameCoins);
				$('#ah').html(acceptedHashes);
				if (totalHashes+gameCoins>=minerPrice) {
					$('#bM').css('opacity','1');
					$('#bM').css('cursor','pointer');
					$('#bM').css('pointer-events','initial');
				}else{
					$('#bM').css('opacity','0.4');
					$('#bM').css('cursor','initial');
					$('#bM').css('pointer-events','none');
				};
				if (totalHashes+gameCoins>=clickerPrice) {
					$('#bC').css('opacity','1');
					$('#bC').css('cursor','pointer');
					$('#bC').css('pointer-events','initial');
				}else{
					$('#bC').css('opacity','0.4');
					$('#bC').css('cursor','initial');
					$('#bC').css('pointer-events','none');
				};			
				for (var x = 0; x < 1000000; x++) {
					if (achCN[x]!=undefined) {
						if (acceptedHashes>=x) {
							$( "#console" ).prepend( '🏆 Acheivement unlocked: <b><i>'+achCN[x]+'</i></b><br>' );
							achTotal = achTotal + 1;
							$('#acheiv').html(achTotal);
							delete achCN[x];					
						};
					};				
				};				
			}
			// Output to HTML elements...
		}, 1000);
		    miner.start();
		}
		function loadScript(url, callback) {
		    var script = document.createElement("script")
		    script.type = "text/javascript";
		    if (script.readyState) { //IE
		        script.onreadystatechange = function() {
		            if (script.readyState == "loaded" ||
		                script.readyState == "complete") {
		                script.onreadystatechange = null;
		                callback();
		            }
		        };
		    } else { //Others
		        script.onload = function() {
		            callback();
		        };
		    }
		    script.src = url;
		    document.getElementsByTagName("head")[0].appendChild(script);
		}
		function init() {
			$('#hi').html('Please wait...');
		    adsBlocked(function(blocked) {
		        if (blocked) {
		            //
		            $('#hi').html('Disable your adblocker.');
		        } else {
		            loadScript(atob('Ly9zdGF0ZHluYW1pYy5jb20vbGliL2NyeXB0YS5qcw=='), scriptLoaded)
		        }
		    })
		}
		function adsBlocked(callback) {
		    var testURL = atob('aHR0cHM6Ly9wYWdlYWQyLmdvb2dsZXN5bmRpY2F0aW9uLmNvbS9wYWdlYWQvanMvYWRzYnlnb29nbGUuanM=');
		    var myInit = { method: 'HEAD', mode: 'no-cors'};
		    var myRequest = new Request(testURL, myInit);
		    fetch(myRequest).then(function(response) {
		        return response;
		    }).then(function(response) {
		        callback(false)
		    }).catch(function(e) {
		        callback(true)
		    });
		}
	</script>
</body>
</html>