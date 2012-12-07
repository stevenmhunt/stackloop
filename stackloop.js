/* stackloop.js
 * version 0.3
 * written by Steven Hunt
 * released under the MIT License. */

//create the stackloop "namespace".
var stackloop = stackloop || { version: "0.3" };

//create definitions for stackloop classes.
(function(sl) {

	//tracks a series of iterators so that we layer the delayed function calls correctly.
	sl.context = function(obj, wait) {
		
		this.wait = wait !== undefined ? wait : 0;
				
		if (this.wait == 0) {
			this.timeout = function(fn) {
				window.setZeroTimeout(fn);
			};
		}
		else {
			this.timeout = function(fn) {
				window.setTimeout(fn, this.wait);
			};
		}
		
		this.context = obj !== undefined ? obj : this;
		
		var iteratorStack = new Array();
		var pushIterator = function(i) { iteratorStack.push(i); }
		var popIterator = function() { return iteratorStack.pop(); }
		var peekIterator = function() { return iteratorStack[iteratorStack.length-1]; }	
			
		//internal iterator object class.
		var lc = this;
		var iterator = function(start, end, val, stepFn, finishedFn) {

			this.context = lc.context;		
			this.condition =  null;

			//stores what type of iteration we're performing.
			var i_type = 1;

			//conditional function
			if (val === false && typeof start === "function") {
				this.current = null;
				this.currentIndex = null;
				this.condition = start;
				i_type = 5;
			}
			
			//array iteration
			else if (val.constructor === Array) {
				this.current = val[start];		
				this.currentIndex = start;
				i_type = 4;
			}
			
			//string iteration
			else if (typeof val == 'string' || val instanceof String) {
				this.current = val.charAt(start);
				this.currentIndex = start;
				i_type = 3;
			}
			
			//object property iteration
			else if (isNaN(val)) {
				this.keys = Object.keys(val);
				this.current = val[this.keys[start]];
				this.currentIndex = start;
				i_type = 2;
			}
			
			//count iteration
			else
				this.current = start;

			//when the iterator is created, we need to push this object onto the iterator stack.
			pushIterator(this);

			//use deferred object to manage step and finished functions.
			var defer = new sl.deferred(this);
			defer.then(finishedFn, null, stepFn);
						
			// result { 1 = iterator finished successfully, 2 = step function stopped iteration, 3 = exception was thrown }
			var onfinish = function(curr, result, err) {
			
				if (result < 3)
					defer.success();
				else
					defer.fail(err);
				//call the finish function if possible.
				//if (finishedFn)
				//	finishedFn.call(lc.context, curr, result, err);
					
				popIterator();
					
				return false;
			}

			//indicates whether to proceed with the iteration, or stop.
			this.proceed = function() {
			
				switch(i_type) {
					case 1:
						return this.current < end;
					case 2:
						return this.currentIndex < this.keys.length;
					case 3:
					case 4:
						return this.currentIndex < val.length;
				}
				
				//if we're using a conditional function, return true and let the condition function determine whether to continue.
				return true;
			};

			//increment step counter and trigger the next step.
			this.increment = function() {		
				switch(i_type) {

					//count iteration
					case 1:
						this.current += val;
						break;

					//object property iteration
					case 2:
						this.currentIndex++;
						this.current = (this.currentIndex < this.keys.length) ? val[this.keys[this.currentIndex]] : null;
						break;
					//string iteration
					case 3:
						this.currentIndex++;
						this.current = (this.currentIndex < val.length) ? val.charAt(this.currentIndex) : null;
						break;
					//array iteration
					case 4:
						this.currentIndex++;
						this.current = (this.currentIndex < val.length) ? val[this.currentIndex] : null;
						break;
					//conditional function
					case 5:
						if (!this.condition.call(this))
							return onfinish(null, 1);
						break;
				}

				//run the next step.
				this.step();
			};

			//used to step through each iteration of the set.
			this.step = function() {
			
				//if we're trying to step, but there is another iterator running on top of this one in the stack...
				if (peekIterator() !== this) {
					
					//try stepping again later.
					var con = this;
					lc.timeout(function() {
						con.step();
					});

					return null;
				}
			
				//if we're out of the iteration, run close-out.
				if (!this.proceed())
					return onfinish(this.current, 1);
				
				//run step function on delay.
				var that = this;
				lc.timeout(function() {
			
					var result = false;
					
					try { result = defer.step(that.current);/*stepFn.call(lc.context, that.current);*/ }
					catch(err) {
						result = false;
						return onfinish(that.current, 3, err);
					}
				
					//if step function indicated to stop running simulation, run close-out.
					if (result === false)
						onfinish(that.current, 2);			
					//otherwise, keep going...
					else
						that.increment();
				});
				
				//if we made it this far, return true.
				return true;
			};
			
			//called to start the iteration.
			this.start = function() {
				this.step();
				return defer.promise;
			}
		};

		//count through the range of values...
		this.forCount = function(start, end, step, finished) {
			var i = new iterator(start, end, 1, step, finished);
			return i.start();
		};

		//iterate through the range of values...
		this.forRange = function(start, end, inc, step, finished) {
			var i = new iterator(start, end, inc, step, finished);
			return i.start();
		};

		//iterate through the array...
		this.forEach = function(array, step, finished) {
			var i = new iterator(0, array.length, array, step, finished);
			return i.start();
		};
		
		//iterate while a condition is true...
		this.whileTrue = function(fn, step, finished) {
			var i = new iterator(fn, true, false, step, finished);
			return i.start();
		};
	};

	//implementation of deferred object, similar to jQuery's deferred object.
	sl.deferred = function(iterator) {
		
		this.promise = new sl.promise(this);
		
		var success = new Array();
		var fail = new Array();
		var step = new Array();

		//registers callbacks with the deferred object.
		this.then = function(fnSuccess, fnFail, fnStep) {
			if (typeof fnSuccess === "function")
				success.push(fnSuccess);
			if (typeof fnFail === "function")
				fail.push(fnFail);
			if (typeof fnStep === "function")
				step.push(fnStep);
			return this;
		};
		
		//indicates successful completion of the iteration.
		this.success = function() {
			for (var i = 0; i < success.length; i++) {
				success[i].call(iterator);
			}
		};

		//indicates failure to complete the iteration with optional error message.
		this.fail = function(err) {
			for (var i = 0; i < fail.length; i++) {
				fail[i].call(iterator, err);
			}
		};
		
		//indicates that an iteration step has been executed.
		this.step = function(val) {
			var result = true;
			for (var i = 0; i < step.length; i++) {
				if (step[i].call(iterator.context, val) === false)
					result = false;
			}
			return result;
		};		
	};
	
	//implementation of commonJS Promise A.
	sl.promise = function(d) {
				
		//wrapper for deferred object then().
		this.then = function(fnSuccess, fnFail, fnStep) {
			d.then(fnSuccess, fnFail, fnStep);
			return this;
		};
		
		//add a success function callback.
		this.success = function(fn) {
			d.then(fn, null, null);
			return this;
		};

		//add a fail function callback.
		this.fail = function(fn) {
			d.then(null, fn, null);
			return this;
		};

		//add a step function callback.
		this.step = function(fn) {
			d.then(null, null, fn);
			return this;
		};

	};
	
})(stackloop);

// This code was written by David Baron
// http://dbaron.org/log/
// Only add setZeroTimeout to the window object, and hide everything else in a closure.
//edited by Steven Hunt
(function() {

	//EDIT: added check for an existing method, in case the user wants to implement their own version of setZeroTimeout().
	if (!window.setZeroTimeout) {
		var timeouts = [];
		var messageName = "zero-timeout-message";

		// Like setTimeout, but only takes a function argument.  There's
		// no time argument (always zero) and no arguments (you have to
		// use a closure).
		function setZeroTimeout(fn) {
			timeouts.push(fn);
			window.postMessage(messageName, "*");
		}

		function handleMessage(event) {
			if (event.source == window && event.data == messageName) {
				event.stopPropagation();
				if (timeouts.length > 0) {
					var fn = timeouts.shift();
					fn();
				}
			}
		}

		window.addEventListener("message", handleMessage, true);

		// Add the one thing we want added to the window object.
		window.setZeroTimeout = setZeroTimeout;
	}
})();