 10  GOTO 10000
 100  REM  EDITION OF 2 NOV 1985
 1000 A$ =  LEFT$ (A$ + " ",1): IF A$ = "?" OR A$ = "CHANGE" THEN  INPUT "WHAT SHIP LETTER? > ";A$:A$ =  LEFT$ ("A" + A$,1):TY =  ASC (A$) - 64: GOSUB 1500
 1030  RETURN 
 1500  PRINT  CHR$ (4);"OPEN SHIPS, L100": PRINT  CHR$ (4);"READ SHIPS, R";TY: INPUT SH$: PRINT  CHR$ (4);"CLOSE": HOME : GOSUB 3000: PRINT FI$;" ";TI$;" ";NA$;: HTAB 30: PRINT " ";DA$: PRINT "5";BL$: VTAB 4: PRINT  MID$ (SH$,69,15);"  "; MID$ (SH$,52,15)
 1600 TN =  VAL ( MID$ (SH$,3,4)): PRINT "TONNAGE:         ";TN;:A$ = "STREAMLINED":SL$ =  MID$ (SH$,28,1): IF SL$ = "U" THEN A$ = "UN" + A$
 1610  PRINT "  ";A$: PRINT "PERFORMANCE:     ";: PRINT "JUMP-"; MID$ (SH$,8,1);:JP =  VAL ( MID$ (SH$,8,1)):PN =  VAL ( MID$ (SH$,10,1)):NA$ =  MID$ (SH$,52,15):G =  VAL ( MID$ (SH$,9,1)): PRINT "  ";G;"-G":FU =  VAL ( MID$ (SH$,23,4)): PRINT "FUEL TANKAGE:    ";FU:FY = FU:CH =  VAL ( MID$ (SH$,18,4)): PRINT "CARGO HOLD:      ";CH
 1690 SR =  VAL ( MID$ (SH$,12,2)): PRINT "STATEROOMS:        ";SR:LP =  VAL ( MID$ (SH$,15,2)): PRINT "LOW BERTHS:        ";LP:CW =  VAL ( MID$ (SH$,49,2)): PRINT "CREW:              ";CW:SA =  VAL ( MID$ (SH$,34,6)): PRINT "CREW SALARIES: ";SA:CS =  VAL ( MID$ (SH$,41,7)): PRINT "SHIP COST:     ";CS;" MCR"
 1740 AL$ =  MID$ (SH$,86,2): PRINT "ALLEGIANCE:      ";AL$: PRINT "SERVICE:         ";:SE =  VAL ( MID$ (SH$,32,1)): PRINT SE$(SE): PRINT "OPERATIONS:      ";:OP =  VAL ( MID$ (SH$,30,1)):TI$ = SE$(OP): PRINT TI$: PRINT "PAYMENTS:  ";:PA$ =  MID$ (SH$,89,3):PA =  VAL (PA$): IF  LEFT$ (PA$,1) = "S" THEN  PRINT "HALF OF REVENUES."
 1820  IF  VAL (PA$) > 0 THEN  PRINT  INT ((CS / 240) * 1E + 6);" FOR ";PA$;" MONTHS."
 1830  IF  LEFT$ (PA$,1) <  > "S" AND  VAL (PA$) < 1 THEN  PRINT "PAID OFF."
 1840  PRINT "CR FUND:         ";CR:OV = (FU * 500) + ((CST / 480) * 1000000) + (LP * 100) + (SR * 2000) + (SAL / 2) + (CST * .001) + 100:OV =  INT (OV): PRINT "MAX OVERHEAD:    ";OV: VTAB 22: PRINT "<CR> ACCEPT SHIP. A-Z DISPLAYS OTHERS   " : HTAB 1 : VTAB 23 : PRINT "   / RETURNS TO SHIP LIST"
 1882  INPUT "ACCEPT SHIP? > ";A$: IF  LEFT$ (A$,1) = "" THEN 1920
 1900 TY =  ASC ( LEFT$ (A$,1)) - 64: IF TY < 1 OR TY > 26 THEN A$ = "/":CR = 0:OH = 0: GOTO 1920
 1910  GOTO 1500
 1920  RETURN 
 2000  PRINT  CHR$ (4);"OPEN ";FI$;",L50": PRINT  CHR$ (4);"READ ";FI$;",R";A: INPUT A$: IF OP <  > 6 THEN 2110
 2050  IF XL = 0 THEN 2110
 2060  IF  MID$ (A$,42,1) <  > "*" THEN CR = CR + 50000
 2070 A$ =  LEFT$ (A$,41) + "*" + "    ": PRINT  CHR$ (4);"WRITE ";FI$;",R";A: PRINT A$:XR = XR - 1
 2110  PRINT  CHR$ (4);"CLOSE": RETURN 
 3000  IF DA = 0 THEN 3060
 3020 DD = DD + 1:DA = DA - 1: IF DD / 28 =  INT (DD / 28) AND PA <  > 0 THEN CR = CR - ((CST * 1E + 6) / 480):PA = PA - 1
 3040  IF DD / 28 =  INT (DD / 28) THEN CR = CR - SAL
 3050  IF DA > 0 THEN 3020
 3060  IF DD > 365 THEN YR = YR + 1:DD = DD - 365:MNT = 1
 3070 DA$ =  RIGHT$ ("00" +  STR$ (DD),3) + "-" +  STR$ (YR): RETURN 
 4000 P2 =  VAL ( MID$ (A1$,10,1)): IF P2 = 0 AND ( MID$ (A1$,10,1)) <  > "0" THEN P2 =  ASC ( MID$ (A1$,10,1)) - 55
 4020 T2 =  VAL ( MID$ (A1$,14,1)): IF T2 = 0 AND ( MID$ (A1$,14,1)) <  > "0" THEN T2 =  ASC ( MID$ (A1$,14,1)) - 55
 4030 P1 =  VAL ( MID$ (A$(0),10,1)): IF P1 = 0 AND ( MID$ (A$(0),10,1)) <  > "0" THEN P1 =  ASC ( MID$ (A$(0),10,1)) - 55
 4040 T1 =  VAL ( MID$ (A$(0),14,1)): IF T1 = 0 AND ( MID$ (A$(0),14,1)) <  > "0" THEN T1 =  ASC ( MID$ (A$(0),14,1)) - 55
 4050 TZ = 0: IF  MID$ (A1$,36,1) = "A" THEN TZ = 1
 4060  IF  MID$ (A1$,36,1) = "R" THEN TZ = 2
 4070  RETURN 
 5000 D =  FN B(8) + BR: IF D > 15 THEN D = 15
 5050  IF D < 2 THEN D = 2
 5060 AV = AV(D):CD = AV * CC * (1 - (BR * .05)):CC = CD * B: RETURN 
 6000 FL = 0:J = JP: FOR FL = 1 TO 169:FL(FL) = 0:J(FL) = 0: NEXT :FL = 0: FOR M = 7 - J TO 7 + J:X = XC - 7 + M: FOR N = 7 - J TO 7 + J:Y = YC - 7 + N: IF X < 1 OR X > 32 THEN 6200
 6120  IF Y < 1 OR Y > 40 THEN 6200
 6130  IF PO(X,Y) = 0 THEN 6200
 6140  IF X = XC AND Y = YC THEN 6200
 6150  IF OP > 7 AND PO(X,Y) > 0 THEN 6200
 6160  IF XC / 2 =  INT (XC / 2) THEN 6190
 6170  IF OD(N,M) =  < J THEN FL = FL + 1:J(FL) = OD(N,M):FL(FL) = PO(X,Y): GOTO 6200
 6180  GOTO 6200
 6190  IF OD(14 - N,M) =  < J THEN FL = FL + 1:J(FL) = OD(14 - N,M):FL(FL) = PO(X,Y): GOTO 6200
 6200  VTAB 11: HTAB 2: PRINT " "; RIGHT$ ("0" +  STR$ (X),2); RIGHT$ ("0" +  STR$ (Y),2):FL(FL) =  ABS (FL(FL)): NEXT : NEXT : RETURN 
 7000 CC = 4000: FOR X = 18 TO 33 STEP 3: IF  MID$ (A1$,X,2) = "  " THEN 7090
 7040  FOR X1 = 1 TO 23 STEP 2: IF X1 > 10 THEN 7070
 7060  IF  MID$ (A1$,X,2) =  MID$ ("AGASHIINPO",X1,2) THEN CC = CC - 1000: GOTO 7080
 7065  IF X1 < 11 THEN 7080
 7070  IF  MID$ (A1$,X,2) =  MID$ ("BADEFLLONIVARI",X1 - 10,2) THEN CC = CC + 1000: GOTO 7080
 7080  NEXT 
 7090  NEXT : TL =  VAL ( MID$ (A1$,14,1)): IF TL = 0 AND  MID$ (A1$,14,1) = "0" THEN TL = 0: GOTO 7110
 7103  IF TL > 0 AND TL < 10 THEN 7110
 7105 TL =  ASC ( MID$ (A1$,14,1)) - 55: IF TL > 19 THEN TL = TL - 1: IF TL > 24 THEN TL = TL - 1
 7110 CC = CC + (TL * 100):ST$ =  MID$ (A1$,6,1): IF ST$ = "A" THEN CC = CC - 1000
 7140  IF ST$ = "C" THEN CC = CC + 1000
 7150  IF ST$ = "D" THEN CC = CC + 2000
 7160  IF ST$ = "E" THEN CC = CC + 3000
 7170  IF ST$ = "X" THEN CC = CC + 5000
 7180 CA$ = ST$ + "-" +  MID$ (HE$,TL + 1,1) + " " +  MID$ (A1$,18,15) + " CR" +  STR$ (CC):A$ = CA$: RETURN 
 8000 CC = 5000: FOR X = 5 TO 20 STEP 3: IF  MID$ (B$,X,2) = "  " THEN 8620
 8040  FOR Y = 5 TO 20 STEP 3: IF  MID$ (A$,Y,2) = "BA" THEN CC = CC - 2000: GOTO 8600
 8060  IF  MID$ (A$,Y,2) = "  " THEN 8600
 8070  IF  MID$ (B$,X,2) <  > "AG" THEN 8110
 8080  FOR Z = 1 TO 15 STEP 2: IF  MID$ (A$,Y,2) =  MID$ ("AGASDEHIINLONARI",Z,2) THEN CC = CC + 1000
 8100  NEXT 
 8110  IF  MID$ (B$,X,2) <  > "AS" THEN 8150
 8120  FOR Z = 1 TO 9 STEP 2: IF  MID$ (A$,Y,2) =  MID$ ("ASINNARIVA",Z,2) THEN CC = CC + 1000
 8140  NEXT 
 8150  IF  MID$ (B$,X,2) <  > "BA" THEN 8190
 8160  FOR Z = 1 TO 3 STEP 2: IF  MID$ (A$,Y,2) =  MID$ ("AGIN",Z,2) THEN CC = CC + 1000
 8180  NEXT 
 8190  IF  MID$ (B$,X,2) <  > "DE" THEN 8230
 8200  FOR Z = 1 TO 3 STEP 2: IF  MID$ (A$,Y,2) =  MID$ ("DENA",Z,2) THEN CC = CC + 1000
 8220  NEXT 
 8230  IF  MID$ (B$,X,2) <  > "FL" THEN 8270
 8240  FOR Z = 1 TO 3 STEP 2: IF  MID$ (A$,Y,2) =  MID$ ("FLIN",Z,2) THEN CC = CC + 1000
 8260  NEXT 
 8270  IF  MID$ (B$,X,2) <  > "HI" THEN 8310
 8280  FOR Z = 1 TO 3 STEP 2: IF  MID$ (A$,Y,2) =  MID$ ("HILORI",Z,2) THEN CC = CC + 1000
 8300  NEXT 
 8310  IF  MID$ (B$,X,2) = "IC" AND  MID$ (A$,Y,2) = "IN" THEN CC = CC + 1000
 8320  IF  MID$ (B$,X,2) <  > "IN" THEN 8360
 8330  FOR Z = 1 TO 21 STEP 2: IF  MID$ (A$,Y,2) =  MID$ ("AGASFLHILONIPORI",Z,2) THEN CC = CC + 1000
 8350  NEXT 
 8360  IF  MID$ (B$,X,2) <  > "LO" THEN 8400
 8370  FOR Z = 1 TO 3 STEP 2: IF  MID$ (A$,Y,2) =  MID$ ("INRI",Z,2) THEN CC = CC + 1000
 8390  NEXT 
 8400  IF  MID$ (B$,X,2) <  > "NA" THEN 8440
 8410  FOR Z = 1 TO 7 STEP 2: IF  MID$ (A$,Y,2) =  MID$ ("AGASDEVA",Z,2) THEN CC = CC + 1000
 8430  NEXT 
 8440  IF  MID$ (B$,X,2) <  > "NI" THEN 8470
 8450  IF  MID$ (A$,Y,2) = "IN" THEN CC = CC + 1000
 8460  IF  MID$ (A$,Y,2) = "NI" THEN CC = CC - 1000
 8470  IF  MID$ (B$,X,2) = "PO" AND  MID$ (A$,Y,2) = "PO" THEN CC = CC - 1000
 8480  IF  MID$ (B$,X,2) <  > "RI" THEN 8520
 8490  FOR Z = 1 TO 11 STEP 2: IF  MID$ (A$,Y,2) =  MID$ ("AGDEHIINNARI",Z,2) THEN CC = CC + 1000
 8510  NEXT 
 8520  IF  MID$ (B$,X,2) <  > "VA" THEN 8560
 8530  FOR Z = 1 TO 5 STEP 2: IF  MID$ (A$,Y,2) =  MID$ ("ASINVA",Z,2) THEN CC = CC + 1000
 8550  NEXT 
 8560  IF  MID$ (B$,X,2) <  > "WA" THEN 8600
 8570  FOR Z = 1 TO 5 STEP 2: IF  MID$ (A$,Y,2) =  MID$ ("INRIWA",Z,2) THEN CC = CC + 1000
 8590  NEXT 
 8600  REM 
 8610  NEXT 
 8620  NEXT :TR =  VAL ( MID$ (B$,3,1)): IF TR = 0 AND  MID$ (B$,3,1) = "0" THEN TR = 0: GOTO 8640
 8635 TR =  ASC ( MID$ (B$,3,1)) - 55: IF TR > 19 THEN TR = TR - 1: IF TR > 24 THEN TR = TR - 1
 8640 TT = (TR - TL) * .1: IF TT =  <  - 1 THEN CC = 0: GOTO 8670
 8660 CC = CC + (CC * TT)
 8670  IF CC < 0 THEN CC = 0
 8680  RETURN 
 9000 DM = (T1 - T2) + ( - 3 * (P2 < 5)) + (3 * (P2 > 7)) + (TZ *  - 6):PH = 0:PM = 0:PL = 0:CG = 0: ON P1 GOTO 9060,9070,9080,9090,9100,9110,9120,9130,9140,9150
 9050  GOTO 9160
 9060 PM =  FN A(6) + DM - 2:PL =  FN B(6) + DM - 6: GOTO 9160
 9070 PH =  FN A(6) + DM -  FN A(6):PM =  FN A(6) + DM:PL =  FN B(6) + DM: GOTO 9160
 9080 PH =  FN B(6) + DM -  FN B(6):PM =  FN B(6) + DM -  FN A(7):PL =  FN B(6) + DM: GOTO 9160
 9090 PH =  FN B(6) + DM -  FN A(6):PM =  FN B(6) + DM -  FN A(7):PL =  FN C(6) + DM -  FN A(5): GOTO 9160
 9100 PH =  FN B(6) + DM -  FN A(6):PM =  FN C(6) + DM -  FN B(7):PL =  FN C(6) + DM -  FN A(5): GOTO 9160
 9110 PH =  FN C(6) + DM -  FN B(6):PM =  FN C(6) + DM -  FN B(7):PL =  FN C(6) + DM: GOTO 9160
 9120 PH =  FN C(6) + DM -  FN B(6):PM =  FN C(6) + DM -  FN A(7):PL =  FN C(6) + DM: GOTO 9160
 9130 PH =  FN C(6) + DM -  FN A(6):PM =  FN C(6) + DM -  FN A(7):PL =  FN B(6) +  FN B(8) + DM: GOTO 9160
 9140 PH =  FN C(6) + DM -  FN A(6):PM =  FN C(6) + DM:PL =  FN B(6) +  FN B(8) +  FN A(5) + DM: GOTO 9160
 9150 PH =  FN C(6) + DM:PM =  FN B(6) +  FN B(5) + DM:PL =  FN B(6) +  FN B(8) +  FN B(5) + DM: GOTO 9160
 9160 PH = PH + V1:PM = PM + V2:PL = PL + V3: IF PH < 0 THEN PH = 0
 9170  IF OP > 8 OR OP < 7 THEN PH = 0:PM = 0:PL = 0:CG = 0
 9180  IF PM < 0 THEN PM = 0
 9190  IF PL < 0 THEN PL = 0
 9210 DM = (T1 - T2) + ( - 4 * (P2 < 5)) + (1 * (P2 > 7)):CG = 0:K1 =  FN A(5):K2 =  FN A(6):K3 =  FN A(7): IF TZ = 2 THEN CG = 0: GOTO 9510
 9240  IF TZ = 1 THEN  ON P1 GOTO 9280,9300,9320,9340,9360,9380,9410,9430,9460,9490
 9250  ON P1 GOTO 9270,9290,9310,9330,9350,9370,9400,9420,9450,9480
 9260 CG = 0: GOTO 9510
 9270 CG = 10 * (K1 + DM - 4)
 9280 CG = CG + 5 * (K2 + DM - 4 + V4): GOTO 9510
 9290 CG = 10 * (K1 + DM - 2)
 9300 CG = CG + 5 * (K2 + DM - 1 + V4): GOTO 9510
 9310 CG = 10 * (K1 + DM - 1)
 9320 CG = CG + 5 * (K2 + DM + V4): GOTO 9510
 9330 CG = 10 * (K1 + DM)
 9340 CG = CG + 5 * (K2 + DM + 1 + V4): GOTO 9510
 9350 CG = 10 * (K1 + DM + 1)
 9360 CG = CG + 5 * (K2 + DM + 2 + V4): GOTO 9510
 9370 CG = 10 * (K1 + DM + 2)
 9380 CG = CG + 5 * (K2 + DM + 3 + V4):CG = CG + (K3 + DM - 3): GOTO 9510
 9400 CG = 10 * (K1 + DM + 3)
 9410 CG = CG + 5 * (K2 + DM + 4 + V4):CG = CG + (K3 + DM - 3): GOTO 9510
 9420 CG = 10 * (K1 + DM + 4)
 9430 CG = CG + 5 * (K2 + DM + 5 + V4):CG = CG + (K3 + DM - 2): GOTO 9510
 9450 CG = 10 * (K1 + DM + 5)
 9460 CG = CG + 5 * (K2 + DM + 6 + V4):CG = CG + (K3 + DM - 2): GOTO 9510
 9480 CG = 10 * (K1 + DM + 6)
 9490 CG = CG + 5 * (K2 + DM + 7 + V4):CG = CG + (K3 + DM)
 9510  IF CG < 0 THEN CG = 0
 9520  RETURN 
 10000 SP = 255: REM 
 10001  HOME :FI$ = "SPINWARD": VTAB 4: PRINT "USE SECTOR:   > ";FI$: VTAB 4: INPUT "USE SECTOR:   > ";F$: IF F$ <  > "" THEN FI$ = F$
 10012  PRINT : PRINT "READING SECTOR...": PRINT  CHR$ (4);"MONICO": PRINT  CHR$ (4);"OPEN ";FI$;".MAP,L7": PRINT  CHR$ (4);"READ ";FI$;".MAP,R0": INPUT R: DIM HX$(R),AV(15),PO(32,40),OD(13,13),FL(169),J(169),A$(169): FOR Z = 1 TO R: VTAB 15: PRINT  CHR$ (4);"READ ";FI$;".MAP,R";Z: INPUT A$:X =  VAL ( LEFT$ (A$,2)):Y =  VAL ( MID$ (A$,3,2)):PO(X,Y) = Z
 10032  IF  MID$ (A$,5,1) = "T" THEN PO(X,Y) = PO(X,Y) * ( - 1)
 10034 HX$(Z) =  LEFT$ (A$,4): NEXT : PRINT  CHR$ (4);"CLOSE": PRINT  CHR$ (4);"NOMONICO":DA = 1:YR = 1107:DA$ = "001-1107": DEF  FN A(N) =  INT ( RND (5) * 6) + 1: DEF  FN B(N) =  FN A(N) +  FN A(N): DEF  FN C(N) =  FN B(N) +  FN A(N): DEF  FN D(N) =  FN C(N) +  FN A(N):BL$ = "------------------------------------"
 10170  TEXT : HOME : PRINT FI$;" ";TI$;" ";NA$;: HTAB 30: PRINT " ";DA$: PRINT "0";BL$: PRINT  CHR$ (4);"OPEN OD JUMP": PRINT  CHR$ (4);"READ OD JUMP": FOR X = 1 TO 13: FOR Y = 1 TO 13: INPUT OD(X,Y): NEXT : NEXT : PRINT  CHR$ (4);"CLOSE": PRINT  CHR$ (4);"OPEN DATAFILE": PRINT  CHR$ (4);"READ DATAFILE": INPUT HE$: FOR X = 0 TO 9: INPUT SE$(X): NEXT : FOR X = 1 TO 15: INPUT AV(X): NEXT : PRINT  CHR$ (4);"CLOSE"
 20000  REM 
 20010  HOME : GOSUB 3000: PRINT FI$;" ";TI$;" ";NA$;: HTAB 30: PRINT " ";DA$: PRINT "1";BL$: PRINT  CHR$ (4);"OPEN SHIPS, L100": FOR X = 0 TO 25 STEP 2: PRINT  CHR$ (4);"READ SHIPS, R";X + 1: INPUT A$: VTAB (X / 2) + 4: PRINT  CHR$ (X + 65);" "; MID$ (A$,69,16): PRINT  CHR$ (4);"READ SHIPS, R";X + 2: INPUT A$: VTAB (X / 2) + 4: HTAB 20: PRINT  CHR$ (X + 66);" "; MID$ (A$,69,16): NEXT : PRINT  CHR$ (4);"CLOSE"
 20150  PRINT : INPUT "SELECT YOUR SHIP? > ";A$:A$ =  LEFT$ (A$ + "A",1):TY =  ASC (A$) - 64: IF TY < 1 OR TY > 26 THEN 20150
 20170  GOSUB 1500: IF A$ = "/" THEN 20000
 20175  HOME : PRINT "SHIP CHARACTERISTICS": PRINT BL$: INPUT "SHIP NAME? > ";A$: IF A$ = "" THEN 20200
 20190 NA$ = A$
 20200  PRINT "CREW SKILLS: ": INPUT " STEWARD-    ";A$: GOSUB 1000:V1 =  VAL (A$):SA = SA + (V1 * 300): INPUT " ADMIN-      ";A$: GOSUB 1000:V2 =  VAL (A$): INPUT " STREETWISE- ";A$: GOSUB 1000:V3 =  VAL (A$): INPUT " LIAISON-    ";A$: GOSUB 1000:V4 =  VAL (A$): INPUT "CREDIT BALANCE? > ";CR$:CR =  VAL (CR$)
 20300  VTAB 13: PRINT "STARTPOINT? (0000) > ";HX$(SP)
 20310  VTAB 13: INPUT "STARTPOINT? (0000) > ";A$: IF A$ = "" THEN 20381
 20320 A$ =  RIGHT$ ("0000" + A$,4):X =  VAL ( LEFT$ (A$,2)):Y =  VAL ( RIGHT$ (A$,2)): IF Y < 1 OR Y > 40 OR X < 1 OR X > 32 THEN 20310
 20360  IF PO(X,Y) <  > 0 THEN SP =  ABS (PO(X,Y))
 20370  IF PO(X,Y) = 0 THEN  PRINT "INVALID STARTPOINT.": GOTO 20300
 20380  PRINT "NEW STARTPOINT: ";HX$(SP)
 20381  VTAB 15: PRINT "DATE? (000-0000) > ";DA$: VTAB 15: INPUT "DATE? (000-0000) > ";A$: IF A$ = "" THEN 20390
 20383 DD =  VAL ( LEFT$ (A$,3)): IF DD < 1 OR DD > 365 THEN 20381
 20385 YR =  VAL ( MID$ (A$,5)): GOSUB 3000: PRINT "DATE: ";DA$
 20390  PRINT : PRINT "PROCESSING...":A = SP
 30020 X =  FRE (X): HOME : GOSUB 3000: PRINT FI$;" ";TI$;" ";NA$;: HTAB 30: PRINT " ";DA$: PRINT "2";BL$: GOSUB 2000:XC =  VAL ( LEFT$ (A$,2)):YC =  VAL ( MID$ (A$,3,2)): PRINT "SYSTEM: "; LEFT$ (A$,14);:A$(0) = A$: HTAB 30: PRINT  MID$ (A$,33): PRINT "OVERHEAD:  "; INT (OH);" (MAX= ";OV;"). ": PRINT "CR BALANCE: "; INT (CR);: IF UF > 0 THEN  PRINT "  UNREFINED FUEL.";
 30120  PRINT :A1$ = A$(0): IF MSG = 1 AND CG$ = HX$(A) THEN  PRINT "MESSAGE DELIVERED.":MSG = 0:BB$ = "":CG$ = ""
 30150  IF OP = 5 AND MSG = 1 THEN  PRINT "MESSAGE TO: ";BB$
 30160  IF OP = 6 THEN  PRINT XR;" UNSURVEYED WORLDS."
 30180  GOSUB 7000: IF B <  > 0 THEN  PRINT "CARGO: ";CG$: GOTO 30220
 30200  PRINT "CARGO HERE: ";CA$:B$ = CA$
 30220  PRINT "FARES RCVD: ";(PH * 10000) + (PM * 8000) + (PL * 1000) + (CG * 1000): PRINT "FARES-   HI "; SPC( PH < 10);PH;" MD "; SPC( PM < 10);PM;" LO "; SPC( PL < 10);PL;" CG "; SPC( CG < 10); SPC( CG < 100);CG: VTAB 11: PRINT "--------------DESTINATIONS-------------": GOSUB 6000
 30260  VTAB 12: PRINT " #  HEX  SHGZB AL PRICE PROFIT  FARES?": PRINT "--";BL$: IF FL = 0 THEN  PRINT "YOUR SHIP CAN'T REACH ANY WORLDS.": END 
 30280  PRINT  CHR$ (4);"OPEN ";FI$;",L50"
 30290 I = 1:I1 = 1
 30300  PRINT  CHR$ (4);"READ ";FI$;",R";FL(I): INPUT A1$: PRINT  CHR$ (4):XPL = 0: IF  MID$ (A1$,42,1) = "*" OR  MID$ (A1$,16,1) = "S" OR  MID$ (A1$,16,1) = "W" OR  MID$ (A1$,16,1) = "A" OR  MID$ (A1$,16,1) = "B" THEN XPL = 1
 30350 E$ =  MID$ (A1$,6,1):F$ = " ": IF  VAL ( MID$ (A1$,9,1)) > 0 AND  MID$ (A1$,8,1) > "1" THEN F$ = "O"
 30380  IF  VAL ( MID$ (A1$,9,1)) > 0 AND  MID$ (A1$,8,1) < "2" THEN F$ = "I"
 30390 E$ = E$ + F$ +  MID$ (A1$,38,1) +  MID$ (A1$,36,1) +  MID$ (A1$,16,1) + " " +  MID$ (A1$,33,2) + " ": GOSUB 4000: IF OP = 5 AND MSG = 0 AND ( MID$ (A1$,16,1) = "N" OR  MID$ (A1$,16,1) = "A") THEN MSG = 1:BB$ = HX$( INT ( RND (R) * R) + 1)
 30420  IF OP = 9 OR OP = 5 OR OP = 6 THEN 30470
 30430  GOSUB 7000: IF B <  > 0 THEN CC =  VAL ( MID$ (CG$,23)):B$ = CG$
 30450  GOSUB 8000: GOSUB 9000
 30470 A$(I) = A$:CA =  VAL ( MID$ (B$,23)): VTAB I1 + 13: PRINT  SPC( I < 10);I;". ";: PRINT HX$(FL(I));" ";: IF OP = 6 AND XPL = 0 THEN  PRINT "         UNSURVEYED.": GOTO 30670
 30530  PRINT E$;: IF SL$ = "U" AND ( MID$ (A1$,6,1) > "C" AND  MID$ (A1$,38,1) <  > "G") THEN  PRINT "INACCESSIBLE.": GOTO 30680
 30550  IF OP > 7 AND  MID$ (A1$,40,1) = " " THEN  PRINT "NOT A TRADEWORLD.": GOTO 30680
 30560  IF OP = 5 AND MSG = 1 AND HX$(FL(I)) = BB$ THEN  PRINT "MESSAGE ADDRESSEE.": GOTO 30670
 30570  IF OP = 9 OR OP = 5 OR OP = 6 THEN  PRINT "            ": GOTO 30670
 30580 G$ =  RIGHT$ ("      " +  STR$ ( INT (CC)),6): HTAB 19: PRINT G$;:G$ =  RIGHT$ ("      " +  STR$ ( INT (CC - CA)),6): HTAB 25: PRINT G$;" ";: IF PH > SR - CW THEN PH = SR - CW
 30620  IF PM > SR - (CW + PH) THEN PM = SR - (CW + PH)
 30630  IF PL > LP THEN PL = LP
 30640  IF CG > CH THEN CG = CH
 30650 PF = (PH * 10000) + (PM * 8000) + (PL * 1000) + (CG * 1000): HTAB 33: PRINT  SPC( PF < 10); SPC( PF < 100); SPC( PF < 1000); SPC( PF < 10000); SPC( PF < 100000); INT (PF)
 30670  GOTO 30710
 30680  PRINT  CHR$ (4): IF I = FL THEN 30760
 30700  IF FL(I + 1) = 0 THEN 30760
 30710  IF I = FL THEN 30760
 30720  IF I1 < 6 THEN I1 = I1 + 1:I = I + 1: GOTO 30300
 30730  VTAB 21: INPUT "SHOW MORE? (Y/N)  > ";A$: GOSUB 1000: IF A$ <  > "Y" THEN 30760
 30750 I1 = 1:I = I + 1: GOTO 30300
 30760  VTAB 21: INPUT "WHAT DESTINATION? > ";A$: IF A$ = "A" THEN 30290
 30780  IF A$ = "" THEN 30760
 30790 DE =  VAL (A$): IF DE > FL OR DE < 1 THEN 30730
 30800 JF = J(DE):DE = FL(DE): VTAB 11: HTAB 33: PRINT HX$(DE): IF OP = 9 OR OP = 5 THEN DA = DA + 1: GOTO 31230
 30830  IF OP = 6 THEN DA = DA + 7: GOTO 31230
 30850 A = DE: GOSUB 2000:A1$ = A$: GOSUB 4000: GOSUB 9000: IF PH > SR - CW THEN PH = SR - CW
 30910  IF PM > SR - (CW + PH) THEN PM = SR - (CW + PH)
 30920  IF PL > LP THEN PL = LP
 30930  IF CG + B > CH THEN CG = CH - B
 30940  VTAB 21: INPUT "BOARD PASSENGERS & FREIGHT? > ";A$: GOSUB 1000: IF A$ = "W" THEN  INPUT "WAIT HOW MANY DAYS? > ";A$: GOSUB 1000:DA = DA +  VAL (A$): GOTO 30940
 30942  IF A$ = "N" THEN PH = 0:PM = 0:PL = 0:CG = 0: GOTO 31000
 30944  IF A$ = "P" THEN CG = 0
 30946  IF A$ = "F" THEN PH = 0:PM = 0:PL = 0
 30950 PF = (PH * 10000) + (PM * 8000) + (PL * 1000) + (CG * 1000): IF  MID$ (SH$,89,1) = "S" THEN CR = CR +  INT (PF / 2): GOTO 30980
 30970 CR = CR + PF
 30980  PRINT "FARES= ";PF;: IF  MID$ (SH$,89,1) = "S" THEN  PRINT " LESS 50% FOR SUBSIDY.";
 30990  PRINT 
 31000  VTAB 23: PRINT "HI: ";PH;" MID: ";PM;" LOW: ";PL;" CARGO: ";CG;" TONS.": IF B <  > 0 THEN 31200
 31020  IF CR < CC THEN 31200
 31030  IF CG + B = CH THEN 31200
 31040  VTAB 21: CALL  - 868: INPUT "BUY GOODS? > ";A$: GOSUB 1000: IF A$ <  > "Y" THEN 31220
 31050  IF A$ = "Y" THEN  VTAB 21: CALL  - 868: INPUT "HOW MANY TONS? > ";A$
 31060  IF A$ = "" THEN A$ = "9999"
 31070 BC =  VAL (A$): IF BC < 1 THEN BC = 0: GOTO 31190
 31080 BA = CH - CG:A1$ = A$(0): GOSUB 7000:BB =  INT (CR / CC): IF (BC > BA) THEN BC = BA
 31130  IF BC > BB THEN BC = BB
 31140 B$ = A$:CG$ = B$:CW$ = A$(0):CR = CR - (BC * CC): VTAB 21: HTAB 20: PRINT "  ";BC;" FOR ";(BC * CC)
 31190  HTAB 20: INPUT "ADVANCE DELIVERY? > ";A$: GOSUB 1000: IF A$ = "Y" THEN CR = CR - (.2 * (BC * CC)):DA = DA + 3: GOTO 31230
 31200  REM 
 31210  IF PM = 0 AND PH = 0 AND PL = 0 AND CG = 0 AND BC = 0 THEN  INPUT "LEAVE IMMEDIATELY? > ";A$: GOSUB 1000: IF A$ = "Y" THEN DA = DA + 1: GOTO 31230
 31220 DA = DA + 5
 31230  REM 
 31240 A = DE:XF =  VAL ( LEFT$ (A1$,2)):YF =  VAL ( MID$ (A1$,3,2)):FY = FY - ((JF * TN / 10) + (10 * PN)): IF FY < 0 AND  MID$ (B$,5,5) = "HI IN" THEN FY = FY + B:B$ = "                           ":B = 0
 31290 DA = DA + 9:A = DE: GOSUB 2000:XC =  VAL ( LEFT$ (A$,2)):YC =  VAL ( MID$ (A$,3,2)):A$(0) = A$: IF SE = 1 OR SE = 2 THEN 40000
 31370 Z1 =  FN B(5) + (UF > 0) + (MNT > 0): IF Z1 < 13 THEN 40000
 31380  PRINT "MISJUMP (";Z1;"): ";:X =  INT ( RND (6) * 32) + 1:Y =  INT ( RND (4) * 40) + 1:A = PO(X,Y): IF A = 0 THEN  PRINT NA$;" IS LOST IN DEEP SPACE (HEX ";X;Y;"). ALL CARGO, CREW, AND PASSENGERS ARE LOST."
 31420 A =  ABS (A): IF A <  > 0 THEN 31440
 31430  IF A <  > 0 THEN  PRINT "SHIP IS THROWN TO "; LEFT$ (A$,4);"."
 31440  INPUT "CONTINUE? > ";Z$: IF DE <  > A AND  LEFT$ (Z$ + " ",1) = "I" THEN 40000
 31460 DE = A: IF A = 0 THEN  END 
 40000  REM 
 40010 CR = CR - ((CW + PH + PM) * 2000) + (LP * 100): HOME : GOSUB 3000: VTAB 1: PRINT FI$;" ";TI$;" ";NA$;: HTAB 30: PRINT " ";DA$: PRINT "3";BL$: PRINT "LIFE SUPPORT COSTS: ";((CW + PH + PM) * 2000) + (LP * 100): PRINT "FUEL USED: ";FU - FY:A = DE:XL = 1: GOSUB 2000:XL = 0:A$ = A$(0): PRINT "SYSTEM: "; LEFT$ (A$,14);
 40140  HTAB 30: PRINT  MID$ (A$,33,2);"   "; MID$ (A$,36,1): IF OP = 9 AND  MID$ (A$,40,1) <  > " " THEN  PRINT "XBOAT TENDER REFUELS SHIP.":FY = FU:DA = DA + 1: GOTO 40440
 40160  IF ( MID$ (A$(0),16,1) = "S" OR  MID$ (A$(0),16,1) = "W" OR  MID$ (A$(0),16,1) = "A" OR  MID$ (A$(0),16,1) = "B") AND SE = 2 THEN  PRINT "SCOUT BASE REFUELS SHIP.":FY = FU: GOTO 40440
 40170  IF ( MID$ (A$(0),16,1) = "N" OR  MID$ (A$(0),16,1) = "D" OR  MID$ (A$(0),16,1) = "A" OR  MID$ (A$(0),16,1) = "B") AND SE = 1 THEN  PRINT "NAVAL BASE REFUELS SHIP.":FY = FU: GOTO 40440
 40180  PRINT "GAS GIANT: ";:C$ = "ABSENT.":GG = 0: IF  MID$ (A$(0),38,1) = "G" THEN C$ = "PRESENT.":GG = 1
 40190  PRINT C$;: IF SL$ = "U" THEN  PRINT : GOTO 40270
 40210  HTAB 22: PRINT "OCEANS: ";:C$ = "ABSENT. ":HY = 0: IF  ASC ( MID$ (A$(0),9,1)) > 48 AND  ASC ( MID$ (A$(0),8,1)) < 50 THEN C$ = "ICE-CAPPED.":HY = 2
 40250  IF  ASC ( MID$ (A$(0),9,1)) > 48 AND  VAL ( MID$ (A$(0),8,1)) > 1 THEN C$ = "PRESENT. ":HY = 1
 40260  PRINT C$
 40270  IF GG = 1 THEN  INPUT "SKIM GAS GIANT?      > ";A$
 40280  GOSUB 1000: IF A$ = "Y" THEN DA = DA + 2:FY = FU:UF = UF + 1: GOTO 40430
 40290  IF HY = 1 AND SL$ <  > "U" THEN  INPUT "OCEAN REFUEL?        > ";A$
 40300  GOSUB 1000: IF A$ = "Y" THEN DA = DA + 1:FY = FU:UF = UF + 1: GOTO 40430
 40310  IF HY = 2 THEN  INPUT "ICECAP REFUEL?       > ";A$
 40320  GOSUB 1000: IF A$ = "Y" THEN DA = DA + 4:FY = FU:UF = UF + 1: GOTO 40430
 40330  IF FY >  = FU THEN 40440
 40340 RF = 0: IF  MID$ (A$(0),6,1) = "A" OR  MID$ (A$(0),6,1) = "B" THEN RF = 1
 40350  IF RF = 1 THEN  PRINT "REFINED AND ";
 40360  PRINT "UNREFINED FUEL AVAILABLE.": IF  MID$ (SH$,28,1) = "U" AND  MID$ (A$(0),6,1) > "C" THEN  PRINT "SURFACE REFUELLING FACILITIES ARE       INACCESSIBLE. REFUELLING TAKES 14 DAYS.":DA = 14: GOSUB 3000:UF = UF + 1:FY = FU: GOTO 40440
 40380  INPUT "REFUEL WITH (R/U) > ";A$:A$ =  LEFT$ (A$ + "R",1): IF A$ = "R" AND RF = 0 THEN A$ = "U"
 40400  IF A$ = "R" THEN CF = (FU - FY) * 500:FY = FU:UF = UF - 1
 40410  IF A$ = "U" THEN CF = (FU - FY) * 100:FY = FU:UF = UF + 1
 40420  IF CF <  > 0 THEN  PRINT "BOUGHT CR";CF;" OF FUEL."
 40430  IF UF < 1 THEN UF = 0
 40440  PRINT :B = BC: IF OP <  > 7 THEN 50000
 40480  PRINT  CHR$ (4);"OPEN ";FI$;", L50": PRINT  CHR$ (4);"WRITE ";FI$;", R";DE: PRINT  LEFT$ (A$(0),41);"* ": PRINT  CHR$ (4);"CLOSE"
 50000  REM 
 50001  IF B < 1 THEN 50350
 50010  VTAB 11: GOSUB 3000: PRINT FI$;" ";TI$;" ";NA$;: HTAB 30: PRINT " ";DA$: PRINT "4";BL$:B$ = CG$:A1$ = A$(0): GOSUB 7000: GOSUB 8000: PRINT B;" TONS OF ";: PRINT B$: PRINT "BASE COST: "; MID$ (B$,19);: HTAB 21: PRINT "BASE PRICE:  ";CC:CB =  VAL ( MID$ (B$,23)): INPUT "SELL GOODS? > ";A$: GOSUB 1000: IF A$ <  > "Y" THEN 50420
 50140 BR =  ASC ( MID$ (A$(0),6,1)) - 64:BR = 5 - BR: IF BR < 1 THEN  PRINT "NO BROKERS AVAILABLE.":BR = 0: GOTO 50230
 50170  IF BR = 1 THEN  PRINT "BROKER-1 AVAILABLE."
 50180  IF BR > 1 THEN  PRINT "BROKER-1 TO ";BR;" AVAILABLE."
 50190  INPUT "USE A BROKER? > ";A$: GOSUB 1000: IF  LEFT$ (A$,1) = "Y" THEN  INPUT "WHICH NUMBER? > ";A$
 50210  IF  VAL (A$) < 0 OR  VAL (A$) > BR THEN 50190
 50220 BR =  VAL (A$)
 50230 A$ = A$(0): PRINT B;" TONS AT CR";CB;" BASE COST.": GOSUB 5000:E =  INT (100 * CD / CB): IF E = 100 THEN  PRINT "SOLD AT NO PROFIT.": GOTO 50300
 50280  IF E < 100 THEN  PRINT "SOLD AT ";100 - E;"% LOSS.": GOTO 50300
 50290  IF E > 100 THEN  PRINT "SOLD AT ";E - 100;"% PROFIT.": GOTO 50300
 50300  PRINT "BROKER COMMISSION: ";BR * 5;"%.": PRINT "PROCEEDS: ";CC;" ("; INT (CC / B);" PER TON).":CR = CR + CC:B$ = "":B = 0:BC = 0
 50350  IF MNT < 1 THEN 50410
 50360  PRINT FI$;" ";TI$;" ";NA$;: HTAB 30: PRINT " ";DA$: PRINT "6";BL$: IF MNT > 0 THEN  PRINT : PRINT "THE SHIP NEEDS ANNUAL MAINTENANCE."
 50375  IF OP = 5 AND ( MID$ (A$(0),26,1) = "B" OR  MID$ (A$(0),26,1) = "W") THEN 50380
 50377  IF ST < 3 THEN 50380
 50379  GOTO 50400
 50380  INPUT "PERFORM IT NOW? > ";A$: GOSUB 1000: IF A$ = "Y" THEN DA = DA + 14:MNT = 0: PRINT "MAINTENANCE COST: ";((CST * 1E + 6) * .001)
 50400  REM 
 50410  VTAB 23: INPUT "CONTINUE? > ";Z$
 50420 OH = (LP * 100) + ((PH + PM + CW) * 2000) + (SAL * .5) + 100 + ((.001 / 24) * 1E + 6 * CST) + (SAL / 24):CR = CR - OH: GOTO 30020