// GAME.JS

var cellSize = 50;//px
var cellPadding = 1;//px
var tickTime = 100;//msec
var ticksPerUpdate = 10;//ticks
var tickNum = 0;//ticks
var turnNum = 0;//turns
var fadeDuration = 4;//updates
var cells;//2d array
var gridX = 1;//cells
var gridY = 1;//cells
var minSize = 5;//cells(efficiency vs purity)
var clearBuffer = 5;//cells(efficiency vs purity)
var shouldDraw = true;
var play = true;
var fade = false;

//Controls
var sizeUp;
var sizeDown;
var speedUp;
var speedDown;

//Debug
var watchX = 0;
var watchY = 0;

function initGame()
{
  initCells();
  findGridDims();
  setKeyDownHandler('space',explode);
  setKeyDownHandler('left',decWatchX);
  setKeyDownHandler('right',incWatchX);
  setKeyDownHandler('up',decWatchY);
  setKeyDownHandler('down',incWatchY);
  setMouseClickHandler(explode);
  setMouseMoveHandler(move);
  setWindowResizeHandler(resizeToBrowser);
  setWindowResizeHandler(findGridDims);
  commitHandlers();
  document.getElementById("pause").style.color="gray";
  document.getElementById("fade_on").style.color="gray";
  setInterval(function(){tick()},tickTime);
}

function tick()
{
  readControls();
  if(play) 
  {
    if(tickNum%ticksPerUpdate == 0)
    {
      processNextMove();
      commitNextMove();
      setShouldDraw();
      turnNum++;
    }
    tickNum++;
  }
  if(shouldDraw) draw();
}

function setShouldDraw()
{
  shouldDraw = true;
}

function draw()
{
  clearCanvas();
  for(var i = 0; i < gridX; i++)
  {
    for(var j = 0; j < gridY; j++)
    {
      if(i == watchX && j == watchY)
      {
        setColor("#FF0000");
        context.fillRect(i*cellSize, j*cellSize, cellSize, cellSize);
      }
      if((fade && cells[i][j].phil > 0) || cells[i][j].isSet())
      {
        //Yes, there's probaby a simpler way to convert an int to hex in javascript... but whatever
        switch(cells[i][j].phil)
        {
          case 1:
            setColor("#f0f0f0");
            break;
          case 2:
            setColor("#e0e0e0");
            break;
          case 3:
            setColor("#d0d0d0");
            break;
          case 4:
            setColor("#c0c0c0");
            break;
          case 5:
            setColor("#b0b0b0");
            break;
          case 6:
            setColor("#a0a0a0");
            break;
          case 7:
            setColor("#909090");
            break;
          case 8:
            setColor("#808080");
            break;
          case 9:
            setColor("#707070");
            break;
          case 10:
            setColor("#606060");
            break;
          case 11:
            setColor("#505050");
            break;
          case 12:
            setColor("#404040");
            break;
          case 13:
            setColor("#303030");
            break;
          case 14:
            setColor("#202020");
            break;
          case 15:
            setColor("#101010");
            break;
          case 16:
            setColor("#000000");
            break;
        }
        context.fillRect((i*cellSize)+cellPadding, (j*cellSize)+cellPadding, cellSize-(2*cellPadding), cellSize-(2*cellPadding));
      }
    }
  }
  shouldDraw = false;
}

