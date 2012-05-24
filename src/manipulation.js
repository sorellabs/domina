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