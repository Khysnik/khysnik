10 slow=3: level=1: lives=3: score=0
20 gt$=CHR$(286): ga$=CHR$(287): go$=gt$  
30 ml$=CHR$(267): mr$=CHR$(266): mu$=CHR$(282): md$=CHR$(283): ms$=CHR$(284): mo$=ml$
40 d$=CHR$(284)+CHR$(282)+CHR$(268)+CHR$(269)+CHR$(270)+CHR$(42)
50 GOSUB 6000

100 DIM map(31,23)
101 DATA "9999999999999999999999999999999"
102 DATA "9000000000000009000000000000009"
103 DATA "9299999099999909099999909999929"
104 DATA "9099999099999909099999909999909"
105 DATA "9000000000000000000000000000009"
106 DATA "9099999099099999999909909999909"
107 DATA "9099999099000009000009909999909"
108 DATA "9000000099999909099999900000009"
109 DATA "9999999099999909099999909999999"
110 DATA "9999999099111111111119909999999"
111 DATA "1111111011199999999911101111111"
112 DATA "9999999099111111111119909999999"
113 DATA "9999999099199999999919909999999"
114 DATA "9000000000000009000000000000009"
115 DATA "9299999099999909099999909999929"
116 DATA "9099999099999909099999909999909"
117 DATA "9000099000000000000000009900009"
118 DATA "9999099099099999999909909909999"
119 DATA "9000000099000009000009900000009"
120 DATA "9099999999999909099999999999909"
121 DATA "9099999999999909099999999999909"
122 DATA "9000000000000000000000000000009"
123 DATA "9999999999999999999999999999999"

150 DIM me(8): DIM gho(4,8)
180 gho(1,1)=12: gho(1,2)=10: gho(1,4)=0
181 gho(1,5)=-1: gho(1,6)=0: gho(1,7)=0: gho(1,8)=-1
182 gho(2,1)=18: gho(2,2)=10: gho(2,4)=0
183 gho(2,5)=1: gho(2,6)=0: gho(2,7)=0: gho(2,8)=1
184 gho(3,1)=12: gho(3,2)=12: gho(3,4)=0
185 gho(3,5)=-1: gho(3,6)=0: gho(3,7)=0: gho(3,8)=-1
186 gho(4,1)=18: gho(4,2)=12: gho(4,4)=0
187 gho(4,5)=1: gho(4,6)=0: gho(4,7)=0: gho(4,8)=1
190 me(1)=15: me(2)=17: me(4)=136
191 me(5)=-1: me(6)=0: me(7)=-1: me(8)=0

