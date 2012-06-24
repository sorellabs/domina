(function(){var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var res = mod._cached ? mod._cached : mod();
    return res;
}

require.paths = [];
require.modules = {};
require.extensions = [".js",".coffee",".ls"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (require._core[x]) return x;
        var path = require.modules.path();
        cwd = path.resolve('/', cwd);
        var y = cwd || '/';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            x = path.normalize(x);
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = path.normalize(x + '/package.json');
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = (Object.keys || function (obj) {
        var res = [];
        for (var key in obj) res.push(key)
        return res;
    })(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

(function () {
    var process = {};
    
    require.define = function (filename, fn) {
        if (require.modules.__browserify_process) {
            process = require.modules.__browserify_process();
        }
        
        var dirname = require._core[filename]
            ? ''
            : require.modules.path().dirname(filename)
        ;
        
        var require_ = function (file) {
            return require(file, dirname)
        };
        require_.resolve = function (name) {
            return require.resolve(name, dirname);
        };
        require_.modules = require.modules;
        require_.define = require.define;
        var module_ = { exports : {} };
        
        require.modules[filename] = function () {
            require.modules[filename]._cached = module_.exports;
            fn.call(
                module_.exports,
                require_,
                module_,
                module_.exports,
                dirname,
                filename,
                process
            );
            require.modules[filename]._cached = module_.exports;
            return module_.exports;
        };
    };
})();


require.define("path",function(require,module,exports,__dirname,__filename,process){function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};
});

require.define("__browserify_process",function(require,module,exports,__dirname,__filename,process){var process = module.exports = {};

process.nextTick = (function () {
    var queue = [];
    var canPost = typeof window !== 'undefined'
        && window.postMessage && window.addEventListener
    ;
    
    if (canPost) {
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'browserify-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);
    }
    
    return function (fn) {
        if (canPost) {
            queue.push(fn);
            window.postMessage('browserify-tick', '*');
        }
        else setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    if (name === 'evals') return (require)('vm')
    else throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    process.cwd = function () { return cwd };
    process.chdir = function (dir) {
        if (!path) path = require('path');
        cwd = path.resolve(dir, cwd);
    };
})();
});

require.define("/moros/test/utils.ls",function(require,module,exports,__dirname,__filename,process){var __multiply = __curry(function(x, y){ return x * y; });
Describe('{} utils', function(){
  var each, map, ensure, ys, spy, __ref;
  __ref = require('moros/src/utils'), each = __ref.each, map = __ref.map;
  ensure = require('noire').ensure;
  spy = ys = null;
  beforeEach(function(){
    spy = sinon.spy();
    return ys = document.getElementById('xs').childNodes;
  });
  Describe('λ each', function(){
    It('Should curry the arguments.', function(){
      ensure(each(function(){})).type('function');
      return ensure(each(function(){}, [1])).equals([1]);
    });
    It('Should treat non-sequences as a singleton sequence.', function(){
      each(spy, 1);
      return ensure(spy).property('calledOnce').ok();
    });
    It('Should apply the iteratee to each item in the sequence.', function(){
      each(spy, [1, 2, 3]);
      ensure(spy).property('callCount').same(3);
      ensure(spy.calledWith([1])).ok;
      ensure(spy.calledWith([2])).ok;
      return ensure(spy.calledWith([3])).ok;
    });
    return It('Should return the original sequence.', function(){
      var xs;
      xs = [1, 2, 3];
      ensure(each(spy, spy)).same(spy);
      ensure(each(function(){}, xs)).same(xs);
      return ensure(each(function(){}, ys)).same(ys);
    });
  });
  return Describe('λ map', function(){
    It('Should curry the arguments.', function(){
      ensure(map(function(){})).type('function');
      return ensure(map(function(x){
        return x;
      }, [1])).equals([1]);
    });
    It('Should treat non-sequences as a singleton sequence.', function(){
      return ensure(map(function(x){
        return x;
      }, 1)).equals([1]);
    });
    return It('Should return an array with each item mapped by the functor.', function(){
      ensure(map(__multiply(2), [1, 2, 3])).equals([2, 4, 6]);
      return ensure(map(function(x){
        return x.nodeName;
      }, ys)).equals(['#text', 'A', 'IMG', 'IMG', 'DIV', '#text']);
    });
  });
});
function __curry(f, args){
  return f.length > 1 ? function(){
    var params = args ? args.concat() : [];
    return params.push.apply(params, arguments) < f.length && arguments.length ?
      __curry.call(this, f, params) : f.apply(this, params);
  } : f;
}});

require.define("/moros/node_modules/moros/src/utils.ls",function(require,module,exports,__dirname,__filename,process){/** utils.ls --- Shared utilities
 *
 * Version: -:package.version:-
 *
 * Copyright (c) 2012 Quildreen Motta
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var id, k, head, tail, sequenceP, asSequence, toArray, each, map;
id = function(x){
  return x;
};
k = function(x){
  return function(){
    return x;
  };
};
head = function(xs){
  return xs[0];
};
tail = function(xs){
  return xs.slice(1);
};
sequenceP = function(x){
  return x && x.length >= 0;
};
asSequence = function(x){
  switch (false) {
  case !sequenceP(x):
    return x;
  default:
    return [x];
  }
};
toArray = Function.call.bind([].slice);
each = __curry(function(f, xs){
  var i, x, __len;
  xs = asSequence(xs);
  for (i = 0, __len = xs.length; i < __len; ++i) {
    x = xs[i];
    f(x);
  }
  return xs;
});
map = __curry(function(f, xs){
  var x, __i, __ref, __len, __results = [];
  for (__i = 0, __len = (__ref = asSequence(xs)).length; __i < __len; ++__i) {
    x = __ref[__i];
    __results.push(f(x));
  }
  return __results;
});
module.exports = {
  asSequence: asSequence,
  toArray: toArray,
  head: head,
  tail: tail,
  id: id,
  k: k,
  each: each,
  map: map
};
function __curry(f, args){
  return f.length > 1 ? function(){
    var params = args ? args.concat() : [];
    return params.push.apply(params, arguments) < f.length && arguments.length ?
      __curry.call(this, f, params) : f.apply(this, params);
  } : f;
}});

require.define("/moros/node_modules/noire/package.json",function(require,module,exports,__dirname,__filename,process){module.exports = {"main":"./src/index.js"}});

require.define("/moros/node_modules/noire/src/index.js",function(require,module,exports,__dirname,__filename,process){require('./matchers')

module.exports = require('./core')
});

require.define("/moros/node_modules/noire/src/matchers.js",function(require,module,exports,__dirname,__filename,process){/// matchers.js --- Common matchers
//
// Copyright (c) 2012 Quildreen Motta
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var Assertion = require('./core').Assertion

var array_p   = Array.isArray
var keys      = Object.keys
var slice     = [].slice.call.bind([].slice)

function class_of(subject) {
  return {}.toString.call(subject).slice(8, -1) }

function all(xs, f, idx) {
  return slice(xs, idx || 0).every(f) }

function class_p(cls) {
  return all(arguments, function(o){ return class_of(o) == cls }, 1)}

function type_p(type) {
  return all(arguments, function(o){ return typeof o == type }, 1) }

function arguments_p() {
  return all(arguments, function(o){ return class_of(o) == 'Arguments' })}

function error_p(o) { return o instanceof Error }

function re_p(o){ return class_of(o) == 'RegExp' }

function string_p(o){ return class_of(o) == 'String' }


// Deep strict equality
//
// Based on Node.js's assert module's deepEqual
function deep_equal(actual, expected) {
  return actual === expected
  ||     eq_date(actual, expected)
  ||     eq_regexp(actual, expected)
  ||     eq_abstract(actual, expected)
  ||     eq_object(actual, expected)
  ||     false }

function eq_date(actual, expected) {
  return class_p('Date', actual, expected)
  &&     actual.getTime() === expected.getTime() }

function eq_regexp(actual, expected) {
  return class_p('RegExp', actual, expected)
  &&     actual.source     === expected.source
  &&     actual.global     === expected.global
  &&     actual.multiline  === expected.multiline
  &&     actual.lastIndex  === expected.lastIndex
  &&     actual.ignoreCase === expected.ignoreCase }

function eq_abstract(actual, expected) {
  return !type_p('object', actual, expected)
  &&     actual == expected }

function eq_object(actual, expected) {
  var a, b

  if (actual == null || expected == null)
    return false

  if (actual.prototype !== expected.prototype)
    return false

  if (arguments_p(actual)) {
    if (!arguments_p(expected))  return false
    return deep_equal(slice(actual), slice(expected)) }

  try {
    a = keys(actual)
    b = keys(expected) }
  catch(e) {
    return false }

  if (a.length !== b.length)  return false

  a.sort()
  b.sort()
  return a.every(function(k, i){ return k == b[i]                             })
  &&     a.every(function(k, i){ return deep_equal(actual[k], expected[b[i]]) })}




// -- Core matchers --
Assertion.define('equals'
, 'equal {:actual}.'
, function(actual) {
    this.store('actual', actual)
    this.satisfy(function(expected) { return deep_equal(actual, expected) })
})


Assertion.define('same'
, 'be {:actual}.'
, function(actual) {
    this.store('actual', actual)
    this.satisfy(function(expected){ return expected === actual })
})


Assertion.define('exists'
, 'exist.'
, function(value) {
    this.satisfy(function(expected){ return expected !== undefined })
})


Assertion.define('contains'
, 'contain {:value}.'
, function(value) {
    this.store('value', value)
    this.satisfy(function(expected){ return expected.indexOf(value) !== -1 })
})


Assertion.define('ok'
, 'be ok.'
, function() {
    this.satisfy(function(expected){ return !!expected })
})


Assertion.define('empty'
, 'be empty.'
, function() {
    this.satisfy(function(expected){ return array_p(expected)?  expected.length == 0
                                     :      /* otherwise */     keys(expected).length == 0 })
})


Assertion.define(['above', '>']
, 'be above {:value}.'
, function(value) {
    this.store('value', value)
    this.satisfy(function(expected){ return expected > value })
})


Assertion.define(['below', '<']
, 'be below {:value}.'
, function(value) {
    this.store('value', value)
    this.satisfy(function(expected){ return expected < value })
})


Assertion.define('within'
, 'be within {:lower} and {:upper}.'
, function(lower, upper) {
    this.store('lower', lower)
    this.store('upper', upper)
    this.satisfy(function(expected){ return expected >= lower
                                     &&     expected <= upper })
})


Assertion.define('throws'
, 'throw {:error}.'
, function(error) {
    this.store('error', error_p(error)? error.name : error)
    if (!error) this.describe('throw anything.', true)
    this.satisfy(function(expected){ try { expected() }
                                     catch(e) {
                                       return !error?           true
                                       :      string_p(error)?  error == e.name
                                       :      error_p(error)?   error.name == e.name
                                       :      re_p(error)?      error.test(e.name)
                                       :      /* otherwise */   deep_equal(error, e) }})
})


Assertion.define('type'
, 'have type {:type}, got {:actual-type} instead.'
, function(type) {
    this.store('type', type)
    this.satisfy(function(expected){ var actual = /^[A-Z]/.test(type)?  class_of(expected)
                                                : /* otherwise */       typeof expected
                                     this.store('actual-type', actual)
                                     return type === actual }.bind(this))
})


Assertion.define('matches'
, 'match the regular expression {:re}.'
, function(re) {
    this.store('re', re.toString())
    this.satisfy(function(expected) { return re.test(expected) })})});

