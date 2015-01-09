function Car(playContext, x, y, playWidth, playWeight) {   
     height = 40;
     width = 20;

    this.initialize = function(){
        this.linePoint = [];
        
        this.x = x;
        this.y = y;
        this.speed = 0;
        this.dir = 0;
        
        this.acc = 0;
        this.aDir = 0;
        
        this.playWidth = playWidth;
        this.playWeight = playWeight;
        this.context = playContext;
        this.image = document.createElement("img");
        this.image.setAttribute("src", "car2.png");
    }
    
    this.run = function(){
        this.running = true;
    }
    
    this.runLine = function(linePoints){
        this.linePoint = this.filterPoints(linePoints);
        this.speed = 40;
        this.x = this.linePoint[0].x;
        this.y = this.linePoint[0].y;
        this.dir = this.getDir(this.linePoint, 0);
        
        this.pointIndex = 0;
    }
    
    this.getDir = function(linePoint, index){
        var pNext = linePoint.length > index+1 ? linePoint[index+1] : linePoint[index];
        var pLast = index > 0 ? linePoint[index-1] : linePoint[index];
    
        var dx = pNext.x - pLast.x;
        var dy = pNext.y - pLast.y;
        
        var dir;
        if(dy > 0){
            dir = Math.atan(dx/dy) ;
        } else if(dy < 0){
            dir = Math.atan(dx/dy) + Math.PI;
        } else {
            dir = dx > 0 ? Math.PI / 2 : - Math.PI / 2;
        }
        
        return dir
    }
    
    this.filterPoints = function(linePoints){
        for(var i=1; i< linePoints.length-1; i++){
            linePoints[i].x = (linePoints[i-1].x + linePoints[i].x + linePoints[i+1].x)/3;
            linePoints[i].y = (linePoints[i-1].y + linePoints[i].y + linePoints[i+1].y)/3;
        }
        
        return linePoints;
    }
    
    // var timeCount = 0;
    
    this.move = function(time){
        var length = this.speed * time;
        var dx = length * Math.sin(this.dir);
        var dy = length * Math.cos(this.dir);
        
        this.x += dx;
        this.y += dy;
        
        this.dir += this.aDir * time;
        
        //timeCount += time;
        //if(timeCount > 1){
        //    timeCount = 0;
        //    this.aDir = 4 * (Math.random() - 0.5);
        //}
    }

    this.draw = function () {
        this.context.clearRect(0,0,this.playWidth,this.playWeight);
        
        this.context.translate(this.x, this.y);
        this.context.rotate(-this.dir);
        this.context.drawImage(this.image, -width/2, -height/3, width, height);
        this.context.rotate(this.dir);
        this.context.translate(-this.x, -this.y);
    }
    
    this.initialize();
};
