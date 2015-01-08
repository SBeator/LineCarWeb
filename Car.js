function Car(playContext, x, y, playWidth, playWeight) {   
     height = 40;
     width = 20;

    this.initialize = function(){
        this.speed = 40;
        this.dir = 0;
        this.aDir = 0.5;
        this.x = x;
        this.y = y;
        this.playWidth = playWidth;
        this.playWeight = playWeight;
        this.context = playContext;
        this.image = document.createElement("img");
        this.image.setAttribute("src", "car2.png");
    }
    
    var timeCount = 0;
    
    this.move = function(time){
        var length = this.speed * time;
        var dx = length * Math.sin(this.dir);
        var dy = length * Math.cos(this.dir);
        
        this.x += dx;
        this.y += dy;
        
        this.dir += this.aDir * time;
        
        timeCount += time;
        if(timeCount > 1){
            timeCount = 0;
            this.aDir = 4 * (Math.random() - 0.5);
        }
    }

    this.draw = function () {
        this.context.clearRect(0,0,this.playWidth,this.playWeight);
        
        this.context.translate(this.x, this.y);
        this.context.rotate(-this.dir);
        this.context.drawImage(this.image, -width/2, -height/2, width, height);
        this.context.rotate(this.dir);
        this.context.translate(-this.x, -this.y);
    }
    
    this.initialize();
};
