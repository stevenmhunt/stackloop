/* Javascript for Stack Loop Demo 3 */

//get stackloop's current version and write it to the screen.
document.getElementById("curr_version").innerHTML = stackloop.version;

//utility function to write to screen.
function write(id, str) {
	document.getElementById(id).innerHTML = str;
}

var result1 = 0;

while (result1 < 1024) {
	result1++;
	write("example1", result1);
}

var result2 = 0;
var context1 = new stackloop.context(null, 1);

context1.whileTrue(function() { return (result2 < 1024); }, function() {	
	result2++;
	write("example2", result2);
});

var result3 = 0;
var context2 = new stackloop.context(null, 0);

context2.whileTrue(function() { return (result3 < 1024); }, function() {	
	result3++;
	write("example3", result3);
});

var result4 = 0;
var context3 = new stackloop.context(null, 0);

context3.whileTrue(function() { return (result4 < 1024); }).step(function() {
	result4++;
	write("example4", result4);
});
