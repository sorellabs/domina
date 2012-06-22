require.define("/query.js", function (require, module, exports, __dirname, __filename) {
/// query.js --- Querying elements
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

/// Module moros.query

module.exports = function(engine) {
  var to_array = require('./util').slice

  function query_selector_all(selector, context) {
    return to_array((context || document).querySelectorAll(selector)) }

  return { query: engine || query_selector_all }}
});

require.define("/util.js", function (require, module, exports, __dirname, __filename) {
/// util.js --- Shared utilities
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

/// Module moros.utils

var _slice = [].slice

function slice(xs, start, end) {
  return arguments.length == 2?  _slice.call(xs, start)
  :      /* otherwise */         _slice.call(xs, start, end) }

function sequence(x) {
  return x && 'length' in x?  x
  :      /* otherwise */     [x] }

function first(xs) {
  return Object(xs)[0] }

function rest(xs) {
  return slice(xs, 1) }

function id(x) {
  return x }

function k(x) {
  return function() {
           return x }}

function each(xs, f) {
  xs = sequence(xs)
  f  = f || id
  var i, len = xs.length
  for (i = 0; i < len; ++i) f(xs[i], i, xs)
  return xs }

function map(xs, f) {
  xs = sequence(xs)
  f  = f || id
  var i, len = xs.length
  var result = []
  for (i = 0; i < len; ++i) result.push(f(xs[i], i, xs))
  return result }


module.exports = { sequence: sequence
                 , slice: slice
                 , first: first
                 , rest: rest
                 , id: id
                 , k: k
                 , each: each
                 , map:  map }
});

