'use strict';

let trainingData;
let trainingXs = [];
let trainingYs = [];
let tfXs;
let tfYs;

const preloadTrainingData = () => {
    trainingData = loadJSON('data/xor.js',
        (result) => {
            //console.log(result);
            convertTrainingDataIntoSeparateArrays();
            convertTrainingDataArraysIntoTensors();
        },
        (error) => {
            console.log(error);
        }
    );
}

const convertTrainingDataIntoSeparateArrays = () => {

    trainingData.data.forEach( (td, i) => {
        trainingXs[i] = td.inputs;
        trainingYs[i] = td.outputs;
    });

    //console.log(trainingXs);
    //console.log(trainingYs);
}

const convertTrainingDataArraysIntoTensors = () => {

    if (tfXs != undefined) {
        tfXs.dispose();
        tfYs.dispose();
    }

    tfXs = tf.tensor2d(trainingXs);
    tfYs = tf.tensor2d(trainingYs);
}