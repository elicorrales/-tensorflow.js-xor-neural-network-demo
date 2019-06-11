'use strict';


const doChangeCanvasWidth = () => {
    networkTrained = false;
    trainTheNetwork = true;
    clearMessages();
    let newCanvasWidth = document.getElementById('canvasParent').clientWidth;
    let newCanvasHeight = parseInt(document.getElementById('canvasHeight').value);
    resizeCanvas(newCanvasWidth, newCanvasHeight);
}

const doChangeCanvasHeight = (input) => {
    networkTrained = false;
    trainTheNetwork = true;
    clearMessages();
    let newCanvasWidth = document.getElementById('canvasParent').clientWidth;
    let newCanvasHeight = input.value;
    resizeCanvas(newCanvasWidth, newCanvasHeight);
}

//canvasResolution = document.getElementById('canvasResolution');
const doChangeCanvasResolution = (input) => {
    networkTrained = false;
    trainTheNetwork = true;
    clearMessages();
    canvasResolution = input.value;
    assemblePredictionInputs();
}


const doCreateNetwork = () => {

    thereExistsNetwork = false;

    networkTrained = false;
    trainTheNetwork = false;

    clearMessages();

    try {
        let numHidden = parseInt(document.getElementById('nnNumHidden').value);
        let numEpoch = parseInt(document.getElementById('nnNumEpoch').value);
        let activationHidden = document.getElementById('activationHidden').value;
        let activationOutputs = document.getElementById('activationOutputs').value;
        let optimizer = document.getElementById('optimizer').value;
        let loss = document.getElementById('loss').value;
        createNeuralNetwork(numHidden, activationHidden, activationOutputs, optimizer, loss, numEpoch);

        assemblePredictionInputs();

        thereExistsNetwork = true;


    } catch (error) {
        console.log(error);
        showMessages('danger', error);
    }
}

const doTrainNetwork = () => {
    networkTrained = false;
    trainTheNetwork = true;
    clearMessages();
    trainTheModel();
}

const doChangeLearningRate = (slider) => {
    networkTrained = false;
    trainTheNetwork = false;
    clearMessages();
    learningRate = slider.value;
    document.getElementById('learningRate').innerHTML = learningRate;
}

