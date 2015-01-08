function LineCar(playgroundId, width, height) {

    this.initialize = function(){
        this.playground = document.getElementById(playgroundId);
        
        this.width = width;
        this.height = height;
        
        this.backgroundLayerContext = this.createCanvas("backgroundLayer");
        this.drawLayerContext = this.createCanvas("drawLayer");
        this.carLayerContext = this.createCanvas("carLayer");

        this.timeSecend = 0.01;
        
        this.car = new Car(this.carLayerContext, 200, 200, this.width, this.height);
        this.drawLine = new DrawLine(this.playground, this.drawLayerContext, this.width, this.height);

        this.drawBackground();
        
        var _this = this;
        this.intervalNumber = setInterval(function(){ _this.update();} , this.timeSecend * 1000, this);
    }
    
    this.createCanvas = function(className){
        var canvas = document.createElement("canvas");
        canvas.classList.add(className)
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);

        this.playground.appendChild(canvas);
        
        var context = canvas.getContext("2d");
        
        return context;
    }
    
    this.update = function(){
        this.car.move(this.timeSecend);
        this.draw();
    }
    
    this.draw = function(){
        this.car.draw();
    }
    
    this.drawBackground = function () {
        this.backgroundLayerContext.fillStyle="#ddd";
        this.backgroundLayerContext.fillRect(0,0,this.width,this.height);
    }
    
    this.initialize();
};

window.onload = function () {
    var play = new LineCar("playground", document.body.scrollWidth - 20, document.body.scrollHeight - 20);
};