200 TEXT: HOME
201 PRINT CHR$(272)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(278)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(274)
202 PRINT CHR$(280)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(280)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(280)
203 PRINT CHR$(280)CHR$(285)CHR$(256)CHR$(265)CHR$(265)CHR$(265)CHR$(258)CHR$(271)CHR$(256)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(258)CHR$(271)CHR$(280)CHR$(271)CHR$(256)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(258)CHR$(271)CHR$(256)CHR$(265)CHR$(265)CHR$(265)CHR$(258)CHR$(285)CHR$(280)
204 PRINT CHR$(280)CHR$(271)CHR$(257)CHR$(265)CHR$(265)CHR$(265)CHR$(259)CHR$(271)CHR$(257)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(259)CHR$(271)CHR$(280)CHR$(271)CHR$(257)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(259)CHR$(271)CHR$(257)CHR$(265)CHR$(265)CHR$(265)CHR$(259)CHR$(271)CHR$(280)
205 PRINT CHR$(280)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(280)
206 PRINT CHR$(280)CHR$(271)CHR$(256)CHR$(265)CHR$(265)CHR$(265)CHR$(258)CHR$(271)CHR$(256)CHR$(258)CHR$(271)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(278)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(271)CHR$(256)CHR$(258)CHR$(271)CHR$(256)CHR$(265)CHR$(265)CHR$(265)CHR$(258)CHR$(271)CHR$(280)
207 PRINT CHR$(280)CHR$(271)CHR$(257)CHR$(265)CHR$(265)CHR$(265)CHR$(259)CHR$(271)CHR$(264)CHR$(264)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(280)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(264)CHR$(264)CHR$(271)CHR$(257)CHR$(265)CHR$(265)CHR$(265)CHR$(259)CHR$(271)CHR$(280)
208 PRINT CHR$(280)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(264)CHR$(257)CHR$(265)CHR$(265)CHR$(265)CHR$(258)CHR$(271)CHR$(280)CHR$(271)CHR$(256)CHR$(265)CHR$(265)CHR$(265)CHR$(259)CHR$(264)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(280)
209 PRINT CHR$(273)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(274)CHR$(271)CHR$(264)CHR$(256)CHR$(265)CHR$(265)CHR$(265)CHR$(259)CHR$(271)CHR$(280)CHR$(271)CHR$(257)CHR$(265)CHR$(265)CHR$(265)CHR$(258)CHR$(264)CHR$(271)CHR$(272)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(275)
210 PRINT CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(275)CHR$(271)CHR$(257)CHR$(259)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(257)CHR$(259)CHR$(271)CHR$(273)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)
211 PRINT CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(271)CHR$(032)CHR$(032)CHR$(032)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(032)CHR$(032)CHR$(032)CHR$(271)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)
212 PRINT CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(274)CHR$(271)CHR$(256)CHR$(258)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(032)CHR$(256)CHR$(258)CHR$(271)CHR$(272)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)
213 PRINT CHR$(272)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(275)CHR$(271)CHR$(257)CHR$(259)CHR$(032)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(278)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(032)CHR$(257)CHR$(259)CHR$(271)CHR$(273)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(274)
214 PRINT CHR$(280)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(280)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(280)
215 PRINT CHR$(280)CHR$(285)CHR$(256)CHR$(265)CHR$(265)CHR$(265)CHR$(258)CHR$(271)CHR$(256)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(258)CHR$(271)CHR$(280)CHR$(271)CHR$(256)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(258)CHR$(271)CHR$(256)CHR$(265)CHR$(265)CHR$(265)CHR$(258)CHR$(285)CHR$(280)
216 PRINT CHR$(280)CHR$(271)CHR$(257)CHR$(265)CHR$(265)CHR$(258)CHR$(264)CHR$(271)CHR$(257)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(259)CHR$(271)CHR$(280)CHR$(271)CHR$(257)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(259)CHR$(271)CHR$(264)CHR$(256)CHR$(265)CHR$(265)CHR$(259)CHR$(271)CHR$(280)
217 PRINT CHR$(280)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(264)CHR$(264)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(264)CHR$(264)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(280)
218 PRINT CHR$(276)CHR$(281)CHR$(281)CHR$(281)CHR$(271)CHR$(257)CHR$(259)CHR$(271)CHR$(256)CHR$(258)CHR$(271)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(278)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(271)CHR$(256)CHR$(258)CHR$(271)CHR$(257)CHR$(259)CHR$(271)CHR$(281)CHR$(281)CHR$(281)CHR$(277)
219 PRINT CHR$(280)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(264)CHR$(264)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(280)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(264)CHR$(264)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(280)
220 PRINT CHR$(280)CHR$(271)CHR$(256)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(259)CHR$(257)CHR$(265)CHR$(265)CHR$(265)CHR$(258)CHR$(271)CHR$(280)CHR$(271)CHR$(256)CHR$(265)CHR$(265)CHR$(265)CHR$(259)CHR$(257)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(258)CHR$(271)CHR$(280)
221 PRINT CHR$(280)CHR$(271)CHR$(257)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(259)CHR$(271)CHR$(280)CHR$(271)CHR$(257)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(265)CHR$(259)CHR$(271)CHR$(280)
222 PRINT CHR$(280)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(271)CHR$(280)
223 PRINT CHR$(273)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(281)CHR$(275)

300 REM====READ IN MAP====
305 RESTORE
310 dots=0
315 HTAB 40: VTAB 8: PRINT "Level: ";: PRINT level;
320 FOR j=1 TO 23
325 HTAB 40: VTAB 10: PRINT "Finished Loading in:   ";
330 HTAB 61: VTAB 10: PRINT 23-j;
335 READ r$
340 FOR i=1 TO 31: map(i,j)=VAL( MID$( r$, i, 1)) 
345 IF map(i,j)=0 THEN dots=dots + 1
350 IF map(i,j)=2 THEN dots=dots + 1
355 NEXT
360 NEXT
365 HTAB 40: VTAB 10: PRINT "                       ";

