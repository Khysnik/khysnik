<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title></title>
    <link rel="stylesheet" href="/c/sys42.css">
    <link rel="stylesheet" href="/c/sys/skins/w93.css">      
    <style>
      html,body{
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background: black;
        color: #c3ff00;
        overflow: hidden;
      }
      #canvas{ 
      position: absolute;
      top: 50%;
      left: 50%; 
      width: auto;
      height: 100%; 
      background: black;
      padding: 0px;
      margin:0px;
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%); 
      -ms-transform: translate(-50%, -50%); 
      -o-transform: translate(-50%, -50%); 
      transform: translate(-50%, -50%); 
      /*pointer-events:none;*/
    }
    .emularity-splash-screen{
      text-align: center; 
      position: absolute; 
      left: 0; 
      right: 0; 
      bottom: 50%; 
      margin: 0 0 0 0; 
      box-sizing: border-box; color: #000;      
    }
    </style>
  </head>
  <body>
    <canvas id="canvas" style="width: 50%; height: 50%; display: block; margin: 0 auto;" onClick="window.focus();"/>
    <script type="text/javascript" src="js/es6-promise.js"></script>
    <script type="text/javascript" src="js/browserfs.min.js"></script>
    <script type="text/javascript" src="js/loader.js"></script>
    <script src="/c/libs/jquery.min.js"></script>

    <script type="text/javascript">
      function $_GET(param) {
        var vars = {};
        window.location.href.replace( location.hash, '' ).replace( 
          /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
          function( m, key, value ) { // callback
            vars[key] = value !== undefined ? value : '';
          }
        );
        if ( param ) {
          return vars[param] ? vars[param] : null;  
        }
        return vars;
      }

      var softs = {

        /* Programming */
        //Flat_Assembler: {file:'FASM.zip', cmd:'./FASM.EXE', pointer:false},
        GWBASIC: {file:'GWBASIC.zip', cmd:'./gwbasic.exe', pointer:true},        
        LoveDOS: {file:'LoveDOS.zip', cmd:'./start.bat', pointer:true},        
        QBasic: {file:'QBASIC.zip', cmd:'./QBASIC.EXE', pointer:true},        
        Turbo_C: {file:'TURBOC.zip', cmd:'./TC.EXE', pointer:true},        
        Turbo_C_PP: {file:'TURBOCPP.zip', cmd:'./TOUR/TCTOUR.EXE', pointer:false},        

        /* Game creation tools */
        Adventure_Game_Studio: {file:'ags_231.zip', cmd:'./ROOMEDIT.EXE', pointer:false},
        Asciiquest: {file:'ASCIIQUEST.zip', cmd:'./AQ-EDIT.EXE', pointer:false},
        MegaZeux: {file:'MZX.zip', cmd:'./MZX269B.EXE', pointer:true},

        /* MUSIC */
        Adlib_Tracker_II: {file:'AT2.zip', cmd:'./ADTRACK2.EXE', pointer:true},
        Impulse_Tracker: {file:'Impulse_Tracker.zip', cmd:'./IT.EXE', pointer:true},
        Fast_Tracker_2: {file:'FT2.zip', cmd:'./FT2.EXE', pointer:false},
        Scream_Tracker_3: {file:'ST3.zip', cmd:'./St3.bat', pointer:true},
        Master_Player: {file:'MASTERPLAYER.zip', cmd:'./Editor.EXE', pointer:true},

        /* CODE */

        /* VIDEO */
      
        /* GAMES */
        Alone_in_the_dark: {file:'ALONE.zip', cmd:'./crack.exe', pointer:true},
        Alone_in_the_dark_2: {file:'ALONE2.zip', cmd:'./ALONE2.BAT', pointer:true},
        Alone_in_the_dark_3: {file:'ALONE3.zip', cmd:'./aitd3.exe', pointer:true},
        Jack_in_the_dark: {file:'JACK.zip', cmd:'./JACK.BAT', pointer:true},
        Alley_Cat: {file:'alley_cat.zip', cmd:'./CAT.EXE', pointer:true},
        Abuse: {file:'ABUSE.zip', cmd:'ABUSE/ABUSE.EXE', pointer:false},
        Alien_Rampage: {file:'AR.zip', cmd:'AR/RAMPAGE.EXE', pointer:true},
        Adventures_in_Math: {file:'AiM.zip', cmd:'./Run.bat', pointer:true}, 

        BAT: {file:'BAT.zip', cmd:'./BAT.EXE', pointer:false},
        Battle_Chess: {file:'BattleChess.zip', cmd:'./CHESS.EXE', pointer:false},
        BloodNet: {file:'BLOODNET.zip', cmd:'./BLOODNET.COM', pointer:false}, 

        Civilization: {file:'CIV.zip', cmd:'./CIV.EXE', pointer:false},
        Colossal_Cave_Adventure: {file:'Colossal_Cave_Adventure.zip', cmd:'./ADVENTUR.EXE', pointer:true},

        Dave: {file:'DAVE.zip', cmd:'./DAVE.EXE', pointer:true},
        Destruction_Derby: {file:'DERBY.zip', cmd:'./DEMO.EXE', pointer:true},
        Disc: {file:'DISC.zip', cmd:'./disc.exe', pointer:true},
        Digger: {file:'digger.zip', cmd:'./DIGGER.COM', pointer:true},
        Doom: {file:'DOOM.zip', cmd:'DOOM/DOOM.EXE', pointer:true},
        Duke3d: {file:'DUKE3D.zip', cmd:'./DUKE3D.EXE', pointer:false},
        Dune: {file:'DUNE.zip', cmd:'DUNE/dune.bat', pointer:false},
        Dune2: {file:'DUNE2.zip', cmd:'./DUNE2.EXE', pointer:false},
        Dreamweb: {file:'DREAMWEB.zip', cmd:'./DREAMWEB.EXE', pointer:false},
        Dungeon_Master: {file:'DMASTER.zip', cmd:'./DM.EXE', pointer:false},
     
        Karateka: {file:'Karateka.zip', cmd:'./START.BAT', pointer:true}, 
        KGB: {file:'KGB.zip', cmd:'./kgb.bat', pointer:false},
        Keen1: {file:'KEEN1.zip', cmd:'KEEN1/KEEN1.EXE', pointer:true},

        Lands_of_lore: {file:'LANDS.zip', cmd:'LANDS/LANDS.EXE', pointer:false},
      
        Neuromancer: {file:'Neuromancer.zip', cmd:'./NEUROCRK.COM', pointer:false},
        
        Prince_of_persia: {file:'PRINCE.zip', cmd:'./PRINCE.EXE', pointer:true},

        Rogue: {file:'ROGUE.zip', cmd:'./ROGUE.EXE', pointer:true},
        
        Sapiens: {file:'SAPIENS.zip', cmd:'./SAPIENS.EXE', pointer:true},
        Shuffle_Puck_Cafe: {file:'Shuffle_Puck_Cafe.zip', cmd:'./SHUFFLE.COM', pointer:true},
   
        Theme_Hospital: {file:'HOSPITAL.zip', cmd:'./HOSPITAL.EXE', pointer:false}, 
        Tower_Assault: {file:'TA.zip', cmd:'./TA_DEMO.EXE', pointer:true},
   
        Winter_Challenge: {file:'WINTER.zip', cmd:'./WINTER.BAT', pointer:false},
        Worms: {file:'WORMS.zip', cmd:'./WRMS.EXE', pointer:false},

        Xonix: {file:'xonix.zip', cmd:'./XONIX.EXE', pointer:true},
        
        ZZT: {file:'ZZT.zip', cmd:'./zzt.exe', pointer:true},

        // PC98
        EVO: {file:'EVO.zip', cmd:'AUTOEXEC.BAT', pointer:true, machine:'PC98'},
        Touhou: {file:'th1.zip', cmd:'play.bat', pointer:true, machine:'PC98'},
        Touhou_2: {file:'th2.zip', cmd:'play.bat', pointer:true, machine:'PC98'},
        Touhou_3: {file:'th3.zip', cmd:'play.bat', pointer:true, machine:'PC98'},
        Touhou_4: {file:'th4.zip', cmd:'play.bat', pointer:true, machine:'PC98'},
        Touhou_5: {file:'th5.zip', cmd:'play.bat', pointer:true, machine:'PC98'},
        Rusty: {file:'rusty.zip', cmd:'play.bat', pointer:true, machine:'PC98'},
        Rude_Breaker: {file:'RUDEBREAKER.zip', cmd:'play.bat', pointer:true, machine:'PC98'},
        

      }
      var file="Rogue";
      if ($_GET('soft')!=null) {
        if (softs[$_GET('soft')]!=undefined) {
          file = $_GET('soft')
          //parent.$notif('Loading '+$_GET('soft').replace(/_/g," ")+'.')
        };
      };
      //
      // DOS FILES
      if(softs[file].machine==undefined){
        var dosbox = new Emulator(document.querySelector("#canvas"),
                                    null,
                                    new DosBoxLoader(DosBoxLoader.emulatorJS("js/dosbox-sync.js"),
                                        DosBoxLoader.locateAdditionalEmulatorJS(locateAdditionalFiles),
                                        DosBoxLoader.nativeResolution(640, 400),
                                        DosBoxLoader.mountZip("c",
                                          DosBoxLoader.fetchFile("Software","softs/"+softs[file].file)),
                                        DosBoxLoader.startExe(softs[file].cmd)));
        dosbox.start({ waitAfterDownloading: false });

        function locateAdditionalFiles(filename) {
          if (filename === "dosbox.html.mem") {
            return "js/dosbox-sync.mem";
          }
          return "js/"+ filename;
        }

      }
      //
      // PC98 DOS FILES
      if(softs[file].machine=='PC98'){
        var dosbox = new Emulator(document.querySelector("#canvas"),
          null,
          new PC98DosBoxLoader(PC98DosBoxLoader.emulatorJS("js/dosbox-x.js"),
            PC98DosBoxLoader.emulatorWASM("js/dosbox-x.wasm"),
            PC98DosBoxLoader.locateAdditionalEmulatorJS(locateAdditionalFiles),
            PC98DosBoxLoader.nativeResolution(640, 480),
            PC98DosBoxLoader.mountZip("c",
              PC98DosBoxLoader.fetchFile("Game File",
                "softs/"+softs[file].file)),
            PC98DosBoxLoader.mountZip("y",
              PC98DosBoxLoader.fetchFile("ROM File",
                "js/font.zip")),

            PC98DosBoxLoader.startExe(softs[file].cmd)))
        dosbox.start({ waitAfterDownloading: true });

        function locateAdditionalFiles(filename) {
          if (filename === "dosbox.html.mem") {
            return "js/dosbox-sync.mem";
          }
          return "js/"+ filename;
        }


      }

      if (softs[file].pointer==false) {
        c=document.getElementById("canvas")
        c.style.cursor = "none"
      };

      $( document ).ready(function() {
        // needed?
      });
    </script>
  </body>
</html>
