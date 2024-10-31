  <style>
   
      * {
        font-family: Comic Sans MS;
      }
      span.button{
        display: none;
        color: white;
        background-color: gray;
        padding: 5px;
        margin: 0px;
      }
      span.button.pressed{
        background-color: black;
        color:red;
      }
      span.arrow{
        display: none;
        color: white;
        background-color: gray;
        padding: 5px;
        margin: 0px;
      }
      span.arrow.pressed{
        background-color: black;
        color:red;
      }
      div.buttons, div.axes{
        display: inline;
      }
      .gamepadName{
        color:deeppink;
        padding-bottom: 10px;
      }
      .divpad{
        margin-bottom: 8px;
      }
      #divpads{
        position: absolute;
        top: 0px;
        left: 0px;
        margin:0px;
        padding-left: 10px;
        padding-top: 4px;
      }

    body, html {
      font-family: "Comic Sans MS", sans-serif;
     /* overflow:hidden; */
    }
    .red-block, .green-block {
      padding:5px;
      border: 2px solid black;
      border-radius:4px;
    }
    .red-block {
      background-color: #f46;
    }
    .green-block {
      background-color: #4b6;
    }



  </style>

<!-- Create DOM elements to animate -->
   <div class="dynamic red-block player" style="position:absolute;left:175px;width:50px;height:50px;">
    trustmaster
  </div>
  <div class="dynamic player" style="position:absolute;left:175px;width:50px;height:50px;">
    rien
  </div>
  <div class="dynamic red-block player" style="position:absolute;left:175px;width:50px;height:50px;">
    player1
  </div>
  <div class="static green-block" style="position:absolute;bottom:100px;left:100px;width:100px;height:100px">
    p2.js
  </div>

  <script type="text/javascript" src="jquery.js"></script>
  <script type="text/javascript" src="gamepads.js"></script>
  <script type="text/javascript" src="p2.min.js"></script>
  <script type="text/javascript">

    // Create a World
    var world = new p2.World({
      gravity : [0,-100],
      broadphase : new p2.SAPBroadphase()
    });

    var fixedTimeStep = 1 / 30;
    var physicsToDOMScale = 30; // Multiply physics coordinate with this and you get the number of pixels in the dom

    // Create dynamic bodies
    var elements = document.querySelectorAll('.dynamic');
    for(var i=0; i<elements.length; i++){
      var element = elements[i];
      createBody(element, 1);
    }

    // Create static bodies
    var staticElements = document.querySelectorAll('.static');
    for(var i=0; i<staticElements.length; i++){
      var element = staticElements[i];
      createBody(element, 0);
    }


    // Add planes for browser window "walls"
    var body = document.body,
        html = document.documentElement;
    var height = Math.max( body.scrollHeight, body.offsetHeight,
                           html.clientHeight, html.scrollHeight, html.offsetHeight );
    var planeBottomBody = new p2.Body({
      position: [0, - (height) / physicsToDOMScale]
    });
    planeBottomBody.addShape(new p2.Plane());
    world.addBody(planeBottomBody);
    var planeTopBody = new p2.Body({
      position: [0, 0]
    });
    planeTopBody.addShape(new p2.Plane(),[0,0],Math.PI);
    world.addBody(planeTopBody);
    var planeLeftBody = new p2.Body();
    planeLeftBody.addShape(new p2.Plane(),[0,0],-Math.PI/2);
    world.addBody(planeLeftBody);
    var planeRightBody = new p2.Body({
      position: [ (document.body.getBoundingClientRect().width) / physicsToDOMScale,0]
    });
    planeRightBody.addShape(new p2.Plane(),[0,0],Math.PI/2);
    world.addBody(planeRightBody);



    // Create a body from an element in the DOM, with the given mass
    function createBody(element, mass){
      var rect = element.getBoundingClientRect();
      var body = new p2.Body({
        mass : mass,
        position: [
          (rect.left + rect.width / 2) / physicsToDOMScale,
          -(rect.top + rect.height / 2) / physicsToDOMScale
        ],
        angle:0
      });
      var shape = new p2.Box({
        width: rect.width / physicsToDOMScale,
        height: rect.height / physicsToDOMScale
      });
      body.addShape(shape);
      world.addBody(body);

      element.style.position = 'absolute';
      element.style.top = 0;
      element.style.left = 0;
      element.style.transformOrigin = '50% 50%';
      updateTransform(body, element);
    }

    // The animation loop
    var lastTimeMilliSeconds;
    function update(timeMilliSeconds){
      requestAnimationFrame(update);
      if(lastTimeMilliSeconds){
        var deltaTime = (timeMilliSeconds - lastTimeMilliSeconds) / 1000;
        world.step(fixedTimeStep, deltaTime, 5);
        updateTransforms();
      }
      lastTimeMilliSeconds = timeMilliSeconds;
    }

    function updateTransform(body, element){

        // Convert physics coordinates to pixels
        var x = physicsToDOMScale * (body.interpolatedPosition[0] - body.shapes[0].width/2);
        var y = -physicsToDOMScale * (body.interpolatedPosition[1] + body.shapes[0].height/2);

        // Set element style
        var style = 'translate(' + x + 'px, ' + y + 'px) rotate(' + (-body.interpolatedAngle * 57.2957795) + 'deg)';
        element.style.transform = style;
        element.style.WebkitTransform = style + ' translateZ(0)'; // Force HW Acceleration
        element.style.MozTransform = style;
        element.style.OTransform = style;
        element.style.msTransform = style;
    }

    // Update all element transforms
    function updateTransforms(){

      // Update dynamic bodies
      for ( i = 0; i < elements.length; i++ ) {
        var body = world.bodies[i];
        var element = elements[i];
        updateTransform(body, element);
      }

      // Update static bodies
      for ( i = 0; i < staticElements.length; i++ ) {
        var body = world.bodies[elements.length + i];
        var element = staticElements[i];
        updateTransform(body, element);
      }
    }

    // Start animation
    requestAnimationFrame(update);



for (var i = 0; i < world.bodies.length; i++) {
	world.bodies[i].fixedRotation = true
};
    


    function gamePadAction(gamepad, button, toggle){
  		console.log('player'+gamepad+': '+button+' '+toggle)

  		/* ←→↑↓012345 */
  		if ((button=="→")&&(toggle==1)) {world.bodies[gamepad].velocity[0]=world.bodies[gamepad].velocity[0]+10}
  		if ((button=="←")&&(toggle==1)) {world.bodies[gamepad].velocity[0]=world.bodies[gamepad].velocity[0]-10}
  		if ((button=="1")&&(toggle==1)) {world.bodies[gamepad].velocity[1]=50}


	}
  </script>