require.define("/manipulation.js", function (require, module, exports, __dirname, __filename) {
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

var _ = require('./util')

//// Function append
// append! :: parent:Node*, [Node]* -> parent
function append(parent, xs) {
  _.each(xs, function(node){ parent.appendChild(node) })
  return parent }

//// Function prepend
// prepend! :: parent:Node*, [Node]* -> parent
function prepend(parent, xs) {
  _.each(xs, function(node){ parent.firstChild?  insert_before(parent.firstChild, node)
                           : /* otherwise */     append(parent, node) })
  return parent }

//// Function insert_before
// insert_before! :: node:Node*, [Node]* -> node
function insert_before(node, xs) {
  _.each(xs, function(insert){ node.parentNode.insertBefore(insert, node) })
  return node }

//// Function insert_after
// insert_after! :: node:Node*, [Node]* -> node
function insert_after(node, xs) {
  _.each(xs, function(insert){ node.parentNode.insertBefore(insert, node.nextSibling) })
  return node }

//// Function remove
// remove! :: parent:Node*, [Node]* -> parent
function remove(parent, xs) {
  _.each(xs, function(node){ parent.removeChild(node) })
  return parent }

//// Function detach
// detach! :: node:[Node]* -> node
function detach(xs) {
  _.each(xs, function(node){ node.parentNode.removeChild(node) })
  return xs }

//// Function replace
// replace! :: node:Node*, [Node]* -> node
function replace(node, xs) {
  node.parent.replaceChild(node, _.first(xs))
  insert_after(_.first(xs), _.rest(xs))
  return node }

//// Function wrap
// wrap! :: node:Node*, wrapper:Node* -> node
function wrap(node, wrapper) {
  insert_before(node, wrapper)
  wrapper.appendChild(node)
  return node }

//// Function clear
// clear! :: node:[Node]* -> node
function clear(xs) {
  _.each(xs, function(node){ while (node.firstChild)
                               node.removeChild(node.firstChild) })
  return xs }

//// Function clone
// clone! :: node:[Node], deep:Bool? -> node
function clone(xs, deep) {
  return _.map(xs, function(node){ return node.cloneNode(deep) })}



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

require.define("/reflection.js", function (require, module, exports, __dirname, __filename) {
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
var _ = require('./util')



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
// attributes :: [Element] -> [[Attribute]]
function attributes(xs) {
  return _.map(xs, function(node){ return _.slice(node.attributes) })}


///// Function attribute
// Returns the value of the attribute with the given `key'.
//
// attribute :: [Element], String -> [Maybe String]
function attribute(xs, key) {
  return _.map(xs, function(node) { var value = node.getAttribute(key)
                                    return value == null?   void value
                                    :      /* otherwise */  value      })}


///// Function attribute_set
// Changes the value of the attribute for the given `key'.
//
// If the given value is `nil', the attribute is removed instead.
//
// attribute_set! :: element:[Element]*, String, String? -> element
function attribute_set(xs, key, value) {
  _.each(xs, function(node){ value == null?   node.removeAttribute(key)
                           : /* otherwise */  node.setAttribute(key, value) })

  return xs }


///// Function text
// Returns the content of the node as plain text, with HTML tags
// stripped.
//
// text :: [Element] -> String
function text(xs) {
  return _.map(xs, function(node){ return node[TEXT] })}


///// Function text_set
// Changes the content of the node to hold a single text node with the
// given value.
//
// text_set! :: element:[Element]*, String -> element
function text_set(xs, value) {
  _.each(xs, function(node){ node[TEXT] = value })
  return xs }


///// Function html
// Returns the contents of the node as a serialised HTML representation.
//
// html :: [Element] -> String
function html(xs) {
  return _.map(xs, function(node){ return node.innerHTML })}


///// Function html_set
// Replaces the node's children structure by one constructed from the
// given serialised HTML.
//
// html_set! :: element:[Element]*, String -> element
function html_set(xs, value) {
  _.each(xs, function(node){ node.innerHTML = value })
  return xs }



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

require.define("/presentation.js", function (require, module, exports, __dirname, __filename) {
/// core.js --- Core visual presentation handling
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

/// Module moros.presentation

var _ = require('./util')

//// - Feature testing/helpers ------------------------------------------------
var Element = document.createElement('div')


// Gets the computed style of an element.
var style_computed = 'currentStyle' in Element?
           /* IE? */ function _style_computed(element) {
                       return element.currentStyle }
                   :
          /* W3C? */ function _style_computed(element, state) {
                       return element.ownerDocument
                                       .defaultView
                                         .getComputedStyle(element, state) }


// Escapes an arbitrary String to be used as a ClassName regular
// expression.
function make_class_re(name) {
  return new RegExp( '\\b'
                   + name.trim()
                         .replace(/([^\w\s])/g, '\\$1')
                         .replace(/\s+/, '|')
                   + '\\b'
                   , 'gi') }


//// - Core visual presentation -----------------------------------------------

///// Function style
// Retrieves the value of the given style's `property', optionally
// forcing them to be computed to reflect the current state of the
// node.
//
// style :: [Element], String, Bool? -> [String]
function style(xs, property, computed) {
  // :TODO:
  //   Needs some interesting and efficient way of handling property
  //   transformations before setting the values.
  return _.map(xs, function(element){ return computed?        style_computed(element)[property]
                                    :        /* otherwise */  element.style[property] })}


///// Function style_set
// Changes the value of the given style's `property' for the `element'.
//
// Since this property is defined at the element's level, it'll take
// precedence over properties defined directly in the CSS (unless
// they're marked as `!important`).
//
// style_set! :: [Element], String, Bool? -> [Element]
function style_set(xs, property, value) {
  _.each(xs, function(element){ element.style[property] = value })
  return xs }


///// Function classes
// Returns a list of all the classes defined for the `element'.
//
// classes :: [Element] -> [[String]]
function classes(xs) {
  return _.map(xs, function(element){ return element.className.trim().split(/\s+/) })}


///// Function classes_add
// Adds a class to the `element'.
//
// classes_add! :: element:[Element]*, String -> element
function classes_add(xs, name) {
  _.each(xs, function(element){ element.className += ' ' + name })
  return xs }


///// Function classes_remove
// Removes a class from the `element'.
//
// classes_remove! :: element:[Element]*, String -> element
function classes_remove(xs, name) {
  var re = make_class_re(name)
  _.each(xs, function(element){ element.className = element.className.replace(re, '') })
  return xs }


///// Function classes_has_p
// Does the `element' has the given class?
//
// classes_has_p :: [Element], String -> [Bool]
function classes_has_p(xs, name) {
  return _.map(xs, function(element){ return element.className.test(make_class_re(name)) })}


///// Function classes_toggle
// Toggles a class on the `element'. Such that it'll be removed if it's
// present, or added otherwise.
//
// A state may also be explicitly given, in which case we'll take that
// state to represent the existence or not of the class.
//
// classes_toggle! :: element:[Element], String -> element
// classes_toggle! :: element:[Element], String, Boolean -> element
function classes_toggle(xs, name, state) {
  var has_p = state == null?  classes_has_p : _.k(state)
  _.each(xs, function(element){ return has_p(element, name)?  classes_remove(element, name)
                              :        /* otherwise */        classes_add(element, name) })}



//// - Exports ----------------------------------------------------------------
module.exports = { style          : style
                 , style_set      : style_set
                 , classes        : classes
                 , classes_add    : classes_add
                 , classes_remove : classes_remove
                 , classes_has_p  : classes_has_p
                 , classes_toggle : classes_toggle

                 , internal  : { style_computed: style_computed }
                 }
});

require.define("/moros.js", function (require, module, exports, __dirname, __filename) {
    /// moros.js --- A minimal and modular DOOM library
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

var slice = [].slice
var keys  = Object.keys

function extend(target, source) {
  keys(source).forEach(function(key){ target[key] = source[key] })
  return target }

function merge() {
  return slice.call(arguments)
              .reduce(function(result, source) { return extend(result, source) }, {})}


module.exports = function(engine) {
  return merge( require('./query')(engine)
              , require('./manipulation')
              , require('./reflection')
              , require('./presentation')
              )}
});
require("/moros.js");
