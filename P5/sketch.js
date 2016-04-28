var bytes = [];
var arcProp = {};
var mySound;
var sound = false;
var songDuration, intervalChange, changeOnFrame, fileSize, byteCounter, arcRadius;

function setup() {
    createCanvas(640, 480); //make panel to draw on in the site
    byteCounter = 10000;
    frameRate();
    changeOnFrame = 60;
    arcRadius = 400;
}

function draw() {
    background(0);

    if(frameCount % changeOnFrame == (changeOnFrame - 1) && sound){
        readBlob(byteCounter, byteCounter += intervalChange);
        if(mySound.currentTime() == 0){
            sound = false;
        }
    }
    //uncomment for waveform not complete yet
    if(sound){
        noFill();
        stroke('red');
        for (var i = 0; i < bytes.length; i++) { //cycle through bites and create the arc using the object properites
            arc(width/2, height/2, bytes[i].HAndW, bytes[i].HAndW, bytes[i].start, bytes[i].stop);
        }
        animateArcs();

        var waveform = mySound.getPeaks();
        stroke(0, 0, 255, 99);
        strokeWeight(1);
        beginShape();
        for (var i = 0; i< waveform.length; i++){
            vertex(map(i, 0, waveform.length, 100, width - 100), map(waveform[i], -1, 1, height, 0));
        }
        endShape();

        drawCursor();
    }
}

function mapValues(){ //map byte values to degrees and add to the arc properties then return the array with the arc properties
    var mappedValues = [];
    for (var i = 0; i < bytes.length; i++) {
        var m = map(bytes[i], 0, 9999999999, 0, 360);
        mappedValues[i] = m;
        mappedValues[i] = arcArray(mappedValues[i]);
    }
    return mappedValues;
}

function newFileRead(){
    var file = getFiles();
    fileSize = file.size - 1;

    mySound = loadSound(file, playMusic);
    readBlob(0, 10000, file);
}

function getFiles(){
    var files = document.getElementById('files').files;
    if(!files.length){
        alert('Please select a file!');
        return;
    }

    var file = files[0]

    return file;
}

function readBlob(opt_startByte, opt_stopByte, files) { //read file byte by byte on input change

    var file = files || getFiles();
    var start = parseInt(opt_startByte) || 0;
    var stop = parseInt(opt_stopByte) || file.size - 1;
    var i = 0;
    bytes = []; //clear array


    var reader = new FileReader();

    reader.onload = function(evt) { //when the reader loads the file read byte by byte and output as a string
        var placemark = 0, dv = new DataView(this.result), limit = dv.byteLength - 4, output;
        while( placemark <= limit ){
            output = dv.getUint32(placemark);  
            bytes[i] = output.toString(16);
            placemark += 4;
            i++;
        }
        bytes = mapValues(); //map values in bytes for arcs 
    };

    var blob = file.slice(start, stop + 1);
    reader.readAsArrayBuffer(blob);
  }

function arcArray(bytesToBePlaced){ //get properties for the arc and return them to be placed in an array
    arcHeightAndWidth = random(0, arcRadius);
    arcStart = random(0, 360);
    if(arcStart + bytesToBePlaced >= 360){ //convert to radians and account set any stop values 361+ to 0+
        arcStop = (arcStart - 360) + bytesToBePlaced;
        arcStart = arcStart * (PI/180);
        arcStop = arcStop * (PI/180);
    } else { //just convert to radians and set arc stop
        arcStop = arcStart + bytesToBePlaced;
        arcStart = arcStart * (PI/180);
        arcStop = arcStop * (PI/180);
    }
    
    return arcProp = {HAndW:arcHeightAndWidth, start:arcStart, stop:arcStop} //return arc object properties
}

function animateArcs(){
    for (var i = 0; i < bytes.length; i++) {
        bytes[i].start += (1 * (PI/180));
        bytes[i].stop += (1 * (PI/180));
    }
}

function playMusic(){
    mySound.setVolume(1.0);
    mySound.play();
    songDuration = mySound.duration();
    intervalChange = fileSize / songDuration;
    sound = true;
}

function drawCursor() {
  noStroke();
  fill(0,255,0, 75);
  rect(map(mySound.currentTime(), 0, mySound.duration(), 100, width - 100), (height/2 - 150), 2, 300);
}