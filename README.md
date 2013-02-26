Moros
=====

Moros is a functional and modular DOM processing library. It strives to
keep the overhead minimal, be overtly composable and a joy to use! Oh,
and of course, be *insanely fast* when working with `NodeLists`.


### Example

```javascript
// You can either specify query/event engines for compatibility,
// or use the browser's default:
var queryEngine = require('moros/bridge/sizzle')
var eventEngine = require('moros/bridge/bean')
var moros = require('moros')(queryEngine, eventEngine)

// Everything is curried, so it's easy to create helper functions:
var ignoreClick = moros.listen('click', function(ev){ ev.preventDefault() })
var hide = moros.setStyle('display', 'none')
var show = moros.setStyle('display', 'block')

// Parameters are ordered as to make most out of currying:
ignoreClick(moros.query('a[href^="#"]'))

hide(moros.query('.hidden'))
show(moros.query('.active'))
```


### Installation

Moros is distributed as a CommonJS package through NPM, if you're already using
CommonJS modules in your application (and you should!), just do a single
command install:

```bash
$ npm install moros
```

Otherwise, you'll need to [download the latest release][] and include both
`browserify.js` and `moros.js` in your application:

```html
( ... )
<script src="browserify.js"></script>
<script src="moros.js"></script>
<script src="you-app.js"></script>
</body>
( ... )
```

### Supported platforms

Moros depend on ES5 features, but those can be easily shimmable if you need to
support older browsers. Loading [es5-shim][] does everything you need.

Also note that Moros does not ship with any particular selector engine shim, or
event manager shim, it uses the browser's default implementation, instead, and
allows you to specify a library if you need to target older browsers
(IE8-). The `bridge/` folder contains all you need to use the most popular
options in libraries for CSS selector engines and events.



### Tests

To run tests, you'll need to build the test specs. You can use `slake test` for
an one-shot test building, or `slake test:continuous` for continuous
rebuilding, which is nicer for hacking on Moros' source itself.

For testing integration with vendor libraries, you'll need to run `slake
deps:vendor` to download the vendor libraries first, then build the test
files.


### Licence

MIT. i.e.: do whatever you please.


[download the latest release]: https://github.com/downloads/killdream/moros/moros-0.3.2.tar.gz
[es5-shim]: https://github.com/kriskowal/es5-shim/
