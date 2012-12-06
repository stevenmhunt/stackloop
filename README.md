# Stack Loop
## Version 0.1

Supports nested asynchronous iteration across arrays and counts in javascript.

Overview
--------

The purpose of this library is to allow javascript code to execute nested loops without interrupting other javascript code that needs to execute on a web page. The loops runs in the same order as it would in conventional loops, except that each iteration of the loop is queued using setTimeout(). In order to support nested loops, the "stack loop context" keeps track of nested loops to ensure that the outer loop does not complete until all inner loops have had a chance to finish.

Documentation
-------------

### stackloop.context

Provides a context for executing asynchronous nested loops.

**Constructor**

instanciates a new stack loop context.
```javascript
var context = new stackloop.context(context, wait);
```
*Parameters*
* _obj_ (optional): a reference to an object to use as a context when calling step and finish functions for the loop.
* _wait_ (optional, default: 1): the number of milliseconds of wait time to apply to delayed function calls.

**forCount**

In the given context, count from a to b excluding b.
```javascript
context.forCount(a, b, function(count) { ... }, function() { ... });
```
*Parameters*
* _a_: the starting number to count from.
* _b_: the ending number to count to but not iterate over.
* _step_ (optional): A function to call for each iteration of the loop, passing the current value as a parameter.
* _finish_ (optional): A function to call when the loop has finished running.

*Returns*

A stackloop.promise object.

**forRange**

In the given context, count from a to b excluding b by a specified increment.
```javascript
context.forRange(a, b, inc, function(count) { ... }, function() { ... });
```
*Parameters*
* _a_: the starting number to count from.
* _b_: the ending number to count to but not iterate over.
* _inc_: the value to add to the count for each iteration of the loop.
* _step_ (optional): A function to call for each iteration of the loop, passing the current value as a parameter.
* _finish_ (optional): A function to call when the loop has finished running.

*Returns*

A stackloop.promise object.

**forEach**

In the given context, iterate over each value of an array.
```javascript
context.forEach(arr, function(count) { ... }, function() { ... });
```
*Parameters*
* _arr_: the array to iterate over.
* _step_ (optional): A function to call for each iteration of the loop, passing the current value as a parameter.
* _finish_ (optional): A function to call when the loop has finished running.

*Returns*

A stackloop.promise object.

*****************

### stackloop.promise

Provides an object to register callbacks to which get called at various points during the iteration. Similar to jQuery's promise object, the implementation of this object is based on the CommonJS Promises/A specification http://wiki.commonjs.org/wiki/Promises/A

**then**

Adds success, fail, and/or step callbacks to this promise object.
```javascript
context.forEach(...).then(success);
context.forEach(...).then(step, success, fail);
```
*Parameters*
* _step_ (optional): A function to call for each iteration of the loop, passing the current value as a parameter.
* _success_ (optional): A function to call when the iteration has completed successfully.
* _fail_ (optional): A function to call when the iteration has experienced an error.

Note that if you do not want to add a callback for a specific parameter, you can pass a null to it as follows:
```javascript
context.forEach(...).then(null, function() { ... });
```

*Returns*

A reference to method's stackloop.promise instance, in order to support chaining calls.

*****************

Examples
-------

**1:** A typical nested loop in javascript.

```javascript

var data = [1, 3, 5, 7, 9];

for (var i = 0; i < 10; i++) {

  for (var j = 0; j < data.length; j++) {

    alert(i+", "+data[j]);
	}

  alert('inner done.');
}

alert('done!');

```

**2:** Asynchronous nested loops using Stack Loop.

```javascript

var data = [1, 3, 5, 7, 9];

var context = new stackloop.context();

context.forCount(0, 10, function(i) {

  context.forEach(data, function(j) {
	
		alert(i+", "+j);
	
	}, function() {
	
	alert('inner done.');
	
	});
}, function() {

alert('done!');

});

```

**3:** Asynchronous nested loops using Stack Loop using promise callbacks.

```javascript

var data = [1, 3, 5, 7, 9];

var context = new stackloop.context();

context.forCount(0, 10).then(function(i) {

  context.forEach(data).then(function(j) {
  
		alert(i+", "+j);
	
	}, function() {
	
	alert('inner done.');
	
	});
}, function() {

alert('done!');

});

```