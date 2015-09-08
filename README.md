# rxjs-plus
RxJS wrapper with common short-hands and predicates

// Filters each item that contains the specified value
```
Observable.filterIncludes(filterBy)
```
// Alias for filterIncludes
```
Observable.filterContains(filterBy)
```
// Filters values that are not null or undefined
```
Observable.filterNotNull()
```
// Filters values that are not 0 or empty string or any JS value that evals to false
```
Observable.filterNotEmpty()
```
// Uses addition op with the parameter, the parameter will be used last in the operation
```
Observable.mapAdd(addWith)
```
// Uses addition op with the parameter, with the parameter first in the operation
```
Observable.mapPreAdd(addWith)
```