function Cell(x, y)
{
  this.x = x;
  this.y = y;
  this.phil = Math.floor(Math.random()*5) == 0 ? fadeDuration : 0;
  this.numNeighbors = 0;

  this.set = function()
  {
    this.phil = fadeDuration;
  }
  this.clear = function()
  {
    this.phil = this.phil > 0 ? --this.phil : 0;
  }
  this.isSet = function()
  {
    return this.phil == fadeDuration ? 1 : 0;
  }
  this.tellNeighbors = function()
  {
    if(this.phil != fadeDuration) return;

    //Moore Space
    if(this.x < gridX-1)
    {
      if(this.y < gridY-1)
        cells[this.x+1][this.y+1].numNeighbors++;
      cells[this.x+1][this.y].numNeighbors++;
      if(this.y > 0)
        cells[this.x+1][this.y-1].numNeighbors++;
    }
    if(this.x > 0)
    {
      if(this.y < gridY-1)
        cells[this.x-1][this.y+1].numNeighbors++;
      cells[this.x-1][this.y].numNeighbors++;
      if(this.y > 0)
        cells[this.x-1][this.y-1].numNeighbors++;
    }

    if(this.y < gridY-1)
      cells[this.x][this.y+1].numNeighbors++;
    if(this.y > 0)
      cells[this.x][this.y-1].numNeighbors++;
  }
  this.shunNeighbors = function()
  {
    if(this.phil == fadeDuration) return;

    //Moore Space
    if(this.x < gridX-1)
    {
      if(this.y < gridY-1)
        cells[this.x+1][this.y+1].numNeighbors--;
      cells[this.x+1][this.y].numNeighbors--;
      if(this.y > 0)
        cells[this.x+1][this.y-1].numNeighbors--;
    }
    if(this.x > 0)
    {
      if(this.y < gridY-1)
        cells[this.x-1][this.y+1].numNeighbors--;
      cells[this.x-1][this.y].numNeighbors--;
      if(this.y > 0)
        cells[this.x-1][this.y-1].numNeighbors--;
    }

    if(this.y < gridY-1)
      cells[this.x][this.y+1].numNeighbors--;
    if(this.y > 0)
      cells[this.x][this.y-1].numNeighbors--;
  }
  this.findNeighbors = function()
  {
    var n = 0;
    //Moore Space
    if(this.x < gridX-1)
    {
      if(this.y < gridY-1)
        n+=cells[this.x+1][this.y+1].isSet();
      n+=cells[this.x+1][this.y].isSet();
      if(this.y > 0)
        n+=cells[this.x+1][this.y-1].isSet();
    }
    if(this.x > 0)
    {
      if(this.y < gridY-1)
        n+=cells[this.x-1][this.y+1].isSet();
      n+=cells[this.x-1][this.y].isSet();
      if(this.y > 0)
        n+=cells[this.x-1][this.y-1].isSet();
    }

    if(this.y < gridY-1)
      n+=cells[this.x][this.y+1].isSet();
    if(this.y > 0)
      n+=cells[this.x][this.y-1].isSet();

    return n;
  }
  this.commit = function()
  {
    if(this.x == watchX && this.y == watchY)
    {
      document.getElementById("watch_n").innerHTML = this.numNeighbors;
      document.getElementById("watch_s").innerHTML = this.isSet() ? "set" : "clear";
    }
    switch(this.numNeighbors)
    {
      case 0:
      case 1: //fewer than two- underpopulation
        this.clear();
        break;
      case 2: //stability
        if(this.phil < fadeDuration) this.clear(); //Note- not a logical clear, just a graphical one
        break;
      case 3: //reproduction- either stays living or is born
        this.set();
        break;
      case 4:
      case 5:
      case 6:
      case 7:
      case 8: //more than three- overpopulation
        this.clear();
        break;
    }
    this.numNeighbors = 0;
  }
}

function initCells()
{
  cells = new Array();
  for(var i = 0; i < gridX; i++)
  {
    var column = new Array();
    for(var j = 0; j < gridY; j++)
      column.push(new Cell(i,j));
    cells.push(column);
  }
}

function findGridDims()
{
  var oldX = gridX;
  var oldY = gridY;
  gridX = Math.ceil(width/cellSize);
  gridY = Math.ceil(height/cellSize);
  if(gridX < 1) gridX = 1;
  if(gridY < 1) gridY = 1;
  if(oldX != gridX || oldY != gridY)
    setCellDims();
}

function setCellDims()
{
  for(var i = gridX; i < gridX+clearBuffer && i < cells.length; i++)
    for(var j = 0; j < gridY+clearBuffer && j < cells[i].length; j++)
      cells[i][j].clear();
  while(cells.length < gridX)
  {
    var column = new Array();
    for(var i = 0; i < cells[0].length; i++)
      column.push(new Cell(cells.length,i));
    cells.push(column);
  }

  if(cells[0].length > gridY)
  {
    for(var i = 0; i < gridX+clearBuffer && i < cells.length; i++)
      for(var j = gridY; j < gridY+clearBuffer && j < cells[i].length; j++)
        cells[i][j].clear();
  }
  else if(cells[0].length < gridY)
  {
    for(var i = 0; i < cells.length; i++)
      while(cells[i].length < gridY)
        cells[i].push(new Cell(i,cells[i].length));
  }
  setShouldDraw();
}

