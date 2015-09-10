# rxjs-plus
RxJS wrapper with common short-hands and predicates

```
Observable.filterIncludes(filterBy)
```
> Filters each item that contains the specified value

```
Observable.filterContains(filterBy)
```
> Alias for filterIncludes

```
Observable.filterNotNull()
```
> Filters values that are not null or undefined

```
Observable.filterNotEmpty()
```
> Filters values that are not 0 or empty string or any JS value that evals to false

```
Observable.mapAdd(addWith)
```
> Uses addition op with the parameter, the parameter will be used last in the operation

```
Observable.mapPreAdd(addWith)
```
> Uses addition op with the parameter, with the parameter first in the operation

```
Observable.filterDash(filterBy)
```
Uses lodash style of filtering
[https://lodash.com/docs#filter](https://lodash.com/docs#filter)

```
Observable.propertyFilter(props, filterBy)
Observable.propertyIncludes(props, filterIncludes)
Observable.propertyContains = propertyIncludes
```
Property filter on stream objects
