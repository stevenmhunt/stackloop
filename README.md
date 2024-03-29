stackloop.js: Simple Asynchronous Nested Iteration
==================================================

**Version 0.3**

*Supports nested asynchronous iteration across objects and value ranges in javascript.*

Overview
--------

The purpose of this library is to allow javascript code to execute nested loops without interrupting other javascript code that needs to execute on a web page. The loops run in the same order as they would in conventional loops, except that each iteration of the loop is queued using setTimeout() or [setZeroTimeOut](http://dbaron.org/log/20100309-faster-timeouts)(). In order to support nested loops, the "stack loop context" keeps track of all running nested loops to ensure that the outer loops do not complete until all inner loops have had a chance to finish.

For more information on the code itself, check out the 
[API Reference](https://github.com/stevenmtwhunt/stackloop/wiki/API-Reference).

Also take a look at some [Examples](https://github.com/stevenmtwhunt/stackloop/wiki/Examples) on using stackloop.

Version History
---------------

### Version 0.3
* Added additional demos.
* Removed the whileFalse() function to minimize redundancy.
* Expanded of the library's deferred object/promise implementation.
* Added ability to iterate over the properties in an object and characters of a string.
* Added minified production version of the library.

### Version 0.2
* Added [setZeroTimeout](http://dbaron.org/log/20100309-faster-timeouts)() into the library, used by default over setTimeout().
* Added ability to implement conditional asynchronous loops.

### Version 0.1
* Asnychronous iterator implementation.
* Ability to loop over arrays and counts.
* Basic deferred object/promise implementation.

Roadmap for Future Development
------------------------------
* Integration of nextTick() into the library.