## Module manipulation #################################################
#
# Manipulates DOOM trees.
#
# 
# Copyright (c) 2013 Quildreen "Sorella" Motta <quildreen@gmail.com>
# 
# Permission is hereby granted, free of charge, to any person
# obtaining a copy of this software and associated documentation files
# (the "Software"), to deal in the Software without restriction,
# including without limitation the rights to use, copy, modify, merge,
# publish, distribute, sublicense, and/or sell copies of the Software,
# and to permit persons to whom the Software is furnished to do so,
# subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


### -- Dependencies ----------------------------------------------------
{map, each, head, tail, as-collection} = require './collection'



### -- Core implementation ---------------------------------------------

#### λ append
# Adds one or more nodes as a the last children of a parent node.
#
# :: Node* -> xs:[Node*] -> xs
append = (parent, xs) --> xs |> each ->
  parent.append-child it


#### λ prepend
# Adds one or more nodes as the first children of a parent node.
#
# :: Node* -> xs:[Node*] -> xs
prepend = (parent, xs) --> xs |> each ->
  | parent.first-child =>  insert-before parent.first-child, it
  | otherwise          =>  parent.append-child it


#### λ insert-before
# Adds one or more nodes before another node, at the same level in the
# tree.
#
# :: Node* -> xs:[Node*] -> xs
insert-before = (x, xs) --> xs |> each ->
  x.parent-node.insert-before it, x


#### λ insert-after
# Adds one or more nodes after another node, at the same level in the
# tree.
#
# :: Node* -> xs:[Node*] -> xs
insert-after = (x, xs) --> xs |> each ->
  x.parent-node.insert-before it, x.next-sibling


#### λ remove
# Removes one or more nodes that are direct descendants of the given
# parent.
#
# :: Node* -> xs:[Node*] -> xs
remove = (parent, xs) --> xs |> each ->
  parent.remove-child it


#### λ detach
# Removes one or more nodes from the DOOM tree.
#
# :: xs:[Node*] -> xs
detach = each -> it.parent-node.remove-child it


#### λ replace
# Replaces a node by one or more nodes, at the same level in the tree.
#
# :: Node* -> xs:[Node*] -> xs
replace = (node, xs) -->
  xs = as-collection xs
  node.parent-node.replace-child (head xs), node
  insert-after (head xs), (tail xs)
  xs


#### λ wrap
# Wraps the given node in another, such that the new node will occupy
# the original node's place in the tree, and the original node will be a
# child of the new node.
#
# :: Node* -> x:Node* -> x
wrap = (node, x) -->
  insert-before node, x
  x.append-child node


#### λ clear
# Removes all direct children of the given nodes.
#
# :: xs:[Node*] -> xs
clear = each !->
  while it.first-child
    it.remove-child it.first-child


#### λ shallow-clone
# Creates a shallow clone of the given nodes.
#
# Only attributes and their values will be cloned, **event listeners
# won't be copied**. This will also only clone the Node itself, if also
# need the node's children, you should use `deep-clone`.
#
# The returned clones will be off-DOOM, so you'll need to re-attach them
# if you want them query-able by a selector engine, or to be rendered on
# the screen.
#
# :: [Node] -> [Node]
shallow-clone = (xs) --> xs |> map -> it.clone-node false


#### λ clone
# Creates a deep clone of the given nodes.
#
# Only attributes and their values will be cloned, **event listeners
# won't be copied**. This will clone the node and all its children. If
# you don't care about the node's children, you can use `clone`, which
# is faster.
#
# The returned clones will be off-DOOM, so you'll need to re-attach them
# if you want them query-able by a selector engine, or to be rendered on
# the screen.
#
# :: [Node] -> [Node]
clone = (xs) --> xs |> map -> it.clone-node true



### -- Exports ---------------------------------------------------------
module.exports = {
  append
  prepend
  insert-before
  insert-after
  remove
  detach
  replace
  clear
  wrap
  clone
  shallow-clone
}