require.define("/moros/node_modules/noire/src/core.js",function(require,module,exports,__dirname,__filename,process){/// core.js --- The core of Noire assertions
//
// Copyright (c) 2012 Quildreen Motta
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var Base = require('boo').Base
var array_p = Array.isArray
var slice   = [].slice


var Assertion = Base.derive({
  init:
  function _init(value) {
    this._prelude     = 'to'
    this._message     = ''
    this._params      = {}
    this._times       = 100

    return this.expect(value) }


, store:
  function _store(key, value) {
    this._params[key] = value
    return this }


, expect:
  function _expect(value) {
    this._expectation = value
    this.store('expected', value)
    return this }


, describe:
  function _describe(message, overwrite) {
    if (this._message && !overwrite) return this

    this._message = message
    return this }


, message:
  function _message() {
    return format( 'Expected {:expected} ' + this._prelude + ' ' + this._message
                 , this._params )}


, define:
  function _define(name, description, property) {
    var matcher = function() { this.describe(description)
                               property.apply(this, arguments)
                               return this }

    name = array_p(name)?   name
         : /* otherwise */  [name]
    name.forEach(function(key){ this[key] = matcher }, this) }


, satisfy:
  function _satisfy(property) {
    this.store('‹satisfy:property›', property)
    this.describe('satisfy {:‹satisfy:property›}.')

    if (!this._test(property, this._expectation))
      throw make_error(this.message())

    return this }


, _test:
  function _test(property) {
    return property.apply(null, slice.call(arguments, 1)) }


, not:
  function _not() {
    var test = this._test

    this._prelude += ' not'
    this._test = function(){ return !test.apply(this, arguments) }
    return this }


, invoke:
  function _invoke(method) {
    var args = [].slice.call(arguments, 1)
    this.store('‹invoke:method›', method)
    this.store('‹invoke:args›', args)
    this._prelude = ', when invoking method {:‹invoke:method›} with '
                  + '{:‹invoke:args›} ' + this._prelude
    var test = this._test
    this._test = function(p){ this._expectation = this._expectation[method].apply(this._expectation, args)
                              this._message += ' Yielded {:‹invoke:result›} instead.'
                              this.store('‹invoke:result›', this._expectation)
                              return test.call(this, p, this._expectation) }
    return this }


, property:
  function _property(name) {
    this.store('‹property:name›', name)
    this._prelude += ' yield a value for the property {:‹property:name›} that should'
    var test = this._test
    this._test = function(p){ this._expectation = this._expectation[name]
                              this._message += ' Got {:‹property:actual›} instead.'
                              this.store('‹property:actual›', this._expectation)
                              return test.call(this, p, this._expectation) }
    return this }


, all:
  function _all(generators) {
    var test   = this._test
    this._test = random_property_test
    return this

    function random_property_test(prop, expectation) {
      var ok    = true
      var times = 0
      var args, value

      while (ok && times++ < this._times) {
        args  = generators.map(function(v){ return v() })
        value = expectation.apply(null, args)
        ok    = test(prop, value) }

      this.store('‹all:times›', times)
      this.store('‹all:args›', args)
      this.store('‹all:result›', value)
      this._prelude  = ', given the arguments {:‹all:args›}, '
                     + this._prelude + ' yield values that should'
      this._message += '  Failed after {:‹all:times›} test(s) by yielding {:‹all:result›}'
      return ok }}
})


///// Function starts_with_p
// Does the `string' start with a given piece of text?
//
// starts_with_p :: String, String -> Bool
function starts_with_p(string, what) {
  return string.slice(0, what.length) == what }


///// Function format
// Evaluates a template, substituting the variables with respect to the
// environment provided by the given `mappings'.
//
// If a mapping is not given, we assume it to be empty, in which case
// the template variables are simply stripped away.
//
// A template variable is a special construct in the form:
//
//     :bnf:
//     <template-variable> ::= "{:" <any but "}"> "}"
//
// For example, provide a "Hello, world!" template, that adjusts to a
// given name, one could write:
//
//     format("Hello, {:subject}!", { subject: "world" })
//     // => "Hello, world!"
//
// A template variable can be escaped by placing a backslash between the
// open-curly braces and the colon, such that the construct would be
// output verbatim:
//
//     // Remember backslashes must be escaped inside Strings.
//     format("Hello, {\\:subject}", { subject: "world" })
//     // => "Hello, {\\:subject}"
//
//
// format :: String, { String -> String | (String... -> String) } -> String
function format(string, mappings) {
  mappings = mappings || {}
  return string.replace(/{(\\?:)([^}]+)}/g, resolve_identifier)

  function resolve_identifier(match, mod, key) {
    return starts_with_p(mod, '\\')?  '{:' + key + '}'
    :      key in mappings?           stringify(mappings[key])
    :      /* otherwise */            '' }}

function stringify(o) {
  return typeof o == 'function'?    o.name?          '[Function: ' + o.name + ']'
                                  : /* otherwise */  '`' + o.toString() + '`'
  :      /* otherwise */          JSON.stringify(o) }

function make_error(message) {
  var e = Error.call(Object.create(Error.prototype), message)
  e.name = 'AssertionError'
  return e }


function ensure(value) {
  return Assertion.make(value) }


module.exports = { ensure: ensure
                 , Assertion: Assertion

                 , internal: { make_error: make_error }
                 }});

