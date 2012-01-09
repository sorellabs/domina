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

///// Function element_p
// Checks if the `subject' is an `Element`.
//
// element_p :: Any -> Bool
function element_p(subject) {
  return 'nodeType' in Object(subject)
  &&     subject.nodeType == Node.ELEMENT_NODE }


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
    value = source[key]
    if (callable_p(value))  target[key] = value()
    else                    target[key] = value })
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
  return element_p(subject)?   subject
  :   /* String-y? */          text(subject) }


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

                 , internals    : { element_p:       element_p
                                  , sequence_p:      sequence_p
                                  , callable_p:      callable_p
                                  , obj_p:           obj_p
                                  , set_props:       set_props
                                  , append_children: append_children }
                 }
