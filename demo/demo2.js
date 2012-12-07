/* Javascript for Stack Loop Demo 2 */

//get stackloop's current version and write it to the screen.
document.getElementById("curr_version").innerHTML = stackloop.version;

//utility function to write to screen.
function write(id, str) {
	document.getElementById(id).innerHTML = str;
}

var result1 = 0;
//conventional nested loop.
for (var i1 = 0; i1 < 2; i1++) {
	for (var i2 = 0; i2 < 2; i2++) {
		for (var i3 = 0; i3 < 2; i3++) {
			for (var i4 = 0; i4 < 2; i4++) {
				for (var i5 = 0; i5 < 2; i5++) {
					for (var i6 = 0; i6 < 2; i6++) {
						for (var i7 = 0; i7 < 2; i7++) {
							for (var i8 = 0; i8 < 2; i8++) {
								for (var i9 = 0; i9 < 2; i9++) {
									for (var i10 = 0; i10 < 2; i10++) {
										result1++;
										write("example1", result1);
									}								
								}
							}
						}
					}
				}
			}
		}
	}
}

var result2 = 0;
var context1 = new stackloop.context(null, 1);

context1.forCount(0, 2, function() {
	context1.forCount(0, 2, function() {
		context1.forCount(0, 2, function() {
			context1.forCount(0, 2, function() {
				context1.forCount(0, 2, function() {
					context1.forCount(0, 2, function() {
						context1.forCount(0, 2, function() {
							context1.forCount(0, 2, function() {
								context1.forCount(0, 2, function() {
									context1.forCount(0, 2, function() {
										result2++;
										write("example2", result2);
									});
								});
							});
						});
					});
				});
			});
		});
	});
});

var result3 = 0;
var context2 = new stackloop.context(null, 0);

context2.forCount(0, 2, function() {
	context2.forCount(0, 2, function() {
		context2.forCount(0, 2, function() {
			context2.forCount(0, 2, function() {
				context2.forCount(0, 2, function() {
					context2.forCount(0, 2, function() {
						context2.forCount(0, 2, function() {
							context2.forCount(0, 2, function() {
								context2.forCount(0, 2, function() {
									context2.forCount(0, 2, function() {
										result3++;
										write("example3", result3);
									});
								});
							});
						});
					});
				});
			});
		});
	});
});