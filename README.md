# jsThread

# Usage


1.Add bottom tag into <head> area of your html file
```
<script type="text/javascript" src="js/jsthread.js"></script> 
```

2.Make your own thead process
```
<script type="text/javascript">

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

jsThread.callThread(thread, 4).then(function(result) {
    // result = 1 + 2 + 3 + 4 = 10
}).catch(function(err) {
    // error
    alert(err);
});

jsThread.endThread(thread);

</script>
```

# License
MIT License
