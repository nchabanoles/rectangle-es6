import Rect from './shapes/Rect.js';

class Drawing {
    constructor(canvas) {
        this.shapes = [];
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.paint();
    }

    startDrawing(x, y) {
        var startX = x - this.canvas.offsetLeft;
        var startY = y - this.canvas.offsetTop;

        var randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
        this.currentShape = {x:startX, y:startY, shape:new Rect(1,1,  randomColor)};
        this.shapes.push(this.currentShape);

        this.canvas.style.cursor="crosshair";
    }

    stopDrawing() {
        this.canvas.style.cursor="default";
        if(this.currentShape.shape.w <=1 && this.currentShape.shape.h <=1) {
            this.shapes.pop();
        }
        this.currentShape = null;
    }

    movePen(x, y) {
        if (this.currentShape) {
            this.currentShape.shape.w = (x - this.canvas.offsetLeft) - this.currentShape.x;
            this.currentShape.shape.h = (y - this.canvas.offsetTop) - this.currentShape.y;
        }
    }

    paint() {
        var drawing = this;

        var draw = function() {
            if(drawing.currentShape || !drawing.animationCompleted) {
                drawing.ctx.clearRect(0, 0, drawing.canvas.width, drawing.canvas.height);
                drawing.animationCompleted = true;
                drawing.shapes.forEach(shapeDesc => {
                    drawing.ctx.fillStyle = shapeDesc.shape.fill;
                    if (shapeDesc.animation && shapeDesc.animation.angle < 360) {
                        drawing.animationCompleted = rotate(drawing.ctx, shapeDesc) && drawing.animationCompleted; // Order matters!
                    } else {
                        drawing.ctx.fillRect(shapeDesc.x, shapeDesc.y, shapeDesc.shape.w, shapeDesc.shape.h);
                    }
                });
                if (drawing.animationCompleted) {
                    drawing.shapes = drawing.shapes.filter(shapeDesc => !shapeDesc.animation);
                    drawing.animationCompleted = false; // Force another drawing to remove shapes.
                }
            }
        };
        window.setInterval(draw, 30);
    };

    animate( x, y) {
        var shapeX = x - this.canvas.offsetLeft;
        var shapeY = y - this.canvas.offsetTop;

        this.shapes.reduce((acc, shapeDesc) => {
            if  ((shapeDesc.x <= shapeX) && (shapeDesc.x + shapeDesc.shape.w >= shapeX) &&
                (shapeDesc.y <= shapeY) && (shapeDesc.y + shapeDesc.shape.h >= shapeY)) {
                acc.push(shapeDesc);
            }
            return acc;
        },[]).map(shapeDesc => {
            shapeDesc.animation = {angle:0};
            this.animationCompleted = false;
            return shapeDesc;
        });
    };
}



var rotate = function (ctx, shapeDesc) {

    var TO_RADIANS = Math.PI/180;
    shapeDesc.animation.angle+=1;

    ctx.save();
    ctx.translate(shapeDesc.x + shapeDesc.shape.w / 2, shapeDesc.y + shapeDesc.shape.h / 2);
    ctx.rotate(shapeDesc.animation.angle * TO_RADIANS);

    ctx.fillRect(-(shapeDesc.shape.w / 2), -(shapeDesc.shape.h / 2), shapeDesc.shape.w, shapeDesc.shape.h);

    ctx.restore();
    return shapeDesc.animation.angle >= 360;
};

export default Drawing;