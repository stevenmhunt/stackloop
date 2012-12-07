/* Javascript for Stack Loop Demo 5 */

//get stackloop's current version and write it to the screen.
document.getElementById("curr_version").innerHTML = stackloop.version;

//the data we'll be iterating over.
var data = "abcdefghijk";

//utility function to write to screen.
function write(id, str) {
	document.getElementById(id).innerHTML = str;
}

var result1 = "";
for (var i = 0; i < data.length; i++) {
	result1 += data.charAt(i);
	write("example1", result1);
}

var result2 = "";
var context1 = new stackloop.context(null, 1);

context1.forEach(data, function(val) {	
	result2 += val;
	write("example2", result2);
});

var result3 = "";
var context2 = new stackloop.context(null, 0);

context2.forEach(data, function(val) {	
	result3 += val;
	write("example3", result3);
});

var result4 = "";
var context3 = new stackloop.context(null, 0);

context3.forEach(data).step(function(val) {
	result4 += val;
	write("example4", result4);
});
