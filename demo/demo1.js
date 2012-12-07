/* Javascript for Stack Loop Demo 1 */

//get stackloop's current version and write it to the screen.
document.getElementById("curr_version").innerHTML = stackloop.version;

//test data to use.
var data = ['A', 'B', 'C', 'D', 'E', 'F'];

//utility function to write to screen.
function writeLine(id, str) {
	document.getElementById(id).innerHTML += str + "<br />";
}

//conventional nested loop.
for (var i = 0; i < 10; i++) {
	for (var j = 0; j < data.length; j++) {
		writeLine("example1", "0: "+i+", "+data[j]);
	}
	writeLine("example1", "0: "+'inner done.');
}
writeLine("example1", "0: "+'done!');

//asynchronous loop.
var context1 = new stackloop.context(null, 20);
context1.forCount(0, 10, function(i) {

	context1.forEach(data, function(j) {
	
		writeLine("example2", "1: "+i+", "+j);
	
	}).then(function() { writeLine("example2", "1: "+'inner done.'); });
}, function() {

writeLine("example2", "1: "+'done!');

});

//asynchronous loop using promises.
var context2 = new stackloop.context(null, 20);

context2.forCount(0, 10).step(function(i) {

  context2.forEach(data).step(function(j) {
  
		writeLine("example3", "2: "+i+", "+j);
	
	}).then(function() {
	
	writeLine("example3", "2: "+'inner done.');
	
	});
}).then(function() {

writeLine("example3", "2: "+'done!');

});