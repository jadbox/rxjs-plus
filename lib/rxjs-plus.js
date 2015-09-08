'strict'
var rx = require('rx'),
	rxo = rx.Observable,
	rxn = rxo.fromNodeCallback, rxed = rxo.from;
var fs = require('fs');
var _ = require('lodash-fp');
var pr = require('predicate');

var contains = function contains (val) {
  return function (arr) {
  	if(!arr.indexOf) throw new Error("filterIncludes requires value implement indexOf");
  	return !!~arr.indexOf(val);
  };
}

// Filters each item that contains the specified value
var filterIncludes = rxo.prototype.filterIncludes = function(filterBy) {
		return this.filter(contains(filterBy));
};

// Alias for filterIncludes
rxo.prototype.filterContains = filterIncludes;

// Filters values that are not null or undefined
rxo.prototype.filterNotNull = function() {
	return this.filter(function(e) { return e!==null && e!==undefined; } );
};

// Filters values that are not 0 or empty string or any JS value that evals to false
rxo.prototype.filterNotEmpty = function() {
	return this.filter(function(e) { return !!e; } );
};

// Uses addition op with the parameter, the parameter will be used last in the operation
rxo.prototype.mapAdd = function(addWith) {
	return this.map(function(x) { return x + addWith; } );
};

// Uses addition op with the parameter, with the parameter first in the operation
rxo.prototype.mapPreAdd = function(addWith) {
	return this.map(function(x) { return addWith + x; } );
};

//rxo.from(["joe", "beth"]).filterIncludes('o').subscribe(console.log);
//rxo.from(["joe", null]).filterNotNull().subscribe(console.log);

module.exports = rxo;