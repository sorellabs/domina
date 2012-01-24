var require = function (file, cwd) {
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
require.extensions = [".js",".coffee"];

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
        var y = cwd || '.';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
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
            var pkgfile = x + '/package.json';
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

require.define = function (filename, fn) {
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
            filename
        );
        require.modules[filename]._cached = module_.exports;
        return module_.exports;
    };
};

if (typeof process === 'undefined') process = {};

if (!process.nextTick) process.nextTick = (function () {
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

if (!process.title) process.title = 'browser';

if (!process.binding) process.binding = function (name) {
    if (name === 'evals') return require('vm')
    else throw new Error('No such module')
};

if (!process.cwd) process.cwd = function () { return '.' };

require.define("path", function (require, module, exports, __dirname, __filename) {
function filter (xs, fn) {
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

require.define("/dom/index.js", function (require, module, exports, __dirname, __filename) {
/// index.js --- The basics of DOM manipulation
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

/// Package moros.dom
exports.manipulation = require('./manipulation')
exports.reflection   = require('./reflection')
});

require.define("/dom/manipulation.js", function (require, module, exports, __dirname, __filename) {
/// manipulation.js --- Manipulates DOOM elements
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

/// Module moros.manipulation


//// Function append
// append! :: parent:Node*, Node* -> parent
function append(parent, node) {
  parent.appendChild(node)
  return parent }

//// Function prepend
// prepend! :: parent:Node*, Node* -> parent
function prepend(parent, node) {
  return parent.firstChild?  insert_before(parent.firstChild, node)
  :      /* otherwise */     append(parent, node) }

//// Function insert_before
// insert_before! :: node:Node*, Node* -> node
function insert_before(node, insert) {

  node.parentNode.insertBefore(insert, node)
  return node }

//// Function insert_after
// insert_after! :: node:Node*, Node* -> node
function insert_after(node, insert) {
  node.parentNode.insertBefore(insert, node.nextSibling)
  return node }

//// Function remove
// remove! :: parent:Node*, Node* -> parent
function remove(parent, node) {
  parent.removeChild(node)
  return parent }

//// Function detach
// detach! :: node:Node* -> node
function detach(node) {
  node.parentNode.removeChild(node)
  return node }

//// Function replace
// replace! :: node:Node*, Node* -> node
function replace(node, replacement) {
  node.parentNode.replaceChild(node, replacement)
  return node }

//// Function wrap
// wrap! :: node:Node*, wrapper:Node* -> node
function wrap(node, wrapper) {
  insert_before(node, wrapper)
  wrapper.appendChild(node)
  return node }

//// Function clear
// clear! :: node:Node* -> node
function clear(node) {
  while (node.firstChild)
    node.removeChild(node.firstChild)
  return node }

//// Function clone
// clone! :: node:Node, deep:Bool? -> node
function clone(node, deep) {
  return node.cloneNode(deep) }



//// - Exports ----------------------------------------------------------------
module.exports = { append        : append
                 , prepend       : prepend
                 , insert_before : insert_before
                 , insert_after  : insert_after
                 , remove        : remove
                 , detach        : detach
                 , replace       : replace
                 , clear         : clear
                 , wrap          : wrap
                 , clone         : clone
                 }
});

require.define("/dom/reflection.js", function (require, module, exports, __dirname, __filename) {
/// reflection.js --- Provides information about nodes.
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

/// Module moros.dom.reflection


//// - Aliases ----------------------------------------------------------------
var slice = [].slice



//// - Feature detection ------------------------------------------------------
var TEXT
void function() {
  var Element = document.createElement('div')

  // Check what kind of plain text representation of an Element is
  // supported by the platform. `innerText` is the de-facto standard,
  // and implemented everywhere. Mozilla still goes *only* for the
  // de-juri `textContent`.
  TEXT = 'innerText' in Element?            'innerText'
       : /* likely Gecko-based browsers */  'textContent'
}()



//// - Node introspection -----------------------------------------------------

///// Function attributes
// Returns the attributes set for an `Element'.
//
// attributes :: Element -> [Attribute]
function attributes(node) {
  return slice.call(node.attributes) }


///// Function attribute
// Returns the value of the attribute with the given `key'.
//
// attribute :: Element, String -> Maybe String
function attribute(node, key) {
  var value = node.getAttribute(key)
  return value == null?   void value
  :      /* otherwise */  value }


///// Function attribute_set
// Changes the value of the attribute for the given `key'.
//
// If the given value is `nil', the attribute is removed instead.
//
// attribute_set! :: Element*, String, String? -> element
function attribute_set(node, key, value) {
  value == null?     node.removeAttribute(key)
  : /* otherwise */  node.setAttribute(key, value)

  return node }


///// Function text
// Returns the content of the node as plain text, with HTML tags
// stripped.
//
// text :: Element -> String
function text(node) {
  return node[TEXT] }


///// Function text_set
// Changes the content of the node to hold a single text node with the
// given value.
//
// text_set! :: element:Element*, String -> element
function text_set(node, value) {
  node[TEXT] = value
  return node }


///// Function html
// Returns the contents of the node as a serialised HTML representation.
//
// html :: Element -> String
function html(node) {
  return node.innerHTML }


///// Function html_set
// Replaces the node's children structure by one constructed from the
// given serialised HTML.
//
// html_set! :: element:Element*, String -> element
function html_set(node, value) {
  node.innerHTML = value
  return node }



//// - Exports ----------------------------------------------------------------
module.exports = { attributes    : attributes
                 , attribute     : attribute
                 , attribute_set : attribute_set
                 , text          : text
                 , text_set      : text_set
                 , html          : html
                 , html_set      : html_set

                 , internal      : { TEXT: TEXT }
                 }
});

require.define("/builder.js", function (require, module, exports, __dirname, __filename) {
/// builder.js --- Functional DOOM builder
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

// :TODO:
//   - Rewrite `extend' as a pure function.

/// Module moros.builder

//// - Aliases ----------------------------------------------------------------
var keys     = Object.keys
var class_of = {}.toString



//// - Internal interfaces ----------------------------------------------------

///// Interface Properties
// Defines attributes that should be set in an `Element`.
//
// Properties :: { String -> String
//                         | () -> String }


//// - Data -------------------------------------------------------------------

///// Object html
// Namespace for all the HTML builder functions.
var html     = {}

///// Object defaults
// Namespace for default properties to be set when an object is
// created.
//
// defaults :: {tag:String -> { property:String -> value:String }}
var defaults = {}

///// Data tags
// List of tags we know about, and that'll be available as builder
// functions on the `html' namespace.
//
// from: http://dev.w3.org/html5/spec-author-view/index.html
var tags =
         ( 'a abbr address area article aside audio audio b base bdi bdo    '
         + 'blockquote body br button canvas caption cite code col colgroup '
         + 'command datalist dd del details dfn div dl dt em embed fieldset '
         + 'figcaption figure footer form h1 h2 h3 h4 h5 h6 head header     '
         + 'hgroup hr html i iframe img input ins kbd keygen label legend   '
         + 'li link map mark menu meta meter nav noscript object ol         '
         + 'optgroup option output p param pre progress q rp rt ruby        '
         + 's samp script section select small source span strong style     '
         + 'sub summary sup table tbody td textarea tfoot th thead          '
         + 'time title tr track u ul var video wbr                          '
         ).split(/\s+/)




//// - Helper functions -------------------------------------------------------

///// Function node_p
// Checks if the `subject' is a `Node`.
//
// element_p :: Any -> Bool
function node_p(subject) {
  return 'nodeType' in Object(subject) }


///// Function sequence_p
// Checks if the `subject' is a sequence (/array-like/) object.
//
// sequence_p :: Any -> Bool
function sequence_p(subject) {
  return subject
  &&     'length' in Object(subject) }


///// Function callable_p
// Checks if the `subject' can behave as a function (has `[[Call]]`).
//
// callable_p :: Any -> Bool
function callable_p(subject) {
  return typeof subject == 'function' }


///// Function obj_p
// Checks if the `subject' is an `Object`.
//
// obj_p :: Any -> Bool
function obj_p(subject) {
  return class_of.call(subject) == '[object Object]' }


///// Function set_props
// Sets the properties described by a plain object in the `Element`.
//
// set-props! :: element:Element*, Object -> element
function set_props(elm, props) {
  keys(props || {}).forEach(function(key) {
    elm.setAttribute(key, props[key]) })
  return elm }


///// Function extend
// Copies properties from the `source' object to `target'.
//
// extend! :: target:Object*, Properties -> target
function extend(target, source) {
  keys(source || {}).forEach(function(key) {
    var value = source[key]
    return key in target?      target[key]
    :      callable_p(value)?  target[key] = value()
    :      /* otherwise */     target[key] = value })

  return target }


///// Function append_children
// Appends a list of nodes to the `Element`.
//
// append-children! :: element:Element*, [Any] -> element
function append_children(elm, children) {
  var i, len
  for (i = 0, len = children.length; i < len; ++i) {
    elm.appendChild(make_node(children[i])) }
  return elm }




//// - DOM builders -----------------------------------------------------------

///// Function text
// Creates a `TextNode`.
//
// text :: String -> Node
function text(value) {
  return document.createTextNode(value) }


///// Function make_node
// Ensures the `subject' is a `Node`, creating a `TextNode` if needed.
//
// make-node :: Element -> Element
// make-node :: Any     -> Node
function make_node(subject) {
  return node_p(subject)?   subject
  :      /* otherwise */    text(subject) }


///// Function make_element
// Constructs a brand new `Element` with the `tag'name  and given
// `children'.
//
// make-element :: String, Properties, [Any] -> Element
function make_element(tag, props, children) {
  var elm
  elm = document.createElement(tag)
  set_props(elm, props)
  append_children(elm, children)
  return elm }


///// Function make_builder
// Constructs an `Element` builder for the given `tag'name.
//
// :warning: side-effects
//    This function will also add the created builder to the `html`
//    namespace. If you don't want that, you'll need to build your own
//    abstraction on top of `make_element`.
//
// make-builder! :: String -> Properties?, Any... -> Element
tags.forEach(make_builder)
function make_builder(tag) {
  html[tag] = function Element(props) {
    var children
    children = [].slice.call(arguments, 1)
    if (!obj_p(props))  children.unshift(props), props = {}

    return make_element(tag, extend(props, defaults[tag]), children) }}



//// -Exports
//// ------------------------------------------------------------------
module.exports = { defaults     : defaults
                 , html         : html
                 , text         : text
                 , make_node    : make_node
                 , make_element : make_element
                 , make_builder : make_builder

                 , internals    : { node_p:          node_p
                                  , sequence_p:      sequence_p
                                  , callable_p:      callable_p
                                  , obj_p:           obj_p
                                  , set_props:       set_props
                                  , append_children: append_children }
                 }

});

require.define("/moros.js", function (require, module, exports, __dirname, __filename) {
    /// moros.js --- Main interface for Browsers.
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

/// Module moros
module.exports = { dom: require('./dom')
                 , builder: require('./builder')
                 }
});
require("/moros.js");
