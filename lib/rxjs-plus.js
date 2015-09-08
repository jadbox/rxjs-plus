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
rxo.prototype.filterIncludes = function(filterBy) {
	return this.filter(contains(filterBy));
};

// Alias for filterIncludes
rxo.prototype.filterContains = rxo.prototype.filterIncludes;

// Filters values that are not null or undefined
rxo.prototype.filterNotNull = function() {
	return this.filter(function(e) { return e!==null && e!==undefined; } );
};

// Filters values that are not 0 or empty string or any JS value that evals to false
rxo.prototype.filterNotEmpty = function() {
	return this.filter(function(e) { return !!e; } );
};

//rxo.from(["joe", "beth"]).filterIncludes('o').subscribe(console.log);
//rxo.from(["joe", null]).filterNotNull().subscribe(console.log);

module.exports = rxo;