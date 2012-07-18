//CANVAS.JS
var canvasName;
var canvas;
var context;
var width;
var height;

function initCanvas(id)
{
  canvas = document.getElementById(id);
  context = canvas.getContext("2d");
  canvasName = id;
  resizeToBrowser();
}

function resizeToBrowser()
{
  var w = $("body").css("width");
  var h = $("body").css("height");
  canvas.width = (parseInt(w.substr(0,w.length-2))-10);
  canvas.height = (parseInt(h.substr(0,h.length-2))-10);
  width = canvas.width;
  height = canvas.height;
}

function setColor(hex)
{
  context.fillStyle = hex;
}

function clearCanvas()
{
  context.clearRect(0, 0, width, height);
}