400 count=0
450 me(4)=PEEK (49152): count=count + 1
452 HTAB 40: VTAB 10: PRINT "Score: ";: PRINT score;
454 HTAB 40: VTAB 12: PRINT "Lives: ";: PRINT lives;
460 IF me(4)=136 THEN me(7)=-1:me(8)=0: REM ==== LEFT
462 IF me(4)=138 THEN me(7)=0:me(8)=1:  REM ==== DOWN
464 IF me(4)=139 THEN me(7)=0:me(8)=-1: REM ==== UP
466 IF me(4)=149 THEN me(7)=1:me(8)=0:  REM ==== RIGHT
472 IF map(me(1),me(2))=0 THEN dots=dots-1:map(me(1),me(2))=-1:score=score+50
474 IF map(me(1),me(2))=2 THEN dots=dots-1:map(me(1),me(2))=-1:GOSUB 1000
476 IF dots=0 THEN GOTO 5000: REM ==== Next Level  
478 HTAB me(1): VTAB me(2): PRINT ms$;
490 IF (count/slow) <> INT(count/slow) THEN GOTO 450

500 GOSUB 600
505 IF me(5)=-1 THEN mo$=ml$
510 IF me(5)=1 THEN mo$=mr$
511 IF me(6)=-1 THEN mo$=mu$
511 IF me(6)=1 THEN mo$=md$
515 HTAB me(1): VTAB me(2): PRINT mo$;
520 FOR wg=1 to 4
525 IF gho(wg,4) > 0 THEN go$=ga$
530 IF gho(wg,4) <=0 THEN go$=gt$
532 IF me(1)=gho(wg,1) THEN IF me(2)=gho(wg,2) THEN GOSUB 550
534 GOSUB 800
536 HTAB gho(wg,1): VTAB gho(wg,2): PRINT go$;: gho(wg,4)=gho(wg,4)-1
538 IF me(1)=gho(wg,1) THEN IF me(2)=gho(wg,2) THEN GOSUB 550
540 NEXT
545 GOTO 450

550 IF gho(wg,4) > 0 THEN GOTO 580: REM EATABLE GHOST
560 POP: GOTO 5100
580 score=score + prize: prize=prize * 2
582 gho(wg,1)=15: gho(wg,2)=10: gho(wg,4)=0
584 gho(wg,5)=1: gho(wg,6)=0: gho(wg,7)=0: gho(wg,8)=1
586 RETURN

600 REM====TRY TO MOVE IN NEW DIRECTION====
605 IF map(me(1)+me(7),me(2)+me(8)) > 2 THEN GOTO 650
610 HTAB me(1): VTAB me(2): PRINT " ";
615 me(1)=me(1)+me(7): me(2)=me(2)+me(8)
620 me(5)=me(7): me(6)=me(8)
625 IF me(1) <=1 THEN me(1)=30
630 IF me(1) >=31 THEN me(1)=2
635 RETURN
650 REM====TRY TO MOVE IN CURRENT DIRECTION====
655 IF map(me(1)+me(5),me(2)+me(6)) > 2 THEN RETURN
660 HTAB me(1): VTAB me(2): PRINT " ";
665 me(1)=me(1)+me(5): me(2)=me(2)+me(6)
670 IF me(1) <=1 THEN me(1)=30
675 IF me(1) >=31 THEN me(1)=2
680 RETURN

800 REM====TRY TO MOVE GHOST IN NEW DIRECTION====
805 IF map(gho(wg,1)+gho(wg,7),gho(wg,2)+gho(wg,8)) > 2 THEN GOTO 850
810 HTAB gho(wg,1): VTAB gho(wg,2)
815 x=map(gho(wg,1),gho(wg,2)): GOSUB 2000
820 gho(wg,1)=gho(wg,1)+gho(wg,7): gho(wg,2)=gho(wg,2)+gho(wg,8)
825 gho(wg,5)=gho(wg,7): gho(wg,6)=gho(wg,8): GOSUB 900
830 IF gho(wg,1) <=1 THEN gho(wg,1)=2: gho(wg,5)=gho(wg,5) * -1
835 IF gho(wg,1) >=31 THEN gho(wg,1)=30: gho(wg,5)=gho(wg,5) * -1
840 RETURN

