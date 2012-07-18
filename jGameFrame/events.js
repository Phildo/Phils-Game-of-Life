//EVENTS
var keyDownHandlers = new Object();
var keyUpHandlers = new Object();
var keyPressHandlers = new Object();
var keyDownHandlers = new Object();
var mouseMoveHandlers = new Array();
var mouseClickHandlers = new Array();
var windowResizeHandlers = new Array();

function commitHandlers()
{
  if(typeof mouseClickHandlers !== 'undefined')
    document.onclick = mouseClickHandler;
  if(typeof mouseMoveHandlers !== 'undefined')
    document.onmousemove = mouseMoveHandler;
  if(typeof keyDownHandlers !== 'undefined')
    document.onkeyup = keyUpHandler;
  if(typeof keyUpHandlers !== 'undefined')
    document.onkeydown = keyDownHandler;
  if(typeof keyPressHandlers !== 'undefined')
    document.onkeypress = keyPressHandler;
  if(typeof windowResizeHandlers !== 'undefined')
    window.onresize = windowResizeHandler;
}

function setKeyDownHandler(key, handler)
{
  keyDownHandlers[keyCodes[key]] = handler;
}

function setKeyUpHandler(key, handler)
{
  keyDownHandlers[keyCodes[key]] = handler;
}

function setKeyPressHandler(key, handler)
{
  keyDownHandlers[keyCodes[key]] = handler;
}

function setMouseMoveHandler(handler)
{
  mouseMoveHandlers.push(handler);
}
//Special case- mouseMove has potential to be very slow.
//Unset it when not in use
function unsetMouseMoveHandler()
{
  document.onmousemove = null;
}

function setMouseClickHandler(handler)
{
  mouseClickHandlers.push(handler);
}

function setWindowResizeHandler(handler)
{
  windowResizeHandlers.push(handler);
}

function keyDownHandler(evt)
{
  if(typeof keyDownHandlers[evt.keyCode] !== 'undefined')
    keyDownHandlers[evt.keyCode]();
}

function keyUpHandler(evt)
{
  if(typeof keyUpHandlers[evt.keyCode] !== 'undefined')
    keyUpHandlers[evt.keyCode]();
}

function keyPressHandler(evt)
{
  if(typeof keyPressHandlers[evt.keyCode] !== 'undefined')
    keyPressHandlers[evt.keyCode]();
}

function mouseClickHandler(evt)
{
  if(typeof mouseClickHandlers !== 'undefined')
    for(handler in mouseClickHandlers)
      mouseClickHandlers[handler](evt.x, evt.y);
}

function mouseMoveHandler(evt)
{
  if(typeof mouseMoveHandlers !== 'undefined')
    for(handler in mouseMoveHandlers)
      mouseMoveHandlers[handler](evt.x, evt.y);
}

function windowResizeHandler(evt)
{
  //resizeToBrowser();
  if(typeof windowResizeHandlers !== 'undefined')
    for(handler in windowResizeHandlers)
      windowResizeHandlers[handler]();
}