require.define("/node_modules/boo/package.json",function(require,module,exports,__dirname,__filename,process){module.exports = {"main":"./src/boo.js"}});

require.define("/node_modules/boo/src/boo.js",function(require,module,exports,__dirname,__filename,process){/// boo.js --- Prototypical utilities
//
// Copyright (c) 2011 Quildreen Motta
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/// Module boo
void function(root, exports) {
  var slice   = [].slice
    , keys    = Object.keys
    , inherit = Object.create


  
  //// - Interfaces -----------------------------------------------------------

  ///// Interface DataObject
  // :: { "to_data" -> () -> Object }


  
  //// - Helpers --------------------------------------------------------------

  ///// Function data_obj_p
  // :internal:
  // Checks if the given subject matches the DataObject interface
  //
  // data_obj_p :: Any -> Bool
  function data_obj_p(subject) {
    return subject != null
    &&     typeof subject.to_data == 'function' }


  ///// Function resolve_mixins
  // :internal:
  // Returns the proper mixin for the given object.
  //
  // resolve_mixin :: Object -> Object
  function resolve_mixin(object) {
    return data_obj_p(object)?  object.to_data()
    :                           object }


  ///// Function fast_extend
  // :internal:
  // Extends the target object with the provided mixins, using a
  // right-most precedence rule — when a there's a property conflict, the
  // property defined in the last object wins.
  //
  // `DataObject's are properly handled by the `resolve_mixin'
  // function.
  //
  // :warning: low-level
  //    This function is not meant to be called directly from end-user
  //    code, use the `extend' function instead.
  //
  // fast_extend :: Object, [Object | DataObject] -> Object
  function fast_extend(object, mixins) {
    var i, j, len, mixin, props, key
    for (i = 0, len = mixins.length; i < len; ++i) {
      mixin = resolve_mixin(mixins[i])
      props = keys(mixin)
      for (j = props.length; j--;) {
        key         = props[j]
        object[key] = mixin[key] }}

    return object }


  
  //// - Basic primitives -----------------------------------------------------

  ///// Function extend
  // Extends the target object with the provided mixins, using a
  // right-most precedence rule.
  //
  // :see-also:
  //   - `fast_extend' — lower level function.
  //   - `merge'       — pure version.
  //
  // extend :: Object, (Object | DataObject)... -> Object
  function extend(target) {
    return fast_extend(target, slice.call(arguments, 1)) }


  ///// Function merge
  // Creates a new object that merges the provided mixins, using a
  // right-most precedence rule.
  //
  // :see-also:
  //   - `extend' — impure version.
  //
  // merge :: (Object | DataObject)... -> Object
  function merge() {
    return fast_extend({}, arguments) }

  ///// Function derive
  // Creates a new object inheriting from the given prototype and extends
  // the new instance with the provided mixins.
  //
  // derive :: Object, (Object | DataObject)... -> Object
  function derive(proto) {
    return fast_extend(inherit(proto), slice.call(arguments, 1)) }


  
  //// - Root object ----------------------------------------------------------

  ///// Object Base
  // The root object for basing all the OOP code. Provides the previous
  // primitive combinators in an easy and OOP-way.
  var Base = {

    ////// Function make
    // Constructs new instances of the object the function is being
    // applied to.
    //
    // If the object provides an ``init`` function, that function is
    // invoked to do initialisation on the new instance.
    //
    // make :: Any... -> Object
    make:
    function _make() {
      var result = inherit(this)
      if (typeof result.init == 'function')
        result.init.apply(result, arguments)

      return result }

    ////// Function derive
    // Constructs a new object that inherits from the object this function
    // is being applied to, and extends it with the provided mixins.
    //
    // derive :: (Object | DataObject)... -> Object
  , derive:
    function _derive() {
      return fast_extend(inherit(this), arguments) }}


  
  //// - Exports --------------------------------------------------------------
  exports.extend   = extend
  exports.merge    = merge
  exports.derive   = derive
  exports.Base     = Base
  exports.internal = { data_obj_p    : data_obj_p
                     , fast_extend   : fast_extend
                     , resolve_mixin : resolve_mixin
                     }

}
( this
, typeof exports == 'undefined'? this.boo = this.boo || {}
  /* otherwise, yay modules! */: exports
)});