function clearCells()
{
  for(var i = 0; i < gridX; i++)
    for(var j = 0; j < gridY; j++)
      cells[i][j].clear();
}

function processNextMove()
{
  for(var i = 0; i < gridX; i++)
  {
    for(var j = 0; j < gridY; j++)
    {
      cells[i][j].tellNeighbors();
    }
  }
}

function commitNextMove()
{
  for(var i = 0; i < gridX; i++)
  {
    for(var j = 0; j < gridY; j++)
    {
      cells[i][j].commit();
    }
  }
}

function readControls()
{
  var oldSize = cellSize;
  if(sizeUp) cellSize++;
  if(sizeDown) cellSize--; 
  if(speedUp) ticksPerUpdate--;
  if(speedDown) ticksPerUpdate++;
  //Re-calibrate
  if(cellSize < ((cellPadding*2)+1)) cellSize = ((cellPadding*2)+1);
  if(cellSize < minSize) cellSize = minSize;
  if(ticksPerUpdate < 1) ticksPerUpdate = 1;
  if(oldSize != cellSize)
  { 
    setShouldDraw();
    findGridDims();
  }
}

function setWatch(x,y)
{
  //alert(x+" "+y);
  watchX = x;
  watchY = y;
  if(watchX < 0) watchX = 0; if(watchX > gridX-1) watchX = gridX-1;
  if(watchY < 0) watchY = 0; if(watchY > gridY-1) watchY = gridY-1;
  document.getElementById("watch_x").innerHTML=watchX;
  document.getElementById("watch_y").innerHTML=watchY;
  document.getElementById("watch_s").innerHTML=cells[watchX][watchY].isSet() ? "set" : "clear";
  document.getElementById("watch_n").innerHTML=cells[watchX][watchY].findNeighbors();
  setShouldDraw();
}
function incWatchX(){setWatch(watchX+1,watchY);}
function decWatchX(){setWatch(watchX-1,watchY);}
function incWatchY(){setWatch(watchX,watchY+1);}
function decWatchY(){setWatch(watchX,watchY-1);}
function move(x,y)
{
  //The '12' is the offset of the canvas+its border from the web window
  setWatch(Math.floor((x-12)/cellSize), Math.floor((y-12)/cellSize));
}

function mouseDown(id)
{
  document.getElementById(id).style.color="gray";
  switch(id)
  {
    case "play":
      play = true;
      document.getElementById("pause").style.color="gray";
      break;
    case "pause":
      play = false;
      document.getElementById("play").style.color="gray";
      break;
    case "fade_off":
      fade = false;
      document.getElementById("fade_on").style.color="gray";
      break;
    case "fade_on":
      fade = true;
      document.getElementById("fade_off").style.color="gray";
      break;
    case "size_p":
      sizeUp = true;
      break;
    case "size_m":
      sizeDown = true;
      break;
    case "speed_p":
      speedUp = true;
      break;
    case "speed_m":
      speedDown = true;
      break;
    case "clear":
      clearCells();
      break;

    case "x_p":
      incWatchX();
      break;
    case "x_m":
      decWatchX();
      break;
    case "y_p":
      incWatchY();
      break;
    case "y_m":
      decWatchY();
      break;
  }
}

function mouseUp(id)
{
  document.getElementById(id).style.color="black";
  switch(id)
  {
    case "size_p":
      sizeUp = false;
    break;
    case "size_m":
      sizeDown = false;
    break;
    case "speed_p":
      speedUp = false;
    break;
    case "speed_m":
      speedDown = false;
    break;
  }
}

function explode()
{
  if(cells[watchX][watchY].phil == fadeDuration)
    cells[watchX][watchY].clear();
  else if(cells[watchX][watchY].phil != fadeDuration)
    cells[watchX][watchY].set();
  setShouldDraw();
}
