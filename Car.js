function Car(playContext, x, y, playWidth, playWeight) {   
     height = 40;
     width = 20;
     turnFactor = 1;

    this.initialize = function(){
        this.linePoint = [];
        this.pointIndex = 0;
        
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
        this.speed = 50;
        this.x = this.linePoint[0].x;
        this.y = this.linePoint[0].y;
        this.dir = this.getLineDir(0);
        
        this.pointIndex = 0;
    }
    
    this.filterPoints = function(linePoints){
        for(var i=1; i< linePoints.length-1; i++){
            linePoints[i].x = (linePoints[i-1].x + linePoints[i].x + linePoints[i+1].x)/3;
            linePoints[i].y = (linePoints[i-1].y + linePoints[i].y + linePoints[i+1].y)/3;
        }
        
        return linePoints;
    }
    
    this.getLineDir = function(index){
        var pNext = index+1 < this.linePoint.length ? this.linePoint[index+1] : this.linePoint[index];
        var pThis = index+1 < this.linePoint.length ? this.linePoint[index] : this.linePoint[index-1];
    
        var dx = pNext.x - pThis.x;
        var dy = pNext.y - pThis.y;
        
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
    
    this.getExpectDir = function(index){   
    
        var x = this.x;
        var y = this.y;
        var x0 = index+1 < this.linePoint.length ? this.linePoint[index].x : this.linePoint[index-1].x;
        var y0 = index+1 < this.linePoint.length ? this.linePoint[index].y : this.linePoint[index-1].y;
        var x1 = index+1 < this.linePoint.length ? this.linePoint[index+1].x : this.linePoint[index].x;
        var y1 = index+1 < this.linePoint.length ? this.linePoint[index+1].y : this.linePoint[index].y;
        
        var xv = x - x0;
        var yv = y - y0;
        var xp = x1 - x0;
        var yp = y1 - y0;
        
        // （x, y) 在线上投影的系数
        var a = (xv*xp + yv*yp) / (xp*xp + yp*yp);
        
        // （x, y) 在线上投影点
        var xn = a*xp + x0;
        var yn = a*yp + y0;
        
        // （x, y) 与线的距离
        var dis = Math.sqrt((xn - x) * (xn - x) + (yn - y) * (yn - y));
        
        // （x, y) 在线的那一侧
        var g = ((y0-y1) * x + (x1-x0) * y + (x0*y1-x1*y0)) > 0 ? 1 : -1;
        
        // 期望的相对车头朝向
        var rDis = Math.atan(turnFactor * dis * dis) * g;
        
        // 期望的车头朝向
        return this.getLineDir(index) + rDis;
    }
    
    this.accelerationAndTurn = function(){
        while(!this.isCurrentPointIndex(this.pointIndex)){
            this.pointIndex++;
        }
        
        this.dir = this.getExpectDir(this.pointIndex);
    }
    
    this.isCurrentPointIndex = function(index){
        if(index+1 >= this.linePoint.length){
            return true;
        }
        
        var x = this.x;
        var y = this.y;
        var x0 = this.linePoint[index].x;
        var y0 = this.linePoint[index].y;
        var x1 = this.linePoint[index+1].x;
        var y1 = this.linePoint[index+1].y;
        
        // 汽车坐标在当前线段的范围外时返回true
        return (x - x0) * (x - x1) >= 0 && (y - y0) * (y - y1) >= 0 && (((x - x0) * (x0 - x1) * (y - y0) * (y0 - y1) > 0) || x0 == x1 || y0 == y1);
    }
    
    // var timeCount = 0;
    
    this.move = function(time){
        var length = this.speed * time;
        var dx = length * Math.sin(this.dir);
        var dy = length * Math.cos(this.dir);
        
        this.x += dx;
        this.y += dy;
        
        this.dir += this.aDir * time;
        
        if(this.linePoint.length > 2){
            this.accelerationAndTurn();
        }
        
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
