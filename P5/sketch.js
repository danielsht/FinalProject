var bytes = [];
var isMapped = false;
var rectDrawn = false;

function setup() {
	createCanvas(640, 480);
	frameRate(30);
}

function draw() {
	if(!isMapped){
		bytes = mapValues();
	} else if(!rectDrawn){
		for (var i = 0; i < bytes.length; i += 10) {
			rect(random(width), random(height), bytes[i], bytes[i]);
		}
		rectDrawn = true;
	}
}

function mapValues(){
	var mappedValues = [];
	for (var i = 0; i < bytes.length; i++) {
		var m = map(int(bytes[i]), 00000000, 99999999, 10, 110);
		mappedValues[i] = floor(m);
	}
	isMapped = true;
	return mappedValues;
}

function readBlob(opt_startByte, opt_stopByte) {

    var files = document.getElementById('files').files;
    var i = 0;
    if (!files.length) {
      alert('Please select a file!');
      return;
    }

    var file = files[0];
    var start = parseInt(opt_startByte) || 0;
    var stop = parseInt(opt_stopByte) || file.size - 1;
    bytes = []; //clear array

    var reader = new FileReader();

    reader.onload = function(evt) {
        var placemark = 0, dv = new DataView(this.result), limit = dv.byteLength - 4, output;
        while( placemark <= limit ){
            output = dv.getUint32(placemark);  
            bytes[i] = output.toString(16);
            placemark += 1;
            i++;
        }
        rectDrawn = false;
    	isMapped = false;     
    };

    var blob = file.slice(start, stop + 1);
    reader.readAsArrayBuffer(blob);
  }
