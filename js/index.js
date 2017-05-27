/*$('#fullpage').fullpage({
    sectionsColor: ['#f2f2f2', '#4BBFC3', '#7BAABE']
});  // This code causes slide2 to skip and slide3 to be blank:  easier to use CSS #id*/
//$("#sticker").sticky();

$('#btn1').on('click', function(e){
  $.fn.fullpage.moveTo(2, 0); console.log('click');
});

$('.txt').html(function(i, html) {
  var chars = $.trim(html).split("");

  return '<span>' + chars.join('</span><span>') + '</span>';
});






$(function() {
  var stageWidth;
  var stageHeight;
  var context = $("canvas")[0].getContext('2d');
  var objectList;
  var timeout;
  
  var prms = {
    fps:10,
    objectDistance: 20,
    objectWidth: 2,
    objectRotationV: Math.PI * .05,
    objectRadius: 3
  }
  
  $(window).resize(reset);
  reset();
  
  function reset(){
    
    stageWidth = $("#dots").width();
    stageHeight = $("#dots").height();
    
    $("#dots canvas").attr("width",stageWidth);
    $("#dots canvas").attr("height",stageHeight);
    
    // 表示オブジェクトを作成
    objectList = [];
    
    var x = -prms.objectDistance * .5;
    var y;
    
    while(x < stageWidth + prms.objectDistance * .5){
      y = -prms.objectDistance * .5;
      while(y < stageHeight + prms.objectDistance * .5){
        var xDistance = x-stageWidth*.5;
        var yDistance = y - stageHeight*.5;
        var distance = Math.sqrt(xDistance*xDistance + yDistance*yDistance);
        var circleRotation = Math.PI*.005*distance;
        objectList.push(
          new Circle(
            x,
            y, 
            circleRotation // _rotationV
          )
        );
        y += prms.objectDistance;
      }
      x += prms.objectDistance;
    }
    
    // タイマーをリセット
    if(timeout){
      clearTimeout(timeout);
    }
    timeout = setTimeout(onEnterFrame, 1000/prms.fps);
  }
  
  function Circle(_x, _y, _rotation){
    this.x = _x;
    this.y = _y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.rotation = _rotation;
    this.cx = _x;
    this.cy = _y;
    
    
  }
  Circle.prototype.width = prms.objectWidth;
  Circle.prototype.rotationV = prms.objectRotationV;
  Circle.prototype.radius = prms.objectRadius;
  Circle.prototype.tick = function(){
    this.rotation += this.rotationV;
    this.x = this.radius * Math.cos(this.rotation) + this.cx;
    this.y = this.radius * Math.sin(this.rotation) + this.cy;
    this.width = (1 + Math.cos(this.rotation))*Circle.prototype.width;
  }
  Circle.prototype.draw = function(_context){
    //console.log(this);
    //console.log(this.x - this.width*.5, this.y - this.height*.5, this.width, this.height);
    _context.beginPath();
    _context.arc(this.x, this.y, this.width * .5, 0, Math.PI*2, false);
    _context.fill();
    _context.closePath();
  }
  
  function onEnterFrame(){
    
    var len = objectList.length;
    var object;
    
    while(len > 0){
      len -= 1;
      object = objectList[len];
      object.tick();
    }
    
    context.clearRect(0, 0, stageWidth, stageHeight);
    context.fillStyle = '#313131';
    len = objectList.length;
    while(len > 0){
      len -= 1;
      object = objectList[len];
      object.draw(context);
    }
    
    // 次フレーム呼び出し
    timeout = setTimeout(onEnterFrame, 1000/prms.fps);
  }
  

})