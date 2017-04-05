var queue = require('block-queue');
 
/*
    
 function myFunc (arg) {
  console.log('order: '+arg+" processed");
}
var q = queue(1, function(task, done) {
    // working on task.. 
    setTimeout(myFunc,2000,task);

    done();
});

console.log("Pay API call made for order 1")
q.push('order 1');
console.log("Pay Api call made for order 2");

q.push('order 2');
console.log("Pay APir call made for order 3");
q.push('order 3');

console.log("Pay API call made for order 4");
q.push('order 4');

*/


var q = queue(1, function(task, done) {
  setTimeout(function() {
    console.log(task+' is now being prepared');
    
  },  1000); // Check for orders every 1 seconds


  setTimeout(function() {

  	console.log(task+' is now being served');

  },5000);  // serve order after 4 seconds (for node timeout is cummulative so 1+4)

  setTimeout(function() {

  	console.log(task+' is now being collected');
  	done();
  },8000);  // collect after 3 seconds (for node timeout is cummulative so 1+4+3)

});

for (var i = 0; i < 4; i++) {
  console.log("Pay API call made for order "+i)
q.push('order '+i);

}


