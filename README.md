# rxjs-plus
RxJS wrapper with common short-hands and predicates

// Filters each item that contains the specified value
observableProto.filterIncludes(filterBy);

// Alias for filterIncludes
observableProto.filterContains = rxo.prototype.filterIncludes;

// Filters values that are not null or undefined
observableProto.filterNotNull()

// Filters values that are not 0 or empty string or any JS value that evals to false
observableProto.filterNotEmpty()

// Uses addition op with the parameter, the parameter will be used last in the operation
observableProto.mapAdd = function(addWith)

// Uses addition op with the parameter, with the parameter first in the operation
observableProto.mapPreAdd = function(addWith)
