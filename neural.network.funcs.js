'use strict';

let canvasResolution = document.getElementById('canvasResolution').value;
let canvasCols;
let canvasRows;

let tfModel;
let tfHidden;
let tfOutputs;
let tfOptimizer;
let tfLoss;
let tfInputs;
let momentum = 0.2;
let numEpoch;

let learningRate = document.getElementById('learningRateSlider').value;
document.getElementById('learningRate').innerHTML = learningRate;

let thereExistsNetwork = false;
let trainTheNetwork = false;
let trainNetworkWait = false;
let networkTrained = false;


const trainTheModel = () => {

    //do everything in here so that we dont have a memory
    //leak
    tf.tidy(() => {

        if (trainTheNetwork && !networkTrained) {
            try {
                train()
                    .then(result => {
                        console.log(result.history.loss[0]);
                        //trainNetworkWait = false;

                        //if (trainTheNetwork && !networkTrained && !trainNetworkWait) {
                        if (trainTheNetwork && !networkTrained) {
                            setTimeout(trainTheModel, 1);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        //trainTheNetwork = false;
                        showMessages('danger', error);
                    });
            } catch (error) {
                console.log(error);
                showMessages('danger', error);

            }
        }
    });


}

const train = () => {

    if (tfModel === undefined) {
        throw 'There Is No Network.'
    }

    //trainNetworkWait = true;

    return tfModel.fit(tfXs, tfYs, {
        shuffle: true,
        epoch: numEpoch
    });


}

const drawTrainingResults = () => {

    if (tfModel === undefined) {
        return;
    }

    tf.tidy(() => {
        let yOutputs = tfModel.predict(tfInputs).dataSync();
        drawPredictions(yOutputs);

        document.getElementById('frameRate').innerHTML = frameRate().toFixed(2);
        stroke(255);
    });

    //noLoop();
}

const assemblePredictionInputs = () => {
    let inputs = [];
    canvasCols = width / canvasResolution;
    canvasRows = height / canvasResolution;
    for (let i = 0; i < canvasCols; i++) {
        for (let j = 0; j < canvasRows; j++) {
            let x1 = i / canvasCols;
            let x2 = j / canvasRows;
            //the predict() expects not just the inputs,
            //but it could be an array of inputs;
            //example: [ [0,0], [0,1], .....] etc
            //soooo... even for 1 set of inputs,
            //we would need [[x1,x2]]
            let input = [x1, x2];
            inputs.push(input);
        }
    }
    //console.log(inputs);
    if (tfInputs !== undefined) {
        tfInputs.dispose();
    }

    tfInputs = tf.tensor2d(inputs);
    //console.log(tfInputs.dataSync());
}

const drawPredictions = (yOutputs) => {

    //console.log(yOutputs);
    let yOutIdx = 0;
    for (let i = 0; i < canvasCols; i++) {
        for (let j = 0; j < canvasRows; j++) {
            let x1 = i / canvasCols;
            let x2 = j / canvasRows;
            let brightness = yOutputs[yOutIdx] * 255;
            fill(brightness);
            rect(i * canvasResolution, j * canvasResolution, canvasResolution, canvasResolution);
            //fill(255-brightness);
            //textAlign(CENTER, CENTER);
            //text(nf(yOutputs[yOutIdx], 1, 2),i * canvasResolution + canvasResolution/2,  j * canvasResolution + canvasResolution/2);
            yOutIdx++;
        }
    }


}

const createNeuralNetwork = (numHidden, activationHidden, activationOutputs, useWhichOptimizer, useWhichLoss, epoch) => {

        numEpoch = epoch;

        if (tfModel !== undefined) {
            tfModel.dispose();
        }

        tfModel = tf.sequential();

        //if (tfHidden !== undefined) { tfHidden.dispose(); }
        tfHidden = tf.layers.dense(
            {
                inputShape: [2],            // this is the number of inputs to the hidden layer.
                units: numHidden,           // the number of nodes inside the hidden layer.
                activation: activationHidden,
            }
        );

        // the inputShape is inferred because this output layer is added after the hidden layer
        // and each layer was added as 'dense' (fully connected)
        //if (tfOutputs !== undefined) { tfOutputs.dispose(); }
        tfOutputs = tf.layers.dense(
            {
                units: 1,                   // the number of nodes inside the output layer
                activation: activationOutputs,
            }
        );

        if (tfOptimizer !== undefined) { tfOptimizer.dispose(); }
        switch (useWhichOptimizer) {
            case 'SGD': tfOptimizer = tf.train.sgd(learningRate); break;
            case 'Momentum': tfOptimizer = tf.train.momentum(learningRate, momentum); break;
            case 'ADAGRAD': tfOptimizer = tf.train.adam(learningRate); break;
            case 'ADADELTA': tfOptimizer = tf.train.adamgrad(learningRate); break;
            case 'ADAM': tfOptimizer = tf.train.adadelta(learningRate); break;
            case 'ADAMAX': tfOptimizer = tf.train.adamax(learningRate); break;
            case 'RMSPROP': tfOptimizer = tf.train.rmsprop(learningRate); break;
        }

        //if (tfLoss !== undefined) { tfLoss.dispose(); }
        switch (useWhichLoss) {
            case 'absoluteDifference': tfLoss = tf.losses.absoluteDifference; break;
            case 'computeWeightedLoss': tfLoss = tf.losses.computeWeightedLoss; break;
            case 'cosineDistance': tfLoss = tf.losses.cosineDistance; break;
            case 'hingeLoss': tfLoss = tf.losses.hingeLoss; break;
            case 'huberLoss': tfLoss = tf.losses.huberLoss; break;
            case 'logLoss': tfLoss = tf.losses.logLoss; break;
            case 'meanSquaredError': tfLoss = tf.losses.meanSquaredError; break;
            case 'sigmoidCrossEntropy': tfLoss = tf.losses.sigmoidCrossEntropy; break;
            case 'softmaxCrossEntropy': tfLoss = tf.losses.softmaxCrossEntropy; break;
        }


        tfModel.add(tfHidden);
        tfModel.add(tfOutputs);
        tfModel.compile({
            optimizer: tfOptimizer,
            loss: tfLoss
        });
}
