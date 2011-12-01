/// moros/nodelist.js --- Batch transformations/mappings for NodeLists
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


/// Module moros.nodelist
void function (root, require_p, exports_p) {

  var element = require_p?  require('./element') : root.moros.element
  

  function map(nodes, mapper) { var i, len, result
    result = []
    for (i = 0, len = nodes.length; i < len; ++i)
      result.push(mapper(nodes[i], i, nodes))
    return result }


  function each(nodes, iterator) { var i
    i = nodes.length
    while (i--)
      iterator(nodes[i], i, nodes) }
    

  function text(nodes) {
    return map(nodes, element.text) }

  function text_set(nodes, value) {
    each(nodes, function(node) {
                  element.text_set(node, value) })
    return nodes }

  function html(nodes) {
    return map(nodes, element.html) }

  function html_set(nodes, value) {
    each(nodes, function(node) {
                  element.html_set(node, value) })
    return nodes }

  function attr(nodes, key) {
    return map(nodes, function(node) {
                        return element.attr(node, key) })}

  function attr_set(nodes, key, value) {
    each(nodes, function(node) {
                  element.attr_set(node, key, value) })
    return nodes }

  function data(nodes, key) {
    return map(nodes, function(node){
                        return element.attr(node, key) })}

  function data_set(nodes, key, value) {
    each(nodes, function(node) {
                  element.attr_set(node, key, value) })
    return nodes }


  function detach(nodes) {
    each(nodes, element.detach)
    return nodes }

  function insert_before(node, inserts) {
    each(inserts, function(insert) {
                    element.insert_before(node, insert) })
    return node }

  function insert_after(node, inserts) {
    each(inserts, function(insert) {
                    element.insert_after(node, insert) })
    return node }

  function append(parent, children) {
    each(children, function(child) {
                     element.append(parent, child) })
    return parent }

  function prepend(parent, children) {
    each(children, function(child) {
                     element.prepend(parent, child) })
    return parent }

  function replace(node, replacements) {
    insert_before(node, replacements)
    return element.detach(node) }

  function clone(nodes, deep) {
    return map(nodes, function(node){
                        return element.clone(node, deep) })}
  

  //// -Exports
  var nodelist
  if (exports_p)  nodelist = exports
  else            nodelist = moros.nodelist || (moros.nodelist = {})
  
// --
}
( this
, typeof require == 'function'
, typeof exports != 'undefined'
)
// -- moros/nodelist.js ends here --