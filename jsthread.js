(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
        (factory((global.jsThread = global.jsThread || {})));
}(this, (function(exports) {
    "use strict";

    function createThread(init, imports, param) {
        var url = window.location.href;
        url = url.substring(0, url.lastIndexOf('/') + 1);

        var global = [];

        if (imports != undefined) {
            for (var item of imports) {
                global.push('importScripts(\'' + url + item + '\');');
                // global.push('importScripts(\'' + self.location.origin + '/' + item + '\');');
            }
        }

        var blob = new Blob(['\'use strict\';' + global.join('') + '(' + function(f) {
            self.onmessage = function(e) {
                var callable = f(e.data);
                Promise.resolve(callable).then(function(f) {
                    if (typeof(f) == 'function') {
                        self.onmessage = function(e) {
                            var result = f(e.data);
                            // self.postMessage(result);
                            Promise.resolve(result).then(function(v) {
                                self.postMessage(v);
                            });
                        };
                    }
                });
            };
        } + ')(' + init + ');'], {
            type: "text/javascript"
        });
        var worker = new Worker(window.URL.createObjectURL(blob));
        worker.postMessage(param);
        return worker;
    }

    function createService(func) {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(e) {
            var result = func(e.data);
            Promise.resolve(result).then(function(v) {
                channel.port1.postMessage(v);
            });
        };
        return channel.port2;
    }

    function callThread(worker, param) {
        var promise = new Promise(function(resolve, reject) {
            worker.onmessage = function(e) {
                resolve(e.data);
            };
            worker.onerror = function(e) {
                reject(e.message);
            };
            // setTimeout(function() {
            //     reject();
            // }, 10000);
        });
        worker.postMessage(param);
        return promise;
    }

    function endThread(worker) {
        worker.terminate();
    }
    
    exports.createThread = createThread;
    exports.createService = createService;
    exports.callThread = callThread;
    exports.endThread = endThread;
    
})));
