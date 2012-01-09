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

/// Module moros.presentation.core

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
  return new RegExp('\\b' + name.replace(/(\W)/g, '\\$1') + '\\b', 'gi') }


//// - Core visual presentation -----------------------------------------------

///// Function style
// Retrieves the value of the given style's `property', optionally
// forcing them to be computed to reflect the current state of the
// node.
//
// style :: Element, String, Bool? -> String
function style(element, property, computed) {
  // :TODO:
  //   Needs some interesting and efficient way of handling property
  //   transformations before setting the values.
  return computed?        style_computed(element)[property]
  :      /* otherwise */  element.style[property] }


///// Function style_set
// Changes the value of the given style's `property' for the `element'.
//
// Since this property is defined at the element's level, it'll take
// precedence over properties defined directly in the CSS (unless
// they're marked as `!important`).
//
// style_set! :: Element, String, Bool? -> String
function style_set(element, property, value) {
  element.style[property] = value
  return element }


///// Function classes
// Returns a list of all the classes defined for the `element'.
//
// classes :: Element -> [String]
function classes(element) {
  return element.className.trim().split(/\s+/) }


///// Function classes_add
// Adds a class to the `element'.
//
// classes_add! :: element:Element*, String -> element
function classes_add(element, name) {
  element.className += ' ' + name
  return element }


///// Function classes_remove
// Removes a class from the `element'.
//
// classes_remove! :: element:Element*, String -> element
function classes_remove(element, name) {
  var re = make_class_re(name)
  element.className = element.className.replace(re, '')
  return element }


///// Function classes_has_p
// Does the `element' has the given class?
//
// classes_has_p :: Element, String -> Bool
function classes_has_p(element, name) {
  return element.className.test(make_class_re(name)) }


///// Function classes_toggle
// Toggles a class on the `element'. Such that it'll be removed if it's
// present, or added otherwise.
//
// classes_toggle! :: element:Element, String -> element
function classes_toggle(element, name) {
  return classes_has_p(element, name)?  classes_remove(element, name)
  :      /* otherwise */                classes_add(element, name) }



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