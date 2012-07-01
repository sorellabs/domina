Moros
=====

Moros is a functional and modular DOM processing library. It strives to
keep the overhead minimal, be overtly composable and a joy to use! Oh,
and of course, be *fast* when working with `NodeLists`.


### Example

```coffee
moros = require \moros (Sizzle, require \moros/bridge/bean)

# Everything is curried, so it's easy to create helper functions!
ignore-click = moros.listen \click (ev) -> ev.prevent-default!
hide = moros.set-style \display \none
show = moros.set-style \display \block

# Parameters are ordered as to make the most out of currying
ignore-click moros.query 'a[data-target]'

hide moros.query \.hidden
show moros.query \.active
```


### Requirements and supported platforms

Moros doesn't go to lengths to support ancient and non-standard platforms. Some
of the DOM functionality, where supporting non-standard behaviour is trivial,
has been implemented with cross-platform support, but that's more of an
exception than the rule.

Moros also makes use of ECMAScript 5 features, therefore you'll need to include
the [es5-shim][] library if you plan on supporting older browsers.

If you need to use CSS selectors (`query` and `queryOne`) on older browsers,
you'll need to include a CSS selector engine, like [Sizzle][], [NWMatcher][] or
[Qwery][].

If you need to support events on old browsers, you'll need to include an event
manager, like [Bean][].


### Installation

If you're using [Browserify][] — you really should! — to manage your
dependencies, just grab it from [NPM][]:

```bash
$ npm install -g LiveScript
$ npm install moros
```

Otherwise, [download the latest release][] and include both the Browserify
prelude and the Moros library in your page:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Awesome-sauce!</title>
  </head>
  <body>
    {{ lots of stuff might go here }}
    <script src="/path/to/browserify.js"></script>
    <script src="/path/to/moros.js"></script>
  </body>
</html>
```

In any of the cases above, Moros will be a `require`-able module in your
platform, so you can just use `var moros = require(moros)(SelectorEngine,
EventManager)` to instantiate it.


### Building

If you want to build stuff from the source, you'll need [LiveScript][]. Once
you've got that installed and `Slake` on your path, just run:

```bash
$ git clone git://github.com/killdream/moros.git  # Download the project
$ cd moros                                        # Move to the project folder
$ npm install -d                                  # Initialise the dependencies
$ slake build:all                                 # Run the build tasks
```


### Tests

To run tests, you'll need to build the test specs. You can use `slake test` for
an one-shot test building, or `slake test:continuous` for continuous
rebuilding, which is nicer for hacking on Moros' source itself.

For testing integration with vendor libraries, you'll need to run `slake
deps:vendor` to download the vendor libraries first, then build the test
files.


### Licence

Moros is licensed under the delicious and permissive [MIT][] licence. You can
happily copy, share, modify, sell or whatever — refer to the actual licence
text for `less` information:

```bash
$ less LICENCE.txt
```


[download the latest release]: https://github.com/downloads/killdream/moros/moros-0.3.2.tar.gz

[es5-shim]: https://github.com/kriskowal/es5-shim/
[Sizzle]: http://sizzlejs.com/
[NWMatcher]: http://javascript.nwbox.com/NWMatcher/
[Qwery]: https://github.com/ded/qwery
[Bean]: https://github.com/fat/bean
[Browserify]: https://github.com/substack/node-browserify
[NPM]: http://npmjs.org/
[LiveScript]: http://gkz.github.com/LiveScript/
[MIT]: https://raw.github.com/killdream/moros/master/LICENCE.txt
