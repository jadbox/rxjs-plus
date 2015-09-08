# rxjs-plus
RxJS wrapper with common short-hands and predicates

// Filters each item that contains the specified value
Observable.prototype.filterIncludes(filterBy);

// Alias for filterIncludes
Observable.prototype.filterContains = rxo.prototype.filterIncludes;

// Filters values that are not null or undefined
Observable.prototype.filterNotNull()

// Filters values that are not 0 or empty string or any JS value that evals to false
Observable.prototype.filterNotEmpty()
