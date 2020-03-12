# jsThread

#Usage:

var i = 0;

var thread = jsThread.createThread(function(p) { // this function will work in web worker
    // init here
    // var a = 1;
    // var b = 2;
    // and something else ...
    return function(v) { // this function can be called by callThread
        // process and return data
        var c = 3;
        return a + b + c + v;
    };
}, ['js/dependency1.js', 'js/dependency2.js'], i);

callThread(thread, 4).then(function(result) {
    // result = 1 + 2 + 3 + 4 = 10
}).catch(function(err) {
    // error
    alert(err);
});

endThread(thread);
