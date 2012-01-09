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
  return node.getAttribute(key) }


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
  return element[TEXT] }


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


///// Function value
// Returns the `value` of a form input.
//
// value :: MultipleSelect -> [String]
// value :: Element -> Maybe String
function value(node) {
  // :TODO: values for each kind of input
  //   Different kinds of inputs treat `value` differently. We should
  //   account for that.
  return node.getAttribute('value') }


///// Function value_set
// Changes the `value` of a form input.
//
// value_set! :: element:MultipleSelect*, value:[String] -> element
// value_set! :: element:Element*, value:String -> element
function value_set(node, value) {
  node.setAttribute('value', value)
  return node }



//// - Exports ----------------------------------------------------------------
module.exports = { attributes    : attributes
                 , attribute     : attribute
                 , attribute_set : attribute_set
                 , text          : text
                 , text_set      : text_set
                 , html          : html
                 , html_set      : html_set
                 , value         : value
                 , value_set     : value_set

                 , internal      : { TEXT: TEXT }
                 }