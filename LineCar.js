function LineCar(playgroundId, width, height) {

    this.initialize = function(){
        this.playground = document.getElementById(playgroundId);

        this.playCanvas = document.createElement("canvas");
        this.playContext = this.playCanvas.getContext("2d");
        this.width = width;
        this.height = height;

        this.playCanvas.setAttribute("width", width);
        this.playCanvas.setAttribute("height", height);

        this.playground.style.width = width + "px";
        this.playground.style.height = height + "px";
        this.playground.appendChild(this.playCanvas);

        this.timeSecend = 0.01;
        
        this.car = new Car(this.playContext, 200, 200);

        _this = this;
        this.intervalNumber = setInterval(function(){ _this.update();} , this.timeSecend * 1000, this);
    }
    
    this.update = function(){
        this.car.move(this.timeSecend);
        this.draw();
    }
    
    this.draw = function(){
        this.drawBackground();
        this.car.draw();
    }
    
    this.drawBackground = function () {
        this.playContext.clearRect(0,0,this.width,this.height);
    }
    
    this.initialize();
};

window.onload = function () {
    var play = new LineCar("playground", 600, 600);
};
