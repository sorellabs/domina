/// moros/element.js --- Functional DOOM API for Elements
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

/// Module moros.element
void function(root, require_p, exports_p) {

  //// -Feature testing
  var TEXT_PROPERTY
  void function () {
    var Element = document.createElement('div')

    // Check what kind of plain text representation of an Element is
    // supported by the platform. ``innerText`` is the de-facto standard,
    // and implemented everywhere. Mozilla still goes *only* for the
    // de-juri ``textContent``.
    TEXT_PROPERTY = 'innerText' in Element?  'innerText'
    : /* likely Gecko-based browsers */      'textContent'
  }()


  //// -DOM representation and meta handling
  function text(element) {
    return element[TEXT_PROPERTY] }

  function text_set(element, value) {
    element[TEXT_PROPERTY] = value
    return element }

  function html(element) {
    return element.innerHTML }

  function html_set(element, value) {
    element.innerHTML = value
    return element }

  function attr(element, key) {
    return element.getAttribute(key) }

  function attr_set(element, key, value) {
    element.setAttribute(key, value)
    return element }

  function data(element, key) {
    return attr(element, 'data-' + key) }

  function data_set(element, key, value) {
    return attr_set(element, 'data-' + key, value) }


  //// -DOM tree manipulation
  function detach(element) {
    element.parentNode.removeChild(element)
    return element }

  function insert_before(element, insert) {
    element.parentNode.insertBefore(insert, element)
    return element }

  function insert_after(element, insert) {
    element.parentNode.insertBefore(insert, element.nextSibling)
    return element }

  function append(parent, element) {
    parent.appendChild(element)
    return parent }

  function prepend(parent, element) {
    return insert_before(parent.firstChild, element) }

  function replace(element, replacement) {
    element.parentNode.replaceChild(element, replacement)
    return element }

  function clone(element, deep) {
    return element.cloneNode(deep) }


  //// -General Attributes
  // TODO: class, id

  //// -CSS primitives
  // TODO: style, computed style

  //// -Layout
  // TODO: dimensions, offset, scroll

  //// -Form data
  // TODO: value


  //// -Exports
  var element = exports_p?  element = exports
  : /* no modules? */       element = root.moros.element || (root.moros.element = {})

  element.text          = text
  element.text_set      = text_set
  element.html          = html
  element.html_set      = html_set
  element.attr          = attr
  element.attr_set      = attr_set
  element.data          = data
  element.data_set      = data_set
  element.detach        = detach
  element.insert_before = insert_before
  element.insert_after  = insert_after
  element.append        = append
  element.prepend       = prepend
  element.replace       = replace
  element.clone         = clone

  element.internal      = { TEXT_PROPERTY: TEXT_PROPERTY }


// --
}
( this
, typeof require == 'function'
, typeof exports != 'undefined'
)
// -- moros/element.js ends here --