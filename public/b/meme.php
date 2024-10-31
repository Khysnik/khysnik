<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>/B MEME GENERATOR</title>
	<style type="text/css">
		html{
			height: auto;
			min-height: 100%;
			background-color: #FFFEEE;
			background: linear-gradient(
			#FED6AF,
			#FFFFEE 150px) top center repeat-x;
			margin-top: -2px;
		}
		body{
			font-family: Comic Sans MS;
		}
		#meme{
			max-width: 100vw;
			max-height: 60vh;
			position: absolute;
			left: 50%;
			top: 0;
			transform: translate(-50%, 0);
		}
		#form{
			position: absolute;
			top: 61vh;
			left: 50%;
			padding: 0;
			margin: 0;
			transform: translate(-50%, 0);
		}
		input{
			max-width: 99%;
			font-family: Comic Sans MS;
		}
		#postme{
			font-size: 5vh;
			font-family: Comic Sans MS;
		}
	</style>
</head>
<body><?php 

		$index = 0;
		$board = 'b';

		if(isset($_GET['res'])) { 
			$res = htmlspecialchars($_GET["res"]); } 
		else { 
			echo 'res does not exist.'; die;
		}

		if(isset($_GET['index'])) { 
			$index = htmlspecialchars($_GET["index"]); } 
		else { 
			$index = 0;
		}

		$post = file_get_contents("http://www.windows93.net/b/api.php?mode=res&res=".$res);
		$json_post = json_decode($post, true);

		if (count($json_post)==0) {
			echo 'res does not exist.'; die;
		}
		if ($index>count($json_post)-1) {
			echo 'post does not exist.'; die;
		}
		function sortByNo($a, $b) {
		    return $a['no'] - $b['no'];
		}
		usort($json_post, 'sortByNo');
		if ($json_post[$index]['ext']!="") {
			//
		}else{
			echo 'image does not exist.'; die;
		}

		if ($json_post[$index]['ext']==".webm") {
			echo 'this is not an image.'; die;
		}

		include 'config.php';
	
		$source='/'.$board.'/src/'.$json_post[$index]['tim'].$json_post[$index]['ext'];

	?>
	<canvas id="meme"></canvas>

	<script>

		var f=[]; 
		<?php 
			foreach (FILTERS as $key => $value) {
				echo 'f["'.$key.'"]="'.$value.'";';
			}
		?>
		
		var source = '<?php echo $source; ?>'
		var topT="hello"
		var bottomT="world"
		var yPos = 0;
		var canvas = document.getElementById('meme');
		var context = canvas.getContext('2d');
		var img = new Image;
		var badwords = ['4r5e','5h1t','5hit','a55','anal','anus','ar5e','arrse','arse','ass','ass-fucker','asses','assfucker','assfukka','asshole','assholes','asswhole','a_s_s','b!tch','b00bs','b17ch','b1tch','ballbag','balls','ballsack','bastard','beastial','beastiality','bellend','bestial','bestiality','bi+ch','biatch','bitch','bitcher','bitchers','bitches','bitchin','bitching','bloody','blowjob','blowjobs','boiolas','bollock','bollok','boner','boob','boobs','booobs','boooobs','booooobs','booooooobs','breasts','buceta','bugger','bum','bunnyfucker','butt','butthole','buttmuch','buttplug','c0ck','c0cksucker','carpetmuncher','cawk','chink','cipa','cl1t','clit','clitoris','clits','cnut','cock','cock-sucker','cockface','cockhead','cockmunch','cockmuncher','cocks','cocksuck','cocksucked','cocksucker','cocksucking','cocksucks','cocksuka','cocksukka','cok','cokmuncher','coksucka','coon','cox','crap','cum','cummer','cumming','cums','cumshot','cunilingus','cunillingus','cunnilingus','cunt','cuntlick','cuntlicker','cuntlicking','cunts','cyalis','cyberfuc','cyberfuck','cyberfucked','cyberfucker','cyberfuckers','cyberfucking','d1ck','dick','dickhead','dildo','dildos','dink','dinks','dirsa','dlck','dog-fucker','doggin','dogging','donkeyribber','doosh','duche','dyke','ejaculate','ejaculated','ejaculates','ejaculating','ejaculatings','ejaculation','ejakulate','fuck','fuck3r','fucker','f4nny','fag','fagging','faggitt','faggot','faggs','fagot','fagots','fags','fanny','fannyflaps','fannyfucker','fanyy','fatass','fcuk','fcuker','fcuking','feck','fecker','felching','fellate','fellatio','fingerfuck','fingerfucked','fingerfucker','fingerfuckers','fingerfucking','fingerfucks','fistfuck','fistfucked','fistfucker','fistfuckers','fistfucking','fistfuckings','fistfucks','flange','fook','fooker','fucka','fucked','fuckers','fuckhead','fuckheads','fuckin','fucking','fuckings','fuckingshitmotherfucker','fuckme','fucks','fuckwhit','fuckwit','fudgepacker','fuk','fuker','fukker','fukkin','fuks','fukwhit','fukwit','fux','fux0r','f_u_c_k','gangbang','gangbanged','gangbangs','gaylord','gaysex','goatse','hardcoresex','hell','heshe','hoar','hoare','hoer','homo','hore','horniest','horny','hotsex','jack-off','jackoff','jap','jerk-off','jism','jiz','jizm','jizz','kawk','knob','knobead','knobed','knobend','knobhead','knobjocky','knobjokey','kock','kondum','kondums','kum','kummer','kumming','kums','kunilingus','l3i+ch','l3itch','labia','lmfao','lust','lusting','m0f0','m0fo','m45terbate','ma5terb8','ma5terbate','masochist','master-bate','masterb8','masterbat*','masterbat3','masterbate','masterbation','masterbations','masturbate','mo-fo','mof0','mofo','mothafuck','mothafucka','mothafuckas','mothafuckaz','mothafucked','mothafucker','mothafuckers','mothafuckin','mothafucking','mothafuckings','mothafucks','motherfucker','motherfuck','motherfucked','motherfuckers','motherfuckin','motherfucking','motherfuckings','motherfuckka','motherfucks','muff','mutha','muthafecker','muthafuckker','muther','mutherfucker','n1gga','n1gger','nazi','nigg3r','nigg4h','nigga','niggah','niggas','niggaz','nigger','niggers','nob','nobjokey','nobhead','nobjocky','numbnuts','nutsack','orgasim','orgasims','orgasm','orgasms','p0rn','pawn','pecker','penis','penisfucker','phonesex','phuck','phuk','phuked','phuking','phukked','phukking','phuks','phuq','pigfucker','pimpis','piss','pissed','pisser','pissers','pisses','pissflaps','pissin','pissing','pissoff','poop','porn','porno','pornography','pornos','prick','pricks','pron','pube','pusse','pussi','pussies','pussy','pussys','rectum','retard','rimjaw','rimming','shit','s.o.b.','sadist','schlong','screwing','scroat','scrote','scrotum','semen','sex','sh!+','sh!t','sh1t','shag','shagger','shaggin','shagging','shemale','shi+','shitdick','shite','shited','shitey','shitfuck','shitfull','shithead','shiting','shitings','shits','shitted','shitter','shitters','shitting','shittings','shitty','skank','slut','sluts','smegma','smut','snatch','son-of-a-bitch','spac','spunk','s_h_i_t','t1tt1e5','t1tties','teets','teez','testical','testicle','tit','titfuck','tits','titt','tittie5','tittiefucker','titties','tittyfuck','tittywank','titwank','tosser','turd','tw4t','twat','twathead','twatty','twunt','twunter','v14gra','v1gra','vagina','viagra','vulva','w00se','wang','wank','wanker','wanky','whoar','whore','willies','willy','xrated','xxx','a55hole','aeolus','ahole','analprobe','anilingus','areola','areole','arian','aryan','assbang','assbanged','assbangs','assfuck','assh0le','asshat','assho1e','assmaster','assmunch','asswipe','asswipes','azazel','azz','babe','babes','bang','banger','barf','bastards','bawdy','beaner','beardedclam','beatch','beater','beaver','beer','beeyotch','beotch','bigtits','bimbo','bitched','bitchy','blow','bod','bodily','boink','bollocks','bone','boned','boners','bong','boobies','booby','booger','bookie','bootee','bootie','booty','booze','boozer','boozy','bosom','bosomy','bowel','bowels','bra','brassiere','breast','bukkake','bullshit','bullshits','bullshitted','bullturds','bung','busty','buttfuck','buttfucker','c.0.c.k','c.o.c.k.','c.u.n.t','c-0-c-k','caca','cahone','cameltoe','cervix','chinc','chincs','chode','chodes','climax','clitorus','clitty','cocain','cocaine','c-o-c-k','cockblock','cockholster','cockknocker','cocksmoker','coital','commie','condom','coons','corksucker','crabs','crack','cracker','crackwhore','crappy','cummin','cumshots','cumslut','cumstain','cunny','c-u-n-t','cuntface','cunthunter','d0ng','d0uch3','d0uche','d1ld0','d1ldo','dago','dagos','dammit','damned','damnit','dawgie-style','dickbag','dickdipper','dickface','dickflipper','dickheads','dickish','dick-ish','dickripper','dicksipper','dickweed','dickwhipper','dickzipper','diddle','dike','diligaf','dillweed','dimwit','dingle','dipship','doggie-style','doggy-style','dong','doofus','dopey','douch3','douche','douchebag','douchebags','douchey','drunk','dumass','dumbass','dumbasses','dummy','dykes','enlargement','erect','erection','erotic','essohbee','extacy','extasy','f.u.c.k','fack','fagg','fagged','faggit','faig','faigt','fannybandit','fart','fartknocker','fat','felch','felcher','feltch','feltcher','fisted','fisting','fisty','floozy','foad','fondle','foobar','foreskin','freex','frigg','frigga','fubar','f-u-c-k','fuckass','fuckface','fucknugget','fucknut','fuckoff','fucktard','fuck-tard','fuckup','fuckwad','fvck','fxck','gae','gai','ganja','gay','gays','gey','gfy','ghay','ghey','gigolo','glans','godamn','godamnit','goddam','goddammit','goldenshower','gonad','gonads','gook','gooks','gringo','gspot','g-spot','gtfo','guido','h0m0','h0mo','handjob','hardon','he11','hebe','heeb','hemp','heroin','herp','herpes','herpy','hitler','hiv','hobag','hom0','homey','homoey','honky','hooch','hookah','hooker','hoor','hootch','hooter','hooters','hump','humped','humping','hussy','hymen','inbred','incest','injun','j3rk0ff','jackass','jackhole','japs','jerk','jerk0ff','jerked','jerkoff','jizzed','junkie','junky','kike','kikes','kill','kinky','kkk','klan','kooch','kooches','kootch','kraut','kyke','lech','leper','lesbians','lesbo','lesbos','lez','lezbian','lezbians','lezbo','lezbos','lezzie','lezzies','lezzy','lmao','loin','loins','lube','lusty','mams','massa','masterbating','masturbating','masturbation','maxi','menses','menstruate','menstruation','meth','m-fucking','molest','moolie','moron','motherfucka','mtherfucker','mthrfucker','mthrfucking','muffdiver','murder','muthafuckaz','muthafucker','mutherfucking','muthrfucking','nad','nads','naked','napalm','nappy','nazism','negro','niggle','niglet','nimrod','ninny','nipple','nooky','nympho','opiate','opium','oral','orally','organ','orgasmic','orgies','orgy','ovary','ovum','ovums','p.u.s.s.y.','paddy','paki','pantie','panties','panty','pastie','pasty','pcp','pedo','pedophile','pedophilia','pedophiliac','pee','peepee','penetrate','penetration','penial','penile','perversion','peyote','phalli','phallic','pillowbiter','pimp','pinko','piss-off','pms','polack','pollock','poon','poontang','pot','potty','prig','prostitute','prude','pubic','pubis','punkass','punky','puss','pussypounder','puto','queaf','queef','queer','queero','queers','quicky','quim','racy','rape','raped','raper','rapist','raunch','rectal','rectus','reefer','reetard','reich','retarded','revue','rimjob','ritard','rtard','r-tard','rum','rump','rumprammer','ruski','s.h.i.t.','s0b','sadism','scag','scantily','schizo','screw','screwed','scrog','scrot','scrud','scum','seaman','seamen','seduce','sexual','s-h-1-t','shamedame','s-h-i-t','shiteater','shitface','shithole','shithouse','shitt','shiz','sissy','skag','slave','sleaze','sleazy','slutdumper','slutkiss','smutty','sniper','snuff','s-o-b','sodom','souse','soused','sperm','spic','spick','spik','spiks','spooge','steamy','stfu','stiffy','stoned','strip','stroke','stupid','suck','sucked','sucking','sumofabiatch','t1t','tampon','tard','tawdry','teabagging','teat','terd','teste','testee','testes','testis','thrust','thug','tinkle','titi','titty','tittyfucker','titty fucker','toke','toots','tramp','transsexual','trashy','tubgirl','tush','twats','ugly','undies','unwed','urinal','urine','uterus','uzi','vag','valium','virgin','vixen','vodka','vomit','voyeur','vulgar','wad','wazoo','wedgie','weed','weenie','weewee','weiner','weirdo','wench','wetback','wh0re','wh0reface','whitey','whiz','whoralicious','whorealicious','whored','whoreface','whorehopper','whorehouse','whores','whoring','wigger','womb','woody','wop','wtf','x-rated','yeasty','yobbo','zoophile','2g1c','2 girls 1 cup','acrotomophilia','alabama hot pocket','alaskan pipeline','apeshit','arsehole','auto erotic','autoerotic','babeland','baby batter','baby juice','ball gag','ball gravy','ball kicking','ball licking','ball sack','ball sucking','bangbros','bareback','barely legal','barenaked','bastardo','bastinado','bbw','bdsm','beaners','beaver cleaver','beaver lips','big black','big breasts','big knockers','big tits','bimbos','birdlock','black cock','blonde action','blonde on blonde action','blow job','blow your load','blue waffle','blumpkin','bondage','booty call','brown showers','brunette action','bulldyke','bullet vibe','bung hole','bunghole','buttcheeks','camel toe','camgirl','camslut','camwhore','carpet muncher','chocolate rosebuds','circlejerk','cleveland steamer','clover clamps','clusterfuck','coprolagnia','coprophilia','cornhole','creampie','darkie','date rape','daterape','deep throat','deepthroat','dendrophilia','dingleberry','dingleberries','dirty pillows','dirty sanchez','doggie style','doggiestyle','doggy style','doggystyle','dog style','dolcett','domination','dominatrix','dommes','donkey punch','double dong','double penetration','dp action','dry hump','dvda','eat my ass','ecchi','erotism','escort','eunuch','fecal','female squirting','femdom','figging','fingerbang','fingering','foot fetish','footjob','frotting','fuck buttons','fucktards','fudge packer','futanari','gang bang','gay sex','genitals','giant cock','girl on','girl on top','girls gone wild','goatcx','gokkun','golden shower','goodpoop','goo girl','goregasm','grope','group sex','guro','hand job','hard core','hardcore','hentai','homoerotic','honkey','hot carl','hot chick','how to kill','how to murder','huge fat','intercourse','jack off','jail bait','jailbait','jelly donut','jerk off','jigaboo','jiggaboo','jiggerboo','juggs','kinbaku','kinkster','knobbing','leather restraint','leather straight jacket','lemon party','lolita','lovemaking','make me come','male squirting','menage a trois','milf','missionary position','mound of venus','mr hands','muff diver','muffdiving','nambla','nawashi','neonazi','nig nog','nimphomania','nipples','nsfw images','nude','nudity','nymphomania','octopussy','omorashi','one cup two girls','one guy one jar','paedophile','pedobear','pegging','phone sex','piece of shit','piss pig','pisspig','playboy','pleasure chest','pole smoker','ponyplay','poof','punany','poop chute','poopchute','prince albert piercing','pthc','pubes','raghead','raging boner','raping','reverse cowgirl','rosy palm','rosy palm and her 5 sisters','rusty trombone','santorum','scat','scissoring','sexo','shaved beaver','shaved pussy','shibari','shitblimp','shota','shrimping','skeet','slanteye','s&m','snowballing','sodomize','sodomy','splooge','splooge moose','spread legs','strap on','strapon','strappado','strip club','style doggy','sucks','suicide girls','sultry women','swastika','swinger','tainted love','taste my','tea bagging','threesome','throating','tied up','tight white','tongue in a','topless','towelhead','tranny','tribadism','tub girl','tushy','twink','twinkie','two girls one cup','undressing','upskirt','urethra play','urophilia','venus mound','vibrator','violet wand','vorarephilia','wet dream','white power','wrapping men','wrinkled starfish','xx','yaoi','yellow showers','yiffy','zoophilia','bunny fucker','f u c k','f u c k e r','mother fucker','nob jokey','s hit','cocksuck','cocksucked','cocksucks','cuntlick','cuntlicker','cuntlicking','cyberfuck','cyberfucked','cyberfucking','ejaculates','ejaculating','fingerfuck','fingerfucked','fingerfucker','fingerfucking','fingerfucks','fistfucked','fistfucker','fistfuckers','fistfucking','fistfuckings','fistfucks','fuckme','gangbanged','gangbangs','hardcoresex','jack-off','jerk-off','jiz','jizm','mothafucked','mothafucking','niggers','orgasim','orgasims','orgasms','pisses','pissin','pissoff','pricks','pussys','shitters','shitty'];

		function fitTextOnCanvas(text, fontface){    
			var ratio=canvas.width*( (text.length*0.05)+0.1 )
			if (ratio > canvas.width*0.9) {ratio = canvas.width*0.9};
		    var size = measureTextBinaryMethod(text, fontface, 0, 600, ratio);
		    return size;
		}

		function measureTextBinaryMethod(text, fontface, min, max, desiredWidth) {
		    if (max-min < 1) { return min; }
		    var test = min+((max-min)/2);
		    context.font=test+"px "+fontface;
		    measureTest = context.measureText(text).width;
		    if ( measureTest > desiredWidth) {
		        var found = measureTextBinaryMethod(text, fontface, min, test, desiredWidth)
		    } else {
		        var found = measureTextBinaryMethod(text, fontface, test, max, desiredWidth)
		    }
		    return found;
		}

		img.onload = function(){

			topT = document.getElementById("topText").value;
			bottomT = document.getElementById("bottomText").value;
			var new_str = topT;
			for (var key in f) { 
				if (!f.hasOwnProperty(key)) { continue; }
			    new_str = new_str.replace(new RegExp(key, "g"), f[key]);
			}
			topT=new_str;
			new_str = bottomT;
			for (var key in f) { 
				if (!f.hasOwnProperty(key)) { continue; }
			    new_str = new_str.replace(new RegExp(key, "g"), f[key]);
			}
			bottomT=new_str;
			topT=topT.trim().toUpperCase();
		  	bottomT=bottomT.trim().toUpperCase();
			context.canvas.width  = img.width;
			context.canvas.height  = img.height;
		  	context.drawImage(img,0,0);
		  	
			/* classic format */
			/* ----------------------------------------------------------- */

		  	/* top */
		  	var fontsize = fitTextOnCanvas(topT, "Impact");
			fHeight = parseInt(context.font.match(/\d+/), 10)
			yPos = 0 + fHeight*0.9;
			context.lineWidth = img.width/80;
			xLeft=canvas.width/2-context.measureText(topT).width/2
			context.strokeText(topT, xLeft, yPos);			
			context.fillStyle = "white";
			context.fillText(topT, xLeft, yPos);

		  	/* bottom */
		  	var fontsize = fitTextOnCanvas(bottomT, "Impact");
			fHeight = parseInt(context.font.match(/\d+/), 10)
			yPos =  img.height - fHeight*0.15;
			context.lineWidth = img.width/80;
			xLeft=canvas.width/2-context.measureText(bottomT).width/2
			context.strokeText(bottomT, xLeft, yPos);			
			context.fillStyle = "white";
			context.fillText(bottomT, xLeft, yPos);

			/* ----------------------------------------------------------- */

		};

		function updateCanvas() {
			img.src = source;
		}
		
		updateCanvas();

		function sendMeme(){
			canvas.toBlob(function(blob){
				var formData = new FormData();
				formData.append("mode", "regist");
				formData.append("MAX_FILE_SIZE", "10485760");
				formData.append("resto", "<?php echo $res;?>");
				formData.append("name", document.getElementById("name").value);
				formData.append("com", document.getElementById("com").value);
				formData.append("upfile", blob);
				var request = new XMLHttpRequest();
				request.open("POST", "imgboard.php");
				request.onload = function(e) {
				    if (request.status == 200) {
				      window.location='/<?php echo $board; ?>/imgboard.php?res=<?php echo $res; ?>';
				    } else {
				      document.body.innerHTML='something went wrong :$';
				    }
				  };

				if (new RegExp(badwords.join("|")).test(topT.trim().toLowerCase())) {
				    document.body.innerHTML='no bad words please :$';
				    return;
				}
				if (new RegExp(badwords.join("|")).test(bottomT.trim().toLowerCase())) {
				    document.body.innerHTML='no bad words please :$';
				    return;
				}

				if (topT.trim()!=""||bottomT.trim()!="") {
					request.send(formData);
				}else{
					document.body.innerHTML='Bruh, you\'re supposed to write something.';
				}


				
			}, 'image/png');
		}

		function download() {
			var download = document.getElementById("download");
			var imageDownload = document.getElementById("meme").toDataURL("image/png").replace("image/png", "image/octet-stream");
			download.setAttribute("href", imageDownload);
		}

	</script>

	<form id="form" action="" method="post" enctype="multipart/form-data">
	    <input type="text" id="topText" name="topText" placeholder="TOP TEXT" onKeyUp="updateCanvas()"><br>
	    <input type="text" id="bottomText" name="bottomText" placeholder="BOTTOM TEXT" onKeyUp="updateCanvas()"><br>

	 	Image: <select id="macro" onchange="if(document.getElementById('macro').value!=''&&document.getElementById('macro').value!='url'){source=document.getElementById('macro').value;updateCanvas();}if(document.getElementById('macro').value=='url'){source=prompt('Image URL?');updateCanvas();}">
	 		<option value="<?php echo $source;?>" selected="selected">/<?php echo $board;?>/post</option>
	 		<option value="url">Image URL</option>
	 		<option value="">-- Or choose a macro --</option>
			<?php 
				$dir    = 'memes';
				$files = scandir($dir);
				for ($i=0; $i < count($files) ; $i++) { 
					if ($files[$i]=='.'||$files[$i]=='..') {
						continue;
					}
					echo '<option value="/'.$board.'/memes/'.$files[$i].'">'.$files[$i].'</option>';
				}
			?>
		</select><br>
		
		<!--Download: <a id="download" download="<?php echo $json_post[$index]['tim'].'_'.time(); ?>.png"><button type="button" onClick="download()">💾</button></a><br>-->
		<!-- /b/ post -->
		Posting mode: Reply <a href="index.html">[Return]</a><br>
		Name: <input id="name" type="text" name="name" value="" size="35" placeholder="Name"><br>
		<input type="hidden" name="mode" value="regist" />
		<input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
		<input type="hidden" name="resto" value="<?php echo $res;?>" />
		<textarea id="com" name="com" cols="50" rows="4">>><?php echo $json_post[$index]['no'];?></textarea><br>
		<!-- -->
		<input id="postme" type="button" value="Submit!" onclick="sendMeme()">
	</form>
</body>
</html>