850 REM====TRY TO MOVE GHOST IN CURRENT DIRECTION====
855 IF map(gho(wg,1)+gho(wg,5),gho(wg,2)+gho(wg,6)) > 2 THEN GOTO 950
860 HTAB gho(wg,1): VTAB gho(wg,2)
865 x=map(gho(wg,1),gho(wg,2)): GOSUB 2000
870 gho(wg,1)=gho(wg,1)+gho(wg,5): gho(wg,2)=gho(wg,2)+gho(wg,6)
875 IF gho(wg,1) <=1 THEN gho(wg,1)=2: gho(wg,5)=gho(wg,5) * -1
880 IF gho(wg,1) >=31 THEN gho(wg,1)=30: gho(wg,5)=gho(wg,5) * -1
885 RETURN

900 REM====NEW NEW DIRECTION FOR GHOST ATTACK====
902 IF gho(wg,4) > 0 THEN GOTO 920
904 IF gho(wg,7)=0 THEN GOTO 912
906 REM====NEW VERTICAL====
908 IF me(2) < gho(wg,2) THEN gho(wg,7)=0: gho(wg,8)=-1: RETURN
910 gho(wg,7)=0: gho(wg,8)=1: RETURN
912 REM====NEW HORIZONTAL====
914 IF me(1) < gho(wg,1) THEN gho(wg,7)=-1: gho(wg,8)=0: RETURN
916 gho(wg,7)=1: gho(wg,8)=0: RETURN

920 REM====NEW NEW DIRECTION FOR GHOST RETREAT====
924 IF gho(wg,7)=0 THEN GOTO 932
926 REM====NEW VERTICAL====
928 IF me(2) < gho(wg,2) THEN gho(wg,7)=0: gho(wg,8)=1: RETURN
930 gho(wg,7)=0: gho(wg,8)=-1: RETURN
932 REM====NEW HORIZONTAL====
934 IF me(1) < gho(wg,1) THEN gho(wg,7)=1: gho(wg,8)=0: RETURN
936 gho(wg,7)=-1: gho(wg,8)=0: RETURN

950 REM====NEW CURRENT DIRECTION FOR GHOST====
955 pik=INT(RND(1)*7)+1
960 IF pik=1 THEN gho(wg,5)=1:gho(wg,6)=0:gho(wg,7)=0:gho(wg,8)=1:RETURN
961 IF pik=2 THEN gho(wg,5)=-1:gho(wg,6)=0:gho(wg,7)=0:gho(wg,8)=1:RETURN
962 IF pik=3 THEN gho(wg,5)=1:gho(wg,6)=0:gho(wg,7)=0:gho(wg,8)=-1:RETURN
963 IF pik=4 THEN gho(wg,5)=-1:gho(wg,6)=0:gho(wg,7)=0:gho(wg,8)=-1:RETURN
964 IF pik=5 THEN gho(wg,5)=0:gho(wg,6)=1:gho(wg,7)=1:gho(wg,8)=0:RETURN
965 IF pik=6 THEN gho(wg,5)=0:gho(wg,6)=-1:gho(wg,7)=1:gho(wg,8)=0:RETURN
966 IF pik=7 THEN gho(wg,5)=0:gho(wg,6)=1:gho(wg,7)=-1:gho(wg,8)=0:RETURN
967 IF pik=8 THEN gho(wg,5)=0:gho(wg,6)=-1:gho(wg,7)=-1:gho(wg,8)=0:RETURN

1000 FOR i=1 TO 4: gho(i,4)=30: NEXT: prize=2000: RETURN: REM ==== POWER UP

2000 IF x=0 THEN PRINT CHR$(271);: RETURN
2002 IF x=2 THEN PRINT CHR$(285);: RETURN
2004 PRINT " ";: RETURN

