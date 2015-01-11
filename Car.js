function Car(playContext, x, y, playWidth, playHeight) {   
     height = 40;
     width = 20;
     turnFactor = 0.001;
     speedTurnFactor = 30;
     maxADir = 1;
     

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
        this.playHeight = playHeight;
        this.context = playContext;
        this.image = document.createElement("img");
        this.image.setAttribute("src", "car2.png");
    }
    
    this.run = function(){
        this.running = true;
    }
    
    this.runLine = function(linePoints){
        this.linePoint = this.filterPoints(linePoints);
        this.speed = 100;
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
        
        // for(var i=1; i< linePoints.length-1; i++){
            // linePoints[i].x = (linePoints[i-1].x + linePoints[i].x + linePoints[i+1].x)/3;
            // linePoints[i].y = (linePoints[i-1].y + linePoints[i].y + linePoints[i+1].y)/3;
        // }
        
        // for(var i=1; i< linePoints.length-1; i++){
            // linePoints[i].x = (linePoints[i-1].x + linePoints[i].x + linePoints[i+1].x)/3;
            // linePoints[i].y = (linePoints[i-1].y + linePoints[i].y + linePoints[i+1].y)/3;
        // }
        
        // for(var i=1; i< linePoints.length-1; i++){
            // linePoints[i].x = (linePoints[i-1].x + linePoints[i].x + linePoints[i+1].x)/3;
            // linePoints[i].y = (linePoints[i-1].y + linePoints[i].y + linePoints[i+1].y)/3;
        // }   
        
        return linePoints;
    }
    
    this.getLineDir = function(index){
        var pNext = index+1 < this.linePoint.length ? this.linePoint[index+1] : this.linePoint[this.linePoint.length - 1];
        var pThis = index+1 < this.linePoint.length ? this.linePoint[index] : this.linePoint[this.linePoint.length - 2];
    
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
        var x0 = index+1 < this.linePoint.length ? this.linePoint[index].x : this.linePoint[this.linePoint.length - 2].x;
        var y0 = index+1 < this.linePoint.length ? this.linePoint[index].y : this.linePoint[this.linePoint.length - 2].y;
        var x1 = index+1 < this.linePoint.length ? this.linePoint[index+1].x : this.linePoint[this.linePoint.length - 1].x;
        var y1 = index+1 < this.linePoint.length ? this.linePoint[index+1].y : this.linePoint[this.linePoint.length - 1].y;
        
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
        var g = this.isOverLine(x, y, x0, y0, x1, y1);
        
        // 期望的相对车头朝向
        var rDis = Math.atan(turnFactor * dis * dis * dis) * g;
        
        // 期望的车头朝向
        return this.getLineDir(index) + rDis;
    }
    
    this.getMaxADir = function(){
        return this.speed / speedTurnFactor;
    }
    
    this.accelerationAndTurn = function(){
        while(this.isOverCurrentSplit(this.pointIndex) && this.pointIndex < this.linePoint.length){
            this.pointIndex ++;
        }
    
        // var success = false;
        // if(this.isInCurrentLineShadow(this.pointIndex + 1)){
            // this.pointIndex ++ ;
            // success = true;
        // } else if(this.isInCurrentWideRange(this.pointIndex + 1)){
            // this.pointIndex ++ ;
            // success = true;
        // } 
        // else {
           // this.speed = 0;
           // console.log("out!"); 
           // return;
        // }
        
        //this.dir = this.getExpectDir(this.pointIndex);
        var expectDir = this.getExpectDir(this.pointIndex);
        
        var turnDir = expectDir - this.dir;
        
        this.aDir = turnDir < this.getMaxADir() ? turnDir : this.getMaxADir();
        
    }
    
    this.isOverCurrentSplit = function(index){
        var split = this.getNextSplit(index);
        
        var g = this.isOverLine(this.x, this.y, split.p.x, split.p.y, split.p.x + split.v.x, split.p.y + split.v.y);
        
        return g < 0;
    }
    
    this.getNextSplit = function(index){
        if(index >= this.linePoint.length - 2){
            index = this.linePoint.length - 3;
        }
        
        var x = this.x;
        var y = this.y;
        var x0 = this.linePoint[index].x;
        var y0 = this.linePoint[index].y;
        var x1 = this.linePoint[index+1].x;
        var y1 = this.linePoint[index+1].y;
        var x2 = this.linePoint[index+2].x;
        var y2 = this.linePoint[index+2].y;
        
        var l1 = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
        var l2 = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        
        var splitX = x0 - (1 + l1 / l2) * x1 + l1 / l2 * x2;
        var splitY = y0 - (1 + l1 / l2) * y1 + l1 / l2 * y2;
        
        var splitLength = Math.sqrt(splitX * splitX + splitY * splitY);
        if(splitLength < l1){
            splitX = y0 - y1;
            splitY = x1 - x0;
        }else {
            var g = this.isOverLine(splitX, splitY, x0, y0, x1, y1);
            
            if(g == 0){
                splitX = y0 - y1;
                splitY = x1 - x0;
            }else if(g < 0){
                splitX = -splitX;
                splitY = -splitY;
            }
        }
        
        return {p: {x: x1, y: y1}, v: {x: splitX, y: splitY}};
    }
    
    this.isOverLine = function(x, y, x0, y0, x1, y1){
        var g = ((y0-y1) * x + (x1-x0) * y + (x0*y1-x1*y0));
        return g > 0 ? 1 : g < 0 ?　-1 : 0;
    }
    
    this.isInCurrentWideRange = function(index){
        if(index+1 >= this.linePoint.length){
            return true;
        }
        
        var x = this.x;
        var y = this.y;
        var x0 = this.linePoint[index].x;
        var y0 = this.linePoint[index].y;
        var x1 = this.linePoint[index+1].x;
        var y1 = this.linePoint[index+1].y;
        
        var isOnLinePoint = (x == x0 && y == y0) || (x == x1 && y == y1);
        
        // 汽车坐标在当前线段的范围外时返回true
        var isOut = (x - x0) * (x - x1) >= 0 && (y - y0) * (y - y1) >= 0 && (((x - x0) * (x0 - x1) * (y - y0) * (y0 - y1) > 0) || x0 == x1 || y0 == y1);
        return isOnLinePoint || !isOut;
    }
    
    this.isInCurrentLineShadow = function(index){
        if(index+1 >= this.linePoint.length){
            return true;
        }
        
        var x = this.x;
        var y = this.y;
        var x0 = this.linePoint[index].x;
        var y0 = this.linePoint[index].y;
        var x1 = this.linePoint[index+1].x;
        var y1 = this.linePoint[index+1].y;
        
        var xv = x - x0;
        var yv = y - y0;
        var xp = x1 - x0;
        var yp = y1 - y0;
        
        // （x, y) 在线上投影的系数
        var a = (xv*xp + yv*yp) / (xp*xp + yp*yp);
        
        // 投影点在线上
        var onLine = a >=0 && a <=1;
        
        return onLine;
    }
    
    // var timeCount = 0;
    
    this.move = function(time){
    
        if(this.linePoint.length > 2){
            this.accelerationAndTurn();
        }
        
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
        this.context.clearRect(0,0,this.playWidth,this.playHeight);
        
        this.context.translate(this.x, this.y);
        this.context.rotate(-this.dir);
        this.context.drawImage(this.image, -width/2, -height/3, width, height);
        this.context.rotate(this.dir);
        this.context.translate(-this.x, -this.y);
    }
    
    this.initialize();
};
