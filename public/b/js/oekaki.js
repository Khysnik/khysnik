var oekakiUsed=false;
var oekakiStartTimer, oekakiTime;

function getoffset(el){
	if(!el){
		el = this;
	}

	var x = el.offsetLeft;
	var y = el.offsetTop;

	while (el = el.offsetParent) {
		x += el.offsetLeft;
		y += el.offsetTop;
	}

	return [x, y];
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function oekakiGetTime(){
	/*
	h='';
	m='';
	s='';
	oekakiTime = new Date(Date.now()-oekakiStartTimer);
	if (oekakiTime.getHours()-1==1){h=oekakiTime.getHours()+' hour '}
	if (oekakiTime.getHours()-1>1){h=oekakiTime.getHours()+' hours '}
	if (oekakiTime.getMinutes()==1){m=oekakiTime.getMinutes()+' minute '}
	if (oekakiTime.getMinutes()>1){m=oekakiTime.getMinutes()+' minutes '}
	if (oekakiTime.getSeconds()==1){s=oekakiTime.getSeconds()+' second'}
	if (oekakiTime.getSeconds()>1){s=oekakiTime.getSeconds()+' seconds'}
	result = m+s;
	setCookie("oekakiTimeSpend", result,1);
	*/
}

function start(e){
	offsets = getoffset(oekaki.canvas);
	if(e.type == 'mousedown'){
		if (oekakiUsed==false) {oekakiStartTimer=Date.now()};
		oekakiUsed=true;
		oekaki.mouseX = e.pageX - offsets[0] - 2;
		oekaki.mouseY = e.pageY - offsets[1] - 2;
		if(oekaki.touch == true){
			oekaki.touch = false;
			return;
		}
		oekaki.touch = false;
	}
	else if(e.type == 'touchstart'){
		oekaki.mouseX = e.changedTouches[0].pageX - offsets[0] - 2;
		oekaki.mouseY = e.changedTouches[0].pageY - offsets[1] - 2;
		oekaki.touch = true;
	}
	if(oekaki.bucketfill){
		//create a copy of the image's current state for modification
		var canvas = oekaki.context.getImageData(0, 0, oekaki.canvas.width, oekaki.canvas.height);
		//create an array of pixels to scan, and a 2d array to see if a pixel has already been scanned
		var scan = [{x: oekaki.mouseX, y: oekaki.mouseY}];
		var scanned = [];
		for(var x = 0; x < oekaki.canvas.width; x++){
			scanned[x] = new Array(oekaki.canvas.width);
		}
		scanned[oekaki.mouseX][oekaki.mouseY] = true;
		//get color of clicked pixel
		var target = [];
		var offset = (oekaki.mouseY * oekaki.canvas.width + oekaki.mouseX) * 4;
		target[0] = canvas.data[offset];
		target[1] = canvas.data[offset+1];
		target[2] = canvas.data[offset+2];
		target[3] = canvas.data[offset+3];
		//only fill if the selected color is different
		if(!(target[0] == oekaki.colors[0] && target[1] == oekaki.colors[1] && target[2] == oekaki.colors[2] && target[3] == oekaki.colors[3])){
			var translation = [[1, 0], [0, 1], [-1, 0], [0, -1]];
			for(var i = 0; i < scan.length; i++){
				//fill the current pixel
				var current = scan[i];
				offset = (current.y * oekaki.canvas.width + current.x) * 4;
				canvas.data[offset] = oekaki.colors[0];
				canvas.data[offset+1] = oekaki.colors[1];
				canvas.data[offset+2] = oekaki.colors[2];
				canvas.data[offset+3] = oekaki.colors[3];
				//check adjacent pixels
				for(var j = 0; j < 4; j++){
					var k = {x: current.x + translation[j][0], y: current.y + translation[j][1]};
					//don't go out of bounds
					if(k.x >= 0 && k.x < oekaki.canvas.width && k.y >= 0 && k.y < oekaki.canvas.height){
						offset = (k.y * oekaki.canvas.width + k.x) * 4;
						//don't go over a pixel more than once
						if(scanned[k.x][k.y] != true){
							scanned[k.x][k.y] = true;
							if(canvas.data[offset] == target[0] && canvas.data[offset+1] == target[1] && canvas.data[offset+2] == target[2] && canvas.data[offset+3] == target[3]){
								scan.push(k);
							}
							else{
								//deal with anti-aliasing
								canvas.data[offset] = oekaki.colors[0];
								canvas.data[offset+1] = oekaki.colors[1];
								canvas.data[offset+2] = oekaki.colors[2];
								canvas.data[offset+3] = oekaki.colors[3];
							}
						}
					}
				}
			}
		}
		//write the stored copy back
		oekaki.context.putImageData(canvas, 0, 0);
	}
	else if(oekaki.paint != true){
		oekaki.paint = true;
		oekaki.context.beginPath();
		oekaki.context.fillStyle = oekaki.color;
		oekaki.context.arc(oekaki.mouseX, oekaki.mouseY, oekaki.width/2, 0, 2*Math.PI)
		oekaki.context.fill();
	}
}

function move(e){
	if(oekaki.paint){
		oekaki.context.strokeStyle = oekaki.color;
		oekaki.context.lineJoin = 'round';
		oekaki.context.lineCap = 'round';
		oekaki.context.lineWidth = oekaki.width;
		oekaki.context.beginPath();
		oekaki.context.moveTo(oekaki.mouseX, oekaki.mouseY)
		offsets = getoffset(oekaki.canvas);
		if(e.type == 'mousemove'){
			oekaki.mouseX = e.pageX - offsets[0] - 2;
			oekaki.mouseY = e.pageY - offsets[1] - 2;
		}
		else if(e.type == 'touchmove'){
			oekaki.mouseX = e.changedTouches[0].pageX - offsets[0] - 2;
			oekaki.mouseY = e.changedTouches[0].pageY - offsets[1] - 2;
		}
		oekaki.context.lineTo(oekaki.mouseX, oekaki.mouseY);
		oekaki.context.stroke();
	}
}

function end(e){
	oekaki.paint = false;
}

var oekaki = {
	parentel: null,
	applet: null,
	canvas: null,
	finishbutton: null,
	widthselect: null,

	colors: [0,0,0,255],
	color: '#000000',
	mouseX: null,
	mouseY: null,
	width: 3,
	paint: false,
	touch: null,
	bucketfill: null,
	start: function(options) {
		this.parentel = document.getElementById(options.parentel);

		// Prepare applet
		this.applet = document.createElement('div');
		this.applet.id = 'oekaki';
		this.applet.style.width = options.width+'px';
		this.applet.style.height = options.height+'px';
		this.parentel.appendChild(this.applet);

		// Prepare canvas
		this.canvas = document.createElement('canvas');
		this.canvas.id = 'oekaki-canvas';
		this.canvas.width = options.width;
		this.canvas.height = options.height;
		this.applet.appendChild(this.canvas);

		// Prepare context
		this.context = this.canvas.getContext('2d');
		
		this.context.fillStyle = 'rgba(255, 255, 255, 0)';
		this.context.fillRect(0,0,options.width,options.height);
		
		//Prepare tool selection
		this.toolselection = document.createElement('select');
		this.toolselection.id = 'toolselection';
		this.applet.appendChild(this.toolselection);

		var tools = ['pencil', 'bucket'];
		for (var i = 0; i < tools.length; i++){
			var opt = document.createElement('option');
			opt.value = tools[i];
			opt.text = tools[i];
			this.toolselection.append(opt);
		}

		this.toolselection.addEventListener('change', (function(e){
			if (this.selectedIndex == 1) oekaki.bucketfill = true;
			else oekaki.bucketfill = false;
		}));

		// Prepare width select field
		this.widthselect = document.createElement('input');
		this.widthselect.type = 'number';
		this.widthselect.id = 'widthselect';
		this.widthselect.value = this.width;
		this.widthselect.placeholder = 'width';
		this.applet.appendChild(this.widthselect);
		this.widthselect.addEventListener('change', (function(e){
			oekaki.width = oekaki.widthselect.value;
		}));

		// Prepare color picker
		this.picker = document.createElement('input');
		this.picker.id = 'picker';
		this.picker.className = 'jscolor {value:\'' + this.color + '\'}';
		this.applet.appendChild(this.picker);
		this.picker.addEventListener('change', (function(){
			oekaki.color = oekaki.picker.jscolor.toHEXString();
			oekaki.colors = oekaki.picker.jscolor.rgb.map(function(value){
				return parseInt(value.toFixed());
			});
			oekaki.colors[3]=255;
		}));

		// prepare trash button
		function trashIt(){
			oekaki.canvas.width=370;
			oekakiUsed=false;
		}
		this.trashbutton = document.createElement('button');
		this.trashbutton.id = 'oekaki-trash';
		this.trashbutton.type = 'button';
		this.trashbutton.innerHTML = 'New';
		this.applet.appendChild(this.trashbutton);
		this.trashbutton.addEventListener('mousedown', trashIt);		


		// Prepare canvas width select field
		this.canvasWidth = document.createElement('input');
		this.canvasWidth.type = 'number';
		this.canvasWidth.id = 'canvasWidth';
		this.canvasWidth.value = oekaki.canvas.width;
		this.canvasWidth.placeholder = 'width';
		this.applet.appendChild(this.canvasWidth);
		this.canvasWidth.addEventListener('change', (function(e){
			if (oekaki.canvasWidth.value>1000) {oekaki.canvasWidth.value=1000};
			oekaki.canvas.width=oekaki.canvasWidth.value;
		}));

		// Prepare canvas height select field
		this.canvasHeight = document.createElement('input');
		this.canvasHeight.type = 'number';
		this.canvasHeight.id = 'canvasHeight';
		this.canvasHeight.value = oekaki.canvas.height;
		this.canvasHeight.placeholder = 'width';
		this.applet.appendChild(this.canvasHeight);
		this.canvasHeight.addEventListener('change', (function(e){
			if (oekaki.canvasHeight.value>1000) {oekaki.canvasHeight.value=1000};
			oekaki.canvas.height=oekaki.canvasHeight.value;
		}));

		// Prepare finish button
		this.finishbutton = document.createElement('button');
		this.finishbutton.id = 'oekaki-finished';
		this.finishbutton.type = 'button';
		this.finishbutton.innerHTML = 'Submit';
		this.applet.appendChild(this.finishbutton);
		this.finishbutton.addEventListener('mousedown', options.onFinish);

		this.canvas.addEventListener('mousedown', start);
		this.canvas.addEventListener('touchstart', start);
		
		this.canvas.addEventListener('mousemove', move);
		this.canvas.addEventListener('touchmove', move);

		document.body.addEventListener('mouseup', end);
		document.body.addEventListener('touchend', end);
		
	}
};
