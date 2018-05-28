
import Drawing from './Drawing.js';

var canvas = document.getElementById("whiteboard");
if (canvas.getContext) {

    var drawing = new Drawing(canvas);

    canvas.addEventListener('dblclick', click, false);
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mousemove', mouseMove, false);

    function mouseDown(e) {
        drawing.startDrawing(e.pageX, e.pageY);
    }

    function mouseUp() {
        drawing.stopDrawing();
    }

    function mouseMove(e) {
       drawing.movePen(e.pageX, e.pageY);
    }

    function click(e) {
        drawing.animate(e.pageX , e.pageY);

    }
}