/// css.js --- Visual presentation handling
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

/// Module moros.css

//// - Feature testing/helpers ------------------------------------------------
var Element = document.createElement('div')

var style_computed = 'currentStyle' in Element?
           /* IE? */ function _style_computed(element) {
                       return element.currentStyle }
                   :
          /* W3C? */ function _style_computed(element, state) {
                       return element.ownerDocument
                                       .defaultView
                                         .getComputedStyle(element, state) }



//// - Core visual presentation -----------------------------------------------

// :TODO:
//   Needs some interesting and efficient way of handling property
//   transformations before setting the values.
function style(element, property, computed) {
  return computed?        style_computed(element)[property]
  :      /* otherwise */  element.style[property] }


style.set = style_set
function style_set(element, property, value) {
  element.style[property] = value
  return element }


function classes(element) {
  return element.className.trim().split(/\s+/) }


classes.add = classes_add
function classes_add(element, class_name) {
  element.className += ' ' + class_name
  return element }


classes.remove = classes_remove
function classes_remove(element, name) {
  var re = make_class_re(name)
  element.className = element.className.replace(re, '')
  return element }


classes.has_p = classes_has_p
function classes_has_p(element, name) {
  return element.className.test(make_class_re(name)) }


classes.toggle = classes_toggle
function classes_toggle(element, name) {
  return classes_has_p(element, name)?  classes_remove(element, name)
  :      /* otherwise */                classes_add(element, name) }



//// - Higher-level visual actions --------------------------------------------
function show(element) {
  style_set(element, 'display', 'block')
  return element }

function hide(element) {
  style_set(element, 'display', 'none')
  return element }

function visible_p(element) {
  var style = style_computed(element)
  return style['display'] != 'none' }
  

function toggle(element) {
  return visible_p(element)?  hide(element)
  :      /* otherwise */      show(element) }



//// - Exports ----------------------------------------------------------------
module.exports = { style     : style
                 , classes   : classes
                 , show      : show
                 , hide      : hide
                 , visible_p : visible_p
                 , toggle    : toggle
                   
                 , internal  : { style_computed: style_computed }
                 }