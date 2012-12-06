# Stack Loop
## Version 0.1

Supports nested asynchronous iteration across arrays and counts in javascript.

Overview
--------

The purpose of this library is to allow javascript code to execute nested loops without interrupting other javascript code that needs to execute on a web page. The loops runs in the same order as it would in conventional loops, except that each iteration of the loop is queued using setTimeout(). In order to support nested loops, the "stack loop context" keeps track of nested loops to ensure that the outer loop does not complete until all inner loops have had a chance to finish.

For more information on the code itself, check out the 
[API Reference](https://github.com/stevenmtwhunt/stackloop/wiki/API-Reference).

Also take a look at some [Examples](https://github.com/stevenmtwhunt/stackloop/wiki/Examples) on using stackloop.