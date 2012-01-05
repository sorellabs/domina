/// introspection.js --- Provides information about nodes.
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

/// Module moros.introspection


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
function attributes(node) {
  return slice.call(node.attributes) }

function attribute(node, key) {
  return node.getAttribute(key) }

function attribute_set(node, key, value) {
  value == null?     node.removeAttribute(key)
  : /* otherwise */  node.setAttribute(key, value)

  return node }

function text(node) {
  return element[TEXT] }

function text_set(node, value) {
  node[TEXT] = value
  return node }

function html(node) {
  return node.innerHTML }

function html_set(node) {
  node.innerHTML = value
  return node }

function value(node) {
  return node.getAttribute('value')
}

function value_set(node, value) {
  node.setAttribute('value', value)
  return node
}



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