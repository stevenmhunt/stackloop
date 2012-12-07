/* Javascript for Stack Loop Demo 4 */

//get stackloop's current version and write it to the screen.
document.getElementById("curr_version").innerHTML = stackloop.version;

//the data we'll be iterating over.
var data = {
	a: 1,
	b: 2,
	c: 3,
	d: 4,
	e: 5,
	f: 6,
	g: 7,
	h: 8,
	i: 9,
	j: 10,
	k: 11,
	l: 12,
	m: 13,
	n: 14,
	o: 15,
	p: 16,
	q: 17,
	r: 18,
	s: 19,
	t: 20,
	u: 21,
	v: 22,
	w: 23,
	x: 24,
	y: 25,
	z: 26
};

//utility function to write to screen.
function write(id, str) {
	document.getElementById(id).innerHTML = str;
}

var result1 = 1;
var data_keys = Object.keys(data);
for (var i = 0; i < data_keys.length; i++) {
	result1 *= data[data_keys[i]];
	write("example1", result1);
}

var result2 = 1;
var context1 = new stackloop.context(null, 1);

context1.forEach(data, function(val) {	
	result2 *= val;
	write("example2", result2);
});

var result3 = 1;
var context2 = new stackloop.context(null, 0);

context2.forEach(data, function(val) {	
	result3 *= val;
	write("example3", result3);
});

var result4 = 1;
var context3 = new stackloop.context(null, 0);

context3.forEach(data).step(function(val) {
	result4 *= val;
	write("example4", result4);
});