require.define("/moros/test/query.ls",function(require,module,exports,__dirname,__filename,process){var ensure, selectors, testSet, testSingle;
ensure = require('noire').ensure;
window.require = require;
selectors = {
  '#xs *': 5,
  '#xs a': 2,
  '#xs a[data-boo]': 0,
  '#xs img[data-boo="1"]': 1,
  '#xs img[data-boo="2"]': 0,
  '#xs div[class~="y"]': 1,
  '#xs div[class~="a"]': 0,
  '#xs img[src^="bl"]': 2,
  '#xs img[src^="ah"]': 0,
  '#xs img[src$="ah"]': 1,
  '#xs img[src$="bl"]': 0,
  '#xs img[src*="la"]': 1,
  '#xs img[src*="gb"]': 0,
  '#xs a[lang|="en"]': 1,
  '#xs > a[lang|="pt"]': 0
};
testSet = __curry(function(ensure, query){
  var pattern, len, __ref, __results = [];
  for (pattern in __ref = selectors) {
    len = __ref[pattern];
    __results.push(ensure(query(pattern)).property('length').same(len));
  }
  return __results;
});
testSingle = __curry(function(ensure, query){
  var pattern, len, assertion, __ref, __results = [];
  for (pattern in __ref = selectors) {
    len = __ref[pattern];
    assertion = ensure(query(pattern));
    if (!len) {
      assertion = assertion.not();
    }
    __results.push(assertion.ok());
  }
  return __results;
});
Describe('{} query <Native>', function(){
  var query, queryOne, __ref;
  __ref = require('moros/src/query')(), query = __ref.query, queryOne = __ref.queryOne;
  Describe('λ query', function(){
    It('Should return a set of elements.', function(){
      ensure(query('a')).type('Array');
      ensure(query('html')).type('Array');
      return ensure(query('*')).type('Array');
    });
    It('Should select elements using CSS selectors.', function(){
      return testSet(ensure, query);
    });
    return It('Given a context, should return only elements descending from that context.', function(){
      return ensure(query('div', document.getElementById('xs'))).property('length').same(1);
    });
  });
  return Describe('λ query-one', function(){
    It('Should return a single element.', function(){
      ensure(queryOne('a')).type('HTMLAnchorElement');
      ensure(queryOne('html')).type('HTMLHtmlElement');
      return ensure(queryOne('*')).type('HTMLHtmlElement');
    });
    It('Should select elements using CSS selectors.', function(){
      return testSingle(ensure, queryOne);
    });
    return It('Given a context, should return only elements descending from that context.', function(){
      return ensure(queryOne('a', document.getElementById('xs')).getAttribute('lang')).same('en-gb');
    });
  });
});
function __curry(f, args){
  return f.length > 1 ? function(){
    var params = args ? args.concat() : [];
    return params.push.apply(params, arguments) < f.length && arguments.length ?
      __curry.call(this, f, params) : f.apply(this, params);
  } : f;
}});

require.define("/moros/node_modules/moros/src/query.ls",function(require,module,exports,__dirname,__filename,process){/** query.ls --- Selects a set of nodes using CSS selectors
 *
 * Version: -:package.version:-
 *
 * Copyright (c) 2012 Quildreen Motta
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
module.exports = function(engine){
  var head, toArray, query, queryOne;
  head = require('./utils').head;
  toArray = Function.call.bind([].slice);
  query = function(selector, context){
    context == null && (context = document);
    return toArray(context.querySelectorAll(selector));
  };
  queryOne = function(selector, context){
    context == null && (context = document);
    return context.querySelector(selector);
  };
  if (engine) {
    return {
      query: engine,
      queryOne: function(selector, context){
        return head(engine(selector, context));
      }
    };
  } else {
    return {
      query: query,
      queryOne: queryOne
    };
  }
};});

require.define("/moros/test/browser/suite.ls",function(require,module,exports,__dirname,__filename,process){var __ref;
__ref = typeof global != 'undefined' && global !== null ? global : window;
__ref.Describe = describe;
__ref.It = it;
require('../utils');
require('../query');});
require("/moros/test/browser/suite.ls");
})();
