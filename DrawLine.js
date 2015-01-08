function DrawLine(playground, context, playWidth, playWeight) {   

    this.initialize = function(){
        this.drawing = false;
        this.playground = playground;
        this.context = context;
        this.playWidth = playWidth;
        this.playWeight = playWeight;
        this.linePoints = [];
        
        
        this.context.lineCap="round";
        
        var _this = this;
        playground.addEventListener("mousedown", function(evt){ _this.onMouseDown(evt) });
        playground.addEventListener("mousemove", function(evt){ _this.onMouseMove(evt) });
        playground.addEventListener("mouseup", function(evt){ _this.onMouseUp(evt) });
    }
    
    this.onMouseDown = function(evt){
        this.drawing = true;
        
        // this.context.clearRect(0,0,this.playWidth,this.playWeight);
        var point = {x: evt.clientX, y: evt.clientY};
        this.linePoints.push(point);
    }
    
    this.onMouseMove = function(evt){
        if(this.drawing){
            var point = {x: evt.clientX, y: evt.clientY};   
            var lastPoint = this.linePoints.pop();
            
            this.context.beginPath();
            this.context.moveTo(lastPoint.x, lastPoint.y);
            this.context.lineTo(point.x, point.y);
            this.context.stroke();
            
            this.linePoints.push(lastPoint);
            this.linePoints.push(point);
        }
    }
    
    this.onMouseUp = function(evt){
        this.drawing = false;
    }
    
    this.initialize();
};
