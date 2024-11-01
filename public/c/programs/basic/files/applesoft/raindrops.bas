0 REM Nicdem25's awesome game
100 REM Catch the raindrop
101 rem Game design by Nicholas Merchant, age 10
102 rem Programming mostly by his dad with Nicholas
103 rem version 1.7, August 2011
111 clear: home


115 print " Nicdem25games":?
:?" CATCH THE RAINDROP":?
116 print " Version 1.7":
:? " August 2011":?
117 rem print " Programmed by JRM":?
118 rem print " Concept by Nicholas Merchant"

121 ?:?"Game controls: ":?
122 ?" Left arrow (move left)"
123 ?" Right arrow (move right)"
124 ?" <SPACEBAR> (pause game)
125 ?" Q (quit)."
126 ?

130 ?"Powerdrops:"
131 ?" + = extra life"
133 ?" $ = 10 points"
134 ?" s = slow down"
135 ?
140 ?: Input "Press <RETURN> to begin.";A$

150 home
151 let level = 1
152 let lives = 3
155 let D$="*": rem default raindrop character
156 let pwl = 2: rem length of paddle expansion when powerup is caught

170 let bottomofscreen = 17: rem variable for how far the rain falls
180 let sp = 2000: rem sp is the variable that controls speed of rain
189 REM draw the bottom of screen
190 for a = 1 to 40: vtab bottomofscreen +1: htab a: ?"^";:next a
196 vtab bottomofscreen +3:?" Nicdem25: Catch the raindrop"
197 vtab 23:print "Score: "score" Level: "level" Lives: "lives;


191 REM Initial paddle position variable: p1 is the horizontal offset
192 REM PL is the paddle length in characters
193 let p1 = 18
194 let oldpos = p1
195 let PL = 10:let OPL = PL: rem OPL is the original paddle length


200 REM ++++++++++++++++++++++++++++
201 rem subroutine: falling raindrop
202 rem ++++++++++++++++++++++++++++


230 x = RND (-RND (1)): rem reseed random number
240 let x = int(rnd(1)*30)+5
241 rem assign a random x axis value for drop, 5<=x<=35

250 for y = 1 to bottomofscreen - 1
260 htab x: vtab y + 1
270 print D$;:rem draw drop at position <x,y>

271 rem delay loop controls speed: speed increases with level up to max
275 for n = 1 to sp: next n

276 gosub 900: rem do paddle subroutine

278 htab x: vtab y + 1: ?" ":rem erase old drop
279 next y



280 REM did you catch the raindrop?
284 rem missed the drop
285 if x < p1 or x > p1+PL then lives = lives -1:goto 320

290 rem caught the drop
291 print chr$(7): REM make a sound for catching the drop
292 let score = score + 1
293 if D$ = "+" then let lives = lives + 1 
294 if D$ = "E" then gosub 2000: rem expand paddle, set power timer
295 if D$ = "s" then let sp=sp+350: rem s slows down drops
296 if D$ = "$" then let score = score + 9:if score/10 <> int(score/10) then let level = level + 1



300 rem check if score is a multiple of 10: if so, level up
303 if score/10 = int(score/10) then let level = level + 1:let counter=1

304 rem every five levels, add a life
305 if counter =1 and level/5 = int(level/5) then let counter=0:gosub 700

309 rem speed up if score is a multiple of 10
310 if score/10 = int(score/10) then gosub 800

314 rem powertime counter: expanded paddle length lasts five raindrops
315 rem let ptime = ptime - 1
316 rem if ptime < 0 then let ptime = 0
317 rem if ptime = 0 then let PL = OPL

320 if lives = -1 then goto 9000:rem lost last life: go to end routine

340 vtab 23
350 print "Score: "score" Level: "level" Lives: "lives" ";

400 REM powerups: powerup 1 = expand, powerup 2 = extra life
405 let powerup = 0

410 n = RND (-RND (1)): rem reseed random number
511 let n = rnd(1)
515 if n < 0.15 then let powerup = 1
520 if n >= 0.2 and n < 0.3 then let powerup = 2
530 if n >= 0.3 and n < 0.4 then let powerup = 3

550 rem powerup characters
560 if powerup = 0 then let D$ = "*"
570 if powerup = 1 then let D$ = "+"
580 if powerup = 2 then let D$ = "s"
590 if powerup = 3 then let D$ = "$"


600 goto 200:rem go back and start a new raindrop

700 rem ++++++
710 rem lives up subroutine
720 rem ++++++
730 if (int(score/10)+1)/5 = (int(int(score/10)+1))/5 then let lives = lives +2
750 return


800 rem +++++++
810 rem speed up subroutine
820 rem ++++++
850 let sp = sp - ((level-1)*100)
855 if sp < 400 then let sp = 400
890 return


900 REM ++++++++++++++++++++++++++++++++++++++++
901 REM GET PLAYER INPUT
902 REM ++++++++++++++++++++++++++++++++++++++++
903 IF PEEK (49152) > 127 THEN K$=CHR$(PEEK (49152)-128): REM SEE IF KEY(S) PRESSED
904 IF K$ = "Q" THEN goto 9000 
905 if K$ = " " then gosub 5000
924 let oldpos = p1
935 if K$ = CHR$(8) then let p1 = p1 - 1
946 if K$ = CHR$(21) then let p1 = p1 + 1
950 if p1 < 1 then let p1 = 1
965 if p1 > 40-PL then let p1 = 40-PL
979 POKE 49168,0: REM reset keyboard input address (clear keyboard strobe)


999 REM +++++++++++
1000 REM Draw paddle
1001 rem +++++++++++

1215 for b = 0 to PL
1210 vtab bottomofscreen: htab p1 + b: ?"-";
1211 next b

1212 if oldpos < p1 then gosub 1220
1214 if oldpos > p1 then gosub 1225

1219 return

1220 REM erase old left edge of paddle subroutine
1221 vtab bottomofscreen: htab oldpos: ?" ";
1224 return

1225 REM erase old right edge of paddle subroutine
1228 vtab bottomofscreen: htab oldpos + PL: ?" ";
1230 return

1500 rem erase expanded paddle when power time is up
1510 for i = 1 to pwl
1515 if oldpos + i > 40 then goto 1530
1520 htab oldpos + i: ?" ";
1530 next i
1550 return


2000 REM increase paddle length; set power timer to five drops
2010 let PL=PL+pwl
2020 let ptime = 5
2030 return

5000 rem pause 
5010 htab 4:vtab 4:input "Paused: press <RETURN> to resume";K$
5020 htab 4:vtab 4:? " "
5040 let K$ = ""
5050 return

9000 vtab 11:htab 16:print "GAME OVER":?
9010 print " Play again (Y/N)?"
9015 get A$
9020 if A$ = "Y" then goto 150
9030 if A$ = "N" then ?" Bye!":end
9040 goto 9000
