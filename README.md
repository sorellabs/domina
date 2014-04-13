Domina
======

[![Build Status](https://secure.travis-ci.org/robotlolita/domina.png?branch=master)](https://travis-ci.org/robotlolita/domina)
[![NPM version](https://badge.fury.io/js/domina.png)](http://badge.fury.io/js/domina)
[![Dependencies Status](https://david-dm.org/robotlolita/domina.png)](https://david-dm.org/robotlolita/domina)
[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)


A functional and modular DOM processing library with three major design goals:

 -  To be *insanely fast*.
 -  To be *overtly composable*.
 -  To be *a joy to use*.

[![browser support](http://ci.testling.com/robotlolita/domina.png)](http://ci.testling.com/robotlolita/domina)


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


