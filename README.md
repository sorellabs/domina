Domina
======

[![Build Status](https://travis-ci.org/killdream/memento.png)](https://travis-ci.org/killdream/memento)
[![Dependencies Status](https://david-dm.org/killdream/memento.png)](https://david-dm.org/killdream/memento)

A functional and modular DOM processing library with three major design goals:

 -  To be *insanely fast*.
 -  To be *overtly composable*.
 -  To be *a joy to use*.

[![browser support](http://ci.testling.com/killdream/memento.png)](http://ci.testling.com/killdream/memento)


## Example

```javascript
var domina = require('domina')(/* CSS selector shim, Events shim */)
```


## Installation

Easy-modo: grab it from NPM:

    $ npm install domina


## Documentation

( ... )


## Tests

    $ npm install -g brofist-browser
    $ make test-browser
    # Open the URL printed to the console in your browser


## Platform support

This library assumes an ES5 environment, but can be easily supported in ES3
platforms by the use of shims. Just include [es5-shim][] :3

[es5-shim]: https://github.com/kriskowal/es5-shim


## Licence

MIT. i.e.: do whatever you please.


