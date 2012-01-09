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
  return insert_before(parent.firstChild, node) }

//// Function insert_before
// insert_before! :: node:Node*, Node* -> node
function insert_before(node, insert) {
  node.parentNode.insertBefore(insert, node)
  return element }

//// Function insert_after
// insert_after! :: node:Node*, Node* -> node
function insert_after(node, insert) {
  node.parentNode.insertBefore(insert, node.nextSibling)
  return element }

//// Function remove
// remove! :: parent:Node*, Node* -> Node
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

//// Function clear
// clear! :: node:Node* -> node
function clear(node) {
  while (node.firstChild)
    node.removeChild(node.firstChild)
  return node }

//// Function clone
// clone! :: node:Node, deep:Bool? -> node
function clone(node) {
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
                 , clone         : clone
                 }