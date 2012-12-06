/* stackloop.js
 * version 0.1
 * written by Steven Hunt
 */

//create the stackloop "namespace".
var stackloop = stackloop || {};

//create definitions for stackloop classes.
(function(sl) {

	//tracks a series of iterators so that we layer the delayed function calls correctly.
	sl.context = function(obj, wait) {
		
		this.wait = wait !== undefined ? wait : 0;
		this.context = obj !== undefined ? obj : {};
		
		var iteratorStack = new Array();
		var pushIterator = function(i) { iteratorStack.push(i); }
		var popIterator = function() { return iteratorStack.pop(); }
		var peekIterator = function() { return iteratorStack[iteratorStack.length-1]; }	
			
		//internal iterator object class.
		var lc = this;
		var iterator = function(start, end, val, stepFn, finishedFn) {

			this.context = lc.context;
		
			if (val.constructor === Array) {
				this.current = val[start];		
				this.currentIndex = start;
			}
			else
				this.current = start;

			//when the iterator is created, we need to push this object onto the iterator stack.
			pushIterator(this);

			var defer = new sl.deferred(this);
			defer.then(stepFn, finishedFn, null);
						
			// result { 1 = iterator finished successfully, 2 = step function stopped iteration, 3 = exception was thrown }
			var onfinish = function(curr, result, err) {
			
				if (result < 3)
					defer.success();
				else
					defer.fail();
				//call the finish function if possible.
				//if (finishedFn)
				//	finishedFn.call(lc.context, curr, result, err);
					
				popIterator();
					
				return false;
			}

			this.index = function() {
				return (val.constructor === Array ? this.currentIndex : this.current);
			};

			//increment step counter and trigger the next step.
			this.increment = function() {				
				if (val.constructor === Array) {
					this.currentIndex++;
					this.current = (this.currentIndex < val.length) ? val[this.currentIndex] : null;
				}
				else
					this.current += val;
				this.step();
			};

			//used to step through each iteration of the set.
			this.step = function() {
			
				//if we're trying to step, but there is another iterator running on top of this one in the stack...
				if (peekIterator() !== this) {
					
					//try stepping again later.
					var con = this;
					setTimeout(function() {
						con.step();
					}, lc.wait);

					return null;
				}
			
				//if we're out of the iteration, run close-out.
				if (this.index() >= end)
					return onfinish(this.current, 1);
				
				//run step function on delay.
				var that = this;
				setTimeout(function() {
				
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
				}, lc.wait);
				
				//if we made it this far, return true.
				return true;
			};
			
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
	};

	//implementation of deferred object, similar to jQuery's deferred object.
	sl.deferred = function(iterator) {
		
		this.promise = new sl.promise(this);
		
		var success = new Array();
		var fail = new Array();
		var step = new Array();

		this.then = function(fnStep, fnSuccess, fnFail) {
			if (typeof fnSuccess === "function")
				success.push(fnSuccess);
			if (typeof fnFail === "function")
				fail.push(fnFail);
			if (typeof fnStep === "function")
				step.push(fnStep);
			return this;
		};
		
		this.success = function() {
			for (var i = 0; i < success.length; i++) {
				success[i].call(iterator);
			}
		};
		this.fail = function() {
			for (var i = 0; i < fail.length; i++) {
				fail[i].call(iterator);
			}
		};
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
				
		this.then = function(fnStep, fnSuccess, fnFail) {
			if (fnStep !== undefined && fnSuccess === undefined && fnFail === undefined)
				d.then(null, fnStep, null);
			else
				d.then(fnStep, fnSuccess, fnFail);
			return this;
		};
	};

	
})(stackloop);
