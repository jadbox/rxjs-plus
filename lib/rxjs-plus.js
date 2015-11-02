;
(function(root, factory) {
    var objectTypes = {
        'function': true,
        'object': true
    };

    var root = (objectTypes[typeof window] && window) || this,
        freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports,
        freeModule = objectTypes[typeof module] && module && !module.nodeType && module,
        moduleExports = freeModule && freeModule.exports === freeExports && freeExports,
        freeGlobal = objectTypes[typeof global] && global;

    if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
        root = freeGlobal;
    }

    // Because of build optimizers
    if (typeof define === 'function' && define.amd) {
        define(['rx', 'exports'], function(Rx, exports) {
            root.Rx = root.RxPlus = factory(root, exports, Rx);
            return root.Rx;
        });
    } else if (typeof module == 'object' && module && module.exports == freeExports) {
        module.exports = root.RxPlus = factory(root, module.exports, require('rx'));
    } else {
        root.Rx = root.RxPlus = factory(root, {}, root.Rx);
    }
}(this, function(global, exp, rx, undefined) {
    // Aliases
    //console.log(rx);
    var rxo = rx.Observable,
        rxn = rx.Observable.fromNodeCallback,
        rxed = rx.Observable.from;

    var Observable = rx.Observable;
    var observableProto = Observable.prototype;

    var fs = require('fs');
    var _ = require('lodash-fp');
    var stringify = require('json-stringify-safe'); //TODO: use this
    //    var pr = require('predicate');

    var contains = function contains(val) {
        return function(arr) {
            if (!arr.indexOf) throw new Error("filterIncludes requires value implement indexOf");
            return !!~arr.indexOf(val);
        };
    }

    function pluckerFilter(args, len, filterBy) {
        return function filter(x) {
            var currentProp = x;
            // Ignore first element as its the filter
            for (var i = 0; i < len; i++) {
                var p = currentProp[args[i]];
                if (typeof p !== 'undefined') {
                    currentProp = p;
                } else {
                    return false;
                }
            }
            return filterBy(currentProp);
        };
    }

    observableProto.mapStringReplace = function(whatvar, withvar) {
        return this.map(function(x) {
            return x.replace(whatvar, withvar);
        });
    };

    observableProto.mapSubstring = function(start, end) {
        return this.map(function(x) {
            return x.substring(start, (end < 0) ? x.length + end : end);
        });
    };


    observableProto.filterNotNaN = function() {
        return this.filter(function(x) {
            return !isNaN(x);
        });
    };


    observableProto.mapParseInt = function() {
        return this.map(function(x) {
            return parseInt(x);
        }).filter(function(x) {
            return !isNaN(x);
        });
    }


    /**
     * flatMaps + split
     * @param {seperator} The split seperator
     * @returns {Observable} Returns a new Observable sequence of property values.
     */
    observableProto.flatSplit = function(seperator) {
        return this.flatMap(function(x) {
            return x.split(seperator);
        });
    };

    /**
     * Uses lodash's template to map over the stream
     * @param {template_code} The template code to render
     * @returns {Observable} Returns a new Observable sequence of property values.
     */
    observableProto.mapTemplate = function(template_code) {
        return this.map(function(x) {
            return _.template(x)(template_code)
        });
    };

    /**
     * Replaces the current stream with another observer
     * @param {Observer} The observe to change the stream to
     * @returns {Observable} Returns a new Observable sequence of property values.
     */
    // Not Working
    observableProto.thenUse =
        observableProto.thenObserve =
        observableProto.mapReplace = function(observer) {
            return this.first().flatMap(function(x) {
                return observer;
            });
        };

    /**
     * Uses lodash's _.defaults to create a new object of merge properties
     * @param {obj} The object that will be merged against from the stream. Obj's parameters take precedence.
     * @param {obj2} Optional: The object that will be merged against from the stream. Stream object takes precedence.
     * @returns {Observable} Returns a new Observable sequence of property values.
     * Note: if obj1 is a string, it is used as a key to the stream object and sets the value to obj2.
     */
    observableProto.mapExtend =
        observableProto.mapMerge =
        observableProto.mergeObject =
        observableProto.objectMerge = function(obj, obj2) {
            return this.map(function(x) {
                if (typeof obj === 'string') {
                    x[obj] = obj2;
                } else {
                    return _.defualtsDeep(obj, x, obj2);
                }
            });
        };

    /**
     * Pretty stringifies object or json object in the stream
     * @returns {Observable} Returns a new Observable sequence of property values.
     */
    observableProto.jsonStringify =
        observableProto.mapJsonStringify =
        observableProto.jsonToString = function(serializer, indent) {
            indent = indent || '\t';
            return this.map(function(x) {
                return stringify(x, null, indent); // uses safe method
            });
        };
    /**
     * Json parses stream object
     * @returns {Observable} Returns a new Observable sequence of property values.
     */
    observableProto.jsonParse =
        observableProto.mapJsonParse =
        observableProto.stringToJson = function() {
            return this.map(JSON.parse);
        };

    /**
     * Calls toString() on the stream object
     * @returns {Observable} Returns a new Observable sequence of property values.
     */
    observableProto.mapToString = function() {
        return this.map(function(x) {
            return x.toString();
        });
    };

    /**
     * Switches the subscriber function to error first and data second. The onComplete handler is not used.
     * @param {cb} Function that will be called with the reverse parameters.
     * @returns {Observable} Returns a new Observable sequence of property values.
     */
    observableProto.subscribeAlt = function(cb) {
        var obs = this.catch(function(err) {
            return rxo.just({ error: err });
        }).subscribe(function(data, err) {
            if(data.error) err = data.error;
            cb(err, data);
        });
        return obs;
    };

    /**
     * Filters by using lodash's filtering system
     * @param {filterBy} Function or Object (equals) to filter on
     * @returns {Observable} Returns a new Observable sequence of property values.
     */
    observableProto.whereDash =
        observableProto.filterDash = function(filterBy) {
            //var args = Array.prototype.slice.call(arguments);
            var len = arguments.length,
                args = new Array(len + 1);
            for (var i = 0; i < len; i++) {
                args[i] = arguments[i];
            }
            //args.push(

            return this.filter(function(x) {
                args[len] = [x];
                //console.log( _.filter.apply(_, args) );
                return _.filter.apply(_, args).length !== 0;
            });
        };
    /**
     * Retrieves the value of a specified nested property from all elements in
     * the Observable sequence.
     * @param {Arguments} arguments The nested properties to pluck.
     * @returns {Observable} Returns a new Observable sequence of property values.
     */
    observableProto.propertyFilter = function(props, filterBy) {
        var len = arguments.length - 1,
            args = new Array(len);
        _filterBy = arguments[len];
        if (len === 0) {
            throw new Error('List of properties cannot be empty.');
        }

        if (arguments.length === 1) args = props.split('.');
        else
            for (var i = 0; i < len; i++) {
                args[i] = arguments[i];
            }

        return this.filter(pluckerFilter(args, len, _filterBy));
    };


    // Alias for pluckFilter
    observableProto.filterProperty = observableProto.propertyFilter;

    // Filters each item that contains the specified value
    observableProto.filterIncludes = function(filterBy) {
        return this.filter(contains(filterBy));
    };

    // Alias for filterIncludes
    observableProto.filterContains = observableProto.filterIncludes;

    // Filters values that are not null or undefined
    observableProto.filterNotNull = function() {
        return this.filter(function(e) {
            return e !== null && e !== undefined;
        });
    };

    // Filters values that are not 0 or empty string or any JS value that evals to false
    observableProto.filterNotEmpty = function() {
        return this.filter(function(e) {
            return !!e;
        });
    };

    // Property includes filterBy
    observableProto.propertyContains =
        observableProto.propertyIncludes = function(props, filterBy) {
            var _filterBy = arguments[arguments.length - 1];
            arguments[arguments.length - 1] = contains(_filterBy);
            return this.propertyFilter.apply(this, arguments);
        };

    // Uses addition op with the parameter, the parameter will be used last in the operation
    observableProto.mapAdd = function(addWith) {
        return this.map(function(x) {
            return x + addWith;
        });
    };

    // Uses addition op with the parameter, with the parameter first in the operation
    observableProto.mapPreAdd = function(addWith) {
        return this.map(function(x) {
            return addWith + x;
        });
    };

    //rxo.from(["joe", "beth"]).filterIncludes('o').subscribe(console.log);
    //rxo.from(["joe", null]).filterNotNull().subscribe(console.log);

    rx.plus = {
        contains: contains
    };

    return rx;
}));
