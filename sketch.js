'use stricti';

let canvas;

function preload() {
    preloadTrainingData();
}

function setup() {
    canvas = createCanvas(400, 400);
    canvas.parent('canvasParent');
    assemblePredictionInputs();
}



function draw() {

    try {

        let newCanvasWidth = document.getElementById('canvasParent').clientWidth;
        let newCanvasHeight = parseInt(document.getElementById('canvasHeight').value);
        resizeCanvas(newCanvasWidth, newCanvasHeight);

        background(0);

        if (thereExistsNetwork) drawTrainingResults();

        //console.log('Tensors: ' + tf.memory().numTensors);

    } catch (error) {
        console.log(error);
        showMessages('danger',error);
    }

}