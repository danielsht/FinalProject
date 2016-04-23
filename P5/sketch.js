var bytes = [];
var arcProp = {};

function setup() {
	createCanvas(640, 480); //make panel to draw on in the site
    stroke('red'); //change line color to red 
    noFill(); //doesnt allow arcs to fill to center like a pie chart thus covering other arcs
}

function draw() {
    background(0);
    for (var i = 0; i < bytes.length; i++) { //cycle through bites and create the arc using the object properites
        arc(width/2, height/2, bytes[i].HAndW, bytes[i].HAndW, bytes[i].start, bytes[i].stop);
    }
    animateArcs();
}

function mapValues(){ //map byte values to degrees and add to the arc properties then return the array with the arc properties
	var mappedValues = [];
	for (var i = 0; i < bytes.length; i++) {
		var m = map(int(bytes[i]), 00000000, 99999999, 0, 360);
		mappedValues[i] = m;
        mappedValues[i] = arcArray(mappedValues[i]);
	}
	return mappedValues;
}

function readBlob(opt_startByte, opt_stopByte) { //read file byte by byte on input change

    var files = document.getElementById('files').files;
    var i = 0;
    if (!files.length) { //if no files yell at user to put one
      alert('Please select a file!');
      return;
    }

    var file = files[0];
    var start = parseInt(opt_startByte) || 0;
    var stop = parseInt(opt_stopByte) || file.size - 1;
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
    arcHeightAndWidth = random(0, 400);
    arcStart = random(0, 360);
    if(arcStart + bytesToBePlaced >= 360){ //convert to radians and account set any stop values 361+ to 0+
        arcStop = (arcStart - 360) + bytesToBePlaced;
        arcStart = arcStart * (PI/180);
        arcStop = arcStart * (PI/180);
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