5000 slow=slow - 1: IF slow < 1 THEN slow=1
5010 level=level + 1
5020 GOTO 180

5100 lives=lives - 1
5110 FOR j=1 TO 6: HTAB me(1): VTAB me(2): PRINT MID$( d$, j, 1);
5115 FOR k=1 to 300: NEXT: NEXT
5120 IF lives=0 THEN GOTO 5500
5125 FOR j=1 TO 4: HTAB gho(j,1): VTAB gho(j,2)
5126 x=map(gho(j,1),gho(j,2)): GOSUB 2000: NEXT
5130 me(1)=15: me(2)=17: me(4)=136
5132 me(5)=-1: me(6)=0: me(7)=-1: me(8)=0
5134 gho(1,1)=12: gho(1,2)=10: gho(1,4)=0
5136 gho(1,5)=-1: gho(1,6)=0: gho(1,7)=0: gho(1,8)=-1
5138 gho(2,1)=18: gho(2,2)=10: gho(2,4)=0
5140 gho(2,5)=1: gho(2,6)=0: gho(2,7)=0: gho(2,8)=1
5142 gho(3,1)=12: gho(3,2)=12: gho(3,4)=0
5144 gho(3,5)=-1: gho(3,6)=0: gho(3,7)=0: gho(3,8)=-1
5146 gho(4,1)=18: gho(4,2)=12: gho(4,4)=0
5148 gho(4,5)=1: gho(4,6)=0: gho(4,7)=0: gho(4,8)=1
5149 HTAB me(1): VTAB me(2): PRINT mr$;:FOR k=1 to 300: NEXT
5150 GOTO 400

5500 HTAB 40: VTAB 10: PRINT "Score: ";: PRINT score;
5510 HTAB 40: VTAB 12: PRINT "Lives: ";: PRINT lives;
5520 HTAB 40: VTAB 14: PRINT "GAME OVER !";
5550 END

6000 PR#3 : TEXT: HOME: HTAB 30: VTAB 5: PRINT "(Not Really) ASCII": PRINT ""
6001 PRINT " MMMMMMMM                8OOOO8:      ,";
6002 PRINT "NI    ,M                    MMM?    MM8"
6003 PRINT " MMMMMMMMMN  MMM       OOOOOOOOOO     M";
6004 PRINT "MM~   MMM         MMM~      MMMMN   MM7"
6005 PRINT " 8MMMMMMMMM ?MMMM     OOOOOOOOOOOO:  ~M";
6006 PRINT "MMM  MMMMM        MMMM      MMMMMN  MM:"
6007 PRINT "  MMM8O8MMM MMMMMM   8OOOOOOOO$      MM";
6008 PRINT "MMM~?MMMMMM      7MMMMM     NMMMMMN MM "
6009 PRINT "  MMMO  NMM MM MMMD  OOOO8          :MM";
6010 PRINT "MMMMMM MMMMM,    MM MMMM    DMMMMMMMMM "
6011 PRINT "  ~MMMMMMM  MM $MMM  OOOOOO8        MM:";
6012 PRINT " MMMM+  MMMMM    MM  MMMM   8MMMMMMMMM "
6013 PRINT "   MMMD:   MMN+8MMMM +OOOOOOOOOO$  :MN ";
6014 PRINT " ,MMM    MMMMN  ~MM=ZMMMM+  DMM MMMMMM "
6015 PRINT "   MMM     MMMMMMMMMM 8OOOOOOOOOO8 MM  ";
6016 PRINT "  7M     OMMMM8 MMMMMMMMMM  OMM  MMMMM "
6017 PRINT "    MM     MM    MMMMM :OOOOOOOO? $M   ";
6018 PRINT "   O      MMI   MM    ZMMMM $MM   ZMMM "
6019 PRINT "    7             Z      =OO=        ";
6020 PRINT "                       N               "
6100 HTAB 32: VTAB 18: PRINT "by Michael Kemp"
6105 HTAB 29: VTAB 19: PRINT "tweaks by Joshua Bell"
6110 HTAB 29: VTAB 20: PRINT "Hit ENTER to begin..."
6200 IF PEEK (49152) <> 141 THEN GOTO 6200
6210 RETURN